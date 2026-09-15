**KOPLIN UNIVERSE**

**Worlds, Land and Surface Classification**

Working Canon • Foundation Technical Companion

| **Purpose**      | Define the shared language for celestial bodies, world types, atmospheres, and the land squares that games display — without storing per-save maps |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Source**       | Reconciled from MineIT Desktop celestial-body generation design (`CelestialBodyGeneration`) into Universe lore voice; must agree with the Expanded Lore Bible |
| **Scope**        | Body kinds, world-type labels, atmosphere labels, surface landforms, biomes, hydrosphere, surface features, geology provinces, P0 find sites, and how named worlds receive those labels |
| **Canon status** | Working canon: baseline for Directory/Lore Explorer publication and for structured land/world records consumed by Desktop, Mobile and Single Mine |

*This document does not replace civilisation history. It explains the survey language that history already assumes: Koplin 3 as a temperate half-land, half-water homeworld; later Commonwealth worlds as named places whose local ground can be classified the same way whether a player walks them in 3D, taps a grid square, or works a single mine.*

# Contents / Document Index

| **Section** | **Subject** |
|-------------|-------------|
| 1 | Purpose and place in canon |
| 2 | What this document owns |
| 3 | Celestial body kinds |
| 4 | World types |
| 5 | Atmosphere types |
| 6 | Land squares: landform, biome, water, feature |
| 7 | Geology provinces |
| 8 | Find sites |
| 9 | Named worlds in the Directory |
| 10 | How the three games use this language |
| 11 | What this document does not model |
| 12 | Deferred topics |
| Appendix A | Designer truth: Desktop generation provenance |
| Appendix B | Designer truth: P0 find-site catalogue |

> **How to use this document**  
> Sections 1–10 are public survey canon suitable for encyclopaedia and game-facing language. Appendices A–B are designer truth: classification imported from Desktop engineering design. Procedural seeds, elevation amplitudes, cell grids and spawn rarity remain game runtime concerns until a specific world map is frozen into structured Universe records.

# 1. Purpose and place in canon

Commonwealth surveyors, charter clerks and colonists need a shared way to name a body and the ground on it. A temperate forested lowland on Koplin 3, a barren highland on a frontier moon, and a volcanic field on an industrial world are different *places*, but they use the same *labels*.

This document publishes that shared language as MineIT Universe canon. It sits as a **foundation technical companion** to the Expanded Backstory & Lore Bible: history explains *which worlds matter*; this chapter explains *how land is classified* so every MineIT game can point at the same IDs.

Structured land and world records must agree with this chapter. Per-save maps, generated quantities, deposit instances, and the exact grid a player is standing on are game state, not universe canon.

# 2. What this document owns

Three related ideas must stay distinct:

| Concept | Meaning | Owner |
|---------|---------|-------|
| **World identity** | A named planet, moon or other body with a stable ID (for example Koplin 3). | Universe `planets` |
| **Land vocabulary** | The reusable labels for body kind, world type, atmosphere, landform, biome, water, feature, geology province and find site. | Universe land collections |
| **Local map / grid** | The actual squares, cells or 3D mesh a player mines in one session. | Game save / runtime |

A Mobile landscape grid is a *view* of land vocabulary on a named world. It is not a second canonical map. Desktop's walkable surface is the same vocabulary at a finer resolution. Single Mine uses a small site that still names its landform, biome and find-site class.

# 3. Celestial body kinds

Every persistent body has one **kind**. Kind decides whether the body has a walkable solid surface and whether ordinary mining language applies.

| Kind | Walkable surface | Ordinary mining | Notes |
|------|:---:|:---:|------|
| Rocky planet | Yes | Yes | Full surface classification: world type, atmosphere, landform, biome |
| Gas giant | No | No | Atmosphere envelope only; no land squares |
| Rocky moon | Yes | Yes | Same land vocabulary as rocky planets, with moon world types |
| Asteroid | Partial | Yes | Lump geometry; not a full planetary grid |
| Comet | No | Limited | Nucleus and coma; not a land grid |
| Star | No | No | Stellar body; not land |
| Ring system | No | No | Attached to a parent body; not a standalone world |

Kind is not a decorative tag. A gas giant must not be given plains and forests. An airless moon may be given landforms and barren biomes, but its atmosphere is `None` or `Trace`.

# 4. World types

**World type** is a narrative / survey label for a rocky planet, moon, asteroid or gas giant. It is not a generation seed and not a guarantee of every local square.

Rocky-planet types use a design name and a shorter game name:

| Design name | Game name |
|-------------|-----------|
| Standard Rocky Planet | Barren World |
| Volcanic Rocky Planet | Scorched World |
| Toxic Volcanic Planet | Hellworld |
| Metallic Rocky Planet | Ore World |
| Carbon-Rich Planet | Fossil World |
| Cryogenic Hydrocarbon World | Titan-Class World |
| Dry Arid Rocky Planet | Dust World |
| Alkaline Evaporite Planet | Salt World |
| Water-Altered Rocky Planet | Claystone World |
| Former Ocean Planet | Deadwater World |
| Habitable Temperate World | Verdant World |
| Biological Planet | Lifeworld |
| Chemically Active Planet | Corrosive World |
| Oxidising Planet | Rust World |
| Geologically Complex Planet | Exotic World |
| Ancient Radioactive Rocky Planet | Radiant World |
| Stable Mineral-Rich World | Crystal World |
| High-Pressure Geological World | Ironstone World |
| Cryogenic World | Frozen World |
| Gas-Rich Planet | Vent World |

**Authored-only types.** Terraformed World and Colony World are civilisational facts. They are never assigned by a procedural roll. If a named world is terraformed or a colony, that is authored in Universe, not generated at runtime.

**Legacy catalog type.** Water World exists as a catalog label for ocean-dominated demo presets. Procedural ocean coverage comes from liquid inventory and sea level, not from assigning Water World as a planet type. Named ocean worlds in the Directory use Habitable Temperate World or Water-Altered Rocky Planet plus hydrosphere labels.

Moon, asteroid and gas-giant type lists are the same kind of survey labels. They do not replace body kind.

Koplin 3 is a **Habitable Temperate World** (Verdant World): a temperate homeworld with substantial land and water, not a Water World catalog preset.

# 5. Atmosphere types

Atmosphere is a broad survivability / survey label. It is not the climate simulation.

| Type | Meaning |
|------|---------|
| None | Airless |
| Trace | Almost no atmosphere |
| Thin | Low pressure |
| Breathable | Survivable, Earth-like or near it |
| Dense | Thick atmosphere |
| Toxic | Poisonous or corrosive |
| Hot greenhouse | Heat-trapping envelope |
| Cryogenic | Cold methane/nitrogen-rich envelope |
| Gas-giant envelope | No solid surface; not used on rocky worlds |

Koplin 3 is **Breathable**. Airless industrial moons are **None**. Thin-atmosphere mineral worlds are **Thin**. These labels travel with the world record; local weather and storms remain game state.

# 6. Land squares: landform, biome, water, feature

Mobile shows a world as a grid of squares. Desktop walks a continuous surface. Single Mine works one site. All three should name a square (or a site) with the same four layers:

| Layer | Question | Examples |
|-------|----------|----------|
| **Landform** | What *shape* is the ground? | Plains, Hills, Mountains, Basin, Lowland, Highland, Plateau, Valley, Cliff, Canyon, Ridge, Crater |
| **Biome** | What *covers* that ground? | Barren rock, Desert, Grassland, Forest, Wetland, Tundra, Ice sheet, Volcanic field, Lava field, Toxic wasteland |
| **Hydrosphere** | Is there water here, and of what kind? | None (dry land), Ocean, Lake, River, Fresh water, Saltwater, Brine, Mineral-rich water, Frozen water, Subsurface aquifer |
| **Surface feature** | What is the primary decoration or exposure? | Coast, Dune sea, Salt flat, Rock exposure, Exposed seams, Ice cover, Lava flow, Peat layer |

Landform is shape only. Coast, lake and ocean are **not** landforms. A basin may be dry or filled; hydrosphere says which.

A named world may list **dominant** landforms and biomes. That is a survey summary, not a complete map. Games may generate or load a grid whose squares use these IDs; they must not publish a second canonical world map.

# 7. Geology provinces

Geology province is the crust story under a square: sedimentary basin, volcanic province, metal-rich province, salt-rich province, ancient crust, and related labels.

Provinces matter because find sites and later underground mining use them. They are shared vocabulary, not a per-world authored geology map.

# 8. Find sites

A **find site** is a reusable encounter class: a kind of place where a substance category is typically found. It is not a deposit instance and not a spawn-rarity table.

The published bootstrap set is **ten surface find sites**:

| Find site | Typical land | Typical substance |
|-----------|--------------|-------------------|
| Surface rock fields | Plains / grassland | Stone aggregate |
| Surface mud flats | Lowland / wetland | Clay mineral |
| Forests | Plains / forest | Woody plant material |
| Surface outcrops | Highland or mountains / rock exposure | Structural metal ore |
| Exposed cliff faces | Cliff or canyon / exposed seams | Conductive metal ore |
| Surface lakes | Basin / lake | Fresh water |
| Surface sand dunes | Plains / desert | Silica mineral |
| Saltwater surface bodies | Basin / ocean, brine or salt lake | Saltwater |
| Peat-like surface bogs | Lowland / wetland / peat | Solid fuel deposit |
| Dry mineral beds | Plains / desert | Insulating mineral |

Exact spawn chance, cell hashes and underground P1 sites stay in Desktop generation design until they are separately promoted. Games may use find-site IDs to decide *what kind of encounter* a square can offer; *whether this save has a deposit here* is game state.

# 9. Named worlds in the Directory

Every `planets` record should carry:

- `celestialBodyKindId` — always;
- `worldTypeId` and `atmosphereTypeId` when the record is specified enough;
- optional dominant landform, biome and hydrosphere IDs;
- `surfaceAssignmentStatus` stating how complete the assignment is.

Allowed assignment statuses:

| Status | Meaning |
|--------|---------|
| `source-canonical` | Higher-precedence lore states the surface well enough to assign labels (Koplin 3). |
| `inferred-from-existing-record` | Existing Directory `worldType` / `environment` text is enough to choose labels without inventing new geography. |
| `kind-only` | The body is known to exist, but surface has not been authored (Koplin 3's unnamed moons). |

Do not invent continents, coastlines or cell maps for generated-expansion worlds. Dominant labels on those worlds are conservative readings of text already in the Directory.

# 10. How the three games use this language

The Universe Directory now records the three current MineIT games as consumer catalogue entries. They are not in-universe organisations.

**MineIT Desktop** is the full 3D mining game on the standard ship scenario. It generates a walkable surface from this vocabulary. Seeds, elevation and deposit instances remain Desktop runtime.

**MineIT Mobile** is the corporation-building game. Landscapes display as a grid of squares. Each square should name landform (shape) and biome (cover), and may name water, feature and find-site class. The grid itself is Mobile session state on top of a named world. When that world has a matching landscape tileset, Mobile should draw those 1:1 tiles so neighbouring squares share lighting, palette and landform language. A tileset is world art, not a second canonical map.

**MineIT Single Mine** is a small single-mine simulator. A play session is one site: one world, one landform/biome context, one find-site class, and local extraction state. The site is not a new canonical world.

All three games consume substances, parts, machines and buildings from the same Universe catalogues. They must not author parallel planets, land vocabularies or substance lists.

# 11. What this document does not model

- Per-cell or per-square maps for named worlds
- Procedural seeds, noise, elevation amplitudes or terrain tuning
- Spawn rarity, deposit quantities, quality rolls or cooldowns
- Player colonies, claims, or save-specific mines
- Weather simulation, wind maps or storm schedules
- Underground depth-band spawn tables (Desktop P1)

# 12. Deferred topics

- P1 find sites (underground and advanced surface)
- Authored maps for Koplin 3's two moons
- Per-continent land summaries for Koplin 3 beyond the three inhabited masses already in the Lore Bible
- Ring, comet and star type catalogues as first-class Directory collections
- Landscape tilesets for remaining named worlds after Koplin 3

# Appendix A — Designer truth: Desktop generation provenance

> **Designer truth.** Not in-universe public knowledge.

Desktop `CelestialBodyGeneration` is engineering provenance. Useful shared vocabulary was materialised into Universe collections. The following stay in Desktop and must not be copied into Universe as if they were authored world facts:

- body seeds and sub-seeds;
- Stage 1.0 constrained rolls and centroid classifiers;
- Stage 1.4 terrain profiles and amplitude lerps;
- Stage 1.5 sea-level calibration numbers;
- Steps 2–5 cell pipelines, spawn hashes and `rowRarity`;
- `TerrainTuning` and per-label engine config;
- Water World as a Stage 1.0 procedural assignment;
- Terraformed World and Colony World as procedural rolls.

Labels (`PlanetType`, `MoonType`, `AtmosphereType`, `SurfaceLandform`, `SurfaceBiome`, `SurfaceFeature`, `SurfaceHydrosphere`, `GeologyProvince`) are the portable layer. Physics scalars and compiled terrain profiles are not.

# Appendix B — Designer truth: P0 find-site catalogue

> **Designer truth.** Encounter classes for bootstrap surface mining, imported from Desktop Find Site Catalog. Predicates that mention slope, moisture noise or spawn hash are Desktop runtime, not Universe facts.

The ten P0 surface rows link landform, biome, hydrosphere, surface feature and geology province IDs to substance IDs. Universe stores those links without rarity. Games that need spawn probability keep that table locally or derive it at runtime.
