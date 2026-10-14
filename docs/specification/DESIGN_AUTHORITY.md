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
