**KOPLIN UNIVERSE**

**Materials of the Commonwealth — Substances & Industrial Classification**

Working Canon • Foundation Technical Companion

| **Purpose**      | Define how Commonwealth civilisation classifies mineable, collectable and refined substances for industry, settlement and frontier extraction |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **Source**       | Reconciled from MineIT Desktop substance design (`SubstanceGeneration`) into Universe lore voice; must agree with the Expanded Lore Bible |
| **Scope**        | Substance identity, types, thermal behaviour, archetypes, raw vs refined tiers (P0/P1 catalogue families), rarity vocabulary, and designer property rules |
| **Canon status** | Working canon: baseline for Directory/Lore Explorer publication and for later structured `substances` records |

*This document does not replace civilisation history. It explains the industrial materials language that history already assumes: metal-poor Trondonians, ore-rich Zorans, coal-shaped Blaxmars, and the later Commonwealth extraction economy.*

# Contents / Document Index

| **Section** | **Subject** |
|-------------|-------------|
| 1 | Purpose and place in canon |
| 2 | Why materials shaped the three peoples |
| 3 | What a substance is |
| 4 | Substance types |
| 5 | Thermal behaviour |
| 6 | Standard state and derived physical state |
| 7 | Dominant archetypes |
| 8 | Composition, purity and refinement |
| 9 | Fuels as a derived classification |
| 10 | Catalogue tiers: P0 and P1 |
| 11 | Industrial catalogue by archetype |
| 12 | Rarity bands |
| 13 | Strategic exception: Veyrite |
| 14 | What this document does not model |
| 15 | Deferred topics |
| Appendix A | Designer truth: property vocabulary and derivation rules |
| Appendix B | Designer truth: P0/P1 category roll-up |

> **How to use this document**  
> Sections 1–14 are public industrial canon suitable for encyclopaedia and game-facing language. Appendices A–B are designer truth: simulation and generation rules imported from Desktop engineering design. Named procedural deposit instances generated at survey time remain Desktop runtime concerns until frozen into structured Universe records.

# 1. Purpose and place in canon

Commonwealth industry, frontier charters and crash-world restart economies all speak a shared materials language. A surveyor, smelter, shipwright or charter logistics clerk must be able to name what a deposit *is*, whether it is raw or refined, how it behaves when heated, and which industrial roles it can fill.

This document publishes that shared language as MineIT Universe canon. It sits as a **foundation technical companion** to the Expanded Backstory & Lore Bible: history explains *why* materials mattered; this chapter explains *how* materials are classified.

Structured substance records, when added later, must agree with this chapter. Mutable prices, stock levels, contract quantities and per-save quality rolls are game state, not substance canon.

# 2. Why materials shaped the three peoples

The Expanded Lore Bible already establishes the environmental constraints:

- **Trondonians** developed amid biological abundance but with poor access to concentrated metal and fossil fuels. Their early excellence in wood, ceramics, fibres, fermentation and water control was an energy-and-material ceiling, not an intellectual one.
- **Zorans** lived atop accessible copper, tin, iron and related ores. Metallurgy, surveying and formal technical institutions grew from that geology, while energy density remained a chronic limit.
- **Blaxmars** survived a cold continent because of an exposed coal seam. Stored ancient life became heat, logistics, communal law and, later, the ethical tradition of Dark Life.

Industrialisation after contact and conquest fused these traditions: metal craft, biomass and fibre knowledge, and dense carbon fuels became one Commonwealth materials culture. Frontier extraction in later centuries still organises around the same archetypes — metal, silicate, carbon, organic, water, salt and volatile — even when local deposit names differ from world to world.

# 3. What a substance is

A **substance** is a persistent material identity used by industry and games: a named category or instance of matter that can be surveyed, extracted, refined, transported, burned, built with or processed.

Distinguish three related ideas:

| Concept | Meaning |
|---------|---------|
| **Substance identity** | The stable industrial category or named material (for example Structural Metal Ore, Fresh Water, Woody Plant Material). |
| **Deposit / occurrence** | A local physical finding of that material in a world — often impure, variable and site-specific. |
| **Refined product** | Output of smelting, refining or chemical processing that raises purity or produces manufactured intermediates (alloys, electrolytes, propellants). |

Salvage ship components and fixed equipment parts are **not** substances under this model. They are inventory artefacts with authored identities of their own.

# 4. Substance types

`SubstanceType` classifies what a substance structurally *is*, independent of whether it is currently solid, liquid or gas.

| Type | Description | Familiar examples |
|------|-------------|-------------------|
| **Element** | One pure basic substance | Refined iron-analogue metals, refined graphite |
| **Compound** | Chemically bonded substances | Water, glass, ceramic, many salts |
| **Alloy** | A metal mixture | Structural and specialised alloys |
| **Composite** | Structured mixed substance | Wood, fibre composites, reinforced matrices |
| **Mixture** | Loose blend, solution, slurry, fuel blend or atmosphere | Ores, brine, crude fuels, breathable air |

Type is authored industrial truth. It is not automatically inferred from composition alone.

# 5. Thermal behaviour

When heated, a substance shows a dominant thermal behaviour. Full multi-step reaction chains are not required for the industrial catalogue; the dominant behaviour is enough for classification and gameplay.

| Behaviour | Description | Familiar examples |
|-----------|-------------|-------------------|
| **ChangesState** | Moves cleanly between solid, liquid and gas when heated or cooled | Most metals and ores, water, many salts |
| **Decomposes** | Breaks down into byproducts before cleanly boiling or vaporising | Many organics, plastics, some lubricants and solvents |
| **Burns** | Combusts or releases stored chemical energy when heated or ignited | Coal-like solid fuels, liquid and gas fuels, woody biomass |

A material may logically do more than one thing (wood can decompose and burn). Industrial classification records the **dominant** behaviour relevant to use.

# 6. Standard state and derived physical state

**Standard state** is the substance’s physical state at ordinary reference conditions (~20 °C, 1 atmosphere): Solid, Liquid or Gas. It is the authored baseline.

**Runtime state** on a world may differ. Where melting and boiling points are known, ambient temperature can move a substance between Solid, Liquid and Gas (and, in extreme stellar or volcanic cases, Plasma). Where a substance decomposes or burns instead of melting cleanly, melting/boiling points are typically absent and the standard state remains the practical baseline.

This is why the same industrial category can appear as ice, liquid or vapour under different planetary conditions without changing its substance identity.

# 7. Dominant archetypes

Archetypes describe chemical nature, not physical state. They constrain what a substance is composed of and the property bands its instances tend to occupy.

| Archetype | Character | World examples |
|-----------|-----------|----------------|
| **Metal** | Dense, strong, often conductive; very low energy content | Reactive, conductive, magnetic and structural metal ores and refined metals |
| **Silicate** | Stone, glass and ceramic minerals; hard, heat-tolerant, negligible fuel value | Silica, clay, stone, insulating minerals, glass, ceramics |
| **Carbon** | Carbon-rich minerals, hydrocarbons and related synthetics; moderate-to-high energy | Solid and liquid fuels, graphite, lubricants, polymers, solvents |
| **Organic** | Plant- and biomass-derived matter; low density and strength, moderate energy | Woody plant, fibrous plant, organic biomass |
| **Water** | Aqueous liquids and dissolved-component solutions | Fresh water, brine, acidic and alkaline process waters, coolants |
| **Salt** | Mineral salts and evaporites (also used as the nearest fit for some sulfate/phosphate minerals) | Sulfurous and phosphate minerals, fertilizers |
| **Volatile** | Chemically volatile compounds that tend to exist as gas under ordinary conditions | Gas fuels, inert gases, oxidizers, atmospheric mixes |

### Mapping approximations (industrial honesty)

Not every real chemistry has a dedicated archetype. Commonwealth industrial tables place awkward cases in the closest fit:

- Acids and alkalis are usually modelled as **Water**-dominant reactive mixtures.
- Sulfurous and phosphate minerals are approximated under **Salt**.
- Oxidizer, corrosive and toxic gases sit under **Volatile**.
- Explosives and energetic compounds are often modelled as **Carbon** materials with high energy content and a Burns behaviour.
- Catalytic compounds may be approximated under **Metal**.
- Composites are listed under their matrix archetype, with reinforcement noted (for example structural composite with metal or carbon).

A dedicated food / biological archetype is **not** declared in this edition. Edible biomass and agricultural products remain related to Organic and Water traditions in civilisation history; a separate Food substance family may be added later by explicit product decision.

# 8. Composition, purity and refinement

Substances are composition-driven. A composition is an ordered set of elemental contributions. Each contribution has:

- a stable **element identity** (the specific constituent);
- an **archetype**;
- a **fraction** of the whole (fractions sum to 1.0);
- property samples within the archetype’s allowed ranges (density, structural strength, hardness, energy content, and related measures).

**Purity** is the summed fraction of the dominant element identity — not merely “everything that shares an archetype.” An alloy of two metals is therefore impure even though both parts are Metal.

**Refined** stock is industrial language for material whose purity meets or exceeds the refinement threshold (designer default ≥ 0.90 for elements and compounds that are intended as purified outputs). Alloys, composites, solutions, slurries and propellant blends remain impure by definition even when they are manufactured intermediates.

### Raw vs refined

| Class | Meaning |
|-------|---------|
| **Raw** | Mined, drilled or surface-collected from deposits; unrefined stock. |
| **Refined** | Smelter, refinery or chemical-process outputs, plus manufactured intermediates such as electrolyte solution, alloys and propellants. |

# 9. Fuels as a derived classification

Fuel is not a separate archetype. A substance qualifies as a fuel when its aggregated **energy content** meets or exceeds a tunable fuel threshold (designer default ≥ 0.3).

Woody plant, solid fuel deposits, liquid fuel deposits, gas fuel deposits and many carbon-rich materials therefore act as fuels because of measured energy content and thermal behaviour, not because they sit in a special “Fuel” archetype.

# 10. Catalogue tiers: P0 and P1

Industrial unlock and bootstrap design uses two catalogue tiers:

| Tier | Role |
|------|------|
| **P0** | Bootstrap survival, first power, and construction of parts, machines and buildings — the minimum industrial spine. |
| **P1** | Research-unlocked expansion: advanced metals, volatiles, specialised chemicals, alloys and propellants. |

Counts in the Desktop-aligned catalogue: **28 P0** categories (17 raw, 11 refined) and **47 P1** categories (24 raw, 23 refined). Games may expose a smaller projection of this catalogue; they must not invent conflicting identities for the same industrial categories.

Category names below are the authoring units used when a world later generates named local deposit instances under the same category.

# 11. Industrial catalogue by archetype

The tables below are the public industrial roll-up. Columns:

- **Category** — industrial name
- **Form** — ore, mineral, deposit, liquid, gas, material, alloy, etc.
- **Type / Thermal / State** — SubstanceType, ThermalBehaviour, StandardState
- **Refined** — whether the category is treated as refined stock
- **Tier** — P0 or P1
- **Role** — primary industrial use

## 11.1 Metal

Dense, strong, conductive; very low energy content. Raw ores are impure mixtures; refining yields high-purity metal; alloys recombine metals and are not “pure.”

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Reactive Metal | Ore | Mixture | ChangesState | Solid | No | P0 | Batteries, chemical reactions |
| Conductive Metal | Ore | Mixture | ChangesState | Solid | No | P0 | Electrical wiring, electronics |
| Magnetic Metal | Ore | Mixture | ChangesState | Solid | No | P0 | Generators, motors |
| Structural Metal | Ore | Mixture | ChangesState | Solid | No | P0 | Frames, hulls, machinery |
| Light Metal | Ore | Mixture | ChangesState | Solid | No | P1 | Lightweight structures, vehicles |
| Heavy Metal | Ore | Mixture | ChangesState | Solid | No | P1 | Shielding, counterweights, ballast |
| Rare Metal | Ore | Mixture | ChangesState | Solid | No | P1 | Advanced electronics, catalysts |
| Radioactive | Ore | Mixture | ChangesState | Solid | No | P1 | Advanced power (late research) |
| Refined reactive | Metal | Element | ChangesState | Solid | Yes | P0 | Batteries, reactions |
| Refined conductive | Metal | Element | ChangesState | Solid | Yes | P0 | Wiring, electronics |
| Refined magnetic | Metal | Element | ChangesState | Solid | Yes | P0 | Generators, motors |
| Refined structural | Metal | Element | ChangesState | Solid | Yes | P0 | Frames, hulls, machinery |
| Refined light | Metal | Element | ChangesState | Solid | Yes | P1 | Lightweight structures |
| Refined heavy | Metal | Element | ChangesState | Solid | Yes | P1 | Shielding, ballast |
| Refined rare | Metal | Element | ChangesState | Solid | Yes | P1 | Advanced electronics, catalysts |
| Structural alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | High tensile strength |
| Conductive alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | Optimised conductivity |
| Heat-resistant alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | High thermal tolerance |
| Lightweight alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | Low mass, structural |
| Magnetic alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | Enhanced magnetic properties |
| Corrosion-resistant alloy | Alloy | Alloy | ChangesState | Solid | No | P1 | Chemical and atmospheric durability |
| Catalytic | Compound | Compound | ChangesState | Solid | Yes | P1 | Accelerates chemical reactions (Metal approximation) |

## 11.2 Silicate

Stone, glass and ceramic minerals; hard and heat-tolerant with negligible energy content.

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Silica | Mineral | Mixture | ChangesState | Solid | No | P0 | Glass, optics |
| Clay | Mineral | Mixture | ChangesState | Solid | No | P0 | Refractories, pipes, bricks |
| Stone | Aggregate | Mixture | ChangesState | Solid | No | P0 | Construction, foundations |
| Insulating | Mineral | Mixture | ChangesState | Solid | No | P0 | Electrical insulation, thermal barriers |
| Crystalline | Mineral | Compound | ChangesState | Solid | No | P1 | Optics, sensors, precision instruments |
| Abrasive | Mineral | Compound | ChangesState | Solid | No | P1 | Cutting tools, grinding |
| Glass | Solid | Compound | ChangesState | Solid | Yes | P0 | Optics, windows, vessels |
| Refined ceramic | Ceramic | Compound | ChangesState | Solid | Yes | P0 | Crucibles, insulators, pipes |
| Refined insulator | Insulator | Compound | ChangesState | Solid | Yes | P0 | Electrical insulation |
| Structural composite (+ Metal / Carbon) | Composite | Composite | Decomposes | Solid | No | P1 | High-performance structures |
| Thermal composite (+ Metal) | Composite | Composite | ChangesState | Solid | No | P1 | Engine linings, heat resistance |

## 11.3 Carbon

Carbon-rich minerals, hydrocarbons and synthetic polymers; moderate-to-high energy content. Most members burn or decompose rather than melting cleanly.

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Carbon-rich | Mineral | Mixture | Burns | Solid | No | P0 | Electrodes, filtration |
| Solid fuel | Deposit | Mixture | Burns | Solid | No | P0 | Direct combustion, power generation |
| Lubricant-capable | Liquid | Compound | Decomposes | Liquid | No | P0 | Bearings, gears, machinery |
| Liquid fuel | Deposit | Mixture | Burns | Liquid | No | P0 | Combustion engines, generators |
| High-density solid fuel | Solid | Mixture | Burns | Solid | No | P1 | Compressed / pre-refined combustion |
| Refined graphite | Solid | Element | Burns | Solid | Yes | P0 | Electrodes, dry lubricant |
| Refined lubricant | Liquid | Compound | Decomposes | Liquid | Yes | P0 | Machinery |
| Refined liquid fuel | Liquid | Mixture | Burns | Liquid | Yes | P1 | Clean combustion |
| Polymer | Solid | Compound | Decomposes | Solid | Yes | P1 | Seals, coatings |
| Adhesive | Compound | Compound | Decomposes | Solid | Yes | P1 | Bonding, sealing |
| Explosive | Compound | Compound | Burns | Solid | No | P1 | Blasting, accelerated mining |
| Chemical solvent | Solvent | Compound | Decomposes | Liquid | Yes | P1 | Cleaning, dissolution |
| Liquid propellant (+ Volatile oxidizer) | Mixture | Mixture | Burns | Liquid | No | P1 | Rocket engines |

## 11.4 Organic

Plant- and biomass-derived solids; low density, low strength, moderate energy.

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Fibrous plant | Material | Composite | Decomposes | Solid | No | P1 | Textiles, rope, composite reinforcement |
| Woody plant | Material | Composite | Burns | Solid | No | P0 | Construction, fuel |
| Organic biomass | Matter | Mixture | Decomposes | Solid | No | P1 | Fertilizer, biogas feedstock |

## 11.5 Water

Aqueous liquids and dissolved-component solutions. Solutions with a secondary archetype (noted in parentheses) are impure by definition.

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Fresh water | Liquid | Compound | ChangesState | Liquid | Yes | P0 | Life support, coolant, steam generation |
| Saltwater (+ Salt) | Liquid | Mixture | ChangesState | Liquid | No | P0 | Electrolytes, chemical feedstock |
| Acidic | Liquid | Mixture | ChangesState | Liquid | No | P0 | Electrolytes, chemical processing |
| Alkaline | Liquid | Mixture | ChangesState | Liquid | No | P0 | Electrolytes, chemical processing |
| Mineral-rich water (+ Salt) | Liquid | Mixture | ChangesState | Liquid | No | P1 | Dissolved mineral extraction |
| Electrolyte solution (+ Salt) | Liquid | Mixture | ChangesState | Liquid | No | P0 | Batteries |
| Coolant | Liquid | Compound | ChangesState | Liquid | Yes | P1 | Thermal management |
| Chemical reagent | Liquid | Mixture | ChangesState | Liquid | No | P1 | Laboratory and manufacturing |
| Concentrated acid | Liquid | Mixture | ChangesState | Liquid | No | P1 | Etching, processing |
| Concentrated alkali | Liquid | Mixture | ChangesState | Liquid | No | P1 | Processing |

## 11.6 Salt

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Sulfurous | Mineral | Mixture | ChangesState | Solid | No | P1 | Chemicals, fertilizers |
| Phosphate | Mineral | Mixture | ChangesState | Solid | No | P1 | Fertilizers, chemical processes |
| Fertilizer | Compound | Compound | ChangesState | Solid | Yes | P1 | Agriculture, food production |

## 11.7 Volatile

Chemically volatile compounds that tend to exist as gas at standard conditions.

| Category | Form | Type | Thermal | State | Refined | Tier | Role |
|---|---|---|---|---|---|---|---|
| Gas fuel | Deposit | Mixture | Burns | Gas | No | P0 | Direct combustion, generators |
| High-energy combustible | Gas | Mixture | Burns | Gas | No | P1 | Propellant feedstock |
| Inert gas | Deposit | Mixture | ChangesState | Gas | No | P1 | Pressurization, welding, cryogenic cooling |
| Breathable atmospheric | Gas | Mixture | ChangesState | Gas | No | P1 | Life support supplement |
| Oxidizer gas | Deposit | Mixture | ChangesState | Gas | No | P1 | Combustion enhancement, propulsion |
| Corrosive gas | Deposit | Mixture | ChangesState | Gas | No | P1 | Etching, chemical processing |
| Toxic gas | Deposit | Mixture | ChangesState | Gas | No | P1 | Industrial hazard (advanced research) |
| Reactive | Liquid | Mixture | Decomposes | Liquid | No | P1 | Volatile high-yield chemical feedstock |
| Gas propellant (+ fuel) | Gas | Mixture | Burns | Gas | No | P1 | Rocket engines |
| Breathable air | Mix | Mixture | ChangesState | Gas | No | P1 | Life support |
| Refined combustible | Gas | Compound | Burns | Gas | Yes | P1 | Clean combustion |
| Compressed inert | Gas | Compound | ChangesState | Gas | Yes | P1 | Pressurization, cooling |
| Refined oxidizer | Gas | Compound | ChangesState | Gas | Yes | P1 | Propulsion, combustion |

# 12. Rarity bands

Survey and market language share a single rarity vocabulary for substance occurrences:

- Abundant
- Common
- Uncommon
- Rare
- Very Rare
- Ultra Rare
- Legendary
- Anomalous
- Unique

Rarity describes how often an occurrence presents in a given geology or market context. It is not a substitute for substance identity.

# 13. Strategic exception: Veyrite

**Veyrite** is already established in the Expanded Lore Bible as a rare phase-coherent lattice material discovered in Year 5100 and essential to the Vector Exchange Drive. It is a strategic civilisation-limiting material, not an ordinary P0 bootstrap ore.

This materials chapter does not re-catalogue Veyrite as a routine industrial category. Games and commercial texts that mention Veyrite must remain consistent with the foundation bible. Ordinary crystalline silicate minerals in the P1 catalogue are not Veyrite.

# 14. What this document does not model

- Salvage / ship-component inventory
- Mutable prices, reserves, contract terms, quality rolls and player stock
- Desktop world-generation algorithms and survey micro-generation procedures
- A complete Food / nutrition product family (deferred pending explicit product decision)
- Plasma / stellar substance families beyond the brief Plasma note in Appendix A

# 15. Deferred topics

**World link (Desktop-owned runtime).** Planetary survey uses a two-tier approach: remote scans reveal broad archetype presence; physical survey instantiates specific named occurrences under category identities. Until named instances are materialised into Universe structured data, those names remain game/runtime output, not competing canon catalogues.

**Future substance types.** Plasma-phase and other exotic stellar classifications may be appended later; they are not part of the P0/P1 industrial spine.

**Structured Universe collection.** A future `substances` JSON collection should publish stable IDs agreeing with the categories in §11. Commercial operation demand should eventually reference those IDs rather than free-floating display names.

---

# Appendix A — Designer truth: property vocabulary and derivation rules

> **Knowledge scope: designer truth**  
> The following rules are engineering/simulation canon imported from Desktop substance design. They may be exposed in the Lore Explorer because Universe documentation deliberately includes designer truth, but they are not Year-5300 citizen encyclopaedia text.

## A.1 Core properties (0.0–1.0 scale)

| Property | Meaning |
|---|---|
| Density | Mass for volume; freight, ship weight, shielding |
| Bond Strength | How strongly constituents are held; melting/boiling, heat resistance, refining energy |
| Reactivity | Chemical interaction and dangerous combinations |
| Electrical Conductivity | Wiring, motors, generators, batteries, electronics |
| Thermal Conductivity | Heat transfer, radiators, exchangers, insulation |
| Toughness | Resistance to cracking, impact, vibration |
| Energy Content | Stored useful energy; fuels, combustibles, explosives, propellants |
| Purity | Useful substance versus waste |
| Toxicity | Harm to colonists, crops, animals and biological systems |
| Corrosiveness | Harm to equipment, pipes, tanks and machines |
| Nuclear Stability | High = stable/safe; low = radioactive |
| Viscosity | Liquid flow; pumping, blockage, extraction rate |

Additional gameplay ratings may be derived (structural strength, heat resistance, insulation rating, refining difficulty, flammability, explosiveness). Some are P1 refinements rather than P0 requirements.

## A.2 Derived fields

| Derived field | Rule |
|---|---|
| State | From ambient temperature vs melting/boiling points when set; otherwise StandardState |
| Density / StructuralStrength / Hardness / EnergyContent | Weighted averages across composition entries |
| IsFuel | EnergyContent ≥ FuelThreshold (default 0.3) |
| DominantElement | ElementId with highest summed fraction |
| Purity | Summed fraction of the dominant ElementId |
| IsRefined | Purity ≥ RefinementThreshold (default 0.90) |

Plasma requires a separate high PlasmaThreshold and is an extreme edge case.

## A.3 Category property ranges

Per-category numeric ranges for P0/P1 deposits (the detailed rule tables used by Desktop generation) remain Desktop engineering provenance until published as structured Universe profiles. Consumers needing exact range tables should consult the Desktop `PropertyRules` design source or a future materialised `substances` collection that freezes those ranges.

# Appendix B — Designer truth: P0/P1 category roll-up

> **Knowledge scope: designer truth**

### P0 raw (17)

Metal: Reactive, Conductive, Magnetic, Structural.  
Silicate: Silica, Clay, Stone, Insulating.  
Carbon: Carbon-rich, Solid fuel, Lubricant-capable, Liquid fuel.  
Water: Saltwater (+ Salt), Acidic, Alkaline.  
Volatile: Gas fuel.  
Organic: Woody plant.

### P0 refined (11)

Metal: Refined reactive, conductive, magnetic, structural.  
Silicate: Glass, Refined ceramic, Refined insulator.  
Carbon: Refined graphite, Refined lubricant.  
Water: Fresh water, Electrolyte solution (+ Salt).

### P1 raw (24)

Metal: Light, Heavy, Rare, Radioactive.  
Silicate: Crystalline, Abrasive.  
Carbon: High-density solid fuel.  
Organic: Fibrous plant, Organic biomass.  
Water: Mineral-rich water (+ Salt), Chemical reagent, Concentrated acid, Concentrated alkali.  
Salt: Sulfurous, Phosphate.  
Volatile: High-energy combustible, Inert gas, Breathable atmospheric, Oxidizer gas, Corrosive gas, Toxic gas, Reactive, Gas propellant (+ fuel), Breathable air.

### P1 refined (23)

Metal: Refined light/heavy/rare; Structural, Conductive, Heat-resistant, Lightweight, Magnetic, Corrosion-resistant alloys; Catalytic.  
Silicate: Structural composite (+ Metal / Carbon), Thermal composite (+ Metal).  
Carbon: Refined liquid fuel, Polymer, Adhesive, Explosive, Chemical solvent, Liquid propellant (+ Volatile oxidizer).  
Water: Coolant.  
Salt: Fertilizer.  
Volatile: Refined combustible, Compressed inert, Refined oxidizer.

---

*End of Materials of the Commonwealth.*
