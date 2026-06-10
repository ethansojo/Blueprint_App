# Blueprint App — Sojo Industries

Unified master data reference tool for the Blueprint initiative.

## Two ways to use this

### To share with someone else (recommended for handoff)
Send them **`Blueprint_App.html`** — the single self-contained file at the
top of the `Blueprint folder`. It has everything inlined (no external
files, no server needed). They just double-click it in Chrome/Edge.

### To edit and develop
Work inside `blueprint-app/`:
- Open `index.html` directly, **or** run the dev server:
  ```
  powershell -File blueprint-app\serve.ps1
  # then open http://localhost:3000
  ```

After you edit `data.js` or `index.html`, regenerate the shareable file:
```
powershell -File blueprint-app\build.ps1
```
That writes a fresh `Blueprint_App.html` next to `blueprint-app/`. Send
that file.

## Files

```
Blueprint folder/
├── Blueprint_App.html        ← single-file deliverable. SHARE THIS.
└── blueprint-app/            ← editable source
    ├── index.html            ← full application shell (HTML + CSS + JS)
    ├── data.js               ← all field data
    ├── serve.ps1             ← tiny local dev server
    └── build.ps1             ← bundles index.html + data.js → Blueprint_App.html
```

**Why two formats?** Browsers block `<script src="data.js">` when an HTML
file is opened from a regular file location on some configurations, so a
recipient who just double-clicks the loose `index.html` may see a blank
page. The bundled `Blueprint_App.html` sidesteps that entirely.

## Making changes

**Add a field to a node:**
In `data.js`, find the right `*Sec` array (e.g. `varSec` for Variation/PC),
find the right section, and add a field:
```js
{ name: 'My New Field', type: 'req' }          // required
{ name: 'My Field',     type: 'opt' }           // manual optional
{ name: 'My Field',     type: 'auto' }          // auto-calculated
{ name: 'My Field',     type: 'bp' }            // auto from Blueprint
{ name: 'My Field',     status: 'flag' }        // flagged — decision needed
{ name: 'My Field',     status: 'new' }         // new field to be added
```

**Add a SOP field:**
Add an entry to `SOP_FIELDS` in `data.js`:
```js
{ name: 'Field Name', section: 'Section Name', source: 'blueprint',
  method: 'Auto from Blueprint', status: 'confirmed' }
```

**Change a node color / description:**
Edit the `NODE_COLORS` or `NODE_META` objects in `data.js`.

**Add a new view:**
In `index.html`, add a new `<div class="view" id="view-newname">` in the body,
a new `<button class="view-tab" data-view="newname">` in the nav,
and a `buildNewView()` function in the script section.

## Color system

| Record | Color |
|--------|-------|
| Blueprint | #5A9CD8 blue |
| Variation / PC | #D4A830 gold |
| Item | #5ACA5A green |
| BOM / BOM Revision | #4ACAC8 teal |
| RM Item | #E898D0 rose |
| Packaging Material | #E8A858 amber |
| Customer Order | #B8A0E8 purple |
| Work Order | #E07A7A red |
| SOP | #A0B0F0 indigo |

| Field type | Color |
|-----------|-------|
| Required | red |
| Auto-Calculated | teal |
| Manual Optional | gray |
| From Blueprint | blue |
| From BOM | seafoam |
| From Customer Hub | orange |
| From Customer Order | purple |

## Upgrading to a full React project

When Node.js is available:
```bash
npm create vite@latest blueprint-react -- --template react
# Move data.js → src/data/
# Split each view function into src/views/*.jsx
# Split CSS sections into src/styles/
```
