# 02 — Corporate Assets and Capability Coverage

**Status:** full mature-world *design envelope*, not an approved release schedule or list of individually buildable Mobile tiles. Derived from [Deep Reach scenario](../../../data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md), [canonical buildings](../../../data/buildings.json), [facilities](../../../data/facilities.json), [ship classes](../../../data/ship-classes.json), Desktop design and Mobile #114.

## 1. Operating environments

| Where | Assets or operations the economy should support | Primary capability composition |
| --- | --- | --- |
| Terrestrial planet or moon | Surface camps, open/deep mines, liquid/gas rigs, water/ice, agriculture and habitats | Extraction, Environmental, Power, Control, Logistics |
| Extreme surface / ocean / cryogenic world | Corrosive brine rigs, seabed recovery, thermal protection, sealed settlements | Extraction, Fluid, Process, Power, Environmental |
| Asteroid, comet or ring | Anchored excavators, volatile harvest, small processing units, tugs and transshipment | Extraction, Logistics, Control, Mobility |
| Gas/ice giant atmosphere | Skimmers, gas capture/compression, floating collection platform if viable | Extraction, Mobility, Control, Fluid, Power |
| Orbit / space | Refineries, processing platforms, solar arrays, cargo hubs, dry docks, warehouses, depots, communications relays, habitats | Refining, Manufacturing, Power, Control, Logistics, Environmental |
| Fleet and mobile work | Survey craft, bulk freight, colonist transports, tankers, rescue/repair tenders, tugs, drones, vehicles | Mobility plus mission-specific families |
| Multi-system corporation | Regional refining hub, central factory, freight network, shared services, emergency reserves, research and procurement | Corporate policies and logistics; **not** one global teleporting stockpile |

A gas giant has no normal land-square surface; its harvester is an atmospheric/orbital asset. Asteroids must not be presented as full continental landscapes simply to reuse a mine UI.

## 2. Facility capability inventory

| Capability | Existing Universe building identity or candidate strategy | Horizon |
| --- | --- | --- |
| Mines, quarries, extraction rigs, food, water, power, housing, HQ | Existing `building-simple-pit-mine`, `building-quarry`, `building-extraction-rig`, `building-farm`, `building-water-collector`, `building-power-plant`, `building-habitat`, `building-headquarters` | Present concept; Mobile implementation scope differs |
| Inventory and handling | `building-stockpile`, `building-warehouse`, `building-spaceport`; modular depot services | Early / later logistics |
| Basic ore refining | `building-basic-refinery` | Future Mobile |
| Advanced metal/silicate, glass/ceramic | Basic Refinery upgrades/process modes first; propose new archetype only if different business behaviour | Future |
| Chemical/gas processing and fuel synthesis | Processing mode or a properly defined new chemical plant | Future |
| Repair, parts manufacture and machine assembly | Actual fabrication/repair/assembly `building-industry` can be a **later Workshop/Factory**; it is **not** legacy magical Industry capacity | Future |
| Research, metrology, advanced computing | `building-research-building` and relevant machine archetypes | Future expansion |
| Refit, assembly and construction | `building-shipyard-bay`; assembly of ships/stations uses same Parts/Machinery stocks as other assets | Late future |
| Space habitats, comm relays, stations, gas/asteroid platforms | Composite assets/module/blueprint system; new authored archetypes need Universe reconciliation | Future |
| Salvage, recycling, medical response, fleet servicing | Workshop/warehouse/refinery/spaceport functions, fleet services; no default separate tile per verb | Future / cross-cutting |

**'Capability' ≠ 'building'.** A Spaceport may have a refuelling service; a Workshop may repair and fabricate; a refinery may offer alternative products. Only promote a service to a new buildable archetype when it creates a meaningful standalone placement, staff, power, technology or production decision.

## 3. Candidate Mobile Parts family taxonomy — not yet approved

| ID (proposal only) | Family | Examples and broad compatibility |
| --- | --- | --- |
| P1 | Mechanical & Wear | Shafts, bearings, drives, cutting kits, handling machinery, industrial vehicles |
| P2 | Electrical & Computing | Conductors, computers, sensors, navigation/control modules, monitoring |
| P3 | Fluid & Environmental | Seals, filtration, pumps/valves, life-support and biological systems |
| P4 | Process & Thermal | Refractory, high-heat/chemical tooling, processing and thermal shielding |

These group actual Universe [14 parts](../../../data/parts.json), and can appear under one expandable **Parts** heading in Mobile. The family labels and counts are **not canonical IDs**.

## 4. Candidate Mobile Machinery family taxonomy — not yet approved

| ID (proposal only) | Family | Assets demonstrating cross-use |
| --- | --- | --- |
| M1 | Extraction | Ground mine, asteroid miner, volatile harvester |
| M2 | Power | Surface plant, orbital platform, spacecraft power |
| M3 | Control / Computing / Communications | HQ, science site, station relay, ship control |
| M4 | Environmental / Agricultural | Food, life support, habitat, crewed platform |
| M5 | Refining / Chemical Processing | Smelter, fuel processor, gas separation, orbital refinery |
| M6 | Manufacturing / Assembly | Parts works, machine works, shipyard, orbital construction |
| M7 | Logistics / Handling | Warehouse, spaceport, loading gear, depot |
| M8 | Mobility / Propulsion | Ground rover, skimmer, shuttle, tug, freighter, stationkeeping |

The earlier 3+4 and 4+7 suggestions were **superseded exploratory recommendations**, not approvals. **4+8 remains open D00**. Never add *Ship Equipment* or *Gas Giant Parts* merely for a change of location.

## 5. Compatibility examples — qualitative, not quantitative bills of materials

| Asset | Machinery | Replacement Parts families |
| --- | --- | --- |
| HQ or communication relay | M3, optionally M2 | P2 |
| Surface mine / asteroid miner | M1, M7 where handling required; mobile miner M8 | P1, P2, optionally P3 |
| Power plant / solar orbital array | M2, M3 where needed | P1, P2, optionally P4 |
| Farm / habitat / dome | M4, M3 where needed | P2, P3, optionally P1 |
| Basic refinery or chemical plant | M5, M7 optional | P1, P2, P3, P4 as actual process demands |
| Parts / machine factory | M6, M3, M7 optional | P1, P2, P4 as needed |
| Spaceport, warehouse, depot | M7, M3 optional | P1, P2, P3 for specialised fluids |
| Gas giant skimmer | M1, M8, M3; optional M5/M4 | P1, P2, P3, maybe P4 |
| Ship / orbital tug | M8, M2, M3, M7 as appropriate; M4 when crewed | P1, P2, P3, optionally P4 |
| Orbital station | M2, M3, M7 plus M4/5/6 based on role | matching Parts families |
| Shipyard / refit dock | M6, M7, M3, M2 | P1, P2, P4 |

**Example is not an install checklist:** these rows illustrate design coverage only. A particular power plant might use one of several canonical generator machines; the Universe `building-power-plant.machineIds` list does not require *all* generators to be installed.

## 6. Missing authored archetypes — canon work when selected

The current 24 building records and 32 ship classes are not a complete list of buildable stations, skimmers or orbital tugs. [Named Universe facilities](../../../data/facilities.json) are world facts, not player-buildable blueprints by implication. When a new asset is approved, decide whether it is an existing building variant, an installed module, a vehicle/vessel class or a new station identity, then publish appropriate authored identity in Universe. Mutable price/placement/condition remain in game state.
