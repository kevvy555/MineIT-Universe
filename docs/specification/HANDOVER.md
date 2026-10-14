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


## 8. Continuation checkpoint — 14 October 2026, subsequent documentation batches

**This section updates the timestamped counts above.** The historical handover snapshot in §2 remains evidence of the previous chat's state; use live GitHub comparisons when resuming. The tracker is still [issue #19](https://github.com/kevvy555/MineIT-Universe/issues/19), with substantive chronological comments there. The three PRs are still **OPEN DRAFT**, and **all changed files in their PR comparisons were Markdown-only** as of this checkpoint.

| Repo / existing PR | Source/base | Verified draft head before this handover commit | Ahead / behind at check | Completion status |
| --- | --- | --- | --- | --- |
| [Universe #20](https://github.com/kevvy555/MineIT-Universe/pull/20) | `docs/industrial-design-spec-114` → `main` | `e6dbb702ad9b3d67bd628dfcf1b0556975a8e5fc` | **48 / 0** | partial |
| [Desktop #1](https://github.com/kevvy555/MineIT-Desktop/pull/1) | `docs/industrial-design-spec-114` → `main` | `ecf99870a842a7afb2ed4e8a05355434d1b289b0` | **69 / 0** | partial |
| [Android #115](https://github.com/kevvy555/MineIT-Android/pull/115) | `docs/industrial-design-spec-114` → `develop` | `de674da63d53089089f12c7d1e83f86fdec79dd7` | **88 / 7** | partial, branch diverged |

### New source-backed chapters and ledger progress

**Universe:** four of the 20 original Universe Markdown inputs are now **Reviewed (entire original text, rules mapped; not current JSON/runtime verified)**, remaining sixteen Indexed:
- `UNI-SRC-006` → [commercial identity and save-owned offers](commerce-and-corporations/02-commercial-contacts-and-offers.md). Buyer is a game view over canonical people/organisations/operations; dated initial 100-contact/20-sector milestones are **not** live counts.
- `UNI-SRC-014` → [publication, manifest/schema/content version, offline consumer contract](principles/02-publishing-and-consumer-contract.md). Mobile's later build-pin policy outranks the historic optional online update flow.
- `UNI-SRC-015` and `UNI-SRC-016` → [ship class product and runtime profiles](assets-and-logistics/02-ship-class-products-and-runtime.md), including factory catalogue vs charter-issued starter, canonical class/list price/normal lead time vs mutable quote, per-light-year fuel. Current `data/` ID/count/art verification still needed.
- The exact file statuses are in [UNIVERSE_SOURCES.md](source-register/UNIVERSE_SOURCES.md); no lore, published JSON or originals were changed.

**Desktop:** new [DES-ARC-004](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/architecture/04-generation-content-and-tuning.md) maps accepted **ADR-0004/0005**; [DES-ARC-005](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/architecture/05-substance-identity-and-assay.md) maps accepted **ADR-0008 (amended)/0010**. Those four entire ADR sources were reviewed, but the corresponding C# tests/current assembly state were **not** run or verified. New [DES-WORLD-007](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/world-generation-and-survey/07-archetype-classification-and-migration.md) consolidates Step 1 sub-seeds/order, 15-dimensional weighted L1 nearest-centroid classification, histogram calibration and v1→v2 field migration. The [155-source stage map](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/world-generation-and-survey/SOURCE_STAGE_MAP.md) has **seven individual Step 1 original rows marked reviewed (six full, one partial)**; older parent ConstrainedRollTables and PlanetTypeAssignment are proven *redirect-only*. The nested constrained numeric source and `05-Labels` alternative are **not** pronounced migrated; full 343-file rule-level reconciliation remains open.

**Android:** source-content **Migrated** count in [MIGRATION_COVERAGE.md](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/source-register/MIGRATION_COVERAGE.md) rose **from 3 to 7 of 70**; this never means shipped/current-device accepted:
- Full [historical Phase 7.8 Resource Detail](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/interaction-and-presentation/05-resource-flow-and-runway.md) including its seven automated and thirteen device test clauses.
- Full [Phase 4 Buildings/HQ/costs/network/continuity](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/colonies-and-population/03-infrastructure-curves-and-hq-continuity.md): old v4/Ore-fed Industry marked historical versus newer v17 and #114 proposals.
- Full [Phase 4 New Game/Continue/dead colony/reset lifecycle](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/architecture/06-session-start-and-reset.md): fresh reset invalidates prior run's backup.
- Full [9 Oct Phase 15 expedition-device blockers](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/verification/02-expedition-performance-and-startup-blockers.md): ANR/loading, launch state, 0/1/2/4/5× travel, accurate world/distance, safe insets, real wall-clock performance check.
- Four separate September Phase 5/7 native map/viewport original sources were **Reviewed** and reconciled into [MOB-UI-002](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/interaction-and-presentation/02-colony-map-gestures-and-controls.md), but **not marked modern October UI authority**. Distinguish the historical 88dp→58dp→26dp intermediate rails from the later accepted selection-first UI; preserve the real 8×8/FIFO survey semantics.

### Validation and branch safety

- All three PRs were independently checked live to be **draft and docs-only in changed-file comparisons** before this handover update. Repository-relative link target tests found **zero missing file targets** in selected new/updated files: Universe seven files/50 links; Desktop four files/60 links and later four/393 links; Android two reviewed batches of five files/87 and five/100 links. **Heading anchors, every other new spec file, remote URLs, code/test parity, CI and physical device sign-off remain unverified.** Do not claim a complete repository-wide link audit.
- **Android `develop` diverged by seven upstream CI-only commits** since common ancestor `28639d096ffc03e08792a31d01e0cfb4b7acc380`. They change the CI workflow, `docs/CI_CD_PIPELINE.md`, PowerShell test script and filter validator. They do **not** directly touch the changed `docs/specification/` files. There was **no forced ref move, merge, rebase or code change** in these batches. Check ancestry and reconcile safely before eventual full review/merge.
- Original docs remain in place, mixed **APPROVED/PROPOSED/OPEN/IMPLEMENTED** statuses are explicitly differentiated, and proposed Android #114 **4 Parts + 8 Machinery** taxonomy **remains NOT APPROVED**. The shared `data/` and `data/lore/` precedences are untouched.
- The **433-input document programme is still incomplete**: most Desktop generation/scene/ADR docs, additional Android Overhaul/UI/Power/fleet sources, remaining Universe lore/schema/docs, current Kotlin/C#/manifest verification, complete link/anchor audit, decision closure and sign-off remain.

**Next continuation:** recompare live PR heads and branch bases; continue source-by-source Desktop `05-Labels` versus `05-Classification` / nested Stage 1 generation and remaining ADRs; Mobile latest accepted UI and exact Kotlin v17/HQ/simulation/fleet/device parity; shared Universe remaining original sources and live canon graph. Commit only on these *same existing draft branches*, update exact ledgers per batch, and checkpoint [#19](https://github.com/kevvy555/MineIT-Universe/issues/19) after substantial progress. Never invent 433/433 migration, merge, change PR review state, or run gameplay coding in this programme.
