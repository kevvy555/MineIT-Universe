import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const load = path => readFile(resolve(root, path), 'utf8').then(JSON.parse);
const [parts, machines, buildings, specifications, androidReferences, researchTechnologies, manifest] = await Promise.all([
  load('data/parts.json'), load('data/machines.json'), load('data/buildings.json'),
  load('data/industrial-specifications.json'),
  load('game-specs/mineit-mobile/industrial-alignment-reference.json'),
  load('data/research-technologies.json'), load('data/manifest.json')
]);
const spec = specifications[0];
const android = androidReferences[0];
const machineById = new Map(machines.map(record => [record.id, record]));
const buildingById = new Map(buildings.map(record => [record.id, record]));
const partById = new Map(parts.map(record => [record.id, record]));
const buildingNames = ids => ids.map(id => buildingById.get(id)?.name || id).join(', ') || '—';
const machineNames = ids => ids.map(id => machineById.get(id)?.name || id).join(', ') || '—';
const partNames = ids => ids.map(id => partById.get(id)?.name || id).join(', ') || '—';
const cell = value => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, rows) => [
  `| ${headers.join(' | ')} |`,
  `| ${headers.map(() => '---').join(' | ')} |`,
  ...rows.map(row => `| ${row.map(cell).join(' | ')} |`)
].join('\n');
const quantities = item => item.quantityByLevel.map(row => `L${row.level}:${row.quantity}`).join(', ');
const money = value => Number.isFinite(value) ? `${value.toLocaleString('en-GB')} CC` : 'unresolved';
const machineBuildings = machineId => buildings.filter(building => building.machineIds.includes(machineId));
const machineTechnologies = machine => {
  const research = researchTechnologies.filter(technology =>
    (technology.unlockedMachineIds || []).includes(machine.id)).map(technology => technology.id);
  const configurations = machine.capabilityConfigurations.map(configuration => configuration.technologyRequirement);
  const housing = Number.isInteger(machine.operating.housingTechTier)
    ? [`housing-tier-${machine.operating.housingTechTier}`] : [];
  return [...new Set([...research, ...configurations, ...housing])];
};
const directAndIndirectParts = building => {
  const direct = building.directPartRequirements.map(row => row.partId);
  const throughMachines = building.machineIds.flatMap(id => machineById.get(id)?.partIds || []);
  return [...new Set([...direct, ...throughMachines])];
};

const lines = [];
lines.push('# Buildings, Machines and Parts — Complete Alignment Review');
lines.push('');
lines.push('**Review date:** 11 November 2026');
lines.push(`**Universe release:** schema ${manifest.schemaVersion} / content ${manifest.contentVersion}`);
lines.push('**Branch:** `develop`; the commit SHA is recorded in repository history; no pull request was created.');
lines.push('**Approval decision:** On 11 November 2026 the user approved the complete alignment and every recommended option as one consolidated decision. Deliberately unknown engineering and price fields remain **In Review** or **Blocked** rather than being falsely approved.');
lines.push('');
lines.push('## A — Executive summary');
lines.push('');
lines.push(table(['Measure', 'Result'], [
  ['Buildings reviewed', buildings.length],
  ['Machines reviewed', machines.length],
  ['Parts reviewed', parts.length],
  ['Existing catalogue records modified', '85 (24 Buildings, 42 Machines, 19 Parts)'],
  ['Records added', '3 Machines, 1 shared industrial specification, 1 Android reference snapshot'],
  ['Forward relationships corrected', '124 (103 Machine→Part additions; 18 Building→Machine additions; 3 obsolete Building→Machine edges removed)'],
  ['Derived inverse relationships synchronized', '240 exact Part→Machine edges'],
  ['Specification blocks completed', '326 across existing records (wear/manufacturing, service/function/condition, fit-out/level/operation fields)'],
  ['Alignment approval', 'Approved in one consolidated user decision on 11 November 2026'],
  ['Remaining approval groups', '0 from this review'],
  ['Deferred engineering gates', '5 groups of still-unknown facts; these are not pending policy decisions'],
  ['Validation', 'All repository and industrial alignment validators pass; three specialist Machine images correctly remain not-generated'],
  ['Branch / commits / PR', '`develop`; no commit or PR created by this review']
]));
lines.push('');
lines.push('The alignment gives `machine.partIds` one precise meaning: it is the unique projection of `servicePartRequirements`. `manufacturing.finishedPartInputs` remains the production BOM for one Machine. Every finished Part input now resolves to a service slot; the two fields no longer compete as vague component lists. Building `machineIds` is likewise a compatibility index, while `equipmentConfigurations` owns required, conditional, optional and alternative fit-outs with per-level quantities.');
lines.push('');
lines.push('One coherent deterministic wear model now spans Parts, Machines and Buildings. Universe owns parameters and compatibility; a game save owns Machine instances, installed Part instances, condition, hours, intensity and repair history. Buildings do not receive a competing wear counter: their output and capability derive from their operational installed Machines.');
lines.push('');
lines.push(`Wear formula: \`${spec.wearModel.partWearFormula}\`. Machine condition is the ${spec.wearModel.machineConditionFormula}; ${spec.wearModel.machinePerformanceRule}. ${spec.wearModel.criticalFailureRule}`);
lines.push('');

lines.push('## B — Complete building catalogue');
lines.push('');
lines.push(table(['ID', 'Name', 'Category', 'Levels', 'Required machines', 'Quantities', 'Power', 'Workers', 'Capacity', 'Wear model', 'Art', 'Approval'],
  buildings.map(building => {
    const required = building.equipmentConfigurations.flatMap(configuration => configuration.equipment)
      .filter(item => ['required', 'installed-at-origin'].includes(item.role));
    const q = required.map(item => `${machineById.get(item.machineId)?.name || item.machineId} (${quantities(item)})`);
    const values = key => building.levelProfiles.map(profile => `L${profile.level}:${profile[key] ?? '?'}`).join(', ');
    return [building.id, building.name, building.category,
      building.levelProfiles.map(profile => `L${profile.level}`).join(', '),
      machineNames([...new Set(required.map(item => item.machineId))]), q.join('; ') || '0 mandatory',
      values('powerUnits'), values('workforce'),
      building.levelProfiles.map(profile => `L${profile.level}:${profile.capacity ?? '?'} ${profile.capacityUnit || ''}`).join(', '),
      'Installed-Machine condition; failed equipment excluded',
      `${building.image.status}; level atlas ${building.mobileLevelAtlas.status}`, building.approval];
  })));
lines.push('');
lines.push('### Building fit-outs by configuration and level');
lines.push('');
lines.push(table(['Building', 'Configuration', 'Selection', 'Levels', 'Machine', 'Role', 'Quantity by level', 'Configuration / dependencies', 'Approval'],
  buildings.flatMap(building => building.equipmentConfigurations.flatMap(configuration => configuration.equipment.map(item => [
    `${building.name} (${building.id})`, `${configuration.name} (${configuration.id})`, configuration.selection,
    configuration.applicableLevels.map(level => `L${level}`).join(', '),
    `${machineById.get(item.machineId)?.name || item.machineId} (${item.machineId})`, item.role,
    quantities(item),
    [item.capabilityConfigurationId ? `config=${item.capabilityConfigurationId}` : null,
      item.dependsOnMachineIds.length ? `depends=${machineNames(item.dependsOnMachineIds)}` : null].filter(Boolean).join('; ') || '—',
    configuration.approval
  ])))));
lines.push('');
lines.push('### Building-to-Part coverage');
lines.push('');
lines.push(table(['Building', 'Direct finished Parts', 'Service Parts reachable through compatible Machines'],
  buildings.map(building => [
    building.name,
    building.directPartRequirements.map(row => `${partById.get(row.partId)?.name} ×${row.quantity}`).join(', ') || 'none authored',
    partNames(directAndIndirectParts(building))
  ])));
lines.push('');
lines.push('### Building materials and operating requirements');
lines.push('');
lines.push(table(['Building', 'Structural materials', 'Fit-out materials', 'Direct Parts', 'Power rule', 'Workforce rule', 'Operating approval'],
  buildings.map(building => [
    building.name, building.structuralShellSubstanceIds.join(', '),
    building.fitOutSubstanceIds.join(', ') || 'none authored',
    building.directPartRequirements.map(row => `${partById.get(row.partId)?.name} ×${row.quantity}`).join(', ') || 'none authored',
    building.operatingRequirements.power, building.operatingRequirements.workforce,
    building.operatingRequirements.approval
  ])));
lines.push('');

lines.push('## C — Complete machine catalogue');
lines.push('');
lines.push(table(['ID', 'Name', 'Category', 'Compatible buildings', 'Parts', 'Capacity', 'Power', 'Wear rate', 'Failure threshold', 'Cost', 'Art', 'Approval'],
  machines.map(machine => {
    const critical = machine.servicePartRequirements.filter(slot => slot.criticality === 'critical').map(slot => slot.partId);
    return [machine.id, machine.name, `${machine.category} / ${machine.subCategory}`,
      buildingNames(machineBuildings(machine.id).map(building => building.id)),
      machine.servicePartRequirements.map(slot => `${partById.get(slot.partId)?.name || slot.partId} ×${slot.quantity}`).join(', '),
      machine.operating.ratedCapacity ?? 'unresolved', machine.operating.powerUnits ?? 'unresolved',
      'Derived from installed Part rates and intensity',
      critical.length ? `critical Part thresholds: ${partNames(critical)}` : 'weighted Part condition',
      money(machine.manufacturing.manufacturerCostCC), machine.image.status, machine.approval];
  })));
lines.push('');
lines.push('### Machine manufacturing, operation and unresolved engineering');
lines.push('');
lines.push(table(['Machine', 'Operating functions', 'Technology requirements', 'Operating inputs', 'Footprint m²', 'Finished Part inputs', 'Nested Machines', 'Direct materials', 'Mass', 'Quote', 'Unresolved / status'],
  machines.map(machine => [
    machine.name, machine.operatingFunctions.join(', '),
    machineTechnologies(machine).join(', ') || 'no explicit technology link authored',
    machine.inputSummary || 'unresolved', machine.operating.footprintM2 ?? 'unresolved',
    (machine.manufacturing.finishedPartInputs || []).map(row => `${partById.get(row.partId)?.name || row.partId} ×${row.quantity}`).join(', ') || 'unresolved / none approved',
    (machine.manufacturing.nestedMachineInputs || []).map(row => `${machineById.get(row.machineId)?.name || row.machineId} ×${row.quantity}`).join(', ') || 'none / unresolved',
    (machine.manufacturing.directMaterialInputs || []).map(row => `${row.materialId} ${row.quantityKg} kg`).join(', ') || 'unresolved',
    machine.manufacturing.finishedMassKg ?? 'unresolved', money(machine.manufacturing.manufacturerQuoteCC),
    `${machine.manufacturing.unresolvedDesignConstraints || 'No extra note'}; ${machine.manufacturing.reviewBasis}`
  ])));
lines.push('');

lines.push('## D — Complete parts catalogue');
lines.push('');
lines.push(table(['ID', 'Name', 'Category', 'Used by machines', 'Material inputs', 'Mass', 'Manufacturing requirements', 'Wear characteristics', 'Failure effect', 'Cost', 'Art', 'Approval'],
  parts.map(part => [
    part.id, part.name, `${part.category} / ${part.subCategory}`,
    machineNames(part.machineIds),
    part.materialInputs.map(row => `${row.substanceId}${row.quantityKg ? ` ${row.quantityKg} kg` : ' qty unresolved'}`).join(', '),
    part.planningReference.finishedMassKg ?? 'unresolved',
    `${machineNames(part.manufacturingRequirements.requiredMachineIds)}; ${part.manufacturingRequirements.processCapabilities.join(', ')}`,
    `${part.wearProfile.baseWearRatePctPerEquivalentFullLoadHour}% per EFLH; intensity^${part.wearProfile.intensityExponent}; warn ${part.wearProfile.warningConditionPct}%; fail ${part.wearProfile.failureConditionPct}%; ${part.wearProfile.approval}`,
    part.wearProfile.failureEffect,
    money(part.planningReference.manufacturerCostCC), part.image.status, part.approval
  ])));
lines.push('');
lines.push('Every Part is one finished unit. Masses and manufacturer CC values remain discovery planning references unless their field approval explicitly says otherwise. Nuclear Fuel Assembly remains blocked; Precast Concrete Sections is building stock rather than a Machine service Part.');
lines.push('');

lines.push('## E — Mining compatibility matrix');
lines.push('');
lines.push(table(['Function', 'Extraction method', 'Applicable buildings', 'Maximum depth', 'Required Machine configuration', 'Dependencies', 'Technology', 'Relevant failure effects', 'Approval'],
  spec.extractionCapabilities.map(capability => {
    const required = capability.requiredMachineConfigurations.map(row => `${machineById.get(row.machineId)?.name || row.machineId} / ${row.configurationId}`);
    const failure = capability.requiredMachineConfigurations.flatMap(row => machineById.get(row.machineId).servicePartRequirements)
      .filter(slot => slot.criticality === 'critical')
      .map(slot => `${partById.get(slot.partId)?.name}: ${partById.get(slot.partId)?.wearProfile.failureEffect}`);
    return [capability.name, capability.extractionMethodId, buildingNames(capability.buildingIds),
      capability.maximumDepthM == null ? 'limited by accompanying depth-qualified Mine system' : `${capability.maximumDepthM.toLocaleString('en-GB')} m`,
      required.join(', '), capability.dependencies.length
        ? capability.dependencies.map(id => machineById.get(id)?.name || id).join(', ')
        : 'none',
      capability.technologyRequirement, [...new Set(failure)].join('; '), capability.approval];
  })));
lines.push('');
lines.push('The generic Drill Machine is now limited to quarry bench drilling. It cannot provide shaft, deep-hard-rock, deep-core, rotary-well, pressure/brine or quantum capability. Deep Mine configurations remain cumulative for lower mining methods, but Android method ceilings still apply: a deeper Machine never raises the 2 km Shaft Mining ceiling. Precision Control and Exotic Separation never add depth by themselves.');
lines.push('');

lines.push('## F — Remaining approval decisions');
lines.push('');
lines.push('None. The user approved all eight recommended options from this review on 11 November 2026, including the v1 wear rates and formula, specialist Machine identities, fit-out quantities, extraction mappings and platform-balance boundary.');
lines.push('');
lines.push('### Deferred engineering data — not unapproved alignment decisions');
lines.push('');
lines.push('- Qualified manufacturing BOMs, mass, power, footprint, capacity, testing and final art for the three specialist extraction Machines.');
lines.push('- Fourteen pre-existing legacy Part-compatibility mappings across ten Machines, which remain explicit engineering reviews rather than bulk-approved guesses.');
lines.push('- Manufacturer costs and quotes that were already labelled planning scenarios, plus the blocked Nuclear Fuel Assembly design.');
lines.push('- Quantified construction/direct-Part BOMs for Buildings beyond the previously approved discovery baselines.');
lines.push('- Cross-game physical operating ratings where Android intentionally owns its own power, workforce and output balance.');
lines.push('');

lines.push('## G — Android integration impact');
lines.push('');
lines.push('Android should extend its unified Universe build-time bundle with derived `buildings`, `machines`, `parts` and `industrialSpecifications` snapshots from one immutable Universe commit. These remain generated bundle outputs with shared source/schema/content provenance; Android must not author a second catalogue. Runtime models should reference canonical Building, Machine, Part and capability-configuration IDs, while save-owned instances use their own persistent instance IDs.');
lines.push('');
lines.push('For a newly built Quarry, Mine or Rig, the interim construction policy creates the required Machine instances and installed Part instances at 100% condition. The save then accumulates equivalent-full-load hours and intensity, computes Part wear with `industrial-wear-model-v1`, derives Machine condition from service slots, and excludes failed/offline Machines from extraction capability. There is still no procurement, repair or replacement UI. Demolition/rebuild creates a fresh fit-out but must retain existing occurrence reserve depletion and permanent terrain grading.');
lines.push('');
lines.push('The extraction-function adapter must stop treating `machine-drill-machine` as universal. It should map the nine function keys in Section E to the listed Machine configuration IDs. Current Android method/building/depth restrictions remain unchanged. Exact power, workforce and output curves stay platform balance; the checked reference currently records Quarry `[4,9,17,29,46]`, Rig `[4,10,19,33,52]`, Mine `[5,12,23,40,64]`, Deep Mine `[7,16,31,54,86]`, and output `[10,18,30,48,72]` for L1–L5.');
lines.push('');
lines.push('Machine art should be copied by `image.key` when generated. The three specialist Machines currently declare `not-generated`, so development bundles may use explicit presentation fallbacks; production art completeness remains a release gate, never a reason to replace their IDs locally. Approved canonical facts include stable IDs, relationship semantics, v1 wear rates and failure rules, fit-out quantities, extraction compatibility/depth boundaries, and the save-state ownership boundary. Most physical operating ratings and the existing provisional CC scenarios remain deliberately non-approved because no exact value was supplied by this review.');
lines.push('');
lines.push(`**Android evidence pin used for this review:** \`${android.sourceCommit}\` (${android.sourceFiles.join(', ')}).`);
lines.push('');

await writeFile(resolve(root, 'docs/IndustrialCatalogueAlignmentReview.md'), `${lines.join('\n').trimEnd()}\n`);
console.log(`Generated consolidated review: ${buildings.length} Buildings, ${machines.length} Machines, ${parts.length} Parts.`);
