# Physical storage catalogue contract

Feature #33 / U01 #34. Android dependency: kevvy555/MineIT-Android#581. Status: design checkpoint; no numeric data or schema promotion in this commit.

## Approved direction (26 Nov 2026)

Substances have a single storage density in kg/m³. Mobile raw resource and stockable named material units have an independently defined kg per gameplay unit. Quantity remains the game unit; occupied volume is derived as quantity × mass per unit / density. Do not maintain two density systems. Part and Machine volumes are explicit packaged storage m³, independent of their existing finished mass; fitted Parts are included in the Machine, not separately counted.

## Proposed field contract for implementation

- Applicable substance identity: `densityKgPerM3` finite and strictly positive. Choose the stored-form definition on the concrete resource/material where a generic category is too broad; do not duplicate conflicting density across IDs.
- Applicable Mobile resource and named stockable material: `massPerUnitKg` finite and strictly positive. The defined density of that material determines volume. Do not store a second independent volume figure for substances.
- Parts: retain `planningReference.finishedMassKg`, add explicit `storageVolumeM3` for one finished Part.
- Machines: retain `manufacturing.finishedMassKg`, add explicit `storageVolumeM3` for one finished Machine in its transportable configuration.
- Preserve existing ID, approval and provenance conventions. Missing/unapproved data is not zero; unsupported inventory must not silently receive a fabricated fallback. Do not require density for non-stockable site processes, broad generic classes, live biological populations or specialist materials outside this feature.
- Existing named material `named-substance-graded-aggregate` is processed, stockable, derived from `mobile-resource-stone`, linked to `substance-stone-aggregate`. Reuse it; no duplicate new material. Review physical values and procurement availability.
- Preserve existing machine freight `ceil(finishedMassKg/100)`, Part freight mass/100 and current resource/contract prices. Storage volume is not existing cargo burden. Existing operating materials purchased in kg must not be converted again.

## Building contract

Warehouse L1–5 and Stockpile L1–10. Existing approved first five Stockpile footprint/capacity proposals retained, later levels to be numerically reviewed. Stockpile is a graded-aggregate-only hardstand, no lumber or steel, no mandatory power/workers/machines. Warehouse retains existing machine service identity and counts. Construction material BOM and capacity are separate from inventory, upgrades use incremental BOM. No goods deterioration.

## Validation plan

Extend existing manifest-backed collection validation, field approval coverage and catalogue display when numeric rows are added. Verify finite positive physical values, supported identities and references, completeness for supported storage, explicit exclusion of unsupported forms, non-duplicate derived volume, unchanged approved reference mass/price, ten/five level progression and strictly increasing capacity. Validate all canonical references and pin exact validated commit in Android. Do not generate textures or LOD, physical haulage, stock transfers or a new production chain in this workstream.

## Review gate

The Android unit audit has started. Before promoting numeric fields, review current quantity/price/consumption/freight semantics and prepare per-item reference values and construction BOM. The above field names are proposals to be reconciled with existing schema and validators. No validation run is claimed for this documentation checkpoint.
