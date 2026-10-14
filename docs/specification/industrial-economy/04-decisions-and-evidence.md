# 04 — Decision Register, Provenance and Open Questions

**Snapshot: 14 October 2026. Live issue authority:** [Android feature #114](https://github.com/kevvy555/MineIT-Android/issues/114).

## Status vocabulary

- **CANON:** established fact in Universe long-form lore or structured catalogue; canonical lore hierarchy wins conflicts.
- **AGREED DIRECTION:** explicit user product direction, not proof code exists.
- **PROPOSED:** analysed/recommended, may change; not an acceptance criterion.
- **OPEN:** question requires user decision.
- **IMPLEMENTED:** supported by actual code/release/tests (only assert with evidence).
- **LEGACY / SUPERSEDED:** old behaviour/assumption retained as history, not target design.

## Confirmed directions relevant to this specification

| ID | Status | Decision | Trace |
| --- | --- | --- | --- |
| A01 | AGREED DIRECTION | Mobile's current active economic stage extracts, stores and trades raw resources. Refining/manufacturing/building ships belong to future gameplay, **not this immediate change**. | #114 |
| A02 | AGREED DIRECTION | Retire abstract Ore-fed Industry support as the model for mining and construction; replace its intended industrial role with equipment supply/maintenance. Actual legacy code remains until migrated. | #114; superseded play-test #91, #94, #99 |
| A03 | AGREED DIRECTION | Capital Machinery is acquired and installed; not burned daily. Parts have both initial/upgrade use and **ongoing maintenance consumption**. | #114 user selection 'ongoing' |
| A04 | AGREED DIRECTION | Mobile has simplified commodity bundles; Desktop can simulate particular authored parts/machines. Shared concepts and canon, not necessarily formulas or UI. | #114 cross-game analysis |
| A05 | AGREED DIRECTION | Ships, skimmers, vehicles, stations, asteroid rigs and fixed buildings use **the same compatible Parts/Machinery supply and construction/maintenance economy**. No separate 'ship parts' inventory system or shipbuilding mini-economy. | [#114 revised cross-asset checkpoint](https://github.com/kevvy555/MineIT-Android/issues/114#issuecomment-6163734026) |
| A06 | CANON | Authored materials, parts, machines, buildings, named facilities and ship classes have Universe-owned stable IDs; mutable stock, prices, requirements and rates belong to game. | [Canon hierarchy](../../CanonSourceHierarchy.md); [Substance canon](../../SubstanceCanon.md) |
| A07 | CANON | Deep Reach charter permits raw export, processing, internal industrial retention; one-year planned support and longer industrial development are scenario design. | [Charter §§11–12,18,20](../../../data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md) |

## Proposals — not yet agreed

| ID | Status | Candidate |
| --- | --- | --- |
| P01 | PROPOSED | Four Parts families: P1 Mechanical & Wear, P2 Electrical & Computing, P3 Fluid & Environmental, P4 Process & Thermal. |
| P02 | PROPOSED | Eight Machinery families: M1 Extraction, M2 Power, M3 Control/Computing/Comms, M4 Environmental/Agricultural, M5 Refining/Processing, M6 Manufacturing/Assembly, M7 Logistics/Handling, M8 Mobility/Propulsion. |
| P03 | PROPOSED | A common asset equipment/installation/maintenance profile (conceptual schema), with distinct operational adapters for ships, buildings, orbit and skimmers. |
| P04 | PROPOSED | Different capability/tech ratings within a family to prevent physically incompatible installation; still enable cross-asset stock reuse where valid. |
| P05 | PROPOSED | Refineries/workshops/shipyards and stations can expose modules/modes/upgrades rather than a unique new tile per service. |
| P06 | PROPOSED | Maintenance condition scalar and automatic prioritisation/repair policies, **without fixed formula yet**. |
| P07 | PROPOSED | Structural alloys/ceramics/chemical stock, advanced electronics and Veyrite form future meaningful technological and material gates. |

## Open questions — first decide D00

All are tracked in [#114](https://github.com/kevvy555/MineIT-Android/issues/114), with proposed order. **Do not mark resolved based on assistant recommendation.**

- **D00:** number/names of functional Parts and Machinery families; cross-asset compatibility, manufacturing-input plausibility, tech grades.
- **D01:** immediate Parts-shortage derating versus delayed wear/condition decline; repair and failure.
- **D02:** Parts demand by activity, tier, idle baseline, overdrive and building type.
- **D03:** scarcity allocation, survival priority, work time and repairs.
- **D04:** shell/build, equipment commissioning, staffing and upgrade sequences.
- **D05:** installed capital accounting, relocation, salvage, damaged equipment, compatibility.
- **D06:** starter equipment, cash, Deep Reach supply, cargo mass, lead times and purchase quotas.
- **D07:** inventory and canonical projection IDs; quality, stock, price, trade, manufacturing outputs.
- **D08:** legacy Industry facility, HQ, technology, ship support, processing bonus, UI and save migration.
- **D09:** Build/Ore arbitrary substitution and construction material compatibility.
- **D10:** balance, scale/performance, save/transport regressions, long-horizon play.
- **D11:** future manufacturing and asset contract without premature recipes.
- **Cross-game future:** shared schema/fixtures vs merely semantic conventions; actual Desktop wear and machine installation rules; station/gas-giant asset identity authoring; high-rated equipment representation.

## Architectural conflict-handling examples

- A Desktop part definition lists refined ceramic in a mining drill. That does **not** mean the Mobile HQ needs ceramic because both have 'Parts'; instead its standardised Electrical/Computing bundle uses plausible matching refined inputs.
- A Universe ship class contains a genuine Vector Exchange drive. That does **not** justify a second ship-only Parts/Machinery market. A high-grade Mobility/Propulsion family plus real Veyrite/technology constraints may be plausible (**proposal**).
- The Android native economy currently burns generic Ore for Industry. That remains a legacy implementation until the new system is approved, migrated and tested, **not** a shared design principle.

## Decision recording protocol

For each new decision, record date, original question, alternatives, **user-approved exact outcome**, rationale, owning repository and impacted platform rules. Update the shared spec first when cross-game, then the two platform modules. Retain issue links and old source references; do not rewrite lore to match a platform shortcut.
