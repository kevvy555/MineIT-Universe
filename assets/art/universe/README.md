# MineIT Universe Art

Canonical universe artwork belongs under this tree and is keyed by stable entity ID.

Expected categories:

```text
people/
ships/
ship-classes/
companies/logos/
systems/
planets/
settlements/
facilities/
```

The JSON record owns the canonical asset path. Missing artwork is valid; the Universe Directory shows a placeholder and exposes the authored image prompt until an approved asset exists.

Purchasable ship classes should use factory/reference artwork under `ship-classes/`. Named ships remain separate entities under `ships/` and may have their own livery or configuration artwork.

Do not maintain independently named copies of the same canonical asset inside consuming game repositories unless they are generated/cache artefacts tied back to the canonical entity ID.
