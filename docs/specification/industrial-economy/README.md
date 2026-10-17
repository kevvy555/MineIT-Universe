# Shared Industrial Economy — Specification Index

> **Scope:** shared MineIT industrial concepts, not platform gameplay code or new lore.
> **Status:** design consolidation draft, 14 October 2026. This is **not** a fully approved final specification.
> **Provenance:** [MineIT Mobile discovery feature #114](https://github.com/kevvy555/MineIT-Android/issues/114); earlier [#88](https://github.com/kevvy555/MineIT-Android/issues/88) / #91 / #94 / #99.
> **Owner:** MineIT-Universe, *shared design* (alongside—not above—the existing canonical lore and data).

## Read in this order

1. [01 — Industrial model](01-industrial-model.md): shared resource chain, parts, machines, operation and maintenance.
2. [02 — Assets and capabilities](02-assets-and-capabilities.md): the mature mining corporation, planets to stations, and candidate equipment families.
3. [03 — Production and progression](03-production-and-progression.md): real material dependencies, refinement, factories, logistics, trade and research.
4. [04 — Decisions and evidence](04-decisions-and-evidence.md): what is approved versus exploratory and the unresolved questions.

## Platform-specific companion specifications

- [MineIT Mobile — industrial gameplay and integration](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/industrial-economy/README.md): Android corporation management, aggregated equipment stocks, trade, maintenance, roadmap and implementation boundary.
- [MineIT Desktop — detailed machine simulation](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/industrial-economy/README.md): crash/survival scenario, physical parts/machine instances, refining, 3D interaction and implementation boundary.

## Non-negotiable documentation ownership

**Lore canon:** [Canon Source Hierarchy](../../CanonSourceHierarchy.md), `data/lore/*`, structured `data/*.json`. Historic civilisation, named systems, authored substance/part/machine/building/ship identity and physical meanings remain canonical there. This document **must not silently override** them. Resolve conflicts with a marked change proposal to canon.

**Shared design:** this folder records the cross-product concept, expected common vocabulary and design decisions. It can contain **approved**, **proposed**, **deferred** and **unresolved** content; those labels have different force.

**Per-game specification:** each game owns its rules for cost, rate, UI, technology progression, save state, placement, trading, repairs, and platform performance. A Mobile approximation is **not** a new canonical physical substance. Desktop's game rules cannot silently become universal rules either.

**Actual implementation:** repository code/tests and validated release notes prove what exists. Design text cannot be used as evidence that a feature has shipped. Proposed mechanics should never appear as current behaviour.

## Sources and lineage

- [Deep Reach Year-5326 scenario](../../../data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md), especially sections 11–12, 17–21 and 24–28.
- [Materials companion](../../../data/lore/Koplin_Universe_Materials_And_Substances.md).
- [Parts](../../../data/parts.json), [Machines](../../../data/machines.json), [Buildings](../../../data/buildings.json), [Ship classes](../../../data/ship-classes.json), [Named facilities](../../../data/facilities.json) and [Operations](../../../data/operations.json).
- [Industrial catalogue integration policy](../../SubstanceCanon.md).
- [Desktop original machine/building designs](https://github.com/kevvy555/MineIT-Desktop/tree/main/Documentation/design/Machines%20%26%20Buildings).
- [Mobile historic resource architecture direction](https://github.com/kevvy555/MineIT-Android/blob/develop/docs/migration/Overhaulv0.1/RESOURCE_ARCHITECTURE_DIRECTION.md).

## Change process

A change proposal must name the **owning repository**, the affected specification section, linked source/issue, decision status, and compatibility implications. If the decision is still pending in #114, do not label it approved in a specification. Once decided, update the shared principle *and* both platform adapters as appropriate. Avoid parallel independently authored substance or machine catalogues.
