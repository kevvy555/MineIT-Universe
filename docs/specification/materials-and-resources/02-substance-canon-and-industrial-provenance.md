# UNI-MAT-002 — Substance Canon, Industrial Catalogue and Consumer Responsibilities

**Authority:** [materials lore](../../../data/lore/Koplin_Universe_Materials_And_Substances.md) outranks all source-era counts and JSON; [canon precedence](../DESIGN_AUTHORITY.md). **Original source reviewed fully:** [Substance Canon — Consumer Architecture](../../SubstanceCanon.md) (UNI-SRC-017), published-architecture status at its writing; no latest live JSON check completed. Companion: [material classification](01-material-classification.md).

## Shared identity and game-owned quantity

Universe is the authored material/industrial vocabulary owner. A stable `substanceId` is a reproducible reference across games; a **part**, **machine** and **building** has its own stable canonical ID and relationship, not a duplicate substance identity. A game can map a physical substance category to UI categories such as Food, Build, Fuel or Ore, but the authored parent category and physical restrictions stay Universe-owned. Games own production recipes, build price, worker count, power consumption, installed object level, site placement, per-save extracted quality and reserve, markets, contracts and simulation.

The source describes a published graph: `data/substances.json` (historically **75 source P0/P1 substance categories plus 5 Mobile integration ontology parents**), `data/parts.json`, `data/machines.json`, `data/buildings.json`, plus `substance-archetypes.json`, `substance-properties.json`, and `rarity-bands.json`. Historical seven archetypes and nine rarity bands were catalogue classifications, not a guarantee all are active in current game simulations. **An earlier 22-building count is obsolete relative to the [6 October art audit](../assets-and-logistics/03-mobile-art-identity-and-coverage.md) reporting 24; verify actual authored records, not prose counts.**

## Per-substance publication

The original public-record fields include `id`, `name`, `description`, `substanceType`, `thermalBehaviour`, `standardState`, `dominantArchetype`, `form`, `refined`, `tier`, `industrialRole`, `sourceDocumentId`, `sourceSection`, `canonStatus`; image metadata is optional. Category art is identity-neutral, with 1:1 full-bleed catalogue stills only where an `image` record exists; ontology parent categories do **not** require fabricated visual assets. Do not bake rarity, player-specific grade/amount, corporate branding or Veyrite into another material's generic image.

The source's image-generated counts are **dated claims**. Present image metadata must agree with `generated`, status and on-disk original/WebP art before validation declares a record complete.

## Reconciling Desktop and Mobile designs without parallel canons

The historical industrial import tool (`scripts/import-industrial-catalogue.mjs`) can read a Desktop root or its Machines & Buildings directory, resolve source substance/part/machine/building references, reject unknown IDs before publication, and preserve reconciled Universe wording/provenance and Mobile-only canonical buildings. A source-driven importer is **not** a second published catalogue: the curated, lore-compatible materialised `data/` records remain authoritative.

Mobile mappings illustrated by the source: Housing→`building-habitat`; Power Plant→`building-power-plant`; Industry→`building-industry`; HQ→`building-headquarters`; Farm/Ranch/Bio-Harvester/Algae Facility map to their authored IDs; Quarry/Rig/Simple Mine/Deep Mine/Spaceport likewise. Desktop-only authored physical building archetypes include Collection Camp, Water Collector, Basic Refinery, Research Building, Shipyard Bay, Stockpile and Warehouse. **`building-crashed-ship` is an authored scenario archetype, not evidence the crash event/ship is a persistent player-built Universe entity.**

The Directory's historical grouping (Substances: archetype → Raw/Refined; Parts: category/subcategory; Machines/Buildings: category) is a *read projection*. Do not encode different canonical copies solely for a game screen.

## Current boundaries, status and tests

The original described validators `validation/validate-universe.mjs` and `validation/validate-industrial-catalogue.mjs`, plus cross-repo importer options; current scripts, collection contents and CI were **not run** in this doc pass. Validate unique IDs, source provenance, no unresolvable cross-references, no game save terms in canon records, compatibility of all intended platform building concepts, and exact current manifest population before recording implementation. Later Universe schema versions supersede the source's earlier counting and collection-stage assumptions.

**Original kept intact; whole source meaning mapped; current lore/JSON consumer parity open.**
