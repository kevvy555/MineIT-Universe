# UNI-ASSET-002 — Ship Class Products, Factory Supply and Transit Profiles

**Owner:** Universe persistent ship-class identities and Year-5326 commercial product facts · **Status:** source-backed canonical boundary; source counts/prices/identities must be checked against current authored JSON before publishing as latest · **Reviewed:** 14 October 2026.

**Originals fully reviewed and preserved:** [Shipbuilding Sector & Purchase Catalogue](../../ShipbuildingSectorAndPurchaseCatalogue.md) (UNI-SRC-016) and [Ship Class Runtime Profiles](../../ShipClassRuntimeProfiles.md) (UNI-SRC-015). Related [asset lifecycle](01-asset-types-and-lifecycle.md), [commercial contacts](../commerce-and-corporations/02-commercial-contacts-and-offers.md), [Universe identity authority](../DESIGN_AUTHORITY.md), and [Mobile fleet owner](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/fleet-and-logistics/README.md).

## Catalogue and stable class identity

Universe `shipClasses` is the authored identity/product specification: manufacturer, ship line, physical capacity, minimum/maximum crew, interstellar capability, time per light-year, range/speed/fuel/reliability metadata, atmospheric capability, berth, special traits, canonical list price and artwork identity. Universe `shipLines` groups class design language without duplicating individual specifications. A manufactured class and an individual named/owned vessel are **not the same persistent entity**.

The original Year-5326 launch source records **five** manufacturer strategies and **ten** lines:

| Manufacturer (source) | Distinguishing product philosophy | Lines in original catalogue |
| --- | --- | --- |
| Asterion Shipworks | Specialist and adaptable frontier craft | Dart, Nomad |
| Kestrel Aerospace Systems | Speed, acceleration, rapid turnaround; fuel/premium tradeoff | Flight, Vanguard |
| Keystone Modular Fabrication | Standard cargo frames, commonality, logistics flexibility | Caravan, Network |
| Longreach Engineering | Endurance, efficiency, reliability, deep-route capacity | Reliant, Horizon |
| Crownline Heavy Works | Slow, high-volume bulk freight at low acquisition cost per cargo | Foundry, Worldline |

The source describes **30 factory-new retail classes** and deliberately excludes source-canonical Pathfinder and Prospector reference classes from speculative manufacturer assignment. These are **source-era catalogue claims**, not a replacement for the latest `data/ship-classes.json` record count. Factory-only purchase release explicitly excludes second-hand sales.

## Persistent product facts versus mutable purchase state

Universe may canonically publish:
- stable class/line/manufacturer IDs, factory-standard reference artwork;
- Year-5326 manufacturer **list price**, currency `currency-commonwealth-credit`, price effective year, product specifications and normal factory lead time;
- operation-owned production demand (`shipClassIds` on relevant shipbuilding operations) and structural feedstock/quality requirements.

A game/save exclusively owns **actual** order date, availability, production queue, congestion/shortage/rush modifiers, discounts/reputation, financing/insurance, live buyer quote and payment, delivery status, used value/trade-in and transport of the bought vessel. The first Mobile purchase may use the manufacturer list price unchanged, but it does not make final paid price canonical.

Artwork for a factory-default class is not individual named-ship art. The original first-release rows had `image.generated: false`, `status: not-generated`, image key below `assets/art/universe/ship-classes/` and a prompt; those historical default statuses must be checked against current asset state before being repeated as live.

## One-to-one runtime extension, not another ship catalogue

The original **schema v6** contract introduces `shipClassRuntimeProfiles`, one record keyed to `shipClasses` via **stable `shipClassId`**. The base class remains the owner of identity, capacities, Vector Exchange flag, transit rate and price. The extension adds `production.factoryLeadTimeDays` and `specifications.fuelUsePerLightYear` as persistent physical/product facts, not per-save mutable results.

For eligible Vector Exchange classes, consumption is **continuous**:
`fuelRequired = routeDistanceLy × fuelUsePerLightYear`, including fractional light-year distances. `fuelEfficiencyRating` is a display/comparison rating, **not** a substitute calculation. Non-Vector Exchange classes have `fuelUsePerLightYear: null` and cannot use that transit.

The original v6 source also materialised `ship-class-asterion-pioneer-colony-transport`, a charter-issued Asterion Nomad-line starter vessel **outside the 30 factory-new retail offerings**. A game can save that canonical stable class ID without treating charter issuance as a shop purchase. Example `ship-class-runtime-dart-courier` uses a source-example 120-day nominal lead time and 517 fuel per light-year; never assume every order gets that arrival date or every other class shares those figures.

## Consumer, canon and validation boundary

Games join `shipClasses` and `shipClassRuntimeProfiles` by `shipClassId` to form **one read-only product view**. They may transform fields into a cached game catalogue or render them in a store, but must not hand-author a second conflicting class list or bind order state into Universe data. Fleet instances own their current fuel, damage, routes, position, berth, orders, installed equipment and cargo. Future #114 Parts/Machinery design applies shared capabilities without rewriting canonical class identity.

**Before claiming IMPLEMENTED:** verify manifest membership, stable-id referential integrity, one-to-one extension, current ship counts/status/assets, null/positive fuel semantics, fractional-distance calculations, latest Mobile pinned schema compatibility and order/save integration tests. This pass neither executed tests nor modified authored JSON. Any actual graph/count discrepancy must be recorded in [shared reconciliation](../source-register/RECONCILIATION_MATRIX.md).
