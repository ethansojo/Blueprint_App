# Blueprint App — Sojo Industries

Interactive master data reference tool for the Blueprint initiative: how product
data flows through NetSuite from Blueprint → Variation/PC → Item → BOM →
Customer Order → Work Order → SOP.

> **Confidential — Sojo Industries internal use only.**

## 🚀 For the team: how to use this

**Download [`Blueprint_App.html`](Blueprint_App.html) and double-click it.**
That single file contains the entire app — no install, no server, works in
Chrome/Edge. (GitHub will show it as code if you click it in the browser; use
**Download raw file** instead, then open the downloaded file.)

What's inside the app:

| View | What it shows |
|---|---|
| Why Blueprint | The case for the blueprint model |
| Current State | Process bottleneck map (11 gaps) |
| Blueprint Flow | Architecture cards · **Data Flow** (where every field pulls from) · **ERD** (record relationships, click to drill into fields) · Decision Tree · Price Flow · Production Integrity |
| Source Map | Every field on every record, color-coded by source — with in-app field editing |
| Next Steps | The 5-phase roadmap |

## 🛠 For maintainers: editing the app

Editable source lives in [`blueprint-app/`](blueprint-app/):

- `index.html` — app shell, views, styling
- `data.js` — view content (flow steps, scenarios, ERD layout, seed field data)
- `fields-data.js` — **canonical field data** (all records + SOP fields). The
  in-app pencil editor writes here when running via the dev server.
- `serve.ps1` — local dev server (`powershell -File blueprint-app\serve.ps1`,
  then open http://localhost:3000). Required for in-app edits to persist to disk.
- `build.ps1` — regenerates `Blueprint_App.html` from the source files.

**Workflow:** edit → `powershell -File blueprint-app\build.ps1` → commit + push
both the source change and the regenerated `Blueprint_App.html`.

Reference material (originals the app was built from) sits in the repo root:
`Blueprint_Field_Source_Map_v3_43.html`, `Blueprint_Decision_Tree.html`,
`Blueprint Presentation _Standalone_.html`.

---

## 🌐 Web app + project tracking (Railway + SQLite)

The same HTML can run as a hosted web app that also **records every project
submitted through the intake form** in a SQLite database. The backend lives in
[`blueprint-app/`](blueprint-app/).

### Access model — team test domain, no login

This is set up as an **internal team test domain**: the project **dashboard is
the landing page** and every module is reachable from it. There is **no login**.
⚠️ Anyone with the domain can view and edit everything — fine for a shared team
test site; add a gate before putting real customer data behind it.

### Routes

| Route | What it serves | Access |
|---|---|---|
| `/` | **Dashboard** — Active projects (search, sort, status) + Active/Archive tabs | Open |
| `/archive` | Completed projects ("Setup Complete") | Open |
| `/p/:id` | One submission: all fields, field→NetSuite mapping, flagged fields + notes | Open |
| `/review/:id` | Flag review — Not-sure + custom flags grouped by product/section; edit notes, clear, export | Open |
| `/app` | The full Blueprint app | Open |
| `/presentation` | Standalone slide deck | Open |
| `/source-map`, `/decision-tree` | Redirect into the app's current Source Map / Decision Tree views | Open |
| `/intake` | Customer intake form (form only, self-contained) | **Public** |

Open the domain and you land on the dashboard hub; the top nav links to Active,
Archive, the intake form, and the full app. The data starts empty on a fresh
deploy and fills as intake forms are submitted **to this domain**.

The intake form **POSTs its full payload to `/api/submissions`** on submit. The
server stores the submission plus every flagged field — both the customer's
"Not sure 🤔" fields and their ✍ custom-entered (non-dropdown) values — with
notes. Opened as a standalone file (no server), the form falls back to a
local-only submit and the JSON export still works.

All database access goes through one module, [`blueprint-app/db.js`](blueprint-app/db.js)
(`saveSubmission`, `listProjects`, `getProject`, `updateStatus`, `saveFlag`,
`getFlags`) — no raw SQL lives anywhere else, so switching to Postgres later is
a one-file change.

### Run locally

```powershell
cd blueprint-app
npm install
npm start                                  # http://localhost:3000
```

Watch the console for the `UNLISTED dashboard: /projects-<slug>` line — that's
your dashboard URL. To pin a fixed slug instead of the generated one, set
`DASHBOARD_SLUG` (see [`blueprint-app/.env.example`](blueprint-app/.env.example)).
After editing the intake form (`index.html` / `intake-data.js`), regenerate the
public form page with `npm run build:intake`.

### Deploy to Railway

1. **Push to GitHub** (this repo).
2. In Railway → **New Project → Deploy from GitHub repo**, pick this repo.
3. In the service **Settings**, set **Root Directory = `blueprint-app`**.
4. Add a **Volume** mounted at **`/app/data`**.
   ⚠️ **Without this volume, the SQLite database is wiped on every redeploy —
   you lose every submitted project.** The volume is what makes the data
   persist. Mount path must be exactly `/app/data` (the app writes to
   `./data/projects.db`, and the root directory becomes `/app`). The volume
   also keeps your dashboard slug stable across redeploys.
5. **Generate a public domain** (service → Settings → Networking → Generate
   Domain).
6. **Read the dashboard URL from the Deploy Logs** — find the
   `UNLISTED dashboard: /projects-<slug>` line. Your dashboard is
   `https://<your-domain>/projects-<slug>`. Share `https://<your-domain>/intake`
   with customers; keep the dashboard URL to yourself (it's the only barrier).

There is no password to set. Railway auto-detects Node from
[`blueprint-app/package.json`](blueprint-app/package.json) (`npm start` →
`node server.js`) and reads [`blueprint-app/railway.json`](blueprint-app/railway.json).
The server binds to `process.env.PORT`, which Railway sets automatically — never
hardcode it.

> **Note:** `node_modules/` and `data/*.db` are gitignored — dependencies and
> the database are never committed. `.env.example` is committed; `.env` is not.
