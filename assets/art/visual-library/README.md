# Reusable Visual Library

This directory is for identity-neutral artwork that may be reused across different materialised MineIT universes.

Reusable assets are not themselves the canonical identity of the person, ship, company or place currently using them.

## Rules

- Do not bake personal names into reusable artwork.
- Do not bake company names or readable logos into reusable artwork.
- Do not bake ship registration numbers, system names or universe-specific text into reusable artwork.
- Keep stable visual-asset IDs and key patterns separate from mutable entity names.
- Image generation state remains explicit; an asset must not be marked generated until the corresponding binary file exists.

The first declared series is `visual-series-commercial-portraits`, using keys such as `people/portrait-0001.webp` and stable visual identities such as `visual-person-portrait-0001`.


## MineIT Mobile generated-world landscapes

`visual-series-mobile-generated-landscape` is the reusable identity-neutral fallback library for procedurally generated Mobile worlds that do not have a bespoke authored planet tileset.

Queue:

`data/visual-assets-mobile-landscape.json`

Assets:

`assets/art/visual-library/landscape/mobile/`

This library is deliberately separate from authored world-specific sets such as Koplin 3. A generated world may use the reusable library without pretending that Koplin-specific terrain belongs to that world.

## MineIT Desktop-derived 3D terrain materials

`visual-series-desktop-terrain-materials` is the reusable identity-neutral close-up material library for world-aligned 3D terrain rendering.

Catalogue:

`data/terrain-materials.json`

Assets:

`assets/art/visual-library/terrain/materials/`

The ten materials were curated from the high-resolution MineIT Desktop `Ground.zip` source library. Published WebPs are 1024x1024 Android assets; the matching lossless, edge-matched PNGs are retained under `Originals/`. They are presentation-only and never author terrain height, geology, biome identity or save data.
