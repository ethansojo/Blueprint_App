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
const APP_FILES = { 'data.js': 1, 'fields-data.js': 1, 'intake-data.js': 1 };

/* ── unlisted dashboard path ───────────────────────────────────────────────
   No password — the hard-to-guess URL is the barrier. The slug is generated
   once and persisted to the data volume so it stays stable across redeploys
   (override with the DASHBOARD_SLUG env var if you want a fixed value).      */
function resolveSlug() {
  const fromEnv = (process.env.DASHBOARD_SLUG || '').replace(/[^A-Za-z0-9_-]/g, '');
  if (fromEnv) return fromEnv;
  const slugFile = path.join(DATA_DIR, '.dashboard-slug');
  try { const s = fs.readFileSync(slugFile, 'utf8').trim(); if (s) return s; } catch (e) { /* first boot */ }
  const slug = crypto.randomBytes(4).toString('hex');           // 8 hex chars
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(slugFile, slug, 'utf8'); } catch (e) { /* ephemeral fallback */ }
  return slug;
}
const SLUG = resolveSlug();
const DASH = '/projects-' + SLUG;                 // unlisted base for everything internal

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ════════════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ════════════════════════════════════════════════════════════════════════ */

// Bare domain → the public form (never reveals the unlisted dashboard).
app.get('/', (req, res) => res.redirect('/intake'));

// Customer intake form — the only public HTML. Self-contained (no app assets).
app.get('/intake', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'intake.html')));

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

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD  (server-rendered, dark theme — reachable only at the unlisted base)
   ════════════════════════════════════════════════════════════════════════ */
app.get(DASH, (req, res) => {
  res.type('html').send(renderDashboard(db.listProjects()));
});

app.get(DASH + '/p/:id', (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).type('html').send(shell('Not found', '<div class="wrap"><p>No project <code>' + esc(req.params.id) + '</code>. <a href="' + DASH + '">← Back</a></p></div>'));
  res.type('html').send(renderDetail(p));
});

app.listen(PORT, () => {
  const line = '═'.repeat(64);
  console.log(line);
  console.log(`Blueprint web app listening on port ${PORT}`);
  console.log(`Public intake form:   /intake`);
  console.log(`UNLISTED dashboard:   ${DASH}`);
  console.log(`   (open <your-domain>${DASH} — this URL is the only barrier)`);
  console.log(line);
  // Best-effort persistent record on the data volume, for easy retrieval.
  try { fs.writeFileSync(path.join(DATA_DIR, 'dashboard-url.txt'), DASH + '\n', 'utf8'); } catch (e) { /* ignore */ }
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
  .statussel { background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:7px; padding:5px 8px; color:var(--text); font-family:inherit; font-size:12px; }
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
  .map-table td, .map-table th { font-size:12.5px; }
  .map-arrow { color:var(--dim); }
  code { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--accent); }
`;

function shell(title, body, extraHead) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"/>
<style>${STYLES}</style>${extraHead || ''}</head><body>
<div class="topbar"><div class="logo">S</div><div><h1>Sojo Industries · Blueprint</h1>
<div class="sub">Project intake tracking</div></div>
<div class="links"><a href="${DASH}">Projects</a><a href="/intake" target="_blank">Intake form ↗</a><a href="${DASH}/app/" target="_blank">Blueprint app ↗</a></div></div>
${body}</body></html>`;
}

function statusOptions(current) {
  return db.VALID_STATUSES.map(s => `<option${s === current ? ' selected' : ''}>${s}</option>`).join('');
}

function renderDashboard(projects) {
  const rows = projects.map(p => `
    <tr data-customer="${esc((p.customer_name || '').toLowerCase())}"
        data-name="${esc((p.project_name || '').toLowerCase())}"
        data-status="${esc(p.status)}" data-date="${esc(p.updated_at)}">
      <td><a href="${DASH}/p/${encodeURIComponent(p.project_id)}">${esc(p.project_name)}</a><br><code>${esc(p.project_id)}</code></td>
      <td>${esc(p.customer_name) || '<span style="color:var(--dim)">—</span>'}</td>
      <td>${esc((p.updated_at || '').slice(0, 10))}</td>
      <td><select class="statussel" onchange="setStatus('${esc(p.project_id)}', this.value)">${statusOptions(p.status)}</select></td>
      <td><span class="badge g-${esc(p.complexity_grade)}">${esc(p.complexity_grade)}</span></td>
      <td class="flags ${p.flag_count ? '' : 'zero'}">${p.flag_count}</td>
    </tr>`).join('');

  const body = `<div class="wrap">
    <div class="controls">
      <input id="q" placeholder="Search by project or customer…" oninput="filterRows()"/>
      <select id="statusFilter" onchange="filterRows()">
        <option value="">All statuses</option>${db.VALID_STATUSES.map(s => `<option>${s}</option>`).join('')}
      </select>
    </div>
    <table>
      <thead><tr>
        <th onclick="sortBy('name')">Project</th>
        <th onclick="sortBy('customer')">Customer</th>
        <th onclick="sortBy('date')">Updated</th>
        <th>Status</th>
        <th>Complexity</th>
        <th># Flagged</th>
      </tr></thead>
      <tbody id="rows">${rows || ''}</tbody>
    </table>
    ${projects.length ? '' : '<div class="empty">No submissions yet. Share the <a href="/intake" target="_blank">intake form</a> to get started.</div>'}
  </div>
  <script>
    function filterRows() {
      var q = document.getElementById('q').value.toLowerCase();
      var sf = document.getElementById('statusFilter').value;
      document.querySelectorAll('#rows tr').forEach(function (tr) {
        var hit = (tr.dataset.name.indexOf(q) > -1 || tr.dataset.customer.indexOf(q) > -1) && (!sf || tr.dataset.status === sf);
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
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    }
    var BASE = ${JSON.stringify(DASH)};
    function setStatus(id, status) {
      fetch(BASE + '/api/projects/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status })
      }).then(function (r) { if (!r.ok) alert('Could not update status'); });
    }
  </script>`;
  return shell('Projects · Blueprint', body);
}

function renderDetail(p) {
  const overview = (p.payload && p.payload.overview) || {};
  const products = (p.payload && p.payload.products) || [];

  const flagsHtml = p.flags.length ? p.flags.map(f => `
    <div class="flagrow">
      <div class="fl-label">${esc(f.field_label)}${f.value ? ' — <span style="color:var(--text)">' + esc(f.value) + '</span>' : ''}</div>
      <div class="fl-meta">${esc(f.section)}${f.product_index != null ? ' · product ' + (f.product_index + 1) : ''} · ${esc(f.note)} · <em>${esc(f.flagged_by)}</em></div>
    </div>`).join('') : '<p style="color:var(--muted)">No flagged fields.</p>';

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
    <p><a href="${DASH}">← All projects</a></p>
    <h2 style="font-size:20px;font-weight:800;margin:10px 0 2px">${esc(p.project_name)}</h2>
    <div class="meta">
      <span>Project <b><code>${esc(p.project_id)}</code></b></span>
      <span>Customer <b>${esc(p.customer_name) || '—'}</b></span>
      <span>Contact <b>${esc(p.contact_email) || '—'}</b></span>
      <span>Submitted <b>${esc((p.created_at || '').slice(0, 16).replace('T', ' '))}</b></span>
      <span>Complexity <b class="badge g-${esc(p.complexity_grade)}">${esc(p.complexity_grade)}</b></span>
      <span>Status
        <select class="statussel" onchange="setStatus('${esc(p.project_id)}', this.value)">${statusOptions(p.status)}</select>
      </span>
    </div>
    <div class="card"><h3>🤔 Flagged fields (${p.flags.length})</h3>${flagsHtml}</div>
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
      }).then(function (r) { if (!r.ok) alert('Could not update status'); });
    }
  </script>`;
  return shell(p.project_name + ' · Blueprint', body);
}
