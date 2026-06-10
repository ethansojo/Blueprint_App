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
