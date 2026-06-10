/* ═══════════════════════════════════════════════════════════════════════════
   DATA FILE — data.js
   All field data for the Blueprint App. Modify this file to add/remove/
   update fields without touching any UI code.
═══════════════════════════════════════════════════════════════════════════ */

/* ── Source record metadata ─────────────────────────────────────────────── */
const SOURCES = {
  blueprint:     { label: 'Blueprint',          shortLabel: 'BLUEPRINT',      color: '#5A9CD8', flow: ['Blueprint', 'SOP'] },
  variation:     { label: 'Variation / PC',     shortLabel: 'VARIATION',      color: '#D4A830', flow: ['Variation', 'SOP'] },
  item:          { label: 'Item',               shortLabel: 'ITEM',           color: '#5ACA5A', flow: ['Item', 'SOP'] },
  bom:           { label: 'Bill of Materials',  shortLabel: 'BOM',            color: '#4ACAC8', flow: ['BOM', 'SOP'] },
  bomline:       { label: 'BOM Revision',       shortLabel: 'BOM REVISION',   color: '#4ACAC8', flow: ['BOM Revision', 'BOM', 'SOP'] },
  rmitem:        { label: 'RM Item',            shortLabel: 'RM ITEM',        color: '#E898D0', flow: ['RM Item', 'BOM Revision', 'BOM', 'SOP'] },
  pkgitem:       { label: 'Packaging Material', shortLabel: 'PKG MATERIAL',   color: '#E8A858', flow: ['Packaging Material', 'BOM Revision', 'BOM', 'SOP'] },
  workorder:     { label: 'Work Order',         shortLabel: 'WORK ORDER',     color: '#E07A7A', flow: ['Variation', 'Work Order', 'SOP'] },
  customerorder: { label: 'Customer Order',     shortLabel: 'CUSTOMER ORDER', color: '#B8A0E8', flow: ['Customer Order', 'SOP'] },
  approval:      { label: 'Customer Approval',  shortLabel: 'APPROVAL',       color: '#FFA070', flow: ['Customer Approval', 'SOP'] },
  autocalc:      { label: 'Auto-Calculated',    shortLabel: 'AUTO-CALC',      color: '#9090A0', flow: ['Auto-Calc', 'SOP'] },
  sop:           { label: 'SOP (manual)',        shortLabel: 'SOP',            color: '#A0B0F0', flow: ['SOP'] },
  tbd:           { label: 'Blueprint or Item',  shortLabel: 'TBD',            color: '#E8C840', flow: ['(Decision Pending)', 'SOP'] },
  remove:        { label: 'Remove from SOP',    shortLabel: 'REMOVE',         color: '#707078', flow: ['(Field to be removed)'] },
};

/* ── Node color config ──────────────────────────────────────────────────── */
const NODE_COLORS = {
  blueprint:     { bg:'#06121F', bdr:'#3A6FAA', tc:'#92CCF0', dc:'#5588B0', label:'BLUEPRINT · PRODUCT RECORD',     title:'Blueprint',           sub:'Defined once per product relationship — immutable day-to-day' },
  variation:     { bg:'#100A00', bdr:'#B08810', tc:'#E8C040', dc:'#A88828', label:'VARIATION / PC · PRODUCTION CONFIG', title:'Variation / Pricing Config', sub:'Pricing calculator + production configuration per product' },
  item:          { bg:'#04100A', bdr:'#3AB838', tc:'#90E090', dc:'#58A858', label:'ITEM · NETSUITE RECORD',           title:'Item',                sub:'Customer-designated finished product unit' },
  bom:           { bg:'#04120F', bdr:'#1AB0B0', tc:'#5ADADA', dc:'#38A0A0', label:'BILL OF MATERIALS',               title:'Bill of Materials',   sub:'Parent record linking components to a finished item' },
  bomline:       { bg:'#04120F', bdr:'#1AB0B0', tc:'#5ADADA', dc:'#38A0A0', label:'BOM REVISION · VERSIONED COMPONENT LIST', title:'BOM Revision', sub:'Component rows: packaging, consumables, raw materials' },
  rmitem:        { bg:'#180416', bdr:'#C048A0', tc:'#E898D0', dc:'#9860A0', label:'RM ITEM · RAW MATERIAL RECORD',   title:'RM Item',             sub:'Inbound WIP / raw material record' },
  pkgitem:       { bg:'#180D02', bdr:'#A8631A', tc:'#E8A858', dc:'#B07C30', label:'PACKAGING MATERIAL · COMPONENT RECORD', title:'Packaging Material', sub:'Labels, stickers, packaging components' },
  customerorder: { bg:'#1A0F38', bdr:'#7A50D0', tc:'#C8B0F0', dc:'#9080C8', label:'CUSTOMER ORDER',                  title:'Customer Order',      sub:'Per-run order instance from the customer' },
  workorder:     { bg:'#180404', bdr:'#A02828', tc:'#E08080', dc:'#B05858', label:'WORK ORDER · RUN ACTUALS',         title:'Work Order',          sub:'Auto-generated from Customer Order — captures actuals' },
  autocalc:      { bg:'#0C0C0E', bdr:'#404048', tc:'#9090A0', dc:'#606068', label:'AUTO-CALCULATED · SOP GENERATION', title:'Auto-Calc',           sub:'Derived from upstream records at SOP generation' },
  sop:           { bg:'#0E0E22', bdr:'#5060D0', tc:'#A0B0F0', dc:'#7888C0', label:'SOP · AUTO-GENERATED OUTPUT',     title:'SOP',                 sub:'Auto-assembled — target: ~12 fields confirmed manually' },
};

/* ── Node metadata for Blueprint Flow view ──────────────────────────────── */
const NODE_META = {
  blueprint: {
    when: 'New customer, or new product line for an existing customer',
    who: 'Engineering or Sales during customer onboarding',
    facts: ['Created once per customer/product relationship','Contains lot code formats, container specs, outbound defaults','All downstream records inherit from this','Never changes day-to-day'],
    prereqs: 'None — this is the top-level record',
  },
  variation: {
    when: 'Anything that changes project price: WIP size, pallet qty, labels added/removed',
    who: 'Engineering + Operations (requires both approvals)',
    facts: ['Pricing calculator + production configuration','Requires Ops + Engineering approval before Item creation','Contains headcount, throughput, and volume assumptions','Flows: Blueprint → Variation → Customer Order → Work Order → SOP'],
    prereqs: 'Blueprint must exist first',
  },
  item: {
    when: 'Physical pallet changed AND customer designates it as a new item in their system (both required)',
    who: 'Data team after Ops + Engineering approve the Variation',
    facts: ['NetSuite item record for the finished pallet','Must link to Blueprint and Variation/PC','Customer Item # is required','Feeds the BOM via Restrict to Assemblies'],
    prereqs: 'Blueprint + Variation/PC must exist',
  },
  bom: {
    when: 'Component recipe changes: new materials, sticker added/removed, qty change',
    who: 'Data team',
    facts: ['Parent record linking components to the finished item','Every BOM must have at least one BOM Revision','Links to Item via "Restrict to Assemblies"','BOM Revision holds the actual component rows'],
    prereqs: 'Blueprint + Variation/PC + Item must exist',
  },
  bomline: {
    when: 'Any time a new BOM is created, or when component recipe changes',
    who: 'Data team',
    facts: ['Versioned list of component rows','One row per component (RM Item, Pkg Material, etc.)','Name inherits from parent BOM','Component rows include: item, qty, units, item source'],
    prereqs: 'Parent BOM must exist',
  },
  rmitem: {
    when: 'New raw material or WIP pallet type is introduced',
    who: 'Data team',
    facts: ['Raw material / inbound WIP record','Links to Blueprint and Variation/PC','Contains stacking heights, container specs from Blueprint','Used as a component row in BOM Revision'],
    prereqs: 'Blueprint + Variation/PC',
  },
  pkgitem: {
    when: 'New packaging material is introduced',
    who: 'Data team',
    facts: ['Labels, stickers, packaging components','Links to Blueprint and Variation/PC','Used as a component row in BOM Revision','Contains artwork files and UPC'],
    prereqs: 'Blueprint + Variation/PC',
  },
  customerorder: {
    when: 'Customer submits a new run order through Customer Hub',
    who: 'Customer Hub auto-creates; Ops confirms fields',
    facts: ['Per-run order instance','Requires Customer Approval (SOW signed) before creation','Pulls from Customer Hub: PO, quantity, dates, location','Generates Work Orders automatically'],
    prereqs: 'Blueprint + Variation + Item + BOM + Customer Approval',
  },
  workorder: {
    when: 'Auto-generated from Customer Order',
    who: 'System auto-creates; Operations manages',
    facts: ['Captures run actuals vs. Variation assumptions','Location, machine model, setpoint CPM flow to SOP','Headcount and goal cases flow from Variation → CO → WO → SOP','Run notes and files entered here'],
    prereqs: 'Customer Order must exist',
  },
  sop: {
    when: 'Auto-generated when Work Order activates',
    who: 'System auto-assembles; ~12 fields confirmed manually',
    facts: ['Pulls from all upstream records','Target: zero re-entry of data','Ops confirms: Published, Bay, and any per-run overrides','Drives production floor execution'],
    prereqs: 'Work Order must exist',
  },
};

/* ── SOP Fields ─────────────────────────────────────────────────────────── */
const SOP_FIELDS = [
  /* Primary Information */
  { name: 'SOP Creator',             section: 'Primary Information',   source: 'autocalc', method: 'System auto-generates from logged-in user', status: 'rem',       notes: 'Recommend removing — system tracks this natively' },
  { name: 'SOW Signed Status',       section: 'Primary Information',   source: 'variation', method: 'Auto from Variation / PC (links to Customer Approval)', status: 'confirmed' },
  { name: 'Customer Printout',       section: 'Primary Information',   source: 'remove',   method: 'Remove field — no longer needed on SOP', status: 'rem',          notes: 'Field to be removed from the SOP record' },
  { name: 'Operations Printout',     section: 'Primary Information',   source: 'autocalc', method: 'Auto-generated when the SOP record is created', status: 'confirmed' },
  { name: 'Published',               section: 'Primary Information',   source: 'autocalc', method: 'Auto-trigger when Work Order activates?', status: 'flag',        notes: 'Decision needed — auto-publish or manual?' },
  { name: 'Name',                    section: 'Primary Information',   source: 'autocalc', method: 'Auto-generated on record creation', status: 'flag',               notes: 'Naming convention TBD — what format does Ops need?' },
  { name: 'Pricing Calculator',      section: 'Primary Information',   source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Pricing Calculator ID',   section: 'Primary Information',   source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Second Touch',            section: 'Primary Information',   source: 'variation', method: 'Auto from Variation / Pricing Calc', status: 'confirmed' },
  { name: 'VP#',                     section: 'Primary Information',   source: 'item',     method: 'Auto from Item — specific item selected via Customer Order', status: 'confirmed' },
  { name: 'Customer Name',           section: 'Primary Information',   source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'SSA',                     section: 'Primary Information',   source: 'blueprint', method: 'Auto from Blueprint — NEW field to be added', status: 'new',    notes: 'New field to be added to the Blueprint record' },
  { name: 'VP Name / Description (Sojo)', section: 'Primary Information', source: 'item', method: 'Auto from Item record', status: 'confirmed' },
  { name: 'Status',                  section: 'Primary Information',   source: 'autocalc', method: 'Auto-calculated — derived from Work Order status', status: 'flag', notes: 'Decision pending — do we need this on the SOP at all?' },
  { name: 'Customer Approved',       section: 'Primary Information',   source: 'autocalc', method: 'Auto-derived from project approval gate', status: 'flag',        notes: 'Decision pending — Customer Order cannot be created without approval, so all SOPs are customer approved by definition.' },
  { name: 'Date Created',            section: 'Primary Information',   source: 'autocalc', method: 'System auto-stamp', status: 'rem' },
  { name: 'Last Modified',           section: 'Primary Information',   source: 'autocalc', method: 'System auto-stamp', status: 'rem' },
  { name: 'By',                      section: 'Primary Information',   source: 'autocalc', method: 'System auto-tracks user', status: 'rem' },
  /* Headcounts */
  { name: 'Headcount',               section: 'Headcounts',            source: 'workorder', method: 'Auto from Work Order — Headcount flows: Variation → Customer Order → Work Order → SOP', status: 'confirmed' },
  { name: 'Total Number of People',  section: 'Headcounts',            source: 'autocalc', method: 'Auto-calc — sum of all headcount role fields', status: 'confirmed' },
  /* Summary */
  { name: 'Customer SOP Version',    section: 'Summary',               source: 'sop',      method: 'Manual on SOP — or remove?', status: 'flag',                    notes: 'Decision pending — do we need this? NetSuite record history may replace it' },
  { name: 'Inbound WIP',             section: 'Summary',               source: 'variation', method: 'Auto from Variation Customer Materials field', status: 'confirmed', notes: 'Field name needs alignment with Variation' },
  { name: 'Reuse Inbound Trays',     section: 'Summary',               source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Printout',                section: 'Summary',               source: 'blueprint', method: 'Auto — purpose unclear', status: 'flag',                        notes: 'Need to clarify what this field actually controls' },
  { name: 'Engineering Notes',       section: 'Summary',               source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Operations Notes',        section: 'Summary',               source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Project Summary',         section: 'Summary',               source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Item Format',             section: 'Summary',               source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Size',                    section: 'Summary',               source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Container Spec',          section: 'Summary',               source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Container',               section: 'Summary',               source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  /* Production */
  { name: 'Location',                section: 'Production',            source: 'workorder', method: 'Auto from WO (Actual Location) — Variation has Location Assumption', status: 'flag', notes: 'Decision: Variation OR Customer Order? Affects location-based pricing model' },
  { name: 'Machine Model',           section: 'Production',            source: 'workorder', method: 'Auto from WO (Actual Machine Model) — Variation has Machine Model Assumption', status: 'confirmed' },
  { name: 'Bay',                     section: 'Production',            source: 'customerorder', method: 'Defined at Customer Order level', status: 'confirmed' },
  { name: 'Layout',                  section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Machine Setpoint CPM Default', section: 'Production',       source: 'workorder', method: 'Auto from WO (Actual Setpoint CPM) — Variation has Setpoint CPM Assumption', status: 'confirmed' },
  { name: 'Goal Cases Per Shift',    section: 'Production',            source: 'workorder', method: 'Auto from Work Order — Goal Cases flows: Variation → Customer Order → Work Order → SOP', status: 'confirmed' },
  { name: 'Bill of Materials',       section: 'Production',            source: 'bom',       method: 'Auto from BOM record', status: 'confirmed' },
  { name: 'Cornerboards',            section: 'Production',            source: 'bomline',   method: 'Auto from BOM Revision components sublist', status: 'confirmed' },
  { name: 'Slipsheet Requirements',  section: 'Production',            source: 'bomline',   method: 'Auto from BOM Revision components sublist', status: 'confirmed' },
  { name: 'Tray Die Lines',          section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Carton Die Lines',        section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Shrink Film Specs',       section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Pallet WIP Stack Height', section: 'Production',            source: 'blueprint', method: 'Auto from Blueprint — moved from RM Item', status: 'confirmed' },
  { name: 'Pallet Finished Good Stack Height', section: 'Production',  source: 'blueprint', method: 'Auto from Blueprint — moved from Item', status: 'confirmed' },
  { name: 'WIP Pallet Type',         section: 'Production',            source: 'rmitem',    method: 'Auto from RM Item record', status: 'confirmed' },
  { name: 'Finished Pallet Type',    section: 'Production',            source: 'item',      method: 'Auto from Item — required field on Item record', status: 'confirmed' },
  { name: 'Finished Pallet Pattern', section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'confirmed' },
  { name: 'Pallet Tag',              section: 'Production',            source: 'variation', method: 'Auto from Variation', status: 'flag',                           notes: 'Do we need this field? Confirm or remove' },
  { name: 'Finished Pallet Qty',     section: 'Production',            source: 'variation', method: 'Auto from Variation (Cases per Pallet)', status: 'confirmed' },
  { name: 'Pallet Configuration',    section: 'Production',            source: 'autocalc',  method: 'Calculated — formula TBD', status: 'flag',                      notes: 'Define the calculation: Pallet Qty ÷ Stack Height?' },
  { name: 'Finished System Lot Code Format', section: 'Production',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Finished System Lot Code Format Description', section: 'Production', source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'WIP System Lot Code Format', section: 'Production',         source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'WIP System Lot Code Format Description', section: 'Production', source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Inbound WIP Lot Location', section: 'Production',           source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  /* Printed Lot Format */
  { name: 'Lot 1 Placement',         section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 1 Format',            section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 1 Description',       section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 1 Example',           section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 1 Notes',             section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 1 Image',             section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Placement',         section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Lot Format',        section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Description',       section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Example',           section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Notes',             section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Lot 2 Image',             section: 'Printed Lot Format',    source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'No Printed Lot Code Required', section: 'Printed Lot Format', source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  /* Case Labels */
  { name: 'Case Label 1 Qty',        section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 1 Size',       section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 1 Placement',  section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 1 Notes',      section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 1 Image',      section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 1 Download',   section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Qty',        section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Size',       section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Placement',  section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Notes',      section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Image',      section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'Case Label 2 Download',   section: 'Case Labels',           source: 'variation', method: 'Auto from Variation (sourced from intake form)', status: 'confirmed' },
  { name: 'No Case Label Required',  section: 'Case Labels',           source: 'variation', method: 'Auto from Variation override', status: 'confirmed' },
  /* Outbounds */
  { name: 'Outbound Load Requirements', section: 'Outbounds',          source: 'blueprint', method: 'Auto from Blueprint default — overridable on Customer Order', status: 'confirmed' },
  { name: 'Airbag Qty',              section: 'Outbounds',             source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Outbound Load Details',   section: 'Outbounds',             source: 'blueprint', method: 'Auto from Blueprint default', status: 'confirmed' },
  { name: 'Outbound Load Pattern',   section: 'Outbounds',             source: 'blueprint', method: 'Auto from Blueprint default', status: 'confirmed' },
  { name: 'Pallet Placard Instructions', section: 'Outbounds',         source: 'blueprint', method: 'Auto from Blueprint', status: 'confirmed' },
  { name: 'Pallet Placard',          section: 'Outbounds',             source: 'blueprint', method: 'Auto from Blueprint (asset)', status: 'confirmed' },
  /* Notes / Admin */
  { name: 'Additional Notes',        section: 'Notes / Admin',         source: 'workorder', method: 'Manual — entered at Work Order per run', status: 'confirmed' },
  { name: 'Additional Photo / File', section: 'Notes / Admin',         source: 'workorder', method: 'Manual — uploaded at Work Order per run', status: 'confirmed' },
  { name: 'Inactive',                section: 'Notes / Admin',         source: 'sop',       method: 'SOP lifecycle flag', status: 'confirmed' },
  { name: 'Bom Revision',            section: 'Notes / Admin',         source: 'bomline',   method: 'Auto from BOM Revision record (version/Name field)', status: 'confirmed' },
  { name: 'SOP Docusign Contract',   section: 'Notes / Admin',         source: 'remove',    method: 'Lives on Customer Approval — not SOP', status: 'rem',        notes: 'Already exists on Customer Approval entity' },
  { name: 'Project Format',          section: 'Notes / Admin',         source: 'autocalc',  method: 'Auto-calc from Item Format?', status: 'flag',                 notes: 'Confirm if derived or remove entirely' },
  { name: 'SOP Print',               section: 'Notes / Admin',         source: 'sop',       method: 'Manual print trigger', status: 'flag',                        notes: 'Confirm if still in use — who triggers a print?' },
  /* BOM Revision Sublist */
  { name: 'Item (BOM Sublist)',             section: 'BOM Revision Sublist', source: 'item',    method: 'Component item link — one row per component', status: 'confirmed' },
  { name: 'Customer Item # (BOM Sublist)',  section: 'BOM Revision Sublist', source: 'item',    method: 'Auto from component Item record', status: 'confirmed' },
  { name: 'BOM Quantity (BOM Sublist)',     section: 'BOM Revision Sublist', source: 'bomline', method: 'Set per component row in BOM Revision', status: 'confirmed' },
  { name: 'Quantity (BOM Sublist)',         section: 'BOM Revision Sublist', source: 'bomline', method: 'Set per component row in BOM Revision', status: 'confirmed' },
  { name: 'Units (BOM Sublist)',            section: 'BOM Revision Sublist', source: 'bomline', method: 'Set per component row in BOM Revision', status: 'confirmed' },
  { name: 'Item Source (BOM Sublist)',      section: 'BOM Revision Sublist', source: 'bomline', method: 'Stock / Phantom / Work Order — set per row', status: 'confirmed' },
  { name: 'Item Display Name (BOM Sublist)', section: 'BOM Revision Sublist', source: 'item',   method: 'Auto from component Item record', status: 'confirmed' },
  /* Quality */
  { name: 'Allergens',                 section: 'Quality', source: 'blueprint', method: 'Auto from Blueprint (Quality section)', status: 'confirmed' },
  { name: 'Organic',                   section: 'Quality', source: 'blueprint', method: 'Auto from Blueprint (Quality section)', status: 'confirmed' },
  { name: 'Additional Quality Fields', section: 'Quality', source: 'blueprint', method: 'Auto from Blueprint — full quality field list TBD', status: 'flag', notes: 'Review with Jeffrey which quality fields belong on the SOP beyond Allergens and Organic' },
];

/* ── Node Section Data ──────────────────────────────────────────────────── */
const bpSec=[
  {label:'Customer Specific Information',fields:['Customer Name','Link to Customer Record',{name:'SSA',status:'new'},'Inactive (flag)']},
  {label:'Quality',fields:[{name:'Allergens (from Item)',status:'moved'},{name:'Organic (from Item)',status:'moved'},{name:'⚑ All quality fields — review with Jeffrey',status:'flag'}]},
  {label:'Pallet & Stack Specifications',fields:[{name:'Shelf Life Days (from Item)',status:'moved'},{name:'Minimum Shipping Shelf Life Days (from Item)',status:'moved'},{name:'Finished Good Max Stack Height (from Item)',status:'moved'},{name:'WIP Max Stack Height (from RM Item)',status:'moved'},{name:'Packaging Max Warehouse Stack Height (from Pkg)',status:'moved'}]},
  {label:'Item Specific Information',fields:[{name:'# of Flavors (from Item)',status:'moved'},{name:'Container Size (from Item)',status:'moved'},{name:'Container Type (from Item)',status:'moved'},{name:'Container Spec (from Item)',status:'moved'},{name:'Item Weight (from Item)',status:'moved'},{name:'Item Regex (from Item)',status:'moved'},{name:'Item Regex Message (from Item)',status:'moved'},{name:'Finished System Lot Code Format (from Item)',status:'moved'},{name:'Finished Lot Code Format Description (from Item)',status:'moved'},{name:'WIP System Lot Code Format (from Item)',status:'moved'},{name:'WIP Lot Code Format Description (from Item)',status:'moved'},'Inbound WIP Lot Location',{name:'Lot 1: Placement / Format / Description (from Item)',status:'moved'},{name:'Lot 1: Example / Notes / Image (from Item)',status:'moved'},{name:'Lot 2: Placement / Format / Description (from Item)',status:'moved'},{name:'Lot 2: Example / Notes / Image (from Item)',status:'moved'},'No Printed Lot Required']},
  {label:'Outbound + Shipping Defaults',fields:['Outbound Load Requirements','Airbag Qty','Outbound Load Details','Outbound Load Pattern','Pallet Placard Instructions','Pallet Placard (asset)',{name:'Load Bars (from Item)',status:'moved'},{name:'Load Straps (from Item)',status:'moved'}]},
  {label:'Accounting Defaults',fields:[{name:'Income Account (from Item · RM Item)',status:'moved'},{name:'COGS / Expense Account (from Item · RM Item)',status:'moved'},{name:'Asset Account (from Item · RM Item)',status:'moved'},{name:'Tax Schedule (from Item · RM Item)',status:'moved'}]},
  {label:'Open Decisions',fields:[{name:'Printout — purpose unclear?',status:'flag'}]},
];

const varSec=[
  {label:'⚙ Prerequisites',fields:['Blueprint']},
  {label:'Pricing Summary — Required',fields:[{name:'Custom Form',type:'req'},{name:'Name',type:'req'},{name:'Customer',type:'bp'},{name:'Location',type:'req'},{name:'Price per Case',type:'req',status:'new'}]},
  {label:'Pricing Summary — Manual Optional',fields:[{name:'Start Date',type:'opt'},{name:'Exclude Transport',type:'opt'},{name:'Override Headcount',type:'opt'},{name:'Override Price',type:'opt'},{name:'Double Touch',type:'opt'}]},
  {label:'Pricing Summary — Auto-Calculated',fields:[{name:'PC ID',type:'auto'},{name:'Created By',type:'auto'},{name:'Date Created',type:'auto'},{name:'Last Modified / By',type:'auto'},{name:'Gross Margin %',type:'auto'},{name:'Gross Margin Target',type:'auto'},{name:'Touch 1 Price / Finished Case',type:'auto'},{name:'Touch 2 Price / Finished Case',type:'auto'},{name:'Total Price',type:'auto'},{name:'Price Target',type:'auto'},{name:'Annual Volume',type:'auto'},{name:'Annual Revenue',type:'auto'},{name:'Region',type:'auto'},{name:'Location Zip',type:'auto'},{name:'State',type:'auto'},{name:'Labor Cost',type:'auto'},{name:'Sync to Salesforce',type:'auto'},{name:'Docusign Status',type:'auto'},{name:'Docusign Contract',type:'auto'},{name:'PDF Export',type:'auto'}]},
  {label:'Volume — Required',fields:[{name:'Volume per Run',type:'req'},{name:'Initial Volume',type:'req'},{name:'Jan–Dec Monthly Volume',type:'req'}]},
  {label:'Volume — Manual Optional',fields:[{name:'Year',type:'opt'},{name:'Frequency',type:'opt'}]},
  {label:'Pack Details — Required',fields:[{name:'Finished Pack Format',type:'req'},{name:'Format Type',type:'req'},{name:'Format Type 2',type:'req'},{name:'Touch 1: Flavors',type:'bp'},{name:'Touch 1: Container Size',type:'bp'},{name:'Touch 1: Container Spec',type:'bp'},{name:'Touch 1: Container Type',type:'bp'},{name:'Touch 1: Inbound Case Format',type:'req'},{name:'Touch 1: Inbound Case',type:'req'},{name:'Touch 1: Output Case',type:'req'},{name:'Touch 1: Finished Case',type:'req'},{name:'Touch 2: Finished Pack Format',type:'req'},{name:'Touch 2: Flavors',type:'bp'},{name:'Touch 2: Container Size',type:'bp'},{name:'Touch 2: Inbound Case Format',type:'req'},{name:'Touch 2: Inbound Case',type:'req'},{name:'Touch 2: Output Case',type:'req'},{name:'Touch 2: Finished Case',type:'req'},{name:'Cases per Shift Assumption',type:'req'},{name:'Inbound WIP Cases per Pallet (from RM Item)',type:'req',status:'new'},{name:'Finished Good Cases per Pallet (from Item)',type:'req',status:'new'},{name:'Packaging Cases per Pallet (from Pkg Material)',type:'req',status:'new'}]},
  {label:'Pack Details — Manual Optional',fields:[{name:'Packaging Dieline',type:'opt'},{name:'Pallet Pattern',type:'opt'},{name:'Touch 1: Packaging Dieline Secondary',type:'opt'},{name:'Packaging Die Line 2',type:'opt'},{name:'Touch 2: Pallet Pattern',type:'opt'},{name:'Pallet Pattern HI · TI (from SOP)',type:'opt',status:'moved'},{name:'Shrink Film Image (from SOP)',type:'opt',status:'moved'}]},
  {label:'Production Details — Manual Optional',fields:[{name:'Touch 1: Slipsheets',type:'opt',status:'flag'},{name:'Touch 1: Labels',type:'opt'},{name:'Touch 1: Tray Former',type:'opt'},{name:'Touch 1: Reuse Tray',type:'opt'},{name:'Touch 1: DeKit',type:'opt'},{name:'Touch 1: Cornerboards',type:'opt',status:'flag'},{name:'Touch 1: Number of Labels',type:'opt'},{name:'Touch 2: Slipsheets',type:'opt'},{name:'Touch 2: Labels',type:'opt'},{name:'Touch 2: Tray Former',type:'opt'},{name:'Touch 2: Reuse Tray',type:'opt'},{name:'Touch 2: DeKit',type:'opt'},{name:'Touch 2: Cornerboards',type:'opt'},{name:'Touch 2: Number of Labels',type:'opt'},{name:'Case Label 1: Qty / Size / Placement (from SOP)',type:'opt',status:'moved'},{name:'Case Label 2: Qty / Size / Placement (from SOP)',type:'opt',status:'moved'}]},
  {label:'Assets — Manual Optional',fields:[{name:'Touch 1: Pricing Machine Model',type:'opt'},{name:'Touch 1: Possible Machine Models',type:'opt'},{name:'Touch 1: Asset Type',type:'opt'},{name:'Touch 1: Mandrel Needed',type:'opt'},{name:'Touch 1: New Mandrel Needed',type:'opt'},{name:'Touch 2: Pricing Machine Model',type:'opt'},{name:'Touch 2: Possible Machine Models',type:'opt'},{name:'Touch 2: Asset Type',type:'opt'},{name:'Touch 2: Mandrel Needed',type:'opt'},{name:'Touch 2: New Mandrel Needed',type:'opt'}]},
  {label:'Throughput — Required',fields:[{name:'Touch 1: Output Case / Min',type:'req'},{name:'Touch 1: Machine Setpoint CPM',type:'req'},{name:'Touch 2: Output Case / Min',type:'req'},{name:'Touch 2: Machine Setpoint CPM',type:'req'},{name:'Goal Cases Per Shift',type:'req'}]},
  {label:'Throughput — Auto-Calculated',fields:[{name:'Touch 1: Throughput per Hour',type:'auto'},{name:'Touch 1: Finished Case / Min',type:'auto'},{name:'Touch 1: Uptime',type:'auto'},{name:'Touch 2: Throughput per Hour',type:'auto'},{name:'Touch 2: Finished Case / Min',type:'auto'},{name:'Touch 2: Uptime',type:'auto'}]},
  {label:'Headcount Assumptions — Auto-Calculated',fields:[{name:'Touch 1: Total Headcount',type:'auto'},{name:'Touch 1: Line Lead Headcount',type:'auto'},{name:'Touch 1: DeKitters Headcount',type:'auto'},{name:'Touch 1: Loaders Headcount',type:'auto'},{name:'Touch 1: Palletizers Headcount',type:'auto'},{name:'Touch 2: Total Headcount',type:'auto'},{name:'Touch 2: Line Lead Headcount',type:'auto'},{name:'Touch 2: Palletizers Headcount',type:'auto'}]},
  {label:'Notes & Approval — Required',fields:[{name:'Commercial Notes',type:'req'},{name:'Operations Approval',type:'req'},{name:'Engineering Approval',type:'req'}]},
  {label:'Notes & Approval — Manual Optional',fields:[{name:'CapEx Opportunity',type:'opt'},{name:'Line Layout',type:'opt'},{name:'Engineering Info Needed',type:'opt'},{name:'Ops Information Needed',type:'opt'}]},
  {label:'Notes & Approval — Auto-Calculated',fields:[{name:'Approval Status',type:'auto'}]},
  {label:'SOW — Manual Optional',fields:[{name:'SOJO Services',type:'opt'},{name:'SOJO Materials',type:'opt'},{name:'Customer Materials',type:'opt'},{name:'Sales Rep Email',type:'opt'},{name:'Signee',type:'opt'},{name:"Customer's Legal Name",type:'opt'},{name:'Quote Date',type:'opt'}]},
];

const itmSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint (link)',status:'new'},{name:'Variation / PC (link)',status:'new'}]},
  {label:'Primary Information — Required',fields:[{name:'Display Name / Code',type:'req'},{name:'Customer',type:'bp'},{name:'Custom Form (from Blueprint)',type:'bp'},{name:'Customer Item #',type:'req'}]},
  {label:'Primary Information — Manual Optional',fields:[{name:'Inactive',type:'opt'},{name:'Description',type:'opt'},{name:'UPC Code',type:'opt'},{name:'Sub-Assembly',type:'opt'},{name:'Final Touch Item',type:'opt'},{name:'Target per Shift',type:'opt'},{name:'Retailer Item #',type:'opt'},{name:'Minimum Shipping Shelf Life Days (from Blueprint)',type:'bp'},{name:'Allergens (from Blueprint)',type:'bp'},{name:'Organic (from Blueprint)',type:'bp'}]},
  {label:'Primary Information — Auto-Calculated',fields:[{name:'Internal ID (auto-generated)',type:'auto'},{name:'Item Name / Number (auto-generated)',type:'auto'}]},
  {label:'⚠ Configuration Requirements — Removed (live in Blueprint)',fields:[{name:'Printed Lot Format → Blueprint',status:'rem'},{name:'Finished System Lot Format → Blueprint',status:'rem'},{name:'Item Regex → Blueprint',status:'rem'},{name:'Item Image → Blueprint',status:'rem'},{name:'Stickering → Blueprint',status:'rem'}]},
  {label:'SOJO Details — Required',fields:[{name:'Cases Per Pallet (from Variation)',type:'var'},{name:'Pallet Type',type:'req'},{name:'Finished Good Max Stack Height (from Blueprint)',type:'bp'}]},
  {label:'SOJO Details — Manual Optional',fields:[{name:'SOP Link',type:'opt',status:'flag'},{name:'Eaches per Master CS',type:'opt',status:'flag'},{name:'Package Type',type:'opt',status:'flag'},{name:'Number of Forklifts',type:'opt',status:'flag'},{name:'Corner Boards',type:'opt',status:'flag'},{name:'Slipsheets',type:'opt',status:'flag'},{name:'Pallet Inventory Item',type:'opt',status:'flag'},{name:'Load Bars (from Blueprint)',type:'bp'},{name:'Enforce 6 Digit Lot Code',type:'opt',status:'flag'},{name:'Flavors (from Blueprint)',type:'bp'},{name:'Container Size (from Blueprint)',type:'bp'},{name:'Container Spec (from Blueprint)',type:'bp'},{name:'Container Type (from Blueprint)',type:'bp'}]},
  {label:'Segmentation — Required',fields:[{name:'Department',type:'req',status:'flag'},{name:'Location',type:'req',status:'flag'}]},
  {label:'Item Detail — Manual Optional',fields:[{name:'WIP Unit Type',type:'opt'},{name:'Size',type:'opt',status:'flag'},{name:'Pricing Calculator Approved',type:'opt',status:'flag'},{name:'Scope of Work Signed',type:'opt',status:'flag'},{name:'Format Type',type:'opt',status:'flag'}]},
  {label:'Item Detail — Auto-Calculated',fields:[{name:'Multiplier / Scale',type:'auto'},{name:'Primary Stock Unit (from Units Type)',type:'auto'},{name:'Primary Purchase Unit',type:'auto'},{name:'Primary Sale Unit',type:'auto'},{name:'Base Unit',type:'auto'}]},
];

const bomSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint',type:'req'},{name:'Variation / PC',type:'req'},{name:'Item (via Restrict to Assemblies)',type:'req'}]},
  {label:'BOM — Required',fields:[{name:'Name',type:'req'},{name:'Restrict to Assemblies (links to Item / VP#)',type:'req'},{name:'Revisions',type:'req'},{name:'Assemblies → VP#',type:'req'},{name:'Subsidiary',type:'req'}]},
  {label:'BOM — Manual Optional',fields:[{name:'Memo',type:'opt'},{name:'Use Component Yield',type:'opt'},{name:'Available for All Assemblies',type:'opt'},{name:'Restrict to Locations',type:'opt'},{name:'Inactive',type:'opt'},{name:'Include Children — do we need this?',type:'opt',status:'flag'}]},
  {label:'BOM — Auto-Calculated',fields:[{name:'Used on Assembly',type:'auto'},{name:'Available for All Locations',type:'auto'},{name:'Date Created',type:'auto'}]},
];

const bomLineSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Bill of Materials (parent BOM must exist)',type:'req'}]},
  {label:'BOM Revision — Required',fields:[{name:'Name (from Bill of Materials)',type:'bom'},{name:'Item',type:'req'},{name:'Quantity',type:'req'}]},
  {label:'BOM Revision — Manual Optional',fields:[{name:'Memo',type:'opt'},{name:'Effective Start Date — do we need this?',type:'opt',status:'flag'},{name:'Effective End Date — do we need this?',type:'opt',status:'flag'},{name:'Inactive',type:'opt'}]},
  {label:'BOM Revision — Auto-Calculated',fields:[{name:'Bill of Materials (parent link)',type:'auto'},{name:'Customer Item #',type:'auto'},{name:'BOM Quantity',type:'auto'},{name:'Units',type:'auto'},{name:'Item Source',type:'auto'},{name:'Item Display Name',type:'auto'},{name:'Date Created',type:'auto'}]},
];

const rmSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint (link)',status:'new'},{name:'Variation / PC (link)',status:'new'}]},
  {label:'Primary Information — Required',fields:[{name:'Display Name / Code',type:'req'},{name:'Customer (from Blueprint)',type:'bp'},{name:'Pallet Type',type:'req'}]},
  {label:'Primary Information — Manual Optional',fields:[{name:'Item is Pallet',type:'opt'},{name:'Inactive',type:'opt'},{name:'Sub Item Of',type:'opt'},{name:'Artwork Filed',type:'opt'},{name:'UPC Code',type:'opt'},{name:'Item Image',type:'opt'}]},
  {label:'SOJO Details — Required',fields:[{name:'Vendor Item #',type:'req'},{name:'Max Warehouse Stacking (from Blueprint)',type:'bp'}]},
  {label:'SOJO Details — Manual Optional',fields:[{name:'Shield Item Type — do we need this?',type:'opt',status:'flag'},{name:'Pallet Inventory Item — do we need this?',type:'opt',status:'flag'},{name:'Stickering — do we need this?',type:'opt',status:'flag'},{name:'Date Code Requirements — do we need this?',type:'opt',status:'flag'},{name:'Raven Item Name — do we need this?',type:'opt',status:'flag'},{name:'Container Size (from Blueprint)',type:'bp'},{name:'Container Spec (from Blueprint)',type:'bp'},{name:'Container Type (from Blueprint)',type:'bp'},{name:'Exclude from Lot Validation — do we need this?',type:'opt',status:'flag'},{name:'Enforce 6 Digit Lot Code — do we need this?',type:'opt',status:'flag'}]},
  {label:'Segmentation — Required',fields:[{name:'Department — do we need this?',type:'req',status:'flag'},{name:'Location — do we need this?',type:'req',status:'flag'}]},
  {label:'Item Detail — Required',fields:[{name:'Cases per Pallet (from Variation)',type:'var'},{name:'Units Type (from Variation)',type:'var'}]},
  {label:'Item Detail — Manual Optional',fields:[{name:'Relationship — do we need this?',type:'opt',status:'flag'},{name:'Minimum Shipping Shelf Life — do we need this?',type:'opt',status:'flag'},{name:'WIP Unit Type — do we need this?',type:'opt',status:'flag'}]},
];

const pkgSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint (link)',status:'new'},{name:'Variation / PC (link)',status:'new'}]},
  {label:'Primary Information — Required',fields:[{name:'Display Name / Code',type:'req'},{name:'Customer (from Blueprint)',type:'bp'}]},
  {label:'Primary Information — Manual Optional',fields:[{name:'Sub Item Of',type:'opt'},{name:'Inactive',type:'opt'},{name:'Pallet Type',type:'opt'},{name:'Artwork Files',type:'opt'},{name:'Item Image',type:'opt'},{name:'UPC Code',type:'opt'}]},
  {label:'SOJO Details — Required',fields:[{name:'Vendor Item #',type:'req'},{name:'Max Warehouse Stacking (from Blueprint)',type:'bp'}]},
  {label:'SOJO Details — Manual Optional',fields:[{name:'Shield Item Type — do we need this?',type:'opt',status:'flag'},{name:'Stickering — do we need this?',type:'opt',status:'flag'},{name:'Date Code Requirements — do we need this?',type:'opt',status:'flag'},{name:'Container Size (from Blueprint)',type:'bp'},{name:'Container Spec (from Blueprint)',type:'bp'},{name:'Container Type (from Blueprint)',type:'bp'}]},
  {label:'Segmentation — Required',fields:[{name:'Department — do we need this?',type:'req',status:'flag'},{name:'Location — do we need this?',type:'req',status:'flag'}]},
  {label:'Item Detail — Required',fields:[{name:'Cases per Pallet (from Variation)',type:'var'},{name:'Units Type (from Variation)',type:'var'}]},
];

const coSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint',type:'req'},{name:'Variation / PC',type:'req'},{name:'Item (via Item field)',type:'req'},{name:'BOM (via Bill of Materials)',type:'req'}]},
  {label:'Primary Information — Required',fields:[{name:'Owner (from Customer Hub)',type:'ch'},{name:'Purchase Order (from Customer Hub)',type:'ch'},{name:'Customer (from Customer Hub)',type:'ch'},{name:'Quantity (from Customer Hub)',type:'ch'},{name:'Price Level (from Customer Hub)',type:'ch'},{name:'Item (from Customer Hub)',type:'ch'},{name:'WIP Delivery Date (from Customer Hub)',type:'ch'},{name:'Forecast Month',type:'req'},{name:'Goal Cases Per Shift (from Variation)',type:'auto'}]},
  {label:'Primary Information — Manual Optional',fields:[{name:'Non Standard Work',type:'opt'},{name:'Start Date',type:'opt'},{name:'End Date',type:'opt'},{name:'WIP Already On Site',type:'opt'}]},
  {label:'Primary Information — Auto-Calculated',fields:[{name:'ID',type:'auto'},{name:'Date Created',type:'auto'},{name:'Location Price',type:'auto'},{name:'Status',type:'auto'}]},
  {label:'Line — Manual Optional',fields:[{name:'Bay',type:'opt'}]},
  {label:'Scheduling — Required',fields:[{name:'Location (from Customer Hub)',type:'ch'}]},
  {label:'Scheduling — Manual Optional',fields:[{name:'Unique Work Order',type:'opt'},{name:'Annex Inventory',type:'opt'}]},
  {label:'Scheduling — Removed Fields',fields:[{name:'SOP',status:'rem'},{name:'SOP CS / Shift',status:'rem'},{name:'SOP Headcount',status:'rem'}]},
  {label:'BOM — Required',fields:[{name:'Bill of Materials',type:'req'},{name:'Bill of Materials Revision',type:'req'}]},
  {label:'Headcount — Required',fields:[{name:'Headcount (from Variation)',type:'req'}]},
  {label:'Planning — Required',fields:[{name:'Plan For Shifts',type:'req'}]},
  {label:'Planning — Manual Optional',fields:[{name:'Schedule Saturdays',type:'opt'},{name:'Schedule Sundays',type:'opt'}]},
  {label:'Planning — Auto-Calculated',fields:[{name:'Build Quantity',type:'auto'},{name:'Quantity on Work Orders',type:'auto'},{name:'Scale WO Closure',type:'auto'}]},
];

const woSec=[
  {label:'⚙ Prerequisites',fields:[{name:'Blueprint',type:'req'},{name:'Variation / PC',type:'req'},{name:'Item',type:'req'},{name:'BOM',type:'req'},{name:'Customer Order',type:'req'}]},
  {label:'Primary Information — Required',fields:[{name:'Customer Project (from Customer Order)',type:'co'},{name:'Assembly (from Customer Order)',type:'co'},{name:'Bill of Materials (from Customer Order)',type:'co'},{name:'Bill of Materials Revision (from Customer Order)',type:'co'},{name:'Quantity (from Customer Order)',type:'co'},{name:'Date',type:'req'},{name:'Status (from Customer Order)',type:'co'},{name:'Customer PO (from Customer Order)',type:'co'},{name:'Goal Cases Per Shift (from Customer Order)',type:'co'}]},
  {label:'Primary Information — Manual Optional',fields:[{name:'Work Order Invoiced?',type:'opt'},{name:'Memo',type:'opt'}]},
  {label:'Primary Information — Auto-Calculated',fields:[{name:'Order #',type:'auto'},{name:'Created Date',type:'auto'}]},
  {label:'Production Line — Required',fields:[{name:'Bay (from Customer Order)',type:'co'}]},
  {label:'Commercial Validation — Removed',fields:[{name:'SOP',status:'rem'},{name:'Customer SSA Signed',status:'rem'}]},
  {label:'Classification — Required',fields:[{name:'Subsidiary (from Customer Order)',type:'co'},{name:'Department (from Customer Order)',type:'co'},{name:'Location (from Customer Order)',type:'co'},{name:'Price Level (from Customer Order)',type:'co'}]},
  {label:'Standard Cost — Required',fields:[{name:'Customer Order',type:'req'},{name:'Headcount (from Customer Order)',type:'req'}]},
  {label:'Standard Cost — Manual Optional',fields:[{name:'Allow to Build Partial Pallets',type:'opt'},{name:'WO PO#',type:'opt'}]},
  {label:'Standard Cost — Auto-Calculated',fields:[{name:'Standard Cost',type:'auto'},{name:'Revenue Built',type:'auto'},{name:'Temp Labor Cost — STD',type:'auto'},{name:'Fixed Labor Cost — STD',type:'auto'},{name:'Standard Gross Margin',type:'auto'},{name:'Project Format Type',type:'auto'}]},
];

const acSec=[
  {label:'Derived at SOP Generation — No Manual Entry',fields:[
    {name:'SOP Name (naming convention TBD)',status:'flag'},
    {name:'Status (derived from WO)',status:'flag'},
    {name:'Published (auto-trigger?)',status:'flag'},
    'Pricing Calculator ID (from Variation)','Second Touch (from Variation)',
    'Total # People (sum of headcount)',
    {name:'Pallet Configuration (formula TBD)',status:'flag'},
    'Date Created / Last Modified','Operations Printout (generated on SOP creation)',
    {name:'Project Format (auto-calc?)',status:'flag'},
  ]},
];

/* ── Node layout config for SVG engine ─────────────────────────────────── */
const NODE_LAYOUT = {
  blueprint:     { sections: bpSec,      w: 1140, x: null /* centered */, cols: 2 },
  variation:     { sections: varSec,     w: 820,  x: 24,                  cols: 2 },
  item:          { sections: itmSec,     w: 400,  x: 875,                 cols: 1 },
  bom:           { sections: bomSec,     w: 480,  x: 1305,                cols: 1 },
  bomline:       { sections: bomLineSec, w: 480,  x: 1305,                cols: 1 },
  rmitem:        { sections: rmSec,      w: 400,  x: 875,                 cols: 1 },
  pkgitem:       { sections: pkgSec,     w: 400,  x: 875,                 cols: 1 },
  customerorder: { sections: coSec,      w: 820,  x: null /* centered */, cols: 2 },
  workorder:     { sections: woSec,      w: 1140, x: null /* centered */, cols: 2 },
  autocalc:      { sections: acSec,      w: 860,  x: null /* centered */, cols: 1 },
};

/* ── PRICE FLOW DATA ────────────────────────────────────────────────────────
   Drives the Price Flow sub-view. Edit the text here to adjust step copy
   without touching the rendering code. Each step has:
     n      → step number shown on the card
     node   → which record this step is anchored to (variation/item/bom/customerorder/sop)
     title  → short bold headline
     summary→ one-sentence lede
     detail → full explanation shown in the side panel
═══════════════════════════════════════════════════════════════════════════ */
const PRICE_STEPS = [
  { n: 1, node: 'variation',
    title: 'Price is defined at the Variation / PC level',
    summary: 'The Price field lives on the Variation / PC record — single source of truth.',
    detail:  'The Price field lives on the Variation / PC record. This is the single source of truth for price across the entire system. No price lives on the Item record by default.' },
  { n: 2, node: 'item',
    title: 'Variation links to an Item through a required PC record',
    summary: 'When a PC is linked to an Item, the Item Price Level auto-populates.',
    detail:  'Just like a PC record is required before an SOP can be generated, a Variation / PC record must be linked to an Item before that Item has a price. When the PC is linked to the Item, the Price Level field on the Item automatically populates based on the Price field from the linked Variation.' },
  { n: 3, node: 'item',
    title: 'Multiple Variations can link to the same Item',
    summary: 'A second Variation attaches with "Link Variation to Item" — no new Item.',
    detail:  'If a second Variation / PC is created for the same Item, the system must allow multiple Variations to link to one Item. This gives the Item multiple Price Levels per location — e.g. "Langhorne Price Level 1" from Variation 1 and "Langhorne Price Level 2" from Variation 2. The user action is a "Link Variation to Item" button.' },
  { n: 4, node: 'item',
    title: 'Second Price Level auto-populates — and stays live',
    summary: 'Updating the Variation refreshes the Item Price Level automatically.',
    detail:  'When two Variations are tied to one Item, the second PC automatically populates the second Price Level. This is a live relationship — whenever the Variation record is updated, the corresponding Price Level on the Item refreshes automatically.' },
  { n: 5, node: 'bom',
    title: 'Price field added to the BOM (required)',
    summary: 'Item + Variation + BOM → only one valid price. 1:1 lock.',
    detail:  'A Price field is added to the BOM record. This field is required. When the BOM is created with an Item and specific Variation / PC linked, the price level has only one valid combination — it can auto-fill or present a single-option selection. This creates a 1:1 relationship between BOM and price.' },
  { n: 6, node: 'customerorder',
    title: 'Planner clarity at the Customer Order level',
    summary: 'The BOM carries the price — planners always know which price is attached.',
    detail:  'Because the BOM carries a price, planners can identify the correct BOM for any Customer Order and know exactly which price is attached to that production run. This answers the question: "How do we know what price is attached to which production run?" The BOM defines it — and the BOM is required to create a CO.' },
  { n: 7, node: 'sop',
    title: 'Price still exists at the Item level for billing',
    summary: 'Production billing is unchanged. We are centralizing accuracy, not removing fields.',
    detail:  'We are not removing price from the Item record. Production billing is not affected. All we are doing is centralizing the price field so it flows cleanly: Variation → Item (Price Level) → BOM (required Price field) → CO (locked price at creation). This eliminates any doubt about whether the correct price is accurate on every Customer Order.' },
];
const PRICE_FLOW_SUMMARY = 'Price does not change at the Item level. Billing is not affected. This flow centralizes price accuracy from Variation to CO.';
const PRICE_QUESTIONS = [
  {
    n: 1,
    title: 'How do we link multiple Pricing Calculators to a single Item?',
    body:  'We need to decide how the relationship between a Variation / PC and an Item is established and managed when more than one PC exists for the same Item. Two options are on the table:',
    options: [
      { label: 'A',
        name:  'Multiple fields in the main section of the Item record',
        body:  'Each Variation / PC link gets its own dedicated field directly on the Item (e.g. PC Link 1, PC Link 2). This makes the relationship visible on the Item form itself but could become unwieldy if a customer has many Variations.' },
      { label: 'B',
        name:  'The link comes from the Account Manager through the PC record',
        body:  'The AM or commercial team attaches the PC to the Item from the PC side (using a "Link Variation to Item" button on the PC record) rather than from the Item side. This keeps the relationship driven by the commercial workflow and reduces the burden on whoever is creating the Item.' },
    ],
    close: "Which approach best fits the team's workflow while maintaining data integrity?",
  },
  {
    n: 2,
    title: 'Should the BOM price level auto-populate or require a single manual selection?',
    body:  'When the Item and the correct Variation / PC are both linked on a BOM, there is only one valid price level combination for that specific pairing. We need to decide whether the system should:',
    options: [
      { label: 'A',
        name:  'Automatically populate the price level field on the BOM',
        body:  'When both the Item and PC are linked, the system fills in the price level. This eliminates any user decision and removes the risk of selecting the wrong price. It assumes the system can always determine the correct combination without input.' },
      { label: 'B',
        name:  'Present a single-option dropdown to the person creating the BOM',
        body:  'The user makes an explicit selection, even if there is only one valid choice. This gives the user a moment of confirmation and creates an audit trail of who selected the price.' },
    ],
    close: 'The goal is a 1:1 price-to-BOM relationship. The question is whether that relationship should be enforced silently by the system or confirmed explicitly by the user.',
  },
  {
    n: 3,
    title: 'Should the Customer Order price auto-populate when the BOM is entered?',
    body:  'Because the BOM now carries a required price field, when a planner enters the BOM on a Customer Order, the system has everything it needs to determine the correct price for that production run. The question is whether to:',
    options: [
      { label: 'A',
        name:  'Automatically populate the price field on the Customer Order the moment the BOM is selected',
        body:  'This creates a seamless experience for planners and eliminates manual price entry at the CO level. The price lock happens automatically.' },
      { label: 'B',
        name:  'Pull the price from the BOM but require the planner or commercial team to confirm it before it is locked',
        body:  'This adds one step but ensures a human has reviewed the price before it is committed to the Customer Order and passed to production.' },
    ],
    close: 'This decision directly answers the operational question: "How do we ensure planners always have the right price on every Customer Order without introducing room for error?"',
  },
];

/* ── PRODUCTION INTEGRITY DATA ──────────────────────────────────────────────
   Drives the Production Integrity sub-view (CO = locked scope · Production
   Plan = flexible execution · Change Order = formal amendment).
   Edit the text here to adjust the view — "update scenario 2" means edit
   PI_SCENARIOS[1] below. Comparison table example values live in
   PI_COMPARISON. Layer tooltip copy lives in PI_TOOLTIPS.
═══════════════════════════════════════════════════════════════════════════ */
const PI_TOOLTIPS = {
  co:     'Locked after customer approval — this is your legal and financial record. Never edit this directly.',
  plan:   'This is where ops works. Edit freely — the CO stays protected.',
  change: 'Every customer-driven change is logged here. Full audit trail of who changed what and when.',
  wo:     'Shift-level execution records, generated from the Production Plan. Completions roll up into the Plan built quantity.',
};

const PI_CALLOUT = 'The CO is not a production document. It is a contract. Treating it as one destroys your ability to measure whether you delivered what you promised. The Production Plan is where production lives. The CO is where accountability lives.';

const PI_COMPARISON = {
  rows: [
    { field: 'Quantity', co: '175,000 cases — agreed',        plan: '150,000 cases — after Change Order #1', actual: '148,920 cases built' },
    { field: 'Price',    co: '$0.92 / case — locked',         plan: '$0.92 / case — unchanged',              actual: '$0.92 billed per case built' },
    { field: 'BOM',      co: 'BOM 1998 · Rev 2263',           plan: 'BOM 1998 · Rev 2271 — spec change',     actual: 'Built on Rev 2271' },
    { field: 'Timeline', co: 'Apr 9 – Apr 16',                plan: 'Apr 9 – Apr 19 — extended',             actual: 'Completed Apr 18' },
  ],
  variance: {
    co:     'Baseline — what we promised',
    plan:   '−25,000 cases vs scope · +3 days',
    actual: '−1,080 cases vs plan · 99.3% of plan',
  },
};

const PI_SCENARIOS = [
  { n: 1,
    title: 'Customer changes quantity before production',
    tag: 'Customer-driven',
    flow: ['Change Order created', 'Production Plan updated', 'CO unchanged'],
    before: 'CO locked at 175,000 cases. Production Plan mirrors the CO. No Work Orders released yet.',
    after:  'Change Order #1 logs the request (who, what, why, when) and updates the Production Plan to 150,000 cases. The CO still reads 175,000 — the original agreement is preserved for the final comparison.' },
  { n: 2,
    title: 'Ops adjusts mid-run (equipment issue)',
    tag: 'Ops-driven',
    flow: ['Production Plan edited directly', 'WOs regenerate', 'CO and Change Orders untouched'],
    before: 'Bay 3 goes down mid-run. The remaining schedule and shift plan no longer work.',
    after:  'Planning edits the Production Plan directly — new bay, new shift schedule — and the open Work Orders regenerate from the Plan. No Change Order is needed because the customer scope did not change. The CO is never touched.' },
  { n: 3,
    title: 'Customer changes BOM spec last minute',
    tag: 'Customer-driven',
    flow: ['New BOM Revision created', 'Change Order links old + new revision', 'Production Plan switches to new BOM', 'CO still references original'],
    before: 'CO references BOM 1998 · Rev 2263. Customer requests a sticker spec change two days before the run.',
    after:  'A new BOM Revision (2271) is created. The Change Order records both revisions — old and new — and the Production Plan switches to Rev 2271. The CO keeps its original reference, so the comparison report can show exactly what changed and who authorized it.' },
  { n: 4,
    title: 'All WOs complete successfully',
    tag: 'Happy path',
    flow: ['Production Plan = 100% built', 'CO closes automatically', 'Final comparison report generates'],
    before: 'Work Order completions roll up into the Production Plan built quantity until the Plan reaches its target.',
    after:  'When the Plan hits 100% built, the CO closes automatically and the final comparison report generates: CO scope vs. Plan (with every Change Order) vs. WO actuals — the planned-versus-actual story, end to end.' },
];

/* ── DATA FLOW VIEW DATA ────────────────────────────────────────────────────
   Drives the "Data Flow" sub-view — the redesigned Blueprint Flow showing
   where each record's fields pull from. Chips are clickable (jump to the
   record in the Source Map). The per-record source-mix bar is computed live
   from FIELDS_DATA, so it always matches the Source Map exactly.
   "Update the data flow for X" → edit the matching entry below.
═══════════════════════════════════════════════════════════════════════════ */
const DF_FLOW = [
  { node: 'blueprint',
    headline: 'Auto-sourced from Variation + Item · or manual entry',
    chips: [
      { t: '⟲ Variation / PC (auto)', c: '#D4A830', jump: 'variation' },
      { t: '⟲ Item (auto)', c: '#5ACA5A', jump: 'item' },
      { t: '✍ Manual entry — Sales', c: '#9A9AB0' },
    ],
    note: 'Fields marked ⤴ in the Source Map rolled UP from Item / RM Item / Variation — the Blueprint inherits them automatically instead of being typed twice.' },
  { node: 'variation',
    headline: 'Manual pricing + production inputs · customer info from Blueprint',
    chips: [
      { t: 'Blueprint (auto)', c: '#5A9CD8', jump: 'blueprint' },
      { t: '✍ Manual entry — Sales', c: '#9A9AB0' },
      { t: '🧮 Auto-calculated', c: '#40C0C0' },
    ],
    note: 'The pricing calculator: required inputs in red, ~20 auto-calculated outputs in teal.' },
  { node: 'item',
    headline: 'Inherits from Blueprint + Variation · CSMs fill the rest',
    chips: [
      { t: 'Blueprint (auto)', c: '#5A9CD8', jump: 'blueprint' },
      { t: 'Variation / PC (auto)', c: '#D4A830', jump: 'variation' },
      { t: '✍ Manual entry — CSMs', c: '#9A9AB0' },
    ],
    note: 'Price Levels auto-populate from every linked Variation and stay live.' },
  { node: 'rmitem',
    headline: 'Container specs from Blueprint · units from Variation',
    chips: [
      { t: 'Blueprint (auto)', c: '#5A9CD8', jump: 'blueprint' },
      { t: 'Variation / PC (auto)', c: '#D4A830', jump: 'variation' },
      { t: '✍ Manual entry — CSMs', c: '#9A9AB0' },
    ] },
  { node: 'pkgitem',
    headline: 'Same sourcing pattern as RM Item',
    chips: [
      { t: 'Blueprint (auto)', c: '#5A9CD8', jump: 'blueprint' },
      { t: 'Variation / PC (auto)', c: '#D4A830', jump: 'variation' },
      { t: '✍ Manual entry — CSMs', c: '#9A9AB0' },
    ] },
  { node: 'bom',
    headline: 'Links the Item · recipe header',
    chips: [
      { t: 'Item (via Restrict to Assemblies)', c: '#5ACA5A', jump: 'item' },
      { t: '✍ Manual entry — CSMs', c: '#9A9AB0' },
    ] },
  { node: 'bomline',
    headline: 'Component rows reference Item · RM Item · Packaging Material',
    chips: [
      { t: 'BOM (parent)', c: '#4ACAC8', jump: 'bom' },
      { t: 'Item / RM / Pkg (component rows)', c: '#E898D0', jump: 'rmitem' },
      { t: '✍ Manual entry — CSMs', c: '#9A9AB0' },
    ] },
  { node: 'customerorder',
    headline: 'Order data from Customer Hub · locked to the project chain',
    chips: [
      { t: 'Customer Hub (auto)', c: '#D08840' },
      { t: 'Variation / Item / BOM (links)', c: '#D4A830', jump: 'variation' },
      { t: '🧮 Auto-calculated', c: '#40C0C0' },
    ],
    note: 'Customer Approval gates creation — every CO is customer-approved by definition.' },
  { node: 'workorder',
    headline: 'Inherits the CO · Ops enters run actuals',
    chips: [
      { t: 'Customer Order (auto)', c: '#9060D0', jump: 'customerorder' },
      { t: '✍ Run actuals — Ops', c: '#9A9AB0' },
      { t: '🧮 Auto-calculated costs', c: '#40C0C0' },
    ] },
  { node: 'sop',
    headline: 'Auto-assembled from every record above — zero re-entry',
    chips: [
      { t: 'All upstream records', c: '#A0B0F0' },
    ],
    note: 'The source-mix bar below shows exactly which records feed the SOP fields — computed live from the Source Map data.' },
];

/* ── ERD DATA ───────────────────────────────────────────────────────────────
   High-level entity boxes (PK + link fields) with relationship lines.
   The 🔗 link rows render LIVE from each record's "⚙ Prerequisites" section
   in FIELDS_DATA (rem-flagged prereqs are skipped automatically), so the ERD
   stays in sync with Source Map edits. `fks` is only the fallback for
   entities without a Prerequisites section; `extra` rows are appended after
   the live prerequisites. Clicking an entity drills into its full field
   list, also pulled live from FIELDS_DATA.
═══════════════════════════════════════════════════════════════════════════ */
const ERD_ENTITIES = [
  { id: 'blueprint',     x: 460, y: 30,   w: 260, pk: 'Blueprint ID',       fks: ['Customer (link)'] },
  { id: 'variation',     x: 80,  y: 240,  w: 260, pk: 'PC ID',              extra: ['Item (link via price levels)'] },
  { id: 'item',          x: 460, y: 240,  w: 260, pk: 'VP# / Internal ID' },
  { id: 'rmitem',        x: 840, y: 200,  w: 260, pk: 'RM# / Internal ID' },
  { id: 'pkgitem',       x: 840, y: 400,  w: 260, pk: 'Item Name / Number' },
  { id: 'bom',           x: 290, y: 480,  w: 250, pk: 'BOM Name' },
  { id: 'bomline',       x: 560, y: 480,  w: 250, pk: 'Revision Name',      extra: ['Component rows → Item · RM · Pkg'] },
  { id: 'approval',      x: 80,  y: 720,  w: 260, pk: 'Approval ID',        fks: ['SOW / Docusign contract'] },
  { id: 'customerorder', x: 450, y: 700,  w: 280, pk: 'CO ID',              extra: ['Customer (Hub)'] },
  { id: 'workorder',     x: 450, y: 940,  w: 280, pk: 'WO # (tranid)' },
  { id: 'sop',           x: 450, y: 1150, w: 280, pk: 'SOP Record ID',      fks: ['Work Order (1:1)', 'Reads all upstream records'] },
];

const ERD_LINKS = [
  { from: 'variation',     to: 'blueprint',     card: 'N : 1', label: 'requires · SSA signed' },
  { from: 'item',          to: 'blueprint',     card: 'N : 1', label: 'requires' },
  { from: 'item',          to: 'variation',     card: '1 : N', label: 'price levels · SOW + PC approved gates' },
  { from: 'rmitem',        to: 'blueprint',     card: 'N : 1', label: '' },
  { from: 'pkgitem',       to: 'blueprint',     card: 'N : 1', label: '' },
  { from: 'bom',           to: 'item',          card: 'N : 1', label: 'restrict to assemblies' },
  { from: 'bomline',       to: 'bom',           card: 'N : 1', label: 'revision of' },
  { from: 'bomline',       to: 'rmitem',        card: 'N : M', label: 'component rows', dashed: true },
  { from: 'bomline',       to: 'pkgitem',       card: 'N : M', label: '', dashed: true },
  { from: 'customerorder', to: 'approval',      card: '',      label: 'gated by customer approval', dashed: true },
  { from: 'customerorder', to: 'variation',     card: 'N : 1', label: '' },
  { from: 'customerorder', to: 'item',          card: 'N : 1', label: '' },
  { from: 'customerorder', to: 'bomline',       card: 'N : 1', label: 'locked revision' },
  { from: 'workorder',     to: 'customerorder', card: 'N : 1', label: 'generated from' },
  { from: 'sop',           to: 'workorder',     card: '1 : 1', label: 'auto-generated' },
];
