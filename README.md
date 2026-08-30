# MineIT Universe

Canonical shared universe content and browser for the MineIT family of games and tools.

This repository is the authoritative owner of persistent universe entities such as star systems, planets, settlements, companies, organisation units, facilities, operations, people and named ships.

## Principles

- One canonical authored source of truth lives in this repository.
- Games consume universe content by stable IDs; they do not author duplicate copies.
- The Universe Directory is a consumer of the same canonical JSON, not the owner of a second dataset.
- Mutable per-save gameplay state remains inside each game and is not written into canonical universe JSON.
- Persistent IDs must remain stable even when names, descriptions, roles or artwork evolve.

## Published data

When GitHub Pages is enabled for `main`, consumers should begin with:

`data/manifest.json`

The manifest identifies the content/schema version and all collection files. MineIT Mobile and future applications should resolve universe entities from those published JSON collections.

## Repository layout

```text
data/                 Canonical universe JSON
assets/art/universe/  Canonical universe artwork
js/                   Universe Directory application code
css/                  Universe Directory styles
prototypes/           Disposable/reference prototypes only
docs/                 Architecture and integration plans
index.html             GitHub Pages Universe Directory entry point
```

See `AGENTS.md` before making architectural or content changes.
