# Parts, Machines and Buildings — consolidated review (3 November 2026)

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
