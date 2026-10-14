# UNI-WORLD-002 — Canonical World Surface Vocabulary and Landscape Tiles

**Owner:** Universe authored body/surface/biome ontology · **Source reviewed in full:** [World Surface Canon — Consumer Architecture](../../WorldSurfaceCanon.md) (UNI-SRC-020). **Higher authority:** [world-surface lore](../../../data/lore/Koplin_Universe_World_Surface.md) and [design governance](../DESIGN_AUTHORITY.md); **historical source status:** published architecture, not present-day JSON audited. Companion: [celestial physical truth](01-galaxy-and-celestial-bodies.md) and [shared material identity](../materials-and-resources/02-substance-canon-and-industrial-provenance.md).

## Persistent ontology versus generated game terrain

Universe owns the stable categories of `celestialBodyKinds`, `worldTypes`, `atmosphereTypes`, `surfaceLandforms`, `surfaceBiomes`, `surfaceFeatures`, `surfaceHydrospheres`, `geologyProvinces`, `findSites`, `geologyProcesses`, `depositShapes`, `depositStates`, `stellarTypes`, `cometTypes`, `ringSystemTypes`, `starSystemTypes` and stable authored `planets`. `landscapeTilesets` and `landscapeTiles` are **art records**, not a frozen save-world grid. The designer's `games` catalogue is **not** an in-universe organisation.

Importable shared vocabulary from Desktop includes source-era **seven** body kinds, twelve surface landforms, ten biomes, ten P0 find-site categories, **21** advanced P1 find sites and geological process/shape/state types. Do **not** import Game/Desktop world-generation seeds, noise/elevation curves, `TerrainTuning`, spawned row rarity, random hashes or deposit instances. The source explicitly **excluded** Water World as a Stage 1.0 procedural roll and Terraformed/Colony World as random generation categories while retaining authored-only planet classifications.

## Published named planet surface fields

Authored planets may carry:
- `celestialBodyKindId` as required physical kind;
- `worldTypeId` and `atmosphereTypeId` unless the record is explicitly `kind-only`;
- `dominantLandformIds`, `dominantBiomeIds`, `dominantHydrosphereIds`;
- `surfaceAssignmentStatus` of `source-canonical`, `inferred-from-existing-record`, or `kind-only`;
- an optional `landscapeTilesetId`.

The source specifically describes **Koplin 3** as source-canonical rocky/Verdant/breathable with mixed land/water and its two moons as kind-only pending authored detail. **Inferred** generic expansion-world labels are merely conservative metadata extracted from existing environment prose, not permission to declare a new world-surface lore bible. World type must refer to compatible `appliesToKindId`; a moon's kind-dependent type does not become a rocky planet type.

## Tileset is a presentation contract, not terrain truth

A named world with a bespoke `landscapeTilesetId` has coherent 1:1 Mobile map art keyed by planet and landform+biome, or visible liquid/ice type. Adjacent tiles use consistent camera, lighting and palette; mountains should read as extended ranges, not isolated peaks. The historical Koplin-3 tileset covered twelve landforms across grassland/forest/wetland/tundra plus ocean/lake/river variants. **Do not relabel those identity-bearing Koplin tiles as generic visual-library art or apply them to other named worlds.** Generic fallback is separately governed by [UNI-ASSET-003](../assets-and-logistics/03-mobile-art-identity-and-coverage.md).

The **save-owned** Mobile 8×8 colony map determines what square exists, biome, discovered condition and placement. A tile image visually matches that state; it never alters physical truth. Desktop's 3D terrain and Single Mine's individual site may use the same authored *labels* while computing distinct render geometry.

## Find sites and resource occurrence boundary

`findSites` describe reusable geological/surface encounter categories, with landform, biome, hydrosphere, feature, province and referenced substance IDs. P1 sites may additionally link process/shape IDs. Their catalogue contains **no** procedural spawn rarity, noise predicate, quality roll, reserve or concrete save-owned occurrence.

The early source correctly states that find-site labels alone are **insufficient** to gate Mobile resource placement. Later manifest-backed `mobileResourceDefinitions` + `mobileResourceOccurrenceProfiles` express physically eligible environments while `mobileBiologicalResources` cover living Food categories. Actual generated resource deposits, quality, production and extraction methods remain Mobile save-owned under those shared constraints.

## Acceptance boundary

Check current manifest collection references, published IDs, body-kind matching, surfaceAssignmentStatus provenance, landscape tile key combinations and image files, and no authored/game ownership leakage. Do not infer runtime acceptance from the legacy published-architecture heading. **The original WorldSurfaceCanon source is preserved unchanged; no lore/JSON/content edits were made in this batch.**
