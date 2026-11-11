# Industrial catalogue model

Schema 13 defines one canonical Buildings, Machines and Parts graph. The full
catalogue and approval review is generated in
[IndustrialCatalogueAlignmentReview.md](IndustrialCatalogueAlignmentReview.md).

## Relationship ownership

- `building.equipmentConfigurations` owns structural Machine demand. Each
  configuration says whether a Machine is required, conditional, optional or
  installed on an existing asset, and gives a quantity at every applicable
  level. `building.machineIds` is only the validated compatibility union.
- `machine.servicePartRequirements` owns identifiable installed/service Part
  slots. `machine.partIds` is its exact unique projection and
  `part.machineIds` is the exact derived inverse.
- `machine.manufacturing.finishedPartInputs` is the proposed or approved
  production BOM for one new Machine. It is not a second compatibility list.
  Every finished input must resolve to a service slot unless a future design
  explicitly classifies it as manufacturing-only.
- Building direct Parts, such as fixed accommodation fit-out, use
  `directPartRequirements`. Parts inside installed Machines are reached through
  the Machine graph and are not duplicated on the Building.

## Condition and wear

`industrial-wear-model-v1` uses Part condition from 0–100%. Approved v1 Part rates
are percent condition lost per equivalent-full-load hour, multiplied by
operating intensity raised to the Part's intensity exponent. A Machine's
condition is the weighted mean of the worst installed unit in each required
service slot. A critical slot at or below its Part failure threshold disables
the Machine; other failed slots derate it. Only powered, enabled, operational
Machines contribute capability.

Buildings do not have a parallel equipment wear counter. Their operational
condition and output derive from installed Machines. Shell degradation is
unresolved and remains separate from equipment condition.

Universe owns identities, compatibility, structural demand, method/depth
capability, wear parameters and failure effects. A consuming game save owns
Machine and installed-Part instance IDs, condition, operating hours, intensity,
ownership, repairs and replacements. This supports automatic 100%-condition
fit-out at construction without canonising free Machines or mutable instances.

## Extraction configurations

The shared `industrialSpecifications` collection maps the nine Android
extraction functions to canonical Machine configurations. The generic Drill
Machine is limited to quarry bench drilling. Underground mining, well drilling
and the Quantum Bore are distinct physical Machine identities. Precision
Control reuses the Substance Analyser and Exotic Separation uses an advanced
Filtration Machine configuration; neither increases depth without a separate
depth-qualified underground mining system.

Exact Android power, workforce and output curves remain platform balance in
`game-specs/mineit-mobile/industrial-alignment-reference.json`. They are not
promoted to Universe facts.
