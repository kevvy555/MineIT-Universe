# Initial Mine operating and power catalogue baseline — 22 November 2026

**Authority:** User authorised the assistant to choose sensible **initial** values and mark the new necessary values Approved for the Mine Production Simulation 2.0 transition, with later balance review explicitly allowed. This is not laboratory-certified physical engineering data and does not imply approval of unrelated incomplete manufacturing BOMs. The existing 11 November 2026 structural equipment/wear approvals remain unchanged.

## Boundaries
- All economic assets retain canonical stable IDs and **existing** Machine service slots, critical failure and wear rules.
- Machine price includes all factory-fitted service Parts. Loose replacement Parts are purchased separately.
- Installed Machine instance and Part identities/condition belong to Mobile game saves, not Universe.
- No generic Ore tax, arbitrary fuel-category substitution or free Machines.
- Supported generator fuels are physically qualified **per generator**, not all fuels unlocked by a Power tech level.
- Battery is storage, **not** a source of net electrical energy.
- Production is game-clock event driven; power fuel is consumed once and a shortage cannot be billed or resolved retroactively.
- Machine hourly operating consumables use canonical resource/substance IDs. Refined lubricant and coolant need explicit Mobile product/trade exposure before they can be consumed; this is tracked as implementation work, not silently replaced with generic Ore.
- Reference cargo units are a deliberately **game-specific freight metric**: ceil(finishedMachineMassKg / 100). This does not claim a raw-resource unit equals 100 kg.
- The existing provisional manufacturer quotes are accepted as initial **catalogue reference quotes**, not guaranteed affordability in the present 32,000-cash founding scenario. Funding, trade markup and starting progression require a separate balance checkpoint; **never invent free Machines to bypass it**.

## Numerical Machine baseline
| Machine ID | Rated capacity | Running Power | Idle Power | Manufacturer quote CC | Cargo units | Status |
|---|---:|---:|---:|---:|---:|---|
| `machine-substance-analyser` | 10 raw-resource-units-per-hour | 1.5 | 0.15 | 93050 | 3 | Approved initial baseline |
| `machine-conveyor-machine` | 15 raw-resource-units-per-hour | 1 | 0.1 | 217150 | 31 | Approved initial baseline |
| `machine-mine-ventilation` | 1 simultaneous-mine-systems-supported | 1 | 1 | 147650 | 12 | Approved initial baseline |
| `machine-crude-chemical-battery` | 25 power-units-max-discharge | 0 | 0 | 125150 | 14 | Approved initial baseline |
| `machine-wind-generator` | 75 power-units-output | 0 | 0 | 301250 | 42 | Approved initial baseline |
| `machine-water-wheel-generator` | 75 power-units-output | 0 | 0 | 303800 | 50 | Approved initial baseline |
| `machine-thermoelectric-trickler` | 10 power-units-output | 0 | 0 | 94000 | 10 | Approved initial baseline |
| `machine-solar-thermal-generator` | 75 power-units-output | 0 | 0 | 588900 | 71 | Approved initial baseline |
| `machine-power-distribution-system` | 800 power-units-delivered | 0.5 | 0.5 | 328100 | 29 | Approved initial baseline |
| `machine-pump-machine` | 20 fluid-resource-units-per-hour | 2 | 0 | 240850 | 27 | Approved initial baseline |
| `machine-filtration-machine` | 10 processed-resource-units-per-hour | 2 | 0.1 | 226550 | 22 | Approved initial baseline |
| `machine-crude-steam-piston-generator` | 75 power-units-output | 0 | 0 | 412500 | 68 | Approved initial baseline |
| `machine-crude-combustion-generator` | 75 power-units-output | 0 | 0 | 375000 | 49 | Approved initial baseline |
| `machine-underground-mining-system` | 12 raw-resource-units-per-hour | 3 | 0.15 | 393750 | 55 | Approved initial baseline |

## Mine-specific method configurations
- **standard-shaft:** 12 raw units/hour, 3 running Power; 0.1 kg/hour `substance-refined-lubricant`.
- **deep-hard-rock:** 10 raw units/hour, 3.8 running Power; 0.15 kg/hour `substance-refined-lubricant`; 0.2 kg/hour `substance-coolant`.
- **deep-core:** 8 raw units/hour, 5 running Power; 0.2 kg/hour `substance-refined-lubricant`; 0.5 kg/hour `substance-coolant`.

## Power generation
- Combustion and steam generators each initially rated 75 Power units output. Compatible fuels are explicitly listed per Machine in `operating.generatorFuelProfile`.
- A full-output 75-unit generator uses 75 effective fuel-energy units per 24-hour game day, i.e. `75/24=3.125` effective units per hour. Actual physical fuel debits use the consumer game's existing quality-aware effective-energy policy.
- Fuel consumption is proportional to dispatched output, with elapsed-time shortage/replenishment events.
- The Crude Combustion Generator and Power Distribution System form one new approved `combustion-generation` Power Plant configuration. Steam/thermoelectric machines are defined but are not automatically introduced as approved Power Plant configurations.
- Wind, water and solar are condition-gated physical supply, not universally guaranteed full output. Battery has 300 Power-unit-hours of storage and a 25-unit discharge limit.

## Parts and commercial reference values
- Existing 19 Part wear profiles/identities are unchanged. Prices/masses in `planningReference` were approved **for the 14 Part families used by the selected Mine and Power equipment** as preliminary commercial-reference data; unrelated Parts remain at their previous status.
- Machine manufacturing quantities outside the named reference quote/mass remain Proposed/Blocked where source evidence is incomplete.
- No changes to environmental lore, source identities, other Building configurations or the complete Universe bundle are implied.

## Implementation gates
1. Add typed parsing and validation in Android for the new optional `operating` fields; pin an exact Universe commit after this data is merged.
2. Expose the refined lubricant/coolant as actual buyable/stockable Mobile products or agree a non-billing supported operating profile; never silently use a generic resource.
3. Reconcile founding cash with fully costed initial Mine, purchased Power equipment, construction and spares. Current Android starting cash of 32,000 cannot buy even the referenced Conveyor at 217,150 CC; the story must resolve without free machines.
4. Preserve initial Machine fitting from purchased stock and automatic Part replacement at the existing 30% warning threshold.
5. Validate schema, all refs, unique IDs and derived Machine/Building/Part indexes; run repository validations and Mobile offline-pinning checks before publishing.

**Approval scope:** initial numerical *field* values written in this change are approved by delegated user authority; unfilled fields elsewhere remain unapproved and should not be implicitly completed.
