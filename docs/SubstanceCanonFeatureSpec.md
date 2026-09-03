# Feature Spec — Publish Desktop Substance Design into MineIT Universe

**Status:** In progress — Directory industrial catalogues published (substances/parts/machines/buildings)  
**Base branch:** `develop`  
**Target repository:** MineIT-Universe  
**Primary deliverable:** Lore bible materials chapter + website publication via Lore Explorer  
**Related desktop source:** `MineIT/Documentation/design/Generation/SubstanceGeneration/`  
**Out of scope here:** MineIT Mobile resource conversion (handled in a separate thread)

---

## 1. Intent

Take the **current Desktop substance design** and publish it as **MineIT Universe canon**:

1. Arrange the desktop material model into a **logical lore bible chapter** (foundation precedence).
2. Make that content available on the **Universe website** through the existing Lore Explorer (and any Directory surfaces that later list substances).
3. Optionally follow with structured `substances` JSON that **agrees with** the bible chapter, so games and tools can reference stable IDs later.

Desktop design docs remain **engineering provenance**. Once reconciled into Universe lore (and structured data), **Universe is authoritative**.

---

## 2. Problem

Desktop already defines substances in depth (definition, archetypes, P0/P1 catalogue, property rules, rarity, world-link notes). That design is not yet Universe-owned or website-published.

Universe currently has no materials bible chapter and no `substances` collection. Commercial operations only reference ad-hoc resource type/id/displayName strings copied from Mobile.

Players and designers should be able to read one coherent materials universe on the website. Game conversion work (Mobile, Desktop runtime) can consume that canon later; this feature does not implement those conversions.

---

## 3. Goals

1. Author a foundation lore document (or bible chapter) that presents Desktop substance structure in a clear reading order for humans.
2. Register that lore in Universe `data/` so Lore Explorer publishes it (no embedded duplicate prose in JavaScript).
3. Preserve Desktop terminology and constraints; do not invent conflicting chemical/industrial truth.
4. Keep mutable gameplay values (prices, reserves, contracts, quality rolls) out of this content.
5. Leave a clear hand-off for later structured catalogue and consumer migration work.

---

## 4. Non-goals

- Converting MineIT Mobile inventory / `resources.js` (other thread).
- Implementing Desktop procedural generation or survey micro-generation inside Universe.
- Migrating commercial `resourceRequirements` to `substanceId` in this same change set (may be a follow-on once structured IDs exist).
- Authoring every refined alloy / propellant recipe as live gameplay.
- Plasma / stellar future types beyond a short deferred appendix pointer.
- Salvage / ship-component inventory (not substances in Desktop design).

---

## 5. Proposed bible chapter order

Recommended reading order for the new materials chapter (logical, not a dump of Desktop filenames):

1. **Purpose** — why materials matter in Commonwealth / frontier industry.
2. **What a substance is** — identity vs deposit instance vs refined product.
3. **Substance types** — Element, Compound, Alloy, Composite, Mixture.
4. **Thermal behaviour** — ChangesState, Decomposes, Burns.
5. **Standard state** — Solid, Liquid, Gas.
6. **Dominant archetypes** — Metal, Silicate, Carbon, Organic, Water, Salt, Volatile (Food / Biological called out only if Desktop + product agree it belongs in this chapter).
7. **Raw vs refined** — industrial classification used by games.
8. **Catalogue tiers** — P0 core vs P1 expansion; category as authoring unit where Desktop uses categories.
9. **Property vocabulary** — short in-universe explanation; detailed derivation rules may sit in a designer-truth appendix.
10. **Rarity bands** — shared vocabulary.
11. **Deferred topics** — world-link generation ownership (Desktop runtime), future substance types.

Suggested file:

- `data/lore/Koplin_Universe_Materials_And_Substances.md` (or an equivalent section integrated into the foundation bible if product prefers a single file)

Suggested lasting consumer/architecture note (follow-on or same feature):

- `docs/SubstanceCanon.md`

---

## 6. Desktop import map

| Desktop document | Universe destination |
|------------------|----------------------|
| `SubstanceDefinition.md` | Bible definitions + schema language |
| `Substances.md` | Catalogue families / P0–P1 rows (prose + later JSON) |
| `PropertyRules.md` | Designer-truth appendix and/or structured property profiles |
| `ExpandedCoreSubstanceProperties.md` | Property glossary |
| `Rarity.md` | Shared rarity vocabulary |
| `SubstanceWorldLink.md` | Deferred note: Desktop owns runtime generation |
| `FutureSubstanceTypes.md` | Deferred appendix pointer only |

Import means **reconcile into Universe voice and structure**, not paste Desktop engineering docs wholesale into player-facing lore without editing.

---

## 7. Website publication

- Lore document metadata + Markdown live under `data/` and are declared for Lore Explorer.
- Lore Explorer must load from `data/`; it must not embed a second copy of the materials prose.
- No requirement in this feature to build a full Directory “substances browser”; bible publication via Lore Explorer is the v1 website bar.
- If structured `substances` JSON is added in the same programme, Directory may later list it like other collections — that is optional follow-on UI.

---

## 8. Optional structured follow-on (same programme or Phase B)

When ready, add:

- `data/substances.json` (+ shards if needed)
- Manifest collection registration
- Validation for unique substance IDs

Structured records must agree with the materials chapter. Stable IDs should prefer functional Desktop category language (e.g. `substance-reactive-metal-ore`) over free-floating display names.

Commercial operation migration and Mobile projection remain **consumer follow-ons**, not blockers for publishing the bible chapter.

---

## 9. Acceptance criteria

1. A materials/substances lore chapter exists under `data/lore/` in logical order covering Desktop substance structure.
2. Lore Explorer (Universe website) can open and read that chapter from canonical data.
3. Desktop design is treated as provenance; Universe lore does not contradict Desktop substance rules without an explicit product decision.
4. Designer-only derivation rules, if published, are labelled appropriately (`knowledgeScope` / designer truth).
5. No mutable prices, reserves, or contract terms are stored as substance canon.
6. Mobile conversion is explicitly out of scope for this feature’s done criteria.
7. Content / docs validation used by the repo remains green for any new lore metadata paths.

---

## 10. Delivery phases

| Phase | Work |
|-------|------|
| **A — Spec** | This document approved; branch from `develop` |
| **B — Bible** | Author materials chapter in logical order from Desktop sources |
| **C — Publish** | Register lore metadata; confirm Lore Explorer shows the chapter |
| **D — Structure (optional)** | `substances` collection + validation agreeing with the chapter |
| **E — Later consumers** | Mobile conversion (other thread); Desktop keys off Universe IDs; commercial `substanceId` migration |

---

## 11. Open questions (do not block bible drafting)

1. Separate lore file vs new section inside the foundation Expanded Backstory bible?
2. How much property-rule detail is player-facing vs designer-truth appendix?
3. Include Food / Biological in this first chapter, or wait for Desktop Farm notes to settle?
4. Does Phase D (structured JSON) ship with the bible, or immediately after website publication?

---

## 12. Definition of done

- Spec accepted by product owner.
- Materials lore merged to `develop` (via PR) with validation green.
- Website Lore Explorer surfaces the new chapter from `data/`.
- Consumer integration notes updated only if structured substances or publishing paths change (`PublishingAndConsumers.md` / related docs).
- Mobile and Desktop conversion work tracked separately; not required to close this Universe feature.
