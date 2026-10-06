# MineIT Mobile Overhaul Art Audit

**Status:** Generation queue prepared  
**Audit date:** 6 October 2026  
**Branch:** `feature/mobile-overhaul-art-completion`

## Result

The Mobile overhaul art boundary has four relevant groups:

| Group | Existing complete | New generation queue | Result after queue |
| --- | ---: | ---: | --- |
| Natural non-Food resources | 42 | 0 | Complete |
| Biological/Food resources | 7 | 0 | Complete |
| Canonical building identity art | 12 | 12 | Complete after generation |
| MineIT Mobile building level art | 50 migrated | 70 | Complete after generation |
| Koplin 3 bespoke landscape tiles | 55 | 0 | Complete |
| Generic generated-world landscape library | 16 migrated | 124 | Complete after generation |

Revised total for the overhaul art phase: **291 images** (7 Food, 24 canonical building images, 120 Mobile L1-L5 building images and 140 generic landscape variants). Android migration completed 76 of these images; **206 images remain to generate**.

## 1. Resources

The 42 canonical natural non-Food Mobile resources already have PNG/WebP art and require no regeneration.

The seven biological/Food identities now carry full image-generation metadata in `data/mobile-biological-resources.json`:

- `mobile-food-crops` -> `assets/art/universe/resources/mobile-food-crops.webp`
- `mobile-food-edible-flora` -> `assets/art/universe/resources/mobile-food-edible-flora.webp`
- `mobile-food-herds` -> `assets/art/universe/resources/mobile-food-herds.webp`
- `mobile-food-aquatic-food` -> `assets/art/universe/resources/mobile-food-aquatic-food.webp`
- `mobile-food-fungi` -> `assets/art/universe/resources/mobile-food-fungi.webp`
- `mobile-food-algae` -> `assets/art/universe/resources/mobile-food-algae.webp`
- `mobile-food-synthetic-nutrient` -> `assets/art/universe/resources/mobile-food-synthetic-nutrient.webp`

These should be generated rather than mapped permanently to legacy Android Food filenames.

## 2. Buildings

`data/buildings.json` now contains 24 canonical building identities.

Canonical building queue (24, including migrated and generated records):

- `building-collection-camp` -> `assets/art/universe/buildings/building-collection-camp.webp`
- `building-quarry` -> `assets/art/universe/buildings/building-quarry.webp`
- `building-simple-pit-mine` -> `assets/art/universe/buildings/building-simple-pit-mine.webp`
- `building-extraction-rig` -> `assets/art/universe/buildings/building-extraction-rig.webp`
- `building-water-collector` -> `assets/art/universe/buildings/building-water-collector.webp`
- `building-crashed-ship` -> `assets/art/universe/buildings/building-crashed-ship.webp`
- `building-farm` -> `assets/art/universe/buildings/building-farm.webp`
- `building-ranch` -> `assets/art/universe/buildings/building-ranch.webp`
- `building-bio-harvester` -> `assets/art/universe/buildings/building-bio-harvester.webp`
- `building-algae-facility` -> `assets/art/universe/buildings/building-algae-facility.webp`
- `building-accommodation-building` -> `assets/art/universe/buildings/building-accommodation-building.webp`
- `building-habitat` -> `assets/art/universe/buildings/building-habitat.webp`
- `building-power-plant` -> `assets/art/universe/buildings/building-power-plant.webp`
- `building-industry` -> `assets/art/universe/buildings/building-industry.webp`
- `building-basic-refinery` -> `assets/art/universe/buildings/building-basic-refinery.webp`
- `building-headquarters` -> `assets/art/universe/buildings/building-headquarters.webp`
- `building-research-building` -> `assets/art/universe/buildings/building-research-building.webp`
- `building-spaceport` -> `assets/art/universe/buildings/building-spaceport.webp`
- `building-shipyard-bay` -> `assets/art/universe/buildings/building-shipyard-bay.webp`
- `building-aquaculture-facility` -> `assets/art/universe/buildings/building-aquaculture-facility.webp`
- `building-agricultural-dome` -> `assets/art/universe/buildings/building-agricultural-dome.webp`
- `building-deep-mine` -> `assets/art/universe/buildings/building-deep-mine.webp`
- `building-stockpile` -> `assets/art/universe/buildings/building-stockpile.webp`
- `building-warehouse` -> `assets/art/universe/buildings/building-warehouse.webp`

The audit added the two Mobile-overhaul facilities that were missing from Universe:

- `building-aquaculture-facility`
- `building-agricultural-dome`

**Ownership rule:** Universe owns one canonical building identity/catalogue image per building type. As a MineIT Mobile-specific exception, Universe also owns five linked L1-L5 presentation images per building in `data/building-mobile-level-images.json`. These are authored progression views, not separate building identities and not mutable save state. Android consumes derived/bundled copies.

The Android development-art source supplied 10 complete five-level families and their current 1280×256 runtime atlases: accommodation/housing, algae facility, bio-harvester, deep mine, extraction rig, farm, industry, simple pit mine, quarry and ranch. Their native PNGs, derived individual WebPs and atlases are migrated into Universe; only missing families require generation.

The Android housing L1-L5 sequence is the approved style/progression reference: transparent-background, polished isometric 3D game art with white rounded shells, charcoal framing, orange trim, restrained blue emissive details and increasing module count, capacity, density and verticality from L1 through L5.

## 3. Landscapes

Koplin 3 already has a complete bespoke authored tileset with 55 generated images.

Generated worlds need a separate reusable, identity-neutral fallback. The new queue `data/visual-assets-mobile-landscape.json` contains:

- 120 base land tiles = 12 landforms x 10 biomes;
- 8 base visible surface-water tiles;
- 12 additional migrated variants: plains/grassland, hills/grassland, mountains/grassland and lake variants 02-04;
- **140 total generic landscape images**.

Landforms:

- `landform-plains`
- `landform-hills`
- `landform-mountains`
- `landform-basin`
- `landform-lowland`
- `landform-highland`
- `landform-plateau`
- `landform-valley`
- `landform-cliff`
- `landform-canyon`
- `landform-ridge`
- `landform-crater`

Biomes:

- `biome-barren-rock`
- `biome-desert`
- `biome-grassland`
- `biome-forest`
- `biome-wetland`
- `biome-tundra`
- `biome-ice-sheet`
- `biome-volcanic-field`
- `biome-lava-field`
- `biome-toxic-wasteland`

Visible water families:

- `hydrosphere-ocean`
- `hydrosphere-lake`
- `hydrosphere-river`
- `hydrosphere-fresh-water`
- `hydrosphere-saltwater`
- `hydrosphere-brine`
- `hydrosphere-mineral-rich-water`
- `hydrosphere-frozen-water`

`hydrosphere-none` and `hydrosphere-subsurface-aquifer` intentionally have no standalone water image.

Generic generated-world art lives under:

`assets/art/visual-library/landscape/mobile/`

It must never be substituted for a bespoke authored-world tileset when that world supplies one, and Koplin-specific tiles must never be relabelled as generic.

## 4. Prompt ownership

Codex does not need to invent prompts.

Every missing asset has its final prompt stored directly in its queue record:

- Food: `data/mobile-biological-resources.json -> image.promptDescription`
- Buildings: `data/buildings.json -> image.promptDescription`
- Generic landscapes: `data/visual-assets-mobile-landscape.json -> image.promptDescription`

Generation should follow `docs/ImageGenerationProcess.md`.

## 5. Completion gate

This art phase is complete when:

- all 291 overhaul images have lossless PNG originals and published WebPs;
- each corresponding `image.generated` is `true`;
- each corresponding `image.status` is `generated` or `approved`;
- repository validation passes;
- no generated record points to a missing file;
- Directory/catalogue rendering is checked where applicable;
- the resulting exact Universe commit becomes the Android Phase-2 pin.

Until then, Android should treat `3e128e6b3f48b4f8d0d8e6fe886786dfe2c57b46` as the previous validated baseline, not the final overhaul art pin.
