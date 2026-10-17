# UNI-GOV-003 — Cross-Platform Design Ownership Matrix

**Status:** approved documentation governance; individual gameplay rules retain independent statuses. **Date:** 14 October 2026. **Sources:** [shared authority](DESIGN_AUTHORITY.md), [Universe canon](../CanonSourceHierarchy.md), [Desktop specification](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/README.md), [Mobile specification](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/README.md).

| Topic | Shared Universe owner | Desktop responsibility | Mobile responsibility |
| --- | --- | --- | --- |
| World and body identity | Authored named systems, body types, geology/surface plausibility | 3D procedural surface creation, local sampling, rendering | Pinned+save generated frontier, hidden world geology, compact sector scans |
| Physical materials | Authored substances, properties, stable IDs | Physical material instance/quality/recipe rules | Natural raw categories, inventory/quality projections, future refined goods |
| Equipment | Authored parts and machine archetypes, physical relationships | Individual part/machine construction, installation and wear | Proposed group families, purchased stock and recurring Parts maintenance |
| Asset meaning | Authored building/ship identities, shared structural compatibility | Local buildings, damaged ship, physical 3D placement | Colonies/ships/stations/skimmers in abstract strategic world; shared equipment stocks |
| Production | Common extraction/processing/manufacturing distinction | Granular material conversion and machine use | Current raw only; future strategic batch recipes |
| Population | Common living/working/survival concepts | Generational residents, skills, morale and expedition survival | Large colony workforce/population, Food, HQ, emergency rationing |
| Power/Fuel | Physical energy/resource compatibility, published drive canon | Hourly Power/machine network, ship crutch | Day-scale Power priorities, fuel and fleet consumables |
| Scanning | Existing world truth and discovery semantics | Physical surveying, samples and analysis | Sector surveys, Deep Reach knowledge, claim underwriting |
| Commercial universe | Authored Deep Reach organisations, buyer people and structural procurement | Scenario-specific trading/salvage as relevant | Charter, buyer reliability, cargo/freight and corporation finances |
| Ships | Authored class identities and true technology limits | Escape ship, repaired systems and later physical flight as designed | Fleet navigation, procurement, transports, future fabrication |
| UI | General truth only; no shared UX authority | 3D host, controls and scenes | Portrait map-first, touch navigation, Deep Reach directory |
| Time | Causality/deterministic change as design principle | Accepted hourly tick P0 ADR | Daily aggregated simulation and time controls |
| Save/CI | Stable identity and published dataset compatibility | Desktop save/host/test specifics | Android saves, migration, offline asset pin, device tests |

## Rule for reconciliation

1. Is it a named entity or physical universe fact? **Universe canon and authored graph wins.**
2. Is it common gameplay terminology/industrial principle across platforms? **Universe shared design** records approved direction.
3. Is it a platform's numerical rule, screen, save, simulation or future milestone? **That platform's specification** owns it.
4. Does old code not yet implement new design? Record **target vs current** and open implementation work separately. Never label proposed a shipped fact.
5. Is there a collision? Add an explicit dated decision with old/new references and migration implications, rather than fixing it in three competing docs.

## Current critical divergences

- Mobile current industry is legacy generic Ore-fed support; proposed equipment-led replacement not yet shipped.
- Desktop individual Parts/Machines versus Mobile 4+8 functional stock remains a proposal awaiting D00.
- Deep Reach commercial scenario versus crashed expedition starting state are intentionally different.
- Universe's long-form starter industrial support does not force current Mobile to contain advanced factories.
- P0 Desktop hourly tick versus Mobile day processing remain distinct.

[Cross-repo documentation programme #19](https://github.com/kevvy555/MineIT-Universe/issues/19).
