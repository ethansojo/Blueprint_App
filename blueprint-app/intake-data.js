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

/* Choosing this option in any dropdown reveals a free-entry companion field
   AND flags the answer as customer-entered (✍) in the Internal Review. */
const INTAKE_CUSTOM_SENTINEL = 'Enter my own value';

const INTAKE_SECTIONS = [
  { id: 's1', num: 1, title: 'Project Overview', scope: 'project',
    desc: 'Filled once per submission — who you are and when you need this running.',
    fields: [
      { id: 'customerName',   label: 'Customer Name',          type: 'text',  required: true, helper: "Your company's legal name as it appears on purchase orders" , tooltip: "Your company's legal name as it appears on purchase orders — the brand owner we're co-packing for." },
      { id: 'contactName',    label: 'Customer Contact Name',  type: 'text',  required: true , tooltip: "The primary person at your company we'll coordinate this project with." },
      { id: 'contactEmail',   label: 'Customer Contact Email', type: 'email', required: true , tooltip: "Where we'll send setup confirmations and approval requests for this project." },
      { id: 'targetStartDate',label: 'Target Start Date',      type: 'date',  required: true , tooltip: "The date you'd like production to begin. Drives our scheduling and lead-time planning." },
    ]},
  { id: 's2', num: 2, title: 'Product Identity & Configuration', scope: 'product',
    desc: 'What this product is and how it packs out. One product = one BOM.',
    fields: [
      { id: 'itemName',          label: 'Project / Item Name',   type: 'text', required: true, helper: 'e.g. SOJO Tropical 4flv-12PK' , tooltip: "A descriptive name including flavors and pack count, e.g. 'SOJO Tropical 4flv-12PK'." },
      { id: 'customerItemNumber',label: 'Customer Item Number',  type: 'text', required: true, helper: 'Your internal SKU' , tooltip: "Your internal SKU for this product, so records tie back to your own systems." },
      { id: 'formatType',        label: 'Format Type',           type: 'select', required: true, options: ['Tray','Carton','Shrink Only','Tray + Shrink','RSC','Other'] , tooltip: "How the product is packaged at case level — tray, carton, shrink-wrap, or a combination." },
      { id: 'finishedPackFormat',label: 'Finished Pack Format',  type: 'select', required: true, helper: 'How the finished product packs out', options: ['2X12-24PK','4X6-24PK','3X8-24PK','2X6-12PK','12PK','24PK','30PK','Variety 4-flavor', INTAKE_CUSTOM_SENTINEL] , tooltip: "How the retail-ready product is configured — its layout and unit count, e.g. '2X12-24PK'." },
      { id: 'finishedPackFormatCustom', label: 'Your pack format', type: 'text', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'finishedPackFormat', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Describe your pack format if it isn't listed. Custom entries are flagged for Sojo review." },
      { id: 'containerSize',     label: 'Container Size',        type: 'select', required: true, options: ['7.5oz','8oz','8.4oz','11.5oz','12oz','16oz','19.2oz','750ml','1L', INTAKE_CUSTOM_SENTINEL] , tooltip: "The volume of a single primary container, e.g. 12oz." },
      { id: 'containerSizeCustom', label: 'Your container size', type: 'text', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'containerSize', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your container size if not listed. Flagged for Sojo review." },
      { id: 'containerType',     label: 'Container Type',        type: 'select', required: true, options: ['Can','Bottle','Carton','Pouch','Other'] , tooltip: "The kind of primary container — can, bottle, carton, or pouch." },
      { id: 'containerSpec',     label: 'Container Spec',        type: 'select', required: true, helper: 'The body style of the container', options: ['Sleek','Standard','PET','Slim','Other','Aluminum','Glass','Tetra Pak Slim','Tetra Pak Edge','SIG COMBIBLOCK','TETRA TOP'] , tooltip: "The body style or material of the container — e.g. sleek, standard, PET, aluminum, glass." },
      { id: 'containerSpecCustom', label: 'Your container spec', type: 'text', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'containerSpec', equals: 'Other' } , tooltip: "Enter your container spec if not listed. Flagged for Sojo review." },
      { id: 'numFlavors',        label: 'Number of Flavors',     type: 'select', required: true, options: ['1','2','3','4','5','6+'] , tooltip: "How many distinct flavors are in this product." },
      { id: 'inboundCaseCount',  label: 'Inbound Case Count',    type: 'select', required: true, helper: 'Units per inbound WIP case', options: ['12','15','24','24 Loose','30','Bulk', INTAKE_CUSTOM_SENTINEL] , tooltip: "Units per case of WIP (your unfinished product) that you ship us to repack." },
      { id: 'inboundCaseCountCustom', label: 'Your inbound case count', type: 'number', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'inboundCaseCount', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your inbound case count if not listed. Flagged for Sojo review." },
      { id: 'casesPerPallet',    label: 'Cases per Pallet',      type: 'select', required: true, helper: 'Finished good cases per outbound pallet — pick a typical value or enter your own', options: ['45','56','60','65','72','80','84','91','100','104', INTAKE_CUSTOM_SENTINEL] , tooltip: "How many finished-good cases stack on each outbound pallet." },
      { id: 'casesPerPalletCustom', label: 'Your cases per pallet', type: 'number', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'casesPerPallet', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your cases-per-pallet if not listed. Flagged for Sojo review." },
      { id: 'palletType',        label: 'Pallet Type',           type: 'select', required: true, options: ['GMA Whitewood','Plastic','CHEP','Other'] , tooltip: "The pallet type finished goods ship out on (GMA whitewood, CHEP, plastic, etc.)." },
      { id: 'masterCaseShrink',  label: 'Does the master case require shrink?', type: 'select', required: true, options: ['Yes','No'], helper: 'Yes = a double-touch job — second-touch details required below' , tooltip: "Whether the master case needs to be shrink-wrapped. Selecting Yes makes this a double-touch job." },
      // ── Touch 2 / second-touch fields — a double-touch job. Revealed AND
      //    required only when masterCaseShrink = Yes; hidden + not required when No. ──
      { id: 'touch2Note', type: 'note', label: '🔁 Double-touch job — please provide the second-touch (Touch 2) details below.', showIf: { field: 'masterCaseShrink', equals: 'Yes' } },
      { id: 'touch2OutputCase',   label: 'Touch 2 — Output Case Count',    type: 'number', required: true, helper: 'Cases produced per second-touch run unit', showIf: { field: 'masterCaseShrink', equals: 'Yes' } , tooltip: "Cases produced per run unit at the second touch." },
    ]},
  { id: 's3', num: 3, title: 'Quality & Compliance', scope: 'product',
    desc: 'Allergens, certifications, shelf life, and anything regulatory.',
    fields: [
      { id: 'allergensPresent', label: 'Allergens present?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether the product contains allergens we must manage during handling and labeling." },
      { required: false, id: 'allergenList',     label: 'Which allergens?',   type: 'multiselect', options: ['Dairy','Gluten','Soy','Nuts','Eggs','Hemp','Other'], showIf: { field: 'allergensPresent', equals: 'Yes' } , tooltip: "Select every allergen present so we can plan line changeover and labeling controls." },
      { id: 'organic',          label: 'Certified organic?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether the product carries organic certification, which affects handling and documentation." },
      { id: 'regulatory',       label: 'Regulatory / food safety considerations?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether any regulatory or food-safety requirements apply to this product." },
      { required: false, id: 'regulatoryDesc',   label: 'Describe the considerations', type: 'textarea', showIf: { field: 'regulatory', equals: 'Yes' } , tooltip: "Describe the regulatory or food-safety requirements that apply." },
      { id: 'shelfLife',        label: 'Product shelf life', type: 'select', required: true, options: ['6 months','9 months','12 months','18 months','24 months','NA — shelf stable', INTAKE_CUSTOM_SENTINEL] , tooltip: "The total shelf life of the finished product from its production date." },
      { id: 'shelfLifeCustom',  label: 'Your product shelf life', type: 'text', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'shelfLife', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your shelf life if not listed. Flagged for Sojo review." },
      { id: 'minShipShelfLife', label: 'Minimum shipping shelf life', type: 'select', required: true, helper: 'The minimum remaining shelf life acceptable when product ships', options: ['30 days','60 days','90 days','120 days','180 days','50% of total shelf life','NA', INTAKE_CUSTOM_SENTINEL] , tooltip: "The minimum remaining shelf life that must be left when product ships out." },
      { id: 'minShipShelfLifeCustom', label: 'Your minimum shipping shelf life', type: 'text', required: true, helper: 'Custom values are flagged for Sojo review', showIf: { field: 'minShipShelfLife', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your value if not listed. Flagged for Sojo review." },
      { required: false, id: 'flavorOrientation',     label: 'Specific flavor orientation required in pack?', type: 'select', options: ['Yes','No'] , tooltip: "Whether flavors must sit in a specific order or position within the pack." },
      { required: false, id: 'flavorOrientationDesc', label: 'Describe the orientation', type: 'text', showIf: { field: 'flavorOrientation', equals: 'Yes' } , tooltip: "Describe the required flavor arrangement within the pack." },
    ]},
  { id: 's4', num: 4, title: 'Lot Code Requirements', scope: 'product',
    desc: 'How lot and date codes should read on this product.',
    fields: [
      { id: 'lotCodeFormat',  label: 'System Lot Code Format', type: 'select', required: true, options: ['MMDDYY (Sojo Standard)','YYMMDD','MMDDYYYY','Custom'] , tooltip: "The lot/date code format the system generates. Sojo's standard is MMDDYY." },
      { id: 'systemLotCodeDesc', label: 'System Lot Code Description', type: 'text', required: false, tooltip: 'Describe how the system lot code is structured — what each segment represents.' },
      { required: false, id: 'lotCodeCustom',  label: 'Custom format + reasoning', type: 'text', showIf: { field: 'lotCodeFormat', equals: 'Custom' } , tooltip: "Specify your custom lot code format and why it's needed." },
      { id: 'printedDateStandard', label: 'Printed date code: use Sojo Standard?', type: 'select', required: true, options: ['Yes','No'], helper: 'Sojo Standard — Line 1: Best By MMDDYY · Line 2: Sojo Line ID & timestamp of repack' , tooltip: "Use Sojo's standard printed code (Best By line + Sojo line ID and repack timestamp) or define your own." },
      { id: 'printedLot1Desc', label: 'Printed Lot 1 Description', type: 'textarea', required: false, tooltip: 'Describe the printed Lot 1 code in depth — exact characters, segments, and what each part means.' },
      { required: false, id: 'printedLot1Format', label: 'Printed Lot 1 Format', type: 'text', showIf: { field: 'printedDateStandard', equals: 'No' } },
      { required: false, id: 'lot1Description',    label: 'Lot 1 Description',    type: 'text', showIf: { field: 'printedDateStandard', equals: 'No' } },
      { id: 'dateCodeLocation', label: 'Date code location', type: 'select', required: true, options: ['Top of Carton','Bottom of Carton','Side of Carton','Top of Tray','Other'] , tooltip: "Where on the package the date code should be printed." },
    ]},
  { id: 's5', num: 5, title: 'Stack Height Requirements', scope: 'product',
    desc: 'Sojo Standard is 3 high for WIP, 2–3 high for packaging and finished goods. If below standard, please explain.',
    fields: [
      { id: 'fgStackHeight',   label: 'Finished good max stack height',     type: 'select', required: true, options: ['1','2','3'], helper: 'Pallets high' , tooltip: "How many pallets high finished goods can be safely stacked. Sojo standard is 3." },
      { required: false, id: 'fgStackReason',   label: 'Reasoning for below-standard height', type: 'text', showIf: { field: 'fgStackHeight', equalsAny: ['1','2'] } , tooltip: "If below 3-high, explain why (product weight, fragility, etc.)." },
      { id: 'wipStackHeight',  label: 'WIP / raw material max stack height', type: 'select', required: true, options: ['1','2','3'] , tooltip: "How many pallets high incoming WIP can be stacked. Sojo standard is 3." },
      { required: false, id: 'wipStackReason',  label: 'Reasoning for below-standard height', type: 'text', showIf: { field: 'wipStackHeight', equalsAny: ['1','2'] } , tooltip: "If below 3-high, explain why." },
      { id: 'pkgStackHeight',  label: 'Packaging material max stack height', type: 'select', required: true, options: ['1','2','3'] , tooltip: "How many pallets high packaging can be stored. Sojo standard is 2–3." },
    ]},
  { id: 's6', num: 6, title: 'Outbound & Load Requirements', scope: 'product',
    desc: 'How finished pallets ship out the door.',
    fields: [
      { id: 'palletPatternStandard', label: "Use Sojo's standard pallet pattern?", type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether finished pallets follow Sojo's standard stacking pattern or a custom one you provide." },
      { required: false, id: 'palletPatternDesc', label: 'Describe your pallet pattern', type: 'text', showIf: { field: 'palletPatternStandard', equals: 'No' } , tooltip: "Describe your required pallet pattern." },
      { required: false, id: 'palletPatternFile', label: 'Attach pallet pattern image',  type: 'file', showIf: { field: 'palletPatternStandard', equals: 'No' } , tooltip: "Upload an image or diagram of your required pallet pattern." },
      { id: 'stretchWrapStandard', label: 'Stretch wrap to Sojo Standard (14–17 lbs)?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Use Sojo's standard film weight (14–17 lbs) or specify a custom wrap recipe." },
      { required: false, id: 'stretchWrapRecipe',   label: 'Custom stretch wrap recipe', type: 'textarea', showIf: { field: 'stretchWrapStandard', equals: 'No' } , tooltip: "Describe your film weight, wrap pattern, and tension." },
      { id: 'slipsheetsRequired', label: 'Slipsheets required?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether slipsheets are needed between pallet layers for stability or protection." },
      { required: false, id: 'slipsheetLayers',    label: 'Which layers?', type: 'select', showIf: { field: 'slipsheetsRequired', equals: 'Yes' }, options: ['Dust cover on top only','Top + layer 2','Top + between every layer','Between every layer only', INTAKE_CUSTOM_SENTINEL] , tooltip: "Where slipsheets should be placed in the stack." },
      { required: false, id: 'slipsheetLayersCustom', label: 'Your slipsheet placement', type: 'text', helper: 'Custom values are flagged for Sojo review', showIf: { field: 'slipsheetLayers', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Describe your slipsheet placement. Flagged for Sojo review." },
      { required: false, id: 'cornerboardsRequired', label: 'Cornerboards required?', type: 'select', options: ['Yes','No'] , tooltip: "Whether vertical cornerboards are needed to protect edges and stabilize the load." },
      { required: false, id: 'cornerboardHeight',    label: 'Cornerboard height', type: 'select', options: ['40in','48in','60in','72in','Custom'], showIf: { field: 'cornerboardsRequired', equals: 'Yes' } , tooltip: "The height of the cornerboards required." },
      { required: false, id: 'loadBars',   label: 'Load bars required?',   type: 'select', options: ['Yes','No'] , tooltip: "Whether load bars are needed to secure product inside the trailer." },
      { required: false, id: 'loadStraps', label: 'Load straps required?', type: 'select', options: ['Yes','No'] , tooltip: "Whether load straps are needed to secure the load in transit." },
      { required: false, id: 'airbagReqs', label: 'Airbag requirements',   type: 'select', options: ['None','2 — front + rear of trailer','3 — beginning, middle, end of trailer','4+', INTAKE_CUSTOM_SENTINEL] , tooltip: "Whether dunnage airbags are needed to fill trailer voids and prevent shifting, and how many." },
      { required: false, id: 'airbagReqsCustom', label: 'Your airbag requirements', type: 'text', helper: 'Custom values are flagged for Sojo review', showIf: { field: 'airbagReqs', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Describe your airbag setup. Flagged for Sojo review." },
      { required: false, id: 'loadNotes',  label: 'Additional load securement notes', type: 'textarea' , tooltip: "Any load-securement instructions we haven't covered above." },
      { required: false, id: 'loadNote',   type: 'note', label: 'Additional materials must be provided by the customer or a PO submitted to Sojo to source on your behalf.' },
    ]},
  { id: 's7', num: 7, title: 'Sticker Requirements', scope: 'product',
    desc: 'Case-level stickers and labels applied during the run.',
    fields: [
      { required: false, id: 'stickersRequired', label: 'Stickers/labels required at case level?', type: 'select', options: ['Yes','No'] , tooltip: "Whether case-level stickers or labels must be applied during the run (retailer UPC, promo, etc.)." },
      { required: false, id: 'stickerSize',      label: 'Sticker size',        type: 'select', options: ['2x2','2x4','4x4','Custom'], showIf: { field: 'stickersRequired', equals: 'Yes' } , tooltip: "The dimensions of the sticker to apply." },
      { required: false, id: 'stickerPlacement', label: 'Placement',           type: 'select', showIf: { field: 'stickersRequired', equals: 'Yes' }, options: ['Top of case','Front face','Side panel','Two adjacent sides','Over existing UPC', INTAKE_CUSTOM_SENTINEL] , tooltip: "Where on the case the sticker should go." },
      { required: false, id: 'stickerPlacementCustom', label: 'Your sticker placement', type: 'text', helper: 'Custom values are flagged for Sojo review', showIf: { field: 'stickerPlacement', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Describe your sticker placement. Flagged for Sojo review." },
      { required: false, id: 'stickersPerCase',  label: 'Number per case',     type: 'select', showIf: { field: 'stickersRequired', equals: 'Yes' }, options: ['1','2','3','4', INTAKE_CUSTOM_SENTINEL] , tooltip: "How many stickers go on each case." },
      { required: false, id: 'stickersPerCaseCustom', label: 'Your stickers per case', type: 'number', helper: 'Custom values are flagged for Sojo review', showIf: { field: 'stickersPerCase', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your value. Flagged for Sojo review." },
      { required: false, id: 'stickerArtwork',   label: 'Attach sticker artwork', type: 'file', showIf: { field: 'stickersRequired', equals: 'Yes' } , tooltip: "Upload the sticker artwork file." },
    ]},
  { id: 's8', num: 8, title: 'Raw Materials & Packaging', scope: 'product', type: 'bom',
    desc: "List each component in this product's Bill of Materials. One row per material. All item setups are per 1 BOM.",
    fields: [] },
  { id: 's9', num: 9, title: 'Artwork & Dielines', scope: 'product',
    desc: 'Everything our engineering team needs to spec the pack.',
    fields: [
      { id: 'dielinesProvided', label: 'Provide packaging dielines?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether you'll provide dielines — the cut/fold templates with measurements." },
      { required: false, id: 'dielineFiles',     label: 'Attach dieline files with measurements', type: 'file', showIf: { field: 'dielinesProvided', equals: 'Yes' } , tooltip: "Upload your dieline files, including measurements." },
      { required: false, id: 'dielineNote',      type: 'note', label: 'Sojo will need dielines before production — your CSM will follow up.', showIf: { field: 'dielinesProvided', equals: 'No' } },
      { id: 'artworkProvided',  label: 'Provide artwork files?', type: 'select', required: true, options: ['Yes','No'] , tooltip: "Whether you'll provide print artwork for the packaging." },
      { required: false, id: 'artworkFiles',     label: 'Attach artwork files', type: 'file', showIf: { field: 'artworkProvided', equals: 'Yes' } , tooltip: "Upload your artwork files." },
      { required: false, id: 'complianceArtwork',label: 'Compliance requirements on artwork', type: 'multiselect', helper: 'Check everything that must appear on the artwork', options: ['Allergen statement','Organic certification mark','Non-GMO','Kosher','Recycling / deposit marks (CRV, etc.)','Bilingual labeling','None','Other'] , tooltip: "Check every compliance element that must appear on the artwork (allergen statement, organic mark, etc.)." },
      { required: false, id: 'complianceArtworkNotes', label: 'Compliance details', type: 'textarea', helper: 'Specifics for anything checked above — exact statements, cert numbers, languages' , tooltip: "Specifics for anything checked above — exact statements, cert numbers, languages." },
    ]},
];

/* Repeating Section 8 component rows — one row per BOM material */
const BOM_ROW_FIELDS = [
  { id: 'materialType', label: 'Material Type', type: 'select', required: true, options: ['WIP / Raw Material','Packaging Material','Label','Sticker','Other'] , tooltip: "What kind of component this row is — WIP, packaging, label, sticker, etc." },
  { id: 'materialDesc', label: 'Material Description', type: 'text', required: true, helper: 'e.g. SOJO Tropical Punch 12oz Sleek' , tooltip: "A clear description of the component, e.g. 'SOJO Tropical Punch 12oz Sleek'." },
  { required: false, id: 'count',        label: 'Count (CT)', type: 'select', options: ['1CT','4CT','6CT','12CT','15CT','24CT','Bulk', INTAKE_CUSTOM_SENTINEL] , tooltip: "The count configuration of this component, e.g. 12CT." },
  { required: false, id: 'countCustom',  label: 'Your count (CT)', type: 'text', showIf: { field: 'count', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your count if not listed." },
  { required: false, id: 'format',       label: 'Format', type: 'select', options: ['Loose','Shrunk','Packaging','Other'] , tooltip: "How this component arrives — loose, shrunk, or other." },
  { required: false, id: 'formatOther',  label: 'Specify format', type: 'text', showIf: { field: 'format', equals: 'Other' } },
  { required: false, id: 'custItemNum',  label: 'Customer Item Number', type: 'text' , tooltip: "Your internal item number for this component." },
  { id: 'bomQty',       label: 'BOM Qty per finished case', type: 'number', required: true , tooltip: "How many of this component are consumed per one finished case." },
  { required: false, id: 'rowLotCode',   label: 'Lot Code Format', type: 'select', options: ['MMDDYY (Sojo Standard)','YYMMDD','Custom'] , tooltip: "The lot code format on this incoming component." },
  // ⚑ NetSuite destination TBD — confirm during post-presentation NetSuite field work
  { required: false, id: 'systemLotFormatDesc', label: 'System Lot Format Description', type: 'text' },
  { required: false, id: 'casesPerInboundPallet', label: 'Cases per inbound pallet', type: 'select', options: ['45','56','60','72','88','104', INTAKE_CUSTOM_SENTINEL] , tooltip: "How many cases of this component arrive on each inbound pallet." },
  { required: false, id: 'casesPerInboundPalletCustom', label: 'Your cases per inbound pallet', type: 'number', showIf: { field: 'casesPerInboundPallet', equals: INTAKE_CUSTOM_SENTINEL } , tooltip: "Enter your value if not listed." },
  { required: false, id: 'inboundPalletType', label: 'Inbound Pallet Type', type: 'select', options: ['GMA Whitewood','Plastic','CHEP','Other'] , tooltip: "The pallet type this component arrives on." },
  { required: false, id: 'supplier',      label: 'Supplier', type: 'text' , tooltip: "Who supplies this specific component." },
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
  touch2OutputCase:    { record: 'variation', section: 'Production Details', fieldName: 'Touch 2: Output Case' },
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
  systemLotCodeDesc:   { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Finished System Lot Code Format' }, // ⚑ confirm
  printedDateStandard: { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' },
  printedLot1Format:   { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' },
  printedLot1Desc:     { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' }, // ⚑ confirm
  lot1Description:     { record: 'blueprint', section: 'Item Specific Information', fieldName: 'Lot 1: Placement / Format / Description' },
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
