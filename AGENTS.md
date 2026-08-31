# MineIT Universe Repository Rules

Read this file before implementing code or changing canonical universe content.

## Canonical ownership

`data/` in this repository is the single authored source of truth for persistent MineIT universe content.

Do not create independently authored copies of organisations, people, locations, ships, operations, projects, events or other canonical entities inside MineIT Mobile, future games, prototypes or the Directory application.

Consumers may cache or generate build artefacts from canonical data, but those copies are derived output and must never become authoritative.

## Canon source precedence

Long-form source lore under `data/lore/` is canonical authored content, not documentation-only commentary.

Current precedence:

1. `data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md` — foundation civilisation/history canon.
2. `data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md` — Year-5326 scenario extension.
3. Structured JSON under `data/` — searchable/game-consumable representation.

Structured records must agree with higher-precedence lore. Never invent a conflicting structured fact merely because an older generated sample already contains it.

Designer-only truth may live in canonical lore when explicitly labelled as such.

## Stable identity

Every persistent entity uses a stable ID. Display names, roles, descriptions, artwork and relationships may evolve without changing the ID.

Never use display names as foreign keys. Breaking deletion or renaming of an existing stable ID requires an explicit migration decision.

## Canonical vs mutable state

Canonical data contains persistent universe facts and authored structural demand.

Do not store mutable per-save gameplay values here, including player-specific contract prices, generated quantities, buyer happiness, player reputation, cooldowns, active collection state, frontier deposits or player-created colonies.

Manufacturer list prices and other authored product facts may be canonical when explicitly modelled as published universe facts; player-specific quotes and market circumstances remain game state.

## Graph relationships

The universe is a graph. Store relationships as stable IDs and derive Geography, Organisation and Directory views from the same records.

Avoid duplicating the same entity data inside nested parent records merely to make a tree easier to render.

## Organisation model

Schema v2+ uses `organisations.json` as the generic top-level organisation collection.

Commercial companies, governments, authorities, universities, research bodies, banks, media organisations, hospitals, guilds and military/security bodies all use this model.

AI may not be modelled as sovereign in conflict with the foundation lore.

Do not reintroduce a parallel canonical `companies` dataset.

## Image state

Any entity with an `image` object must explicitly record `image.generated`, `image.status`, canonical asset `key`, and generation prompt information where applicable.

Allowed statuses are `not-generated`, `generated`, `approved`, and `needs-regeneration`.

`not-generated` requires `generated: false`. `generated` and `approved` require `generated: true`.

People and named ships are current primary image-bearing types. Purchasable ship classes may also carry image metadata and prompts.

## Directory and Lore applications

The production Universe Directory must load `data/manifest.json` and the collections it declares. It must not contain a shadow embedded production dataset.

The Lore Explorer must load lore-document metadata and canonical Markdown from `data/`; it must not embed duplicate lore prose in JavaScript.

`prototypes/` may contain embedded sample data only when clearly marked as non-canonical design references.

## Architecture

- `data/` — canonical authored universe records.
- `data/lore/` — canonical long-form lore sources.
- `assets/art/universe/` — canonical universe art keyed by entity ID.
- `js/` and `css/` — read-only browsing/indexing applications.
- `docs/` — architecture, schema and canon-governance decisions.
- each game repository — mutable gameplay state and game-specific behaviour.

## Mobile-first UI

The Directory and Lore Explorer must remain usable on a portrait phone.

## Validation

Any behaviour, schema or canon-generation change must preserve or extend validation for unique IDs, cross-references, manifest collections, organisation/world hierarchy, image state, asset paths, resource requirements, lore source paths and lore-topic source references.

Broken references must be visible as errors rather than silently ignored.

## Authoring

AI may author canonical data directly under the approved Canon Design Specification, but source-derived canon must preserve the terminology and constraints of the lore sources.

Manual review is not a required publication gate. Automated validation is mandatory.

Generated content must be internally coherent and linked; do not generate large volumes of isolated filler rows merely to hit numeric targets.

## Changes

Prefer one canonical implementation over parallel/versioned production alternatives. Refactor the current implementation rather than adding `v2`, `new`, `alternate`, or duplicate production paths.

Keep documentation updated when architecture, schema, publishing, image-state, lore precedence or consumer integration decisions change.
