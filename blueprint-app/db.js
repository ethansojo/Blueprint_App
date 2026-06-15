/* db.js — the ONLY place that touches the database.
   ─────────────────────────────────────────────────────────────────────────
   Every other file calls these functions; no raw SQL lives anywhere else.
   This keeps a future Postgres switch to a single-file change.

   Tables
     submissions(id, project_id, customer_name, contact_email, status,
       complexity_grade, flag_count, created_at, updated_at, full_payload)
     flags(id, project_id, field_id, field_label, section, product_index,
       value, note, flagged_by, created_at)
*/
'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// SQLite file lives in ./data so a Railway Volume mounted at /app/data persists it.
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'projects.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id       TEXT UNIQUE NOT NULL,
    customer_name    TEXT,
    contact_email    TEXT,
    status           TEXT NOT NULL DEFAULT 'Submitted',
    complexity_grade TEXT,
    flag_count       INTEGER NOT NULL DEFAULT 0,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL,
    full_payload     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS flags (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id    TEXT NOT NULL,
    field_id      TEXT,
    field_label   TEXT,
    section       TEXT,
    product_index INTEGER,
    value         TEXT,
    note          TEXT,
    flagged_by    TEXT,
    created_at    TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_flags_project ON flags(project_id);
`);

const VALID_STATUSES = ['Draft', 'Submitted', 'In Review', 'Complete'];

/* ── prepared statements ── */
const stmt = {
  upsertSubmission: db.prepare(`
    INSERT INTO submissions
      (project_id, customer_name, contact_email, status, complexity_grade,
       flag_count, created_at, updated_at, full_payload)
    VALUES
      (@project_id, @customer_name, @contact_email, @status, @complexity_grade,
       @flag_count, @now, @now, @full_payload)
    ON CONFLICT(project_id) DO UPDATE SET
      customer_name    = excluded.customer_name,
      contact_email    = excluded.contact_email,
      complexity_grade = excluded.complexity_grade,
      flag_count       = excluded.flag_count,
      updated_at       = excluded.updated_at,
      full_payload     = excluded.full_payload
  `),
  deleteFlags: db.prepare(`DELETE FROM flags WHERE project_id = ?`),
  insertFlag: db.prepare(`
    INSERT INTO flags
      (project_id, field_id, field_label, section, product_index, value, note, flagged_by, created_at)
    VALUES
      (@project_id, @field_id, @field_label, @section, @product_index, @value, @note, @flagged_by, @now)
  `),
  listSubmissions: db.prepare(`SELECT * FROM submissions ORDER BY datetime(updated_at) DESC`),
  getSubmission: db.prepare(`SELECT * FROM submissions WHERE project_id = ?`),
  getFlags: db.prepare(`SELECT * FROM flags WHERE project_id = ? ORDER BY id`),
  updateStatus: db.prepare(`UPDATE submissions SET status = @status, updated_at = @now WHERE project_id = @project_id`),
};

/* ── helpers ── */
const nowISO = () => new Date().toISOString();

// Rank the per-product complexity bands into one project-level grade.
function rollupGrade(payload) {
  const order = { High: 3, Moderate: 2, Low: 1 };
  let best = null;
  (payload.products || []).forEach(p => {
    const band = p.complexity && p.complexity.band;
    if (band && (!best || order[band] > order[best])) best = band;
  });
  return best || 'Low';
}

// Build the flag rows for a submission from its payload:
//   • "Not sure" fields (customer asked us to review)        → flagged_by 'customer'
//   • Custom-entered (✍) values not from a dropdown          → flagged_by 'customer'
function flagsFromPayload(payload) {
  const rows = [];
  (payload.notSureOverview || []).forEach(label => {
    rows.push({ field_id: '', field_label: label, section: 'Project Overview', product_index: null,
      value: '', note: 'Customer marked "Not sure" — review with customer', flagged_by: 'customer' });
  });
  (payload.products || []).forEach((p, pi) => {
    (p.notSureFields || []).forEach(label => {
      rows.push({ field_id: '', field_label: label, section: p.name || ('Product ' + (pi + 1)), product_index: pi,
        value: '', note: 'Customer marked "Not sure" — review with customer', flagged_by: 'customer' });
    });
    (p.customEnteredValues || []).forEach(c => {
      rows.push({ field_id: '', field_label: c.field, section: p.name || ('Product ' + (pi + 1)), product_index: pi,
        value: c.value, note: 'Customer entered their own value (not from a dropdown)', flagged_by: 'customer' });
    });
  });
  return rows;
}

/* ── public API ──────────────────────────────────────────────────────────── */

// Persist a submission + its derived flags atomically. Returns the project_id.
const saveSubmission = db.transaction((payload) => {
  const now = nowISO();
  const project_id = String(payload.projectId || ('PRJ-' + Math.random().toString(36).slice(2, 8).toUpperCase()));
  const overview = payload.overview || {};
  const derivedFlags = flagsFromPayload(payload);

  stmt.upsertSubmission.run({
    project_id,
    customer_name: overview.customerName || '',
    contact_email: overview.contactEmail || '',
    status: 'Submitted',
    complexity_grade: rollupGrade(payload),
    flag_count: derivedFlags.length,
    now,
    full_payload: JSON.stringify(payload),
  });

  // Replace customer-derived flags on resubmit; keep any admin-added ones.
  db.prepare(`DELETE FROM flags WHERE project_id = ? AND flagged_by = 'customer'`).run(project_id);
  derivedFlags.forEach(f => stmt.insertFlag.run({ project_id, now, ...f }));

  return project_id;
});

// Display name for the dashboard = the product name(s) from the payload.
function displayName(row) {
  try {
    const p = JSON.parse(row.full_payload);
    const names = (p.products || []).map(x => x.name).filter(Boolean);
    if (names.length) return names.join(', ');
  } catch (e) { /* ignore */ }
  return row.project_id;
}

function listProjects() {
  return stmt.listSubmissions.all().map(r => ({
    project_id: r.project_id,
    project_name: displayName(r),
    customer_name: r.customer_name,
    contact_email: r.contact_email,
    status: r.status,
    complexity_grade: r.complexity_grade,
    flag_count: r.flag_count,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

function getProject(project_id) {
  const row = stmt.getSubmission.get(project_id);
  if (!row) return null;
  let payload = null;
  try { payload = JSON.parse(row.full_payload); } catch (e) { payload = null; }
  return {
    project_id: row.project_id,
    project_name: displayName(row),
    customer_name: row.customer_name,
    contact_email: row.contact_email,
    status: row.status,
    complexity_grade: row.complexity_grade,
    flag_count: row.flag_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
    payload,
    flags: getFlags(project_id),
  };
}

function updateStatus(project_id, status) {
  if (!VALID_STATUSES.includes(status)) throw new Error('Invalid status: ' + status);
  const res = stmt.updateStatus.run({ project_id, status, now: nowISO() });
  return res.changes > 0;
}

// Add a single flag (used for admin-added notes). Customer flags come via saveSubmission.
function saveFlag(flag) {
  stmt.insertFlag.run({
    project_id: flag.project_id,
    field_id: flag.field_id || '',
    field_label: flag.field_label || '',
    section: flag.section || '',
    product_index: flag.product_index == null ? null : flag.product_index,
    value: flag.value || '',
    note: flag.note || '',
    flagged_by: flag.flagged_by || 'admin',
    now: nowISO(),
  });
}

function getFlags(project_id) {
  return stmt.getFlags.all(project_id);
}

module.exports = {
  saveSubmission,
  listProjects,
  getProject,
  updateStatus,
  saveFlag,
  getFlags,
  VALID_STATUSES,
};
