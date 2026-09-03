# Substance Canon — Consumer Architecture

Status: **Working architecture note**  
Related feature: `docs/SubstanceCanonFeatureSpec.md`  
Canonical lore: `data/lore/Koplin_Universe_Materials_And_Substances.md`

## Ownership

MineIT Universe owns the authored materials language for the MineIT family of games.

Desktop substance design under `MineIT/Documentation/design/Generation/SubstanceGeneration/` is **engineering provenance**. Once reconciled into Universe lore (and later structured data), Universe is authoritative. Games must not maintain a conflicting authored catalogue.

## Publication path

```text
data/lore/Koplin_Universe_Materials_And_Substances.md
        ↓ registered by
data/lore-documents.json  (id: lore-koplin-materials-and-substances)
        ↓ discovered via
data/manifest.json → collections.loreDocuments
        ↓ rendered by
lore.html / js/lore-app.js  (Lore Explorer)
```

Quick-reference topics live in `data/lore-topics.json` and point at source sections in the materials document.

## Precedence

1. Expanded Backstory & Lore Bible — civilisation/history.
2. Materials of the Commonwealth — foundation industrial substances companion.
3. Deep Reach Mining Charter — Year-5326 scenario extension.
4. Structured JSON under `data/` — must agree with lore.
5. Game/save state — prices, stock, contracts, quality rolls.

## Structured follow-on

A future `substances` collection should publish stable IDs agreeing with the industrial categories in the materials chapter. Commercial `resourceRequirements` should migrate to those IDs. Until then, operations may still use legacy resource type/id strings, but new authored material identities must not contradict the lore chapter.

## Out of scope for v1 publication

- MineIT Mobile inventory conversion
- Desktop survey micro-generation inside Universe
- Mutable market/gameplay values on substance records
