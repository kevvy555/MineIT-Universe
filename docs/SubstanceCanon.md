# Substance Canon — Consumer Architecture

Status: **Published architecture**  
Related feature: `docs/SubstanceCanonFeatureSpec.md`  
Canonical lore: `data/lore/Koplin_Universe_Materials_And_Substances.md`  
Structured collection: `data/substances.json`

## Ownership

MineIT Universe owns the authored materials and industrial vocabulary for the MineIT family of games.

Desktop substance, part, machine and building design under `MineIT/Documentation/design/` and the current MineIT Mobile production model are **engineering provenance**. Once reconciled into Universe lore and structured data, Universe is authoritative. Games must not maintain a conflicting authored catalogue.

Mutable gameplay values remain game-owned. Building levels, build costs, staffing, power demand, production rates, placement rules, unlocks, save-state ownership and other simulation values are not Universe canon unless separately promoted as persistent authored universe facts.

## Publication path

```text
data/lore/Koplin_Universe_Materials_And_Substances.md
        ↓ registered by
data/lore-documents.json
        ↓ rendered by
lore.html  (long-form materials chapter)

data/substances.json  (75 P0/P1 industrial categories)
data/parts.json
data/machines.json
data/buildings.json
        ↓ registered by
data/manifest.json
        ↓ rendered by
index.html / js/universe-app.js  (Directory browse)
        ↓ loadable by
any consumer via loadUniverse() / manifest fetch
```

Quick-reference topics live in `data/lore-topics.json` and point at source sections in the materials document.

## Record shape (Directory / game-consumable)

Stable fields on each substance:

- `id` — e.g. `substance-reactive-metal-ore`
- `name`, `description`
- `substanceType`, `thermalBehaviour`, `standardState`
- `dominantArchetype`, `form`, `refined`, `tier`
- `industrialRole`
- `sourceDocumentId`, `sourceSection`, `canonStatus`

No mutable prices, reserves, contract terms or quality rolls.

Parts, machines and buildings use the same stable-ID model. Relationships are expressed with IDs and are validation-protected. Provenance records where a canonical archetype came from Desktop, Mobile, or both.

## Structured industrial catalogues

Directory collections:

- `data/substances.json` — 75 industrial substance categories
- `data/parts.json` — construction parts linked to substances and machines
- `data/machines.json` — machines linked to construction parts and installed buildings
- `data/buildings.json` — the reconciled Desktop + Mobile building vocabulary, linked to shell/fit-out substances and installed machines

The current combined building catalogue contains **22 canonical archetypes**. It covers all 14 Desktop building concepts plus all 13 current Mobile building kinds, with overlapping concepts mapped to one Universe record rather than duplicated.

Current Mobile mappings include:

- Housing → `building-habitat`
- Power Plant → `building-power-plant`
- Industry → `building-industry`
- Headquarters → `building-headquarters`
- Farm → `building-farm`
- Ranch → `building-ranch`
- Bio Harvester → `building-bio-harvester`
- Algae Facility → `building-algae-facility`
- Quarry → `building-quarry`
- Rig → `building-extraction-rig`
- Mine → `building-simple-pit-mine`
- Deep Mine → `building-deep-mine`
- Spaceport → `building-spaceport`

Desktop-only concepts remain canonical where they represent a useful industrial/scenario archetype, including Collection Camp, Water Collector, Basic Refinery, Research Building, Shipyard Bay, Stockpile and Warehouse. `building-crashed-ship` is retained as a **scenario infrastructure archetype**, not as player/save-state data.

Directory tree grouping:

- Substances → Archetype → Raw / Refined → substance
- Parts → Category → SubCategory → part
- Machines → Category → machine
- Buildings → Category → building

## Re-importing Desktop industrial design

The importer no longer contains a machine-specific absolute path. Run it with either the MineIT repository root or the `Machines & Buildings` directory:

```text
node scripts/import-industrial-catalogue.mjs ../MineIT
```

or:

```text
MINEIT_SOURCE_ROOT=../MineIT node scripts/import-industrial-catalogue.mjs
```

The importer:

1. Parses current Desktop parts, machines and buildings.
2. Resolves substance/part/machine links to stable Universe IDs.
3. Stops without publishing if any source relationship cannot be resolved.
4. Preserves approved Universe wording/provenance when source material has already been reconciled.
5. Retains Mobile-only building archetypes already promoted into Universe.

This is a source-reconciliation tool, not a second production catalogue. `data/` remains authoritative after import.

## Precedence

1. Expanded Backstory & Lore Bible — civilisation/history.
2. Materials of the Commonwealth — foundation industrial substances companion.
3. Deep Reach Mining Charter — Year-5326 scenario extension.
4. Structured JSON under `data/` (including substances, parts, machines and buildings) — must agree with lore.
5. Game/save state — levels, prices, stock, contracts, quality rolls and runtime simulation.

## Validation

`validation/validate-universe.mjs` validates the canonical graph and cross-references.

`validation/validate-industrial-catalogue.mjs` additionally verifies:

- the complete Desktop building set is retained;
- every current Mobile building kind maps to a canonical Universe building;
- Mobile provenance is explicit;
- part↔machine relationships cannot drift silently;
- industrial canon does not contain player/save-state terminology;
- the expected combined catalogue size is present.

CI runs these checks on `main`, `develop` and `feature/**` pushes, and on pull requests targeting `main` or `develop`.

## Follow-ons

- Commercial `resourceRequirements` should migrate to stable `substanceId` references.
- MineIT Mobile may project the Universe catalogue into its gameplay categories; it must not re-author conflicting IDs.
- Desktop should progressively key its authored designs to Universe IDs.
- Named procedural deposit instances remain Desktop runtime until materialised into Universe.

## Out of scope here

- MineIT Mobile inventory conversion
- Desktop survey micro-generation inside Universe
- Mutable market/gameplay values on canonical substance, part, machine or building records
- Full manufacturing recipes, build costs, staffing, production rates or technology unlock curves
