import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataRoot = resolve('data');
const [parts, machines, buildings] = await Promise.all([
  readFile(resolve(dataRoot, 'parts.json'), 'utf8').then(JSON.parse),
  readFile(resolve(dataRoot, 'machines.json'), 'utf8').then(JSON.parse),
  readFile(resolve(dataRoot, 'buildings.json'), 'utf8').then(JSON.parse)
]);

const errors = [];
const partById = new Map(parts.map(record => [record.id, record]));
const machineById = new Map(machines.map(record => [record.id, record]));
const buildingById = new Map(buildings.map(record => [record.id, record]));

const expectedDesktopBuildings = [
  'building-collection-camp',
  'building-quarry',
  'building-simple-pit-mine',
  'building-water-collector',
  'building-crashed-ship',
  'building-farm',
  'building-accommodation-building',
  'building-habitat',
  'building-power-plant',
  'building-basic-refinery',
  'building-research-building',
  'building-shipyard-bay',
  'building-stockpile',
  'building-warehouse'
];

const expectedMobileBuildings = new Map([
  ['housing', 'building-habitat'],
  ['power', 'building-power-plant'],
  ['industry', 'building-industry'],
  ['headquarters', 'building-headquarters'],
  ['farm', 'building-farm'],
  ['ranch', 'building-ranch'],
  ['bio', 'building-bio-harvester'],
  ['algae', 'building-algae-facility'],
  ['quarry', 'building-quarry'],
  ['rig', 'building-extraction-rig'],
  ['mine', 'building-simple-pit-mine'],
  ['deep-mine', 'building-deep-mine'],
  ['spaceport', 'building-spaceport'],
  ['aquaculture-facility', 'building-aquaculture-facility'],
  ['agricultural-dome', 'building-agricultural-dome']
]);

for (const id of expectedDesktopBuildings) {
  if (!buildingById.has(id)) errors.push(`Desktop building archetype missing from canonical catalogue: ${id}`);
}

for (const [kind, id] of expectedMobileBuildings) {
  const building = buildingById.get(id);
  if (!building) {
    errors.push(`Mobile building kind ${kind} is missing canonical building ${id}`);
    continue;
  }
  if (building.provenance?.mobile?.kind !== kind) {
    errors.push(`${id} must record Mobile provenance kind ${kind}`);
  }
}

const gameplayLanguage = /\bplayer(?:'s)?\b|starting base|progress sink|escape vessel|research points|automatically created|cannot move if depleted/i;
for (const record of [...parts, ...machines, ...buildings]) {
  const text = [record.name, record.description, ...(record.sources || []), record.inputSummary, record.outputSummary, record.fuelType]
    .filter(Boolean)
    .join(' ');
  if (gameplayLanguage.test(text)) errors.push(`${record.id}: canonical industrial text contains gameplay-state language.`);
}

for (const part of parts) {
  if (!Array.isArray(part.machineIds)) errors.push(`${part.id}: machineIds must be an array.`);
  for (const machineId of part.machineIds || []) {
    const machine = machineById.get(machineId);
    if (!machine) continue; // primary universe validator reports the broken reference
    if (!(machine.partIds || []).includes(part.id)) {
      errors.push(`${part.id}.machineIds includes ${machineId}, but the machine does not reference ${part.id}.`);
    }
  }
}

for (const machine of machines) {
  for (const partId of machine.partIds || []) {
    const part = partById.get(partId);
    if (!part) continue; // primary universe validator reports the broken reference
    if (!(part.machineIds || []).includes(machine.id)) {
      errors.push(`${machine.id}.partIds includes ${partId}, but the part does not reference ${machine.id}.`);
    }
  }
}

for (const building of buildings) {
  if (!building.description?.trim()) errors.push(`${building.id}: canonical description is required.`);
  if (!building.provenance?.desktopPath && !building.provenance?.mobile) {
    errors.push(`${building.id}: must retain Desktop and/or Mobile provenance.`);
  }
}

if (buildings.length !== 24) {
  errors.push(`Combined Desktop/Mobile building catalogue must currently contain 24 reconciled archetypes; found ${buildings.length}.`);
}
if (parts.length < 13) errors.push(`Industrial parts catalogue unexpectedly small: ${parts.length}.`);
if (machines.length < 28) errors.push(`Industrial machines catalogue unexpectedly small: ${machines.length}.`);

// Canonical identity reconciliation preserves older broad Part families.
const reconciledPartIds = [
  'part-lead-acid-battery-module', 'part-lithium-based-battery-module',
  'part-thermal-parts', 'part-optical-parts',
  'part-forming-cutting-tooling', 'part-welding-parts',
  'part-precast-concrete-sections', 'part-nuclear-fuel-assembly'
];
const reconciledMachineIds = [
  'machine-conventional-electric-motor', 'machine-rare-earth-permanent-magnet-motor',
  'machine-vector-exchange-drive', 'machine-personal-recreation-terminal',
  'machine-communal-fitness-leisure-system', 'machine-advanced-entertainment-system',
  'machine-immersive-recreation-suite', 'machine-integrated-wellness-leisure-system'
];
for (const id of reconciledPartIds) {
  const part = partById.get(id);
  if (!part) { errors.push(`Canonical discovery Part missing: ${id}`); continue; }
  if (!part.provenance?.androidDiscoveryWorkingId?.startsWith('candidate-'))
    errors.push(`${id}: missing stable Android discovery crosswalk`);
  if (!part.materialApprovalStatus)
    errors.push(`${id}: source material approval state required`);
}
for (const id of reconciledMachineIds) {
  const machine = machineById.get(id);
  if (!machine) { errors.push(`Canonical discovery Machine missing: ${id}`); continue; }
  if (!machine.provenance?.androidDiscoveryWorkingId?.startsWith('candidate-'))
    errors.push(`${id}: missing stable Android discovery crosswalk`);
  if (!machine.manufacturingDesignStatus)
    errors.push(`${id}: source manufacturing-design status required`);
}
// Breaking legacy identity retirement is approved with migration review:
const retiredIds = new Set(['part-battery-parts', 'part-thermal-optical-parts', 'part-fabrication-parts']);
if (parts.length !== 19) errors.push(`Expected 19 finished Parts after retirement, found ${parts.length}`);
for (const id of retiredIds) {
  if (partById.has(id)) errors.push(`Superseded Part is still present: ${id}`);
}
let pendingConsumerEdges = 0;
for (const machine of machines) {
  for (const id of machine.partIds || []) {
    if (retiredIds.has(id)) errors.push(`${machine.id}: obsolete Part reference ${id}`);
  }
  for (const review of machine.pendingPartCompatibility || []) {
    if (review.reviewStatus !== 'unapproved-consumer-mapping')
      errors.push(`${machine.id}: pending mapping incorrectly approved`);
    if (!review.supersededFamily || !review.notes)
      errors.push(`${machine.id}: pending mapping needs a family and explanation`);
    for (const id of review.candidatePartIds || []) {
      if (!partById.has(id)) errors.push(`${machine.id}: unknown candidate Part ${id}`);
    }
    pendingConsumerEdges++;
  }
}
if (pendingConsumerEdges !== 14)
  errors.push(`Expected 14 pending Part consumer decisions, got ${pendingConsumerEdges}`);
const researchTechs = await readFile(resolve(dataRoot, 'research-technologies.json'), 'utf8').then(JSON.parse);
let pendingResearchEdges = 0;
for (const technology of researchTechs) {
  for (const id of technology.unlockedPartIds || []) {
    if (!partById.has(id)) errors.push(`${technology.id}: unknown unlock Part ${id}`);
  }
  for (const review of technology.partUnlockReview || []) {
    if (review.reviewStatus !== 'unapproved-technology-mapping')
      errors.push(`${technology.id}: pending unlock mapping incorrectly approved`);
    if (!review.supersededFamily || !review.notes)
      errors.push(`${technology.id}: pending unlock mapping needs explanation`);
    for (const id of review.candidatePartIds || []) {
      if (!partById.has(id)) errors.push(`${technology.id}: unknown candidate unlock Part ${id}`);
    }
    pendingResearchEdges++;
  }
}
if (pendingResearchEdges !== 6)
  errors.push(`Expected 6 pending Part research unlock decisions, got ${pendingResearchEdges}`);
const [genericMaterials, namedMaterials] = await Promise.all([
  readFile(resolve(dataRoot, 'substances.json'), 'utf8').then(JSON.parse),
  readFile(resolve(dataRoot, 'named-substances.json'), 'utf8').then(JSON.parse)
]);
const materialIds = new Set([...genericMaterials, ...namedMaterials].map(item => item.id));
let approvedLuxuryCount = 0;
for (const part of parts) {
  for (const substanceId of part.substanceIds || []) {
    if (!materialIds.has(substanceId))
      errors.push(`${part.id}: unknown material ${substanceId}`);
  }
}
for (const machine of machines) {
  for (const materialId of machine.principalMaterialIds || []) {
    if (!materialIds.has(materialId))
      errors.push(`${machine.id}: unknown principal material ${materialId}`);
  }
  const bom = machine.approvedPhysicalBOM;
  if (!bom) continue;
  approvedLuxuryCount++;
  if (bom.approval !== 'approved-physical-bom-2026-11-02')
    errors.push(`${machine.id}: unexpected physical BOM approval`);
  if (!machine.amenityProfile || machine.amenityProfile.approval !== 'approved-discovery-2026-11-02')
    errors.push(`${machine.id}: approved physical BOM missing approved amenity rating`);
  const linkedParts = new Set(machine.partIds || []);
  for (const entry of bom.finishedPartInputs || []) {
    if (!partById.has(entry.partId) || !linkedParts.has(entry.partId) ||
        !Number.isInteger(entry.quantity) || entry.quantity <= 0)
      errors.push(`${machine.id}: invalid finished Part input ${JSON.stringify(entry)}`);
  }
  for (const entry of bom.directMaterialInputs || []) {
    if (!materialIds.has(entry.materialId) || !Number.isFinite(entry.quantityKg) ||
        entry.quantityKg <= 0)
      errors.push(`${machine.id}: invalid direct material input ${JSON.stringify(entry)}`);
  }
  for (const field of ['assemblyLabourHours', 'factoryShopHours', 'qualificationTestHours']) {
    if (!Number.isFinite(bom[field]) || bom[field] < 0)
      errors.push(`${machine.id}: invalid approved manufacturing ${field}`);
  }
  if (!(bom.targetGoodUnitYield > 0 && bom.targetGoodUnitYield <= 1))
    errors.push(`${machine.id}: invalid approved production yield`);
  for (const field of ['residentServiceSlotsPerDay', 'floorAreaM2', 'operatingPowerUnits']) {
    if (!(machine.amenityProfile[field] > 0))
      errors.push(`${machine.id}: invalid approved amenity rating ${field}`);
  }
  if (machine.manufacturerCostCC != null || machine.baseSellQuoteCC != null)
    errors.push(`${machine.id}: provisional prices must not be canonicalised`);
}
if (approvedLuxuryCount !== 5)
  errors.push(`Expected five approved physical amenity BOMs, found ${approvedLuxuryCount}`);

if (errors.length) {
  console.error(`Industrial catalogue validation failed with ${errors.length} error(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Industrial catalogue valid: ${parts.length} parts, ${machines.length} machines, ${buildings.length} buildings (${expectedMobileBuildings.size} Mobile kinds reconciled).`);
}
