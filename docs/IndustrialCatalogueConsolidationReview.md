# Parts, Machines and Buildings — consolidated review (3 November 2026)

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

| Type | Canonical IDs before integration | Newly reconciled IDs | Current canonical IDs | Remaining unmapped candidates |
| --- | ---: | ---: | ---: | ---: |
| Parts | 14 | 8 | 22 | 0 |
| Machines | 34 | 8 | 42 | 0 |
| Buildings | 24 | 0 | 24 | 0 |

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
