# Koplin 3 Canonical World Atlas

**Status:** Canonical authored expansion  
**Atlas ID:** `world-atlas-koplin-3`  
**World:** `planet-koplin-prime` / Koplin 3  
**Capital:** `settlement-concordia` / Concordia  
**Tile size:** 1 km × 1 km  
**Initial authored queue:** 100 tiles  
**Generation batch size:** 10

## Purpose

This atlas turns selected parts of Koplin 3 into a materialised visual world map rather than a reusable terrain catalogue. It begins at the Federal Forum in Concordia and expands outward in a clockwise square spiral. The structured JSON is the source of truth for generation order, prompts, edge continuity and published image paths.

The atlas is separate from `landscape-tileset-koplin-3`. The landscape tileset remains reusable Mobile land-square art; the atlas is a specific canonical place.

## Canon basis

The foundation lore establishes Koplin 3 as a breathable, temperate homeworld that is approximately half land and half water with three major continental masses. The Trondonian continent is tropical and biomass-rich; the Zoran continent is temperate, faulted and ore-rich with a long technical-institutional tradition; the Blaxmar continent is cold, polar/sub-polar and energy/mineral rich.

The capital name, exact placement and visual urban structure are authored expansion that does not override those facts. Concordia is placed on the Zoran continent and is designed as a Commonwealth capital for all three peoples.

## Coordinate and spiral convention

- `(0,0)` is the Federal Forum.
- positive X is east.
- positive Y is north.
- generation begins by moving east.
- tiles are processed in a clockwise square spiral.
- batch 1 is sequences 1-10; subsequent batches are ten tiles each.

The website must render by coordinate, not by generation sequence. Generation sequence exists only to make outward expansion and review manageable.

## Adjacency strategy

Every tile has deterministic north/east/south/west boundary guidance. Shared boundaries are calculated from the same coordinate boundary so both neighbouring prompts ask for matching boulevard/greenway/transit crossings.

Generation should also use already-generated orthogonal neighbours in `referenceTileIds` as image references whenever the generator supports reference images. The prompt is not the only seam-control mechanism.

Reject or regenerate a candidate when roads, rail, waterways, camera, lighting or scale break badly at a seam.

## Visual lock

The approved style is adapted from the existing MineIT building-art language: high-detail isometric/axonometric environment art; white/light-grey advanced structures with orange accents, blue glass, dark mechanical details, glass biodomes and dense integrated planting.

Concordia is prosperous and mature rather than dystopian. As the spiral reaches the edge of the metropolis, the same design language continues through infrastructure, greenhouses, utilities, villages and farms while built density falls and natural terrain becomes dominant.

## Phase-one urban gradient

- rings 0-1: Federal Forum and immediate capital core.
- ring 2: dense inner city.
- ring 3: middle metropolitan districts.
- ring 4: outer metropolitan belt and garden suburbs.
- ring 5: first peri-urban and countryside transitions, including farms, woodland, reservoirs, villages and research/agricultural belts.

This lets the first 100 tiles show more than a wall-to-wall city while remaining believable for a large capital.

## Canonical data

- `data/world-atlases.json` — atlas-level world plan and style/adjacency rules.
- `data/world-atlas-tiles.json` — 100 phase-one tile records, prompts and image state.
- `data/settlements.json` — Concordia canonical settlement.
- `data/planets.json` — Koplin 3 links to its capital and atlas.
- `assets/art/universe/planets/planet-koplin-prime/atlas/` — published atlas WebP assets.
- `assets/art/universe/planets/planet-koplin-prime/atlas/Originals/` — lossless PNG originals.

## Website plan

After a useful image area exists—targeting the first 100 tiles—add a portrait-phone-compatible atlas browser. It should pan and zoom the coordinate grid, display the images in their actual spatial positions, and open a tile panel showing coordinate, district, generation order and descriptive metadata.

The browser must consume the manifest-declared atlas collections. It must not embed a second copy of the atlas data.
