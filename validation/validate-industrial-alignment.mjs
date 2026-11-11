import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const parts = load('data/parts.json');
const machines = load('data/machines.json');
const buildings = load('data/buildings.json');
const specifications = load('data/industrial-specifications.json');
const androidReference = load('game-specs/mineit-mobile/industrial-alignment-reference.json');
const report = readFileSync(new URL('../docs/IndustrialCatalogueAlignmentReview.md', import.meta.url), 'utf8');

assert.equal(parts.length, 19);
assert.equal(machines.length, 45);
assert.equal(buildings.length, 24);
assert.equal(specifications.length, 1);
assert.equal(androidReference.length, 1);

const partById = new Map(parts.map(record => [record.id, record]));
const machineById = new Map(machines.map(record => [record.id, record]));
const buildingById = new Map(buildings.map(record => [record.id, record]));
const allowedApprovals = new Set([
  'Not Reviewed', 'Draft', 'Proposed', 'In Review', 'Approved', 'Blocked',
  'Approved discovery design', 'Approved zero mandatory machines; optional equipment in review',
  'Approved zero mandatory machines; conditional and amenity fit-out in review',
  'Approved platform compatibility', 'Proposed canonical configuration',
  'Approved Android restriction; canonical physical fit-out in review',
  'Proposed canonical Machine mapping; approved Android restriction'
]);

// Parts: deterministic, complete specifications without save-owned condition.
for (const part of parts) {
  const wear = part.wearProfile;
  assert.equal(wear.modelId, 'industrial-wear-model-v1', part.id);
  assert.equal(wear.wearBasis, 'equivalent-full-load-hour');
  assert.ok(wear.baseWearRatePctPerEquivalentFullLoadHour > 0);
  assert.ok(wear.intensityExponent >= 1);
  assert.ok(wear.warningConditionPct > wear.failureConditionPct);
  assert.ok(wear.failureConditionPct >= 0 && wear.warningConditionPct <= 100);
  assert.equal(wear.replacementUnitCount, 1);
  assert.ok(wear.failureEffect?.trim());
  assert.equal(part.fieldApprovalStatuses.wearProfile, 'Approved');
  const requirements = part.manufacturingRequirements;
  assert.ok(Array.isArray(requirements.requiredMachineIds));
  assert.ok(Array.isArray(requirements.processCapabilities) && requirements.processCapabilities.length);
  for (const machineId of requirements.requiredMachineIds) assert.ok(machineById.has(machineId), `${part.id}: ${machineId}`);
  assert.equal(requirements.labourHours, null);
  assert.equal(requirements.testHours, null);
  assert.equal(requirements.goodUnitYield, null);
  assert.ok(allowedApprovals.has(requirements.approval));
}

// Machines: service slots are the exact meaning of partIds; production BOM is distinct.
for (const machine of machines) {
  assert.ok(Array.isArray(machine.servicePartRequirements) && machine.servicePartRequirements.length,
    `${machine.id}: every Machine needs identifiable service Parts`);
  const serviceIds = machine.servicePartRequirements.map(slot => slot.partId);
  assert.deepEqual(machine.partIds, [...new Set(serviceIds)], `${machine.id}: partIds must project service slots`);
  for (const slot of machine.servicePartRequirements) {
    assert.ok(partById.has(slot.partId), `${machine.id}: unknown service Part ${slot.partId}`);
    assert.ok(Number.isInteger(slot.quantity) && slot.quantity > 0);
    assert.ok(['critical', 'degrading', 'functional'].includes(slot.criticality));
    assert.ok(Number.isFinite(slot.conditionWeight) && slot.conditionWeight > 0);
    assert.ok(['disables-machine', 'derates-machine'].includes(slot.failureEffect));
    assert.ok(allowedApprovals.has(slot.approval));
  }
  for (const input of machine.manufacturing.finishedPartInputs || []) {
    assert.ok(serviceIds.includes(input.partId),
      `${machine.id}: manufacturing Part ${input.partId} needs an installed service slot or explicit manufacturing-only classification`);
  }
  assert.ok(Array.isArray(machine.operatingFunctions) && machine.operatingFunctions.length);
  assert.ok(Array.isArray(machine.capabilityConfigurations));
  assert.equal(machine.conditionModel.modelId, 'industrial-wear-model-v1');
  assert.equal(machine.conditionModel.installedPartIdentityRequired, true);
  assert.equal(machine.conditionModel.criticalFailureDisables, true);
  assert.equal(machine.conditionModel.excludesNonOperationalCapability, true);
  assert.equal(machine.conditionModel.approval, 'Approved');
  for (const configuration of machine.capabilityConfigurations) {
    assert.ok(configuration.id && configuration.supportedFunction);
    assert.ok(Array.isArray(configuration.compatibleBuildingIds) && configuration.compatibleBuildingIds.length);
    for (const buildingId of configuration.compatibleBuildingIds) assert.ok(buildingById.has(buildingId));
    assert.ok(configuration.maximumDepthM === null || configuration.maximumDepthM > 0);
    assert.ok(configuration.technologyRequirement);
    assert.ok(allowedApprovals.has(configuration.approval));
  }
  assert.ok(machine.image?.key?.endsWith(`${machine.id}.webp`));
  assert.ok(['generated', 'not-generated'].includes(machine.image.status));
  assert.equal(machine.image.generated, machine.image.status === 'generated');
}

// Part inverse compatibility is derived, exact and deterministic.
for (const part of parts) {
  const expected = machines.filter(machine => machine.partIds.includes(part.id)).map(machine => machine.id).sort();
  assert.deepEqual(part.machineIds, expected, `${part.id}: inverse Machine compatibility drift`);
}

// Buildings: configurations own required/optional quantities; machineIds is only their union.
for (const building of buildings) {
  assert.ok(Array.isArray(building.equipmentConfigurations) && building.equipmentConfigurations.length);
  assert.ok(Array.isArray(building.levelProfiles) && building.levelProfiles.length);
  assert.ok(Array.isArray(building.directPartRequirements));
  const configurationIds = new Set();
  const projectedMachineIds = [];
  for (const configuration of building.equipmentConfigurations) {
    assert.ok(!configurationIds.has(configuration.id), `${building.id}: duplicate config ${configuration.id}`);
    configurationIds.add(configuration.id);
    assert.ok(Array.isArray(configuration.applicableLevels) && configuration.applicableLevels.length);
    assert.ok(Array.isArray(configuration.equipment));
    assert.ok(allowedApprovals.has(configuration.approval));
    for (const item of configuration.equipment) {
      projectedMachineIds.push(item.machineId);
      const machine = machineById.get(item.machineId);
      assert.ok(machine, `${building.id}: unknown Machine ${item.machineId}`);
      assert.ok(['required', 'optional', 'conditional', 'installed-at-origin'].includes(item.role));
      assert.deepEqual(item.quantityByLevel.map(row => row.level), configuration.applicableLevels);
      for (const quantity of item.quantityByLevel) {
        assert.ok(Number.isInteger(quantity.quantity) && quantity.quantity >= 0);
        if (['required', 'installed-at-origin'].includes(item.role)) assert.ok(quantity.quantity > 0);
        assert.ok(allowedApprovals.has(quantity.approval));
      }
      for (const dependency of item.dependsOnMachineIds) {
        assert.ok(configuration.equipment.some(candidate => candidate.machineId === dependency),
          `${building.id}/${configuration.id}: dependency ${dependency} absent`);
      }
      if (item.capabilityConfigurationId) {
        assert.ok(machine.capabilityConfigurations.some(candidate => candidate.id === item.capabilityConfigurationId),
          `${building.id}: ${item.machineId}.${item.capabilityConfigurationId} missing`);
      }
    }
  }
  assert.deepEqual(building.machineIds, [...new Set(projectedMachineIds)],
    `${building.id}: machineIds must be the configuration compatibility union`);
  const levels = [...new Set(building.equipmentConfigurations.flatMap(configuration => configuration.applicableLevels))].sort((a, b) => a - b);
  assert.deepEqual(building.levelProfiles.map(profile => profile.level), levels);
  for (const profile of building.levelProfiles) {
    assert.ok(profile.applicableEquipmentConfigurationIds.length);
    for (const id of profile.applicableEquipmentConfigurationIds) assert.ok(configurationIds.has(id));
    for (const field of ['powerUnits', 'workforce', 'capacity']) {
      assert.ok(profile[field] === null || Number.isFinite(profile[field]));
    }
    assert.ok(allowedApprovals.has(profile.approval));
  }
  for (const requirement of building.directPartRequirements) {
    assert.ok(partById.has(requirement.partId));
    assert.ok(Number.isInteger(requirement.quantity) && requirement.quantity > 0);
  }
  assert.equal(building.wearModel.modelId, 'industrial-wear-model-v1');
  assert.equal(building.wearModel.independentBuildingEquipmentWearSystem, false);
  assert.equal(building.wearModel.failedEquipmentExcludedFromCapability, true);
  assert.equal(building.wearModel.approval, 'Approved');
  assert.ok(building.operatingRequirements.power && building.operatingRequirements.workforce);
  assert.deepEqual(new Set(Object.keys(building.fieldApprovalStatuses)), new Set([
    'equipmentConfigurations', 'levelProfiles', 'directPartRequirements', 'operatingRequirements', 'wearModel'
  ]));
}

assert.deepEqual(buildingById.get('building-collection-camp').levelProfiles.map(profile => profile.level), [1]);
assert.deepEqual(buildingById.get('building-stockpile').levelProfiles.map(profile => profile.level), [1]);
assert.deepEqual(buildingById.get('building-accommodation-building').levelProfiles.map(profile => profile.level), [1]);
assert.equal(buildingById.get('building-collection-camp').equipmentConfigurations[0].equipment
  .filter(item => item.role === 'required').length, 0);
assert.equal(buildingById.get('building-stockpile').equipmentConfigurations[0].equipment
  .filter(item => item.role === 'required').length, 0);

// Exact Android-approved extraction restrictions are preserved in the Universe mapping.
const spec = specifications[0];
assert.equal(spec.wearModel.id, 'industrial-wear-model-v1');
assert.equal(spec.approval, 'Approved');
assert.equal(spec.wearModel.approval, 'Approved');
assert.equal(spec.wearModel.machinePerformanceRule,
  'performanceFactor = machineConditionPct / 100 while powered, enabled and without a failed critical service slot; otherwise 0');
assert.equal(spec.wearModel.criticalFailureRule,
  'Any critical slot at or below its Part failureConditionPct disables the Machine.');
assert.equal(spec.extractionCapabilities.length, 9);
const expectedExtraction = new Map([
  ['quarry-excavation', [['building-quarry'], 50, 'machine-drill-machine', 'quarry-bench-drilling']],
  ['standard-shaft', [['building-simple-pit-mine', 'building-deep-mine'], 2000, 'machine-underground-mining-system', 'standard-shaft']],
  ['deep-hard-rock', [['building-deep-mine'], 8000, 'machine-underground-mining-system', 'deep-hard-rock']],
  ['deep-core', [['building-deep-mine'], 20000, 'machine-underground-mining-system', 'deep-core']],
  ['rotary-well-control', [['building-extraction-rig'], 8000, 'machine-well-drilling-system', 'rotary-well-control']],
  ['high-pressure-drilling', [['building-extraction-rig'], 12000, 'machine-well-drilling-system', 'high-pressure-drilling']],
  ['quantum-boring', [['building-extraction-rig'], 70000, 'machine-quantum-bore-system', 'quantum-boring']],
  ['precision-control', [['building-simple-pit-mine', 'building-deep-mine'], null, 'machine-substance-analyser', 'precision-extraction-control']],
  ['exotic-separation', [['building-simple-pit-mine', 'building-deep-mine'], null, 'machine-filtration-machine', 'exotic-separation']]
]);
for (const capability of spec.extractionCapabilities) {
  const [buildingIds, maximumDepthM, machineId, configurationId] = expectedExtraction.get(capability.id);
  assert.deepEqual(capability.buildingIds, buildingIds);
  assert.equal(capability.maximumDepthM, maximumDepthM);
  assert.deepEqual(capability.requiredMachineConfigurations, [{ machineId, configurationId }]);
  const machine = machineById.get(machineId);
  assert.ok(machine.capabilityConfigurations.some(configuration =>
    configuration.id === configurationId && configuration.maximumDepthM === maximumDepthM));
}
assert.deepEqual(new Set(expectedExtraction.keys()), new Set(spec.extractionCapabilities.map(row => row.id)));

const android = androidReference[0];
assert.equal(android.authority, 'reference-only-platform-balance-not-canonical-universe-facts');
assert.match(android.sourceCommit, /^[0-9a-f]{40}$/);
assert.deepEqual(android.extractionFacilityPowerByLevel['building-quarry'], [4, 9, 17, 29, 46]);
assert.deepEqual(android.outputByLevel, [10, 18, 30, 48, 72]);
assert.equal(android.interimProvisioningPolicy.newFacilityEquipmentConditionPct, 100);
assert.equal(android.interimProvisioningPolicy.newInstalledPartConditionPct, 100);
assert.equal(android.interimProvisioningPolicy.preserveDepletedReserve, true);
assert.equal(android.interimProvisioningPolicy.preserveTerrainGrading, true);
assert.equal(android.interimProvisioningPolicy.approval, 'Approved gameplay direction');

for (const heading of [
  '## A — Executive summary', '## B — Complete building catalogue',
  '## C — Complete machine catalogue', '## D — Complete parts catalogue',
  '## E — Mining compatibility matrix', '## F — Remaining approval decisions',
  '## G — Android integration impact'
]) assert.ok(report.includes(heading), `Report missing ${heading}`);
for (const record of [...buildings, ...machines, ...parts]) {
  assert.ok(report.includes(record.id), `Consolidated report missing ${record.id}`);
}
for (const capability of spec.extractionCapabilities) {
  assert.ok(report.includes(capability.name), `Consolidated report missing ${capability.name}`);
}

console.log('Industrial alignment valid: 24 Buildings, 45 Machines, 19 Parts, 9 extraction capabilities, one deterministic wear model.');
