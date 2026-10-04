# MineIT Mobile Resource Occurrence Integration

**Status:** Approved design direction; structured occurrence catalogue still to be authored before Mobile implementation  
**Consumer:** MineIT Mobile  
**Canonical branch:** `develop`  
**Related canon:** `docs/SubstanceCanon.md`, `docs/WorldSurfaceCanon.md`

## Purpose

MineIT Mobile is moving from contract-generated resource distributions to a persistent seeded galaxy in which physical worlds exist before Deep Reach chooses claims.

This requires a strict ownership boundary:

**Universe defines what a substance is and where it is physically plausible. Mobile decides whether, where, how much and how valuable it is in a particular save.**

The game must not maintain an independently authored resource catalogue that can disagree with Universe.

## Current canonical material

Universe `develop` currently provides:

- 75 canonical P0/P1 substance categories;
- 7 material archetypes;
- 25 substance property/classification definitions;
- 9 rarity bands;
- 59 world types;
- 7 celestial body kinds;
- atmosphere, landform, biome, hydrosphere and surface-feature vocabularies;
- 13 geology provinces;
- 29 geology processes;
- 36 deposit shapes;
- 10 deposit states;
- 31 find-site classes, including 10 P0 surface and 21 P1 advanced surface/underground sites.

This is substantially richer than MineIT Mobile's legacy 40-resource catalogue.

## Important semantic difference

The Mobile legacy catalogue mixes several concepts:

- edible/biological sources such as Grazing Herd and Edible Flora;
- raw construction materials;
- geological ores and minerals;
- fuels;
- a small number of manufactured resources.

Universe `substances` is an industrial-material ontology. It deliberately separates raw/refined state, archetype and industrial role and does not treat a herd as a material substance.

Mobile therefore must not perform a blind one-for-one replacement of its 40 resource IDs with the 75 Universe IDs.

## Canonical ownership

Universe owns:

- stable substance identity and name;
- material archetype, form, raw/refined classification and industrial role;
- reusable world/body/atmosphere/geology/biome/hydrosphere vocabulary;
- reusable find-site, geology-process and deposit-shape vocabulary;
- hard physical plausibility relationships between natural substances and environments once the occurrence catalogue below is authored;
- any new persistent material/resource category required by multiple MineIT games.

Mobile owns:

- galaxy/save seed;
- generated per-save systems/worlds that are not authored Universe canon;
- per-world generated resource potential;
- exact deposit positions;
- abundance, reserve, quality and depletion;
- spawn frequency/probability;
- survey confidence/error;
- player knowledge;
- extraction rate and balance;
- game prices and market state;
- Food/Build/Fuel/Ore-style gameplay roll-ups;
- technology/extraction gating where it is a Mobile balance rule;
- legacy-save migration aliases.

## Missing canonical layer: substance occurrence profiles

The current Universe catalogue can describe a substance and a find-site class, but it does not yet fully answer:

> Can this material naturally occur on this body/world/environment at all?

That question must be answered canonically before Mobile's new world generator is implemented.

Add a manifest-backed structured collection tentatively named:

`substanceOccurrenceProfiles` -> `substance-occurrence-profiles.json`

A profile should reference stable Universe IDs and contain physical constraints, not game balance.

Recommended record shape:

```json
{
  "id": "occurrence-substance-solid-fuel-deposit",
  "substanceId": "substance-solid-fuel-deposit",
  "occurrenceClass": "geological",
  "naturalOccurrence": true,
  "celestialBodyKindIds": ["kind-rocky-planet"],
  "worldTypeIds": [],
  "atmosphereTypeIds": [],
  "excludedAtmosphereTypeIds": ["atmosphere-none"],
  "biomeIds": ["biome-wetland"],
  "hydrosphereIds": ["hydrosphere-fresh-water"],
  "geologyProvinceIds": ["geology-province-sedimentary-basin", "geology-province-carbon-basin"],
  "findSiteIds": ["find-site-peat-like-surface-bogs", "find-site-coal-like-seams-underground"],
  "depthBands": ["Surface", "Medium"],
  "notes": "Biogenic solid fuel requires an environment/history capable of accumulating organic carbon."
}
```

The final schema may simplify these fields, but it must support:

- naturally occurring vs processed/manufactured-only material;
- geological, biological, hydrological and atmospheric occurrence classes;
- hard body-kind exclusions;
- hard atmosphere/environment exclusions where physically required;
- world-type affinities/restrictions where useful;
- geology-province links;
- biome/hydrosphere links for surface biological/water resources;
- find-site links;
- depth-band plausibility.

It must **not** contain:

- Mobile spawn percentages;
- rarity weights;
- reserve tonnage;
- quality rolls;
- tile coordinates;
- player survey state;
- contract pricing.

## Why find sites alone are insufficient

The existing 31 find sites are reusable encounter classes and currently reference 18 unique substances.

They are useful inputs, but they are not a complete global occurrence matrix. Many canonical raw substances have no find-site reference yet, and absence of a find site does not necessarily mean a substance is impossible.

The new occurrence profile is therefore the authoritative physical eligibility layer; find sites remain reusable local encounter/deposit contexts.

## Required canon review before Mobile implementation

The following Mobile legacy concepts need an explicit reconciliation decision:

### Biological / Food resources — resolved design direction

**Approved:** 4 October 2026.

Food is not to be forced into the geological `substances` model. A herd, crop system, fungal ecology or aquatic food population is not a mineral deposit.

MineIT Mobile uses a high-level biological/agricultural Food layer with these player-facing identities:

- **Crops**;
- **Edible Flora**;
- **Herds**;
- **Aquatic Food**;
- **Fungi**;
- **Algae**;
- **Synthetic Nutrient** as a manufactured, non-natural Food output.

Universe should provide stable canonical identity/environmental meaning for the six biological/agricultural types without pretending they are ordinary geological substances. The implementation may use a dedicated biological/agricultural resource collection or another clean graph representation that follows the repository's stable-ID and canonical-ownership rules.

The canonical/environmental layer distinguishes:

- whether useful native biology is naturally established;
- whether open agriculture of each broad type is environmentally viable;
- aquatic dependence for Aquatic Food and Algae;
- hard terrain/environment exclusions such as mountains having no commercially usable natural Food;
- external environmental suitability versus controlled-environment production.

Mutable per-save facts remain Mobile state and must **not** be canonised here, including:

- current herd/fish/fungal/algal population;
- player-established Crops;
- managed carrying capacity;
- harvest intensity;
- overharvest damage;
- introduced livestock/cultures;
- agricultural-dome contents;
- player-created farm-world transformation.

The same biological identity is used whether a source is native, managed or introduced. Those are mutable site/state properties, not separate canonical Food identities.

### Precious metals and gemstones

Mobile currently distinguishes Silver, Gold, Platinum, Palladium, Diamond, Sapphire, Ruby, Emerald and Gemstone Deposit.

Universe currently provides broader Rare Metal Ore, Crystalline Mineral and Abrasive Mineral categories.

Before migration, decide whether these Mobile names are:

- local generated deposit names under broader canonical categories; or
- economically important canonical categories that should be promoted into Universe.

If Mobile market gameplay needs Gold and Platinum to remain independently tradable identities, they should be defined in Universe rather than re-authored only in Mobile.

### Legacy special resources

Mobile concepts such as Hydrogen-rich Brine, Exotic Fuel Crystal, Exotic Industrial Mineral and Advanced Element Deposit need explicit mapping or replacement. Unsupported catch-all identities must not become permanent parallel canon.

### Fresh water

Universe already models Fresh Water and hydrosphere context. Mobile's legacy four-category resource system does not model Water as a first-class category. The new world-resource architecture must preserve the canonical identity even if Mobile initially exposes it through a simplified gameplay roll-up.

## Mobile projection

Mobile may project canonical substances into current gameplay roles without changing canon.

For example:

- canonical Stone Aggregate may contribute to Mobile Build;
- canonical Solid/Liquid/Gas Fuel deposits may contribute to Mobile Fuel;
- canonical Metal Ores may contribute to Mobile Ore;
- edible biological sources may contribute to Mobile Food once their canonical representation is resolved.

These roll-ups are Mobile rules and may change without renaming Universe substances.

A canonical substance may eventually participate in more than one gameplay use, so the game must not infer all compatibility from one four-way category.

## Generation order

The intended Mobile generation chain is:

1. galaxy seed creates save-owned systems/worlds using Universe body/world taxonomy;
2. each world receives stable physical/environment facts;
3. Universe occurrence profiles define the set of physically eligible natural substances;
4. Mobile deterministic generation chooses from that eligible set and creates hidden world resource potential;
5. local terrain/geology narrows deposit/find-site placement;
6. Deep Reach survey observes the same hidden truth with uncertainty;
7. Deep Reach may create a claim/charter where commercial interest justifies it;
8. player survey later reveals actual local deposits.

The contract never creates geology.

## Example hard rule

An airless barren moon may support rock, silicates, metals, radioactive material and physically plausible trapped volatiles.

It must not generate peat, woody biomass, grazing organisms or other resources requiring an active biological surface history merely because a Mobile Fuel/Food weight happens to be non-zero.

This is a canonical eligibility rule. The probability of eligible resources appearing is Mobile balance.

## Save-owned generated worlds vs Universe canon

The 64-system Mobile galaxy may contain save-owned generated expansion systems/worlds.

These are not silently promoted into authored Universe canon. They use canonical Universe IDs for body kind, world type, atmosphere and resource identities, while the generated system/world identity and mutable discoveries remain save state.

Authored Universe systems/worlds retain their canonical stable IDs when present in the Mobile galaxy.

## Consumer synchronisation

Before the Mobile galaxy/resource implementation begins:

1. author and validate the occurrence profile collection in Universe `develop`;
2. resolve the Food/biological and precious-material identity decisions above;
3. extend Universe validation for all occurrence-profile references;
4. bump Universe schema/content version as appropriate;
5. produce a new pinned Mobile snapshot from that exact Universe commit;
6. implement Mobile generation against the pinned snapshot;
7. preserve legacy Mobile resource IDs only as migration aliases where required.

Universe remains the source of truth; the Android repository must not hand-maintain a second physical-plausibility table that can drift.


## Mobile uses familiar raw resources

MineIT Mobile is set in the known Koplin-region commercial economy. Its player-facing raw resources should therefore use **familiar, stable names** such as Iron Ore, Copper Ore, Gold, Coal, Crude Oil and Limestone.

The existing 75-substance industrial catalogue was designed partly to support other MineIT scenarios in which an expedition is stranded in an unknown galaxy and local substances may receive generated identities. That generic industrial catalogue remains useful and canonical, but it is **not the direct player-facing raw-resource list for MineIT Mobile**.

Mobile therefore needs a canonical familiar raw-resource projection defined in Universe before gameplay implementation.

Rules:

- keep the 75-substance industrial catalogue intact for shared industrial classification and other scenarios;
- define Mobile's familiar raw-resource identities canonically in Universe rather than only in Android;
- map familiar resources to broader industrial substance classes where useful;
- keep the current Mobile gameplay roll-ups Food / Build / Fuel / Ore;
- future unique/exotic discoveries may extend the resource set later, but are out of scope for the current galaxy/charter implementation;
- do not expose generated alien-material naming in ordinary Koplin-region Mobile contracts at this stage.

The exact familiar raw-resource catalogue should be approved before structured records are added.


## Candidate MineIT Mobile familiar raw-resource catalogue

**Status:** review catalogue; not yet structured canonical data.  
**Decision:** retain the four current Mobile gameplay categories.  
**Scope:** familiar raw/natural resources for the known Koplin-region economy. Future unique/exotic discoveries are deferred.

The familiar Mobile catalogue remains deliberately compact. The geological/non-food catalogue is reviewed separately from the Food biological/agricultural layer; Food no longer needs to be counted as if it were another geological-substance set.

### Food — 6 biological/agricultural types + 1 manufactured output

1. Crops
2. Edible Flora
3. Herds
4. Aquatic Food
5. Fungi
6. Algae
7. Synthetic Nutrient *(manufactured; never naturally generated)*

Food is now a separate biological/agricultural occurrence model rather than a geological-substance occurrence model.

Key physical rules:

- **Crops** represent deliberate cultivated agriculture and are never generated as a pre-existing natural crop deposit.
- **Edible Flora** may occur naturally on suitable productive biological land.
- **Herds** may occur naturally where a complex productive land ecosystem can support them, or be introduced later by the player.
- **Aquatic Food** requires a genuine suitable water/lake/aquatic environment plus compatible biology.
- **Algae** also requires a suitable water/lake/aquatic environment when naturally occurring.
- **Fungi** requires a suitable moist/organic biological context; naturally Vast commercial fungal ecosystems are not the normal case.
- **Mountains provide no commercially usable natural Food source and do not support ordinary open agriculture in the first Mobile implementation.**
- Airless, cryogenic, excessively hot or otherwise hostile environments may still support player-created Food through controlled agricultural infrastructure; this is mutable Mobile gameplay, not natural occurrence.
- Synthetic Nutrient belongs to manufacturing/technology gameplay and never enters natural world generation.

Natural biological occurrence, open-agriculture suitability and immutable environmental constraints are canonical design facts. Current stock, carrying capacity, managed expansion, establishment time, feed use and player-created agriculture remain per-save Mobile state.

### Build — 7

1. Timber
2. Plant Fibre
3. Stone
4. Clay
5. Silica Sand
6. Limestone
7. Gypsum

Build resources mix renewable biological construction feedstock with familiar bulk geological materials. Mobile may roll all of these into the Build gameplay role while retaining distinct stable resource identities.

### Fuel — 7

1. Biomass
2. Peat
3. Coal
4. Crude Oil
5. Natural Gas
6. Methane Ice
7. Uranium Ore

These are raw energy feedstocks, not interchangeable physical fuels. Mobile may initially project them into the Fuel gameplay role, while future power/refining technology can use explicit compatibility.

Environmental occurrence must be physically constrained. For example, ordinary Biomass and Peat require biological history; Methane Ice is favoured by cold/volatile-rich environments; Uranium Ore is geological rather than biological.

### Ore — 20

1. Iron Ore
2. Copper Ore
3. Bauxite (Aluminium Ore)
4. Nickel Ore
5. Tin Ore
6. Zinc Ore
7. Lead Ore
8. Chromium Ore
9. Cobalt Ore
10. Titanium Ore
11. Lithium Ore
12. Rare Earth Ore
13. Silver Ore
14. Gold Ore
15. Platinum Ore
16. Palladium Ore
17. Diamond
18. Ruby
19. Sapphire
20. Emerald

The Ore gameplay category is intentionally broad. It contains common industrial metals, technology/strategic metals, precious metals and gemstones, but their canonical identities remain distinct.

### Important modelling rules

- Surface Iron Nodules are a **deposit/find-site expression of Iron Ore**, not a separate traded resource.
- Generic legacy identities such as Reactive Ore, Conductive Ore and Magnetic Ore should migrate to familiar specific resources rather than remain player-facing Mobile canon.
- Synthetic Nutrient is manufactured and does not belong in the natural world-resource generator.
- Advanced Ceramic Feedstock is processed/manufactured rather than a natural Build deposit.
- Exotic Fuel Crystal, Exotic Industrial Mineral, Exotic Crystal and Advanced Element Deposit are deferred until unique-resource discovery is deliberately designed.
- The generic 75-substance Universe industrial catalogue remains intact for classification and the other MineIT scenarios.
- Familiar Mobile resources may map to one or more broad Universe industrial classifications, but their Mobile-facing stable identities should be canonical Universe data once this list is approved.
- Prices, spawn weights, quality, reserve quantities and gameplay-category balance remain Mobile-owned.

### Total

| Mobile category | Candidate resources |
| --- | ---: |
| Food | 6 biological/agricultural + Synthetic Nutrient manufactured |
| Build | 7 |
| Fuel | 7 |
| Ore | 20 |

Food is no longer provisional. It is intentionally modelled through the separate biological/agricultural layer described above rather than forced into the substance-count total.



### Mobile biological Food lifecycle

Mobile's approved biological Food gameplay consumes these canonical environmental facts using four routes:

1. **Wild harvest** — exploit an already-established native source immediately.
2. **Managed expansion** — improve an existing source over years, raising sustainable capacity.
3. **Introduced agriculture** — establish seeds, herds or cultures on environmentally suitable empty land/water over a longer period.
4. **Controlled agriculture** — use powered Agricultural Domes where the external environment is unsuitable.

Natural reproduction may recover Herds/Aquatic Food toward natural carrying capacity without colony feed. Deliberately raising animal/aquaculture production beyond the natural baseline requires feed in Mobile gameplay: Herds primarily consume Crops; intensive Aquatic Food may consume Crops and/or Algae. These feed ratios are Mobile balance, not Universe canon.

Aquaculture is a distinct Mobile development family for Aquatic Food. Algae remains aquatic when naturally occurring. Open-air biological expansion is constrained by local suitability; controlled domes replace the outside environmental constraint with infrastructure/Power cost.

The stable/mutable split is therefore:

```text
Universe/world environmental truth
    -> native biological occurrence + agricultural suitability
    -> Deep Reach/player knowledge
    -> Mobile mutable biological population/capacity/management
    -> Food inventory
```

This biological state is deliberately allowed to change over decades without violating persistent geological truth.

## Extraction zones and depth profile preview

Universe now defines a reusable extraction-zone vocabulary in `data/extraction-zones.json`:

1. **Atmosphere** — atmospheric/envelope harvesting rather than ground extraction.
2. **Surface** — exposed collection, quarrying or very shallow excavation.
3. **Shallow** — early subsurface pits, trenches or shallow drilling.
4. **Medium** — established underground mining or drilling.
5. **Deep** — advanced deep-crustal mining or deep drilling.

These are **gameplay-facing extraction/access zones**, not literal geological formation depths.

Where the source geology catalogue provides a physical formation/process range, retain that separately as formation-depth guidance. For example, hydrothermal mineralisation is currently catalogued at roughly `100m–10km`, while metamorphism is catalogued at roughly `5km–50km`.

A resource can therefore form very deep but still have an accessible surface occurrence through uplift, erosion, impact, placer concentration or other geological processes.

### Proposed non-food generic resource depth map

This table is the review model for MineIT Mobile. Rows marked **Universe evidence** already have matching find-site/depth information in the current catalogue. Rows marked **proposed** fill gaps required by the familiar Mobile resource set and should become structured occurrence profiles only after approval.

| Generic mapping | Familiar Mobile resources | Allowed extraction zones | Current Universe evidence / note |
| --- | --- | --- | --- |
| Abrasive Mineral | Ruby, Sapphire | Surface, Shallow, Medium | **Proposed** — no current find-site depth |
| Carbon-Rich Mineral | Graphite | Surface, Shallow, Medium, Deep | **Universe evidence:** Surface old lake beds; broader depths proposed |
| Carbonate Mineral *(new)* | Limestone | Surface, Shallow | **Proposed** |
| Clay Mineral | Clay | Surface, Shallow | **Universe evidence:** Surface mud flats; Shallow sediment layers |
| Conductive Metal Ore | Copper Ore, Tin Ore | Surface, Shallow, Medium | **Universe evidence:** Surface exposed seams; Medium underground ore seams |
| Crystalline Mineral | Quartz, Emerald | Surface, Shallow, Medium, Deep | **Proposed** — no current find-site depth |
| Fibrous Plant Material | Plant Fibre | Surface | **Proposed**, biologically surface-bound |
| Frozen Volatile Deposit *(new)* | Methane Ice | Surface, Shallow | **Proposed**; current frozen-methane find site is Surface under Gas Fuel Deposit |
| Gas Fuel Deposit | Natural Gas | Surface, Medium, Deep | **Universe evidence:** Surface frozen vents; Medium underground gas pockets; Deep added for buried reservoirs |
| Heavy Metal Ore | Lead Ore, Tungsten Ore | Shallow, Medium, Deep | **Proposed** — no current find-site depth |
| High-Energy Combustible Gas | Hydrogen | Atmosphere, Medium, Deep | **Proposed**; distinguish atmospheric harvesting from trapped subsurface gas |
| Inert Gas Deposit | Helium-3 | Atmosphere, Surface | **Proposed**; atmospheric/regolith harvesting model |
| Insulating Mineral | Mica | Surface, Shallow, Medium, Deep | **Universe evidence:** Surface dry mineral beds; Deep mica-like seams |
| Light Metal Ore | Bauxite, Titanium Ore | Surface, Shallow, Medium | **Proposed** — no current find-site depth |
| Liquid Fuel Deposit | Crude Oil | Surface, Medium, Deep | **Universe evidence:** Surface oil lakes; Medium underground hydrocarbon reservoirs |
| Lubricant-Capable Liquid | Crude Oil | Surface, Medium, Deep | **Universe evidence:** Surface oil seeps; Medium subsurface reservoirs |
| Magnetic Metal Ore | Nickel Ore, Cobalt Ore | Surface, Medium, Deep | **Universe evidence:** Surface impact crater walls; Deep underground bands |
| Native Carbon Mineral *(new)* | Diamond | Surface, Shallow, Medium, Deep | **Proposed** — extraction depth is distinct from deep formation origin |
| Organic Biomass | Biomass | Surface | **Proposed**, biologically surface-bound |
| Phosphate Mineral | Phosphate Rock | Surface, Shallow | **Proposed** — no current find-site depth |
| Precious Metal Ore *(new)* | Silver, Gold, Platinum, Palladium | Surface, Shallow, Medium, Deep | **Proposed** |
| Radioactive Ore | Uranium Ore | Surface, Shallow, Medium, Deep | **Proposed** — no current find-site depth |
| Rare Metal Ore | Rare Earth Ore | Surface, Shallow, Medium | **Proposed** — no current find-site depth |
| Reactive Metal Ore | Lithium Ore, Zinc Ore | Surface, Shallow, Medium | **Universe evidence:** Surface fractured crust; Medium subsurface volcanic veins |
| Silica Mineral | Silica Sand | Surface, Shallow | **Universe evidence:** Surface sand dunes; Shallow added for buried sediment |
| Solid Fuel Deposit | Peat, Coal | Surface, Shallow, Medium, Deep | **Universe evidence:** Surface peat bogs; Medium coal-like seams; Shallow/Deep broadened for familiar fuel deposits |
| Stone Aggregate | Stone | Surface, Shallow | **Universe evidence:** Surface rock fields; Shallow added for quarrying |
| Structural Metal Ore | Iron Ore, Chromium Ore | Surface, Shallow, Medium, Deep | **Universe evidence:** Surface outcrops; Deep underground mines |
| Sulfate Mineral *(new)* | Gypsum | Surface, Shallow | **Proposed** |
| Sulfurous Mineral | Sulfur | Surface, Shallow, Medium | **Proposed** — no current find-site depth |
| Woody Plant Material | Timber | Surface | **Universe evidence:** Surface forests |

### Intended occurrence-profile shape

After the familiar resource list and the five proposed generic categories are approved, the structured occurrence layer should resolve stable IDs rather than names.

A typical record would look conceptually like:

```json
{
  "id": "occurrence-structural-metal-ore",
  "genericSubstanceId": "substance-structural-metal-ore",
  "extractionZoneIds": [
    "extraction-zone-surface",
    "extraction-zone-shallow",
    "extraction-zone-medium",
    "extraction-zone-deep"
  ],
  "formationDepthGuidance": "Surface–10km+ depending on process",
  "findSiteIds": [
    "find-site-surface-outcrops",
    "find-site-deep-underground-mines"
  ],
  "physicalEligibilityOnly": true
}
```

The occurrence profile must not contain spawn probability, reserves, quality, prices or tile coordinates. Those remain Mobile-owned.

### Generic profile vs familiar-resource profile

The generic profile supplies the **widest physically reasonable envelope**. A familiar Mobile resource may narrow it.

Examples:

- Solid Fuel Deposit → Surface / Shallow / Medium / Deep.
  - Peat → Surface.
  - Coal → Shallow / Medium / Deep.
- Precious Metal Ore → Surface / Shallow / Medium / Deep.
  - Gold may occur across all four due to placer and hard-rock deposits.
  - Platinum may be weighted more strongly to subsurface/igneous contexts.
- Gas Fuel Deposit → Surface / Medium / Deep.
  - Natural Gas normally favours subsurface reservoirs.
  - surface gas is exceptional seep/vent expression rather than the default deposit form.

This prevents the generic category from forcing every familiar resource to use identical geology.


## Individual familiar-resource extraction profiles

**Status:** proposed Mobile occurrence model for review. These profiles narrow the generic-category envelope; they do not define spawn probabilities.

Legend:

- **Primary** — normal/characteristic extraction zone for this resource.
- **Secondary** — physically plausible but less typical/less commercially important occurrence.
- **None** — do not generate this resource at that zone without a specific authored exception.

| Mobile resource | Mobile category | Generic mapping | Atmosphere | Surface | Shallow | Medium | Deep | Notes |
| --- | --- | --- | :---: | :---: | :---: | :---: | :---: | --- |
| Timber | Build | Woody Plant Material | — | **Primary** | — | — | — | Harvested biological construction material |
| Plant Fibre | Build | Fibrous Plant Material | — | **Primary** | — | — | — | Harvested from surface vegetation |
| Stone | Build | Stone Aggregate | — | **Primary** | **Secondary** | — | — | Surface rock fields and shallow quarry faces |
| Clay | Build | Clay Mineral | — | **Primary** | **Primary** | — | — | Mud flats and shallow sediment layers |
| Silica Sand | Build | Silica Mineral | — | **Primary** | **Secondary** | — | — | Dunes, beaches and buried sand beds |
| Limestone | Build | Carbonate Mineral *(proposed generic type)* | — | **Primary** | **Primary** | **Secondary** | — | Sedimentary beds; deep extraction usually unnecessary |
| Gypsum | Build | Sulfate Mineral *(proposed generic type)* | — | **Primary** | **Primary** | **Secondary** | — | Evaporite and sedimentary beds |
| Mica | Build | Insulating Mineral | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Surface exposure possible; commonly mined from seams |
| Biomass | Fuel | Organic Biomass | — | **Primary** | — | — | — | Active/recent biological material |
| Peat | Fuel | Solid Fuel Deposit | — | **Primary** | **Secondary** | — | — | Surface bogs and shallow organic layers |
| Coal | Fuel | Solid Fuel Deposit | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Surface exposure possible; commercial seams predominantly subsurface |
| Crude Oil | Fuel | Liquid Fuel Deposit | — | **Secondary** | **Secondary** | **Primary** | **Primary** | Surface seeps/lakes exceptional; reservoirs normally buried |
| Natural Gas | Fuel | Gas Fuel Deposit | — | **Secondary** | **Secondary** | **Primary** | **Primary** | Surface vents possible; commercial pockets predominantly buried |
| Hydrogen | Fuel | High-Energy Combustible Gas | **Primary** | — | **Secondary** | **Primary** | **Primary** | Atmospheric harvesting or trapped subsurface gas |
| Methane Ice | Fuel | Frozen Volatile Deposit *(proposed generic type)* | — | **Primary** | **Primary** | **Secondary** | — | Cold-world surface/permafrost/clathrate deposits |
| Uranium Ore | Fuel | Radioactive Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Exposed occurrences possible; useful ore bodies generally subsurface |
| Helium-3 | Fuel | Inert Gas Deposit | **Primary** | **Primary** | — | — | — | Atmospheric extraction or regolith implantation/collection |
| Iron Ore | Ore | Structural Metal Ore | — | **Primary** | **Primary** | **Primary** | **Secondary** | Broad occurrence from outcrops to deep bodies |
| Chromium Ore | Ore | Structural Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Primary** | Favours deeper/igneous ultramafic bodies |
| Copper Ore | Ore | Conductive Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Surface exposures plus hydrothermal/subsurface ore bodies |
| Tin Ore | Ore | Conductive Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Veins and granitic/hydrothermal settings |
| Bauxite | Ore | Light Metal Ore | — | **Primary** | **Primary** | — | — | Weathering-derived near-surface aluminium ore |
| Titanium Ore | Ore | Light Metal Ore | — | **Primary** | **Primary** | **Primary** | **Secondary** | Heavy-mineral sands and igneous bodies |
| Nickel Ore | Ore | Magnetic Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Primary** | Sulfide/laterite/impact-linked occurrences |
| Cobalt Ore | Ore | Magnetic Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Often associated with nickel/copper mineralisation |
| Lithium Ore | Ore | Reactive Metal Ore | — | **Primary** | **Primary** | **Primary** | — | Familiar Mobile identity covering brine/pegmatite-style sources |
| Zinc Ore | Ore | Reactive Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Commonly hydrothermal/sedimentary subsurface ore |
| Lead Ore | Ore | Heavy Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Vein and sediment-hosted deposits |
| Tungsten Ore | Ore | Heavy Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Primary** | Hydrothermal/skarn deposits often favour depth |
| Rare Earth Ore | Ore | Rare Metal Ore | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Weathered and hard-rock deposits |
| Graphite | Ore | Carbon-Rich Mineral | — | **Secondary** | **Primary** | **Primary** | **Primary** | Sedimentary/metamorphic carbon deposits |
| Sulfur | Ore | Sulfurous Mineral | — | **Primary** | **Primary** | **Secondary** | — | Volcanic and evaporitic deposits |
| Phosphate Rock | Ore | Phosphate Mineral | — | **Primary** | **Primary** | **Secondary** | — | Sedimentary/biogenic mineral beds |
| Quartz | Ore | Crystalline Mineral | — | **Primary** | **Primary** | **Primary** | **Secondary** | Broad occurrence; only useful concentrations become deposits |
| Silver | Ore | Precious Metal Ore *(proposed generic type)* | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Veins, polymetallic ores and surface exposures |
| Gold | Ore | Precious Metal Ore *(proposed generic type)* | — | **Primary** | **Primary** | **Primary** | **Secondary** | Surface placer plus hard-rock veins |
| Platinum | Ore | Precious Metal Ore *(proposed generic type)* | — | **Secondary** | **Primary** | **Primary** | **Primary** | Igneous/mafic bodies; placer occurrences possible |
| Palladium | Ore | Precious Metal Ore *(proposed generic type)* | — | **Secondary** | **Primary** | **Primary** | **Primary** | Commonly associated with platinum/nickel systems |
| Diamond | Ore | Native Carbon Mineral *(proposed generic type)* | — | **Primary** | **Primary** | **Secondary** | **Secondary** | Deep formation but surface placer/near-surface pipe extraction possible |
| Ruby | Ore | Abrasive Mineral | — | **Primary** | **Primary** | **Secondary** | — | Metamorphic/placer occurrences |
| Sapphire | Ore | Abrasive Mineral | — | **Primary** | **Primary** | **Secondary** | — | Igneous/metamorphic/placer occurrences |
| Emerald | Ore | Crystalline Mineral | — | **Secondary** | **Primary** | **Primary** | **Secondary** | Vein/metamorphic deposits with occasional exposure |

### Generator interpretation

A future Mobile generator should:

1. establish whether a resource is physically eligible on the world;
2. select only from that resource's non-empty extraction zones;
3. strongly favour **Primary** zones over **Secondary** zones;
4. use world geology, terrain and find-site compatibility to choose the actual local deposit expression;
5. never infer a resource merely because another resource shares the same generic category.

The exact Primary/Secondary weighting is deliberately not canonical. That remains Mobile balance.

### Important examples

- **Diamond:** deep geological formation does not prohibit Surface extraction through placer deposits or exposed pipes.
- **Bauxite:** deliberately Surface/Shallow because it is fundamentally a weathering product.
- **Coal vs Peat:** both map to Solid Fuel Deposit, but Peat is overwhelmingly Surface while Coal favours Shallow/Medium.
- **Hydrogen and Helium-3:** justify Atmosphere as a first-class extraction zone.
- **Gold vs Platinum:** Gold has a strong Surface route through placer deposits; Platinum/Palladium should favour subsurface igneous contexts.


## World and environment eligibility profiles

**Status:** proposed Mobile occurrence model for review. This section extends the depth profiles with world/environment plausibility. It does not define spawn probabilities.

The generator should evaluate physical eligibility in this order:

1. celestial body kind;
2. world type;
3. atmosphere/hydrosphere where relevant;
4. geology province/process;
5. familiar resource extraction-zone profile;
6. Mobile-owned occurrence weighting and deposit generation.

A resource marked possible on a world type is not guaranteed to occur. It only enters the candidate pool.

### World-type groups used below

These aliases are documentation shorthand only. Structured occurrence profiles must store the actual stable Universe IDs.

- **BIOLOGICAL:** Verdant World, Lifeworld, Terraformed World, Colony World.
- **SEDIMENTARY/WATER-ALTERED:** Claystone World, Deadwater World, Dust World, Salt World, standard Barren World where local sedimentary geology permits it.
- **METAL/MINERAL:** Ore World, Crystal World, Ironstone World, Exotic World, Rust World, Radiant World.
- **VOLCANIC/CHEMICAL:** Scorched World, Hellworld, Corrosive World, Vent World.
- **CARBON/VOLATILE:** Fossil World, Titan-Class World, Vent World.
- **CRYOGENIC:** Frozen World, Titan-Class World.
- **ROCKY MOONS:** Rocky Moon, Barren Moon, Metallic Moon, Dust Moon, Volcanic Moon, Tidally Heated Moon, Low-Gravity Moon, Fragmented Moon, Resource-Rich Moon and Captured Asteroid Moon.
- **ICY MOONS:** Ice Moon, Frozen Moon, Ocean Moon.
- **ROCK/METAL ASTEROIDS:** Rocky, Metallic, Solid-Core, Rubble-Pile, Fragmented, Captured, Resource-Rich, Precious-Metal, Radioactive and Depleted Asteroids.
- **CARBON/ICE ASTEROIDS:** Carbonaceous and Icy Asteroids.
- **GAS GIANTS:** Hydrogen Giant, Ice Giant, Hot Jupiter, Super-Neptune, Ringed Giant and Storm-Dominant Giant.

Anomalous and Exotic-Substance asteroid/giant/moon types are intentionally **not** normal sources for familiar resources. They may be used by the future unique-resource system.

### Individual non-food environment profiles

| Resource | Primary world environments | Secondary / possible environments | Key hard constraints / geological notes |
| --- | --- | --- | --- |
| Timber | BIOLOGICAL | — | Requires established macroscopic woody biology; never on airless/barren/mineral-only worlds |
| Plant Fibre | BIOLOGICAL | — | Requires established surface plant-like biology |
| Stone | Most rocky planets; ROCKY MOONS | ROCK/METAL ASTEROIDS | Requires solid rocky material; not a gas-giant atmospheric resource |
| Clay | Claystone, Deadwater, BIOLOGICAL | Dust World, Salt World, Ocean Moon | Requires water alteration/weathering history; airless dry bodies need explicit altered geology |
| Silica Sand | Dust World, standard Barren World, Crystal World | BIOLOGICAL, Deadwater, Salt World, ROCKY MOONS | Surface sediment/erosion product; silica mineral itself may be broader than sand |
| Limestone | BIOLOGICAL, Deadwater, Claystone | Ocean Moon, Terraformed/Colony sedimentary worlds | Requires carbonate-forming aqueous/biological/geochemical history |
| Gypsum | Salt World, Dust World, Deadwater | Corrosive World, Claystone | Favours evaporite/sulfate sedimentary environments |
| Mica | Crystal World, Ironstone World, Exotic World | Ore World, volcanic/high-pressure rocky worlds, ROCKY MOONS | Favours metamorphic/igneous mineralised crust |
| Biomass | BIOLOGICAL | — | Requires active/recent biology; exclude airless and sterile mineral worlds |
| Peat | Verdant World, Lifeworld | Terraformed/Colony worlds with wetlands | Requires biological wetland accumulation; never on sterile or airless worlds |
| Coal | Fossil World, BIOLOGICAL worlds with long carbon history | Deadwater World where ancient biology is established | Requires ancient organic accumulation/burial; do not infer from generic carbon alone |
| Crude Oil | Fossil World | Deadwater/BIOLOGICAL worlds with mature sedimentary carbon basins | Requires suitable organic history, burial and reservoir geology |
| Natural Gas | Fossil World, Vent World | Deadwater/BIOLOGICAL mature carbon basins, Titan-Class where familiar hydrocarbon chemistry fits | Biogenic/thermogenic familiar natural gas requires appropriate carbon history |
| Hydrogen | GAS GIANTS, Vent World | Titan-Class, Frozen World, volatile-rich moons | Atmosphere or trapped volatile source; not generic rock geology |
| Methane Ice | Titan-Class, Frozen World, ICY MOONS, Icy Asteroid | Carbonaceous Asteroid | Requires cold volatile retention; strongly disfavoured on hot/volcanic worlds |
| Uranium Ore | Radiant World, Ore World, Radioactive Asteroid | Ironstone/Exotic worlds, Resource-Rich/Metallic Moon, Metallic Asteroid | Geological/radiogenic source; no biological requirement |
| Helium-3 | GAS GIANTS, airless ROCKY MOONS | metallic/resource-rich asteroids only as exceptional implanted inventory | Atmosphere or solar-wind implanted regolith; not ordinary buried ore |
| Iron Ore | Ore World, Rust World, Ironstone World, Metallic Moon/Asteroid | Most rocky planets/moons/asteroids | Extremely broad geology, but concentration controls commercial deposits |
| Chromium Ore | Ironstone World, Ore World, Scorched/volcanic worlds | Metallic/Resource-Rich Moon, Metallic Asteroid, Exotic World | Favours mafic/ultramafic igneous geology |
| Copper Ore | Ore World, Scorched World, Exotic World | Rust/Corrosive worlds, ROCKY MOONS, Metallic/Resource-Rich Asteroids | Strong hydrothermal/volcanogenic affinity |
| Tin Ore | Exotic World, Crystal World, Ore World | Scorched World, ROCKY MOONS | Favours granitic/hydrothermal systems |
| Bauxite | Verdant World, Lifeworld, Terraformed World | warm/wet Colony World | Requires prolonged intense surface weathering; exclude airless/cold/mineral-only bodies |
| Titanium Ore | Ore World, Ironstone World, Dust World | Metallic Moon/Asteroid, Scorched World | Igneous bodies or heavy-mineral sediment concentrations |
| Nickel Ore | Metallic/Ore/Ironstone worlds | Volcanic worlds, Metallic/Resource-Rich moons and asteroids | Strong mafic/ultramafic, sulfide and impact affinity |
| Cobalt Ore | Ore World, Metallic World contexts, Exotic World | Nickel/copper-rich volcanic/hydrothermal worlds, metallic asteroids/moons | Commonly associated with nickel/copper mineralisation |
| Lithium Ore | Salt World, Claystone World, Exotic World | Dust World, Scorched/hydrothermal worlds | Brine, clay and pegmatite-style occurrence; requires compatible local hydrology/geology |
| Zinc Ore | Ore World, Exotic World, Scorched World | Claystone/Deadwater hydrothermal-sedimentary settings | Hydrothermal and sediment-hosted occurrence |
| Lead Ore | Ore World, Exotic World | Deadwater/Claystone sedimentary settings, volcanic worlds | Vein and sediment-hosted deposits |
| Tungsten Ore | Ironstone World, Exotic World, Scorched World | Ore/Crystal worlds, volcanic moons | Favours high-temperature hydrothermal/skarn/granitic geology |
| Rare Earth Ore | Crystal World, Exotic World, Ore World | Ironstone/Radiant worlds, Resource-Rich/Metallic asteroids and moons | Requires specialised igneous/weathering concentration |
| Graphite | Fossil World, Ironstone/Exotic metamorphic worlds | Carbonaceous Asteroid, Deadwater World | Carbon-rich sedimentary or metamorphic origin |
| Sulfur | Scorched World, Hellworld, Corrosive World | Volcanic/Tidally Heated Moon, Salt World | Strong volcanic/sulphur-rich or evaporitic association |
| Phosphate Rock | BIOLOGICAL, Deadwater World | Claystone/Former-ocean contexts | Commonly sedimentary/biogenic; igneous exceptions possible |
| Quartz | Crystal World, Dust World, standard Barren World | Most rocky planets/moons, ROCK/METAL ASTEROIDS | Very common mineral; only concentrated deposits count as resource sites |
| Silver | Ore World, Exotic World | Scorched/hydrothermal worlds, Precious-Metal/Metallic Asteroids | Hydrothermal/polymetallic affinity |
| Gold | Ore World, Exotic World, Scorched World | BIOLOGICAL/Deadwater placer-capable worlds, Precious-Metal Asteroid, Resource-Rich Moon | Hydrothermal hard-rock plus placer concentration where erosion/water history exists |
| Platinum | Ironstone World, Ore World, Metallic/Precious-Metal Asteroid | Metallic/Resource-Rich Moon, Scorched/Exotic worlds | Favours mafic/ultramafic igneous systems |
| Palladium | Ironstone World, Ore World, Metallic/Precious-Metal Asteroid | Metallic/Resource-Rich Moon, Scorched/Exotic worlds | Commonly associated with platinum/nickel systems |
| Diamond | Ironstone World, Exotic World, Carbonaceous Asteroid | ancient stable rocky worlds with deep-crustal transport; placer-capable BIOLOGICAL/Deadwater worlds | Requires high-pressure formation or impact/carbonaceous route; surface occurrence does not imply surface formation |
| Ruby | Crystal World, Ironstone/Exotic metamorphic worlds | placer-capable BIOLOGICAL/Deadwater worlds, ROCKY MOONS with suitable metamorphism | Requires aluminium-rich metamorphic/igneous mineralogy |
| Sapphire | Crystal World, Ironstone/Exotic worlds | placer-capable sedimentary worlds, ROCKY MOONS | Corundum-compatible igneous/metamorphic source |
| Emerald | Crystal World, Exotic World | Ironstone/hydrothermal worlds | Requires uncommon beryllium/chromium/vanadium-bearing vein/metamorphic conditions |

### Atmosphere rules

Atmosphere should act mainly as a **hard biological/volatile constraint**, not as a universal mineral filter.

- Timber, Plant Fibre, Biomass and Peat require a world capable of supporting the relevant biology. Ordinary generation should require an atmosphere/hydrosphere combination compatible with that world's biological classification.
- Bauxite requires active weathering and therefore an atmosphere/hydrological history, even though the extracted ore itself is geological.
- Coal, Crude Oil and ordinary Natural Gas require biological/carbon history; an airless present-day atmosphere is acceptable only when the world type/history explicitly supports an ancient organic origin.
- Methane Ice requires cold volatile retention and should be blocked by hot-greenhouse/strong volcanic surface conditions unless an authored exception exists.
- Hydrogen and Helium-3 may use Atmosphere extraction on suitable giant/volatile worlds.
- Most metal/mineral resources are not excluded merely because a world has no atmosphere.

### Geology remains the local discriminator

World type establishes broad plausibility; geology province/process determines whether a particular part of the world is suitable.

Examples:

- Gold on an Ore World still needs a compatible hydrothermal/placer/metal-rich local context.
- Clay on a Claystone World still favours sedimentary/water-altered provinces.
- Uranium on a Radiant World still requires a radioactive/mineralised deposit context.
- Platinum on a Metallic Asteroid should arise from an appropriate metal-rich body/deposit, not every tile.
- Coal on a Fossil World still requires a carbon basin/seam context.

This prevents world type from becoming a direct spawn table.

### Hard exclusions are first-class

The occurrence system should explicitly store physical exclusions where useful rather than representing impossibility as a tiny probability.

Examples:

- Barren airless moon + Timber = **impossible**.
- Scorched volcanic world + Peat = **impossible**.
- Gas giant + Stone quarry = **impossible** for ordinary surface extraction.
- Warm Hellworld + Methane Ice surface deposit = **impossible** without an authored exceptional environment.
- Bauxite on an unweathered airless asteroid = **impossible**.
- Gold on a barren moon = **possible** if geology supports it.

Future unique/exotic resources may deliberately break familiar-resource expectations, but only through the separate unique-resource discovery system.
