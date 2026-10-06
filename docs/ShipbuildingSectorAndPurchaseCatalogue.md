# MineIT Shipbuilding Sector & Factory-New Purchase Catalogue

Status: Canonical Year-5326 sector design

## Purpose

This specification defines the first canonical factory-new ship market intended for MineIT gameplay consumers. It converts the earlier Stage 8 buyer-ship capacity ladder into a shared-universe shipbuilding sector with manufacturers, physical yards, product lines, differentiated models, canonical list prices and production demand.

## Canon boundary

The Universe owns persistent product facts: manufacturer, ship line, specifications, image prompt/state, manufacturer list price and published Year-5326 product identity.

Games own mutable purchase circumstances: current availability, production queue, delivery time, transport surcharge, reputation discount, finance, insurance, used values, trade-in values and player-specific quotes.

Retail catalogue condition is factory-new only. The second-hand market is outside this release.

## Five manufacturers

### Asterion Shipworks
Specialisation: versatile specialist, frontier and adaptable commercial vessels.

Asterion competes through mission flexibility. Its catalogue spans high-value couriers, science craft, frontier survey ships, patrol/rescue cutters, habitat logistics and adaptable bulk lifting.

Flagship yard: Asterion Deepdock, Aster Vale.

### Kestrel Aerospace Systems
Specialisation: speed, acceleration and rapid turnaround.

Kestrel ships cost more per unit of cargo and generally consume more fuel, but their high-output propulsion and short turnaround make them attractive for time-critical contracts.

Flagship yard: Kestrel Velocity Yard, Solace.

### Keystone Modular Fabrication
Specialisation: modular cargo and network logistics.

Keystone uses standardised frames, service interfaces and exchangeable cargo sections. The brand is aimed at operators who value flexibility, parts commonality and network-scale logistics.

Flagship yard: Keystone Gateworks Yard, Meridian.

### Longreach Engineering
Specialisation: range, fuel efficiency and reliability.

Longreach builds premium deep-route freight vessels with large reserves, redundant systems and long service intervals. Higher acquisition price is offset by reduced dependency on dense support infrastructure.

Flagship yard: Longreach Frontier Yard, Damaris.

### Crownline Heavy Works
Specialisation: huge bulk carriers and megafreighters.

Crownline prioritises structural simplicity, extreme capacity and low acquisition cost per unit of cargo. Its vessels are slow but dominate late-game bulk movement.

Flagship yard: Crownline Talus Megayard, Caldera.

## Ship lines

The schema introduces `shipLines` between manufacturer and ship class. Lines express a shared design/product philosophy without duplicating individual model specifications.

Current lines:
- Asterion Dart Line
- Asterion Nomad Line
- Kestrel Flight Line
- Kestrel Vanguard Line
- Keystone Caravan Line
- Keystone Network Line
- Longreach Reliant Line
- Longreach Horizon Line
- Crownline Foundry Line
- Crownline Worldline Line

## Retail catalogue

There are exactly 30 factory-new retail classes in the Year-5326 catalogue. The source-canonical Pathfinder-class and Prospector-class remain reference classes and are not assigned a retail manufacturer because the source lore does not define one.

Every retail class includes:
- cargo capacity;
- separate fuel capacity;
- separate food capacity;
- colonist/passenger capacity;
- minimum and maximum crew;
- Vector Exchange capability;
- transit weeks per light-year where applicable;
- range class;
- speed, fuel-efficiency and reliability ratings;
- atmospheric capability;
- berth class;
- special traits;
- manufacturer list price in Commonwealth Credits;
- Year-5326 price effective year;
- image asset key, generated state, status and generation prompt.

## Price model

All canonical retail prices use `currency-commonwealth-credit` (CC).

The manufacturer list price is part of the persistent product definition at Year 5326. It is not the same as the player's final quote.

Manufacturer positioning is deliberately reflected in price:
- Kestrel carries a performance premium.
- Asterion carries specialist capability premiums.
- Longreach charges for endurance, reliability and efficiency.
- Keystone competes on flexible capacity and standardisation.
- Crownline offers strong bulk capacity per credit at the cost of speed.

## Production demand

Shipbuilding demand remains operation-owned in accordance with the Universe architecture. Production operations reference the classes they build through `shipClassIds` and carry structural resource requirements.

This creates a circular economic relationship for MineIT gameplay: mining colonies may sell feedstock to shipbuilders, earn CC, then purchase ships from those same industrial organisations.

## Image workflow

Factory-standard class artwork is separate from individual named-ship artwork.

Every retail class currently starts with:
- `image.generated: false`
- `image.status: not-generated`
- a canonical asset key under `assets/art/universe/ship-classes/`
- a stored factory-reference prompt.

When an image is added, its state can be changed to `generated` or `approved`; validation checks that generated assets actually exist.

## Game integration boundary

MineIT Mobile should consume this catalogue by stable ID rather than copy it into a second authored dataset. The first purchasing implementation may use canonical list price directly. Later gameplay can add dynamic quote modifiers and delivery logic without changing the underlying class identity.
