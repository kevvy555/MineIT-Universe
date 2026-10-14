# UNI-ASSET-004 — Canonical Artwork Generation, State and Publication Contract

**Source reviewed entirely:** [MineIT Universe Image Generation Process](../../ImageGenerationProcess.md), UNI-SRC-007, authoritative working process dated **6 October 2026**. **Scope:** Universe authored asset/prompt/queue management; does not make art generation a game-owned runtime service. Status: working process/documentation; actual generated files and validation not audited here. See [UNI-ASSET-003](03-mobile-art-identity-and-coverage.md) for the dated Mobile visual-completion queue and its unresolved count mismatch.

## Who owns canonical images

Artwork is tied to a **stable record ID** in Universe `data/*.json`; a change in display name does not imply a new asset. Structured `image` metadata owns canonical `key` path, `generated` boolean, `status`, `promptDescription` and `notes`. `AGENTS.md` and this working process take precedence over category-specific prose and visual references, with higher lore authority still governing in-universe facts.

**Source is the queue:** select records whose `image.status`/boolean requires work; do not scan missing filenames and invent work or permanently fake PNGs. A stable record can legitimately have a placeholder pending image; Directory can display the authored prompt.

## State machine and error handling

| State | Required semantics |
| --- | --- |
| `not-generated` | No final image; `generated:false`; can enter a bounded queue |
| `in-progress` | `generated:false`, non-empty `generationBatchId` and `generationStartedAt`; no abandoned permanent batches |
| `generated` | Published `image.key` actually exists; PNG original also exists where applicable; `generated:true` |
| `approved` | `generated:true`, published image exists and was separately accepted; never auto-promote |
| `needs-regeneration` | Record requires repair; `generated:true` allowed **only** when earlier image remains valid/published, otherwise false |

The prompt remains stored after generation to retain provenance. Image records can also include `styleLock`, `visualDescription` and relationship/context hints; none supersede the core prompt and lore. When replacing art preserve stable ID and canonical path unless explicit migration; replace PNG+WebP together and use Git history, not `-v2` file proliferation.

## Atomic batch workflow

1. Read root `AGENTS.md`, this source process and the relevant category's specific canon documentation.
2. Choose a bounded set of actual queue records; verify ID, title, visual context, `key/status/generated/promptDescription/notes`. Do not regenerate already approved records without instruction.
3. If long-lived, stamp `in-progress` with batch ID/time; an atomic short task may omit this transient state.
4. Gather only visually relevant linked canon (manufacturer/organisation, material form, body/world conditions), **not** per-save rarity, prices, reserves, demand or a UI tooltip.
5. Use authored prompt plus permitted style lock/visual identity, render at actual category aspect ratio/resolution; reject incorrect text/logos/watermarks, subject, aspect ratio or lore.
6. Preserve native **lossless PNG** under the appropriate `Originals/` folder, then high-quality **WebP** at **exactly** `image.key`, ideally same dimensions/composition. Never pass a WebP reconverted to PNG as an original.
7. Only after both files exist, set `generated:true`, `status:generated`. Retain original metadata and prompt.
8. Run Universe validation, JS syntax and cross-reference tests; verify Directory render, correct identity, lightbox, placeholder fallback and metadata. Commit originals, WebPs and metadata **together**. Never claim success when image-generation capability or filesystem validation is unavailable.

## Category-specific visual/asset contracts

- **Mobile natural resource/Food:** identity keyed WebP under `assets/art/universe/resources/` with PNG `Originals/`; **1:1**, centered isolated object occupying ~**65–75%**, polished semi-realistic Android-game art, navy/black radial vignette and cyan halo, crisp silhouette at 128 px. **No** geological landscape, containers, people, jewellery staging, legend, encoded quality/value/reserve or UI. Source-era 42 natural non-Food (7 Build, 9 Fuel, 26 Ore) and seven biological Food identities have separate canonical data queues; not live generated counters.
- **Substances:** stable category specimen, typically square/full bleed, not lab trays; parent ontology record need not have an image.
- **Parts, machines, buildings:** one distinct identity/catalogue image per authored entity; building catalogue image does **not** imply in-save level. Mobile's L1–L5 images under `data/building-mobile-level-images.json` are **linked level views**, not five independent buildings. White/charcoal/orange isometric modular language with a transparent background and progressively complex structures, no power/production/damage semantics.
- **Ship class versus named ship:** class factory-reference art belongs under `ship-classes/`, while named ship imagery under `ships/` can carry bespoke identification; do not silently replace expected named-ship imagery with class generic art.
- **People:** may use an approved reusable portrait or bespoke identity portrait. **Organisations** can have intentional canon branding but not accidental real-world marks; reusable visuals must have no baked-in name/logo/registration.
- **Star-system vistas:** bespoke ID-keyed **16:9** images, not game-map screenshots.
- **Named-world landscape:** bespoke **1:1** tiles below `assets/art/universe/planets/<planet-id>/landscape/`; never relabel a Koplin-3 scene as generic. Procedural world's fallback `visual-series-mobile-generated-landscape` uses `data/visual-assets-mobile-landscape.json` under `assets/art/visual-library/landscape/mobile/`: straight-down orthographic ~**500 m**, sun upper-left, connected borders, 12×10 landform/biome classes plus visible liquid types, readable at 128 px, no buildings/roads/player markers. `hydrosphere-none` and subsurface aquifers do not require visible water images.

All authored art may need publisher-side original PNG and WebP; only a **record with an `image` object** is in the generator's task set. Consumers may cache/resize **derived copies** in games without gaining authorship of the original.

## Checkpoint and validation boundaries

For each batch check declared ID/key/format/aspect, original/png, WebP existence, boolean/status consistency, retained prompt, visual quality, links and Directory display, then commit. Do not leave `in-progress` records stranded. The same source describes regeneration and repo validation requirements; this documentation review **did not execute image generation or validate any actual asset**.

The older **6 October** art audit's conflicting 293/291/284 counters remain a separately tracked [reconciliation issue](../source-register/RECONCILIATION_MATRIX.md); publishing obligations depend on the current manifest and files, **not** historical counters. Original process is preserved.
