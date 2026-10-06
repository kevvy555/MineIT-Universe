# MineIT Mobile Overhaul Art Audit

**Status:** Generation queue prepared  
**Audit date:** 6 October 2026  
**Branch:** `feature/mobile-overhaul-art-completion`

## Result

The Mobile overhaul art boundary has four relevant groups:

| Group | Existing complete | New generation queue | Result after queue |
| --- | ---: | ---: | --- |
| Natural non-Food resources | 42 | 0 | Complete |
| Biological/Food resources | 0 | 7 | Complete after generation |
| Canonical building identity art | 3 | 21 | Complete after generation |
| Koplin 3 bespoke landscape tiles | 55 | 0 | Complete |
| Generic generated-world landscape library | 0 | 128 | Complete after generation |

Total new images to generate: **156**.

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

Already generated:

- `building-deep-mine`
- `building-stockpile`
- `building-warehouse`

Generation queue (21):

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

The audit added the two Mobile-overhaul facilities that were missing from Universe:

- `building-aquaculture-facility`
- `building-agricultural-dome`

**Ownership rule:** Universe owns one canonical building identity/catalogue image. Android's existing L1-L5 development atlases are game-specific presentation and do not need to become canonical Universe identities.

## 3. Landscapes

Koplin 3 already has a complete bespoke authored tileset with 55 generated images.

Generated worlds need a separate reusable, identity-neutral fallback. The new queue `data/visual-assets-mobile-landscape.json` contains:

- 120 land tiles = 12 landforms x 10 biomes;
- 8 visible surface-water tiles;
- **128 total generic landscape images**.

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

- all 156 queued images have lossless PNG originals and published WebPs;
- each corresponding `image.generated` is `true`;
- each corresponding `image.status` is `generated` or `approved`;
- repository validation passes;
- no generated record points to a missing file;
- Directory/catalogue rendering is checked where applicable;
- the resulting exact Universe commit becomes the Android Phase-2 pin.

Until then, Android should treat `3e128e6b3f48b4f8d0d8e6fe886786dfe2c57b46` as the previous validated baseline, not the final overhaul art pin.
