# UNI-TECH-003 — Legacy Catalogue Import and Cross-Game Ownership

**Owner:** Universe stable authoring/catalogue semantics · **Full source:** [Legacy Design Catalogue Import](../../LegacyDesignCatalogueImport.md) (UNI-SRC-008), reviewed 14 October 2026. **Source status:** historical *implemented on feature/design-catalogue-expansion*; **current manifest contents/runtime:** not reverified.

## What the original import actually materialised

The historic import reconciled source-stable IDs and typed relationships, *not* gameplay simulations. The original source reports:

| Catalogue family | Original import's documented contents |
| --- | --- |
| Research | **71** technology entries with prerequisite relationships, cross-links to parts/machines/buildings/substances where supported |
| Discovery | **21** P1 find sites (historically **31** P0 + P1 in total) |
| Geology | **29** formation/process categories, **36** deposit shapes, **10** physical deposit states |
| Substance descriptors | **7** material archetypes, **25** property/classification definitions, **9** rarity bands |
| Celestial reference | **16** stellar types, **14** comet types, **12** ring systems, **20** star-system categories |
| Industrial placeholders | Crude Steam Piston Generator and Crude Combustion Generator, created because the sourced research tree required them |
| Artwork identity | Image metadata for Collection Camp, Quarry, Simple Pit Mine, Crashed Ship, Stockpile — **not** promotion of unapproved legacy images |

These numbers describe that **specific historic import**, not proven live 2026 manifest totals. Confirm actual `data/manifest.json` and validated collections before publishing them as current.

## Canonically preserved versus expressly excluded

Universe can own stable research identity, prerequisites, relationships to existing authored catalogue IDs, geological process vocabulary, deposit shapes and celestial classifications. The source's Desktop research profiles retain their P0/P1 label and point cost **as platform provenance**, never as universal Mobile research rates or shared game balancing.

**Deliberately left in games:** queued/completed research, evolving research progress, a universal research-point wallet, runtime find-site predicates/rarity/noise/spawn hashes, concrete deposit instances, terrain noise/elevation/rendering, game UI, persistent colony construction and save-specific ownership. A find-site identity/category does **not** guarantee where a game rolls an occurrence.

Historic `UndergroundClassification` did not become a parallel opaque universal taxonomy; P1 find sites instead reference reusable `geologyProcesses` and `depositShapes`. Broad stellar/comet/ring/system reference types cannot overwrite precise `starType` values of existing authored systems. The two machine placeholders have only their documented stable design role — they are **not** proof of implemented player-buildable machines or ready production recipes.

## Review/implementation boundary

Respect [canonical lore precedence](../DESIGN_AUTHORITY.md). Preserve references to earlier Desktop source material while reconciling any old aliases to approved modern IDs. Do not invent source details for TBD facilities or universalise Desktop research points. Cross-platform capability versus physical machinery is explained in [knowledge and industry](01-knowledge-and-industrial-capabilities.md); game-specific trees/queues remain in platform specs.

**Remaining:** compare exact latest manifest collections, source provenance, technology links, P0/P1 find-site statuses, machine placeholders, current validator and platform research mappings. Until that, this original document is **Reviewed completely and mapped**, not current data verified or blanket research-tree acceptance.
