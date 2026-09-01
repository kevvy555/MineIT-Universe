# MineIT Universe Database

Status: **Schema v2 implemented — first canonical region generated**  
Repository: `kevvy555/MineIT-Universe`  
Current content version: **0.2.0**

## Purpose

This repository owns the persistent authored MineIT civilisation shared by MineIT Mobile, the Universe Directory, future MineIT games, lore tools and image-generation tooling.

A stable entity encountered in one MineIT application is the same canonical entity when encountered elsewhere. Cross-game identity is based on stable IDs.

The detailed approved scope and canon rules are defined in `MineitUniverseCanonDesign.md`.

## Canonical ownership

`data/` is the only authored source of truth.

Games and tools may load, cache or bundle compatible snapshots, but they do not author competing copies of universe entities.

Mutable game/save state remains outside this repository.

## Schema v2

The universe is a graph represented by these canonical collections:

```text
regions
starSystems
planets
settlements
organisations
organisationUnits
facilities
operations
products
species
people
shipClasses
ships
projects
events
relationships
```

The old company-only model is superseded by the generic `organisations` collection. Commercial companies, governments, authorities, universities, research institutes, banks, media organisations, hospital trusts, guilds, security/military bodies and synthetic polities can all use the same organisation graph.

## Geography

The authored hierarchy is approximately:

```text
Region
  -> Star System
    -> Planet
      -> Major Moon
        -> Settlement / Station
```

The Directory derives this hierarchy from relationships rather than storing a second hand-authored tree.

## Organisations

Organisation structures are flexible:

```text
Organisation
  -> subsidiary / division / secretariat / laboratory / command
    -> department / team / child unit
      -> people
      -> facilities
      -> operations
```

Not every organisation needs every level.

## Structural economy

Operations explain why organisations require resources.

```text
Organisation
  -> Facility
    -> Operation
      -> Resource Requirement
      -> Product
      -> Procurement Contact
```

Canonical JSON owns structural demand and its reason. Exact quantity, price, cadence, buyer happiness and other market terms remain game/save state.

## People and continuity

People are persistent characters connected to species, organisations, organisation units, locations, operations, ships and other people.

The relationship graph supports family, friendship, professional, mentorship, rivalry and other social relationships.

The mature universe is intended to contain thousands of persistent named people. Existing MineIT buyer characters are to be incorporated progressively rather than discarded.

## Ships

Ship classes are canonical entities. Named ships reference a class, owner/operator organisation, home port, associated operations and people.

Games may derive gameplay-specific numerical statistics from classes without moving those mutable/balance concerns into canon.

## Projects and history

Major multi-organisation projects and dated historical events are first-class entities. Together they allow people, organisations, ships and places to recur across a shared timeline.

The current calendar is the Standard Terran Calendar; the canonical universe date is declared by `manifest.json`.

## Image-generation state

People and named ships currently carry image metadata.

Each image record explicitly stores:

```json
{
  "key": "assets/art/universe/people/person-example.webp",
  "generated": false,
  "status": "not-generated",
  "promptDescription": "...",
  "notes": "..."
}
```

Allowed statuses are `not-generated`, `in-progress`, `generated`, `approved` and `needs-regeneration`.

An `in-progress` image remains `generated: false` and records `generationBatchId` plus `generationStartedAt` so generation work can be resumed safely. Validation checks the boolean/status relationship, and a record marked generated must have a real asset in the repository.

## Initial canonical release — Koplin Reach

Content version `0.2.0` expands the proof model into the first real authored region:

- 1 region;
- 10 star systems;
- all major planets and moons in those systems;
- significant settlements and stations;
- mixed commercial, political, scientific, financial, medical, labour, security and synthetic organisations;
- organisation hierarchies;
- significant facilities and operations;
- structural resource requirements and products;
- baseline/adapted humans, alien species and synthetic minds;
- persistent named people and person relationships;
- canonical ship classes and named ships;
- major projects;
- historical events.

This is the first content-production slice, not the mature size limit.

## Directory

The production `index.html` loads `data/manifest.json`, then every collection declared by the manifest.

Its three projections remain:

- **Geography** — where entities exist;
- **Organisation** — how organisations are structured;
- **Directory** — global lookup by entity type.

The approved portrait-phone layout remains selected detail above an independently scrollable explorer tree, separated by a draggable divider.

## Validation

Repository CI validates:

- JSON loading;
- unique stable IDs;
- cross-references;
- organisation hierarchy;
- planet/moon hierarchy;
- relationship integrity;
- resource requirement structure;
- image-generation state;
- generated image asset existence;
- production JavaScript syntax.

The universe is AI-authored under `MineitUniverseCanonDesign.md`; manual review is not a required publication gate, while automated validation is mandatory.
