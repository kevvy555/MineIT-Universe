# UNI-ASSET-001 — Common Asset Concept and Lifecycle

**Status:** user-agreed cross-game industrial principle, with candidate schema still proposed. **Sources:** [#114](https://github.com/kevvy555/MineIT-Android/issues/114), [shared industrial model](../industrial-economy/01-industrial-model.md), [Universe Buildings](../../../data/buildings.json), [Ship classes](../../../data/ship-classes.json), [Facilities](../../../data/facilities.json).

## Asset is a functional concept, not one rendering class

An asset may be a surface building, deep mine, wheeled vehicle, atmospheric gas skimmer, asteroid rig, stationary orbital station, propulsion craft, tanker, refinery ship or large shipyard. These assets have different movement/site physics but overlap in industrial requirements.

**Agreed shared industrial principle:** use compatible common Parts/Machinery/product stocks across asset kinds. Don't add a ship-only replacement machine economy; don't claim that stock teleports between worlds.

## Lifecycle semantics

```text
Blueprint / plan
 -> structure/foundation or hull materials secured
 -> equipment + commissioning Parts acquired and installed
 -> staffed/crewed and powered/fuelled
 -> operational asset
 -> maintained, improved/refitted, stopped, mothballed or repaired
 -> relocated or dismantled, with salvage/disposal rules
```

The actual gating order remains open (Mobile D04). A parked ship with installed Machinery is not equivalent to loose equipment inventory. Upgrading an asset adds new capability rather than buying every old installed item again without a reason.

## Identity boundaries

- **Universe:** persistent authored building or ship class ID, family of machine/part types, fictional manufacturer/name and world-specific physical meaning.
- **Game runtime:** instance location, cargo, equipment stock, installed units, ownership, condition, labour/crew, fuel, temporary damage and daily costs.
- **Assets not yet authored:** orbital station blueprint, industrial tug, gas skimmer, automatic asteroid rig may require a new canonical asset identity (or approved variant) before player fabrication. Named `facilities.json` records are lore/organisations, not automatically player-buildable blueprints.

## Operation adapters

- Surface building: terrain occupancy, extraction deposit binding and local Power/worker network.
- Vessel: route, crew, travel, tank, docking and fleet ownership.
- Atmospheric skimmer: gas atmosphere, storms/altitude/propulsion and harvest.
- Station: fixed orbital coordinates, transfer/docking, life support and modules.
- Mobile rig/tug: mission/location and production/transport work.

**Never** implement them as one giant class that forces a ship to pretend to be a surface grid tile. Share inventory, installation, maintenance and construction semantics, not every runtime controller.
