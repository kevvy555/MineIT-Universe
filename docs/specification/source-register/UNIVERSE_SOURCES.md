# Universe Original Source Inventory

**Source baseline:** `main`, 14 October 2026. **20** original Markdown files recorded; new `specification/` docs excluded. **Coverage means all paths indexed, not all content read or migrated.** Existing documents are retained.

Every source is **Indexed** until rule-level contents are reviewed. Suggested topic is preliminary path-based classification; it is **not** a claim of precedence, approval, currency or duplication.

## Distribution

| Preliminary topic | Files |
| --- | ---: |
| Canonical content / schema and integration | 9 |
| Lore canon (higher authority) | 4 |
| Universe architecture | 3 |
| Publishing / assets | 2 |
| Historical authoring / integration | 2 |

## File-by-file register

| ID | Original source | Proposed review topic | Reconciliation status |
| --- | --- | --- | --- |
| UNI-SRC-001 | [`data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md`](../../../data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md) | Lore canon (higher authority) | Indexed |
| UNI-SRC-002 | [`data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md`](../../../data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md) | Lore canon (higher authority) | Indexed |
| UNI-SRC-003 | [`data/lore/Koplin_Universe_Materials_And_Substances.md`](../../../data/lore/Koplin_Universe_Materials_And_Substances.md) | Lore canon (higher authority) | Indexed |
| UNI-SRC-004 | [`data/lore/Koplin_Universe_World_Surface.md`](../../../data/lore/Koplin_Universe_World_Surface.md) | Lore canon (higher authority) | Indexed |
| UNI-SRC-005 | [`docs/CanonSourceHierarchy.md`](../../CanonSourceHierarchy.md) | [Governing ordered canon precedence](../DESIGN_AUTHORITY.md#exact-canon-source-hierarchy-uni-src-005-reviewed-in-full) | **Reviewed (complete authoritative policy mapped)**; four higher-precedence lore texts independently Indexed |
| UNI-SRC-006 | [`docs/CommercialBuyerModel.md`](../../CommercialBuyerModel.md) | [Commercial identity and offer derivation](../commerce-and-corporations/02-commercial-contacts-and-offers.md) | **Reviewed (complete source; design mapped)**; current graph counts and game adapters unverified |
| UNI-SRC-007 | [`docs/ImageGenerationProcess.md`](../../ImageGenerationProcess.md) | Publishing / assets | Indexed |
| UNI-SRC-008 | [`docs/LegacyDesignCatalogueImport.md`](../../LegacyDesignCatalogueImport.md) | Historical authoring / integration | Indexed |
| UNI-SRC-009 | [`docs/MineitUniverseCanonDesign.md`](../../MineitUniverseCanonDesign.md) | Canonical content / schema and integration | Indexed |
| UNI-SRC-010 | [`docs/MineitUniverseDatabase.md`](../../MineitUniverseDatabase.md) | Universe architecture | Indexed |
| UNI-SRC-011 | [`docs/MineitUniverseDatabaseIntegration.md`](../../MineitUniverseDatabaseIntegration.md) | Universe architecture | Indexed |
| UNI-SRC-012 | [`docs/MobileOverhaulArtAudit.md`](../../MobileOverhaulArtAudit.md) | Historical authoring / integration | Indexed |
| UNI-SRC-013 | [`docs/MobileResourceOccurrenceIntegration.md`](../../MobileResourceOccurrenceIntegration.md) | Canonical content / schema and integration | Indexed |
| UNI-SRC-014 | [`docs/PublishingAndConsumers.md`](../../PublishingAndConsumers.md) | [Publication and consumer contract](../principles/02-publishing-and-consumer-contract.md) | **Reviewed (complete source; design mapped)**; Pages/consumer runtime unverified |
| UNI-SRC-015 | [`docs/ShipClassRuntimeProfiles.md`](../../ShipClassRuntimeProfiles.md) | [Ship product/runtime profile semantics](../assets-and-logistics/02-ship-class-products-and-runtime.md) | **Reviewed (complete source; design mapped)**; current JSON/consumers unverified |
| UNI-SRC-016 | [`docs/ShipbuildingSectorAndPurchaseCatalogue.md`](../../ShipbuildingSectorAndPurchaseCatalogue.md) | [Factory ship catalogue and purchase boundary](../assets-and-logistics/02-ship-class-products-and-runtime.md) | **Reviewed (complete source; design mapped)**; current ship-class art/counts unverified |
| UNI-SRC-017 | [`docs/SubstanceCanon.md`](../../SubstanceCanon.md) | Canonical content / schema and integration | Indexed |
| UNI-SRC-018 | [`docs/SubstanceCanonFeatureSpec.md`](../../SubstanceCanonFeatureSpec.md) | Canonical content / schema and integration | Indexed |
| UNI-SRC-019 | [`docs/UniverseGenerationArchitecture.md`](../../UniverseGenerationArchitecture.md) | Universe architecture | Indexed |
| UNI-SRC-020 | [`docs/WorldSurfaceCanon.md`](../../WorldSurfaceCanon.md) | Canonical content / schema and integration | Indexed |

## Current reviewed slices — 14 October 2026

- **UNI-SRC-006:** all original commercial model sections evaluated, including deterministic 1,000-candidate seed, first 100 materialisation, 20 sectors, offer ownership, logistics/portraits. New [commercial chapter](../commerce-and-corporations/02-commercial-contacts-and-offers.md) records source-reported counts as historic, not current published assertions; no new buyer IDs or collection are authored.
- **UNI-SRC-014:** all original publication/manifest/version/offline/ID/Pages clauses evaluated. New [consumer chapter](../principles/02-publishing-and-consumer-contract.md) explicitly defers Android runtime cache/update to the later pinned-offline policy. No live deployment or adapter tests executed.

**UNI-SRC-015 / 016:** full ship runtime profile + shipbuilding sector sources reviewed and mapped to [UNI-ASSET-002](../assets-and-logistics/02-ship-class-products-and-runtime.md): manufacturer/line/class/product facts, factory list price vs live quote, ship class/runtime join, fractional-light-year fuel, charter-issued starter outside retail. Counts and numeric examples are expressly source-era until current `data/` reconciliation. Both remain **Reviewed**.

**UNI-SRC-005:** full [Canon Source Hierarchy](../../CanonSourceHierarchy.md) source reviewed; [governance](../DESIGN_AUTHORITY.md#exact-canon-source-hierarchy-uni-src-005-reviewed-in-full) now names exact order, Year-5300/5326 distinction, JSON/lore conflict rule, knowledgeScope and provisional pre-lore samples. Four actual lore sources are **not** thereby marked reviewed.

These **five** entries remain **Reviewed**, rather than claiming validated canon data or full downstream migration. The other **15** source paths remain Indexed.

## Reconciliation gate

Only change `Indexed` to `Migrated` after the target chapter links actual original requirements, marks any disputed rule and proves platform ownership. An `APPROVED` header in a legacy document is recorded as source evidence, **not automatically inherited by a new proposed shared mechanic**.
