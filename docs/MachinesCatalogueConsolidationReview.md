# Machines Catalogue Consolidation — M01–M06 (4 November 2026)

**Authority:** Designer review/governance in MineIT-Universe, not a change to Android gameplay, save format, technology, live trade prices or installed Machine instances.

**Canonical source:** [`data/machines.json`](../data/machines.json), with column metadata in [`data/column-definitions.json`](../data/column-definitions.json). Do not author an independent Machine catalogue in Android, JavaScript or prototype code. The read-only Android [historical industrial discovery snapshot](../game-specs/mineit-mobile/industrial-discovery-reference.json) remains audit evidence, **not** a second production catalogue.

**Discovery authority:** [Galaxy Economic Foundation](https://github.com/kevvy555/MineIT-Android/blob/develop/docs/discovery/galaxy-economic-foundation.md), especially §§60–61, 69–73 and active checkpoint H012. No approval of 30 provisional Machine prices/recipes in bulk: determine physical application and capacity via the **Building-led review**. H012 stays ACTIVE for the broader Mine design. The refinery capability roster has six proposed new Machine identities that are not included in these 42 or approved by this consolidation.

## M01 — Inventory and crosswalk

- **42 stable Machine IDs**: 34 pre-existing Universe source Machines, two individually named electric motors, Vector Exchange Drive and five optional accommodation luxury Machines.
- **34** historical source BOM proposals, imported conservatively as **typed, explicitly unapproved** planning entries.
- **Eight** historical candidate IDs are mapped via the existing `provenance.androidDiscoveryWorkingId` aliases to existing canonical IDs. They do not create duplicate rows.
- **Five** accommodation devices retain user-approved physical BOMs, service capacity, footprint, Power ratings, and the source approval evidence, without approving any manufacturer CC price.
- **14** unresolved Part compatibility decisions across **10** Machines remain explicit, traceable and unapproved.
- All **42** Machine artwork records remain generated, with original canonical image metadata and asset paths preserved.

### 42-machine audit (stable IDs and import authority)

| Canonical Machine ID | Name | Input authority | Overall review |
|---|---|---|---|
| `machine-exploration-vehicle` | Exploration Vehicle | 34-row Android BOM snapshot | Blocked |
| `machine-ship-scanner` | Ship Scanner | 34-row Android BOM snapshot | In Review |
| `machine-substance-analyser` | Substance Analyser | 34-row Android BOM snapshot | In Review |
| `machine-ship-reactor` | Ship Reactor | 34-row Android BOM snapshot | Blocked |
| `machine-ship-life-support` | Ship Life Support | 34-row Android BOM snapshot | In Review |
| `machine-ship-computer` | Ship Computer | 34-row Android BOM snapshot | In Review |
| `machine-ship-refinery-unit` | Ship Refinery Unit | 34-row Android BOM snapshot | In Review |
| `machine-drill-machine` | Drill Machine | 34-row Android BOM snapshot | In Review |
| `machine-conveyor-machine` | Conveyor Machine | 34-row Android BOM snapshot | In Review |
| `machine-mine-ventilation` | Mine Ventilation | 34-row Android BOM snapshot | In Review |
| `machine-crusher-machine` | Crusher Machine | 34-row Android BOM snapshot | In Review |
| `machine-smelter-machine` | Smelter Machine | 34-row Android BOM snapshot | In Review |
| `machine-crude-chemical-battery` | Crude Chemical Battery | 34-row Android BOM snapshot | In Review |
| `machine-wind-generator` | Wind Generator | 34-row Android BOM snapshot | In Review |
| `machine-water-wheel-generator` | Water Wheel Generator | 34-row Android BOM snapshot | In Review |
| `machine-thermoelectric-trickler` | Thermoelectric Trickler | 34-row Android BOM snapshot | Blocked |
| `machine-solar-thermal-generator` | Solar Thermal Generator | 34-row Android BOM snapshot | In Review |
| `machine-power-distribution-system` | Power Distribution System | 34-row Android BOM snapshot | In Review |
| `machine-life-support-machine` | Life Support Machine | 34-row Android BOM snapshot | In Review |
| `machine-climate-control-machine` | Climate Control Machine | 34-row Android BOM snapshot | In Review |
| `machine-irrigation-system` | Irrigation System | 34-row Android BOM snapshot | In Review |
| `machine-growth-management-system` | Growth Management System | 34-row Android BOM snapshot | In Review |
| `machine-pump-machine` | Pump Machine | 34-row Android BOM snapshot | In Review |
| `machine-filtration-machine` | Filtration Machine | 34-row Android BOM snapshot | In Review |
| `machine-research-computer` | Research Computer | 34-row Android BOM snapshot | In Review |
| `machine-fabrication-machine` | Fabrication Machine | 34-row Android BOM snapshot | In Review |
| `machine-assembly-crane` | Assembly Crane | 34-row Android BOM snapshot | In Review |
| `machine-welding-machine` | Welding Machine | 34-row Android BOM snapshot | In Review |
| `machine-crude-steam-piston-generator` | Crude Steam Piston Generator | 34-row Android BOM snapshot | Blocked |
| `machine-crude-combustion-generator` | Crude Combustion Generator | 34-row Android BOM snapshot | Blocked |
| `machine-livestock-handling-system` | Livestock Handling System | 34-row Android BOM snapshot | In Review |
| `machine-colony-operations-computer` | Colony Operations Computer | 34-row Android BOM snapshot | In Review |
| `machine-bulk-stacker` | Bulk Stacker | 34-row Android BOM snapshot | In Review |
| `machine-warehouse-handler` | Warehouse Handler | 34-row Android BOM snapshot | In Review |
| `machine-conventional-electric-motor` | Conventional Electric Motor | Reconciled discovery identity | In Review |
| `machine-rare-earth-permanent-magnet-motor` | Rare-Earth Permanent-Magnet Motor | Reconciled discovery identity | Blocked |
| `machine-vector-exchange-drive` | Vector Exchange Drive | Reconciled discovery identity | Blocked |
| `machine-personal-recreation-terminal` | Personal Recreation Terminal | Accommodation T1–T5 approved BOM | In Review |
| `machine-communal-fitness-leisure-system` | Communal Fitness & Leisure System | Accommodation T1–T5 approved BOM | In Review |
| `machine-advanced-entertainment-system` | Advanced Entertainment System | Accommodation T1–T5 approved BOM | In Review |
| `machine-immersive-recreation-suite` | Immersive Recreation Suite | Accommodation T1–T5 approved BOM | In Review |
| `machine-integrated-wellness-leisure-system` | Integrated Wellness & Leisure System | Accommodation T1–T5 approved BOM | In Review |

## M02 — One typed manufacturing representation

Every canonical Machine now has a `manufacturing` object with:

- `finishedPartInputs: [{partId, quantity}]` — an entire named Part per count, never a second charge for its embedded raw materials.
- `directMaterialInputs: [{materialId, quantityKg}]` — additional material only; `qualification: "grade-tbd"` preserves any unresolved processed Polymer grade.
- `nestedMachineInputs: [{machineId, quantity}]` — separately finished rated Machines, including conventional/rare-earth motors where provisionally specified.
- `assemblyHours`, `factoryHours`, `testHours`, `goodUnitYield`, `finishedMassKg`, `manufacturerCostCC`, `manufacturerQuoteCC` — typed numeric values or `null` when missing.
- `authority` plus original approval evidence or review notes — explicitly distinguishes a previously approved physical BOM from an unapproved Android BOM or an identity awaiting a recipe.

Historic source candidate IDs inside BOMs were reconciled to stable approved **identities**, **not** to newly approved quantitative recipes or Part/Machine compatibility. Both source `partIds` and `pendingPartCompatibility` retain their existing meaning. In particular, the proposed generator BOM is not used to fill empty canonical `partIds` on the two crude generators. This avoids asserting compatibility before the user reviews it.

The legacy `approvedPhysicalBOM` and `amenityProfile` objects were migrated into one `manufacturing` object and `operatingProfile` respectively. `operatingProfile.ratedCapacity` is a typed `{quantity, unit}` pair; five accommodation devices have explicitly approved resident service slots/day, Power and footprint. All other ratings remain unresolved instead of receiving invented numbers. `housingTechnologyTier` records the already approved T1–T5 accommodation unlock direction, not a fabricated technology foreign key.

All manufacturer CC costs/quotes are **reference-only calculations**, not approved list prices or market rates; no gameplay consumer is authorised to treat these values as economic truth. This is also true where numbers are present.

## M03 — Approval governance

Exactly one `approval` field is canonical per Machine. `fieldApprovalStatuses` provides subordinate, explicit evidence for the **16** registered required design fields. `needsApproval` is derived **only at render time**, never persisted. The existing eight-status vocabulary is retained.

A required field with no value **still requires review**: missing fields are never silently skipped. An explicitly non-applicable field can be excluded using `fieldApplicability[fieldKey] = false`, but only where its value is blank, null or an empty array; in particular, a nonempty unresolved Part compatibility list cannot be declared inapplicable. An approved field cannot be empty, and unqualified material recipes cannot become Approved. The aggregate status is validated against its underlying field states.

**State after conservative migration:** **35 In Review, seven Blocked, zero fully Approved**. This does *not* revoke the five physical and amenity decisions already approved: their corresponding nine field states remain Approved. Their manufacturer costs, quotes and full-design outstanding fields remain In Review. Source-proposed quantities and pricing retain In Review status; the seven unsolved engineering/valuation gates are blocked (Exploration Vehicle, Ship Reactor, Thermoelectric Trickler, both Crude Generators, Rare-Earth Permanent-Magnet Motor and Vector Exchange Drive).

The read-only UI **does not approve** data. A review approval requires an explicit later user decision and corresponding authored source update. A future user-approved final manufacturer price needs the upstream materials, labour, machine, yield and quality rates established separately.

## M04 — Compact review UI (25 fields)

The grid selector now has **25** fields, in exactly six horizontal responsive category panels:

- **Identity & Classification** — 4 fields.
- **Physical Construction** — 4 fields.
- **Operation & Capabilities** — 7 fields.
- **Manufacturing & Pricing** — 7 fields.
- **Discovery & Approval** — 2 fields.
- **Artwork & Visuals** — 1 fields.

Fields cover Name/Category/Subcategory/Description; finished Parts, direct materials, nested Machines and pending Part compatibility; input/output, rated capacity, Power, footprint, derived building compatibility and technology unlock; assembly/shop/test, yield, weight, manufacturer cost/quote; **Approval** and **Needs Approval**; and **Image Generated** as a single Yes/No field.

Each category retains **Select all / Deselect all**, plus global controls. **Show fields** on each row focuses that one Machine's pending approval columns. **Show all pending fields** shows the union across Machines and resets row filtering. Table filtering, sorting and linked-name navigation are preserved. The chooser wraps categories horizontally on desktop and becomes phone-friendly without nested selector scrolling.

**Only these columns appear in the grid.** Original provenance, image prompt/key/status, source review snapshots, field statuses and review basis remain retained for audit in canonical JSON or frozen reference, not as selectable clutter. Machine detail now exposes linked quantities, specialist blockers, prices clearly labelled provisional and current design status.

## M05 — Automated validation

`validation/validate-machines-consolidation.mjs` plus existing industrial, approval and review validators enforce:

- exactly 42 unique stable Machine IDs, 25 registered fields, 16 explicit required field statuses, six categories and no duplicate candidate rows;
- canonical Part/material/nested-Machine foreign keys, positive typed quantities, no duplicated inputs or nested manufacturing cycles;
- five physical BOMs and accommodation ratings preserved, 34 source proposals unapproved, 29 provisional numeric cost proposals, 14 pending Part relationships and 42 art records;
- fully derived/read-only Machine review with or without the Android historical snapshot, correct selection shortcuts and no exposed provenance/status subcolumns;
- conservative overall approvals and explicit rejection of fictitious approval states or approved absent fields.

The existing validation workflow runs the Machine-specific suite alongside all previously required Universe, Parts, industrial, image and governance tests.

## M06 — Acceptance and next review

This is a **catalogue and review UX consolidation**, not approval of any new hardware design, physical capacity, grade, machine/Part relationship or price. Review each Machine in its actual Building context; preserve reusable capital equipment, automatic maintenance from stocked Parts, no component double counting, independent ship equipment, and no added per-save mutable condition/ownership/stock fields in canon.

Next designer review can progress from actual Android extraction/Mine needs, through refining and power equipment, then general-purpose, accommodation and ship systems. New specialist refinery capabilities should receive their own future user design decision before stable identities are authored.

**Verification boundary:** Automated CI covers data, derivations, links, and JS syntax. Manual desktop and portrait-device appearance must still be checked on the published Directory before UI visual acceptance. No separate runtime or APK change is included.
