# Building level equipment quantities

Approved 23 November 2026. Canonical quantities are authored in
`data/buildings.json`, under each configuration's `equipment.quantityByLevel`.

| Building group | L1 | L2 | L3 | L4 | L5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Quarry, Simple Pit Mine, Deep Mine, Extraction Rig, Power Plant, Industry, Basic Refinery, Shipyard Bay, Research Building | 1 | 2 | 3 | 5 | 8 |
| Water Collector, Farm, Ranch, Bio Harvester, Algae Facility, Aquaculture Facility, Habitat, Agricultural Dome, Warehouse | 1 | 2 | 3 | 4 | 6 |
| Headquarters | 1 | 1 | 2 | 3 | 4 |

Each quantity is the total required count of each required machine type in the
selected building configuration at that level. It is not the additional count for
an upgrade. Consumers calculate an upgrade's additional equipment from the
difference between the existing and target configurations.

The same curve applies to alternative configurations of a building, preserving
their distinct machine identities and applicable levels. Optional and conditional
equipment quantities are unchanged. Buildings without required machines retain
their existing definitions and supported levels.

Fitted parts remain defined by each machine's service-part requirements: more
machines require proportionally more fitted parts. Loose spare parts are a
separate procurement choice. These counts describe structural equipment; output,
staffing, power and mutable installed-equipment state remain consumer concerns.
