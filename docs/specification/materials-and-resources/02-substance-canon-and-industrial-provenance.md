# UNI-MAT-002 — Substance Canon, Industrial Catalogue and Consumer Responsibilities

**Authority:** [materials lore](../../../data/lore/Koplin_Universe_Materials_And_Substances.md) outranks all source-era counts and JSON; [canon precedence](../DESIGN_AUTHORITY.md). **Original source reviewed fully:** [Substance Canon — Consumer Architecture](../../SubstanceCanon.md) (UNI-SRC-017), published-architecture status at its writing; no latest live JSON check completed. Companion: [material classification](01-material-classification.md).

## Shared identity and game-owned quantity

Universe is the authored material/industrial vocabulary owner. A stable `substanceId` is a reproducible reference across games; a **part**, **machine** and **building** has its own stable canonical ID and relationship, not a duplicate substance identity. A game can map a physical substance category to UI categories such as Food, Build, Fuel or Ore, but the authored parent category and physical restrictions stay Universe-owned. Games own production recipes, build price, worker count, power consumption, installed object level, site placement, per-save extracted quality and reserve, markets, contracts and simulation.

The source describes a published graph: `data/substances.json` (historically **75 source P0/P1 substance categories plus 5 Mobile integration ontology parents**), `data/parts.json`, `data/machines.json`, `data/buildings.json`, plus `substance-archetypes.json`, `substance-properties.json`, and `rarity-bands.json`. Historical seven archetypes and nine rarity bands were catalogue classifications, not a guarantee all are active in current game simulations. **An earlier 22-building count is obsolete relative to the [6 October art audit](../assets-and-logistics/03-mobile-art-identity-and-coverage.md) reporting 24; verify actual authored records, not prose counts.**

## Per-substance publication

The original public-record fields include `id`, `name`, `description`, `substanceType`, `thermalBehaviour`, `standardState`, `dominantArchetype`, `form`, `refined`, `tier`, `industrialRole`, `sourceDocumentId`, `sourceSection`, `canonStatus`; image metadata is optional. Category art is identity-neutral, with 1:1 full-bleed catalogue stills only where an `image` record exists; ontology parent categories do **not** require fabricated visual assets. Do not bake rarity, player-specific grade/amount, corporate branding or Veyrite into another material's generic image.

The source's image-generated counts are **dated claims**. Present image metadata must agree with `generated`, status and on-disk original/WebP art before validation declares a record complete.

## Reconciling Desktop and Mobile designs without parallel canons

The historical industrial import tool (`scripts/import-industrial-catalogue.mjs`) can read a Desktop root or its Machines & Buildings directory, resolve source substance/part/machine/building references, reject unknown IDs before publication, and preserve reconciled Universe wording/provenance and Mobile-only canonical buildings. A source-driven importer is **not** a second published catalogue: the curated, lore-compatible materialised `data/` records remain authoritative.

Mobile mappings illustrated by the source: Housing→`building-habitat`; Power Plant→`building-power-plant`; Industry→`building-industry`; HQ→`building-headquarters`; Farm/Ranch/Bio-Harvester/Algae Facility map to their authored IDs; Quarry/Rig/Simple Mine/Deep Mine/Spaceport likewise. Desktop-only authored physical building archetypes include Collection Camp, Water Collector, Basic Refinery, Research Building, Shipyard Bay, Stockpile and Warehouse. **`building-crashed-ship` is an authored scenario archetype, not evidence the crash event/ship is a persistent player-built Universe entity.**

The Directory's historical grouping (Substances: archetype → Raw/Refined; Parts: category/subcategory; Machines/Buildings: category) is a *read projection*. Do not encode different canonical copies solely for a game screen.

## Current boundaries, status and tests

The original described validators `validation/validate-universe.mjs` and `validation/validate-industrial-catalogue.mjs`, plus cross-repo importer options; current scripts, collection contents and CI were **not run** in this doc pass. Validate unique IDs, source provenance, no unresolvable cross-references, no game save terms in canon records, compatibility of all intended platform building concepts, and exact current manifest population before recording implementation. Later Universe schema versions supersede the source's earlier counting and collection-stage assumptions.

**Original kept intact; whole source meaning mapped; current lore/JSON consumer parity open.**


## Original industrial publishing feature — UNI-SRC-018 completely reviewed

[Feature Spec: Publish Substance and Industrial Design](../../SubstanceCanonFeatureSpec.md) documents a distinct historical **Universe content-0.8.0** publication project whose status was **“Complete — merge candidate pending final CI”**, not proof of a present green build. It formalised four manifest-linked industrial collections: `substances` → `parts` → `machines` → `buildings`, with reverse link views derived by Directory/validation rather than maintained as separate production truth.

The original deliverable was **75** P0/P1 material categories grounded in higher materials lore, stable part and machine definitions, and **22** historical deduplicated building archetypes from **14 Desktop** + **13 Mobile** building kinds. Later authored-world expansion added the aquaculture and agricultural dome identities in the dated 24-building audit; never reduce a live canonical collection back to 22 because this older checklist says completed. Legacy Desktop's `Used In` declarations cannot silently reverse the relationship owner: **`machine.partIds` is authoritative**, `part.machineIds` is a **derived/reconciled reverse index**, and unresolvable or contradictory references must fail before publication.

The original importer accepts a Desktop repository root **or** `Machines & Buildings` directory. It should fail fast on missing substance/part/machine links, preserve reviewed Universe provenance/description, and retain already canonical Mobile-only buildings. Game-specific cost, quality, construction/site placement, staffing, power, site levels, unlocks and player ownership remain excluded. The crashed ship is a salvage/scenario infrastructure archetype, not an instantiated universal settlement.

Publication targets **canonical Lore Explorer materials Markdown** and the Directory's four manifest-backed collection groups only; no shadow embedded JavaScript dataset. Required checks include stable IDs/references, full relevant building mapping, explicit provenance, reciprocal part/machine integrity, authored descriptions rather than mutable save prose, and syntax for the import tooling. The source checked all feature criteria except **its final branch-head CI**; **we have not rerun its validation, inspected the old merge, or proved live consumer parity**. Its deferred work explicitly leaves Mobile inventory conversion, procedural sample generation, new fuel/manufacturing recipes and commercial substanceId conversion to other game-owned projects.

This history is **not** an approval of Android issue-#114's proposed four Parts/eight Machinery *functional supply families*. Those remain undecided aggregate Mobile packaging choices, beneath the actual canonical physical archetypes.


## Foundation materials companion fully reconciled — UNI-SRC-003, CANON retained in place

The complete [Materials of the Commonwealth — Substances & Industrial Classification](../../../data/lore/Koplin_Universe_Materials_And_Substances.md) source was reviewed on 14 October, **sections 1–15 and designer-truth appendices A/B**. It is **higher-priority lore CANON** in its existing location, **not** a lower-priority document to copy, simplify or supersede in this chapter. Precise per-category P0/P1 classifications and authored names remain directly controlled by its §11 tables and Appendices.

The foundation defines three separate identities: **substance** (reusable industrial material), **occurrence/deposit** (local physical material generated/discovered by a game), and **refined output** (processing result, which may be manufactured intermediates). Parts, machines, salvaged ship modules and installed capital are **not** substances.

- **SubstanceType:** Element, Compound, Alloy, Composite and Mixture. **ThermalBehaviour:** ChangesState, Decomposes or Burns (dominant behaviour only). **StandardState** at approximately 20°C/1 atm is Solid/Liquid/Gas; the current local phase can change with environmental temperature where reliable melting/boiling points exist. A substance ID does **not** change when its current phase changes.
- **Seven primary material archetypes:** Metal, Silicate, Carbon, Organic, Water, Salt and Volatile. These are broad industrial simplifications; a reactive acid/alkali mixture may be Water-dominant, sulfur/phosphate Salt-dominant, industrial catalyst approximated under Metal. No mandatory eighth generic Food substance archetype is granted by this old foundation; later **biological Food identities are canonised separately** in `mobileBiologicalResources`.
- **Composition identity** comprises per-element fractions summing to **1.0**, each with archetype/property contributions. **Purity** is summed fraction of the **single dominant element ID** (not same-archetype percentage); two different metals remain an impure alloy. Original designer default **`RefinementThreshold=0.90`** is meaningful for intended purified outputs; alloys/composites/mixtures can be commercially refined/manufactured while remaining chemically impure. Avoid incorrectly translating `IsRefined` to “all manufactured materials must have purity 90%”.
- **Fuel is a derived use/quality**, not a material archetype: historical default `EnergyContent ≥ 0.30`. Woody plant and natural carbon fuels can qualify; neither that formula nor Mobile's Fuel inventory group means every energy-rich deposit can go directly into a ship's Fusion Fuel/Propellant tank.
- **P0/P1 categories:** the complete source's **28 P0 (17 raw/11 refined)** and **47 P1 (24 raw/23 refined)** comprise **75 industrial categories** with type, physical state, dominant archetype and industrial role. Desktop P0/P1 scenario-stage semantics cannot automatically override a different Mobile capability tree.
- **Nine rarity terms:** Abundant, Common, Uncommon, Rare, Very Rare, Ultra Rare, Legendary, Anomalous, Unique. A rarity band is descriptive occurrence vocabulary, not an exact per-save spawn percentage or proof a resource exists here.
- **Veyrite strategic exception:** foundation Lore Bible's Year-5100 phase-coherent lattice enabling the Vector Exchange Drive is **not** a routine P1 silicate/Crystalline Mineral. A material may be crystalline without being Veyrite; preserve the cross-game drive's exceptional physics/supply.

**Designer-truth Appendix A** provides 12 core property meanings on historical 0–1 scales — Density, BondStrength, Reactivity, Electrical/ThermalConductivity, Toughness, EnergyContent, Purity, Toxicity, Corrosiveness, NuclearStability, Viscosity — and derives weighted physical properties from constituent fractions. **Full numeric per-category property sampling/ranges remain Desktop engineering provenance unless materialised as approved Universe facts.** Designer-truth Appendix B has the complete 17/11/24/23 category roll-ups, while the public §11 has all category definitions. This chapter does **not** create a parallel 75-row material catalogue.

**Deliberately excluded by the foundation:** game quality/stock/prices, per-save surveys/deposits, salvage inventory, full Food/nutrition catalogue, plasma/stellar materials beyond boundary note, and material-specific production balancing. Consumers must honour `knowledgeScope` distinction when designer truth is not meant as in-world certainty.

The existing [materials lore](../../../data/lore/Koplin_Universe_Materials_And_Substances.md) remains intact and authoritative; this is a **source mapping** with review proof, not an alternate canon file.
