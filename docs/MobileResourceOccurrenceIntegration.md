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

### Biological / Food resources

Mobile currently includes Fungal Shelf, Edible Flora, Grazing Herd, Nutrient Crop, Protein Bloom and Thermal Algae.

Universe currently has Organic Biomass, Woody Plant Material and Fibrous Plant Material but no dedicated edible biological-resource model. A herd is not naturally a `substance`.

Before replacing the Mobile catalogue, decide canonically whether edible natural sources are represented as:

- additional canonical substance categories;
- biological-resource/species/site records whose harvesting yields a game Food stock;
- or a deliberate combination of both.

Do not silently convert every biological source into generic Organic Biomass if gameplay meaning would be lost.

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

The target remains deliberately close to the current Mobile catalogue size: **40 familiar resources**.

### Food — 6 (provisional; dedicated review required)

1. Edible Fungi
2. Edible Flora
3. Grain Crops
4. Grazing Livestock
5. Aquatic Protein
6. Algae

Food is intentionally provisional. The next design pass must decide how natural food sources, managed agriculture, livestock and harvested biological resources should be represented canonically and in gameplay. These must not automatically be treated as geological substances.

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
| Food | 6 |
| Build | 7 |
| Fuel | 7 |
| Ore | 20 |
| **Total** | **40** |

The Food six are the only part of this list intentionally held open for the next design review.
