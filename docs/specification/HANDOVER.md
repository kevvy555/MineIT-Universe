# MineIT Three-Repository Documentation Programme — Cross-Chat Handover

**Checkpoint:** 14 October 2026 (Europe/London) · **Status:** IN PROGRESS, draft documentation PRs only · **Programme tracker:** [Universe #19](https://github.com/kevvy555/MineIT-Universe/issues/19) · **Industrial design decisions:** [Android #114](https://github.com/kevvy555/MineIT-Android/issues/114)

> **Start here in another chat.** Read this file, then check GitHub's *live* issue/PR/branch status. This is the durable project handover, not evidence that documentation consolidation or product design is completed. Continue work from the existing three documentation branches; don't recreate the structure from the conversation.

## 1. Why this programme exists and what the user explicitly approved

The original #114 Mobile Parts/Machinery discovery became a shared industrial-world vision, then revealed duplicated, fragmented and outdated design material distributed among MineIT-Universe, MineIT-Desktop and MineIT-Android.

**Approved goal:** create three **modular, linked specifications**:
1. **Universe** owns the cross-game overall design, *beneath and separate from* its **higher-authority canonical lore and authored `data/` entities**.
2. **Desktop** owns deep 3D crashed-expedition/survival gameplay, physical individual parts/machines, technology, world generation and Desktop-specific implementation.
3. **Mobile/Android** owns strategic multi-system mining corporation gameplay, aggregated equipment, colonies, charters, fleet, mobile UI, save and performance.

Each spec links to the other two. **Do not duplicate identical rules independently** across repositories; link to their owner. Preserve all previous docs in their current locations and add source/reconciliation registers. Never create hundreds of empty placeholder chapters; add actual chapters incrementally as old source material is reviewed. Distinguish **CANON, APPROVED DESIGN, PROPOSED, OPEN, IMPLEMENTED (verified), LEGACY and SUPERSEDED**; file-level approval is insufficient when a document mixes statuses. A code implementation claim requires direct code/test/release evidence, not historical design prose.

The user explicitly directed: **continue adding documentation changes to the same three draft PRs until the consolidation is completed**. Do not create replacement PRs, prematurely merge unfinished specifications, or start gameplay coding because the design specification discusses future systems.

## 2. Exact active branches and draft PRs (live GitHub verified at this checkpoint)

| Repository | Working branch | Target | Existing draft PR | At checkpoint |
| --- | --- | --- | --- | --- |
| `kevvy555/MineIT-Universe` | `docs/industrial-design-spec-114` | `main` | [#20](https://github.com/kevvy555/MineIT-Universe/pull/20) | Open draft, **38 commits ahead, 0 behind**, 33 changed Markdown files |
| `kevvy555/MineIT-Desktop` | `docs/industrial-design-spec-114` | `main` | [#1](https://github.com/kevvy555/MineIT-Desktop/pull/1) | Open draft, **60 commits ahead, 0 behind**, 39 changed Markdown files |
| `kevvy555/MineIT-Android` | `docs/industrial-design-spec-114` | `develop` | [#115](https://github.com/kevvy555/MineIT-Android/pull/115) | Open draft, **74 commits ahead, 6 behind**, 42 changed Markdown files |

**Important:** These counts are a timestamped snapshot, not an evergreen result. GitHub may advance after this handover. **Android has diverged from `develop`**: fetch/compare new upstream commits before resolving or merging. Avoid a force push or accidental overwriting of later `develop` gameplay work. As of the snapshot, **all changes in these PR comparisons were Markdown only**; no production game/lore/data code changed by the documentation programme.

The three complete branch-based landing pages:
- [Universe shared spec](https://github.com/kevvy555/MineIT-Universe/blob/docs/industrial-design-spec-114/docs/specification/README.md)
- [Desktop game spec](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/README.md)
- [Mobile game spec](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/README.md)

## 3. Sources and progress proof

A **complete original file-path inventory** has been created: **433 historical Markdown inputs** — 16 Universe `docs/` + 4 `data/lore/` + 343 Desktop `Documentation/` + 70 Android `docs/`. Original documents remain unchanged. The inventories distinguish **Indexed** (filename recorded), **Reviewed (partial)** and **Migrated** (all source rules covered, conflicts accounted for). **Do not infer 433/433 migrated.**

- [Universe source register](source-register/README.md) and [shared reconciliation conflicts](source-register/RECONCILIATION_MATRIX.md).
- [Desktop all-343 inventory](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/source-register/DOCUMENT_INVENTORY.md), [actual coverage](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/source-register/MIGRATION_COVERAGE.md), [conflicts](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/source-register/CONFLICTS.md).
- [Mobile all-70 inventory](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/source-register/DOCUMENT_INVENTORY.md), [actual coverage](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/source-register/MIGRATION_COVERAGE.md), [conflicts](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/source-register/CONFLICTS.md).

At this checkpoint, **32** Universe, **38** Desktop, **41** Android Markdown files are in the new `specification/` trees *before this handover file* (111 total). Some files are indexes and registries, **not** fully implemented chapters.

**Notable completed/partially completed content:**
- Universe: authority matrix/glossary, shared industrial model, natural/refined/material meaning, worlds/discovery, corporations, generic asset lifecycle, fleet/logistics, technology and population concepts. Canon `data/lore/` and authored `data/*.json` still supersede a shared design proposal.
- Desktop: vision/crash scenario, 3D generation pipeline and **all 155 `design/Generation/` filenames mapped to owning stages** in [SOURCE_STAGE_MAP](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/world-generation-and-survey/SOURCE_STAGE_MAP.md). Substantial chapters cover planet archetypes and calibration, tectonics/elevation, hydrology/biomes, surface finds and underground geology/persistence, physical parts/salvage, machine installation/Power, facilities/fit-out, P0 population, ship launch risk, research, architecture ADRs and selected scenes. Many fine formulas, 3D views, historic alternatives and current C# tests remain to reconcile.
- Mobile: corporation core loop; persistent galaxy, geology and 10-level scan; **full 42-row resource balance matrix** in [MOB-GAL-004](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/galaxy-and-discovery/04-natural-resource-catalogue.md); Food, HQ, Power/fuel/survival; Deep Reach claim score, final charter objectives/rewards, Buyer terms and reputation; fleet, Fusion Fuel/Propellant/Veyrite wear and company stock; UI/navigation, reserve semantics; native v17 save/Universe-pin boundaries; industrial economy #114; selected device acceptance. **The resource balance matrix is the first Mobile source recorded as fully migrated**; the others are partial/indexed until their remaining sections are verified.

**Validation:** previously checked the new specification's repository-local Markdown link targets in batches and corrected detected broken links; **not** a substitute for fresh complete checks of all new commits, link *anchors*, external cross-repo references, test runs, document approval or code parity. The detailed registers identify sections still needing verification.

## 4. Industrial design: vital decisions vs outstanding questions

The cross-repo #114 discovery belongs to:
- [Universe shared industrial specification](industrial-economy/README.md)
- [Android industrial gameplay](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/industrial-economy/README.md)
- [Desktop detailed industry](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/industrial-economy/README.md)
- [#114 decision tracker](https://github.com/kevvy555/MineIT-Android/issues/114) — this remains the *live* authority for explicit user approval.

**Approved directions:** current Mobile game deliberately extracts/trades raw materials, with future refining/Parts manufacturing/Machinery production; replace obsolete magic Ore-fed Industry support with credible industrial equipment supply; **Machinery is installed capital**, Parts are consumed for commissioning/upgrades **and ongoing maintenance**; all compatible fixed/ship/space-station/asteroid/gas-giant/mobile assets share the **same Parts/Machinery commodity/installation/maintenance economy**, not a ship-only industrial mini-game; Universe authors physical identities and Desktop may model individual machines, while Mobile aggregates supplies.

**Unapproved design recommendations:** **4 Parts families + 8 Machinery families** is the latest suggested taxonomy, *not agreed*. Do not implement it as locked canon. Exact shortage/condition model, consumption, servicing priority, installation/salvage, purchases, cargo burden, SKU IDs/tech grades, legacy Industry migration and manufacturing recipes are **D00–D11 OPEN**, to be discussed **one question at a time**. No gameplay implementation permitted merely because the descriptions exist.

## 5. Critical supersession and implementation-specific traps

- **Mobile charters:** the later locked/approved model **supersedes** earlier HQ/Food/Population/Industry completion gates. Objectives are broad **Build/Fuel/Ore** (first term included), independently earned broad weights and cumulative **75% weighted + 25% full-mandate** reward, resource-specific guaranteed-survey bonus and re-underwritten renewal. Use [final charter spec](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/commerce-and-contracts/02-charters-and-claims.md), not the early sections of the old model.
- **Mobile saves:** explicit **12–13 Oct 2026 v17-only cutover** retired native v1–v16 and web-v16 imports. New version must preserve **then-supported** saves or be a separately agreed explicit cutover; don't reinstate obsolete migration promises. Check [current saved-state chapter](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/architecture/04-save-migration.md).
- **Mobile stock reserves:** Corporate Trade and Buyer reserves are independent local channels. Within each, resource-specific + category floors overlap, **not additive**, with low-quality stock protected first. Kotlin `StockReserveService` / associated unit tests were inspected (not run).
- **Mobile reputation:** per-buyer finite terms and settlement reliability are not the same as Deep Reach charter reputation. Confirm final 360-day-year buyer term model, dynamic square-root active-buyer scaling and damping before adopting old milestones. `ReputationService` source inspected, not all tests executed.
- **Mobile fleet:** Fusion Fuel, Propellant, and Veyrite lattice condition are distinct systems; don't revive older fatal ship-loss semantics if later agreed recovery/stranding applies.
- **Desktop:** original vision/core loop may say approved, but large P0 GDD is **DRAFT** for certain numeric mechanics; do not promote all formulas to approved. Accepted hourly Desktop tick isn't Mobile's day-simulation time step. Desktop real parts/machine runtime phases remain proposed unless verified in C# code.
- **Universe:** narrative lore and authored identity are higher authority than the platform abstraction. `data/facilities.json` named world facilities are **not** automatically player-buildable assets. A gas giant has no normal rocky surface map. Historical prose may have stale building counts; inspect structured data.

## 6. Concrete remaining work / next best slices

1. **Get live GitHub status:** fetch #19, #114 and all three draft PRs, compare branch SHAs and `develop/main` divergence before further changes. All new commits go onto existing same-name docs branch in each repo. Do not merge until reviewed; don't alter code to satisfy unfinished design docs.
2. **Desktop source reconciliation:** continue detailed generation rules (all 155 mapped, but many still only Indexed), review remaining `Documentation/design/` machine/building/ship/research/source stage files, 3D scene/panel specs, ADRs and actual implementation/tests. Record original file/section -> new chapter, exact approval, conflicts and status.
3. **Mobile source reconciliation:** systematically read the remaining 70-doc overhaul/migration corpus, especially source subsections not yet migrated; reconcile current Android `develop` behaviours and device UI against approved target, HQ/Power/Food/population/survey/claim balance and trading/fleet. Confirm v17 fixtures/current save, stock reserve and reputation unit tests from *actual runs* if available; do not mark implemented from historical checkpoints only.
4. **Universe shared concepts:** finish missing shared chapters *only as cross-platform principles*, avoiding canon duplication. Inspect authored `data/*.json` and exact lore where reconciling published entity identities. Log cross-repo conflicts and human decisions explicitly.
5. **Update inventories and coverage continuously:** mark `Migrated` per original **only after full source content is carried across and any contradictions/approval boundaries are dealt with**. Source routing/summary isn't enough.
6. **Validation:** link check repo-local targets and section anchors, ensure all three cross-repo URLs resolve to the intended branches (switch to stable refs after merge), check no unintended duplicate rules, run any available markdown tooling and relevant unit tests when code parity claims need evidence.
7. **Review/merge:** retain draft PRs until content slice sign-off, documentation ownership/approval, branch divergence reconciliation, and user authorises merge. Keep #19 open until agreed completion criteria are met. #114 stays separate for industrial gameplay decisions.

The programme is very large. **Partial, reviewable commits with explicit 'incomplete' markers are better than an invented 433/433 completion claim.** Work as far as possible each session, update #19 with a durable timestamped checkpoint after each substantial commit batch.

## 7. Minimal prompt to paste into another chat

> Continue the **MineIT cross-repo modular specification consolidation** from [this handover](https://github.com/kevvy555/MineIT-Universe/blob/docs/industrial-design-spec-114/docs/specification/HANDOVER.md) and [tracking issue #19](https://github.com/kevvy555/MineIT-Universe/issues/19). Keep adding docs-only, source-verified chapters and file-by-file reconciliation updates to the **existing three draft PRs**: Universe #20 (`main`), Desktop #1 (`main`), Android #115 (`develop`), all using branch `docs/industrial-design-spec-114`. Preserve old files and approval statuses; `Indexed` is not `Migrated`. Current Android docs branch was six commits behind develop at last check; resolve safely before merge. Don't implement #114 gameplay or approve its proposed 4+8 Parts/Machinery taxonomy. Get as far as possible, verify local links, then checkpoint factual progress in #19 without claiming completion prematurely.
