# UNI-MAT-003 — Natural Resource Eligibility, Extraction Zones and Mobile Projection

**Authority:** [foundation materials lore](../../../data/lore/Koplin_Universe_Materials_And_Substances.md), [world-surface lore](../../../data/lore/Koplin_Universe_World_Surface.md), current **materialised** [resource definitions](../../../data/mobile-resource-definitions.json), [physical occurrence profiles](../../../data/mobile-resource-occurrence-profiles.json) and [biological resources](../../../data/mobile-biological-resources.json). **Original 778-line reference reviewed entirely:** [Mobile Resource Occurrence Integration](../../MobileResourceOccurrenceIntegration.md), UNI-SRC-013, 4 October first structured pass. Its schema-11/content-0.12.0 checkpoint is historical; branch manifest checked at schema **12**, content **0.14.0** on 14 October 2026. **Status:** canonical shared physical-eligibility semantics, not a cross-game generator or Mobile price/scan balance.

## Substance identity versus player-facing commercial resource

The canonical `substances` ontology holds industrial physical classes, not every named retail commodity or herds/farms. The Mobile-known Koplin region uses **familiar, stable** raw identities, not procedurally named unknown alien materials. Published first-pass **42 natural non-Food** resources are **7 Build, 9 Fuel feedstocks, 26 Ore/industrial minerals**; **7 Food identities** live in the distinct biological catalogue, six biological/agricultural plus **Synthetic Nutrient**, which is **manufactured** and never a naturally spawned deposit. The natural Fuel category does **not** mean all nine feedstocks can burn in an engine or fill a starship tank; **Propellant and Fusion Fuel are manufactured spacecraft consumables** and are outside the natural list.

Each familiar commercial ID maps to one/broader shared industrial category via stable IDs rather than a second hardcoded Android substance list. Historic generated “Reactive/Conductive/Magnetic Ore” labels are not permanent Mobile trade identities. Stone may display Construction Stone while preserving its ID; iron surface nodules are a *find-site expression of Iron Ore*, not a second traded resource. Mica is classed as an **Ore/industrial mineral** for Mobile inventory even though it insulates structures.

## Split of responsibilities

| Universe immutable authoring | Mobile per-save/gameplay state |
| --- | --- |
| Raw/processed substance category and stable familiar resource ID | Generated galaxy seed, unknown/explored systems, claims, exact locations |
| Body kinds, named world types, geology/atmosphere/hydrosphere/biome vocabularies | Deposit generation/coordinates, occurrence **weights** among eligible candidates |
| Physical **possible/impossible** environments and 5 extraction zones | Quantity/reserve, quality, depletion, value/price, scan/unlock tier |
| Stable biological identity, native and open-farm suitability | Wild herd/fish counts, carrying capacity, harvesting/feeding/introduced farming |
| Canonical resource artwork/asset IDs | Map tile selection, revealed knowledge, accessible mined stock |

The Universe publishes manifest-backed `mobileResourceDefinitions`, `mobileResourceOccurrenceProfiles` and `mobileBiologicalResources` as one logical eligibility layer. A generic `findSites` catalogue is **insufficient**: source originally had **31** reusable sites referencing only **18** substances, so missing find-site references cannot mean geological impossibility. Exact current find-site counts need present-data validation. The physical eligibility layer may express hard body-kind/atmosphere exclusions, geology affinity, terrain/water history, extraction zones and local find-site compatibility; it must **not** store price, rarity/weight, numerical scan gate, quality or reserve.

## Five extraction/access zones and material history

The shared zone IDs mean access **modes**, not a precise formation-depth ruler:

- **Atmosphere:** giant-envelope or other physically supported gas skimming.
- **Surface:** open collection, quarry, exposed/shallow accessible finds.
- **Shallow:** pits, trenching and shallow drilling.
- **Medium:** ordinary underground mines/reservoir drilling.
- **Deep:** specialist deep-crustal extraction/drilling.

A mineral formed many kilometres down may be exposed at the **surface** by uplift/erosion/impact or placer relocation. The 4 October source distinguishes physical formation depths (for example hydrothermal mineralisation roughly 100 m–10 km, metamorphism roughly 5–50 km) from extraction **access zone**. A broad *generic* category's maximum accessible zones does not force every specific commodity to occur in all of them.

Historical primary/secondary examples from the complete 42-resource source table:

| Familiar material | Characteristic accessible source | Not an ordinary source |
| --- | --- | --- |
| Timber/Plant Fibre/Biomass | Native established biological **Surface** | Atmosphere, sterile airless terrain |
| Peat | Surface wetlands, sometimes Shallow | Generic coal-like Deep in a sterile world |
| Coal | Shallow/Medium buried seam | Unexplained biological fuel on newly airless primordial rock |
| Crude Oil/Natural Gas | Medium/Deep hydrocarbon reservoirs | An unconditional well on any asteroid |
| Hydrogen | **Atmosphere** on eligible envelope, trapped Medium/Deep as applicable | Ordinary unaltered rocky ore |
| Helium-3 | **Atmosphere**, implanted-regolith Surface | Generic Deep rock ore |
| Methane Ice | Cold Surface/Shallow retention | Scorched open surface |
| Bauxite | Warm/weathered Surface/Shallow | Ancient pristine airless asteroid with no weathering |
| Diamond | Accessible Surface/placer or Shallow/Medium/Deep | Assertion that deep *formation* prohibits Surface finds |
| Gold | Surface placer and Shallow/Medium hydrothermal | Every tile of every metal-rich world |
| Platinum/Palladium | Primarily Shallow/Medium/Deep mafic/metallic | Generic fertile wetland without ore geology |
| Ruby/Sapphire | Surface/Shallow and less commonly Medium | Universal Ocean/Gas giant envelope |

For exact full **42 × Atmosphere/Surface/Shallow/Medium/Deep Primary/Secondary/None** source-era values and individual world affinity rows, retain the [original detailed tables](../../MobileResourceOccurrenceIntegration.md#individual-familiar-resource-extraction-profiles) and the **present manifest materialised JSON** as the data authority. Do not duplicate hundreds of numeric/table cells into a second gameplay tuning catalogue and allow them to drift. Universe stores **logical allowance**, not weighted spawn formula: Mobile favours primary over secondary at a **game-owned** relative weight.

## Body → world → atmosphere → local geology → access

Physical eligibility must be checked **before** Mobile applies random weights: body kind → eligible world kind/type → atmosphere/hydrosphere/biology history → geology province/process → chosen familiar resource access zone → generated actual deposit. **Possible** means eligible to roll, not guaranteed; local geology is still needed even on a named Ore/Fossil/Claystone world.

The original groups include Biological, Sedimentary/Water-Altered, Metal/Mineral, Volcanic/Chemical, Carbon/Volatile, Cryogenic, Rocky/icy moons, rocky/metallic/carbonaceous/icy asteroids and Gas Giants. These group names are **documentation aliases only**; structured records must use **real world-type stable IDs**, not permanent arbitrary labels. Anomalous/exotic worlds and materials are a **separate future unique-resource design**, not permission to spawn them in the familiar 42.

Examples of **hard impossibility**, not tiny weighting: an airless barren moon cannot host naturally established Timber/Peat/Herds; a scorching volcanic body cannot have open Peat or warm surface Methane Ice; a Gas Giant atmosphere is not a Stone quarry; unweathered airless asteroid cannot supply weathered Bauxite. Conversely a barren moon **can** contain Gold if suitable geology exists — atmosphere is not an automatic exclusion for ordinary minerals. A current airless atmosphere may still coexist with **ancient** organic fuels only where explicit fossil/carbon history supports that source.

## Biological Food has different source truth

The canonical identities are Crops, Edible Flora, Herds, Aquatic Food, Fungi, Algae, Synthetic Nutrient.

- **Native food** can exist as Edible Flora/Herds on suitable active land; Aquatic Food/Algae needs suitable hydrosphere + compatible biology; Fungi needs moisture/organic context. **Mountains** have no commercially usable natural Food and cannot be ordinary open agriculture in the first implementation.
- **Crops** are deliberate cultivation, **not a pre-existing natural crop deposit**. Synthetic Nutrient is an artificial manufacturing output, never natural.
- Four gameplay supply routes are **Wild Harvest → Managed Expansion → Introduced Agriculture → Controlled Agriculture**. Expansion over years, feed (Herds using Crops, Aquatic Food using Crops/Algae), harvest/depletion, viable open production, cold/airless Food Domes and infrastructure/power are **Mobile management**. Same canon biological identity applies when native or player-introduced.
- Native reproduction might replenish towards local natural capacity without artificial feed; intensive managed production beyond that baseline requires suitable feed and staffing. **No** hardcoded feed ratio/annual increase/carrying capacity belongs in Universe records.

## Generation and consumer ordering

Universe authored civilisation/world facts → Mobile save-seeded physical world/environment → Universe-filtered eligible resources → deterministic hidden deposits and local geology → uncertain Deep Reach observation/claim underwriting → player survey and eventual extraction/depletion. A player scan **cannot create geology**. A generated frontier world is save-owned, not promoted to Universe canon; existing authored world/planet IDs retain their persistent identity.

Consumer should pin a **validated manifest snapshot**, never manually maintain parallel hard-eligibility lists. Names/aliases may be migration support in games but must not rewrite stable Universe identity. Visual resource art is 1:1 and identity-bearing, not a hidden quality/price signal.

**Review finding:** initial source prose mixes earlier **proposed** individual extraction/world profile tables with later claims of first-pass structured completion, while actual manifest is now version 12. This chapter preserves that chronology; the **live JSON definitions/profiles/biological file and validators** decide what is materially published, not a proposal table heading. Complete source was read and reconciled as architecture/environmental model, but a full per-record current validator/consumer run remains to be completed.


## Direct source-data consistency check — 14 October 2026

Read the **live** four structured arrays under the documentation branch at source head `9cd760acdcb615aced82f7ccfcdc2ec8207949f2`: `mobile-resource-definitions.json` has **42 unique resource IDs and 42 unique Mobile keys** with group counts Build 7, Fuel 9, Ore 26; `mobile-resource-occurrence-profiles.json` has **42 unique resourceId links, all resolving one-to-one** to the definitions, with no orphan; `mobile-biological-resources.json` has **seven** Food source records; `buildings.json` has **24** building archetypes.

The physical profiles were checked for accidental presence of explicit Mobile-owned key names `price`, `basePrice`, `rarityWeight`, `spawnWeight`, `reserve`, `quality`, `scanLevel`, `miningLevel`: **none** found. Every natural-resource definition examined had `genericSubstanceId` and gameplay category. This is a **bounded structural consistency check**, not a full schema validation, foreign-key audit of every world/geology reference, generator simulation or Kotlin consumer test. The full 42×zone and 42×world plausibility mapping remains owned in canonical structured records, cross-referenced to the source-era tables above.
