# Ship Class Runtime Profiles

Status: Canonical schema v6 extension for Year-5326 ship procurement and travel simulation

## Purpose

`shipClassRuntimeProfiles` is the canonical one-to-one runtime extension for ship classes that need deterministic gameplay-facing production and transit metrics without duplicating the full ship-class catalogue.

The base `shipClasses` collection remains the owner of persistent ship identity, manufacturer, line, capacities, crew limits, Vector Exchange capability, transit rate, list price, image identity and descriptive canon.

A runtime profile references one class by stable `shipClassId` and adds only metrics that are persistent product facts but were not present in the original class catalogue:

```json
{
  "id": "ship-class-runtime-dart-courier",
  "shipClassId": "ship-class-dart-courier",
  "production": {
    "factoryLeadTimeDays": 120
  },
  "specifications": {
    "fuelUsePerLightYear": 517
  }
}
```

## Canon boundary

The Universe owns:

- normal factory production/allocation lead time for the class;
- absolute interstellar fuel consumption per light-year for Vector Exchange-capable classes.

Games own:

- the actual date an order is placed;
- player-specific discounts and final paid price;
- temporary congestion, shortages or rush-production modifiers;
- delivery queue state and current order status;
- fuel actually loaded and consumed by a particular vessel.

`factoryLeadTimeDays` is therefore the normal Year-5326 product lead time, not a promise that every player order will always arrive on that exact day once future market systems exist.

## Fuel use

For Vector Exchange-capable ships:

```text
fuelRequired = routeDistanceLy × fuelUsePerLightYear
```

The value is continuous and should be applied proportionally to fractional-light-year routes. It is the simulation value; `fuelEfficiencyRating` remains presentation/comparison metadata.

Non-Vector-Exchange classes publish `fuelUsePerLightYear: null` because they cannot make interstellar Vector Exchange transits.

## Starter colony vessel

Schema v6 also materialises the MineIT charter starter vessel as:

`ship-class-asterion-pioneer-colony-transport`

It is an Asterion Nomad-line charter expedition transport and is deliberately `charter-issued`, not one of the 30 factory-new retail listings. This lets MineIT saves point to a stable canonical class while preserving the existing starter vessel's capacities and baseline operating characteristics.

## Consumer rule

Consumers load `shipClasses` and `shipClassRuntimeProfiles`, join them by `shipClassId`, and treat the merged result as one read-only product view. A consumer must not hand-author a second independent catalogue of these values.
