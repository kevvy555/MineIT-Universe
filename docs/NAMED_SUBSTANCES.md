# Named materials and generic substance classes

The 80 existing records in `data/substances.json` are broad, stable material classes, **not 80 priced commodity stock identities**. Do not rename, delete or replace them with familiar resource names: they also classify possible future procedurally discovered materials.

The separate `namedSubstances` manifest collection (`data/named-substances.json`) holds individually identified **physical materials** approved during the MineIT Android economic discovery, including processed materials and strategic exceptions. `genericSubstanceId` optionally links a named material to an existing broad class. A null class is an **explicit classification review**, not an implied match: do not force Lithium Carbonate into elemental reactive metals or refined precious metals into an inappropriate class.

The 42 already-authored natural resource identities remain authoritative in `mobileResourceDefinitions`. The Directory shows those records under their existing `genericSubstanceId`, without copying them into `namedSubstances`. Named material records use distinct durable `named-substance-*` IDs, preserve discovery provenance and distinguish ordinary stockable materials, non-tradeable spent nuclear waste and on-site concrete. Nuclear Fuel Assemblies and precast construction sections are Parts, not substances; the Vector Exchange Drive is a Machine, not a substance.

**Approved identity does not approve** manufacturing recipes, physical units, market prices, scan/extraction levels, runtime stock integration or ownership rights. Descriptive upstream inputs are not validated quantitative BOMs. Some entries exist in Android as existing manufactured consumables; runtime ID reconciliation remains a separate migration task.

The Directory's Substances tree groups generic classes by archetype, then displays their existing raw Mobile resources and linked named materials as children. Unclassified named materials are visible at archetype level under a conspicuous review heading; they are never silently inserted into a guessed generic class.

`data/` is authoritative; the browser is read-only. MineIT Android retains its older explicitly pinned Universe snapshot until an independently tested migration. Validation must check unique IDs, the parent generic reference, parent archetype agreement and source natural-resource references.

**Source:** MineIT Android discovery catalogues, principally `docs/discovery/processed-*.csv` and `docs/discovery/galaxy-economic-foundation.md` on `kevvy555/MineIT-Android` `develop`. The original Universe material lore remains higher-precedence canon.
