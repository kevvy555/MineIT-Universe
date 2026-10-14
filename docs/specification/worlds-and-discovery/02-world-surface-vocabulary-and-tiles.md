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


## Foundation worlds companion fully reconciled — UNI-SRC-004, CANON retained

Reviewed the entire [Worlds, Land and Surface Classification](../../../data/lore/Koplin_Universe_World_Surface.md) companion, **public §§1–12 and designer-truth appendices A/B**, on 14 October. The **higher-authority lore remains in place**; this chapter maps only platform-integration consequences rather than copying its world-type and P0 catalogue tables as a competing owner.

Precise foundational body/terrain rules:

- **Seven body kinds** differ physically: rocky planet (walkable full surface), rocky moon (walkable), asteroid (limited lump geometry), gas giant (envelope **no ground/ordinary quarry**), comet (nucleus/coma, not land-grid), star and ring system (no mining land squares). **One body kind per persistent body** is a hard world-identity constraint, not just its UI icon.
- Rocky world-types include **20 source-era procedural names** (Barren/Scorched/Hell/Ore/Fossil/Titan-Class/Dust/Salt/Claystone/Deadwater/Verdant/Lifeworld/Corrosive/Rust/Exotic/Radiant/Crystal/Ironstone/Frozen/Vent). **Terraformed World** and **Colony World** are **authored-only civilisation statuses**, never generator random-roll kinds. Historical **Water World** is a demo/catalog label **not** a Stage-1.0 planet-type roll; liquid sea-level controls actual coverage.
- **Nine broad atmosphere labels** including None, Trace, Thin, Breathable, Dense, Toxic, Hot greenhouse, Cryogenic and **Gas-giant envelope**, which does not apply to rocky bodies. This classification is a survivability/survey label, not a full weather/pressure/thermal fluid solver.
- **Four independent land-square layers:** **Landform** (12 ground shapes incl plains/hills/mountains/basin/lowland/highland/plateau/valley/cliff/canyon/ridge/crater), **Biome** (10 vegetation/cover classes), **Hydrosphere** (visible or subsurface liquids/ice) and **Surface Feature** (coast/dunes/rock exposure/ice/peat/lava). A basin can be dry, a lake is *not* itself a landform, and dominant world labels are **summary** rather than complete tile-map truth.
- A **geology province** describes crust context beneath a square, not a saved random occurrence. The companion supplies **10 specific P0 surface find-site categories** — rock fields, mud flats, forests, outcrops, exposed cliff, lakes, sand dunes, saltwater bodies, peat bogs and dry mineral beds — with material and terrain relations. Later 21 P1 advanced sites are separate catalogue evolution, not retroactively stated by this P0 lore text.
- Authored `planets` require `celestialBodyKindId`; sufficiently known worlds also hold `worldTypeId`, `atmosphereTypeId`, dominant landform/biome/hydrosphere IDs and explicit `surfaceAssignmentStatus` of **source-canonical**, **inferred-from-existing-record**, or **kind-only**. Koplin 3 is an authored **Verdant/Temperate breathable half-land/half-water homeworld**, not a Water World preset. Its unnamed moons remain **kind-only** unless actual canon authors their surfaces.

**Designer-truth Appendix A** says Desktop source algorithms such as constrained rolls, Stage 1 centroids, sea-level amplitude, 2–5 per-cell steps, spawn hashes and `TerrainTuning` are *engineering provenance only*. **Appendix B** supplies P0 find-site class references, not random rarity. The companion deliberately excludes map seeds/cells, generated deposits, resource quality/reserve, player-created colonies, weather scheduling and per-save mines.

Shared vocabulary supports three distinct products: Desktop 3D walkable world, Mobile 8×8 square view using bespoke ID-keyed landscape tiles, Single Mine one local site. **`games` represents these consumer products for Directory, not an organisation**. This foundation specifically forbids a gas giant forest-grid, an inferred named planet map invented from a label, or a game-specific land taxonomy becoming a parallel universe canon.

Full public world-type labels and the P0 find-site/planet assignment meanings remain controlled by the [original canonical companion](../../../data/lore/Koplin_Universe_World_Surface.md) and actual authored `data/`; **no canon rewrite or procedural world generator change was made.**
