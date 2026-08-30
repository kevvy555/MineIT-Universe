# MineIT Universe Repository Rules

Read this file before implementing code or changing canonical universe content.

## Canonical ownership

`data/` in this repository is the single authored source of truth for persistent MineIT universe content.

Do not create independently authored copies of companies, people, locations, ships, operations or other canonical entities inside MineIT Mobile, future games, prototypes or the Directory application.

Consumers may cache or generate build artefacts from canonical JSON, but those copies are derived output and must never become authoritative.

## Stable identity

Every persistent entity uses a stable ID. Display names, roles, descriptions, artwork and relationships may evolve without changing the ID.

Never use display names as foreign keys.

Breaking deletion or renaming of an existing stable ID requires an explicit migration decision.

## Canonical vs mutable state

Canonical JSON contains persistent universe facts and authored structural demand.

Do not store mutable per-save gameplay values here, including contract prices, generated quantities, buyer happiness, player reputation, cooldowns, active collection state, frontier deposits or player-created colonies.

## Graph relationships

The universe is a graph. Store relationships as stable IDs and derive Geography, Organisation and Directory views from the same records.

Avoid duplicating the same entity data inside nested parent records merely to make a tree easier to render.

## Directory application

The production Universe Directory must load `data/manifest.json` and the collections it declares. It must not contain a shadow embedded production dataset.

`prototypes/` may contain embedded sample data only when clearly marked as non-canonical design references.

## Architecture

Keep responsibilities separated:

- `data/` — canonical authored universe records.
- `assets/art/universe/` — canonical universe art keyed by entity ID.
- `js/` and `css/` — Directory application presentation and read-only indexing/navigation.
- `docs/` — architecture, schema and integration decisions.
- each game repository — mutable gameplay state and game-specific behaviour.

## Mobile-first UI

The Directory must remain usable on a portrait phone. The approved primary layout is vertically split: selected entity detail above and a permanently visible, independently scrollable explorer tree below, separated by a touch-friendly draggable divider.

## Validation

Any behaviour or schema change must preserve or extend validation for:

- unique IDs;
- valid cross-references;
- valid manifest collections;
- valid asset paths;
- valid resource references where applicable.

Broken references must be visible as errors rather than silently ignored.

## Changes

Prefer one canonical implementation over parallel/versioned production alternatives. Refactor the current implementation rather than adding `v2`, `new`, `alternate`, or duplicate production paths.

Keep documentation updated when architecture, schema, publishing or consumer integration decisions change.
