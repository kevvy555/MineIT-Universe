# Shared Cross-Repo Reconciliation Ledger

**Status:** triage. Each line identifies a potential authority mismatch; no lore/data changes implemented.

| Subject | Source claims | Governing boundary | Current action |
| --- | --- | --- | --- |
| Old Mobile Industry Ore burn | Native legacy Industry support vs new equipment-led design #114 | Mobile-specific existing implementation is **not** shared canon | Document migration D08; no implicit upgrade to approved mechanic |
| Physical Parts versus grouped Parts | Universe 14 authored Part archetypes vs Mobile proposed four supply families | Universe identity; Mobile aggregation as compatible standard kits | D00 still open |
| Machine types and installation | Universe 34 machines; Desktop per-instance intent; Mobile eight proposed functional families | Universe archetypes; games own implementation | D00/D05 open |
| Gas giants and planet grids | Universe gas giant has no land squares; mobile discovery models planetary sectors | Shared physical suitability; game may use atmospheric/orbital assets | Future assets proposed, not a gas-giant tile extension |
| Deep Reach starter fabrication | Scenario includes broad Year-One repair/fabrication supplies; current Mobile intentionally raw-only | Canon scenario fact vs platform release schedule | Product pacing and starter stock D06 open; do not claim manufacturing currently exists |
| Veyrite drive systems | Universe genuine reactor/propellant/lattice requirements; Mobile generic propulsion family proposed | Canon drive identity; game may group ancillary equipment only | Compatibility/grade D00 unresolved |
| Historical Mobile art generation-count mismatch | [6 Oct Mobile art audit](../../MobileOverhaulArtAudit.md) gives **293** from 7+24+120+142, **291** at completion gate and 76+208=**284** migrated/queued | Current authored image-state records, PNG originals and WebP paths own actual production completeness | [UNI-ASSET-003](../assets-and-logistics/03-mobile-art-identity-and-coverage.md); discrepancy **OPEN**, do not publish historic queue total as completion metric |
| Historical Desktop substance authoring | Older Desktop documents include precanon physical material tables | Universe `data/lore/` and structured `data/` now own persistent material identity | Link as provenance; reconcile before new canon writes |
| Universe building count prose | Some older docs refer to 22; main `data/buildings.json` has 24 | Current structured contents (consistent with higher lore) | Correct metadata when approved; do not invent missing entities |

Every row requires source lines, owner confirmation, decision and spec reference before marking reconciled.
