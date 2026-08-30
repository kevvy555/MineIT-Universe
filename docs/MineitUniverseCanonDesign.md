# MineIT Universe Canon Design Specification

Status: **Canonical design — approved 2026-08-30**  
Initial generation target: **Koplin Reach / approximately 10 authored systems**  
Repository: `kevvy555/MineIT-Universe`

## Purpose

This document defines the long-term shape, ownership and authoring rules of the shared MineIT universe.

The Universe is designed to be reused across MineIT applications. A person, organisation, ship, place, project or historical event encountered in one MineIT game is the same canonical entity when encountered in another application.

`data/` in this repository is the single authored source of truth.

---

# 1. Scale and geography

- Mature authored universe target: approximately **100 star systems**, expandable later.
- Model: **authored core + lightly authored secondary inhabited systems + procedural frontier**.
- Regions exist above systems.
- Initial model uses regions without a mandatory sector layer; sectors may be added later if scale requires them.
- Begin with **2–3 regions eventually**, but the first generated release focuses deeply on one region.
- Authored systems record every planet and major moon.
- Uninhabited major planets/moons still belong in the Directory.
- Settlement depth is intentionally moderate:
  - system
  - planet/moon
  - major city / colony / station
- Only significant cities are individually authored initially.
- Initial generation target: **one detailed region of roughly 10 systems**.

## Initial region

The first full authored region is the **Koplin Reach**.

It is intended to prove that the model works at meaningful scale before additional regions are generated.

---

# 2. Political and organisational model

The universe is politically mixed.

It can contain:

- federations and alliances;
- independent worlds;
- system governments;
- corporate territories;
- trade authorities;
- powerful corporations;
- universities and research institutes;
- hospitals and medical trusts;
- banks;
- media organisations;
- trade guilds and unions;
- security organisations;
- military organisations;
- synthetic / AI political bodies;
- charities and other meaningful institutions.

Corporations can rival governments, and some may effectively govern territories.

## Generic organisation model

Schema v2 uses one canonical `organisations` collection rather than treating commercial companies as the only top-level organisation type.

Examples:

- industrial conglomerate;
- government federation;
- trade authority;
- biotechnology company;
- research institute;
- synthetic polity;
- bank;
- media network;
- hospital trust;
- guild;
- military/security organisation.

Organisation structure is flexible:

`Organisation -> subsidiary/major unit -> division -> department -> team`

The exact depth varies by organisation.

Commercial gameplay can filter `commercial: true` organisations rather than needing a separate duplicate company database.

---

# 3. People

The mature universe should contain **thousands of persistent named people**.

The existing buyer portrait population should be migrated into the shared universe over time:

- retain all existing people;
- distribute them across varied professions;
- introduce them progressively;
- do not keep all of them as buyers.

Normal person records include:

- stable ID;
- name;
- species;
- role;
- organisation;
- organisation unit where relevant;
- work location;
- home location;
- responsibilities;
- biography;
- personality;
- operations;
- ships;
- commercial authority where relevant;
- image-generation metadata.

Important characters may later contain deeper history.

## Relationships

People have a full social relationship graph.

Supported relationship categories can include:

- family;
- friendship;
- professional;
- mentor;
- rivalry;
- professional rivalry;
- synthetic kinship / family-like relationships;
- other future relationship types.

Relationships are canonical entities so they can be referenced, searched and extended without embedding duplicate person data.

## Cross-game continuity

Characters retain canonical:

- identity;
- history;
- employer/affiliation;
- relationships;
- recognised ships and places.

Canon may evolve through official Universe updates.

---

# 4. Species and synthetic people

MineIT canon includes:

- baseline humans;
- genetically or environmentally adapted/post-human populations;
- multiple intelligent alien species;
- persistent synthetic / AI persons;
- synthetic political organisations and factions.

Culture, religion and language are deliberately not modelled as separate first-class systems at this stage.

Species records describe identity/biology only as needed for consistent universe content.

---

# 5. Ships

The mature universe should contain **hundreds of persistent named ships**.

Minor/background traffic can remain procedural.

Ship classes are canonical Universe entities.

A ship class can link to:

- manufacturer;
- designer organisations;
- intended role;
- capacity class;
- description.

Individual named ships link to:

- owner/operator organisation;
- ship class;
- home port;
- operations;
- people;
- role;
- visual description;
- image state.

Games may derive their own numerical gameplay stats from canonical classes rather than storing all gameplay balance values in the Universe.

---

# 6. Facilities and operations

The Universe records most significant organisational facilities, not every office or shop.

Examples:

- factories;
- refineries;
- mines;
- shipyards;
- laboratories;
- hospitals;
- fleet bases;
- logistics hubs;
- corporate campuses;
- major habitat construction yards.

Operations represent meaningful ongoing industrial, research or logistics work.

Operations own structural resource requirements.

Example:

`Organisation -> Facility -> Operation -> Resource Requirement -> Procurement Person`

Exact contract price, quantity and cadence remain game/save state rather than canon.

No live galactic economy is simulated in the Universe repository.

---

# 7. Products

Canonical products/product categories exist for major manufactured outputs.

Products make it possible to explain:

- what an operation produces;
- what organisation manufactures it;
- what ship classes or projects consume it;
- why upstream resource demand exists.

The Universe is not intended to become a full inventory/item database.

---

# 8. Projects

Major projects are first-class canonical entities.

A project may span:

- several organisations;
- several locations;
- named people;
- named ships;
- multiple operations.

Examples include:

- megastructure construction;
- shipyard expansion;
- major infrastructure;
- terraforming-scale work;
- synthetic-rights infrastructure;
- regional security networks.

---

# 9. Historical events and calendar

The Universe uses a full canonical date.

Initial calendar:

- **Standard Terran Calendar**
- canonical data release date in-universe: stored in `manifest.canonicalDate`

Historical events are first-class entities linked to the people, organisations, locations, ships, projects and species involved.

This forms a shared universe timeline.

Different future games may eventually take place at different points on that same timeline.

Canon can evolve over development time.

---

# 10. Security and military content

Security and military organisations, bases and ships are canonical.

They provide geopolitical and institutional depth but do not make MineIT primarily a combat universe.

Relevant roles include:

- frontier patrol;
- rescue;
- convoy protection;
- strategic infrastructure defence;
- licensing/security cooperation.

---

# 11. Directory visibility

The Universe Directory is **omniscient** for canonical records.

There is no public-vs-secret information layer in the canonical dataset at this stage.

Gameplay may choose what the player character knows or exposes, but the canonical Directory itself can browse all authored facts.

---

# 12. Player state

Player corporations and individual saves are not canonical shared-universe entities.

A MineIT game exists inside the canonical universe, but player-specific achievements, colonies, contracts and economic state remain in that game's save.

This avoids one player's save rewriting the common universe for every other application.

Future shared-universe player effects would require a separate explicit design.

---

# 13. Image model

Current artwork priority is:

1. people;
2. named ships.

Other entity artwork may be introduced later.

Any entity type may support an optional `image` object.

Every image-bearing entity must record whether its image has actually been generated.

Required image fields:

```json
{
  "image": {
    "key": "assets/art/universe/people/person-example.webp",
    "generated": false,
    "status": "not-generated",
    "promptDescription": "What to generate...",
    "notes": "Composition / aspect-ratio notes."
  }
}
```

Allowed status values:

- `not-generated`
- `generated`
- `approved`
- `needs-regeneration`

Rules:

- `not-generated` requires `generated: false`;
- `generated` and `approved` require `generated: true`;
- `needs-regeneration` may retain an existing file but means it should be replaced;
- generated image files never redefine the entity; JSON remains authoritative;
- image-generation prompts derive from canonical person/ship facts and linked organisation/location identity.

The Directory must expose image generation status.

---

# 14. Authoring policy

Universe content is authored by AI under this specification.

The selected policy is deliberately **not** a manual-review workflow.

Instead:

1. AI authors structured canonical records.
2. Automated validation checks schema and references.
3. CI rejects structurally invalid content.
4. Canon is refined later through normal repository changes when desired.

Important entities and low-level entities are all authored under the same consistency rules.

The goal is not random bulk generation. Content must remain:

- internally consistent;
- connected;
- useful to gameplay;
- recognisable across applications;
- diverse in organisation/person type;
- causally believable.

---

# 15. Interconnection principle

The Universe should be heavily interconnected without becoming a full simulation.

Recurring recognition is a defining MineIT principle.

Players should repeatedly recognise:

- the same people;
- the same organisations;
- the same ship classes;
- specific named ships;
- locations;
- projects;
- historical events.

A person seen as a buyer in one game may appear as a senior executive, project stakeholder, news subject or contact in another.

---

# 16. Canon generation priorities

Generation should balance:

- scale;
- deep enough lore;
- gameplay usefulness;
- recurring recognition;
- internal consistency.

No single priority dominates all others.

The first content release therefore focuses on one dense, linked 10-system region rather than generating 100 shallow systems immediately.

---

# 17. Schema v2 canonical collections

```text
data/
  manifest.json
  regions.json
  star-systems.json
  planets.json
  settlements.json
  organisations.json
  organisation-units.json
  facilities.json
  operations.json
  products.json
  species.json
  people.json
  ship-classes.json
  ships.json
  projects.json
  events.json
  relationships.json
```

## Entity graph

```text
Region
  -> Star System
    -> Planet / Moon
      -> Settlement / Station
        -> Organisation / Facility / Person / Ship

Organisation
  -> Organisation Unit
    -> Person
    -> Facility
      -> Operation
        -> Resource Requirement
        -> Product

Organisation
  -> Ship Class manufacturer/designer
  -> Named Ship

Person
  -> Person Relationship
  -> Operation
  -> Ship
  -> Project

Project
  -> Organisations
  -> Locations
  -> People
  -> Ships
  -> Operations

Historical Event
  -> any relevant canonical entities
```

---

# 18. Mature scale targets

These are design targets, not hard database limits.

- ~100 authored systems initially at mature scale;
- later expandable beyond that;
- ~100–150 meaningful commercial companies within a much broader set of organisations;
- thousands of persistent people;
- hundreds of persistent named ships;
- significant facilities and operations rather than every room/shop;
- procedural frontier remains available to individual games.

---

# 19. First generation release

The initial generated canon is the **Koplin Reach**.

Target content:

- 1 region;
- approximately 10 systems;
- all major planets/moons within those systems;
- major settlements/stations;
- mixed political/commercial/institutional organisations;
- organisation hierarchies;
- significant facilities;
- ongoing operations;
- resource requirements;
- products;
- several species;
- recurring named people;
- person relationships;
- canonical ship classes;
- named ships;
- major projects;
- historical events.

This release is intentionally deep enough to exercise the real Universe Directory and future game integration.

---

# 20. Answers captured

The approved multiple-choice choices are:

`1C 2D 3D 4E 5C 6C 7B 8B 9D 10D 11C/D 12D 13D 14C 15C 16D 17B+D 18C 19D 20C 21C 22D 23C 24C 25B 26C 27C 28A 29D 30D 31C 32C 33A 34B+C 35C+D 36C 37A 38A 39A 40B 41=AI authors without manual review 42C 43D 44B 45F`

The interpretation of the user's compact `44bf` response is:

- Q44 = **B** — games occur in canon while player/save state remains separate.
- Q45 = **F** — balanced combination of scale, lore, gameplay usefulness, recurring recognition and internal consistency.
