# Physical storage catalogue audit report and release gates — U11 / #44

Design audit complete; **not canonical implementation, not a validated consumer release**. The owner has approved the overall design; new numerical estimates, previously unapproved mass/quote fields and unresolved construction/compatibility details must be reviewed before promotion.

## Audit documents

- [U01 contract](../PhysicalStorageCatalogueContract.md), #34
- [U02 raw resources](physical-storage-raw-resource-review.md), #35
- [U03 named materials](physical-storage-named-material-review.md), #36
- [U04 graded aggregate](physical-storage-aggregate-review.md), #37
- [U05 parts](physical-storage-part-review.md), #38
- [U06 machines](physical-storage-machine-review.md), #39
- [U07 compatibility](physical-storage-compatibility-review.md), #40
- [U08 Stockpile](physical-storage-stockpile-review.md), #41
- [U09 Warehouse](physical-storage-warehouse-review.md), #42
- [U10 Handler](physical-storage-handler-review.md), #43
- Android resource/economy audit: kevvy555/MineIT-Android#581.

## Read-back design checks

Compared committed review tables to the actual JSON source IDs using a read-only script. All source IDs occur exactly once, all proposed volumes are finite/positive, all density-derived displayed volumes agree within relative 0.0001 rounding tolerance. Results: raw 42/42 (37 numeric), named 65/65 (52 numeric), parts 19/19 (18 numeric), machines 46/46 (39 numeric); no errors. Stockpile 10 contiguous levels, capacity strictly increasing from 30 to 1,800m³, all cumulative/incremental aggregate units reconcile; Warehouse 5 contiguous levels, capacity strictly increasing from 360 to 2,160m³, both capacity equations checked; no errors. These are design checks, not the repository validation suite.

## Implementation gates

1. Define approved physical fields on the canonical records, not a new parallel collection. Update the existing schema/manifest, field approval registry, applicable approval governance and directory projections. `validation/validate-approval-governance.mjs` currently compares registered/selectable fields and checks exact part field sets; extend intentionally, not by weakening approval validation.
2. Validate stable references, finite positive values, explicit specialist exclusions, completeness for supported items and no competing derived volume. Keep existing references/prices and approvals unless explicitly changed. Validate 10/5 level profiles and increasing cumulative BOMs.
3. Both existing tactical building symbols are generated. Current tactical level badge validation requires 1–5; Stockpile L6–10 should display a numeric level label using existing UI drawing, not need new LOD or texture assets. Existing level art metadata for both families is not-generated. Android current 3D GLB pin contains no Warehouse/Stockpile models. Stockpile procedural geometry is sufficient; Warehouse GLB availability is a concrete implementation dependency for #599; verify Universe asset source and pin or supply model, no fabricated art. Do not treat an ungenerated image or absent pinned GLB as ready.
4. Stockpile L10 cumulative purchase 18,600 aggregate units versus current 12,000 maximum per-visit ordinary commodity freight. Preserve cargo limit, permit multiple purchases; no truck or freight redesign. Aggregate price proposal 1.50 CC/unit uses twice the reference ordinary stone price. Warehouse requires named construction inputs to be purchasable; glass only generic, decide procurement identity and quote. No silent generic Build substitution. Non-loose timber/block representation needs a consistent decision (stack geometry vs warehouse-only); no render-driven admission.
5. Confirm existing Android save adapter and natural balance asset path in A03/A07, preserve existing serialized quantities and ownership. Keep the 42-natural-resource validation and add processed aggregate as a separate stockable material. Do not modify founding, contracts, prices or freight for existing stock. Use exact pinned source SHA and update source/derived blob hashes only after validation. Keep gameplay, industrial, GLB pins separate. `scripts/test_universe_industrial_bundle.py` hardcodes schema 13; review alongside schema change, not blanket disabling.
6. Run complete Universe validation after canonical implementation; verify exact source, then publish/merge through the repository workflow and pin Android to the validated SHA. Android feature-level unit-int, then mandatory full ready-PR unit-int-ui before publication. No UI mockup changes or production code in this audit checkpoint.

## Outstanding decisions

- Approve numerical raw and named resource unit/density estimates, explicit equipment volumes and any currently unapproved mass/quote references. Excluded materials are not auto-approved.
- Approve L6–10 Stockpile dimensions/capacities/BOM and aggregate quote; approve Warehouse cumulative construction BOM, procurement glass identity, material pricing and availability.
- Confirm compatibility of timber, cut stone blocks and similar non-loose forms with simple procedural representation; keep specialist goods outside this feature.
- Resolve missing pinned Warehouse model before release. No texture, stock transfers, trucks, LOD, or storage deterioration.

Audit code changes: zero. No runtime tests or CI run claimed. This document and the preceding review records are design deliverables; U01–U11 implementation acceptance remains open until canonical changes and validation actually occur.
