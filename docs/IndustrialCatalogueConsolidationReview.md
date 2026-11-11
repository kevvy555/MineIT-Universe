# Parts, Machines and Buildings — consolidated review (3 November 2026)

> **Superseded for current review:** the complete schema-13 alignment and its
> consolidated 24-Building / 45-Machine / 19-Part catalogue report are in
> [IndustrialCatalogueAlignmentReview.md](IndustrialCatalogueAlignmentReview.md).
> This document remains historical evidence for the earlier consolidation.

> **Current Parts catalogue state (3 November 2026, feature PR #24):** **19 active
> finished Parts**, zero active legacy Part records. The old Battery Parts,
> Thermal / Optical Parts and Fabrication Parts IDs were explicitly retired
> following user approval. Their former Machine consumers and technology
> unlocks are tracked as **unapproved migration reviews**, not falsely
> reassigned. Historical stages below describe earlier 22-record snapshots.
>
> No Android saved-stock conversion or final engineering compatibility has
> been implemented as part of the Universe catalogue retirement.

## Scope and authority

This is a **read-only catalogue review**, not a release of new gameplay balance or a
replacement for canonical Universe entity definitions. Follow the repository's
`AGENTS.md`: `data/` owns canonical entity identities and relationships. The
Android discovery may be materialised as a clearly labelled reference snapshot
without turning provisional design numbers into canonical facts.

The established Substances table is the pattern. Existing **Parts**, **Machines**
and **Buildings** sections in the Directory are now bulk-review entry points,
with the same horizontal column-group picker, global and per-group selection,
text/value filters, sorting, and link to canonical detail records.

- Parts: `index.html?view=directory&focus=parts`
- Machines: `index.html?view=directory&focus=machines`
- Buildings: `index.html?view=directory&focus=buildings`
- Substances remains at `index.html?view=directory&focus=substances`

## Snapshot and reconciliation

`game-specs/mineit-mobile/industrial-discovery-reference.json` contains a
**reference-only** export of ten Android CSV reviews from
`kevvy555/MineIT-Android` `develop`, pinned to source SHA
`1f17f5a9f9a816239f973b6fc1b3f56b379b596a`. The JSON preserves
the original CSV field names, data, review status, approval status and
unresolved notes rather than inferring new canon. Source files and their
section labels are listed within the snapshot.

| Type | Before new identity integration | New identities | Initially reconciled | Current active identities | Retired legacy |
| --- | ---: | ---: | ---: | ---: | ---: |
| Parts | 14 | 8 | 22 | **19** | **3** |
| Machines | 34 | 8 | 42 | 42 | 0 |
| Buildings | 24 | 0 | 24 | 24 | 0 |

The 16 approved distinct identities were integrated on 3 November 2026 into
`data/parts.json` and `data/machines.json` with **stable `part-` and
`machine-` IDs**. The original `candidate-` IDs remain solely as
`provenance.androidDiscoveryWorkingId` for auditability. The frozen source
snapshot deliberately retains the old `unmappedCandidates` key for its
historical fidelity; the catalogue projection maps these source rows onto the
canonical IDs, so there is **one visible review row per canonical entity**.

This does not mean every proposed specification is approved. Manufacturer
prices, unqualified material quantities, unresolved fuel chemistry, machine
grades, maintenance rates and Vector Exchange Drive engineering remain in
the reference-only discovery overlay, not canonical production facts.

### Reconciled canonical Part identities

| Canonical Part ID | Approved identity | Remaining design qualification |
| --- | --- | --- |
| `part-lead-acid-battery-module` | Lead-Acid Battery Module | Exact cell, housing, safety and operating rating |
| `part-lithium-based-battery-module` | Lithium-Based Battery Module | Cathode chemistry, electrolyte and qualified physical recipe |
| `part-thermal-parts` | Thermal Parts | Qualified insulation and thermal ratings |
| `part-optical-parts` | Optical Parts | Optical grade and specialist components |
| `part-forming-cutting-tooling` | Forming & Cutting Tooling | Cutter grade, geometry, wear and sizing |
| `part-welding-parts` | Welding Parts | Welding process and insulation |
| `part-precast-concrete-sections` | Precast Concrete Sections | Section size, concrete grade and reinforcement |
| `part-nuclear-fuel-assembly` | Nuclear Fuel Assembly | Fabricated fission fuel chemistry, cladding and reactor compatibility |

Existing broad `part-battery-parts`, `part-thermal-optical-parts` and
`part-fabrication-parts` remain stable, valid legacy families. There is no
automatic rewrite of existing machines' Part references. New Part
`substanceIds` express approved **material families or upstream inputs**,
not a finished quantitative manufacturing recipe.

### Reconciled canonical Machine identities

| Canonical Machine ID | Approved identity | Canonical physical specification |
| --- | --- | --- |
| `machine-conventional-electric-motor` | Conventional Electric Motor | Principal material families; exact motor BOM pending |
| `machine-rare-earth-permanent-magnet-motor` | Rare-Earth Permanent-Magnet Motor | Principal material families; magnetic grade/cost pending |
| `machine-vector-exchange-drive` | Vector Exchange Drive | Lore-backed propulsion identity; internal engineering blocked |
| `machine-personal-recreation-terminal` | Personal Recreation Terminal | Approved Part/material BOM, labour, yield and amenity rating |
| `machine-communal-fitness-leisure-system` | Communal Fitness & Leisure System | Approved Part/material BOM, labour, yield and amenity rating |
| `machine-advanced-entertainment-system` | Advanced Entertainment System | Approved Part/material BOM, labour, yield and amenity rating |
| `machine-immersive-recreation-suite` | Immersive Recreation Suite | Approved Part/material BOM, labour, yield and amenity rating |
| `machine-integrated-wellness-leisure-system` | Integrated Wellness & Leisure System | Approved Part/material BOM, labour, yield and amenity rating |

The five residential Machines have `approvedPhysicalBOM` and
`amenityProfile` records with input quantities, Part IDs, labour/testing,
production yield, service slots/day, footprint and rated Power. Their approved
Parts are cross-linked in the existing reciprocal `part.machineIds` /
`machine.partIds` graph. Android Housing technology unlock levels and
manufacturer prices remain in the reference-only review; they are not
introduced as universe-wide immutable gameplay rules.

The Vector Exchange Drive is a **Machine** identity for technical composition;
the existing `product-commercial-drive` is a market-facing commercial
product and is not automatically declared identical to it. The lore identity
is canonical; a complete technical BOM is not.

### Building coverage and outstanding work

Every existing Universe building ID matches a row in each of the three Android
building review CSVs. Collection Camp, Stockpile and Accommodation have
approved physical BOMs; prices and broader operating integration remain
incomplete. Quarry's quantitative proposal is paused/unapproved, and the
remaining building physical BOMs are largely unquantified.

The mining workforce discovery also discusses an **Atmospheric Harvester**,
which is not among the 24 current building IDs. Do not add it automatically;
decide whether it warrants a distinct canonical building.

The source's `mine-common-universal-review.md` explicitly rejects a
one-size-fits-all working-section expansion model. The manufacturing mockups
for Refinery, Parts Workshop, Machine Works and Shipyard are design references,
not proof of shipped Android behaviour.

## Remaining reconciliation and engineering gates

1. **Stable identity:** the 16 Parts/Machines identities are now reconciled.
   Specialist industrial **building** identities remain under review.
2. **Physical BOM:** crosswalk named materials to existing substance/product
   records; validate units and finished Parts quantities.
3. **Equipment role:** split merely compatible machinery from required,
   optional and environment-conditional fit-outs. An existing `machineIds`
   entry does not imply that the building owns that machine.
4. **Progression:** distinguish construction blueprint tiers, installed
   levels and technology gates.
5. **Economics:** retain manufacturer quotes and input costs as provisional
   until the dependency costs and ownership/valuation rules are approved.
6. **Gameplay:** treat per-save installed machines, staffing, inventory,
   condition and live market prices as mutable state, not Universe canon.
7. **Validation:** verify cross-references and approvals before promoting
   reviewed data from the reference snapshot into canonical entity records.

## Interface boundaries

The Directory reuses the existing Substances renderer and CSS. Each
industrial catalogue has its own selection/filter state and column groups.
Unknown fields appear under **Additional Review Fields** rather than being
silently dropped. Original discovery source metadata and approval status
remain visible alongside newly reconciled canonical records. This change
updates canonical Parts/Machines but **does not** modify Android runtime,
Substances canon or the 24 Buildings.

## Further sources to review

- Android `docs/discovery/galaxy-economic-foundation.md` — approval decisions,
  technology and pricing architecture (especially building-led review)
- Android `docs/discovery/proposed-mine-extraction-expansion-workforce-review.csv`
- Android `docs/discovery/mine-common-universal-review.md`
- Android `docs/discovery/mockups/README.md` — interactive design limitations

Those are deliberately **not** treated as an automatic bulk source of
canonical facts.

---

## Parts consolidation pass — 3 November 2026

**Status:** reviewed canonical data and existing Directory UI on a dedicated feature branch.
This work is limited to Parts and shared read-only presentation. No Android runtime,
save migration, final production recipe, new building or live market price is authorised.

### Reviewed source and unit economics

The governing discovery decisions are in
`MineIT-Android/docs/discovery/galaxy-economic-foundation.md` §§48–60;
the three source registers are
`proposed-parts-material-boms.csv`,
`proposed-parts-quantitative-material-inputs.csv`, and
`proposed-parts-reference-prices.csv`.
The pinned Android industrial snapshot remains available under
`game-specs/mineit-mobile/industrial-discovery-reference.json` for source
traceability. **Only `data/parts.json` authors the current Parts identity
and approved planning attributes.** Source review names, prices and status
fields are no longer repeated as separate Parts table columns.

- **22 stable canonical IDs** retained: **19 intended independently countable
  finished products**, **three legacy compatibility-only identities**.
- The older `part-battery-parts`, `part-thermal-optical-parts`, and
  `part-fabrication-parts` remain stable for migration and existing consumers;
  their `legacyReplacementPartIds` link to the appropriate specific products.
  They are not new stockable/tradable products in the target economy.
- **16** finished products have `APPROVED_INPUT_FAMILIES`; **three** (lead-acid
  battery, lithium-based battery, nuclear fuel assembly) have
  `APPROVED_PRODUCT_BOM_PENDING`. The status is about material-family
  direction, **not certification of a complete numerical production recipe**.
- Each finished Part has `finishedUnit.count=1` and `unit=each` together
  with its product-specific description. Generic `substanceIds` are retained
  as older *material classifications*, not misrepresented as complete recipes.
- `materialInputs` contain **61 linked material references** with canonical
  `substanceId`, `requirement` and `approval` qualifiers, and **58 planning
  quantity entries** in kg per finished Part. These include explicit
  conditional materials and **planning-only/unqualified candidates** where
  exact chemical grades or materials have not been approved.
- `unresolvedMaterialInputs` contain **five explicit non-ID descriptions**:
  lithium cathode allowance, lithium electrolyte allowance, suitable sand,
  process water and unqualified nuclear fuel/cladding. Their textual labels
  and allowances are NOT fictional canonical material references.
- `planningReference` holds a §59 approved *discovery reference*
  finished mass, manufacturer cost and manufacturer base selling quote for
  **18 Parts**. Nuclear Fuel Assembly is deliberately blocked/unpriced.
  These are **not live Android prices, final factory recipes, contractual
  buyer prices, or approved transfer/appraisal amounts**.

### Data duplication and presentation

- For **20 records**, `subCategories` merely repeated the single
  `subCategory`; those duplicate arrays are removed. The two records with
  genuinely multiple subcategories retain them. Other consumers may still
  use the stable primary `subCategory`.
- The duplicated `materialDesignStatus` / historical source-review status
  is replaced by one `materialApprovalStatus` per Part, with source commit
  and section evidence in `provenance.partsDiscovery`.
- The existing **Parts** Directory section uses the exact shared review
  component from Substances. It does not introduce a new page or sidebar
  section. `substanceIds`, `materialInputs`, `machineIds` and
  `legacyReplacementPartIds` render as links to canonical entity details.
  Unresolved IDs render explicitly as errors, rather than broken silent
  links. The individual Part detail view also links to these materials and
  lists unresolved inputs and planning economics with status labels.
- Duplicate historical CSV-name, review-BOM and reference-price columns
  are not shown side-by-side with the consolidated canonical Parts fields.
  The frozen Android snapshot remains in git for provenance, and is still
  used by the separate Machines and Buildings reviews.
- `entityType` remains on source records for compatibility but is not
  a selectable Parts table column; the derived constant
  `catalogueStatus` is similarly hidden. This does not affect Substances,
  Machines or Buildings column preferences.
- `machineIds` and inverse `machine.partIds` remain intact and reciprocal
  for now (151 existing links); removing one side may break consumers. Their
  long-term single-direction ownership should be decided together with the
  Machine compatibility/production-equipment review.

### Remaining design and approval questions (not resolved by implementation)

1. Material qualifications: finished polymer seal grade, compatible thermal
   insulation, suitable structural/optical grades, sand and process-water
   stock/process identity, lithium cathode/electrolyte, fission fuel/cladding.
2. Per-Part **complete physical recipe**: manufacturing equipment, actual
   per-unit rated mass/volume, qualified constituent amounts, yield, labour,
   tests, useful life, scrap and technical grade. Even when planning kg are
   recorded, the source warns against treating them as certified final ratios.
3. **Six Parts lack a Machine-consumer link**; some are building inputs,
   upstream spare stock or await a compatible engineering design. Do not
   attach nuclear assemblies to the existing **fusion** Ship Reactor or
   automatically assert compatibility for battery variants.
4. Existing broader Machine relationships retained for legacy compatibility
   must be revalidated product-by-product during the Machines pass. Production
   Machines and consumer Machines are two distinct relationship types.
5. Some historical category labels are inconsistent (for example Mechanical
   Parts categorised under Power), so a taxonomy review is still required.
   No existing Part ID was changed or deleted.
6. Prices are only the user-approved **first-pass comparison**: a 70 CC/hour
   planning labour anchor, plus a 25% margin and 50 CC rounding for base quote.
   No game market or charter buyout is implemented. Installed Part value must
   be counted once inside its Machine/Building parent; loose stock and
   ownership are separate appraisal inputs.

### Verification

Automated validation covers canonical reference existence, Part role counts,
nonduplicated subcategories, source-approval states, linked planned quantities,
unresolved inputs without fake IDs, source-pinned planning prices and absence
of duplicate Android review columns in the Parts table. Browser interaction
and small-screen visual QA remain separate manual checks.

## Superseded Parts removal — explicit approval, 3 November 2026

**Decision:** remove the three combined source-family IDs from the current
canonical `data/parts.json` collection. All 19 individual finished Part
products remain. This supersedes the earlier temporary decision to preserve
the three generic source families as active Part records. Original names,
historical IDs and mapping context remain here and in the pinned Android
discovery archive, not in an independent shadow canonical catalogue.

| Retired canonical ID | Former meaning | Distinct surviving Parts |
| --- | --- | --- |
| `part-battery-parts` | Battery Parts (generic/ambiguous chemistry) | `part-lead-acid-battery-module`, `part-lithium-based-battery-module` |
| `part-thermal-optical-parts` | Thermal / Optical Parts (two different functions) | `part-thermal-parts`, `part-optical-parts` |
| `part-fabrication-parts` | Fabrication Parts (tooling and welding) | `part-forming-cutting-tooling`, `part-welding-parts` |

### Affected Machine consumers — migration remains unapproved

Removing the three old Part identities invalidated **14 prior
Machine–Part compatibility edges across ten Machines**. They were removed
from canonical `machine.partIds`; the remaining known links were kept.
Each former edge is now represented as a typed
`machine.pendingPartCompatibility` review with a legacy *family name*,
existing candidate product IDs where physically plausible, an
`unapproved-consumer-mapping` status and an engineering note. A candidate
is **not** a required, installed or manufacturing-ready input.

| Affected Machine | Number of previous legacy edges | Disposition |
| --- | ---: | --- |
| Ship Reactor | 3 | Battery, thermal/optical and fabrication fit require independent evaluation; no fission-related assumption |
| Ship Refinery Unit | 1 | Thermal process/fitting review |
| Smelter Machine | 1 | Heat-rated Thermal Parts review |
| Crude Chemical Battery | 1 | Electrical chemistry/grade review; do not assume battery-module chemistry |
| Thermoelectric Trickler | 2 | Thermal management and optional electrical buffer; no presumed rotating generator |
| Solar Thermal Generator | 1 | Thermal collection vs optical reflector Parts separately |
| Climate Control Machine | 1 | Thermal control rating review |
| Growth Management System | 1 | Growth illumination, sensors and temperature fit unresolved |
| Fabrication Machine | 1 | Forming & Cutting Tooling candidate needs compatibility approval |
| Welding Machine | 2 | Welding Parts and potential thermal protection reviewed separately |

Six existing Research Technology identities remain valid, but their
**six obsolete `unlockedPartIds` links** were removed. Each now has a
typed `partUnlockReview` with the surviving candidate product IDs and
`unapproved-technology-mapping` status; no replacement Part is automatically
granted by a legacy unlock. The affected technologies are:

- Power Systems Salvage
- Thermal Systems Salvage
- Processing and Fabrication Salvage
- Battery Parts Manufacturing
- Thermal / Optical Parts Manufacturing
- Fabrication Parts Manufacturing

The historical source snapshot intentionally retains the old names/IDs as
**archived discovery evidence**; the live Parts review projects **only the
19 canonical records**. Existing external saved stock, historical Desktop
source research requirements, importer mappings and future Mobile runtime
consumption have **not** been migrated and require explicit compatibility
design before production activation. Do not interpret removal as proof that
saved generic stock can be converted automatically into specific finished
products. The current Universe canonical graph contains no references to
retired IDs in its active Part/Machine/Research relationships.

Regression checks enforce that all retired IDs are absent from the
canonical Part collection, every active candidate reference resolves to one
of the surviving Parts, and all 14 Machine and six research migration
questions remain plainly flagged pending.


## Parts review UI refinements — 4 November 2026

The designer clarified the following *implemented* Parts display/data decisions:

- The catalogue manufacturing unit is always exactly one finished Part.
  One canonical `finishedUnitCount: 1` replaces redundant
  `finishedUnit.count` + `finishedUnit.unit: "each"`.
  The detailed unit description remains `finishedUnitDescription`.
- `materialInputs[].quantityKg` replaces `planningQuantityKg` for 58
  linked Substance inputs. The values are numeric kg per finished Part,
  with existing material requirement/qualification and provenance retained.
  **Renaming does not promote discovery planning values into certified
  final engineering recipes.**
- The existing table displays material name, numeric quantity and
  required/conditional/upstream/candidate qualifier on separate aligned
  lines, with linked canonical Substance detail navigation.
- Column labels are `Weight (kg)` for `planningReference.finishedMassKg`
  and `Manufacturer Quote Cost (CC)` for
  `planningReference.baseManufacturerQuoteCC` (approved planning
  reference numbers, not game-live quotes).
- A selectable `Part Image` column shows actual generated/approved art
  thumbnails when available; otherwise it clearly says "Not generated".
  Artwork metadata and generated state remain canonical in the existing
  per-Part `image` object; **no images are invented or newly generated**.

**Historical note — resolved 4 November 2026:** The designer approved one
overall Approval column, a derived Needs Approval column, and two common
reference tables for approval statuses and column definitions. The later
explicit per-field Part migration is described in the final section below.
`Approved in Principle` and `Approved for Planning` were deliberately
excluded from the eight-state shared vocabulary.

**Historical note — material identities resolved 4 November 2026:** LFP,
concrete, and nuclear material identities were subsequently selected and
linked; the later audit lists the **seven remaining unqualified candidate
inputs** and other open engineering decisions. The earlier unresolved
identity allowances are no longer current.


## Approved LFP battery module manufacturing recipe — 4 November 2026

The user approved a deliberately **simple seven-refined-material gameplay BOM**
for one `part-lithium-based-battery-module`, with a **finished mass of 18 kg**.
This supersedes the battery's earlier provisional unqualified/candidate inputs
and the two free-text unresolved allowances; it does not require modelling
every internal battery subassembly.

| Direct refined input | Canonical ID | kg per module |
| --- | --- | ---: |
| Lithium Iron Phosphate (LFP) Cathode Material | `named-substance-lfp-cathode-material` | 5 |
| Refined Graphite | `substance-refined-graphite` | 2.5 |
| LFP Battery Electrolyte | `named-substance-lfp-battery-electrolyte` | 2 |
| Refined Copper | `named-substance-refined-copper` | 2 |
| Aluminium | `named-substance-aluminium` | 0.5 |
| Polymer Feedstock | `named-substance-polymer-feedstock` | 3 |
| Stainless Steel | `named-substance-stainless-steel` | 3 |
| **Total / approved finished mass** | | **18** |

The two newly introduced identities are **stockable processed/refined materials**,
not Parts. The LFP cathode has a typed upstream link to the already existing
Lithium Carbonate; the 1.5 kg precursor formerly recorded on the battery itself
was removed to avoid double counting. Its iron/phosphate precursor recipe and
upstream quantities are **not** being finalised here. The electrolyte is
LiPF6 dissolved in carbonate solvents. Their generic-class taxonomy was
approved on 10 November 2026: the cathode uses `substance-battery-cathode-compound`
and the electrolyte uses `substance-nonaqueous-electrolyte`. The existing generic
Electrolyte Solution remains the canonical **aqueous / Water** archetype and is
not assigned to this **nonaqueous** processed product.

Refined Graphite must meet battery-grade quality, and Refined Copper/Aluminium
foil processing, microporous PE/PP separator formation from Polymer Feedstock,
and the integrated battery management electronics are handled inside the battery
factory. Stainless Steel forms the housing/supports. **No separate BMS,
separator Part, copper foil or aluminium foil product identity** is required.
Those engineering functions do not introduce additional BOM rows.

The **18 kg total and seven input quantities are approved for the gameplay
manufacturing recipe**, not a certified physical factory design. The historical
manufacturer cost and quote in the Part's `planningReference` remain
discovery-era price references: **not recalculated or newly approved against
the seven-material LFP recipe**. The rest of the Parts catalogue remains at
its earlier review state.

This decision reduces the currently unresolved Part material descriptions
from five to **three** (two concrete inputs and the nuclear fuel/cladding
description). Other provisional input qualifications elsewhere remain pending.


## Precast concrete sand and water inputs approved — 4 November 2026

The user approved resolving both open Precast Concrete Sections inputs by
reusing **existing canonical resources**, not creating duplicate materials:

| Concrete direct input | Canonical resource identity | kg per finished section |
| --- | --- | ---: |
| Cement | `named-substance-cement` | 175 |
| Graded Aggregate | `named-substance-graded-aggregate` | 600 |
| Silica Sand | `mobile-resource-silica-sand` | 300 |
| Fresh Water (process input) | `substance-fresh-water` | 75 |
| Steel (conditional reinforced example) | `named-substance-steel` | 25 |

The two former `unresolvedMaterialInputs` placeholders are removed from
this Part. Silica Sand points to the **existing Mobile natural resource identity**
rather than inventing a refined sand product, while Fresh Water refers to its
existing generic Substance identity. Both resolve in the shared Universe graph.
The 75 kg water figure is a **process input**, and must not be assumed to
remain entirely in the cured output.

The previous `planningReference.finishedMassKg = 1160` and price/quote figures
are retained as discovery references, not silently revised: these quantities
total 1150 kg excluding the optional 25 kg steel, and 1175 kg including it.
The approved additions settle **what inputs are consumed**, not the separate
mass-balance or product-size specification; those need their own review if the
design is later taken beyond planning.

This leaves **one** unresolved Part material description, for the nuclear
assembly fuel/cladding design. The shared approval-system migration and
other unqualified Part inputs remain pending separately.


## Nuclear Fuel Assembly material selection approved — 4 November 2026

The designer approved a deliberately simple three-material input list for
`part-nuclear-fuel-assembly`, without introducing detailed internal reactor
engineering or specifying unsupported numerical input quantities:

| Direct input | Canonical material identity | Manufacturing role |
| --- | --- | --- |
| Fission Fuel Material | `named-substance-fission-fuel-material` | Refined fission-reactor fuel feedstock |
| Stainless Steel | `named-substance-stainless-steel` | Structural components |
| Refined Ceramic | `substance-refined-ceramic` | Insulation |

**Fission Fuel Material is a new stockable Refined Material, not a Part.**
Its typed `upstreamMaterialIds` links to existing
`named-substance-uranium-concentrate`, rather than adding that precursor
again as a direct input to the nuclear assembly. Its generic substance
classification remains explicitly pending review; it does not inherit the
fusion-fuel classification.

The previously unresolved free-text nuclear material placeholder is retired.
This brings **all 19 Parts to zero unresolved material-identity placeholders**.
The nuclear Part records the approved input *families* as
`materialApprovalStatus: APPROVED_INPUT_FAMILIES`; it is **not an approved
quantitative manufacturing recipe**. No input quantities, assembly weight,
reactor compatibility, fuel processing specification, manufacturer cost,
or manufacturer quote were invented. The existing
`planningReference.status: blocked-pending-engineering` remains in place.

Separate follow-up work still includes qualifying provisional candidates
elsewhere in the Parts list and the approved but not-yet-implemented common
Approval/Needs Approval column system. Material identity resolution must not
be confused with full engineering/commercial sign-off.


## Common approval governance and Part mass audit — 4 November 2026

The **read-only** Universe Directory now has two separate reference tables:
**Approval Statuses** (eight shared states) and **Column Definitions**
(one named entry per selectable column of Substances, Parts, Machines and
Buildings, each marking whether it requires an approval). Both collections
are canonical manifest data; the four bulk grids derive a single
**Approval** column and **Needs Approval** list from that registry and
their canonical records. Existing legacy source review codes remain
available as historical context and are not automatically treated as
final decisions. The browser does **not** provide a write-back approval
button: approvals are authored through canonical data review.

The Parts grid also displays a derived **Mass Review** field comparing
the total of mandatory/direct inputs against the preserved finished-weight
planning reference. Conditional alternatives and reinforcing inputs are
displayed separately. An input-vs-finished difference is **not automatically
an error**, because real processing can involve scrap, evaporation, offcuts
and different optional designs. Historical CC prices remain planning-only.

### Material qualification tasks still needing decisions

There are **7 candidate-linked material inputs** which retain
their original `planning-only-unqualified` status. No one has approved their
specific grade/suitability, so the implementation does not silently upgrade
them to an approved BOM:

| Part | Material ID | Current planning quantity (kg) |
| --- | --- | ---: |
| Hydraulic Parts | `substance-polymer` | 1.5 |
| Fluid Handling Parts | `substance-polymer` | 1.5 |
| Lead-Acid Battery Module | `named-substance-refined-copper` | 1 |
| Lead-Acid Battery Module | `substance-polymer` | 4 |
| Thermal Parts | `named-substance-mica-insulation-sheets` | 2.5 |
| Optical Parts | `named-substance-steel` | 4 |
| Welding Parts | `named-substance-mica-insulation-sheets` | 1 |

There are **5 inputs with no numeric quantity** (two optional
variants and three nuclear fuel/structural inputs). These remain unpriced,
unweighted quantity decisions:

| Part | Material ID | Requirement |
| --- | --- | --- |
| Structural Components | `named-substance-aluminium-alloy` | conditional-alternative |
| Optical Parts | `named-substance-optical-sapphire` | conditional-specialist |
| Nuclear Fuel Assembly | `named-substance-fission-fuel-material` | standard |
| Nuclear Fuel Assembly | `named-substance-stainless-steel` | standard |
| Nuclear Fuel Assembly | `substance-refined-ceramic` | standard |

### All Part finished-weight comparisons

Mandatory input quantities below are planning consumptions, not
guaranteed retained weight. The *difference* is input kg minus
reference finished kg. Optional reinforcement is excluded from the
mandatory input total and shown in its own column.

| Part | Mandatory inputs kg | Finished reference kg | Difference kg | Optional kg |
| --- | ---: | ---: | ---: | ---: |
| Generator Parts | 24.6 | 23.5 | +1.1 | — |
| Power Electronics | 6.78 | 6.3 | +0.48 | — |
| Mechanical Parts | 19.6 | 18.8 | +0.8 | — |
| Control & Sensor Parts | 2.62 | 2.4 | +0.22 | — |
| Structural Components | 80 | 76 | +4 | — |
| Hydraulic Parts | 36.5 | 35 | +1.5 | — |
| Extraction Parts | 10 | 9.2 | +0.8 | — |
| Processing Parts | 30 | 28 | +2 | — |
| Computing Parts | 4.7 | 4.35 | +0.35 | — |
| Fluid Handling Parts | 26.5 | 25 | +1.5 | — |
| Bulk Handling Parts | 46 | 44 | +2 | — |
| Lead-Acid Battery Module | 51 | 50 | +1 | — |
| Lithium-Based Battery Module | 18 | 18 | 0 | — |
| Thermal Parts | 36.5 | 35 | +1.5 | — |
| Optical Parts | 13 | 12 | +1 | — |
| Forming & Cutting Tooling | 15 | 13.8 | +1.2 | — |
| Welding Parts | 13 | 12 | +1 | — |
| Precast Concrete Sections | 1150 | 1160 | -10 | 25 |
| Nuclear Fuel Assembly | Pending | Pending | Pending | — |

**17** of the **18** products with a recorded
finished weight have differing mandatory input totals; **1** matches
exactly (the approved 18 kg LFP module). The nuclear assembly remains without
quantity or finished mass. These must be reconciled deliberately with
manufacturing yield/waste assumptions and optional design scope before
promoting weight planning to fully approved physical engineering values.

**Approval boundary:** A resolved material identity is not automatically a
fully approved quantitative recipe. For example, the LFP recipe and its
18 kg planning weight are approved, but its older manufacturer price/quote
have not been recalculated; its overall row therefore remains In Review.
The nuclear selection is linked and identity-complete but retains
Blocked pricing, mass and engineering decisions. All 19 Part identities
have **zero unresolved material-ID placeholders**; downstream Machine/research
compatibility reviews remain independent pending work.

### Registry and status decisions

- Shared states: Not Reviewed, Draft, Proposed, In Review, Approved,
  Blocked, Rejected, Superseded.
- Per-column `requiresApproval` is canonically recorded; label/category,
  approval policy, and table ownership use stable field identifiers.
- Overall Approval in Substances, Machines and Buildings is a read-only
  projection of evidence. **Parts now store one canonical overall Approval**
  verified against explicit per-field status values. In Review and Blocked
  preserve unapproved reference costs and missing quantities.
- The generic-class review for the LFP cathode, nonaqueous LFP electrolyte
  and Fission Fuel Material was resolved on 10 November 2026 with distinct
  approved classification extensions; the aqueous Electrolyte Solution was
  not reused for the nonaqueous category.
- Field status will only advance from evidence or an explicit design
  decision; the approval tables are reference/admin **views**, not
  an authoring UI or a substitute for decisions.


## Final Parts approval consolidation — 4 November 2026

The designer explicitly approved finishing the previously planned status
consolidation. `data/parts.json` is authoritative for all 19 finished Parts:

- **`approval`** is the **single overall canonical Part approval**.
  Every Part has exactly one shared-vocabulary value (currently 18
  **In Review**, one **Blocked**).
- **`fieldApprovalStatuses`** maps each approval-requiring field's
  **stable, literal field key** to its explicit approval state.
  This is subordinate evidence behind the overall Approval, not an
  independently competing overall status.
- **`needsApproval`** is **never persisted**; it is derived from
  `fieldApprovalStatuses` and the canonically registered labels of
  non-approved fields.
- The old `materialApprovalStatus` property and corresponding selectable
  column-definition record were retired by this explicit migration decision.
  The individual `materialInputs[].approval` qualifiers remain, because they
  describe **ingredient-family qualification** rather than the overall
  approval of the complete material BOM.

### Field-approval policy after review

Seven Part columns require approval:

| Part field | Approval purpose | Migration treatment |
| --- | --- | --- |
| `partRole` | Whether the record is an independently countable finished Part | Approved for all 19, matching the accepted 19-product consolidation |
| `finishedUnitCount` | Quantity of finished Parts produced per declared batch | Approved (one) for all 19 |
| `finishedUnitDescription` | Scope and definition of one finished unit | Approved for the agreed 18 kg LFP module; In Review elsewhere, where size/rating or detail remains provisional |
| `materialInputs` | Complete typed manufacturing input recipe | Approved for the seven-material LFP recipe; In Review elsewhere, including the nuclear identity-only selection and candidate inputs |
| `planningReference.finishedMassKg` | Mass used by the planned manufacturer recipe | Approved for the reconciled 18 kg LFP recipe; In Review for other provisional weights; Blocked for nuclear pending numeric design |
| `planningReference.manufacturerCostCC` | Manufacturing economics | In Review on the 18 historical reference costs, Blocked for unpriced nuclear |
| `planningReference.baseManufacturerQuoteCC` | Manufacturer selling quote | In Review on historical quotes, Blocked for unpriced nuclear |

Other Part columns are identity labels, classification, descriptions,
inventory links, source provenance, artwork metadata, legacy planning
context, or **derived** review indicators. These do **not** each require an
independent product/manufacturing sign-off. The image-review workflow and
Machine/technology compatibility approvals remain their own processes.

**Historical implementation note (superseded later on 4 November):**
The initial UI exposed seven `fieldApprovalStatuses.*` table columns.
The designer subsequently removed these redundant review-grid columns.
The seven field decisions remain persisted canonically to derive the
single Approval and Needs Approval columns.

Migration rules are intentionally conservative: family-level approval and
source planning data did not become blanket recipe/weight/price approval.
The fully agreed LFP **material inputs, one-module unit definition and
18 kg weight** remain Approved, but its old manufacturer CC prices remain
In Review, leaving the Part overall In Review. Nuclear Fuel Assembly has
three approved **material identities** but no complete quantitative
recipe, finished mass or approved prices, so its overall Part Approval
remains Blocked.

The implementation rejects inconsistent overall and field statuses,
unknown or missing approval states and attempts to mark missing or
unqualified required material recipes Approved. Automated regression
tests assert the removal of the old status, field coverage for every
Part, and the previously approved LFP/nuclear decisions.

**Publication boundary:** The Directory remains a read-only catalogue;
this change does not introduce a browser-side approval editor, editable
source copies, gameplay prices, or any unreviewed new numerical choices.


## Final Parts review-table simplification — 4 November 2026

After reviewing the expanded selector, the designer approved a further
cleanup so the Parts grid stays a focused product review tool, rather than
an exposed view of import and implementation metadata.

**The Parts table now offers only 20 columns**, grouped into product
identity/classification, material inputs, Machine relationships, planned
weight and prices, **Approval** and **Needs Approval**, the single
**Image Generated** boolean, Canon Status, and description. Seven individual
`fieldApprovalStatuses.*` columns were removed from this table and the
shared Column Definitions registry; the underlying canonical
`data/parts.json` field-level decisions remain intact for governance.
The current row-level Approval and derived Needs Approval remain.

The following redundant selectable columns were retired from the Parts
review grid:

- The seven exposed field-status columns. They duplicate the consolidated
  Approval / Needs Approval summary and remain available in canonical data
  if audit detail is required.
- All import/source-provenance columns, including original Desktop and
  Android file references, repositories, commits, paths, authored-for
  metadata and historical discovery-section links.
- The historical planning Reference / basis, Reference / status and source
  section (only manufacturer weight, cost and quote remain reviewable).
- Mass Review, Unresolved Material Inputs and the duplicate Part Image
  preview/availability field.
- Artwork detail keys, generation prompt/notes and asset state were removed
  from the review **grid**, leaving the single Image Generated **Yes/No**
  column. Original artwork metadata remains on the Part detail/source record
  to comply with asset-generation validation.

**Why provenance is retained in canonical JSON:** A stable record of source
crosswalks/aliases and import provenance can help audit decisions, resolve
migration discrepancies, and reproduce a historical reference. These fields
are not a separate authoritative CSV catalogue, not game state and not
useful to a designer reviewing product recipes daily. This change removes
them from the Parts selector and Column Definitions *without destructively
stripping the useful historical provenance from the canonical records*.

The final empty `unresolvedMaterialInputs: []` properties were deleted
from 16 Parts. No unresolved manufacturing material **identities** remain.

### Needs Approval review shortcuts

The **Needs Approval** column continues to show the readable names of
pending fields. Each Part's row now includes a **Show fields** button.
Selecting it changes the visible grid columns to Name, Approval, Needs
Approval and only that Part's outstanding fields, while filtering the
rows to that Part by name. The shared column chooser also includes a
**Show all pending fields** button, which clears row-specific filters
and displays the union of not-yet-approved columns across Parts.
All this is a read-only review-navigation feature; it does not itself
approve any value or edit data.

The shared eight-state vocabulary and seven *underlying* required Part
approval policies have not changed. The previous list of 17 nonmatching
planning input/finished weights remains in the written audit, but Mass
Review no longer consumes a permanent grid column. Manufacturer costs and
quotes still await separate pricing approval.
