# UNI-ASSET-003 — Mobile Art Identity, Build-Level Views and Landscape Coverage

**Owner:** Universe canonical and reusable artwork · **Original fully reviewed:** [Mobile Overhaul Art Audit](../../MobileOverhaulArtAudit.md) (UNI-SRC-012), **dated 6 October 2026**, originally a generation queue on `feature/mobile-overhaul-art-completion`. **Status:** historical content/queue audit, **not live art-completion acceptance**. This chapter documents the source's requirements while respecting the authoritative current image-state metadata and [image-generation process](../../ImageGenerationProcess.md) (not fully reconciled here).

## Identified source families

The original audit identifies **42 natural non-Food** resources with existing PNG/WebP art, **seven** biological/Food identities under `data/mobile-biological-resources.json`, **24** canonical building identities in `data/buildings.json`, **120** game-level L1–L5 building presentations, **55** bespoke Koplin-3 landscape images and **142** generic generated-world landscape presentations. These are **historical audit counts**, not a live count of generated/approved images.

The seven Food IDs in that source are crops, edible flora, herds, aquatic food, fungi, algae and synthetic nutrients. Store actual image metadata/prompts on their **Universe resource records** and images at `assets/art/universe/resources/` keyed by stable ID; the fallback to legacy Android Food filenames is not a permanent canonical mapping.

Universe has **one building identity** per authored type. The documented catalogue included previously missing `building-aquaculture-facility` and `building-agricultural-dome` among its 24 types. The Mobile-specific exception is **five linked level images per building** in `data/building-mobile-level-images.json`. These are presentation variants, **not five new building entities or save facts**. Android may consume derived image bundles and atlases, never maintain a second independently authored canonical library.

Ten five-level source families (accommodation/housing, algae, bio-harvester, deep mine, extraction rig, farm, industry, simple pit mine, quarry and ranch) had migrated art/atlases in the October checkpoint; absent families were to be generated using the approved housing L1–L5 visual progression: transparent isometric 3D, light curved shells, dark structure, orange trim, subtle blue emissive accents, increasing density/height.

## World-specific versus reusable landscapes

The historical audit records **55 Koplin-3 bespoke tiles**. A world with its own authored `landscapeTileset` must use those keyed, world-specific tiles; it must not be silently replaced with generic scenery. Generic art belongs to `assets/art/visual-library/landscape/mobile/` and is **identity-neutral**, usable across procedural worlds without relabelling a Koplin image as reusable.

The generic target is **120 landform/biome pairs** (**12** landforms × **10** biomes), **10 visible liquid types** and **12 inherited texture variants**, totalling **142** images. The 12 landform classes include plains, hills, mountains, basin, lowland, highland, plateau, valley, cliff, canyon, ridge and crater. The 10 biome classes include barren rock, desert, grassland, forest, wetland, tundra, ice sheet, volcanic field, lava field and toxic wasteland. Visible liquids cover ocean, lake, river, fresh/saltwater, brine, mineral-rich, frozen, hydrocarbon and corrosive states. **No image** is intended for `hydrosphere-none` or `hydrosphere-subsurface-aquifer`. Hydrocarbon/corrosive surfaces must not default to ordinary blue water.

Image prompts and `image.generated`/`image.status` flags are authored on the actual queue records: `data/mobile-biological-resources.json`, `data/buildings.json` and `data/visual-assets-mobile-landscape.json`. Do not infer generation completion solely because a required file path is listed in this historic document. Canonical asset validation requires **lossless PNG original** and **WebP published image**, valid metadata and the actual committed files; the Android build should pin one validated Universe snapshot.

## Arithmetic inconsistency in original audit — unresolved

The dated source's family totals say **293** images: `7 Food + 24 building identity + 120 building level + 142 generic landscape = 293`. However its final completion gate says **291**; it also states **76** images migrated and **208** queued, which sum to **284**, not 293. These are **inconsistent historical counters**. Preserve the original source without editing it, and **do not choose 291, 284 or 293 as a validated completed-image count**. The correct present-day total must come from the checked-in authored image records, originals and published paths, accounting for exclusions/waivers and art status. Record this discrepancy in the [cross-repo reconciliation ledger](../source-register/RECONCILIATION_MATRIX.md) for authoritative resolution.

## Validation and ownership

Verify one-to-one resource/building IDs; distinct identity art versus level views; 1:1 landform/biome/hydrosphere keys; canonical prompt/state transitions; only permitted original/WebP paths; generated/approved file existence; authored-world priority versus reusable fallback; direct Directory rendering; and **Android's pinned snapshot**, rather than retroactively declaring an October 6 queue completed.

**No PNG/WebP image, source queue, canon JSON, Kotlin mapping or historical document was modified in this documentation batch.**
