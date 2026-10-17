# 03 — Production, Logistics and Long-Term Progression

**Status:** shared long-term vision with concrete canonical context; future Mobile manufacturing and numerical rules are **not approved for implementation**.

## 1. The economic choice

Deep Reach charter section 18 establishes three uses for extracted resources: (1) export raw, (2) process before export, (3) retain in local industrial economy. Those choices extend naturally to a mature multi-system mining corporation. Processing improves value or creates usable feedstock, but takes capital, power, people and appropriate equipment. Manufacture reduces dependence on imported machines and parts, but might tie up profitable exports.

**No universal substitution:** raw Copper Ore is not immediately a working electrical circuit; raw Sulfur is not a generic Industry fuel; every Ore is not a material suitable for every structure.

## 2. Candidate material and product chains (NOT full recipes)

| Examples of raw feedstock | Plausible processed/intermediate products | Subsequent Parts/Machinery use |
| --- | --- | --- |
| Iron, Nickel, Chromium, Titanium ores | Structural alloys, suitable treated/precision metals | P1 Mechanical & Wear; M1/M6/M7 and hull construction |
| Copper, Silver, Gold, Quartz/Silica | Conductive stock, glass, insulating stock | P2 Electrical & Computing; M2/M3 |
| Clay, Silica, Mica, heat-resistant minerals | Refined ceramic, refractory, glass, insulation | P3 Fluid & Environmental; P4 Process & Thermal; M5 |
| Crude Oil, Natural Gas, Biomass | Lubricants, polymers, industrial chemicals | P1 mechanical maintenance; P3 fluid seals and filters |
| Lithium, Graphite, Cobalt, Rare Earths | Battery/magnetic material, high-tech electrical feedstock | M2 power and higher-capability M8, specialised control |
| Hydrogen, Helium-3 and suitable fuels | Refined/compatible reactor fuel, propellant or industrial gas | Power/ship operation, **distinct consumable fuels** |
| Suitable high-performance materials / Veyrite | Advanced precision assemblies subject to genuine tech/process gates | High-rated mobility, orbital and interstellar infrastructure |

Actual ingredient identity and composition must use published canonical substances and the game's explicit processing catalogue. Existing `part.substanceIds` relationships indicate composition **not yields, substitutes, machine hours, prices or balanced recipes**. The chemical and thermal chains must be physically credible; do not turn every future refinement mode into the same recipe with a different icon.

## 3. One product hierarchy, many factories

```text
Mine / Rig / Harvester             raw stock
Refinery / Chemical Works          processed material, fuel
Fabrication / Parts Workshop       Parts (P1-P4, proposed)
Machine Assembly Works             Machinery (M1-M8, proposed)
Major Assembly Yard / Shipyard     equipped vessel, station or industrial asset
```

A workshop may unlock successive modes; a processing plant may specialise in metal, glass/ceramic, gas or chemical streams; a shipyard need not create unique 'ship-only machines'. The final asset is identified by its canonical archetype or ship class, but draws from the **same inventories and compatible machinery families**.

Advanced electronics, cryogenics, reactors and Veyrite drive technology are not automatically available because a workshop makes generic P2 or M8. Research, precise materials, safe environment and calibration capabilities remain meaningful restrictions.

## 4. Industrial depth rather than all-at-once independence

Deep Reach scenario section 20 describes levels: replace consumables → workshop repair → manufacture common parts → advanced parts → strategic independence. This progression motivates Mobile's future development but does not impose Desktop-style per-part gameplay on Mobile.

An illustrative, **not yet approved release sequence**:
1. Raw exports and corporate equipment purchases.
2. Basic refining and local processing.
3. Parts workshop and repair/salvage.
4. Machinery assembly and more material chains.
5. Specialised orbital/asteroid/gas extraction; regional hubs and stations.
6. Advanced manufacturing, ship/station construction and interstellar autonomous logistics.

The canonical charter's narrative one-year support and longer industrial aspirations are setting references. A Mobile release must set its own pacing deliberately, not misapply narrative dates as pre-implemented production timers.

## 5. Distributed stock and logistics

A corporation owns assets at different planets, moons, stations and ships. **No instantaneous global stockpool.** Purchases, manufacturing, installed equipment, salvage, transport and trade reconcile at real locations.

Supporting systems eventually include: warehouse/stockpile capacities; transport and tanker schedules; orbital transfer and docking; importer lead times; starter and emergency reserves; shipment delays/loss; corporate regional demand, market pricing and procurement. A central refinery may serve remote colonies, but delivery time, cost and cargo space should influence whether local refining is better.

Machinery is a capital stock item while loose, then **installed** into a specific asset. Only compatible and salvageable equipment returns to movable stock after removal. Parts are consumable and must be acquired or manufactured continuously for continued service. Cargo burden/mass, conditions, warranties, ownership and refurbishing remain unresolved product/game rules.

## 6. Player-facing feedback

Future Mobile can communicate each bottleneck through compact summaries: *What is missing?* (P2 spares, M5 processing, refined structural metal); *Where?* (Colony Alpha, station, ship); *How long?* (days of spares remaining, order ETA); *Impact?* (what production/services are threatened). Desktop may expose exact machine inventory, maintenance condition and production jobs.

Automation reduces manual workforce effort but may increase electrical/control part demand, matching the charter's industrial trade-off. Emergency life support must not be disabled by an abstract Industry capacity switch.

## 7. Limits

No exact recipes, rate constants, capital costs, part-consumption formula, depreciation curve, new module names, order frequency or manufacturing implementation is authorised here. The [decision register](04-decisions-and-evidence.md) and per-platform design must resolve these.
