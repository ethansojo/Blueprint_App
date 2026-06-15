/* validation.js — required-field gating for the intake form (Part B).
   ─────────────────────────────────────────────────────────────────────────
   Pure logic, no DOM. The form's render + navigation code calls these.
   A field's `required` flag lives in intake-data.js — toggling it there
   changes gating here with no component edits.

   Rules:
   - A field BLOCKS advancing when it is required, VISIBLE (showIf satisfied),
     not satisfied by a "Not sure" mark, and empty.
   - A required field hidden by showIf never blocks.
*/
'use strict';

function vIsEmpty(v) {
  return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
}

function vIsVisible(f, answers) {
  if (!f || !f.showIf) return true;
  const v = answers[f.showIf.field];
  if (f.showIf.equals !== undefined) return v === f.showIf.equals;
  if (f.showIf.equalsAny) return f.showIf.equalsAny.includes(v);
  return true;
}

// Does this field block progress?  answers = the field's value bag,
// ns = the matching Not-sure map (may be null for BOM rows).
function vFieldBlocks(f, answers, ns) {
  if (!f || f.type === 'note' || !f.required) return false;
  if (!vIsVisible(f, answers)) return false;                 // hidden by showIf → never blocks
  if (ns && ns[f.id]) return false;                          // "Not sure" satisfies the requirement
  if (f.showIf && ns && ns[f.showIf.field]) return false;    // parent marked Not sure → companion waived
  return vIsEmpty(answers[f.id]);
}

// Keys of every blocking field in a section. Plain field → its id.
// BOM row field → "bom:<rowIndex>:<fieldId>". Used for the Next gate and
// the inline "Required to continue" highlights.
function vSectionBlockingKeys(sec, answers, ns, bomRows, bomFields) {
  const keys = [];
  (sec.fields || []).forEach(f => { if (vFieldBlocks(f, answers, ns)) keys.push(f.id); });
  if (sec.type === 'bom' && Array.isArray(bomRows)) {
    if (!bomRows.length) keys.push('bom:none');
    bomRows.forEach((r, ri) => (bomFields || []).forEach(f => {
      if (f.required && f.type !== 'note' && vIsVisible(f, r) && vIsEmpty(r[f.id])) keys.push('bom:' + ri + ':' + f.id);
    }));
  }
  return keys;
}
