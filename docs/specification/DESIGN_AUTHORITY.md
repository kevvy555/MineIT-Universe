# MineIT Design Authority and Ownership

**Spec-ID:** UNI-GOV-001 · **Owner:** MineIT-Universe · **Status:** agreed documentation governance (14 Oct 2026) · **Implementation:** documentation only.

## Authority layers

| Layer | Lives where | Answers | Cannot unilaterally redefine |
| --- | --- | --- | --- |
| Canonical lore and authored universe data | `MineIT-Universe/data/lore/`, `data/*.json`, [canon source hierarchy](../CanonSourceHierarchy.md) | Who/what/where exists, physical substance identity, universe technology, authored entity relationships | A given player's mutable game state or balancing |
| Shared game design | `MineIT-Universe/docs/specification/` | Common economic and physical mechanics, asset lifecycle, platform-neutral design vocabulary | Lore hierarchy, Desktop/Mobile exact pacing, UI and runtime |
| Desktop gameplay spec | `MineIT-Desktop/Documentation/specification/` | Stranded expedition survival, individual Parts/Machines, 3D interactions and Desktop progression | Universe identities or Mobile mechanics |
| Mobile gameplay spec | `MineIT-Android/docs/specification/` | Contract-led corporation, aggregated equipment stock, colony/fleet operations, mobile UX and pacing | Universe identities or Desktop mechanics |
| Implementation architecture / ADR | Repository of executing game | Code boundaries, data pipelines, save compatibility, persistence, tests | Approved gameplay intent |
| Validated production implementation | Actual code/CI/releases | What is currently runnable | Established fictional facts or unimplemented design commitments |

## Exact canon source hierarchy (UNI-SRC-005 reviewed in full)

The controlling [original Canon Source Hierarchy](../CanonSourceHierarchy.md) is **authoritative repository policy**. Its ordered precedence is not interchangeable with the generic documentation layers table above:

1. **Foundation civilisation and narrative:** [Expanded Backstory Lore Bible](../../data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md) — history, three peoples, reconciliation, AI Wars, Commonwealth Compact, Veyrite, Vector Exchange, expedition and designer-known Anchor Network.
2. **Foundation materials companion:** [Materials and Substances](../../data/lore/Koplin_Universe_Materials_And_Substances.md) — raw/refined material identity, rarity, thermal rules, industrial families and designer properties; it must not contradict the civilisation bible.
3. **Foundation world/surface companion:** [World Surface](../../data/lore/Koplin_Universe_World_Surface.md) — celestial bodies, atmospheres, landform/biome/hydrosphere, geology/find-site vocabularies; Desktop generation is **provenance**, not a second authored canon.
4. **Scenario extension:** [Deep Reach Mining Charter](../../data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md) — **Year 5326** charter corporation, one-year support, first ten-year sales, credit-based trading, freight and frontier geography. It **cannot** contradict the foundation without explicit canon revision.
5. **Structured records:** authored `data/*.json` are queryable *implementations* of the above lore; **when JSON conflicts with lore, lore wins** and the affected record requires reconciliation, never speculative parallel invention.
6. **Game state:** actual player quotes, queues, colonies, ownership, reputation and fulfilment are mutable platform/save facts, not canon edits.

The civilisation baseline is **Year 5300**, the shared manifest's commercial scenario present **Year 5326**. Do not conflate baseline history with campaign present, or infer that story timeline advances when a player's colony advances.

**Knowledge/visibility is distinct from truth:** the developer Lore Explorer can expose designer truth (including the Anchor Network), but citizen/player-facing discovery must obey its own gate. Use an explicit `knowledgeScope: designer truth` for records not meant to be known to an in-universe citizen. No omniscient Directory access should automatically unlock undiscovered deposits or secrets in Mobile/Desktop.

**Historical invalid records:** the schema-v2 ten-system sample predates imported foundation lore. Unsupported intelligent aliens, sovereign AI institutions, an old Year-2389 date and placeholder charter corporation are **provisional conflicts**, not protected canon. Reconcile them only through real lore/data edits with approval; this docs PR does **not** modify them.

**Source coverage:** [UNI-SRC-005](source-register/UNIVERSE_SOURCES.md) was reviewed as an entire 64-line governance document and the obligations above captured. The four foundation lore files themselves still need full rule-by-rule review; linking them does **not** mark those sources migrated.

## Decision scope

- **Shared cross-game change:** record one approved decision in Universe specification and link affected platform chapters. If physical canon is affected, reconcile lore/data via canon's own process first.
- **Platform-only change:** record in that game's specification and link upstream concept. A Mobile grouped Parts item is a view of shared physical components, not a parallel canonical material.
- **Conflicting sources:** do not pick the most recent date or strongest heading blindly. Record claims, dates, owner, issue, existing runtime, and affected canon. Resolve with user/product approval.
- **Status:** distinguish `CANON`, `APPROVED DESIGN`, `PROPOSED`, `OPEN`, `IMPLEMENTED`, `LEGACY` and `SUPERSEDED` at rule level. A file may have mixed sections.
- **Evidence:** a feature-checkpoint or historical plan does not prove actual runtime code. A proposed simulation is not a shipped mechanic.

## Publishing

Universe `data/` stays the authoritative authored and shipped dataset; published code consumers use pinned snapshots. Shared spec documentation is **not** a replacement runtime catalogue. Use stable published links after feature branches merge.

## Stage programme

[Documentation consolidation tracking #19](https://github.com/kevvy555/MineIT-Universe/issues/19), [Industrial product decisions #114](https://github.com/kevvy555/MineIT-Android/issues/114). Earlier documents remain in place. New chapters must cite source references and list outstanding decisions before any source is classified 'reconciled'.
