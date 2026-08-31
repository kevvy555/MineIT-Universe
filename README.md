# MineIT Universe

Canonical shared universe content, lore and browser for the MineIT family of games and tools.

This repository is the authoritative owner of persistent universe entities **and the full canonical lore sources that define them**.

## Current canon release

Content version: **0.4.0**  
Schema version: **4**  
Civilisation baseline: **Year 5300**  
Current commercial/scenario era: **Year 5326**

The canonical foundation is the **Koplin Universe — Expanded Backstory & Lore Bible**, with **Scenario II: The Deep Reach Mining Charter** as a later Year-5326 scenario extension.

Release 0.4.0 adds the first full factory-new ship market: five canonical commercial shipbuilders, ten ship lines, flagship shipyards, production/resource demand and 30 purchasable Year-5326 ship classes with Commonwealth Credit list prices, game-consumable specifications and stored factory-image prompts.

The source-canonical Pathfinder-class and Prospector-class remain reference classes outside the retail catalogue because their source lore does not establish a manufacturer.

## Canon precedence

1. `data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md` — foundation civilisation/history canon.
2. `data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md` — Year-5326 Deep Reach scenario canon.
3. Structured records under `data/` — searchable/game-consumable representation that must agree with the lore sources.
4. Game save state — mutable gameplay state, never canonical universe truth.

If a structured record conflicts with a higher-precedence lore source, the lore source wins and the structured record must be reconciled.

Generated expansion material that does not conflict with the source bibles may remain, but it is explicitly labelled separately from source-derived canon.

## Browse

- `index.html` — entity Directory: Geography / Organisation / Directory.
- `ship-catalogue.html` — factory-new Year-5326 ship catalogue grouped by manufacturer and ship line.
- `lore.html` — full canonical lore explorer with source switching, quick-reference topics and section navigation.

## Principles

- One canonical authored source of truth lives in `data/`.
- Games consume universe content by stable IDs; they do not author duplicate copies.
- The Universe Directory, Ship Catalogue and Lore Explorer are read-only consumers.
- Mutable per-save gameplay state remains inside each game.
- Persistent IDs remain stable even when names, roles, descriptions or artwork evolve.
- Manufacturer list prices may be canonical product facts; player-specific quotes remain game state.
- Every image-bearing entity records whether its artwork has actually been generated.
- Lore documents may include designer-only truth; it must be clearly labelled rather than silently mixed with in-universe public knowledge.

## Published data

Consumers should begin with `data/manifest.json`.

The manifest identifies schema/content version, canonical era and collection files.

## Repository layout

```text
data/                 Canonical structured universe records
data/lore/            Full canonical lore source documents
assets/art/universe/  Canonical universe artwork
js/                   Read-only browser application code
css/                  Browser application styles
prototypes/           Non-canonical design references only
docs/                 Canon architecture and integration specifications
validation/           Canon validation
index.html            GitHub Pages Universe Directory
ship-catalogue.html   GitHub Pages factory-new ship catalogue
lore.html             GitHub Pages full-lore explorer
```

Key documents:

- `docs/MineitUniverseCanonDesign.md`
- `docs/CanonSourceHierarchy.md`
- `docs/ShipbuildingSectorAndPurchaseCatalogue.md`

See `AGENTS.md` before making architectural or content changes.
