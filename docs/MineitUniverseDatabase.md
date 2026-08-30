# MineIT Universe Database

Status: **Phase 1 implementation beginning**

Repository: `kevvy555/MineIT-Universe`

## Purpose

This repository owns the persistent authored MineIT civilisation shared by MineIT Mobile, the Universe Directory, future MineIT games, lore tools and image-generation tooling.

The goal is that a persistent entity encountered in one application is the same canonical entity encountered in another application. A person such as `person-talia-chen`, a company such as `company-helix-industrial-group`, or a ship such as `ship-csv-halcyon-reach` is identified by the same stable ID everywhere.

## Core principles

### One canonical source

Canonical authored universe content lives only in this repository under `data/`. The Directory and games consume it; they do not maintain independently authored copies.

### Stable identity

Persistent entities have stable IDs independent of display names, roles, descriptions or artwork.

### Authored civilisation, procedural frontier

The Universe repository describes persistent inhabited/commercial civilisation: important systems, worlds, settlements, companies, facilities, operations, people, ships and structural economic demand.

Procedural frontier systems, deposits, player colonies and per-save state remain game-owned concepts.

### The universe is a graph

The same records can be projected into multiple useful hierarchies. A company can operate on several worlds; a person can belong to a department while supporting several operations; a ship can serve multiple facilities.

Relationships therefore use stable IDs rather than duplicated nested records.

### Resource demand belongs to operations

Commercial demand has an authored reason. Example:

`Helix Industrial Group -> Propulsion Systems Division -> Solace Driveworks -> Commercial Drive Assembly Programme -> Magnetic Ore requirement -> Strategic Materials Procurement -> Talia Chen`

The operation explains why a material is needed; a procurement person represents that demand commercially.

## Canonical collections

`data/manifest.json` declares the collections:

- `star-systems.json`
- `planets.json`
- `settlements.json`
- `companies.json`
- `organisation-units.json`
- `facilities.json`
- `operations.json`
- `people.json`
- `ships.json`

The manifest also contains schema/content versions so consuming applications can identify which universe version they loaded.

## Asset ownership

Universe artwork belongs under:

```text
assets/art/universe/
  people/
  ships/
  companies/logos/
  systems/
  planets/
  settlements/
  facilities/
```

Entity IDs should drive stable filenames. Missing artwork is valid and the Directory should show a placeholder.

Image-bearing records should support:

- `description`
- `visualDescription`
- `image.key`
- `image.status`
- `image.promptDescription`
- optional image composition notes

## Universe Directory

The production Directory is a read-only browser of the same canonical JSON.

### Approved mobile-first layout

The Directory uses a vertical split:

```text
+---------------------------------------+
| SELECTED ENTITY                       |
| details                               |
| linked fields -> other entities       |
| independently scrollable              |
+========== draggable divider ==========+
| UNIVERSE EXPLORER                     |
| Geography | Organisation | Directory  |
| Search                                |
| expandable tree                       |
| independently scrollable              |
+---------------------------------------+
```

The tree and detail remain visible simultaneously on portrait phones. The divider defaults to roughly 60/40 and is constrained so neither panel disappears.

### Explorer perspectives

**Geography** answers: *What exists here?*

```text
Universe
  Star System
    Planet
      Settlement / Station
        Companies
        People
        Ships
      Facilities
```

**Organisation** answers: *How is this organisation structured?*

```text
Companies
  Company
    Division
      Department
        Person
      Facilities
      Operations
    Ships
```

**Directory** answers: *Find an entity regardless of hierarchy.*

It groups systems, planets, locations, companies, organisation units, facilities, operations, people and ships.

### Detail navigation

Do not use a generic Related Entities box as the primary relationship UI. Show the real fields for the selected record and make referenced entity values clickable.

Example person fields:

```text
Company             Helix Industrial Group ->
Division            Propulsion Systems Division ->
Department          Strategic Materials Procurement ->
Works at            Solace Commercial Ring ->
Supports operation  Commercial Drive Assembly Programme ->
Assigned ship       CSV Halcyon Reach ->
```

Selecting a linked entity updates the detail view and reveals/highlights the selected record in the active tree where possible.

## Concept prototype

`prototypes/MineitUniverseExplorerConceptMockup.html` is a disposable embedded-data design reference. It exists only to preserve the approved interaction concept.

The production `index.html` must load canonical JSON and must never grow an independently authored embedded universe.

## Initial Phase 1 slice

The first canonical data slice contains two deliberately different organisations and enough linked geography to validate the model:

- Solace System / Helix Industrial Group
- Varda System / Verdant Horizon Biotech

Target proof size:

- 2 systems
- 3 planets
- 2 settlements/stations
- 2 companies
- multiple organisation units
- 3 facilities
- 3 operations
- 5+ people
- 2+ ships
- operation-level resource requirements

This is a schema/navigation proof, not the final population scale.

## Validation

Before large-scale authoring, validation must check:

1. collection files declared by the manifest exist and parse;
2. IDs are unique and follow naming conventions;
3. cross-references resolve;
4. organisation parent relationships are valid;
5. location relationships are valid;
6. facility/company/location references are valid;
7. operation/company/unit/facility references are valid;
8. people and ship references are valid;
9. resource requirement identifiers are valid against MineIT resource definitions when integrated;
10. asset paths follow the canonical structure.

Broken references must be reported, not silently dropped.

## Publishing and sharing

GitHub Pages publishes the Directory and canonical JSON from the same repository.

Consumers start with:

```text
https://kevvy555.github.io/MineIT-Universe/data/manifest.json
```

and load the collection paths declared there.

The Directory normally uses relative URLs because it is hosted beside the data. MineIT Mobile and future games use the published absolute base URL or a configurable equivalent.

## Content versioning

`schemaVersion` changes when the JSON contract changes incompatibly.

`contentVersion` changes when canonical universe content is released/updated.

Games should be able to record/cache the universe content version they consumed so saved games remain reproducible and offline play remains possible.

## Phase 1 success

Phase 1 succeeds when:

- the Directory renders entirely from canonical JSON;
- Geography, Organisation and Directory projections work from the same records;
- linked detail fields cross-navigate correctly;
- the mobile vertical split remains usable;
- validation catches broken records;
- the same published JSON can be consumed by MineIT Mobile without duplicating universe authoring there.
