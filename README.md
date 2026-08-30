# MineIT Universe

Canonical shared universe content and browser for the MineIT family of games and tools.

This repository is the authoritative owner of persistent universe entities. Schema v2 includes regions, systems, planets/moons, settlements, organisations, organisation units, facilities, operations, products, species, people, ship classes, named ships, projects, historical events and person relationships.

## Current canon release

Content version: **0.2.0**  
Schema version: **2**  
Initial authored region: **Koplin Reach**

The first full release contains a linked ten-system region intended to prove the real canonical model at useful scale.

## Principles

- One canonical authored source of truth lives in `data/`.
- Games consume universe content by stable IDs; they do not author duplicate copies.
- The Universe Directory is a consumer of the same canonical JSON.
- Mutable per-save gameplay state remains inside each game.
- Persistent IDs remain stable even when names, roles, descriptions or artwork evolve.
- Commercial companies, governments, universities, banks, hospitals, security forces, military bodies and AI polities all use the generic organisation model.
- Every image-bearing entity records whether its artwork has actually been generated.

## Published data

When GitHub Pages is enabled for `main`, consumers should begin with:

`data/manifest.json`

The manifest identifies the schema/content version, canonical universe date and collection files.

MineIT Mobile and future applications should resolve entities from those published JSON collections.

## Repository layout

```text
data/                 Canonical universe JSON
assets/art/universe/  Canonical universe artwork
js/                   Universe Directory application code
css/                  Universe Directory styles
prototypes/           Non-canonical design references only
docs/                 Canon, architecture and integration specifications
validation/           Canon validation
index.html            GitHub Pages Universe Directory entry point
```

Key design document:

`docs/MineitUniverseCanonDesign.md`

See `AGENTS.md` before making architectural or content changes.
