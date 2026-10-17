# UNI-WORLD-006 — Provenance, Occurrences, Discovery and Depletion

**Owner:** shared MineIT game-design concepts, MineIT-Universe · **Design status:** shared consistency principles; platform storage/rates remain separately owned · **Reviewed:** 14 October 2026.
**Canonical sources:** [Universe world surface](../../../data/lore/Koplin_Universe_World_Surface.md), [source authority](../DESIGN_AUTHORITY.md).
**Platform evidence:** [Mobile persistent galaxy](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/galaxy-and-discovery/01-galaxy-generation.md), [Desktop underground sampling](https://github.com/kevvy555/MineIT-Desktop/blob/docs/industrial-design-spec-114/Documentation/specification/world-generation-and-survey/06-underground-depth-and-persistence.md).

## Three independent questions

| Domain question | Owner | Must not be conflated with |
| --- | --- | --- |
| **What kind of world/material can exist?** | Authored Universe canon, substance and celestial-body identity | The player's observed local map |
| **What is actually present at this location in this playthrough?** | A game's deterministic procedural world/occurrence seed, pinned generation version and materialised save state | Deep Reach buyer/underwriter knowledge or an observed screenshot |
| **What does the player know and what have they changed?** | Per-company survey/discovery, excavation, depletion, settlement/stock state | A new geology roll or rewritten canonical identity |

The third question can change without the first two changing. The second must remain physically coherent even when the first scan shows no useful deposits.

## Authoring and versioning contract

- An **authored named world** keeps its Universe-owned stable ID, body kind and established fixed fictional facts.
- A game's **generated world** receives stable IDs, seeded location and physical facts under a known generator version; it is **not** a new authored Universe canon entry by virtue of appearing in one save.
- A **resource occurrence** is a stable site/vein/field in the game's generated physical world. Its identity must not depend on the order in which UI, colony map, rendering, scanner or Deep Reach underwriting discovered it.
- If an algorithm changes, games must explicitly preserve already materialised world facts or deliberately version/migrate them; a mere software update must not silently transplant a colony onto different deposits.
- A category label (`Ore`, `Build`, `Fuel`) or reporting confidence is **not** enough to uniquely identify a physical substance and deposit.

## Query, knowledge and mutation lifecycle

```text
canonical substance/body identity
    + game seed + generation version + location/depth
    -> deterministic actual occurrence (or verified absence)
    -> survey/underwriter observation with confidence and provenance
    -> explicit extraction site binding to that occurrence
    -> depletion or managed regeneration (for suitable biological stock)
    -> persistent save-owned changes and economic history
```

**Do not regenerate to satisfy gameplay:** a contract objective, scanning unlock or economic shortage may increase motivation to prospect elsewhere or import, but must not reroll a world's original geology to guarantee success. A sold resource stock is distinct from unmined reserve.

## Deltas versus full world materialisation

The **common objective** is reliable physical persistence with reasonable memory. Desktop's documented on-demand underground sampler demonstrates a possible **seed + changes** model: query pristine location/depth when needed, then store discovery, yield consumed and ownership. Mobile's galaxy design instead materialises its persistent galaxy/world geology into save-owned truth, and the 8×8 colony UI accesses that truth.

**Both are valid** under this shared principle. Do **not** impose Desktop's coordinate query/voxel avoidance implementation on Mobile, or Mobile's discrete four geological layers and claim count on Desktop. Saving all materialised Mobile occurrences and storing Desktop deltas can yield the same player-facing invariant: the resource's existence does not depend on whether a camera, scan or contract view asked about it.

## Life versus geology

Geological reserves are finite and deplete; an exhausted vein remains identified even when no Ore remains. Renewable biological sources such as herds, crops and algae have population, ecological carrying capacity, growth and harvest limits. A native herd's extinction is not the same as exhausting a mineral seam; introduced agriculture is an active investment and must not be represented as geological spawning.

The game may implement different yearly/daily growth and mining efficiencies, but the **ontological difference** between a living resource stock and a mineral occurrence must be retained across platform projections.

## Extreme environments and off-world operations

Gas giants have atmospheric layers, not terrestrial squares. Asteroids and ring bodies have different geometry and formation; deep subsurface models suitable for rocky terrestrial crust must **not** be applied to them indiscriminately. Ship/station/skimmer operations may expose or transport actual compatible resources but do not invent parallel 'station Ore' or 'ship Parts' natural classifications.

## Verification examples — shared in meaning, not numeric formula

1. Same authored/generator identity and saved state -> consistent physical occurrence, independent of scan order.
2. Surveying cannot secretly change the underlying identity, original reserve or quality roll.
3. Ship/cargo/colony stock changes do not alter the remote deposit or Universe authored substance.
4. Mining one of two co-located geological resources does not fabricate or deplete the other.
5. Save/reload and feature updates preserve discovery/depletion under explicit version rules.
6. A biome resource and a mineral vein have different depletion/recovery semantics.
7. Environmental classification blocks physically impossible locations, even when a contract would benefit.

## Questions intentionally owned by platforms

World count, per-tile maximum occurrences, scan detection probability, geological depth band boundaries, generation RNG implementation, reserve quantities and stock mass units, save schema, replacement-material recipes, visual rendering and UI remain per-game choices. No further product approval is implied beyond the already recorded physical consistency and identity rules.

**Related:** [Shared scanning semantics](05-scanning-and-surveying.md), [assets](../assets-and-logistics/01-asset-types-and-lifecycle.md), [raw/refined material classification](../materials-and-resources/01-material-classification.md), [industrial D00–D11 decisions](../industrial-economy/04-decisions-and-evidence.md).
