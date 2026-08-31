# MineIT Commercial Buyer Model

## Decision

`buyer` is a gameplay view, not a canonical Universe entity type.

A persistent commercial contact is represented through the existing Universe graph:

```text
Person
  -> Organisation
  -> Operation
  -> Resource requirements
```

MineIT may present that person as a buyer when the linked operation can generate a suitable purchase contract for the player's output.

There is therefore no separate canonical `buyers.json` collection.

## Legacy Stage 8 source

The original Stage 8 buyer directory deterministically generated 1,000 identities from seed `8302026`. The source remains valuable but its generated rows are raw material rather than automatically canonical facts.

Retained design material:

- deterministic person-name generation;
- portrait appearance generation;
- 20 commercial/economic sectors;
- procurement-role concepts;
- sector-level resource affinities;
- company-name vocabulary for future authored or generated organisations;
- ship-name vocabulary for future named vessels.

Explicitly discarded legacy assumptions:

- one buyer equals one unique company;
- every buyer permanently owns one collection ship;
- legacy generated home strings are real locations;
- Entry / Regional / Major / Strategic / Premier is a Universe fact;
- minimum player reputation is a property of the person;
- a person's `typicalQuality` is a permanent fact;
- fallback per-buyer resource selections are canonical demand.

## Canonical economic sectors

The useful 20-sector taxonomy is materialised as `economicSectors`.

Each sector records:

- stable sector identity;
- normal procurement role;
- anchor organisation;
- structural resource affinities;
- importance;
- demand scale;
- quality preference;
- causal reason for each resource requirement.

This is economic structure, not a live market quote.

## Procurement operations

Each sector currently has an external procurement operation.

Operations own the structural demand because they explain why an organisation needs a resource. A resource requirement can therefore differ in quality or importance inside the same organisation.

Example:

```text
Shipbuilding & propulsion systems
  Reactive Metal Ore  -> critical / high / excellent
  Conductive Ore      -> critical / high / excellent
  Magnetic Ore        -> critical / high / excellent
  Platinum            -> important / moderate / excellent
  Palladium           -> important / moderate / excellent
```

The exact quantity, price, delivery interval and player access rules remain gameplay state.

## Commercial contacts

The first materialisation contains 100 persistent commercial contacts reconstructed from legacy deterministic identities.

Each contact has:

- stable Universe person ID;
- deterministic legacy name provenance;
- one of the three source-canonical Koplin peoples;
- a real canonical employer;
- a real canonical work/home location;
- a procurement role;
- linked procurement operation(s);
- biography/personality material;
- stored identity-neutral portrait prompt;
- no permanently paired collection ship.

Contacts are marked with:

```json
"commercialProfile": {
  "contactType": "procurement",
  "economicSectorId": "economic-sector-...",
  "canSourceGameOffers": true
}
```

This makes commercial eligibility discoverable without inventing a second buyer schema.

## Universe versus game ownership

### MineIT Universe owns

- person identity;
- employer and organisational role;
- location;
- economic sector;
- operation identity;
- structural resource demand;
- quality preference for that operation/resource requirement;
- causal reason the resource is needed;
- persistent biography and visual identity;
- stable IDs used by consuming games.

### MineIT game/save owns

- whether the player can currently see or contract with the contact;
- player reputation requirement;
- current offered resource from the operation's valid demand;
- requested quantity;
- unit price;
- total contract value;
- delivery/collection cadence;
- current buyer happiness;
- misses and termination state;
- cooldowns;
- contract history;
- current collection state;
- which vessel is assigned to a specific collection.

## Offer derivation

A consuming game should conceptually derive offers as follows:

```text
Universe commercial contacts
  -> linked procurement operations
  -> structural resource requirements
  -> intersect with the game's resource catalogue/unlocks
  -> apply game market/reputation/balance rules
  -> generate save-specific offer
```

The game should save the stable Universe person ID and operation ID with the generated contract so the same persistent character can recur across games and saves while commercial terms remain mutable.

## Collection logistics

Collection ships are not permanently owned by the buyer identity.

A game may choose a collection vessel according to:

- contract quantity;
- cargo type;
- route/range;
- berth availability;
- employer-owned fleet;
- logistics partners;
- third-party carriers;
- current game circumstances.

This allows one person to use a Dart Courier for a small platinum pickup and a large bulk freighter for a major industrial order without changing the person's canonical identity.

## Scaling beyond the first 100

The first 100 contacts prove the materialisation pattern. Future expansion can continue through deterministic legacy identities in batches, but should remain graph-aware rather than merely adding rows.

Additional people may become procurement contacts or may be materialised into other persistent professions where that produces a richer Universe. The legacy 1,000-person source is not a permanent name pool: once an identity is materialised into a particular universe, that person is a real persistent individual in that universe.

Logical collection sharding allows the population to scale into thousands without changing the consumer API.

## Reusable artwork

Commercial portrait prompts are identity-neutral and map to the reusable portrait series defined in `visual-asset-series.json`.

The current Koplin person can use a portrait visual while a future generated universe may assign that same visual asset to another identity. Personal names and company text must not be baked into reusable images.
