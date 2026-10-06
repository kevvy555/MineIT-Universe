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
