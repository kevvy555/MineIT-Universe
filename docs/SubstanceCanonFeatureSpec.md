# Feature Spec — Canonical Substance System for MineIT Universe

**Status:** Discovery draft (not approved for implementation)  
**Target repository:** MineIT-Universe  
**Consumers:** MineIT Mobile, MineIT Desktop, Commercial Network, Lore Explorer  
**Related desktop source:** `MineIT/Documentation/design/Generation/SubstanceGeneration/`  
**Related mobile backlog:** Stage 2 **B04a — Resource model audit**

---

## 1. Problem

MineIT currently has three incomplete and partially conflicting resource truths:

| Owner | What it knows today | Gap |
|-------|---------------------|-----|
| **MineIT Desktop design** | Full substance schema: archetypes, composition, thermal behaviour, derived state, property ranges, P0/P1 catalogue (~75 categories) | Not published as Universe canon; Food is only a building output, not a substance catalogue |
| **MineIT Mobile** | Four gameplay inventory categories (`food`, `build`, `fuel`, `ore`) with authored deposit rows in `js/data/resources.js` | Local authored catalogue; not Universe-owned; mixes named Earth metals/gems with desktop-style functional ores |
| **MineIT Universe** | Operations reference `resourceType` + `resourceId` + `displayName`, largely copied from Mobile | No `substances` collection; no lore bible for materials; IDs are inconsistent (`reactive` vs `reactive-metal`, `ore:platinum` vs `precious:platinum`, `fuel:brine` vs `water:hydrogen-rich-brine`) |

Players of Mobile and Desktop should see the **same materials universe**. Mobile may expose a **smaller gameplay projection** of that universe, but identity, naming and meaning must be shared.

---

## 2. Goals

1. Make MineIT Universe the **single authored source of truth** for substances / mineable materials.
2. Publish the desktop substance design (definition, archetypes, catalogue, property rules, rarity) into Universe lore + structured data.
3. Define a **Food** substance/product family that Mobile already needs and Desktop is beginning to need (Farm → Food).
4. Define a stable **Mobile projection** of the full catalogue into the four inventory buckets: `food`, `build`, `fuel`, `ore`.
5. Reconcile commercial operation `resourceRequirements` to stable substance IDs (no free-floating display names as identity).
6. Keep mutable gameplay values (prices, quantities, reserves, quality rolls, contracts) out of Universe.

---

## 3. Non-goals (this feature)

- Implementing Desktop procedural generation or survey micro-generation inside Universe.
- Replacing Mobile simulation rules (rates, tech gates, sell prices) with Universe facts.
- Authoring every refined alloy / propellant recipe as live Mobile gameplay in v1.
- Plasma / stellar future types (`FutureSubstanceTypes.md`) beyond a deferred appendix.
- Salvage / ship-component inventory (explicitly not substances in desktop design).

---

## 4. Canon ownership model

```text
Universe lore bible (substances chapter)
        ↓ agrees with
Universe structured substances collection (stable IDs)
        ↓ referenced by
Operations / economic demand (resourceRequirement.substanceId)
        ↓ projected by
Game catalogues (Mobile food/build/fuel/ore view; Desktop full substance view)
        ↓ mutated by
Save/game state (stock, quality, price, reserves, contracts)
```

### Precedence

1. Foundation lore bible substance chapter (new / extended).
2. Scenario lore only where era-specific commercial naming differs.
3. Structured `substances` (+ optional `substanceCategories`) JSON.
4. Game projections / caches derived from Universe.
5. Save state.

Desktop design docs remain the **engineering design provenance** for importing into Universe; once imported and reconciled, **Universe becomes authoritative** and Desktop/Mobile must not maintain a conflicting authored catalogue.

---

## 5. Proposed Universe collections

### 5.1 `substances` (new)

Stable persistent material identities.

Suggested core fields (v1):

| Field | Purpose |
|-------|---------|
| `id` | Stable ID, e.g. `substance-structural-metal-ore` |
| `name` | Display name |
| `substanceType` | `Element` \| `Compound` \| `Alloy` \| `Composite` \| `Mixture` |
| `thermalBehaviour` | `ChangesState` \| `Decomposes` \| `Burns` |
| `standardState` | `Solid` \| `Liquid` \| `Gas` |
| `dominantArchetype` | `Metal` \| `Silicate` \| `Carbon` \| `Organic` \| `Water` \| `Salt` \| `Volatile` (+ proposed `Biological` for Food — see open questions) |
| `tier` | `P0` \| `P1` \| later |
| `form` | Ore / Mineral / Deposit / Liquid / Gas / Material / Refined / Foodstuff |
| `refined` | Boolean baseline (raw vs refined class) |
| `composition` | Optional authored default composition entries |
| `propertyProfile` | Authored ranges or typical values for Density, BondStrength, Reactivity, Conductivity, ThermalConductivity, Toughness, EnergyContent, Purity, Toxicity, Corrosiveness, NuclearStability, Viscosity |
| `gameplayRoles` | Short role strings (construction, fuel, electronics, nutrition, …) |
| `mobileProjection` | Optional: `{ inventoryCategory, activeInMobileV1: true/false }` |
| `lore` | Short in-universe description |
| `canonStatus` | `source-canonical` / `authored-economic-expansion` / etc. |
| `image` | Optional visual metadata following existing Universe image rules |

### 5.2 `substanceCategories` (optional new)

Catalogue groupings that match desktop P0/P1 category names (Reactive Metal Ore, Solid Fuel Deposit, …) when a category is the authoring unit and named instances are generated later.

For Mobile v1, many “categories” **are** the playable substances (no per-planet procedural naming yet). Desktop may later instantiate named variants under the same category ID.

### 5.3 Lore document / bible chapter (new)

Recommended additions:

1. **Lore bible chapter** (foundation): *Materials of the Commonwealth* — archetypes, why resources shaped Trondonian / Zoran / Blaxmar history (already partially present), industrial classification of substances, refined vs raw, fuels, construction materials, foodstuffs / nutrition cultures.
2. **Design-facing appendix** (may be `knowledgeScope: designer truth`): property derivation rules, FuelThreshold, RefinementThreshold, Mobile projection rules.
3. Structured records must agree with the chapter.

Suggested new files:

- `data/lore/` chapter section or sibling lore document, e.g. `Koplin_Universe_Materials_And_Substances.md`
- `docs/SubstanceCanon.md` — architecture for consumers (this feature’s lasting design doc)
- `data/substances.json` (+ shards if needed)
- `data/manifest.json` — register `substances` collection
- Validation rules for substance IDs and operation requirement references

---

## 6. Import scope from Desktop

Author into Universe from:

| Desktop document | Universe destination |
|------------------|----------------------|
| `SubstanceDefinition.md` | Schema + lore definitions |
| `Substances.md` | Full P0/P1 catalogue rows |
| `PropertyRules.md` | Category property ranges (designer truth / structured profiles) |
| `ExpandedCoreSubstanceProperties.md` | Property glossary; Mobile subset selection |
| `Rarity.md` | Shared rarity band vocabulary |
| `SubstanceWorldLink.md` | Deferred generation notes (Desktop-owned runtime; Universe only records categories) |
| `FutureSubstanceTypes.md` | Deferred appendix only |
| Farm / food building notes | New Food substance family |

---

## 7. Mobile projection (initial proposal)

Mobile keeps four **inventory / site categories**. These are **views**, not chemical truth.

| Mobile category | Universe meaning | Primary desktop archetypes |
|-----------------|------------------|----------------------------|
| **food** | Edible / nutrient biomass and cultures | Organic (+ new Biological / Food role); Water as input, not stock type |
| **build** | Construction & ceramic feedstock | Silicate, Organic (fibre/wood), some Metal structural ores if stock is aggregated as Build |
| **fuel** | Energy-bearing combustibles and nuclear/exotic fuels | Carbon, Volatile, Organic biomass, Radioactive ores used as fuel |
| **ore** | Metallic / high-value industrial minerals | Metal (+ crystalline gems as special ore family if retained) |

### Recommended Mobile v1 substance set

Start from **Desktop P0 raw** + Mobile-needed Food + a small set of commercially important P0/P1 ores already demanded by Universe operations. Do **not** bring all 47 P1 categories into Mobile extraction yet.

#### Food (Mobile-first; extend desktop)

| Proposed substance ID | Name | Notes |
|-----------------------|------|-------|
| `substance-fungal-shelf` | Fungal Shelf | Renewable surface food |
| `substance-edible-flora` | Edible Flora | Renewable |
| `substance-grazing-herd` | Grazing Herd | Renewable; biological stock, not mined mineral |
| `substance-nutrient-crop` | Nutrient Crop | Farm / field |
| `substance-protein-bloom` | Protein Bloom | Higher tier culture |
| `substance-thermal-algae` | Thermal Algae | Extreme environments |
| `substance-synthetic-nutrient` | Synthetic Nutrient | Manufactured; not a deposit |

#### Build (map from desktop Silicate / Organic construction)

| Proposed substance ID | Name | Desktop analogue |
|-----------------------|------|------------------|
| `substance-construction-fibre` | Construction Fibre | Fibrous plant (simplified P0) |
| `substance-woody-plant` | Woody Plant Material | Woody plant |
| `substance-stone` | Stone Aggregate | Stone |
| `substance-clay` | Clay Mineral | Clay |
| `substance-silica` | Silica Mineral | Silica |
| `substance-insulating-mineral` | Insulating Mineral | Insulating |
| `substance-structural-metal-ore` | Structural Metal Ore | Structural metal ore *(see Q: Build vs Ore stock)* |

#### Fuel (map from desktop Carbon / Volatile / Organic / nuclear)

| Proposed substance ID | Name | Desktop analogue |
|-----------------------|------|------------------|
| `substance-biomass` | Organic Biomass / Woody fuel use | Woody / biomass |
| `substance-solid-fuel` | Solid Fuel Deposit | Solid fuel (coal-like) |
| `substance-liquid-fuel` | Liquid Fuel Deposit | Liquid fuel |
| `substance-gas-fuel` | Gas Fuel Deposit | Gas fuel |
| `substance-radioactive-ore` | Radioactive Ore | Radioactive (fuel use in Mobile) |
| Keep or drop exotic Mobile fuels | Fissile / Brine / Exotic Crystal | Need lore justification (Veyrite-adjacent vs ordinary radioactive) |

#### Ore (map from desktop Metal + selective valuables)

| Proposed substance ID | Name | Desktop analogue |
|-----------------------|------|------------------|
| `substance-reactive-metal-ore` | Reactive Metal Ore | P0 |
| `substance-conductive-metal-ore` | Conductive Metal Ore | P0 |
| `substance-magnetic-metal-ore` | Magnetic Metal Ore | P0 |
| `substance-structural-metal-ore` | Structural Metal Ore | P0 |
| Optional named lore metals | Iron / Copper as common structural/conductive presentations | Prefer functional IDs long-term; Earth names may remain aliases |
| Precious / gem rows | Platinum, Palladium, gems, diamond… | Either promote as rare Metal/Silicate crystalline substances or mark Mobile-only commercial specials pending desktop alignment |

### Mobile attribute subset (recommended v1)

Use a **small derived set** that already drives Mobile systems:

| Attribute | Mobile use |
|-----------|------------|
| `inventoryCategory` | food / build / fuel / ore |
| `rarityBand` | Spawn weight / progression |
| `energyContent` (or derived `fuelValue`) | Fuel burn / power |
| `structuralStrength` or `constructionValue` | Build efficiency (feeds A25b later) |
| `purity` / quality linkage | Sale price, refining later |
| `toxicity` | Optional survival pressure later |
| `renewable` | Site behaviour |
| `density` | Freight mass later |

Defer for Mobile v1: BondStrength, full Reactivity matrix, Viscosity pumping sim, NuclearStability beyond a simple fissile flag, Flammability/Explosiveness, alloy recipe graphs.

Desktop continues to use the full property set.

---

## 8. ID and demand reconciliation

### Current Universe problems to fix in the same programme

- Duplicate IDs for the same material (`reactive` vs `reactive-metal`, `protein` vs `protein-bloom`).
- Split type namespaces (`precious:platinum` vs `ore:platinum`, `water:…` vs `fuel:brine`, `mineral:structural` vs `build:structural`).
- `displayName` used as if identity were reliable.

### Target requirement shape

```json
{
  "substanceId": "substance-reactive-metal-ore",
  "importance": "critical",
  "demandScale": "high",
  "qualityPreference": "excellent",
  "reason": "High-performance hull and drive-adjacent components."
}
```

Games may still present Mobile category chips (`ore`) derived from `mobileProjection.inventoryCategory`.

---

## 9. Acceptance criteria

1. Universe contains a lore materials/substances chapter that documents archetypes, substance types, thermal behaviour, raw vs refined, and Food.
2. Universe publishes a `substances` collection covering at least Desktop **P0** catalogue + Mobile Food set + agreed Mobile commercial ores.
3. Manifest registers the collection; validation rejects unknown `substanceId` references on operations.
4. Commercial operations are migrated to `substanceId` with no conflicting duplicate identities.
5. Documented Mobile projection lists which substances appear in Mobile v1 and under which inventory category.
6. Desktop and Mobile integration docs state that local authored resource catalogues must become derived caches, not competing canon.
7. Rarity vocabulary is shared (map Mobile labels onto Universe bands).
8. No mutable prices/reserves/contract terms stored on substance records.

---

## 10. Suggested delivery phases

| Phase | Work |
|-------|------|
| **A — Canon foundation** | Lore chapter + schema doc + empty/partial `substances` for P0 + Food |
| **B — Full desktop catalogue** | Import all P0/P1 category rows + property profiles |
| **C — Commercial migrate** | Re-point operations; fix ID collisions |
| **D — Mobile consumer** | Mobile reads Universe substances (or build-time artefact); retire conflicting local authorship |
| **E — Desktop consumer** | Desktop generation keys off Universe category IDs |

---

## 11. Open product questions

See companion discovery note in the requesting chat; blockers for Approval:

1. Are Mobile inventory categories forever projections, or do they become Universe enum fields every substance must set?
2. Should Structural Metal Ore contribute to Mobile **Build** stock, **Ore** stock, or both via refining?
3. Keep Earth metal/gem names (Iron, Gold, Ruby) as canon identities, aliases, or Mobile-only market labels?
4. Is Food a seventh archetype (`Biological`), an Organic subtype, or a separate non-substance `product`?
5. How much of Desktop P1 enters Mobile Year-1 content?
6. Are Veyrite / Exotic Fuel Crystal substances in the foundation bible or scenario-only / designer truth?
7. Does Universe own only categories, or also every named procedural instance Desktop will generate later?

---

## 12. Definition of done (for this Universe feature)

- Spec Approved by product owner.
- Lore + structured data merged to `main` with validation green.
- Consumer integration notes updated (`PublishingAndConsumers.md`, `MineitUniverseDatabaseIntegration.md`).
- Content version bump in `manifest.json`.
- Mobile/Desktop backlog items linked (Mobile **B04a**, Desktop substance implementation track).
