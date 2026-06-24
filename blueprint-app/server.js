/* server.js — Blueprint web app (Express + SQLite).
   ─────────────────────────────────────────────────────────────────────────
   Serves the existing HTML and accepts intake-form submissions.

   There is NO login anywhere. The only public path is the customer intake
   form. Everything internal (the dashboard, its data API, the full app, the
   slide deck) lives under ONE unlisted base path — /projects-<random-slug> —
   and the unlisted URL is the only barrier. The slug is generated once,
   persisted on the data volume, and printed to the boot logs.

   Public routes
     /              → redirect to /intake
     /intake        → customer intake form (form-only, self-contained)
     POST /api/submissions          → the form submits here
   Unlisted base = /projects-<slug>  (printed in the boot logs)
     <base>                         → dashboard of all submissions
     <base>/p/:id                   → submission detail
     <base>/app, <base>/app/        → full Blueprint app
     <base>/presentation            → standalone slide deck
     <base>/source-map              → redirect into the app's Source Map view
     <base>/decision-tree           → redirect into the app's Decision Tree view
     GET   <base>/api/projects
     GET   <base>/api/projects/:id
     PATCH <base>/api/projects/:id/status
     POST  <base>/api/projects/:id/flags
*/
'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const db = require('./db');

const app = express();
app.set('strict routing', true);                  // so '/app' and '/app/' are distinct routes
const PORT = process.env.PORT || 3000;            // Railway sets PORT — never hardcode.

app.use(express.json({ limit: '2mb' }));

const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const APP_FILES = { 'data.js': 1, 'fields-data.js': 1, 'intake-data.js': 1, 'validation.js': 1, 'flags.js': 1 };

/* ── access model ───────────────────────────────────────────────────────────
   Internal team test domain: the project dashboard is the LANDING PAGE and
   every module is reachable from it at a clean path. No login.
   NOTE: this exposes all internal data to anyone with the domain — intended
   for a shared team test site. To lock it down later, reintroduce a gate.   */
const DASH = '';                                  // internal routes live at the site root
const HOME = '/';                                 // canonical dashboard URL for links

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ════════════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ════════════════════════════════════════════════════════════════════════ */

// Customer intake form — public, linked from the dashboard. Self-contained.
app.get('/intake', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'intake.html')));

// The intake form fetches its field definitions from this single source of truth.
app.get('/intake-data.js', (req, res) => res.sendFile(path.join(__dirname, 'intake-data.js')));

// The form POSTs its full payload here.
app.post('/api/submissions', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  try {
    const project_id = db.saveSubmission(payload);
    res.json({ ok: true, project_id });
  } catch (err) {
    console.error('saveSubmission failed:', err);
    res.status(500).json({ ok: false, error: 'Could not save submission' });
  }
});

// The form writes a single flag here live (Part C — flag popover / Not-sure /
// custom value). Public, same trust model as the form itself.
app.post('/api/submissions/:id/flags', (req, res) => {
  try {
    db.saveFormFlag({ ...(req.body || {}), project_id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error('saveFormFlag failed:', err);
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Remove a live form flag (Not-sure cancelled / unchecked). Public, like the form.
app.post('/api/submissions/:id/flags/remove', (req, res) => {
  try {
    db.removeFormFlag({ ...(req.body || {}), project_id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

/* ════════════════════════════════════════════════════════════════════════
   INTERNAL VIEWS  (no login — reachable only via the unlisted base path)
   ════════════════════════════════════════════════════════════════════════ */

// Full Blueprint app (served from source so no build step is needed at runtime).
app.get(DASH + '/app', (req, res) => {
  const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  res.redirect(DASH + '/app/' + qs);                // trailing slash → relative asset URLs resolve under .../app/
});
app.get(DASH + '/app/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get(DASH + '/app/:file', (req, res, next) => {
  if (!APP_FILES[req.params.file]) return next();
  res.sendFile(path.join(__dirname, req.params.file));
});

app.get(DASH + '/presentation', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'presentation.html')));

// Legacy routes now point at the app's current, newer views.
app.get(DASH + '/source-map', (req, res) => res.redirect(DASH + '/app/?view=map'));
app.get(DASH + '/decision-tree', (req, res) => res.redirect(DASH + '/app/?view=tree'));

/* ════════════════════════════════════════════════════════════════════════
   PROJECT DATA API  (under the unlisted base — no login)
   ════════════════════════════════════════════════════════════════════════ */
app.get(DASH + '/api/projects', (req, res) => res.json(db.listProjects()));

app.get(DASH + '/api/projects/:id', (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json(p);
});

app.patch(DASH + '/api/projects/:id/status', (req, res) => {
  try {
    const ok = db.updateStatus(req.params.id, (req.body || {}).status);
    if (!ok) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.post(DASH + '/api/projects/:id/flags', (req, res) => {
  try {
    db.saveFlag({ ...(req.body || {}), project_id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Flag review: add/edit the reviewer's internal note (or the customer note), or clear.
app.patch(DASH + '/api/flags/:flagId', (req, res) => {
  try {
    const b = req.body || {};
    const ok = b.internal_note !== undefined
      ? db.updateInternalNote(req.params.flagId, b.internal_note)
      : db.updateFlagNote(req.params.flagId, b.note);
    if (!ok) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});
app.delete(DASH + '/api/flags/:flagId', (req, res) => {
  const ok = db.clearFlag(req.params.flagId);
  if (!ok) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true });
});

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD  (server-rendered — reachable only at the unlisted base)
   Active (default) and Archive (Setup Complete) over the same data.
   ════════════════════════════════════════════════════════════════════════ */
app.get('/', (req, res) => {
  res.type('html').send(renderProjectsPage(db.listActive(), 'active'));
});

app.get(DASH + '/archive', (req, res) => {
  res.type('html').send(renderProjectsPage(db.listCompleted(), 'archive'));
});

app.get(DASH + '/p/:id', (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).type('html').send(shell('Not found', '<div class="wrap"><p>No project <code>' + esc(req.params.id) + '</code>. <a href="' + HOME + '">← Back</a></p></div>'));
  res.type('html').send(renderDetail(p));
});

app.get(DASH + '/review/:id', (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).type('html').send(shell('Not found', '<div class="wrap"><p>No project <code>' + esc(req.params.id) + '</code>. <a href="' + HOME + '">← Back</a></p></div>'));
  res.type('html').send(renderFlagReview(p));
});

app.listen(PORT, () => {
  const line = '═'.repeat(64);
  console.log(line);
  console.log(`Blueprint web app listening on port ${PORT}`);
  console.log(`Team dashboard (landing): /`);
  console.log(`Customer intake form:     /intake`);
  console.log(line);
});

/* ════════════════════════════════════════════════════════════════════════
   HTML rendering helpers
   ════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  :root { --bg:#050507; --surface:#0C0C10; --border:#1E1E26; --text:#E8E8F0;
    --muted:#9A9AB0; --dim:#6A6A7A; --accent:#FFE066; --c-bp:#5A9CD8; --c-flag:#FF9040;
    --c-new:#4ADA8A; --c-high:#E07A7A; --c-mod:#E8C840; --c-low:#4ADA8A; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--bg); color:var(--text); font-family:'Manrope',system-ui,sans-serif; font-size:14px; line-height:1.6; }
  a { color:var(--c-bp); text-decoration:none; } a:hover { text-decoration:underline; }
  .topbar { position:sticky; top:0; z-index:10; background:rgba(5,5,7,0.96); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border); padding:14px 28px; display:flex; align-items:center; gap:14px; }
  .logo { width:34px; height:34px; border-radius:8px; border:1.5px solid var(--c-bp); color:var(--c-bp);
    background:rgba(90,156,216,0.08); font-weight:800; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; }
  .topbar h1 { font-size:16px; font-weight:800; }
  .topbar .sub { font-size:12px; color:var(--muted); }
  .topbar .links { margin-left:auto; display:flex; gap:14px; font-size:12.5px; font-weight:700; }
  .wrap { max-width:1180px; margin:0 auto; padding:22px 28px 60px; }
  .controls { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:16px; align-items:center; }
  .controls input, .controls select { background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:8px;
    padding:9px 11px; color:var(--text); font-family:inherit; font-size:13px; }
  .controls input { flex:1; min-width:200px; }
  .controls input:focus, .controls select:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(255,224,102,0.12); }
  table { width:100%; border-collapse:collapse; }
  th, td { text-align:left; padding:11px 12px; border-bottom:1px solid var(--border); font-size:13px; vertical-align:middle; }
  th { font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); cursor:pointer; user-select:none; }
  th:hover { color:var(--text); }
  tbody tr:hover { background:rgba(255,255,255,0.02); }
  td a { font-weight:700; }
  .badge { display:inline-block; padding:2px 9px; border-radius:11px; font-size:11px; font-weight:800; }
  .g-High { color:var(--c-high); background:rgba(224,122,122,0.12); }
  .g-Moderate { color:var(--c-mod); background:rgba(232,200,64,0.12); }
  .g-Low { color:var(--c-low); background:rgba(74,218,138,0.12); }
  .flags { font-weight:800; color:var(--c-flag); }
  .flags.zero { color:var(--dim); }
  .statussel { background:#2A2D33; border:1px solid #3A3D44; border-radius:7px; padding:5px 8px; color:#F2F3F5; font-family:inherit; font-size:12px; font-weight:700; cursor:pointer; }
  .statussel:hover { border-color:#52565F; }
  .statussel option { background:#2A2D33; color:#F2F3F5; }
  .moveactive { background:rgba(74,218,138,0.12); border:1px solid rgba(74,218,138,0.45); color:#4ADA8A; border-radius:7px; padding:5px 9px; font-family:inherit; font-size:11.5px; font-weight:700; cursor:pointer; margin-left:6px; white-space:nowrap; }
  .moveactive:hover { background:rgba(74,218,138,0.2); }
  .empty { color:var(--muted); text-align:center; padding:48px 0; }
  .meta { display:flex; flex-wrap:wrap; gap:18px; margin:6px 0 22px; font-size:13px; color:var(--muted); }
  .meta b { color:var(--text); }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px 20px; margin-bottom:16px; }
  .card h3 { font-size:13px; text-transform:uppercase; letter-spacing:0.05em; color:var(--c-bp); margin-bottom:12px; }
  .kv { display:grid; grid-template-columns:minmax(180px,260px) 1fr; gap:4px 18px; font-size:13px; }
  .kv .k { color:var(--muted); } .kv .v { color:var(--text); }
  .flagrow { border:1px solid rgba(255,144,64,0.3); background:rgba(255,144,64,0.05); border-radius:9px; padding:10px 13px; margin-bottom:9px; }
  .flagrow .fl-label { font-weight:800; color:var(--c-flag); }
  .flagrow .fl-meta { font-size:11.5px; color:var(--muted); margin-top:2px; }
  .fl-note { font-size:12.5px; margin-top:5px; color:var(--text); }
  .fl-note b { color:var(--c-flag); font-weight:800; }
  .fl-note.fl-internal { color:#cfe0f5; } .fl-note.fl-internal b { color:var(--c-bp); }
  .ns-badge, .fr-ns { display:inline-block; padding:1px 8px; border-radius:11px; font-size:11px; font-weight:800; color:#E8A33D; background:rgba(217,119,6,0.16); }
  .map-table td, .map-table th { font-size:12.5px; }
  .map-arrow { color:var(--dim); }
  code { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--accent); }
  .tabs { display:flex; gap:8px; margin-bottom:16px; }
  .tab { padding:7px 15px; border-radius:8px; border:1px solid var(--border); color:var(--muted); font-weight:700; font-size:13px; cursor:pointer; }
  .tab:hover { color:var(--text); text-decoration:none; }
  .tab.active { background:rgba(255,224,102,0.1); color:var(--accent); border-color:var(--accent); }
  .fr-group { margin-bottom:22px; }
  .fr-group > h2 { font-size:15px; font-weight:800; margin-bottom:8px; }
  .fr-sec { font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--c-bp); margin:12px 0 6px; }
  .fr-card { border:1px solid rgba(255,144,64,0.3); background:rgba(255,144,64,0.05); border-radius:9px; padding:12px 14px; margin-bottom:10px; }
  .fr-card .fr-field { font-weight:800; color:var(--c-flag); }
  .fr-card .fr-val { color:var(--text); }
  .fr-card .fr-meta { font-size:11px; color:var(--muted); margin:3px 0 8px; }
  .fr-lbl { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; }
  .fr-custnote { font-size:12.5px; color:var(--text); background:rgba(255,144,64,0.06); border-left:2px solid var(--c-flag); border-radius:0 6px 6px 0; padding:7px 10px; margin-bottom:8px; }
  .fr-custnote .fr-lbl { color:var(--c-flag); margin-right:4px; }
  .fr-empty { color:var(--dim); font-style:italic; font-weight:400; }
  .fr-intlbl { display:block; color:var(--c-bp); margin-bottom:4px; }
  .fr-note { width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:7px; padding:8px 10px; color:var(--text); font-family:inherit; font-size:12.5px; resize:vertical; min-height:46px; }
  .fr-actions { margin-top:7px; display:flex; gap:8px; }
  .fr-actions button { border:none; border-radius:7px; padding:6px 12px; font-family:inherit; font-size:12px; font-weight:700; cursor:pointer; }
  .fr-save { background:var(--accent); color:#1A1500; }
  .fr-clear { background:transparent; border:1px solid rgba(224,122,122,0.5); color:#E07A7A; }
`;

function shell(title, body, extraHead) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"/>
<style>${STYLES}</style>${extraHead || ''}</head><body>
<div class="topbar"><div class="logo">S</div><div><h1>Sojo Industries · Blueprint</h1>
<div class="sub">Project intake tracking</div></div>
<div class="links"><a href="${HOME}">Active</a><a href="${DASH}/archive">Archive</a><a href="/intake" target="_blank">Intake form ↗</a><a href="${DASH}/app/" target="_blank">Blueprint app ↗</a></div></div>
${body}</body></html>`;
}

// Per-status accent colors (editable config). Shown on the dark-grey control.
const STATUS_COLORS = { 'Draft': '#9AA0AA', 'Submitted': '#5A9CD8', 'In Review': '#E8C840', 'Setup Complete': '#4ADA8A' };
function statusOptions(current) {
  return db.VALID_STATUSES.map(s =>
    `<option${s === current ? ' selected' : ''} style="background:#2A2D33;color:${STATUS_COLORS[s] || '#F2F3F5'}">${s}</option>`).join('');
}

const GRADE_RANK = { High: 3, Moderate: 2, Low: 1 };

// Active and Archive share this renderer (Part A: toggle over the same data).
function renderProjectsPage(projects, mode) {
  const archive = mode === 'archive';
  const rows = projects.map(p => {
    const dataAttrs = `data-customer="${esc((p.customer_name || '').toLowerCase())}" data-name="${esc((p.project_name || '').toLowerCase())}" data-date="${esc(p.updated_at)}" data-grade="${GRADE_RANK[p.complexity_grade] || 0}"`;
    const nameCell = `<td><a href="${DASH}/p/${encodeURIComponent(p.project_id)}">${esc(p.project_name)}</a><br><code>${esc(p.project_id)}</code></td>`;
    const custCell = `<td>${esc(p.customer_name) || '<span style="color:var(--dim)">—</span>'}</td>`;
    const gradeCell = `<td><span class="badge g-${esc(p.complexity_grade)}">${esc(p.complexity_grade)}</span></td>`;
    const flagCell = `<td class="flags ${p.flag_count ? '' : 'zero'}">${p.flag_count}</td>`;
    if (archive) {
      return `<tr ${dataAttrs}>${nameCell}${custCell}
        <td>${esc((p.created_at || '').slice(0, 10))}</td>
        <td>${esc((p.updated_at || '').slice(0, 10))}</td>
        <td>${p.product_count}</td>
        <td style="white-space:nowrap"><select class="statussel" onchange="setStatus('${esc(p.project_id)}', this.value)">${statusOptions(p.status)}</select><button class="moveactive" onclick="moveActive('${esc(p.project_id)}')" title="Move back to the Active dashboard">↩ Active</button></td>
        ${gradeCell}${flagCell}</tr>`;
    }
    return `<tr ${dataAttrs}>${nameCell}${custCell}
      <td>${esc((p.updated_at || '').slice(0, 10))}</td>
      <td><select class="statussel" onchange="setStatus('${esc(p.project_id)}', this.value)">${statusOptions(p.status)}</select></td>
      ${gradeCell}${flagCell}</tr>`;
  }).join('');

  const head = archive
    ? `<th onclick="sortBy('name')">Project</th><th onclick="sortBy('customer')">Customer</th>
       <th onclick="sortBy('date')">Submitted</th><th onclick="sortBy('date')">Completed</th>
       <th>Products</th><th>Status</th><th onclick="sortBy('grade')">Complexity</th><th>Flagged</th>`
    : `<th onclick="sortBy('name')">Project</th><th onclick="sortBy('customer')">Customer</th>
       <th onclick="sortBy('date')">Updated</th><th>Status</th>
       <th onclick="sortBy('grade')">Complexity</th><th>Flagged</th>`;

  const emptyMsg = archive
    ? `No completed projects yet. Projects appear here once marked "${esc(db.COMPLETED_STATUS)}".`
    : `No active projects. Share the <a href="/intake" target="_blank">intake form</a> to get started.`;

  const body = `<div class="wrap">
    <div class="tabs">
      <a class="tab ${archive ? '' : 'active'}" href="${HOME}">Active</a>
      <a class="tab ${archive ? 'active' : ''}" href="${DASH}/archive">Archive (Completed)</a>
    </div>
    <div class="controls">
      <input id="q" placeholder="Search by project or customer…" oninput="filterRows()"/>
    </div>
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody id="rows">${rows || ''}</tbody>
    </table>
    ${projects.length ? '' : `<div class="empty">${emptyMsg}</div>`}
  </div>
  <script>
    function filterRows() {
      var q = document.getElementById('q').value.toLowerCase();
      document.querySelectorAll('#rows tr').forEach(function (tr) {
        var hit = tr.dataset.name.indexOf(q) > -1 || tr.dataset.customer.indexOf(q) > -1;
        tr.style.display = hit ? '' : 'none';
      });
    }
    var sortState = {};
    function sortBy(key) {
      var tbody = document.getElementById('rows');
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
      var asc = sortState[key] = !sortState[key];
      rows.sort(function (a, b) {
        var av = a.dataset[key] || '', bv = b.dataset[key] || '';
        if (key === 'grade') return asc ? (av - bv) : (bv - av);
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    }
    var BASE = ${JSON.stringify(DASH)};
    function setStatus(id, status) {
      fetch(BASE + '/api/projects/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status })
      }).then(function (r) { if (r.ok) location.reload(); else alert('Could not update status'); });
    }
    function moveActive(id) { setStatus(id, 'In Review'); }   // back to the Active dashboard
  </script>`;
  return shell((archive ? 'Archive' : 'Projects') + ' · Blueprint', body);
}

function renderDetail(p) {
  const overview = (p.payload && p.payload.overview) || {};
  const products = (p.payload && p.payload.products) || [];

  const prodName = pi => (pi == null) ? 'Project Overview' : ((products[pi] && products[pi].name) || ('Product ' + (pi + 1)));
  const flagsHtml = p.flags.length ? p.flags.map(f => {
    const isNs = f.value === 'NOT_SURE';
    const valTag = isNs ? ' <span class="ns-badge">🤔 Not sure</span>' : (f.value ? ' — <span style="color:var(--text)">' + esc(f.value) + '</span>' : '');
    return `<div class="flagrow">
      <div class="fl-label">${esc(f.field_label)}${valTag}</div>
      <div class="fl-meta">${esc(f.section)} · ${esc(prodName(f.product_index))} · flagged by <em>${esc(f.flagged_by)}</em></div>
      <div class="fl-note"><b>Customer note:</b> ${f.note ? esc(f.note) : '<span style="color:var(--dim)">— none provided —</span>'}</div>
      ${f.internal_note ? `<div class="fl-note fl-internal"><b>Internal note:</b> ${esc(f.internal_note)}</div>` : ''}
    </div>`;
  }).join('') : '<p style="color:var(--muted)">No flagged fields.</p>';

  const productCards = products.map((prod, pi) => {
    const answers = prod.answers || {};
    const answerRows = Object.keys(answers).map(k =>
      `<div class="k">${esc(k)}</div><div class="v">${esc(Array.isArray(answers[k]) ? answers[k].join(', ') : answers[k])}</div>`).join('');
    const mapRows = (prod.fieldMappings || []).filter(m => m.value != null && m.value !== '').map(m => `
      <tr><td>${esc(m.fieldName || m.formField)}</td><td class="map-arrow">→</td>
      <td><code>${esc(m.record)}</code> · ${esc(m.section)}</td>
      <td>${esc(Array.isArray(m.value) ? '[' + m.value.length + ' rows]' : m.value)}${m.notSure ? ' <span class="flags">🤔</span>' : ''}</td></tr>`).join('');
    const cx = prod.complexity || {};
    return `<div class="card">
      <h3>📦 ${esc(prod.name || 'Product ' + (pi + 1))} <span class="badge g-${esc(cx.band)}">${esc(cx.band)}${cx.pct != null ? ' · ' + cx.pct + '%' : ''}</span></h3>
      <div class="kv">${answerRows || '<div class="k">No answers</div><div class="v"></div>'}</div>
      <h3 style="margin-top:16px">Field → NetSuite mapping</h3>
      <table class="map-table"><thead><tr><th>Intake field</th><th></th><th>Destination</th><th>Value</th></tr></thead>
        <tbody>${mapRows || '<tr><td colspan="4" style="color:var(--muted)">No mapped values</td></tr>'}</tbody></table>
    </div>`;
  }).join('');

  const body = `<div class="wrap">
    <p><a href="${HOME}">← All projects</a></p>
    <h2 style="font-size:20px;font-weight:800;margin:10px 0 2px">${esc(p.project_name)}</h2>
    <div class="meta">
      <span>Project <b><code>${esc(p.project_id)}</code></b></span>
      <span>Customer <b>${esc(p.customer_name) || '—'}</b></span>
      <span>Contact <b>${esc(p.contact_email) || '—'}</b></span>
      <span>Submitted <b>${esc((p.created_at || '').slice(0, 16).replace('T', ' '))}</b></span>
      <span>Complexity <b class="badge g-${esc(p.complexity_grade)}">${esc(p.complexity_grade)}</b></span>
      <span>Status
        <select class="statussel" onchange="setStatus('${esc(p.project_id)}', this.value)">${statusOptions(p.status)}</select>
        ${p.status === db.COMPLETED_STATUS ? `<button class="moveactive" onclick="moveActive('${esc(p.project_id)}')" title="Move back to the Active dashboard">↩ Move to Active</button>` : ''}
      </span>
    </div>
    <div class="card"><h3>🤔 Flagged fields (${p.flags.length}) <a href="${DASH}/review/${encodeURIComponent(p.project_id)}" style="float:right;font-size:11px">Review flags →</a></h3>${flagsHtml}</div>
    <div class="card"><h3>Project Overview</h3>
      <div class="kv">${Object.keys(overview).map(k => `<div class="k">${esc(k)}</div><div class="v">${esc(overview[k])}</div>`).join('') || '<div class="k">No overview</div><div class="v"></div>'}</div>
    </div>
    ${productCards}
  </div>
  <script>
    var BASE = ${JSON.stringify(DASH)};
    function setStatus(id, status) {
      fetch(BASE + '/api/projects/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status })
      }).then(function (r) { if (r.ok) location.reload(); else alert('Could not update status'); });
    }
    function moveActive(id) { setStatus(id, 'In Review'); }
  </script>`;
  return shell(p.project_name + ' · Blueprint', body);
}

/* Flag review screen (Part D) — grouped by product → section, editable notes,
   clear-flag, JSON export. */
function renderFlagReview(p) {
  const flags = p.flags || [];
  // group: product_index (null = overview) → section → [flags]
  const groups = {};
  flags.forEach(f => {
    const pk = f.product_index == null ? 'overview' : String(f.product_index);
    const sk = f.section || '(no section)';
    (groups[pk] = groups[pk] || {});
    (groups[pk][sk] = groups[pk][sk] || []).push(f);
  });
  const products = (p.payload && p.payload.products) || [];
  const groupName = pk => pk === 'overview' ? 'Project Overview' : ('📦 ' + ((products[+pk] && products[+pk].name) || ('Product ' + (+pk + 1))));

  const orderedKeys = Object.keys(groups).sort((a, b) => (a === 'overview' ? -1 : b === 'overview' ? 1 : (+a) - (+b)));
  const groupsHtml = orderedKeys.map(pk => {
    const secs = groups[pk];
    const secHtml = Object.keys(secs).map(sk => {
      const cards = secs[sk].map(f => {
        const isNs = f.value === 'NOT_SURE';
        const valTag = isNs ? ' <span class="fr-ns">🤔 Not sure</span>' : (f.value ? ' — <span class="fr-val">' + esc(f.value) + '</span>' : '');
        return `
        <div class="fr-card" data-flag="${f.id}">
          <div class="fr-field">${esc(f.field_label)}${valTag}</div>
          <div class="fr-meta">flagged by <em>${esc(f.flagged_by)}</em> · ${esc((f.created_at || '').slice(0, 16).replace('T', ' '))}</div>
          <div class="fr-custnote"><span class="fr-lbl">Customer note:</span> ${f.note ? esc(f.note) : '<span class="fr-empty">— none provided —</span>'}</div>
          <label class="fr-lbl fr-intlbl" for="note-${f.id}">Internal note (follow-up):</label>
          <textarea class="fr-note" id="note-${f.id}" placeholder="Add a follow-up note for the team…">${esc(f.internal_note || '')}</textarea>
          <div class="fr-actions">
            <button class="fr-save" onclick="saveNote(${f.id})">Save internal note</button>
            <button class="fr-clear" onclick="clearFlag(${f.id})">Clear flag</button>
          </div>
        </div>`;
      }).join('');
      return `<div class="fr-sec">${esc(sk)}</div>${cards}`;
    }).join('');
    return `<div class="fr-group"><h2>${esc(groupName(pk))}</h2>${secHtml}</div>`;
  }).join('');

  const body = `<div class="wrap">
    <p><a href="${DASH}/p/${encodeURIComponent(p.project_id)}">← Back to ${esc(p.project_name)}</a></p>
    <h2 style="font-size:20px;font-weight:800;margin:10px 0 2px">${flags.length} field${flags.length === 1 ? '' : 's'} flagged for review</h2>
    <div class="meta"><span>Project <b><code>${esc(p.project_id)}</code></b></span><span>Customer <b>${esc(p.customer_name) || '—'}</b></span>
      <span><a href="#" onclick="exportFlags();return false">⬇ Export JSON</a></span></div>
    ${flags.length ? groupsHtml : '<div class="empty">No fields flagged for this project.</div>'}
  </div>
  <script>
    var BASE = ${JSON.stringify(DASH)};
    var FLAGS = ${JSON.stringify(flags)};
    function saveNote(id) {
      var note = document.getElementById('note-' + id).value;
      fetch(BASE + '/api/flags/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ internal_note: note }) })
        .then(function (r) { if (!r.ok) alert('Could not save note'); else flash(id); });
    }
    function clearFlag(id) {
      if (!confirm('Clear this flag? It will be removed from the review list.')) return;
      fetch(BASE + '/api/flags/' + id, { method: 'DELETE' })
        .then(function (r) { if (r.ok) { var el = document.querySelector('[data-flag="' + id + '"]'); if (el) el.remove(); } else alert('Could not clear flag'); });
    }
    function flash(id) {
      var el = document.querySelector('[data-flag="' + id + '"]');
      if (!el) return; el.style.transition = 'background 0.2s'; var o = el.style.background;
      el.style.background = 'rgba(74,218,138,0.18)'; setTimeout(function () { el.style.background = o; }, 500);
    }
    function exportFlags() {
      var blob = new Blob([JSON.stringify(FLAGS, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'flags-' + ${JSON.stringify(p.project_id)} + '.json'; document.body.appendChild(a); a.click(); a.remove();
    }
  </script>`;
  return shell('Flag review · ' + p.project_name, body);
}
