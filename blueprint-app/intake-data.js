/* intake-data.js — Customer Intake Form (Proof of Concept)
   ═══════════════════════════════════════════════════════════════════════════
   All form definitions live HERE — the form renders entirely from this file.
   - INTAKE_SECTIONS  → sections, fields, types, options, helpers, required
                        flags, conditional rules ("add a field to Section 3")
   - BOM_ROW_FIELDS   → the repeating Section 8 component rows
   - APPROVED_SUPPLIERS → supplier dropdown list ("add a supplier")
   - INTAKE_FIELD_MAP → NetSuite destinations { record, section, fieldName }
   - COMPLEXITY_CONFIG → scoring weights + banding ("make custom lot codes weigh 3")
   - INTERNAL_ONLY_FIELDS → fields customers can never provide

   Field shape: { id, label, type, required, helper, options[], showIf }
   type: text | email | date | number | select | multiselect | textarea | file | note
   showIf: { field:'otherFieldId', equals:'Yes' } or { field, equalsAny:['1','2'] }
   ═══════════════════════════════════════════════════════════════════════════ */

const APPROVED_SUPPLIERS = ['DrinkPak', 'Zumbiel', 'Other (specify)'];

const INTAKE_SECTIONS = [
  { id: 's1', num: 1, title: 'Project Overview', scope: 'project',
    desc: 'Filled once per submission — who you are and when you need this running.',
    fields: [
      { id: 'customerName',   label: 'Customer Name',          type: 'text',  required: true, helper: "Your company's legal name as it appears on purchase orders" },
      { id: 'contactName',    label: 'Customer Contact Name',  type: 'text',  required: true },
      { id: 'contactEmail',   label: 'Customer Contact Email', type: 'email', required: true },
      { id: 'targetStartDate',label: 'Target Start Date',      type: 'date',  required: true },
    ]},
  { id: 's2', num: 2, title: 'Product Identity & Configuration', scope: 'product',
    desc: 'What this product is and how it packs out. One product = one BOM.',
    fields: [
      { id: 'itemName',          label: 'Project / Item Name',   type: 'text', required: true, helper: 'e.g. SOJO Tropical 4flv-12PK' },
      { id: 'customerItemNumber',label: 'Customer Item Number',  type: 'text', required: true, helper: 'Your internal SKU' },
      { id: 'formatType',        label: 'Format Type',           type: 'select', required: true, options: ['Tray','Carton','Shrink Only','Tray + Shrink','Other'] },
      { id: 'finishedPackFormat',label: 'Finished Pack Format',  type: 'text', required: true, helper: 'e.g. 2X12-24PK, 4X6-24PK' },
      { id: 'containerSize',     label: 'Container Size',        type: 'text', required: true, helper: 'e.g. 12oz, 16oz, 750ml' },
      { id: 'containerType',     label: 'Container Type',        type: 'select', required: true, options: ['Can','Bottle','Carton','Pouch','Other'] },
      { id: 'containerSpec',     label: 'Container Spec',        type: 'text', required: true, helper: 'e.g. Sleek, Standard, Slim' },
      { id: 'numFlavors',        label: 'Number of Flavors',     type: 'number', required: true },
      { id: 'inboundCaseCount',  label: 'Inbound Case Count',    type: 'number', required: true, helper: 'Units per inbound WIP case' },
      { id: 'casesPerPallet',    label: 'Cases per Pallet',      type: 'number', required: true, helper: 'Finished good cases per outbound pallet' },
      { id: 'palletType',        label: 'Pallet Type',           type: 'select', required: true, options: ['GMA Whitewood','Plastic','CHEP','Other'] },
      { id: 'masterCaseShrink',  label: 'Does the master case require shrink?', type: 'select', required: true, options: ['Yes','No'] },
    ]},
  { id: 's3', num: 3, title: 'Quality & Compliance', scope: 'product',
    desc: 'Allergens, certifications, shelf life, and anything regulatory.',
    fields: [
      { id: 'allergensPresent', label: 'Allergens present?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'allergenList',     label: 'Which allergens?',   type: 'multiselect', options: ['Dairy','Gluten','Soy','Nuts','Eggs','Hemp','Other'], showIf: { field: 'allergensPresent', equals: 'Yes' } },
      { id: 'organic',          label: 'Certified organic?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'regulatory',       label: 'Regulatory / food safety considerations?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'regulatoryDesc',   label: 'Describe the considerations', type: 'textarea', showIf: { field: 'regulatory', equals: 'Yes' } },
      { id: 'shelfLife',        label: 'Product shelf life', type: 'text', required: true, helper: 'e.g. 12 months, or NA' },
      { id: 'minShipShelfLife', label: 'Minimum shipping shelf life', type: 'text', required: true },
      { id: 'flavorOrientation',     label: 'Specific flavor orientation required in pack?', type: 'select', options: ['Yes','No'] },
      { id: 'flavorOrientationDesc', label: 'Describe the orientation', type: 'text', showIf: { field: 'flavorOrientation', equals: 'Yes' } },
    ]},
  { id: 's4', num: 4, title: 'Lot Code Requirements', scope: 'product',
    desc: 'How lot and date codes should read on this product.',
    fields: [
      { id: 'lotCodeFormat',  label: 'Lot Code Format', type: 'select', required: true, options: ['MMDDYY (Sojo Standard)','YYMMDD','MMDDYYYY','Custom'] },
      { id: 'lotCodeCustom',  label: 'Custom format + reasoning', type: 'text', showIf: { field: 'lotCodeFormat', equals: 'Custom' } },
      { id: 'printedDateStandard', label: 'Printed date code: use Sojo Standard?', type: 'select', required: true, options: ['Yes','No'], helper: 'Sojo Standard — Line 1: Best By MMDDYY · Line 2: Sojo Line ID & timestamp of repack' },
      { id: 'printedDateCustom',   label: 'Describe your printed date code', type: 'textarea', showIf: { field: 'printedDateStandard', equals: 'No' } },
      { id: 'dateCodeLocation', label: 'Date code location', type: 'select', required: true, options: ['Top of Carton','Bottom of Carton','Side of Carton','Top of Tray','Other'] },
    ]},
  { id: 's5', num: 5, title: 'Stack Height Requirements', scope: 'product',
    desc: 'Sojo Standard is 3 high for WIP, 2–3 high for packaging and finished goods. If below standard, please explain.',
    fields: [
      { id: 'fgStackHeight',   label: 'Finished good max stack height',     type: 'select', required: true, options: ['1','2','3'], helper: 'Pallets high' },
      { id: 'fgStackReason',   label: 'Reasoning for below-standard height', type: 'text', showIf: { field: 'fgStackHeight', equalsAny: ['1','2'] } },
      { id: 'wipStackHeight',  label: 'WIP / raw material max stack height', type: 'select', required: true, options: ['1','2','3'] },
      { id: 'wipStackReason',  label: 'Reasoning for below-standard height', type: 'text', showIf: { field: 'wipStackHeight', equalsAny: ['1','2'] } },
      { id: 'pkgStackHeight',  label: 'Packaging material max stack height', type: 'select', required: true, options: ['1','2','3'] },
    ]},
  { id: 's6', num: 6, title: 'Outbound & Load Requirements', scope: 'product',
    desc: 'How finished pallets ship out the door.',
    fields: [
      { id: 'palletPatternStandard', label: "Use Sojo's standard pallet pattern?", type: 'select', required: true, options: ['Yes','No'] },
      { id: 'palletPatternDesc', label: 'Describe your pallet pattern', type: 'text', showIf: { field: 'palletPatternStandard', equals: 'No' } },
      { id: 'palletPatternFile', label: 'Attach pallet pattern image',  type: 'file', showIf: { field: 'palletPatternStandard', equals: 'No' } },
      { id: 'stretchWrapStandard', label: 'Stretch wrap to Sojo Standard (14–17 lbs)?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'stretchWrapRecipe',   label: 'Custom stretch wrap recipe', type: 'textarea', showIf: { field: 'stretchWrapStandard', equals: 'No' } },
      { id: 'slipsheetsRequired', label: 'Slipsheets required?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'slipsheetLayers',    label: 'Which layers?', type: 'text', showIf: { field: 'slipsheetsRequired', equals: 'Yes' }, helper: 'e.g. one dust cover on top, one on layer 2' },
      { id: 'cornerboardsRequired', label: 'Cornerboards required?', type: 'select', options: ['Yes','No'] },
      { id: 'cornerboardHeight',    label: 'Cornerboard height', type: 'select', options: ['48in','60in','72in','Custom'], showIf: { field: 'cornerboardsRequired', equals: 'Yes' } },
      { id: 'loadBars',   label: 'Load bars required?',   type: 'select', options: ['Yes','No'] },
      { id: 'loadStraps', label: 'Load straps required?', type: 'select', options: ['Yes','No'] },
      { id: 'airbagReqs', label: 'Airbag requirements',   type: 'text', helper: 'e.g. 3 airbags at beginning, middle, end of trailer. Blank if none.' },
      { id: 'loadNotes',  label: 'Additional load securement notes', type: 'textarea' },
      { id: 'loadNote',   type: 'note', label: 'Additional materials must be provided by the customer or a PO submitted to Sojo to source on your behalf.' },
    ]},
  { id: 's7', num: 7, title: 'Sticker Requirements', scope: 'product',
    desc: 'Case-level stickers and labels applied during the run.',
    fields: [
      { id: 'stickersRequired', label: 'Stickers/labels required at case level?', type: 'select', options: ['Yes','No'] },
      { id: 'stickerSize',      label: 'Sticker size',        type: 'select', options: ['2x2','2x4','4x4','Custom'], showIf: { field: 'stickersRequired', equals: 'Yes' } },
      { id: 'stickerPlacement', label: 'Placement',           type: 'text',   showIf: { field: 'stickersRequired', equals: 'Yes' } },
      { id: 'stickersPerCase',  label: 'Number per case',     type: 'number', showIf: { field: 'stickersRequired', equals: 'Yes' } },
      { id: 'stickerArtwork',   label: 'Attach sticker artwork', type: 'file', showIf: { field: 'stickersRequired', equals: 'Yes' } },
    ]},
  { id: 's8', num: 8, title: 'Raw Materials & Packaging', scope: 'product', type: 'bom',
    desc: "List each component in this product's Bill of Materials. One row per material. All item setups are per 1 BOM.",
    fields: [
      { id: 'wipSupplier', label: 'WIP Supplier',       type: 'select', required: true, options: 'suppliers' },
      { id: 'pkgSupplier', label: 'Packaging Supplier', type: 'select', required: true, options: 'suppliers' },
    ]},
  { id: 's9', num: 9, title: 'Artwork & Dielines', scope: 'product',
    desc: 'Everything our engineering team needs to spec the pack.',
    fields: [
      { id: 'dielinesProvided', label: 'Provide packaging dielines?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'dielineFiles',     label: 'Attach dieline files with measurements', type: 'file', showIf: { field: 'dielinesProvided', equals: 'Yes' } },
      { id: 'dielineNote',      type: 'note', label: 'Sojo will need dielines before production — your CSM will follow up.', showIf: { field: 'dielinesProvided', equals: 'No' } },
      { id: 'artworkProvided',  label: 'Provide artwork files?', type: 'select', required: true, options: ['Yes','No'] },
      { id: 'artworkFiles',     label: 'Attach artwork files', type: 'file', showIf: { field: 'artworkProvided', equals: 'Yes' } },
      { id: 'complianceArtwork',label: 'Compliance requirements on artwork', type: 'textarea', helper: 'Allergens, organic cert, regulatory text' },
    ]},
];

/* Repeating Section 8 component rows — one row per BOM material */
const BOM_ROW_FIELDS = [
  { id: 'materialType', label: 'Material Type', type: 'select', required: true, options: ['WIP / Raw Material','Packaging Material','Label','Sticker','Other'] },
  { id: 'materialDesc', label: 'Material Description', type: 'text', required: true, helper: 'e.g. SOJO Tropical Punch 12oz Sleek' },
  { id: 'flavor',       label: 'Flavor', type: 'text', showIf: { field: 'materialType', equals: 'WIP / Raw Material' } },
  { id: 'count',        label: 'Count (CT)', type: 'text', helper: 'e.g. 12CT' },
  { id: 'format',       label: 'Format', type: 'select', options: ['Loose','Shrunk','Other'] },
  { id: 'custItemNum',  label: 'Customer Item Number', type: 'text' },
  { id: 'bomQty',       label: 'BOM Qty per finished case', type: 'number', required: true },
  { id: 'rowLotCode',   label: 'Lot Code Format', type: 'select', options: ['MMDDYY (Sojo Standard)','YYMMDD','Custom'] },
  { id: 'casesPerInboundPallet', label: 'Cases per inbound pallet', type: 'number' },
  { id: 'inboundPalletType', label: 'Inbound Pallet Type', type: 'select', options: ['GMA Whitewood','Plastic','CHEP','Other'] },
  { id: 'supplier',      label: 'Supplier', type: 'select', options: 'suppliers' },
  { id: 'supplierOther', label: 'Specify supplier', type: 'text', showIf: { field: 'supplier', equals: 'Other (specify)' } },
];

/* ── NetSuite destination map — { record, section, fieldName } ──────────────
   record keys match FIELDS_DATA / Source Map nodes. The Internal Review tab
   live-checks each destination against the Source Map.                      */
const INTAKE_FIELD_MAP = {
  customerName:        { record: 'blueprint', section: 'Customer Specific Information', fieldName: 'Customer Name' },
  contactName:         { record: 'blueprint', section: 'Customer Specific Information', fieldName: 'Link to Customer Record' },
  contactEmail:        { record: 'blueprint', section: 'Customer Specific Information', fieldName: 'Link to Customer Record' },
  targetStartDate:     { record: 'variation', section: 'Pricing Summary', fieldName: 'Start Date' },
  itemName:            { record: 'item', section: 'Primary Information', fieldName: 'Display Name / Code' },
  customerItemNumber:  { record: 'item', section: 'Primary Information', fieldName: 'Customer Item #' },
  formatType:          { record: 'variation', section: 'Pack Details', fieldName: 'Format Type' },
  finishedPackFormat:  { record: 'variation', section: 'Pack Details', fieldName: 'Finished Pack Format' },
  containerSize:       { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Container Size' },
  containerType:       { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Container Type' },
  containerSpec:       { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Container Spec' },
  numFlavors:          { record: 'blueprint', section: 'Item Specific Information', fieldName: '# of Flavors' },
  inboundCaseCount:    { record: 'variation', section: 'Pack Details', fieldName: 'Touch 1: Inbound Case' },
  casesPerPallet:      { record: 'variation', section: 'Pack Details', fieldName: 'Finished Good Cases per Pallet' },
  palletType:          { record: 'item', section: 'SOJO Details', fieldName: 'Pallet Type' },
  masterCaseShrink:    { record: 'variation', section: 'Pack Details', fieldName: 'Finished Pack Format' },
  allergensPresent:    { record: 'blueprint', section: 'Quality', fieldName: 'Allergens' },
  allergenList:        { record: 'blueprint', section: 'Quality', fieldName: 'Allergens' },
  organic:             { record: 'blueprint', section: 'Quality', fieldName: 'Organic' },
  regulatory:          { record: 'blueprint', section: 'Quality', fieldName: 'All quality fields' },
  shelfLife:           { record: 'blueprint', section: 'Pallet & Stack Specifications', fieldName: 'WIP Shelf Life Days' },
  minShipShelfLife:    { record: 'blueprint', section: 'Pallet & Stack Specifications', fieldName: 'Finished Shelf Life Days' },
  lotCodeFormat:       { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Finished System Lot Code Format' },
  printedDateStandard: { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' },
  dateCodeLocation:    { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' },
  fgStackHeight:       { record: 'blueprint', section: 'Pallet & Stack Specifications', fieldName: 'Finished Good Max Stack Height' },
  wipStackHeight:      { record: 'blueprint', section: 'Pallet & Stack Specifications', fieldName: 'WIP Max Stack Height' },
  pkgStackHeight:      { record: 'blueprint', section: 'Pallet & Stack Specifications', fieldName: 'Packaging Max Warehouse Stack Height' },
  palletPatternStandard:{ record: 'variation', section: 'Pack Details', fieldName: 'Pallet Pattern' },
  stretchWrapStandard: { record: 'variation', section: 'Pack Details', fieldName: 'Shrink Film Specs' },
  slipsheetsRequired:  { record: 'variation', section: 'Production Details', fieldName: 'Touch 1: Slipsheets' },
  cornerboardsRequired:{ record: 'variation', section: 'Production Details', fieldName: 'Touch 1: Cornerboards' },
  loadBars:            { record: 'blueprint', section: 'Outbound + Shipping Defaults', fieldName: 'Load Bars' },
  loadStraps:          { record: 'blueprint', section: 'Outbound + Shipping Defaults', fieldName: 'Load Straps' },
  airbagReqs:          { record: 'blueprint', section: 'Outbound + Shipping Defaults', fieldName: 'Airbag Qty' },
  loadNotes:           { record: 'blueprint', section: 'Outbound + Shipping Defaults', fieldName: 'Outbound Load Details' },
  stickersRequired:    { record: 'variation', section: 'Production Details', fieldName: 'Touch 1: Labels' },
  bomRows:             { record: 'bomline', section: 'BOM Revision', fieldName: 'Component rows (Item · Quantity · Units)' },
  wipSupplier:         { record: 'rmitem', section: 'SOJO Details', fieldName: 'Vendor Item #' },
  pkgSupplier:         { record: 'pkgitem', section: 'SOJO Details', fieldName: 'Vendor Item #' },
  dielinesProvided:    { record: 'variation', section: 'Pack Details', fieldName: 'Packaging Dieline' },
  artworkProvided:     { record: 'rmitem', section: 'Primary Information', fieldName: 'Artwork Filed' },
};

/* Fields the customer can never provide — completed internally after intake */
const INTERNAL_ONLY_FIELDS = [
  'Variation: Machine Model / Possible Machine Models (Assets)',
  'Variation: Machine Setpoint CPM + Output Case/Min (Throughput)',
  'Variation: Headcount Assumptions (all roles)',
  'Variation: Price per Case, Margins, Volume economics (Pricing Summary)',
  'Variation: Location / Region assignment',
  'Variation: Operations + Engineering Approval',
  'Item: Department, Location, Units Type',
  'BOM: Restrict to Assemblies linkage + Subsidiary',
  'Customer Order: everything (created after Customer Approval)',
];

/* ── Complexity grading — internal only, never shown to the customer ────────
   Tune weights here ("make custom lot codes weigh 3" → points: 3).
   bucket: 'rm' = Raw Material Assessment · 'fg' = Finished Goods Assessment  */
const COMPLEXITY_CONFIG = {
  banding: { high: 75, moderate: 50 },   // >75% High · 50–74% Moderate · <50% Low
  rules: [
    { id: 'customLotCode',     label: 'Non-MMDDYY lot code',          points: 2, bucket: 'fg', when: { field: 'lotCodeFormat',        notEquals: 'MMDDYY (Sojo Standard)' } },
    { id: 'belowStdFgStack',   label: 'Below-standard FG stack',      points: 2, bucket: 'fg', when: { field: 'fgStackHeight',        equalsAny: ['1','2'] } },
    { id: 'belowStdWipStack',  label: 'Below-standard WIP stack',     points: 2, bucket: 'rm', when: { field: 'wipStackHeight',       equalsAny: ['1','2'] } },
    { id: 'customStretchWrap', label: 'Custom stretch wrap recipe',   points: 3, bucket: 'fg', when: { field: 'stretchWrapStandard',  equals: 'No' } },
    { id: 'stickers',          label: 'Sticker requirements',         points: 2, bucket: 'fg', when: { field: 'stickersRequired',     equals: 'Yes' } },
    { id: 'flavorOrientation', label: 'Flavor orientation required',  points: 2, bucket: 'fg', when: { field: 'flavorOrientation',    equals: 'Yes' } },
    { id: 'customPrintedDate', label: 'Custom printed date code',     points: 2, bucket: 'fg', when: { field: 'printedDateStandard',  equals: 'No' } },
    { id: 'unknownSupplier',   label: 'Unproven / unknown supplier',  points: 2, bucket: 'rm', when: { special: 'unknownSupplier' } },
    { id: 'customPalletPattern', label: 'Custom pallet pattern',      points: 2, bucket: 'fg', when: { field: 'palletPatternStandard', equals: 'No' } },
  ],
};
