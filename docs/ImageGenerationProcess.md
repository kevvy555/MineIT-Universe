# MineIT Universe Image Generation Process

**Status:** Canonical working process  
**Applies to:** generated canonical artwork in `MineIT-Universe`  
**Primary audience:** Codex, implementation agents and maintainers  
**Last updated:** 6 October 2026

## 1. Purpose

This document defines the exact process used to prepare, generate, store, register, validate and publish canonical artwork for the MineIT Universe repository.

It consolidates the image-generation rules previously spread across:

- `AGENTS.md`
- `assets/art/universe/README.md`
- `docs/MineitUniverseDatabase.md`
- category-specific canon/integration documents

The goals are to:

- keep artwork tied to stable entity IDs;
- make every generation task discoverable from structured repository data;
- preserve a lossless original alongside the web-facing asset;
- make image state explicit and machine-checkable;
- prevent game repositories from becoming competing art sources;
- allow the Universe Directory to show placeholders and prompts before art exists.

## 2. Authority and source order

When generating an image, use the following authority order:

1. the target entity record in `data/*.json`;
2. `AGENTS.md`;
3. this document;
4. category-specific canon/integration documentation;
5. existing approved art in the same category as visual consistency reference.

The structured record owns the canonical asset path and image state.

Do not invent lore, filenames, output paths or workflow states that conflict with the record or repository rules.

## 3. Core principles

### 3.1 Stable ID owns the image

Canonical artwork is keyed by stable entity ID, not display name.

Renaming an entity must not require inventing a new art identity when the stable ID remains unchanged.

### 3.2 The JSON record is the generation queue

Do not discover generation work by scanning folders manually.

Select records from canonical data whose image metadata indicates work is required.

Typical queue states are:

- `generated: false`, `status: "not-generated"`
- `status: "needs-regeneration"`

### 3.3 Missing artwork is valid

A canonical entity may exist without completed artwork.

Until art exists, the Directory may show a placeholder and expose the authored prompt.

Never create a fake file merely to satisfy a path.

### 3.4 Original and web asset are a pair

For ordinary canonical catalogue art, keep:

- a lossless PNG original;
- a WebP catalogue/published asset.

The WebP is the path stored in `image.key`.

The original normally lives in an `Originals/` directory beside the published asset.

### 3.5 Never mark art generated before the files exist

`image.generated: true` is only valid when the canonical published asset exists at `image.key`.

When the workflow requires an original PNG, the original must also be committed before the generation task is treated as complete.

### 3.6 Canonical art remains in Universe

Consuming games may copy, bundle, resize or cache derived art as build output.

Those copies are not independently authored canon.

The canonical identity and source artwork remain in `MineIT-Universe`.

## 4. Standard image metadata contract

Image-bearing records use an `image` object.

Typical shape:

```json
{
  "image": {
    "key": "assets/art/universe/<category>/<entity-id>.webp",
    "generated": false,
    "status": "not-generated",
    "promptDescription": "Approved generation prompt.",
    "notes": "Storage and category-specific guidance."
  }
}
```

### Required fields

#### `key`

Canonical repository path of the published image.

#### `generated`

Boolean indicating whether a valid published asset currently exists.

#### `status`

One of:

- `not-generated`
- `in-progress`
- `generated`
- `approved`
- `needs-regeneration`

#### `promptDescription`

The approved prompt content for the entity.

The generator may combine this with structured visual facts from the record, but must not alter the intended identity or lore.

#### `notes`

Storage instructions or category-specific guidance.

### Supporting fields

Some entity types also use fields such as:

- `visualDescription`
- `styleLock`
- organisation visual identity
- physical occurrence metadata
- provenance

Use them as context when relevant.

They do not replace `image.promptDescription`.

## 5. Image-state lifecycle

### 5.1 `not-generated`

Use when:

- final artwork does not yet exist;
- `generated` is `false`;
- the record is ready to enter a generation batch.

### 5.2 `in-progress`

Use only while generation work is actively underway.

Requirements:

- `generated: false`;
- `generationBatchId` present;
- `generationStartedAt` present.

Do not leave records permanently in this state after the batch is complete or abandoned.

### 5.3 `generated`

Use when:

- the final original/published asset pair has been committed where required;
- the asset at `image.key` exists;
- the image is suitable for normal use;
- `generated: true`.

### 5.4 `approved`

Use when the generated image has received explicit acceptance as the final canonical artwork.

Requirements:

- `generated: true`;
- the published asset exists.

Do not automatically promote every generated image to approved.

### 5.5 `needs-regeneration`

Use when an existing or attempted image should be replaced.

If an older published image remains present and intentionally usable until replacement, `generated` may remain `true`.

If the bad asset has been removed, `generated` must reflect that reality.

The replacement generation should preserve the stable entity ID and canonical path unless a deliberate schema/path migration is being made.

## 6. Canonical storage pattern

Canonical bespoke art lives under:

```text
assets/art/universe/
```

Normal catalogue pattern:

```text
assets/art/universe/<category>/<entity-id>.webp
assets/art/universe/<category>/Originals/<entity-id>.png
```

Examples:

### Mobile resource

```text
assets/art/universe/resources/mobile-resource-gold.webp
assets/art/universe/resources/Originals/mobile-resource-gold.png
```

### Substance

```text
assets/art/universe/substances/substance-stone-aggregate.webp
assets/art/universe/substances/Originals/substance-stone-aggregate.png
```

### Building

```text
assets/art/universe/buildings/building-deep-mine.webp
assets/art/universe/buildings/Originals/building-deep-mine.png
```

### Ship class

```text
assets/art/universe/ship-classes/ship-class-atlas-bulk-lifter.webp
assets/art/universe/ship-classes/Originals/ship-class-atlas-bulk-lifter.png
```

World-specific landscape tiles are a special case and live beneath the owning planet:

```text
assets/art/universe/planets/<planet-id>/landscape/
assets/art/universe/planets/<planet-id>/landscape/Originals/
```

## 7. End-to-end generation procedure

Follow these steps in order.

### Step 1 — Read repository instructions

Before editing or generating anything, read:

- `AGENTS.md`;
- this document;
- the category-specific source/integration document where one exists.

### Step 2 — Select a bounded queue

Choose one coherent generation batch.

Use canonical records, not filesystem guesses.

For each target record verify:

- stable ID;
- display name;
- description;
- visual description/context where present;
- `image.key`;
- `image.status`;
- `image.generated`;
- `image.promptDescription`;
- `image.notes`.

Do not regenerate records already marked `approved` unless explicitly instructed.

### Step 3 — Mark a long-running batch in progress when appropriate

For generation workflows that persist state across multiple operations, set:

- `status: "in-progress"`;
- `generated: false`;
- a stable `generationBatchId`;
- `generationStartedAt`.

If generation and commit happen atomically in one short operation, this intermediate state may be unnecessary.

### Step 4 — Gather only relevant canon context

Use linked structured records where they materially affect appearance.

Examples:

- organisation visual identity;
- ship class role/manufacturer;
- substance archetype/form;
- Mobile resource parent substance and physical occurrence;
- world/biome data for landscape art.

Do not pull mutable gameplay values into canonical art.

### Step 5 — Build the generation prompt

Use `image.promptDescription` as the core prompt.

Where applicable, combine it with:

- `visualDescription`;
- style locks;
- linked organisation identity;
- explicit category composition requirements.

Do not introduce:

- new lore;
- unapproved readable text;
- random logos;
- registration numbers;
- save-specific values;
- UI elements unless the entity type explicitly requires them.

### Step 6 — Generate at the intended aspect ratio

Respect category requirements.

Examples:

- Mobile resources and material/substance catalogue art: 1:1;
- star-system vistas: 16:9;
- world landscape tiles: 1:1;
- other entity categories: follow their record/category guidance.

Generate at native useful resolution.

Do not upscale a low-quality result simply to manufacture a larger original.

### Step 7 — Review the generated image against the prompt

Before committing it, verify:

- correct subject;
- no accidental text or watermark;
- no incorrect logos/branding;
- no lore contradictions;
- correct aspect ratio;
- correct category composition;
- clear readability at Directory/game size;
- no save-specific information encoded into canonical identity art.

If it fails, regenerate rather than committing a known-bad asset as final.

### Step 8 — Save the lossless original

Store the accepted native lossless image at the category's `Originals/` path.

Default format:

- PNG.

Do not replace the original with a WebP converted back to PNG.

The original should represent the best retained source image from the generation output.

### Step 9 — Create the published WebP

Create the WebP at exactly `image.key`.

Unless category-specific rules say otherwise:

- preserve the original pixel dimensions;
- avoid unnecessary crop changes;
- use visually high-quality WebP compression;
- ensure the published image still matches the original composition.

### Step 10 — Update metadata only after assets exist

After both assets are ready and committed in the same change set, update the entity record:

```json
"generated": true,
"status": "generated"
```

Keep:

- `key`;
- `promptDescription`;
- `notes`

unless there is a deliberate reason to update them.

Do not remove the prompt after generation; it is part of the provenance/reproduction record.

### Step 11 — Run repository validation

Run the repository's normal validation and syntax checks.

Image work must not bypass validation.

Validation should catch, among other things:

- invalid status values;
- inconsistent `generated` state;
- missing published assets for generated records;
- invalid canonical paths;
- malformed JSON;
- broken references;
- JavaScript syntax regressions caused by related UI changes.

### Step 12 — Verify the Directory

Where the entity is visible in the Directory, confirm:

- the WebP renders;
- the correct entity uses the correct image;
- the lightbox/original behavior works where supported;
- image-generation metadata remains visible/consistent;
- no broken placeholder remains for a generated asset.

### Step 13 — Commit assets and metadata together

A completed image batch should commit:

- original PNGs;
- published WebPs;
- image-state metadata changes;
- any directly required validation/doc changes.

Do not commit metadata claiming completion in one commit and add the actual assets much later.

## 8. Category-specific rules

### 8.1 MineIT Mobile resources

Primary queue:

`data/mobile-resource-definitions.json`

Supporting physical context:

- `data/mobile-resource-occurrence-profiles.json`
- `docs/MobileResourceOccurrenceIntegration.md`

Output:

```text
assets/art/universe/resources/<resource-id>.webp
assets/art/universe/resources/Originals/<resource-id>.png
```

Rules:

- 1:1 square resource icon;
- match the established MineIT Android resource-art language rather than photorealistic material photography;
- use one centred, isolated, instantly recognisable resource symbol/specimen;
- use polished semi-realistic 3D/digital game art with simplified sculpted/faceted forms and a strong silhouette;
- subject should occupy roughly 65–75% of the frame;
- use a dark navy-to-black radial vignette with a soft electric-blue/cyan halo behind the subject;
- use cool rim lighting, crisp highlights and a restrained luminous edge;
- design for clear recognition at 128×128;
- do not show a geological scene, embedded rock face, landscape, tray, crate, room, machinery or people;
- no readable labels, UI, logos or decorative border;
- do not encode a particular save's quality, reserve, rarity or price;
- gems should read as iconic raw/faceted resource symbols rather than jewellery or gems embedded in host rock;
- ores/minerals should use a compact representative chunk/crystal/resource form rather than a full rock face;
- gases, liquids and diffuse resources should be translated into a compact iconic visual form without placing them in a bottle or container.

When an existing approved MineIT Android resource image already matches this style, prefer **migrating that existing source art into Universe** over regenerating it. Preserve the Android source image as migration provenance, move the canonical source of truth to Universe, and let Android consume a derived/bundled copy thereafter.

The current 42 natural non-Food resources are prepared in `data/mobile-resource-definitions.json`. The seven biological/Food identities are prepared in `data/mobile-biological-resources.json` and use the same MineIT Mobile resource-icon visual language.

### 8.2 Substances

Primary queue:

`data/substances.json`

Typical output:

```text
assets/art/universe/substances/<substance-id>.webp
assets/art/universe/substances/Originals/<substance-id>.png
```

Prefer full-bleed material identity rather than product photography.

Avoid containers, tables and laboratory still-life unless specifically required.

### 8.3 Parts, machines and buildings

Primary queues:

- `data/parts.json`
- `data/machines.json`
- `data/buildings.json`

Artwork should read clearly as catalogue/reference art.

For MineIT Mobile buildings:

- use one canonical identity/catalogue image per building type;
- additionally materialise one game-facing presentation image for each building level L1-L5 in `data/building-mobile-level-images.json`;
- treat these five images as a narrow MineIT Mobile exception: they are linked visual progression states, not separate canonical building identities;
- prefer a 1:1 composition that also reads cleanly on a small Mobile tile;
- use the established MineIT Mobile isometric building language: transparent background, elevated three-quarter view, clean white shells, charcoal structure, orange trim, restrained blue emissive details and warm windows;
- keep the complete structure visually dominant;
- no readable logos, company names, registration markings or UI;
- the canonical identity image must not encode a numbered level; the linked Mobile level-image collection intentionally depicts authored L1-L5 structural complexity;
- do not encode staffing, damage, power state, output or other mutable save state into either identity or level art;
- level images must evolve coherently from a compact L1 starter installation to a flagship L5 complex while preserving the same building identity and function.

Storage:

```text
assets/art/universe/buildings/<building-id>.webp
assets/art/universe/buildings/Originals/<building-id>.png
assets/art/universe/buildings/mobile-levels/<building-id>-l<level>.webp
assets/art/universe/buildings/mobile-levels/Originals/<building-id>-l<level>.png
```

Keep the target entity visually dominant and avoid unnecessary environmental clutter.

### 8.4 Ship classes

Factory/reference art belongs under `ship-classes/`.

The image should communicate the class design clearly and remain separate from any named ship's unique livery/configuration.

### 8.5 Named ships

Named ships are separate entities under `ships/`.

They may carry identity-specific livery or configuration.

Do not silently substitute a class image for bespoke named-ship art when the record expects a named-ship asset.

### 8.6 People

People may use bespoke canonical portraits or approved reusable identity-neutral portrait assets.

Reusable portraits must not contain baked-in identity information.

### 8.7 Organisations

Organisation art may communicate in-universe corporate/organisational identity, but avoid random readable text, real-world trademarks and accidental watermarks.

### 8.8 Star systems

Star-system vistas are identity-bearing 16:9 canonical art keyed to the system ID.

They are not map UI screenshots.

### 8.9 World landscape tiles and generated-world fallback

**Authored named-world landscape tiles** are world-specific Mobile assets.

Keep them under the owning planet path and follow the relevant world-surface/tile rules.

For procedurally generated worlds that do not have bespoke authored art, MineIT Mobile uses the identity-neutral series `visual-series-mobile-generated-landscape` and the queue in:

`data/visual-assets-mobile-landscape.json`

Those reusable tiles live under:

`assets/art/visual-library/landscape/mobile/`

Rules for the generated-world library:

- 1:1 full-bleed straight-down orthographic/nadir landscape tiles;
- one complete 12-landform x 10-biome matrix plus visible surface-water families;
- camera about 500 m altitude;
- sun upper-left, shadows lower-right;
- terrain continues naturally off all four edges;
- macro landform remains readable beneath biome cover;
- no world-specific identity, UI, text, buildings, roads, people, vehicles or resource markers;
- designed to remain distinct at 128x128 on the Mobile 8x8 grid;
- never copy/relabel Koplin-specific tiles as generic assets;
- hydrosphere-none and subsurface aquifers do not require standalone visible water tiles.

## 9. Reusable visual-library rule

Reusable identity-neutral assets belong under:

```text
assets/art/visual-library/
```

They must avoid baked-in identity data such as:

- personal names;
- organisation/company names;
- readable logos;
- ship registrations;
- star-system names;
- universe-specific labels.

A reusable asset may depict different identities in different materialised universes.

Do not confuse reusable visual-library art with bespoke canonical entity art.

## 10. Codex execution rules

When Codex is asked to generate a batch, the task should point it to:

1. `AGENTS.md`;
2. `docs/ImageGenerationProcess.md`;
3. the target queue file.

For the current Mobile resource batch, that means:

```text
AGENTS.md
docs/ImageGenerationProcess.md
data/mobile-resource-definitions.json
```

with optional physical context from:

```text
data/mobile-resource-occurrence-profiles.json
docs/MobileResourceOccurrenceIntegration.md
```

Codex must:

- process only the intended queue/batch;
- use the authored image metadata;
- generate the original PNG and WebP;
- keep filenames/paths exactly aligned with stable IDs;
- update image state only after the files exist;
- run validation;
- commit assets and state together.

If the environment does not actually provide image-generation capability, Codex must not fabricate images or mark records as generated.

## 11. Batch sizing and checkpoints

Large queues should be processed in sensible batches.

A good checkpoint is a coherent set whose:

- images are all present;
- metadata is all updated;
- validation is green.

Do not leave dozens of records marked `in-progress` merely because the overall catalogue is large.

For very large batches, multiple validated commits are preferable to one fragile all-or-nothing change.

## 12. Regeneration process

When replacing an existing image:

1. set/confirm `status: "needs-regeneration"`;
2. retain the stable entity ID and normal canonical path;
3. review the existing prompt and why the image failed;
4. improve the prompt only where required;
5. generate a replacement;
6. replace both original PNG and WebP;
7. set `generated: true`;
8. set status to `generated` or `approved` as appropriate;
9. validate and review in the Directory.

Do not accumulate `-v2`, `-new` or alternate production image paths for the same canonical identity.

Git history preserves the replaced asset.

## 13. Validation checklist before push/merge

Before a batch is considered complete:

- [ ] correct canonical records were used as the queue;
- [ ] stable IDs were preserved;
- [ ] every generated entity has the required PNG original where applicable;
- [ ] every generated entity has a WebP at `image.key`;
- [ ] aspect ratio matches category rules;
- [ ] no accidental text, watermark or unrelated branding exists;
- [ ] metadata matches actual file state;
- [ ] no generated record points at a missing asset;
- [ ] prompts remain stored after generation;
- [ ] validation passes;
- [ ] Directory rendering is correct where applicable;
- [ ] no unrelated canon was changed accidentally.

## 14. Current Mobile resource batch

The current Mobile resource image queue is:

`data/mobile-resource-definitions.json`

It contains 42 natural non-Food resource identities:

- 7 Build;
- 9 Fuel;
- 26 Ore.

Each current resource record contains:

- stable resource ID;
- display name;
- Mobile key;
- canonical description;
- visual description;
- parent substance;
- provenance;
- target WebP path;
- original PNG path guidance;
- generation prompt;
- generation status.

The expected output root is:

```text
assets/art/universe/resources/
assets/art/universe/resources/Originals/
```

The generator should process records whose image state requires generation and leave Mobile-owned balance data such as rarity, price, scan requirement, quality and per-save reserve out of the canonical artwork.
