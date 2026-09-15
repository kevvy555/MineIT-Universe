# World Surface Canon — Consumer Architecture

Status: **Published architecture**  
Canonical lore: `data/lore/Koplin_Universe_World_Surface.md`  
Structured collections: `games`, `celestialBodyKinds`, `worldTypes`, `atmosphereTypes`, `surfaceLandforms`, `surfaceBiomes`, `surfaceFeatures`, `surfaceHydrospheres`, `geologyProvinces`, `findSites`, plus land fields on `planets`

## Ownership

MineIT Universe owns the shared survey language for bodies and land used by the MineIT family of games.

Desktop `CelestialBodyGeneration` is **engineering provenance**. Once reconciled into Universe lore and structured data, Universe is authoritative. Games must not maintain a conflicting authored catalogue of planets, landforms, biomes or find-site classes.

Mutable gameplay values remain game-owned. Cell maps, seeds, elevation amplitudes, spawn rarity, deposit instances, square ownership and per-save mines are not Universe canon.

## Publication path

```text
data/lore/Koplin_Universe_World_Surface.md
        ↓ registered by
data/lore-documents.json
        ↓ rendered by
lore.html  (long-form land/world chapter)

data/games.json
data/celestial-body-kinds.json
data/world-types.json
data/atmosphere-types.json
data/surface-landforms.json
data/surface-biomes.json
data/surface-features.json
data/surface-hydrospheres.json
data/geology-provinces.json
data/find-sites.json
data/planets.json  (kind / type / atmosphere / dominant land)
        ↓ registered by
data/manifest.json
        ↓ rendered by
index.html / js/universe-app.js  (Directory Games + Land groups)
games.html                       (one section per current game)
        ↓ loadable by
any consumer via loadUniverse() / manifest fetch
```

## What was imported from Desktop

Useful shared vocabulary:

- seven celestial body kinds
- rocky-planet types (design name + game name), plus moon, asteroid and gas-giant type lists
- atmosphere labels (`None` through `Cryogenic`, plus gas-giant envelope)
- twelve landforms (shape of a grid square)
- ten biomes (cover of a grid square)
- hydrosphere, surface feature and geology-province labels
- ten P0 surface find sites linked to substance IDs

Explicitly **not** imported:

- body seeds, noise, elevation amplitudes, `TerrainTuning`
- per-cell maps
- `rowRarity` and spawn hashes
- Water World as a Stage 1.0 procedural type
- Terraformed World / Colony World as procedural rolls (they exist as authored-only world types)

## Planet land fields

Flattened onto each world record:

- `celestialBodyKindId` (required)
- `worldTypeId`, `atmosphereTypeId` (required unless `kind-only`)
- `dominantLandformIds`, `dominantBiomeIds`, `dominantHydrosphereIds`
- `surfaceAssignmentStatus`: `source-canonical` | `inferred-from-existing-record` | `kind-only`

Koplin 3 is source-canonical: rocky planet, Verdant World, breathable, mixed land and water. Its two moons are kind-only until proper names and surfaces are authored.

Generated-expansion worlds receive conservative labels inferred from existing Directory `worldType` / `environment` text. That is not a new geography bible.

## Games

`games` is a designer catalogue, not an in-universe organisation type.

Current records:

- `game-mineit-desktop` — full 3D mining, standard ship scenario
- `game-mineit-mobile` — corporation builder; landscapes as a grid of squares
- `game-mineit-single-mine` — small single-mine simulator

Mobile squares should name `surfaceLandforms` (shape) and `surfaceBiomes` (cover). Desktop walks the same labels in 3D. Single Mine uses one site / one find-site class.

## Record shape notes

Find sites store landform, biome, hydrosphere, feature, geology-province and substance IDs. They do not store rarity or spawn procedures.

World types store `appliesToKindId` so a moon type cannot be attached to a rocky planet.

Games store prose about shared land/substance use. They do not store collection-name strings as entity ID references.
