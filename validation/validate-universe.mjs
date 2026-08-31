import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const dataRoot = resolve(repoRoot, 'data');
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
const imageStatuses = new Set(['not-generated', 'generated', 'approved', 'needs-regeneration']);

if (!Number.isInteger(manifest.canonicalYear)) errors.push('manifest.canonicalYear must be an integer.');
if (!Number.isInteger(manifest.civilisationBaselineYear)) errors.push('manifest.civilisationBaselineYear must be an integer.');
if (!manifest.calendar) errors.push('manifest.calendar is required.');
if (manifest.canonicalYear !== 5326) errors.push('manifest.canonicalYear must match the Deep Reach canonical era: 5326.');
if (manifest.civilisationBaselineYear !== 5300) errors.push('manifest.civilisationBaselineYear must match the foundation lore baseline: 5300.');

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

    if (['people', 'ships'].includes(collectionName) && !record.image) {
      errors.push(`${record.id}: ${collectionName} records require image-generation metadata.`);
    }
    if (record.image) {
      if (typeof record.image.generated !== 'boolean') errors.push(`${record.id}.image.generated must be boolean.`);
      if (!imageStatuses.has(record.image.status)) errors.push(`${record.id}.image.status invalid.`);
      if (!record.image.key) errors.push(`${record.id}.image.key missing.`);
      if (record.image.status === 'not-generated' && record.image.generated !== false) errors.push(`${record.id}: not-generated image must have generated=false.`);
      if (['generated', 'approved'].includes(record.image.status) && record.image.generated !== true) errors.push(`${record.id}: generated/approved image must have generated=true.`);
      if (record.image.generated && record.image.key) {
        try { await access(resolve(repoRoot, record.image.key)); }
        catch { errors.push(`${record.id}: image is marked generated but asset is missing at ${record.image.key}.`); }
      }
    }
  }
}

function validateRef(sourceId, field, value) {
  if (value == null || value === '') return;
  if (!byId.has(value)) errors.push(`${sourceId}.${field} -> missing ${value}`);
}

for (const { record } of byId.values()) {
  if (record.sourceDocumentId) validateRef(record.id, 'sourceDocumentId', record.sourceDocumentId);
}

const scalarRefs = {
  starSystems: ['regionId', 'primaryAuthorityOrganisationId', 'homeworldId'],
  planets: ['systemId', 'parentPlanetId', 'governingOrganisationId'],
  settlements: ['systemId', 'planetId', 'parentLocationId', 'governingOrganisationId'],
  organisations: ['headquartersLocationId', 'parentOrganisationId'],
  organisationUnits: ['organisationId', 'parentUnitId', 'primaryLocationId'],
  facilities: ['organisationId', 'organisationUnitId', 'systemId', 'planetId', 'settlementId'],
  operations: ['organisationId', 'organisationUnitId', 'facilityId'],
  species: ['homeworldId'],
  people: ['speciesId', 'organisationId', 'organisationUnitId', 'workLocationId', 'homeLocationId'],
  shipClasses: ['manufacturerOrganisationId'],
  ships: ['organisationId', 'shipClassId', 'homePortLocationId'],
  relationships: ['personAId', 'personBId'],
  currencies: ['sourceDocumentId'],
  loreTopics: ['sourceDocumentId']
};
const arrayRefs = {
  regions: ['administrativeOrganisationIds', 'systemIds'],
  facilities: ['partnerOrganisationIds'],
  operations: ['managerPersonIds', 'procurementPersonIds', 'shipIds', 'productIds'],
  products: ['producerOrganisationIds'],
  people: ['operationIds', 'shipIds'],
  shipClasses: ['designerOrganisationIds'],
  ships: ['operationIds', 'personIds'],
  projects: ['organisationIds', 'locationIds', 'personIds', 'shipIds', 'operationIds'],
  events: ['linkedEntityIds']
};

for (const [collectionName, fields] of Object.entries(scalarRefs)) {
  for (const record of collections[collectionName] ?? []) {
    fields.forEach(field => validateRef(record.id, field, record[field]));
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
  if (parent && parent.organisationId !== unit.organisationId) errors.push(`${unit.id}: parent unit belongs to another organisation.`);
}
for (const planet of collections.planets ?? []) {
  if (!planet.parentPlanetId) continue;
  const parent = byId.get(planet.parentPlanetId)?.record;
  if (parent && parent.systemId !== planet.systemId) errors.push(`${planet.id}: parent world belongs to another system.`);
}
for (const relationship of collections.relationships ?? []) {
  if (relationship.personAId === relationship.personBId) errors.push(`${relationship.id}: relationship self-reference.`);
}
for (const operation of collections.operations ?? []) {
  for (const requirement of operation.resourceRequirements ?? []) {
    if (!requirement.resourceType || !requirement.resourceId || !requirement.reason) errors.push(`${operation.id}: incomplete resource requirement.`);
  }
}
for (const document of collections.loreDocuments ?? []) {
  if (!document.contentPath) {
    errors.push(`${document.id}: lore document contentPath missing.`);
    continue;
  }
  try { await access(resolve(dataRoot, document.contentPath)); }
  catch { errors.push(`${document.id}: lore source missing at data/${document.contentPath}.`); }
  if (!document.canonLevel || !document.canonStatus) errors.push(`${document.id}: lore document requires canonLevel and canonStatus.`);
}
for (const topic of collections.loreTopics ?? []) {
  if (!topic.sourceSection) warnings.push(`${topic.id}: lore topic has no sourceSection.`);
  if (!topic.summary) warnings.push(`${topic.id}: lore topic has no summary.`);
}
for (const currency of collections.currencies ?? []) {
  if (!currency.symbol) errors.push(`${currency.id}: currency symbol missing.`);
}

const requiredSourceEntities = [
  'species-trondonian',
  'species-zoran',
  'species-blaxmar',
  'organisation-koplin-compact',
  'organisation-koplin-resource-charter',
  'organisation-koplin-commonwealth-exploration-service',
  'currency-commonwealth-credit',
  'ship-class-pathfinder-long-range-survey-support',
  'ship-class-prospector-frontier-utility',
  'ship-ksv-meridian',
  'ship-ksv-wayfarer'
];
for (const id of requiredSourceEntities) if (!byId.has(id)) errors.push(`Required source-canonical entity missing: ${id}.`);

const commonwealth = byId.get('organisation-koplin-compact')?.record;
if (commonwealth?.name !== 'Koplin Commonwealth') errors.push('organisation-koplin-compact must resolve to Koplin Commonwealth.');
const deepReach = byId.get('organisation-koplin-resource-charter')?.record;
if (deepReach?.name !== 'Koplin Deep Reach Corporation') errors.push('organisation-koplin-resource-charter must resolve to Koplin Deep Reach Corporation.');
const koplinSystem = byId.get('system-koplin')?.record;
if (!String(koplinSystem?.starType ?? '').toLowerCase().includes('white-dwarf')) errors.push('system-koplin must use the source-canonical white-dwarf remnant star type.');
const koplin3 = byId.get('planet-koplin-prime')?.record;
if (koplin3?.name !== 'Koplin 3') errors.push('planet-koplin-prime must resolve to source-canonical Koplin 3.');
if ((collections.organisations ?? []).some(org => String(org.organisationType).toLowerCase().includes('synthetic polity'))) errors.push('AI may not be represented as a sovereign synthetic polity under foundation canon.');

const retiredSpecies = new Set((collections.species ?? []).filter(s => s.canonStatus === 'retired-pre-lore-placeholder').map(s => s.id));
for (const person of collections.people ?? []) {
  if (retiredSpecies.has(person.speciesId)) warnings.push(`${person.id}: pre-lore generated person still requires heritage reconciliation from retired species placeholder ${person.speciesId}.`);
}

console.log(`MineIT Universe ${manifest.contentVersion} / schema ${manifest.schemaVersion}`);
console.log(`Canonical Year ${manifest.canonicalYear}; civilisation baseline Year ${manifest.civilisationBaselineYear}.`);
console.log(`${byId.size} entities across ${Object.keys(collections).length} collections.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`- ${w}`));
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}
console.log('\nValidation passed.');
