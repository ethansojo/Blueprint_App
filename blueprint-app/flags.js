/* flags.js — field flagging for the intake form (Part C). No DOM.
   ─────────────────────────────────────────────────────────────────────────
   A flag = a field the customer (or reviewer) wants Sojo to look at, with a
   "reason" note. Flags are kept in IN_STATE so they ride in the draft + the
   submission payload, and db.js writes them to the flags table.

   Three ways a field gets flagged:
   1. Explicit  — the ⚑ popover (a typed reason)        → stored in flagsO / product.flags
   2. Not sure  — the "Not sure?" button                → auto-flag, default note
   3. Custom    — a dropdown answered with the custom    → auto-flag, default note
                  sentinel or "Other (specify)" supplier

   Flag key per field:  plain field → field id;  BOM row field → "bom:<ri>:<id>".
   One flag per (product, key); explicit notes win over auto notes.
*/
'use strict';

/* ── Not-Sure config (edit text / requiredness here, not in the components) ── */
const NS_PROMPT = "Tell us why you couldn't complete this field — this helps our team follow up.";
const NS_NOTE_REQUIRED = false;   // set true to force a note before the customer can Save
const NS_VALUE = 'NOT_SURE';      // marker stored in the flag row's value column

function flMap(scope) {
  return scope === 'o' ? IN_STATE.flagsO : IN_STATE.products[IN_STATE.active].flags;
}
// A Not-sure entry is stored as { note } (object → always truthy so gating still
// treats the field as answered). Older drafts stored `true`; handle both.
function flNsNote(entry) { return (entry && typeof entry === 'object' && entry.note) ? entry.note : ''; }
function flNsOn(scope, key) { const m = scope === 'o' ? IN_STATE.nsO : IN_STATE.products[IN_STATE.active].ns; return !!(m && m[key]); }
function flAutoNote(kind) {
  return kind === 'ns'
    ? 'Customer marked "Not sure" — review with customer'
    : 'Customer entered their own value (not from a dropdown)';
}
function flBomTitle() {
  const s = INTAKE_SECTIONS.find(x => x.type === 'bom');
  return s ? s.title : 'Raw Materials & Packaging';
}
function flValOf(store, id, f) {
  let v = store ? store[id] : '';
  if (v === INTAKE_CUSTOM_SENTINEL) v = (store[id + 'Custom'] || '');
  return Array.isArray(v) ? v.join(', ') : (v == null ? '' : String(v));
}

/* ── metadata lookups (label / section / current value) ── */
function flOvMeta(id) {
  const f = (INTAKE_SECTIONS[0].fields || []).find(x => x.id === id);
  return { label: f ? f.label : id, value: flValOf(IN_STATE.overview, id, f) };
}
function flProdMeta(p, key) {
  if (key.indexOf('bom:') === 0) {
    const parts = key.split(':'), ri = +parts[1], fid = parts[2];
    const f = BOM_ROW_FIELDS.find(x => x.id === fid);
    return { label: (f ? f.label : fid) + ' (material ' + (ri + 1) + ')', section: flBomTitle(), value: flValOf((p.bom && p.bom[ri]) || {}, fid, f) };
  }
  const sec = INTAKE_SECTIONS.filter(s => s.scope === 'product').find(s => (s.fields || []).some(x => x.id === key));
  const f = sec ? sec.fields.find(x => x.id === key) : null;
  return { label: f ? f.label : key, section: sec ? sec.title : '', value: flValOf(p.answers, key, f) };
}

/* ── is a field flagged (for any reason)? drives the ⚑ active state ── */
function flIsFlagged(scope, key, store, ns) {
  if (flMap(scope) && flMap(scope)[key]) return true;
  if (ns && ns[key]) return true;
  if (store) {
    if (store[key] === INTAKE_CUSTOM_SENTINEL) return true;
    if ((key === 'wipSupplier' || key === 'pkgSupplier') && store[key] === 'Other (specify)') return true;
  }
  return false;
}
// BOM variant (no Not-sure map for BOM rows)
function flBomFlagged(key, row, fid) {
  if (flMap('p') && flMap('p')[key]) return true;
  if (row[fid] === INTAKE_CUSTOM_SENTINEL) return true;
  if (fid === 'supplier' && row.supplier === 'Other (specify)') return true;
  return false;
}

/* ── the note shown in the popover for a key (explicit wins, else auto) ── */
function flNoteFor(scope, key, store, ns) {
  if (ns && ns[key]) return flNsNote(ns[key]);     // Not-sure → the customer's typed note (may be '')
  const m = flMap(scope);
  if (m && m[key]) return m[key].note || '';
  if (store && (store[key] === INTAKE_CUSTOM_SENTINEL || ((key === 'wipSupplier' || key === 'pkgSupplier') && store[key] === 'Other (specify)'))) return flAutoNote('custom');
  return '';
}

/* ── save / clear an explicit flag (+ best-effort live persist) ── */
function flSave(scope, key, note) {
  const m = flMap(scope);
  m[key] = { note: note || '', at: new Date().toISOString() };
  if (typeof inSave === 'function') inSave();
  flPush(scope, key);                         // write the row now so it lands in the flags table
}
function flClear(scope, key) {
  const m = flMap(scope);
  if (m) delete m[key];
  if (scope === 'o') { if (IN_STATE.nsO) delete IN_STATE.nsO[key]; }
  else { const ns = IN_STATE.products[IN_STATE.active].ns; if (ns) delete ns[key]; }
  if (typeof inSave === 'function') inSave();
}

/* ── custom-entered (✍) values for a product ── */
function flCustomEntries(p) {
  const out = [];
  INTAKE_SECTIONS.filter(s => s.scope === 'product' && s.type !== 'bom').forEach(s => (s.fields || []).forEach(f => {
    if (Array.isArray(f.options) && f.options.includes(INTAKE_CUSTOM_SENTINEL) && p.answers[f.id] === INTAKE_CUSTOM_SENTINEL)
      out.push({ field_id: f.id, label: f.label, section: s.title, value: p.answers[f.id + 'Custom'] || '(not entered)' });
  }));
  if (p.answers.wipSupplier === 'Other (specify)') out.push({ field_id: 'wipSupplier', label: 'WIP Supplier', section: flBomTitle(), value: p.answers.wipSupplierOther || '(not entered)' });
  if (p.answers.pkgSupplier === 'Other (specify)') out.push({ field_id: 'pkgSupplier', label: 'Packaging Supplier', section: flBomTitle(), value: p.answers.pkgSupplierOther || '(not entered)' });
  (p.bom || []).forEach((r, ri) => BOM_ROW_FIELDS.forEach(f => {
    if (Array.isArray(f.options) && f.options.includes(INTAKE_CUSTOM_SENTINEL) && r[f.id] === INTAKE_CUSTOM_SENTINEL)
      out.push({ field_id: 'bom:' + ri + ':' + f.id, label: f.label + ' (material ' + (ri + 1) + ')', section: flBomTitle(), value: r[f.id + 'Custom'] || '(not entered)' });
    if (f.id === 'supplier' && r.supplier === 'Other (specify)')
      out.push({ field_id: 'bom:' + ri + ':supplier', label: 'Supplier (material ' + (ri + 1) + ')', section: flBomTitle(), value: r.supplierOther || '(not entered)' });
  }));
  return out;
}

/* ── build the full flag list for the payload (one row per flagged field) ── */
function flBuildAll() {
  const rows = [], seen = {};
  const add = (pi, field_id, o) => {
    const k = pi + '|' + field_id;
    if (seen[k]) return; seen[k] = 1;
    rows.push(Object.assign({ project_id: IN_STATE.id, field_id: field_id, product_index: pi, flagged_by: 'customer' }, o));
  };
  // Not-sure flags first so their NOT_SURE value + customer note win the (pi|id) slot.
  Object.keys(IN_STATE.nsO || {}).forEach(id => { const m = flOvMeta(id); add(null, id, { field_label: m.label, section: 'Project Overview', value: NS_VALUE, note: flNsNote(IN_STATE.nsO[id]) }); });
  Object.keys(IN_STATE.flagsO || {}).forEach(id => { const m = flOvMeta(id); add(null, id, { field_label: m.label, section: 'Project Overview', value: m.value, note: IN_STATE.flagsO[id].note || '' }); });
  IN_STATE.products.forEach((p, pi) => {
    Object.keys(p.ns || {}).forEach(id => { const m = flProdMeta(p, id); add(pi, id, { field_label: m.label, section: m.section, value: NS_VALUE, note: flNsNote(p.ns[id]) }); });
    Object.keys(p.flags || {}).forEach(key => { const m = flProdMeta(p, key); add(pi, key, { field_label: m.label, section: m.section, value: m.value, note: (p.flags[key].note || '') }); });
    flCustomEntries(p).forEach(c => add(pi, c.field_id, { field_label: c.label, section: c.section, value: c.value, note: flAutoNote('custom') }));
  });
  return rows;
}

/* ── best-effort live write so a flag becomes a flags-table row immediately ── */
function flPush(scope, key) {
  try {
    let row;
    if (scope === 'o') {
      const m = flOvMeta(key);
      row = { field_id: key, field_label: m.label, section: 'Project Overview', product_index: null, value: flNsOn('o', key) ? NS_VALUE : m.value, note: flNoteFor('o', key, IN_STATE.overview, IN_STATE.nsO), flagged_by: 'customer' };
    } else {
      const p = IN_STATE.products[IN_STATE.active];
      const m = flProdMeta(p, key);
      row = { field_id: key, field_label: m.label, section: m.section, product_index: IN_STATE.active, value: flNsOn('p', key) ? NS_VALUE : m.value, note: flNoteFor('p', key, p.answers, p.ns), flagged_by: 'customer' };
    }
    fetch('/api/submissions/' + encodeURIComponent(IN_STATE.id) + '/flags', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(row),
    }).catch(function () {});
  } catch (e) { /* file:// or offline — flag still rides in the submit payload */ }
}
// Remove a live flag row (used when Not-sure is cancelled/unchecked).
function flPushRemove(scope, key) {
  try {
    fetch('/api/submissions/' + encodeURIComponent(IN_STATE.id) + '/flags/remove', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_id: key, product_index: scope === 'o' ? null : IN_STATE.active }),
    }).catch(function () {});
  } catch (e) { /* offline */ }
}
