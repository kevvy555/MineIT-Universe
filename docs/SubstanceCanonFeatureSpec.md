# Feature Spec — Publish Substance and Industrial Design into MineIT Universe

**Status:** Complete — merge candidate pending final CI  
**Base branch:** `develop`  
**Target repository:** MineIT-Universe  
**Release:** Universe content `0.8.0`  
**Primary deliverable:** Materials lore + structured substances, parts, machines and reconciled Desktop/Mobile building canon  
**Related Desktop sources:** `MineIT/Documentation/design/Generation/SubstanceGeneration/` and `MineIT/Documentation/design/Machines & Buildings/`  
**Related Mobile sources:** current building, extraction-site and spaceport domain models on `MineIT/develop`  
**Out of scope here:** MineIT Mobile resource/inventory conversion and mutable game balancing

---

## 1. Intent

Publish the shared materials and industrial vocabulary used by MineIT games into **MineIT Universe**, making Universe the authoritative authored source for stable substance, part, machine and building identities.

The feature:

1. Reconciles the Desktop substance design into a canonical materials lore chapter.
2. Publishes the structured 75-category P0/P1 substance catalogue.
3. Publishes linked parts and machines from the Desktop industrial design.
4. Reconciles the complete current Desktop + MineIT Mobile building vocabulary into one canonical building collection.
5. Makes all four industrial collections browsable through the Universe Directory.
6. Preserves source provenance while preventing game/save-state concepts from becoming persistent universe facts.

Desktop and Mobile source material remain engineering provenance. Once reconciled here, **Universe `data/` is authoritative**.

---

## 2. Ownership boundary

Universe owns persistent authored identity and industrial meaning:

- substance identities and classification;
- part identities and substance composition links;
- machine identities and part links;
- building archetypes and their high-level substance/machine composition;
- canonical descriptions and provenance.

Games continue to own mutable or game-specific behaviour, including:

- construction and upgrade costs;
- building levels;
- staffing and workforce requirements;
- power generation/demand curves;
- production throughput;
- placement and terrain rules;
- technology unlocks;
- contract restrictions;
- player ownership and save-state;
- market prices, reserves, stock and quality rolls.

This prevents Universe from becoming a duplicate gameplay configuration database.

---

## 3. Canonical materials publication

The foundation materials companion is:

- `data/lore/Koplin_Universe_Materials_And_Substances.md`

It covers:

1. purpose and industrial context;
2. substance identity versus deposit instance/refined product;
3. Element / Compound / Alloy / Composite / Mixture;
4. thermal behaviour;
5. standard state;
6. Metal / Silicate / Carbon / Organic / Water / Salt / Volatile archetypes;
7. raw versus refined classification;
8. P0/P1 catalogue tiers;
9. property vocabulary;
10. rarity vocabulary;
11. deferred runtime-generation concerns.

Structured `data/substances.json` agrees with this higher-precedence lore source.

---

## 4. Structured industrial collections

The feature publishes these manifest collections:

- `data/substances.json` — 75 P0/P1 industrial substance categories;
- `data/parts.json` — stable industrial part archetypes linked to substances;
- `data/machines.json` — stable machine archetypes linked to parts;
- `data/buildings.json` — stable building archetypes linked to shell/fit-out substances and installed machines.

The graph is therefore:

```text
substances
   ↓
parts
   ↓
machines
   ↓
buildings
```

Reverse views in the Directory are derived or validation-protected so these relationships cannot silently drift.

---

## 5. Desktop + Mobile building reconciliation

The completed catalogue contains **22 canonical building archetypes**. This is the union of all 14 current Desktop concepts and all 13 current MineIT Mobile building kinds, with overlap represented by one Universe record rather than duplicates.

### Current Mobile mappings

| Mobile kind | Canonical Universe building |
|---|---|
| `housing` | `building-habitat` |
| `power` | `building-power-plant` |
| `industry` | `building-industry` |
| `headquarters` | `building-headquarters` |
| `farm` | `building-farm` |
| `ranch` | `building-ranch` |
| `bio` | `building-bio-harvester` |
| `algae` | `building-algae-facility` |
| `quarry` | `building-quarry` |
| `rig` | `building-extraction-rig` |
| `mine` | `building-simple-pit-mine` |
| `deep-mine` | `building-deep-mine` |
| `spaceport` | `building-spaceport` |

Desktop-only concepts remain where they are meaningful industrial or scenario archetypes, including Collection Camp, Water Collector, Basic Refinery, Research Building, Shipyard Bay, Stockpile and Warehouse.

`building-crashed-ship` is retained as **scenario infrastructure**: a grounded/wrecked vessel that can be repurposed as temporary frontier infrastructure. Player-specific starting-base, salvage and progression wording is deliberately not canonical.

---

## 6. Reconciliation rules

1. **Same real-world function → one canonical Universe archetype.**
2. **Genuinely distinct facility → separate stable building ID.**
3. Source gameplay wording is rewritten into persistent Universe language before publication.
4. Source paths are provenance, not authority after reconciliation.
5. Stable IDs must not change merely because display wording evolves.
6. No parallel Desktop/Mobile versions of the same production entity are created in Universe.

---

## 7. Import workflow

Desktop parts, machines and buildings may be refreshed with:

```text
node scripts/import-industrial-catalogue.mjs ../MineIT
```

or:

```text
MINEIT_SOURCE_ROOT=../MineIT node scripts/import-industrial-catalogue.mjs
```

The importer accepts either the MineIT repository root or the direct `Machines & Buildings` directory.

It:

- resolves source substance/part/machine names to stable Universe IDs;
- fails before writing if relationships cannot be resolved;
- treats `machine.partIds` as authoritative and derives the reverse `part.machineIds` index;
- checks source `Used In` declarations for contradictions;
- preserves reviewed Universe descriptions/provenance rather than replacing them with raw gameplay wording;
- preserves Mobile-only building archetypes already reconciled into Universe.

The importer is a reconciliation aid, not an alternate source of truth.

---

## 8. Website publication

The Universe website publishes the feature from canonical `data/` only:

- Lore Explorer reads the materials Markdown through lore-document metadata.
- Directory loads `data/manifest.json` and exposes Substances, Parts, Machines and Buildings.
- Substances are grouped by archetype and Raw/Refined.
- Parts are grouped by category/sub-category.
- Machines and buildings are grouped by category.
- Entity detail views expose linked substances, parts, machines and buildings.

No shadow production dataset is embedded in JavaScript.

---

## 9. Validation

Automated validation is a publication requirement.

`validation/validate-universe.mjs` validates the overall canonical graph, including IDs and cross-references for substances, parts, machines and buildings.

`validation/validate-industrial-catalogue.mjs` additionally enforces:

- presence of all current Desktop building concepts;
- a canonical mapping for every current Mobile building kind;
- explicit Mobile provenance on those mappings;
- current combined building catalogue completeness;
- reciprocal part↔machine relationship integrity;
- required building descriptions/provenance;
- rejection of player/save-state language in industrial canon.

CI runs validation on `main`, `develop`, `feature/**`, and pull requests targeting `main` or `develop`. The importer itself is syntax-checked by CI.

---

## 10. Acceptance criteria

- [x] Materials lore is canonical under `data/lore/`.
- [x] Lore Explorer can publish the materials chapter from canonical data.
- [x] 75 P0/P1 substances are published with stable IDs.
- [x] Parts are published and linked to substances.
- [x] Machines are published and linked to parts.
- [x] Complete current Desktop + Mobile building vocabulary is reconciled into one collection.
- [x] Buildings are linked to appropriate substances and machines where defined.
- [x] Game/player-specific descriptions have been reconciled into Universe language.
- [x] Import tooling is portable and fail-fast.
- [x] Part/machine reverse relationships cannot silently drift.
- [x] Directory browses all four industrial collections.
- [x] Documentation defines ownership and consumer boundaries.
- [x] Automated validation covers the new industrial canon.
- [ ] Final branch-head CI is green after completion metadata changes.

---

## 11. Follow-on work

These are deliberately separate from this feature:

1. Migrate commercial `resourceRequirements` to stable `substanceId` relationships where appropriate.
2. Convert MineIT Mobile resource/inventory definitions to a projection of Universe substance IDs.
3. Progressively key Desktop authored designs directly to Universe stable IDs.
4. Define detailed manufacturing recipes when that gameplay system is designed.
5. Define/refine ship fuel and propellant production as part of the broader resource/manufacturing programme.
6. Add future building/machine archetypes to Universe when either game introduces genuinely new persistent concepts.

---

## 12. Definition of done

This feature is complete when the current branch head passes the full automated validation suite and is merged into `develop`.

The implementation is not required to migrate Mobile inventory, Desktop runtime generation, game balancing, manufacturing recipes or commercial demand references before merge.
