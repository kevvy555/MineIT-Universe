# Legacy Design Catalogue Import

Status: **Implemented on `feature/design-catalogue-expansion`**

## Purpose

This change reconciles the remaining stable catalogue material from the supplied legacy MineIT design archive into MineIT Universe without importing runtime generation, UI, balancing or save-state concerns as canon.

## Published catalogue additions

- 71 research technologies with stable IDs, prerequisite relationships and links to canonical parts, machines, buildings and substances where the source defines them.
- 21 P1 find sites, bringing the combined find-site catalogue to 31.
- 29 geological formation/process categories.
- 36 reusable deposit/formation shapes.
- 10 deposit physical states.
- 7 material archetypes, 25 material property/classification definitions and 9 rarity bands.
- 16 stellar types, 14 comet types, 12 ring-system types and 20 star-system types.
- Two source-design machine placeholders referenced by the research tree: Crude Steam Piston Generator and Crude Combustion Generator.
- Normalized primary image-generation metadata for Collection Camp, Quarry, Simple Pit Mine, Crashed Ship and Stockpile; legacy unapproved images themselves are not promoted as canonical assets.

## Boundary decisions

Universe owns stable catalogue identity and cross-catalogue relationships.

The following remain game-owned and were deliberately not promoted:

- research completion/status and queues;
- generated research progress;
- universal research point balance (legacy Desktop point costs are retained only inside a Desktop profile);
- procedural find-site predicates, row rarity, noise maps and spawn hashes;
- generated deposit instances;
- terrain noise, elevation and rendering data;
- UI/screen implementation;
- save-specific buildings, colonies and ownership.

## Research

The legacy research tree is published as designer truth. Each record carries a Desktop profile containing the original P0/P1 development label and point cost. Those values are not universal balancing rules for Mobile or future games.

Processing entries whose detailed machines/buildings were explicitly TBD remain technology catalogue entries with source notes; no unsupported industrial facilities were invented.

## Geology

P1 find sites do not retain the old runtime `UndergroundClassification` as a second opaque taxonomy. Instead they link to reusable `geologyProcesses` and `depositShapes`, allowing Desktop, Mobile and Single Mine to share the same stable geological vocabulary while implementing different runtime generators.

## Celestial classifications

Extended star/comet/ring/system labels are reference catalogues. Existing authored star systems retain their more precise current `starType` values; broad catalogue types do not overwrite authored spectral/luminosity information.
