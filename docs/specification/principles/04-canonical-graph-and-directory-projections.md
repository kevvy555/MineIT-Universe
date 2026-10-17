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


## Canon design original approval and scale policy — UNI-SRC-009 reviewed completely

The distinct **30 August 2026 APPROVED** [MineIT Universe Canon Design Specification](../../MineitUniverseCanonDesign.md) was reviewed end-to-end alongside the database implementation summary. Its **approved design** target is approximately **100 authored systems** at mature scale with optional later expansion, **100–150 meaningful commercial companies**, **thousands** of named people, **hundreds** of named ships, major settlements/facilities/organisations/projects/events, a heavily interconnected identity graph, and a procedurally produced save-owned frontier. The initial detailed **Koplin Reach** slice was **one region, roughly ten systems**, not a hard mature cap; eventually 2–3 regions were envisaged with no forced separate sector tier until useful.

The approved political/organisation vocabulary supports mixed governments, corporate operators, trade/research/finance/media/medical/guild/security institutions and synthetics; a generic `organisations` collection replaces company-only canon. AI/synthetic persons and institutions remain subject to the **later/higher lore governance against incorrectly canonising sovereign AI**. Species/biology, languages, culture and religion were **not** all made independent first-class schema subsystems. Meaningful people carry stable identity, biography, employer/unit, location, responsibilities, operations/ships and relationships (family, friendship, professional, mentor, rivalry, synthetic family-like); a commercial contact is a role of a persistent person, not another species/person dataset.

Named ships have manufacturer/designer class, owner/operator, home port, people, role and operations; thousands of unnamed incidental traffic records are not required. Universe products explain causal demand but are not every game inventory SKU. Canon records significant operations/facilities, projects and dated events under Standard Terran Calendar, not every room/side purchase or player/save achievement. Important corporate procurement *requirements* are authored, but live market quote/rate/quantity is not.

The original canon design expressly says Directory is **omniscient for authored facts** at that early schema stage. This describes *designer truth accessibility* within a lore tool; it does **not** require Mobile, its characters, the in-game Deep Reach service or player map to reveal undiscovered sites or classified knowledge. The lore/knowledgeScope contract has precedence and may deliberately distinguish designer-truth from in-world discoverability.

Image ownership is ID keyed with generation metadata and Directory visibility; the initial four states in this 30-Aug source lacked the later explicit **`in-progress`** state. Apply the [October image process](../assets-and-logistics/04-image-generation-state-and-publication.md) as the newer workflow, not the obsolete four-status enumeration. AI may author materialised canon **without a mandatory human sign-off**, but automated validation/relationship checks remain mandatory. Content must be causally connected; do not fill numeric targets with unlinked invented filler.

The compact recorded approval answers in the original (Q1–45, including Q44 game/player state separation and Q45 balancing scale/depth/recognition) are preserved verbatim in that historical source, not rewritten as 45 independently new design decisions. No canon source/lore/data edits were authorised by this review.

## Live manifest fact checked, with narrow scope

At the **14 October 2026 documentation review**, the branch's actual [`data/manifest.json`](../../../data/manifest.json) reported **schemaVersion 12, contentVersion 0.14.0, 57 logical collection names**, `generation.mode=authored-materialised` with `materialised=true`, null seed/version and deterministic generation support metadata. This **live manifest check** supersedes the old schema-v2/content-0.13 prose, but **does not prove** all 57 collection contents/relations, CI validation, consumers or image assets were freshly examined. Preserve provenance and check the exact reviewed commit for future changes.
