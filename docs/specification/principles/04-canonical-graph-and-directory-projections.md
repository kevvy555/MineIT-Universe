# UNI-PRN-004 — Canonical Entity Graph, Directory and Structural Economy

**Original reviewed fully:** [MineIT Universe Database](../../MineitUniverseDatabase.md) (UNI-SRC-010). **Source status:** a published **schema-v2-era** architecture account (which also documents later added schema 8–10 catalogue families); the stated `contentVersion 0.13.0` and original ten-system/one-region release counts are **historical**, not live GitHub verification. **Authority:** [root AGENTS.md](../../../AGENTS.md), [lore precedence](../DESIGN_AUTHORITY.md), [manifest publication](02-publishing-and-consumer-contract.md).

## Single authored graph and read projections

The manifest's registered logical collections under `data/` supply one persistent set of authorship/identity. The original inventory spans regions, systems, worlds and body classifications, settlements, generic organisations and organisation units, facilities, operations, products, substances/parts/machines/buildings, science/geology/world vocabularies, species/people, ship classes and named ships, projects/events and relationships. Use stable IDs and explicit references, not extra nested copies of records and not display names as foreign keys.

The Directory draws **Geography**, **Organisation** and **Directory lookup** projections from that same graph; `games` is a designer catalogue, not an additional playable faction. The historical portrait UI used detail over independently scrollable tree with adjustable divider — presentation reference rather than a universe-identity schema. Directory should load manifest collection paths (including shard arrays), never hide a production shadow dataset in JavaScript.

Examples of structural links: Region→Star System→Planet/Moon→Settlement; Organisation→Division/Unit→People/Facility/Operation; Organisation→Facility→Operation→**Resource Requirement/Product/Procurement Contact**. Canon owns **why** operations require physical resources, not a per-save offer quantity/price/cadence, buyer sentiment, active shipment or player position. Persistent people may have family/professional/mentor/rival relations across apps. Named ships bind canonical class and company/operator/hub/crew relationships; game-specific flight statistics may be projections.

Major projects and historical events use a shared canonical timeline and the manifest's specified Standard Terran Calendar epoch; games may present different local scenarios without rewriting those persistent past events.

## Mature reference catalogues and UI identities

The old schema-10 note records research technology IDs, advanced P1 find sites, geological process/deposit shape/state, substance material archetypes/properties/rarity and extended celestial categories as **stable reusable vocabulary**; mutable research completion, per-site sampling seeds, spawn criteria, deposit instances and generated world tiles are never authored facts.

The original Mobile resources boundary describes **42** natural non-Food published identities with separate `mobileResourceOccurrenceProfiles` for physical suitability and `mobileBiologicalResources` for Food. Per-save rarity, value, quality, scan gating, exact reserve and extraction are game-owned. Resource art under `assets/art/universe/resources/` is **1:1 identity** rather than an encoded signal of any save's quality or rarity. Image-bearing people/ships/star systems/products/buildings/substances follow the validated state machine `not-generated → in-progress → generated → approved` (or `needs-regeneration` when correction is required); only records with `image` are queued.

Named worlds can refer to identity-bearing `landscapeTilesets` keyed by planet; no gameplay cell state belongs in those assets. See [world tiles vocabulary](../worlds-and-discovery/02-world-surface-vocabulary-and-tiles.md).

## Source-era implementation assertions are not new proof

The original reports an initial Koplin Reach catalogue consisting of **one region, ten systems**, major planets/moons, linked diverse organisations/people, structural operations, ship classes/named ships, projects and events. It also describes `validation/validate-universe.mjs` checks for ID uniqueness, foreign keys, hierarchy, image state/asset existence, relationship and syntax. **These are old publication claims and proposed obligations**; do not label present manifest and CI `IMPLEMENTED` without inspecting today's files and completed workflow runs.

**No records, relationships, JSON, images, application UI or source files were authored or deleted here.** The original is fully reconciled as a source-design/architecture record; live materialisation and mobile consumer parity remain separately open.
