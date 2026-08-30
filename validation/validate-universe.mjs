import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataRoot = resolve(here, '../data');

const manifest = JSON.parse(await readFile(resolve(dataRoot, 'manifest.json'), 'utf8'));
const collections = {};

for (const [name, file] of Object.entries(manifest.collections ?? {})) {
  const parsed = JSON.parse(await readFile(resolve(dataRoot, file), 'utf8'));
  if (!Array.isArray(parsed)) throw new Error(`${name} must contain an array.`);
  collections[name] = parsed;
}

const errors = [];
const warnings = [];
const byId = new Map();
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const [collectionName, records] of Object.entries(collections)) {
  for (const record of records) {
    if (!record.id) {
      errors.push(`${collectionName}: record missing id.`);
      continue;
    }
    if (!idPattern.test(record.id)) errors.push(`${record.id}: invalid ID format.`);
    if (byId.has(record.id)) errors.push(`${record.id}: duplicate ID.`);
    byId.set(record.id, { collectionName, record });
    if (!record.name) warnings.push(`${record.id}: missing display name.`);
  }
}

const scalarRefs = {
  planets: ['systemId'],
  settlements: ['systemId', 'planetId', 'parentLocationId'],
  companies: ['headquartersLocationId'],
  organisationUnits: ['companyId', 'parentUnitId', 'primaryLocationId'],
  facilities: ['companyId', 'organisationUnitId', 'systemId', 'planetId', 'settlementId'],
  operations: ['companyId', 'organisationUnitId', 'facilityId'],
  people: ['companyId', 'organisationUnitId', 'workLocationId', 'homeLocationId'],
  ships: ['companyId', 'homePortLocationId']
};

const arrayRefs = {
  operations: ['managerPersonIds', 'procurementPersonIds', 'shipIds'],
  people: ['operationIds', 'shipIds'],
  ships: ['operationIds', 'personIds']
};

function validateRef(sourceId, field, value) {
  if (value == null || value === '') return;
  if (!byId.has(value)) errors.push(`${sourceId}.${field} -> missing ${value}`);
}

for (const [collectionName, fields] of Object.entries(scalarRefs)) {
  for (const record of collections[collectionName] ?? []) {
    for (const field of fields) validateRef(record.id, field, record[field]);
  }
}

for (const [collectionName, fields] of Object.entries(arrayRefs)) {
  for (const record of collections[collectionName] ?? []) {
    for (const field of fields) {
      const values = record[field] ?? [];
      if (!Array.isArray(values)) {
        errors.push(`${record.id}.${field} must be an array.`);
        continue;
      }
      values.forEach(value => validateRef(record.id, field, value));
    }
  }
}

for (const unit of collections.organisationUnits ?? []) {
  if (!unit.parentUnitId) continue;
  const parent = byId.get(unit.parentUnitId)?.record;
  if (parent && parent.companyId !== unit.companyId) {
    errors.push(`${unit.id}: parent unit belongs to another company.`);
  }
}

for (const operation of collections.operations ?? []) {
  if (!(operation.resourceRequirements ?? []).length) warnings.push(`${operation.id}: no resource requirements.`);
  for (const requirement of operation.resourceRequirements ?? []) {
    if (!requirement.resourceType || !requirement.resourceId || !requirement.reason) {
      errors.push(`${operation.id}: incomplete resource requirement.`);
    }
  }
}

console.log(`MineIT Universe ${manifest.contentVersion} / schema ${manifest.schemaVersion}`);
console.log(`${byId.size} entities across ${Object.keys(collections).length} collections.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach(warning => console.log(`- ${warning}`));
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('\nValidation passed.');
