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
  ['spaceport', 'building-spaceport']
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

if (buildings.length !== 22) {
  errors.push(`Combined Desktop/Mobile building catalogue must currently contain 22 reconciled archetypes; found ${buildings.length}.`);
}
if (parts.length < 13) errors.push(`Industrial parts catalogue unexpectedly small: ${parts.length}.`);
if (machines.length < 28) errors.push(`Industrial machines catalogue unexpectedly small: ${machines.length}.`);

if (errors.length) {
  console.error(`Industrial catalogue validation failed with ${errors.length} error(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Industrial catalogue valid: ${parts.length} parts, ${machines.length} machines, ${buildings.length} buildings (${expectedMobileBuildings.size} Mobile kinds reconciled).`);
}
