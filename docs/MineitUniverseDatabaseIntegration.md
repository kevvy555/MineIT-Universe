# MineIT Universe Integration

Status: **Architecture plan — consumer integration follows the standalone Universe proof**

## Purpose

Define how MineIT Mobile and future MineIT applications consume the canonical shared universe without coupling canonical lore to one game's save state or gameplay implementation.

The intended boundary is:

```text
MineIT Universe (canonical JSON + art)
        |
        +--> Universe Directory (read-only browser)
        +--> MineIT Mobile (gameplay consumer)
        +--> future MineIT games/tools
```

## Shared identity across applications

Stable IDs are the cross-application contract.

If MineIT Mobile encounters:

`person-talia-chen`

and a future MineIT game later encounters:

`person-talia-chen`

both applications resolve the same canonical person from this repository.

The same applies to companies, locations, facilities, operations and ships.

## Canonical facts vs game state

Canonical examples:

- Talia Chen works for Helix Industrial Group.
- Helix operates Solace Driveworks.
- Solace Driveworks runs a propulsion assembly programme.
- That programme structurally requires Magnetic Ore and Copper Ore.
- CSV Halcyon Reach belongs to Helix.

Per-save examples that stay inside a game:

- whether Helix is currently available to the player;
- exact price and requested quantity;
- contract cadence;
- buyer happiness;
- current cooldown;
- player reputation;
- active shipment/collection state;
- player colony ownership and production;
- procedural deposits and frontier state.

Games should persist stable universe IDs plus their own mutable terms, not snapshots of entire canonical records.

## Published JSON consumption

GitHub Pages can expose this repository as a static content endpoint.

Canonical base URL:

```text
https://kevvy555.github.io/MineIT-Universe/
```

Consumer bootstrap URL:

```text
https://kevvy555.github.io/MineIT-Universe/data/manifest.json
```

The manifest declares all collection paths. Consumers should not hardcode every collection path independently where avoidable.

Example consumer flow:

```js
const baseUrl = 'https://kevvy555.github.io/MineIT-Universe/data/';
const manifest = await fetch(`${baseUrl}manifest.json`).then(r => r.json());
const people = await fetch(`${baseUrl}${manifest.collections.people}`).then(r => r.json());
```

The actual game integration should wrap this behind a small Universe catalogue/loader rather than scattering fetch calls across gameplay code.

## Availability and caching

Do not make gameplay permanently dependent on a live network connection.

Recommended approach:

1. a game has a bundled or cached known-good universe snapshot;
2. online startup may check the published manifest/content version;
3. an updated snapshot can be fetched and cached when compatible;
4. saves record which universe content version they were created/last resolved against where useful;
5. the Directory may simply show the latest published version.

This preserves one canonical authored source while allowing offline/reproducible gameplay.

## Schema compatibility

`manifest.json` exposes:

- `schemaVersion`
- `contentVersion`

Games must reject or deliberately migrate incompatible schema versions rather than silently interpreting changed shapes.

Content-only changes can normally be accepted as long as referenced stable IDs remain valid.

## Buyer integration

The current buyer lifecycle should remain game-owned.

Future discovery chain:

```text
player can supply resource
  -> canonical operations requiring resource
  -> company / facility / organisation unit
  -> procurement responsibility
  -> persistent person
  -> game generates current commercial terms
  -> existing buyer contract lifecycle
```

Canonical data explains **who** wants the resource and **why**.

The game still decides **what offer exists in this save**, including numerical balancing and contract state.

## Authored core + procedural frontier

Recommended long-term model:

### Canonical civilisation

- important inhabited systems;
- major worlds and stations;
- established companies;
- facilities and major operations;
- persistent people and named ships.

### Per-game procedural frontier

- prospect systems;
- exact deposits;
- resource sizes/quality;
- colony candidates;
- player colonies and infrastructure.

The procedural frontier interacts with the same persistent civilisation each playthrough.

## Game-side service boundary

MineIT Mobile should eventually expose a read-only universe catalogue capable of queries such as:

```text
person(id)
company(id)
operation(id)
facility(id)
location(id)
ship(id)
peopleForCompany(companyId)
operationsForResource(resourceType, resourceId)
procurementContactsForOperation(operationId)
shipsForCompany(companyId)
```

That catalogue does not own mutable gameplay state.

BuyerService or equivalent game-domain services consume it to select canonical candidates and then create per-save state.

## Save-state references

Prefer:

```json
{
  "personId": "person-talia-chen",
  "companyId": "company-helix-industrial-group",
  "operationId": "operation-helix-driveworks-propulsion",
  "collectionShipId": "ship-csv-halcyon-reach",
  "quantity": 24000,
  "unitRate": 1.03,
  "status": "active"
}
```

Do not copy biography, company description, logo paths, facility lore or other canonical content into save files.

## Cross-game recognition

The shared universe enables deliberate recognition across MineIT products:

- the same person can appear in different games;
- the same company branding and ships can recur;
- systems/settlements have persistent lore;
- a player can use the standalone Universe Directory as a broader world reference.

Different games may expose different subsets or different moments of interaction while still using the same canonical identity.

## Future database/API evolution

Static JSON is sufficient while the shared universe is authored/reference data.

A database/API becomes appropriate if the shared universe itself becomes live and mutable across applications, for example global company state, promotions, wars, facility openings or player actions that affect other players/applications.

If that happens, preserve the separation:

```text
canonical authored identity/content
+
dynamic shared universe state
```

Do not throw permanent identity/lore and high-frequency mutable state into one undifferentiated model.

## Initial MineIT Mobile integration sequence

After the Universe schema/directory proof is stable:

1. add a configurable Universe base URL to MineIT Mobile;
2. implement manifest loading and version checking;
3. implement a read-only indexed catalogue;
4. bundle/cache a known-good snapshot for offline use;
5. map a small subset of current buyer identities to canonical people/companies/operations;
6. preserve existing contract mechanics;
7. expand migration only after tests prove save/load and buyer behaviour remain stable.
