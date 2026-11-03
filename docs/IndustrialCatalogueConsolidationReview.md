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

| Type | Existing canonical IDs | Matched source reviews | Additional unique review-only candidates | Total visible rows |
| --- | ---: | ---: | ---: | ---: |
| Parts | 14 | 14 | 8 | 22 |
| Machines | 34 | 34 | 8 | 42 |
| Buildings | 24 | 24 | 0 | 24 |

Candidate rows are **not** added to `data/parts.json`,
`data/machines.json` or `data/buildings.json`. Their working IDs must be
reconciled, and their names are not links to nonexistent canonical entities.
The canonical names and other fields still come from the manifest datasets;
review columns are a read-only overlay.

### New Part identities requiring review

- Lead-Acid Battery Module
- Lithium-Based Battery Module
- Thermal Parts
- Optical Parts
- Forming & Cutting Tooling
- Welding Parts
- Precast Concrete Sections
- Nuclear Fuel Assembly

### New Machine identities requiring review

- Conventional Electric Motor
- Rare-Earth Permanent-Magnet Motor
- Vector Exchange Drive
- Personal Recreation Terminal
- Communal Fitness & Leisure System
- Advanced Entertainment System
- Immersive Recreation Suite
- Integrated Wellness & Leisure System

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

## Reconciliation gates before changing canonical data

1. **Stable identity:** approve proposed Parts/Machine IDs and the treatment
   of specialist industrial buildings without renaming existing IDs.
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

This implementation reuses the existing Substances renderer and CSS. Each
industrial catalogue has its own selection/filter state and column groups.
Unknown fields appear under **Additional Review Fields** rather than being
silently dropped. Source metadata and candidate status are visible for
field-by-field designer inspection. There are no changes to Android runtime
code, canonical JSON or the Substances data model.

## Further sources to review

- Android `docs/discovery/galaxy-economic-foundation.md` — approval decisions,
  technology and pricing architecture (especially building-led review)
- Android `docs/discovery/proposed-mine-extraction-expansion-workforce-review.csv`
- Android `docs/discovery/mine-common-universal-review.md`
- Android `docs/discovery/mockups/README.md` — interactive design limitations

Those are deliberately **not** treated as an automatic bulk source of
canonical facts.
