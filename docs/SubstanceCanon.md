# Substance Canon — Consumer Architecture

Status: **Working architecture note**  
Related feature: `docs/SubstanceCanonFeatureSpec.md`  
Canonical lore: `data/lore/Koplin_Universe_Materials_And_Substances.md`  
Structured collection: `data/substances.json`

## Ownership

MineIT Universe owns the authored materials language for the MineIT family of games.

Desktop substance design under `MineIT/Documentation/design/Generation/SubstanceGeneration/` is **engineering provenance**. Once reconciled into Universe lore and structured data, Universe is authoritative. Games must not maintain a conflicting authored catalogue.

## Publication path

```text
data/lore/Koplin_Universe_Materials_And_Substances.md
        ↓ registered by
data/lore-documents.json
        ↓ rendered by
lore.html  (long-form materials chapter)

data/substances.json  (75 P0/P1 industrial categories)
        ↓ registered by
data/manifest.json → collections.substances
        ↓ rendered by
index.html / js/universe-app.js  (Directory browse)
        ↓ loadable by
any consumer via loadUniverse() / manifest fetch
```

Quick-reference topics live in `data/lore-topics.json` and point at source sections in the materials document.

## Record shape (Directory / game-consumable)

Stable fields on each substance:

- `id` — e.g. `substance-reactive-metal-ore`
- `name`, `description`
- `substanceType`, `thermalBehaviour`, `standardState`
- `dominantArchetype`, `form`, `refined`, `tier`
- `industrialRole`
- `sourceDocumentId`, `sourceSection`, `canonStatus`

No mutable prices, reserves, contract terms or quality rolls.

## Precedence

1. Expanded Backstory & Lore Bible — civilisation/history.
2. Materials of the Commonwealth — foundation industrial substances companion.
3. Deep Reach Mining Charter — Year-5326 scenario extension.
4. Structured JSON under `data/` (including `substances`) — must agree with lore.
5. Game/save state — prices, stock, contracts, quality rolls.

## Follow-ons

- Commercial `resourceRequirements` should migrate to `substanceId` references.
- MineIT Mobile may project a subset into inventory categories; it must not re-author conflicting IDs.
- Named procedural deposit instances remain Desktop runtime until materialised into Universe.

## Out of scope here

- MineIT Mobile inventory conversion
- Desktop survey micro-generation inside Universe
- Mutable market/gameplay values on substance records
