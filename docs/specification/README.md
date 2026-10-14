# MineIT Shared Design Specification

**Owner:** MineIT-Universe shared design · **Status:** staged design consolidation · **Date:** 14 October 2026.

This is the **shared mechanics and concepts** layer beneath [canonical lore/data authority](DESIGN_AUTHORITY.md). It is not another copy of the Desktop or Mobile game, and the presence of a draft does not mean any feature is shipped.

## Where to begin

- **[Cross-chat handover and exact resume plan](HANDOVER.md)** — current branches, draft PRs, source inventories, verified vs proposed decisions, unresolved scope, traps and next batches.

- [Design authority and repository ownership](DESIGN_AUTHORITY.md)
- [Shared vocabulary](GLOSSARY.md)
- [Cross-platform design ownership matrix](CROSS_PLATFORM_MATRIX.md)
- [Standard chapter template](SPEC_TEMPLATE.md)
- [Source inventory and reconciliation](source-register/README.md)
- [Stage programme and open delivery](https://github.com/kevvy555/MineIT-Universe/issues/19)

## Specification chapters

| Topic | What it owns | Current status |
| --- | --- | --- |
| [Principles](principles/README.md) | Common gameplay meaning, scenario distinctions, physical plausibility | Initial synthesis |
| [Worlds and discovery](worlds-and-discovery/README.md) | World physical truth, body types and survey semantics | Initial synthesis |
| [Materials and resources](materials-and-resources/README.md) | Raw/refined/manufactured classification, materials/compatibility | Initial synthesis |
| [Industrial economy](industrial-economy/README.md) | Common Parts/Machinery/assets, future processing/manufacturing, D00–D11 | Stage 1 deep discovery, taxonomy unresolved |
| [Assets and logistics](assets-and-logistics/README.md) | Asset lifecycle, ships, stations, rigs, fleets | Initial synthesis |
| [Commerce and corporations](commerce-and-corporations/README.md) | Corporate ownership, procurement and long-range economies | Initial synthesis |
| [Colonies and population](colonies-and-population/README.md) | Survival, food/water/air safety, local power/maintenance dependencies | Initial synthesis |
| [Technology and progression](technology-and-progression/README.md) | Knowledge versus deployed industrial capability and canon automation limits | Initial synthesis |
| Decision register | Approved/open/superseded cross-game rules, with provenance | Industrial register exists; wider register planned |
| Source register | All original source documents and reconciliation evidence | Complete path inventory; review in progress |

## Cross-game implementation

- [Mobile / Android specification](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/README.md): corporation, technology, time scale, grouped goods, trade and saves.
- [Desktop specification](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/README.md): 3D survival, machine instances, physical material detail and research.

## Strict canon boundary

1. [Canonical hierarchy](../CanonSourceHierarchy.md) governs `data/lore/` before any structured records.
2. Universe `data/*.json` owns stable authored entities and identities; this specification cannot invent parallel machines/ships/locations.
3. Shared mechanics describe **what** parts/machines/assets mean, without forcing a single game balance/runtime.
4. Each platform specification owns its gameplay rules and implementation.
5. Old documents remain source evidence; [inventories](source-register/README.md) distinguish indexed from migrated.

**Unapproved examples:** four Parts/eight Machinery families, ongoing maintenance wear consequences, station construction recipes and future shipyards' quantitative material budgets. [Product decisions #114](https://github.com/kevvy555/MineIT-Android/issues/114) remain open until explicitly resolved.
