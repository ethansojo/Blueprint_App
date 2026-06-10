/* fields-data.js — canonical Source Map field data.
   Organized by node, then sections, then fields. Each field: { name, source, type, status }.
   type codes: req | auto | opt | bp | var | bom | ch | co | "" (none)
   status codes: moved | new | flag | rem | "" (none)
   Edited by the in-app field editor (pencil icons) or directly by Claude. */
var FIELDS_DATA = {
  "_meta": {
    "saved": "2026-06-10T20:46:09.524Z"
  },
  "blueprint": {
    "sections": [
      {
        "label": "Customer Specific Information",
        "fields": [
          {
            "name": "Customer Name",
            "source": "",
            "type": "var",
            "status": ""
          },
          {
            "name": "Link to Customer Record",
            "source": "",
            "type": "var",
            "status": ""
          },
          {
            "name": "SSA",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Inactive (flag)",
            "source": "",
            "type": "",
            "status": ""
          }
        ]
      },
      {
        "label": "Quality",
        "fields": [
          {
            "name": "Allergens",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Organic",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "⚑ All quality fields — review with Jeffrey",
            "source": "",
            "type": "",
            "status": "flag"
          }
        ]
      },
      {
        "label": "Pallet & Stack Specifications",
        "fields": [
          {
            "name": "WIP Shelf Life Days",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Finished Shelf Life Days",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Finished Good Max Stack Height",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "WIP Max Stack Height",
            "source": "RM Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Packaging Max Warehouse Stack Height",
            "source": "Pkg",
            "type": "",
            "status": "moved"
          }
        ]
      },
      {
        "label": "Item Specific Information",
        "fields": [
          {
            "name": "# of Flavors",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Container Size",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Container Type",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Container Spec",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Item Weight",
            "source": "",
            "type": "var",
            "status": "moved"
          },
          {
            "name": "Item Regex",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Item Regex Message",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Finished System Lot Code Format",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Finished Lot Code Format Description",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "WIP System Lot Code Format",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "WIP Lot Code Format Description",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Inbound WIP Lot Location",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Lot 1: Placement / Format / Description",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Lot 1: Example / Notes / Image",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Lot 2: Placement / Format / Description",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Lot 2: Example / Notes / Image",
            "source": "Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "No Printed Lot Required",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "Outbound + Shipping Defaults",
        "fields": [
          {
            "name": "Outbound Load Requirements",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Airbag Qty",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Outbound Load Details",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Outbound Load Pattern",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Pallet Placard Instructions",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Pallet Placard (asset)",
            "source": "",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Load Bars",
            "source": "Item",
            "type": "",
            "status": "moved"
          },
          {
            "name": "Load Straps",
            "source": "Item",
            "type": "",
            "status": "moved"
          }
        ]
      },
      {
        "label": "Accounting Defaults",
        "fields": [
          {
            "name": "Income Account",
            "source": "Item · RM Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "COGS / Expense Account",
            "source": "Item · RM Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Asset Account",
            "source": "Item · RM Item",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Tax Schedule",
            "source": "Item · RM Item",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "Open Decisions",
        "fields": [
          {
            "name": "Printout — purpose unclear?",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      }
    ]
  },
  "variation": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "SSA",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Pricing Summary — Required",
        "fields": [
          {
            "name": "Custom Form",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Name",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Customer",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Location",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Price per Case",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Pricing Summary — Manual Optional",
        "fields": [
          {
            "name": "Start Date",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Exclude Transport",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Override Headcount",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Override Price",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Double Touch",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Pricing Summary — Auto-Calculated",
        "fields": [
          {
            "name": "PC ID",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Created By",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Date Created",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Last Modified / By",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Gross Margin %",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Gross Margin Target",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1 Price / Finished Case",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2 Price / Finished Case",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Total Price",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Price Target",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Annual Volume",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Annual Revenue",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Region",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Location Zip",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "State",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Labor Cost",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Sync to Salesforce",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Docusign Status",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Docusign Contract",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "PDF Export",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Volume — Required",
        "fields": [
          {
            "name": "Volume per Run",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Initial Volume",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Jan–Dec Monthly Volume",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Volume — Manual Optional",
        "fields": [
          {
            "name": "Year",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Frequency",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Pack Details — Required",
        "fields": [
          {
            "name": "Finished Pack Format",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Format Type",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Format Type 2",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Flavors",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Container Size",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Container Spec",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Container Type",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Inbound Case Format",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Inbound Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Output Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Finished Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Finished Pack Format",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Flavors",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Container Size",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Inbound Case Format",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Inbound Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Output Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Finished Case",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Cases per Shift Assumption",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Inbound WIP Cases per Pallet",
            "source": "RM Item",
            "type": "",
            "status": "new"
          },
          {
            "name": "Finished Good Cases per Pallet",
            "source": "Item",
            "type": "",
            "status": "new"
          },
          {
            "name": "Packaging Cases per Pallet",
            "source": "Pkg Material",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Pack Details — Manual Optional",
        "fields": [
          {
            "name": "Packaging Dieline",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Pallet Pattern",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Packaging Dieline Secondary",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Packaging Die Line 2",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Pallet Pattern",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Pallet Pattern HI · TI",
            "source": "SOP",
            "type": "opt",
            "status": "moved"
          },
          {
            "name": "Shrink Film Image",
            "source": "SOP",
            "type": "opt",
            "status": "moved"
          },
          {
            "name": "Pallet Tag",
            "source": "",
            "type": "opt",
            "status": "moved"
          }
        ]
      },
      {
        "label": "Production Details — Manual Optional",
        "fields": [
          {
            "name": "Touch 1: Slipsheets",
            "source": "",
            "type": "opt",
            "status": "flag"
          },
          {
            "name": "Touch 1: Labels",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Tray Former",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Reuse Tray",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: DeKit",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Cornerboards",
            "source": "",
            "type": "opt",
            "status": "flag"
          },
          {
            "name": "Touch 1: Number of Labels",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Slipsheets",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Labels",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Tray Former",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Reuse Tray",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: DeKit",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Cornerboards",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Number of Labels",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Case Label 1: Qty / Size / Placement",
            "source": "SOP",
            "type": "opt",
            "status": "moved"
          },
          {
            "name": "Case Label 2: Qty / Size / Placement",
            "source": "SOP",
            "type": "opt",
            "status": "moved"
          }
        ]
      },
      {
        "label": "Assets — Manual Optional",
        "fields": [
          {
            "name": "Touch 1: Pricing Machine Model",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Possible Machine Models",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Asset Type",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: Mandrel Needed",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 1: New Mandrel Needed",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Pricing Machine Model",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Possible Machine Models",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Asset Type",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: Mandrel Needed",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Touch 2: New Mandrel Needed",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Throughput — Required",
        "fields": [
          {
            "name": "Touch 1: Output Case / Min",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 1: Machine Setpoint CPM",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Output Case / Min",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Touch 2: Machine Setpoint CPM",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Goal Cases Per Shift",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Throughput — Auto-Calculated",
        "fields": [
          {
            "name": "Touch 1: Throughput per Hour",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: Finished Case / Min",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: Uptime",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Throughput per Hour",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Finished Case / Min",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Uptime",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Headcount Assumptions — Auto-Calculated",
        "fields": [
          {
            "name": "Touch 1: Total Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: Line Lead Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: DeKitters Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: Loaders Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 1: Palletizers Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Total Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Line Lead Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Touch 2: Palletizers Headcount",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Notes & Approval — Required",
        "fields": [
          {
            "name": "Commercial Notes",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Operations Approval",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Engineering Approval",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Notes & Approval — Manual Optional",
        "fields": [
          {
            "name": "CapEx Opportunity",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Line Layout",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Engineering Info Needed",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Ops Information Needed",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Notes & Approval — Auto-Calculated",
        "fields": [
          {
            "name": "Approval Status",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "SOW — Manual Optional",
        "fields": [
          {
            "name": "SOJO Services",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "SOJO Materials",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Customer Materials",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Sales Rep Email",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Signee",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Customer's Legal Name",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Quote Date",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      }
    ]
  },
  "item": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint (link)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Variation / PC (link)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "SOW",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "PC approved",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Primary Information — Required",
        "fields": [
          {
            "name": "Display Name / Code",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Customer",
            "source": "",
            "type": "var",
            "status": ""
          },
          {
            "name": "Custom Form",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Customer Item #",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Manual Optional",
        "fields": [
          {
            "name": "Inactive",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Description",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "UPC Code",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Sub-Assembly",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Final Touch Item",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Target per Shift",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Retailer Item #",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Minimum Shipping Shelf Life Days",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Allergens",
            "source": "Blueprint",
            "type": "",
            "status": ""
          },
          {
            "name": "Organic",
            "source": "Blueprint",
            "type": "",
            "status": ""
          },
          {
            "name": "Quality Fields",
            "source": "",
            "type": "",
            "status": "flag"
          }
        ]
      },
      {
        "label": "Primary Information — Auto-Calculated",
        "fields": [
          {
            "name": "Internal ID (auto-generated)",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Item Name / Number (auto-generated)",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "⚠ Configuration Requirements — Removed (live in Blueprint)",
        "fields": [
          {
            "name": "Printed Lot Format",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Finished System Lot Format",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Item Regex → Blueprint",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Item Image → Blueprint",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Stickering → Blueprint",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Minimum Shipping Shelf Life Days",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Finished Good Max Stack Height",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "SOJO Details — Required",
        "fields": [
          {
            "name": "Cases Per Pallet",
            "source": "Variation",
            "type": "var",
            "status": ""
          },
          {
            "name": "Pallet Type",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Finished Good Max Stack Height",
            "source": "Blueprint",
            "type": "req",
            "status": "rem"
          },
          {
            "name": "Printed Lot Format",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "ALL Finished  Lot Format Fields",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Item Regex",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Item Image",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Finished Shelf Life Days",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Finished Good Max Stack Height",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Load Bars",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Load Straps",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "SOJO Details — Manual Optional",
        "fields": [
          {
            "name": "SOP Link",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Eaches per Master CS",
            "source": "",
            "type": "opt",
            "status": "flag"
          },
          {
            "name": "Package Type",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Number of Forklifts",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "x of  Corner Boards",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "x of slipsheets",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Pallet Inventory Item",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Load Bars",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Enforce 6 Digit Lot Code",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Flavors",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Container Size",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Container Spec",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Container Type",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "slipsheets",
            "source": "",
            "type": "var",
            "status": ""
          },
          {
            "name": "cornerboards",
            "source": "",
            "type": "var",
            "status": ""
          }
        ]
      },
      {
        "label": "Segmentation — Required",
        "fields": [
          {
            "name": "Department",
            "source": "",
            "type": "req",
            "status": "flag"
          },
          {
            "name": "Location",
            "source": "",
            "type": "req",
            "status": "flag"
          }
        ]
      },
      {
        "label": "Item Detail — Manual Optional",
        "fields": [
          {
            "name": "WIP Unit Type",
            "source": "",
            "type": "var",
            "status": ""
          },
          {
            "name": "Size",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Pricing Calculator Approved",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Scope of Work Signed",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Format Type",
            "source": "",
            "type": "var",
            "status": "rem"
          }
        ]
      },
      {
        "label": "Item Detail — Auto-Calculated",
        "fields": [
          {
            "name": "Multiplier / Scale",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Primary Stock Unit",
            "source": "Units Type",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Primary Purchase Unit",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Primary Sale Unit",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Base Unit",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      }
    ]
  },
  "rmitem": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint (link)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Variation / PC (link)",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Primary Information — Required",
        "fields": [
          {
            "name": "Display Name / Code",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Customer",
            "source": "Variation",
            "type": "var",
            "status": ""
          },
          {
            "name": "Pallet Type",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Manual Optional",
        "fields": [
          {
            "name": "Item is Pallet",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Inactive",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Sub Item Of",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Artwork Filed",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "UPC Code",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Item Image",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "SOJO Details — Required",
        "fields": [
          {
            "name": "Vendor Item #",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "WIP Max Stack Height",
            "source": "",
            "type": "",
            "status": ""
          }
        ]
      },
      {
        "label": "SOJO Details — Manual Optional",
        "fields": [
          {
            "name": "Shield Item Type — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Pallet Inventory Item",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Stickering — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "ALL  RM  Lot Format Fields",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Raven Item Name — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Container Size",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Container Spec",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Container Type",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          },
          {
            "name": "Exclude from Lot Validation — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Enforce 6 Digit Lot Code — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Flavors",
            "source": "",
            "type": "var",
            "status": ""
          }
        ]
      },
      {
        "label": "Segmentation — Required",
        "fields": [
          {
            "name": "Department — do we need this?",
            "source": "",
            "type": "req",
            "status": "flag"
          },
          {
            "name": "Location — do we need this?",
            "source": "",
            "type": "req",
            "status": "flag"
          }
        ]
      },
      {
        "label": "Item Detail — Required",
        "fields": [
          {
            "name": "Cases per Pallet",
            "source": "Variation",
            "type": "var",
            "status": ""
          },
          {
            "name": "Units Type",
            "source": "Variation",
            "type": "var",
            "status": ""
          }
        ]
      },
      {
        "label": "Item Detail — Manual Optional",
        "fields": [
          {
            "name": "Relationship — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "WIP Shelf Life Days",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "WIP Unit Type — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          }
        ]
      }
    ]
  },
  "pkgitem": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint (link)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Variation / PC (link)",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Primary Information — Required",
        "fields": [
          {
            "name": "Display Name / Code",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Customer",
            "source": "Blueprint",
            "type": "var",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Manual Optional",
        "fields": [
          {
            "name": "Sub Item Of",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Inactive",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Pallet Type",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Artwork Files",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Item Image",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "UPC Code",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "SOJO Details — Required",
        "fields": [
          {
            "name": "Vendor Item #",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Packaging Max Warehouse Stack Height",
            "source": "",
            "type": "",
            "status": ""
          }
        ]
      },
      {
        "label": "SOJO Details — Manual Optional",
        "fields": [
          {
            "name": "Shield Item Type — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Stickering — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "ALL  PK  Lot Format Fields",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Container Size",
            "source": "Blueprint",
            "type": "var",
            "status": "rem"
          },
          {
            "name": "Container Spec",
            "source": "Blueprint",
            "type": "bp",
            "status": "rem"
          },
          {
            "name": "Container Type",
            "source": "Blueprint",
            "type": "bp",
            "status": "rem"
          }
        ]
      },
      {
        "label": "Segmentation — Required",
        "fields": [
          {
            "name": "Department — do we need this?",
            "source": "",
            "type": "req",
            "status": "flag"
          },
          {
            "name": "Location — do we need this?",
            "source": "",
            "type": "req",
            "status": "flag"
          }
        ]
      },
      {
        "label": "Item Detail — Required",
        "fields": [
          {
            "name": "Cases per Pallet",
            "source": "Variation",
            "type": "var",
            "status": ""
          },
          {
            "name": "Units Type",
            "source": "Variation",
            "type": "var",
            "status": ""
          }
        ]
      }
    ]
  },
  "bom": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint",
            "source": "",
            "type": "req",
            "status": "rem"
          },
          {
            "name": "Variation / PC",
            "source": "",
            "type": "req",
            "status": "rem"
          },
          {
            "name": "Item (via Restrict to Assemblies)",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "BOM — Required",
        "fields": [
          {
            "name": "Name",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Restrict to Assemblies (links to Item / VP#)",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Revisions",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Assemblies → VP#",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Subsidiary",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Price",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "BOM — Manual Optional",
        "fields": [
          {
            "name": "Memo",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Use Component Yield",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Available for All Assemblies",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Restrict to Locations",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Inactive",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Include Children — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          }
        ]
      },
      {
        "label": "BOM — Auto-Calculated",
        "fields": [
          {
            "name": "Used on Assembly",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Available for All Locations",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Date Created",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      }
    ]
  },
  "bomline": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Bill of Materials (parent BOM must exist)",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "BOM Revision — Required",
        "fields": [
          {
            "name": "Name",
            "source": "Bill of Materials",
            "type": "bom",
            "status": ""
          },
          {
            "name": "Item",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Quantity",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "BOM Revision — Manual Optional",
        "fields": [
          {
            "name": "Memo",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Effective Start Date — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Effective End Date — do we need this?",
            "source": "",
            "type": "opt",
            "status": "rem"
          },
          {
            "name": "Inactive",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "BOM Revision — Auto-Calculated",
        "fields": [
          {
            "name": "Bill of Materials (parent link)",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Customer Item #",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "BOM Quantity",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Units",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Item Source",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Item Display Name",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Date Created",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      }
    ]
  },
  "customerorder": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Variation / PC",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Item (via Item field)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "BOM (via Bill of Materials)",
            "source": "",
            "type": "",
            "status": "new"
          },
          {
            "name": "Customer Approved",
            "source": "",
            "type": "",
            "status": "new"
          }
        ]
      },
      {
        "label": "Primary Information — Required",
        "fields": [
          {
            "name": "Owner",
            "source": "Customer Hub",
            "type": "ch",
            "status": ""
          },
          {
            "name": "Purchase Order",
            "source": "Customer Hub",
            "type": "ch",
            "status": ""
          },
          {
            "name": "Customer",
            "source": "Customer Hub",
            "type": "var",
            "status": ""
          },
          {
            "name": "Quantity",
            "source": "Customer Hub",
            "type": "ch",
            "status": ""
          },
          {
            "name": "Price Level",
            "source": "Customer Hub",
            "type": "bom",
            "status": ""
          },
          {
            "name": "Item",
            "source": "Customer Hub",
            "type": "",
            "status": "moved"
          },
          {
            "name": "WIP Delivery Date",
            "source": "Customer Hub",
            "type": "req",
            "status": ""
          },
          {
            "name": "Forecast Month",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Goal Cases Per Shift",
            "source": "Variation",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Manual Optional",
        "fields": [
          {
            "name": "Non Standard Work",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Start Date",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "End Date",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "WIP Already On Site",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Auto-Calculated",
        "fields": [
          {
            "name": "ID",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Date Created",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Location Price",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Status",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Line — Manual Optional",
        "fields": [
          {
            "name": "Bay",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Scheduling — Required",
        "fields": [
          {
            "name": "Location",
            "source": "Customer Hub",
            "type": "ch",
            "status": ""
          }
        ]
      },
      {
        "label": "Scheduling — Manual Optional",
        "fields": [
          {
            "name": "Unique Work Order",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Annex Inventory",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Scheduling — Removed Fields",
        "fields": [
          {
            "name": "SOP",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "SOP CS / Shift",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "SOP Headcount",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "BOM — Required",
        "fields": [
          {
            "name": "Bill of Materials",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Bill of Materials Revision",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Headcount — Required",
        "fields": [
          {
            "name": "Headcount",
            "source": "Variation",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Planning — Required",
        "fields": [
          {
            "name": "Plan For Shifts",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Planning — Manual Optional",
        "fields": [
          {
            "name": "Schedule Saturdays",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Schedule Sundays",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Planning — Auto-Calculated",
        "fields": [
          {
            "name": "Build Quantity",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Quantity on Work Orders",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Scale WO Closure",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      }
    ]
  },
  "workorder": {
    "sections": [
      {
        "label": "⚙ Prerequisites",
        "fields": [
          {
            "name": "Blueprint",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Variation / PC",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Item",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "BOM",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Customer Order",
            "source": "",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Required",
        "fields": [
          {
            "name": "Customer Project",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Assembly",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Bill of Materials",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Bill of Materials Revision",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Quantity",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Date",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Status",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Customer PO",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Goal Cases Per Shift",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Manual Optional",
        "fields": [
          {
            "name": "Work Order Invoiced?",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "Memo",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Primary Information — Auto-Calculated",
        "fields": [
          {
            "name": "Order #",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Created Date",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      },
      {
        "label": "Production Line — Required",
        "fields": [
          {
            "name": "Bay",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          }
        ]
      },
      {
        "label": "Commercial Validation — Removed",
        "fields": [
          {
            "name": "SOP",
            "source": "",
            "type": "",
            "status": "rem"
          },
          {
            "name": "Customer SSA Signed",
            "source": "",
            "type": "",
            "status": "rem"
          }
        ]
      },
      {
        "label": "Classification — Required",
        "fields": [
          {
            "name": "Subsidiary",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Department",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Location",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          },
          {
            "name": "Price Level",
            "source": "Customer Order",
            "type": "co",
            "status": ""
          }
        ]
      },
      {
        "label": "Standard Cost — Required",
        "fields": [
          {
            "name": "Customer Order",
            "source": "",
            "type": "req",
            "status": ""
          },
          {
            "name": "Headcount",
            "source": "Customer Order",
            "type": "req",
            "status": ""
          }
        ]
      },
      {
        "label": "Standard Cost — Manual Optional",
        "fields": [
          {
            "name": "Allow to Build Partial Pallets",
            "source": "",
            "type": "opt",
            "status": ""
          },
          {
            "name": "WO PO#",
            "source": "",
            "type": "opt",
            "status": ""
          }
        ]
      },
      {
        "label": "Standard Cost — Auto-Calculated",
        "fields": [
          {
            "name": "Standard Cost",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Revenue Built",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Temp Labor Cost — STD",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Fixed Labor Cost — STD",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Standard Gross Margin",
            "source": "",
            "type": "auto",
            "status": ""
          },
          {
            "name": "Project Format Type",
            "source": "",
            "type": "auto",
            "status": ""
          }
        ]
      }
    ]
  },
  "autocalc": {
    "sections": [
      {
        "label": "Derived at SOP Generation — No Manual Entry",
        "fields": [
          {
            "name": "SOP Name (naming convention TBD)",
            "source": "",
            "type": "",
            "status": "flag"
          },
          {
            "name": "Status (derived from WO)",
            "source": "",
            "type": "",
            "status": "flag"
          },
          {
            "name": "Published (auto-trigger?)",
            "source": "",
            "type": "",
            "status": "flag"
          },
          {
            "name": "Pricing Calculator ID",
            "source": "Variation",
            "type": "",
            "status": ""
          },
          {
            "name": "Second Touch",
            "source": "Variation",
            "type": "",
            "status": ""
          },
          {
            "name": "Total # People (sum of headcount)",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Pallet Configuration (formula TBD)",
            "source": "",
            "type": "",
            "status": "flag"
          },
          {
            "name": "Date Created / Last Modified",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Operations Printout (generated on SOP creation)",
            "source": "",
            "type": "",
            "status": ""
          },
          {
            "name": "Project Format (auto-calc?)",
            "source": "",
            "type": "",
            "status": "flag"
          }
        ]
      }
    ]
  },
  "sopFields": [
    {
      "name": "SOP Creator",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "System auto-generates from logged-in user",
      "status": "rem",
      "notes": "Recommend removing — system tracks this natively"
    },
    {
      "name": "SOW Signed Status",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation / PC (links to Customer Approval)",
      "status": "confirmed"
    },
    {
      "name": "Customer Printout",
      "section": "Primary Information",
      "source": "remove",
      "method": "Remove field — no longer needed on SOP",
      "status": "rem",
      "notes": "Field to be removed from the SOP record"
    },
    {
      "name": "Operations Printout",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "Auto-generated when the SOP record is created",
      "status": "confirmed"
    },
    {
      "name": "Published",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "Auto-trigger when Work Order activates?",
      "status": "rem",
      "notes": "Decision needed — auto-publish or manual?"
    },
    {
      "name": "Name",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "Auto-generated on record creation",
      "status": "flag",
      "notes": "Naming convention TBD — what format does Ops need?"
    },
    {
      "name": "Pricing Calculator",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Pricing Calculator ID",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Second Touch",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation / Pricing Calc",
      "status": "confirmed"
    },
    {
      "name": "VP#",
      "section": "Primary Information",
      "source": "item",
      "method": "Auto from Item — specific item selected via Customer Order",
      "status": "confirmed"
    },
    {
      "name": "Customer Name",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "SSA",
      "section": "Primary Information",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "new",
      "notes": "New field to be added to the Blueprint record"
    },
    {
      "name": "VP Name / Description (Sojo)",
      "section": "Primary Information",
      "source": "item",
      "method": "Auto from Item record",
      "status": "confirmed"
    },
    {
      "name": "Status",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "Auto-calculated — derived from Work Order status",
      "status": "flag",
      "notes": "Decision pending — do we need this on the SOP at all?"
    },
    {
      "name": "Customer Approved",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "Auto-derived from project approval gate",
      "status": "rem",
      "notes": "Decision pending — Customer Order cannot be created without approval, so all SOPs are customer approved by definition."
    },
    {
      "name": "Date Created",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "System auto-stamp",
      "status": "rem"
    },
    {
      "name": "Last Modified",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "System auto-stamp",
      "status": "rem"
    },
    {
      "name": "By",
      "section": "Primary Information",
      "source": "autocalc",
      "method": "System auto-tracks user",
      "status": "rem"
    },
    {
      "name": "Headcount",
      "section": "Headcounts",
      "source": "workorder",
      "method": "Auto from Work Order — Headcount flows: Variation → Customer Order → Work Order → SOP",
      "status": "confirmed"
    },
    {
      "name": "Total Number of People",
      "section": "Headcounts",
      "source": "autocalc",
      "method": "Auto-calc — sum of all headcount role fields",
      "status": "confirmed"
    },
    {
      "name": "Customer SOP Version",
      "section": "Summary",
      "source": "sop",
      "method": "Manual on SOP — or remove?",
      "status": "flag",
      "notes": "Decision pending — do we need this? NetSuite record history may replace it"
    },
    {
      "name": "Inbound WIP",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Variation Customer Materials field",
      "status": "confirmed",
      "notes": "Field name needs alignment with Variation"
    },
    {
      "name": "Reuse Inbound Trays",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Printout",
      "section": "Summary",
      "source": "blueprint",
      "method": "Auto — purpose unclear",
      "status": "rem",
      "notes": "Need to clarify what this field actually controls"
    },
    {
      "name": "Engineering Notes",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Operations Notes",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Project Summary",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Item Format",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Size",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Container Spec",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Container",
      "section": "Summary",
      "source": "variation",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Location",
      "section": "Production",
      "source": "workorder",
      "method": "Auto from WO (Actual Location) — Variation has Location Assumption",
      "status": "flag",
      "notes": "Decision: Variation OR Customer Order? Affects location-based pricing model"
    },
    {
      "name": "Machine Model",
      "section": "Production",
      "source": "workorder",
      "method": "Auto from WO (Actual Machine Model) — Variation has Machine Model Assumption",
      "status": "confirmed"
    },
    {
      "name": "Bay",
      "section": "Production",
      "source": "workorder",
      "method": "Defined at Customer Order level",
      "status": "confirmed"
    },
    {
      "name": "Layout",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Machine Setpoint CPM Default",
      "section": "Production",
      "source": "workorder",
      "method": "Auto from WO (Actual Setpoint CPM) — Variation has Setpoint CPM Assumption",
      "status": "confirmed"
    },
    {
      "name": "Goal Cases Per Shift",
      "section": "Production",
      "source": "workorder",
      "method": "Auto from Work Order — Goal Cases flows: Variation → Customer Order → Work Order → SOP",
      "status": "confirmed"
    },
    {
      "name": "Bill of Materials",
      "section": "Production",
      "source": "bom",
      "method": "Auto from BOM record",
      "status": "confirmed"
    },
    {
      "name": "X  of  Cornerboards",
      "section": "Production",
      "source": "item",
      "method": "Item",
      "status": "confirmed"
    },
    {
      "name": "X  of Slipsheet Requirements",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item",
      "status": "confirmed"
    },
    {
      "name": "Tray Die Lines",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Carton Die Lines",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Shrink Film Specs",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Pallet WIP Stack Height",
      "section": "Production",
      "source": "rmitem",
      "method": "RM Item",
      "status": "confirmed"
    },
    {
      "name": "Pallet Finished Good Stack Height",
      "section": "Production",
      "source": "item",
      "method": "Item",
      "status": "confirmed"
    },
    {
      "name": "WIP Pallet Type",
      "section": "Production",
      "source": "rmitem",
      "method": "Auto from RM Item record",
      "status": "confirmed"
    },
    {
      "name": "Finished Pallet Type",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item — required field on Item record",
      "status": "confirmed"
    },
    {
      "name": "Finished Pallet Pattern",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "confirmed"
    },
    {
      "name": "Pallet Tag",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation",
      "status": "flag",
      "notes": "Do we need this field? Confirm or remove"
    },
    {
      "name": "Finished Pallet Qty",
      "section": "Production",
      "source": "variation",
      "method": "Auto from Variation (Cases per Pallet)",
      "status": "confirmed"
    },
    {
      "name": "Pallet Configuration",
      "section": "Production",
      "source": "variation",
      "method": "Variation",
      "status": "confirmed",
      "notes": "Define the calculation: Pallet Qty ÷ Stack Height?"
    },
    {
      "name": "Finished System Lot Code Format",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item",
      "status": "confirmed"
    },
    {
      "name": "Finished System Lot Code Format Description",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item",
      "status": "confirmed"
    },
    {
      "name": "WIP System Lot Code Format",
      "section": "Production",
      "source": "item",
      "method": "Auto from item",
      "status": "confirmed"
    },
    {
      "name": "WIP System Lot Code Format Description",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item",
      "status": "confirmed"
    },
    {
      "name": "Inbound WIP Lot Location",
      "section": "Production",
      "source": "item",
      "method": "Auto from Item",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Placement",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Format",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Description",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Example",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Notes",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 1 Image",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Placement",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Lot Format",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Description",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Example",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Notes",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Lot 2 Image",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "No Printed Lot Code Required",
      "section": "Printed Lot Format",
      "source": "item",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Qty",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Size",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Placement",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Notes",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Image",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 1 Download",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Qty",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Size",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Placement",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Notes",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Image",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "Case Label 2 Download",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation (sourced from intake form)",
      "status": "confirmed"
    },
    {
      "name": "No Case Label Required",
      "section": "Case Labels",
      "source": "variation",
      "method": "Auto from Variation override",
      "status": "confirmed"
    },
    {
      "name": "Outbound Load Requirements",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint default — overridable on Customer Order",
      "status": "confirmed"
    },
    {
      "name": "Airbag Qty",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Outbound Load Details",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint default",
      "status": "confirmed"
    },
    {
      "name": "Outbound Load Pattern",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint default",
      "status": "confirmed"
    },
    {
      "name": "Pallet Placard Instructions",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint",
      "status": "confirmed"
    },
    {
      "name": "Pallet Placard",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "Auto from Blueprint (asset)",
      "status": "confirmed"
    },
    {
      "name": "Additional Notes",
      "section": "Notes / Admin",
      "source": "workorder",
      "method": "Manual — entered at Work Order per run",
      "status": "confirmed"
    },
    {
      "name": "Additional Photo / File",
      "section": "Notes / Admin",
      "source": "workorder",
      "method": "Manual — uploaded at Work Order per run",
      "status": "confirmed"
    },
    {
      "name": "Inactive",
      "section": "Notes / Admin",
      "source": "sop",
      "method": "SOP lifecycle flag",
      "status": "confirmed"
    },
    {
      "name": "Bom Revision",
      "section": "Notes / Admin",
      "source": "bomline",
      "method": "Auto from BOM Revision record (version/Name field)",
      "status": "confirmed"
    },
    {
      "name": "SOP Docusign Contract",
      "section": "Notes / Admin",
      "source": "remove",
      "method": "Lives on Customer Approval — not SOP",
      "status": "rem",
      "notes": "Already exists on Customer Approval entity"
    },
    {
      "name": "Project Format",
      "section": "Notes / Admin",
      "source": "autocalc",
      "method": "Auto-calc from Item Format?",
      "status": "rem",
      "notes": "Confirm if derived or remove entirely"
    },
    {
      "name": "SOP Print",
      "section": "Notes / Admin",
      "source": "sop",
      "method": "Manual print trigger",
      "status": "flag",
      "notes": "Confirm if still in use — who triggers a print?"
    },
    {
      "name": "Item (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "item",
      "method": "Component item link — one row per component",
      "status": "confirmed"
    },
    {
      "name": "Customer Item # (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "item",
      "method": "Auto from component Item record",
      "status": "confirmed"
    },
    {
      "name": "BOM Quantity (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "bomline",
      "method": "Set per component row in BOM Revision",
      "status": "confirmed"
    },
    {
      "name": "Quantity (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "bomline",
      "method": "Set per component row in BOM Revision",
      "status": "confirmed"
    },
    {
      "name": "Units (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "bomline",
      "method": "Set per component row in BOM Revision",
      "status": "confirmed"
    },
    {
      "name": "Item Source (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "bomline",
      "method": "Stock / Phantom / Work Order — set per row",
      "status": "confirmed"
    },
    {
      "name": "Item Display Name (BOM Sublist)",
      "section": "BOM Revision Sublist",
      "source": "item",
      "method": "Auto from component Item record",
      "status": "confirmed"
    },
    {
      "name": "Allergens",
      "section": "Quality",
      "source": "blueprint",
      "method": "Auto from Blueprint (Quality section)",
      "status": "confirmed"
    },
    {
      "name": "Organic",
      "section": "Quality",
      "source": "blueprint",
      "method": "Auto from Blueprint (Quality section)",
      "status": "confirmed"
    },
    {
      "name": "Additional Quality Fields",
      "section": "Quality",
      "source": "blueprint",
      "method": "Auto from Blueprint — full quality field list TBD",
      "status": "flag",
      "notes": "Review with Jeffrey which quality fields belong on the SOP beyond Allergens and Organic"
    },
    {
      "name": "Load Bars",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "",
      "status": "confirmed"
    },
    {
      "name": "Load Straps",
      "section": "Outbounds",
      "source": "blueprint",
      "method": "",
      "status": "confirmed"
    }
  ]
};
