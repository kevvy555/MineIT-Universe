# MineIT Mobile Landscape Concepts

**Status:** Designer-only visual references, not universe canon or generated gameplay terrain.

The Universe Directory exposes these records under **Games → Mobile → Landscape Concepts**. The other canonical game entries are still **Desktop** and **Single Mine**.

The concept catalogue is authored as `data/game-landscape-concepts.json` and loaded via the manifest collection `gameLandscapeConcepts`. Every record has its own stable ID, linked `gameId`, intended 64 × 64 km overview, visual description and image generation state. This is separate from world-specific `landscapeTiles` and `worldAtlasTiles`, and must never be used as the canonical map of any named planet.

## Included concepts

1. Natural Landscape (No Buildings)
2. Temperate Colony — Initial Concept
3. Temperate Colony — Revised Scale
4. Cryogenic Colony
5. Arid Colony
6. Barren Rocky Colony
7. Toxic Colony
8. Volcanic Colony

The first two colony compositions include a deliberately rejected building-scale treatment, retained for comparison. All eight views are illustrative rather than geographically or dimensionally exact: a caption of 64 × 64 km does **not** make the drawn building sizes, relief, or separations physically measured.

## Assets and publication

The images were generated in the conversation on 12 November 2026. Retain each original PNG under:

```text
assets/art/universe/games/mobile/landscape-concepts/Originals/<concept-id>.png
```

Store the web-facing WebP at `<concept-id>.webp` in the parent directory, exactly matching the record's `image.key`.

**Important:** The current feature branch records are initially marked `image.generated=false` / `image.status=not-generated` until those PNG/WebP pairs are imported. Do not change the status to `generated` until both real files are committed. The companion asset archive contains the eight original PNGs, published WebPs and final generated-image metadata.

Run `node validation/validate-universe.mjs` after import. The validator verifies stable IDs, game relationships, designer-only scope, collection size, image paths and paired PNG/WebP files once an image is marked generated.

The Directory uses the existing image lightbox and large landscape hero for published concepts. The Games catalogue links to the Mobile concept collection; there is no parallel browser-side hard-coded data source.
