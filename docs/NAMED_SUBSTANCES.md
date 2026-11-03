# Named materials and generic substance classes

The 80 existing records in `data/substances.json` are broad, stable material classes, **not 80 priced commodity stock identities**. Do not rename, delete or replace them with familiar resource names: they also classify possible future procedurally discovered materials.

The separate `namedSubstances` manifest collection (`data/named-substances.json`) holds individually identified **physical materials** approved during the MineIT Android economic discovery, including processed materials and strategic exceptions. `genericSubstanceId` optionally links a named material to an existing broad class. A null class is an **explicit classification review**, not an implied match: do not force Lithium Carbonate into elemental reactive metals or refined precious metals into an inappropriate class.

The 42 already-authored natural resource identities remain authoritative in `mobileResourceDefinitions`. The Directory shows those records under their existing `genericSubstanceId`, without copying them into `namedSubstances`. Named material records use distinct durable `named-substance-*` IDs, preserve discovery provenance and distinguish ordinary stockable materials, non-tradeable spent nuclear waste and on-site concrete. Nuclear Fuel Assemblies and precast construction sections are Parts, not substances; the Vector Exchange Drive is a Machine, not a substance.

**Approved identity does not approve** manufacturing recipes, physical units, market prices, scan/extraction levels, runtime stock integration or ownership rights. Descriptive upstream inputs are not validated quantitative BOMs. Some entries exist in Android as existing manufactured consumables; runtime ID reconciliation remains a separate migration task.

The Directory's Substances tree groups generic classes by archetype, then displays their existing raw Mobile resources and linked named materials as children. Unclassified named materials are visible at archetype level under a conspicuous review heading; they are never silently inserted into a guessed generic class.

`data/` is authoritative; the browser is read-only. MineIT Android retains its older explicitly pinned Universe snapshot until an independently tested migration. Validation must check unique IDs, the parent generic reference, parent archetype agreement and source natural-resource references.

**Source:** MineIT Android discovery catalogues, principally `docs/discovery/processed-*.csv` and `docs/discovery/galaxy-economic-foundation.md` on `kevvy555/MineIT-Android` `develop`. The original Universe material lore remains higher-precedence canon.

## Unified Directory and bulk-review table

The production Directory has **one** Substances navigation entry, grouped by canonical generic substance class. Its child entries include linked 42 named natural resources, 62 named materials and seven biological Food source records (under the Organic archetype). Original stable IDs, mobile occurrence profiles and all other canonical records remain unchanged. The removed duplicate `MineIT Mobile Resources` navigation entry was a second *view* of existing records, not an independent authored dataset.

Click the **Substances** text in the Directory tree (or the header SUBSTANCES link) to open a sortable, filterable bulk-review table. The disclosure arrow expands the tree without changing the detail view. One record per identity appears in the table (80 generic + 42 natural + 62 named + 7 biological = 191 at this checkpoint); occurrence profiles are joined as fields, not extra stock rows.

The table has a per-column filter and ascending/descending sort. Its column picker lists every currently present source field, including nested image metadata, provenance, occurrence profile fields and Android reference values; the initial visible columns are a temporary default until a designer selects the final set. Selected columns are remembered for the browser session. Names link back to the ordinary read-only details.

### Android source reconciliation

`game-specs/mineit-mobile/resource-balance-reference.json` is a **reference-only snapshot** of the Android-owned `app/src/main/assets/gameplay/resource-balance.json`, pinning an exact Android `develop` commit and source path. It adds a *view* of Android rarity, occurrence weight, quality bias, base scan level, baseline extraction method/family, reference base price, historical aliases and operational tags. This snapshot is not authored Universe canon and must never become Android's gameplay runtime input; Android remains authoritative for game-specific balance. It has no duplicated names, descriptions or occurrence-zone definitions. The snapshot is referenced by stable canonical resource IDs and validated against the existing 42 natural resources.

Android `ResourceCatalogue.kt` also contains legacy mining tiers, price/proxy values, category multipliers and unlock labels; those values are not merged automatically because their IDs and semantics do not consistently match the canonical 42 resources. Current per-save deposit quality, reserve, generated abundance and market quotes are deliberately excluded. Discovery data contributes provenance and broad approved identities, not invented prices or quantified production recipes.

When extending the bulk table, add new fields to the appropriate canonical entity or game-owned source first. The table is a read-only projection, not another source of truth.
