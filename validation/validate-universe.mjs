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

const errors = [], warnings = [], byId = new Map();
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imageStatuses = new Set(['not-generated', 'generated', 'approved', 'needs-regeneration']);

if (!Number.isInteger(manifest.canonicalYear)) errors.push('manifest.canonicalYear must be an integer.');
if (!Number.isInteger(manifest.civilisationBaselineYear)) errors.push('manifest.civilisationBaselineYear must be an integer.');
if (!manifest.calendar) errors.push('manifest.calendar is required.');

for (const [collectionName, records] of Object.entries(collections)) {
  for (const record of records) {
    if (!record.id) { errors.push(`${collectionName}: record missing id.`); continue; }
    if (!idPattern.test(record.id)) errors.push(`${record.id}: invalid ID format.`);
    if (byId.has(record.id)) errors.push(`${record.id}: duplicate ID.`);
    byId.set(record.id, { collectionName, record });
    if (!record.name) warnings.push(`${record.id}: missing display name.`);

    if (['people', 'ships'].includes(collectionName) && !record.image) errors.push(`${record.id}: ${collectionName} records require image-generation metadata.`);
    if (record.image) {
      if (typeof record.image.generated !== 'boolean') errors.push(`${record.id}.image.generated must be boolean.`);
      if (!imageStatuses.has(record.image.status)) errors.push(`${record.id}.image.status invalid.`);
      if (!record.image.key) errors.push(`${record.id}.image.key missing.`);
      if (record.image.status === 'not-generated' && record.image.generated !== false) errors.push(`${record.id}: not-generated image must have generated=false.`);
      if (['generated','approved'].includes(record.image.status) && record.image.generated !== true) errors.push(`${record.id}: generated/approved image must have generated=true.`);
      if (record.image.generated && record.image.key) { try { await access(resolve(repoRoot, record.image.key)); } catch { errors.push(`${record.id}: image is marked generated but asset is missing at ${record.image.key}.`); } }
    }
  }
}

const scalarRefs={starSystems:['regionId','primaryAuthorityOrganisationId'],planets:['systemId','parentPlanetId','governingOrganisationId'],settlements:['systemId','planetId','parentLocationId','governingOrganisationId'],organisations:['headquartersLocationId','parentOrganisationId'],organisationUnits:['organisationId','parentUnitId','primaryLocationId'],facilities:['organisationId','organisationUnitId','systemId','planetId','settlementId'],operations:['organisationId','organisationUnitId','facilityId'],people:['speciesId','organisationId','organisationUnitId','workLocationId','homeLocationId'],shipClasses:['manufacturerOrganisationId'],ships:['organisationId','shipClassId','homePortLocationId'],relationships:['personAId','personBId'],currencies:['sourceDocumentId'],loreTopics:['sourceDocumentId']};
const arrayRefs={regions:['administrativeOrganisationIds','systemIds'],facilities:['partnerOrganisationIds'],operations:['managerPersonIds','procurementPersonIds','shipIds','productIds'],products:['producerOrganisationIds'],people:['operationIds','shipIds'],shipClasses:['designerOrganisationIds'],ships:['operationIds','personIds'],projects:['organisationIds','locationIds','personIds','shipIds','operationIds'],events:['linkedEntityIds']};
function validateRef(sourceId,field,value){if(value==null||value==='')return;if(!byId.has(value))errors.push(`${sourceId}.${field} -> missing ${value}`);}
for(const[collectionName,fields]of Object.entries(scalarRefs)){for(const record of collections[collectionName]??[])fields.forEach(field=>validateRef(record.id,field,record[field]));}
for(const[collectionName,fields]of Object.entries(arrayRefs)){for(const record of collections[collectionName]??[]){for(const field of fields){const values=record[field]??[];if(!Array.isArray(values)){errors.push(`${record.id}.${field} must be an array.`);continue;}values.forEach(value=>validateRef(record.id,field,value));}}}
for(const unit of collections.organisationUnits??[]){if(!unit.parentUnitId)continue;const parent=byId.get(unit.parentUnitId)?.record;if(parent&&parent.organisationId!==unit.organisationId)errors.push(`${unit.id}: parent unit belongs to another organisation.`);}
for(const planet of collections.planets??[]){if(!planet.parentPlanetId)continue;const parent=byId.get(planet.parentPlanetId)?.record;if(parent&&parent.systemId!==planet.systemId)errors.push(`${planet.id}: parent world belongs to another system.`);}
for(const relationship of collections.relationships??[]){if(relationship.personAId===relationship.personBId)errors.push(`${relationship.id}: relationship self-reference.`);}
for(const operation of collections.operations??[]){for(const requirement of operation.resourceRequirements??[]){if(!requirement.resourceType||!requirement.resourceId||!requirement.reason)errors.push(`${operation.id}: incomplete resource requirement.`);}}
for(const document of collections.loreDocuments??[]){if(!document.contentPath){errors.push(`${document.id}: lore document contentPath missing.`);continue;}try{await access(resolve(dataRoot,document.contentPath));}catch{errors.push(`${document.id}: lore source missing at data/${document.contentPath}.`);}if(!document.canonLevel||!document.canonStatus)errors.push(`${document.id}: lore document requires canonLevel and canonStatus.`);}
for(const topic of collections.loreTopics??[]){if(!topic.sourceSection)warnings.push(`${topic.id}: lore topic has no sourceSection.`);if(!topic.summary)warnings.push(`${topic.id}: lore topic has no summary.`);}
for(const currency of collections.currencies??[]){if(!currency.symbol)errors.push(`${currency.id}: currency symbol missing.`);}
console.log(`MineIT Universe ${manifest.contentVersion} / schema ${manifest.schemaVersion}`);console.log(`Canonical Year ${manifest.canonicalYear}; civilisation baseline Year ${manifest.civilisationBaselineYear}.`);console.log(`${byId.size} entities across ${Object.keys(collections).length} collections.`);if(warnings.length){console.log(`\nWarnings (${warnings.length}):`);warnings.forEach(w=>console.log(`- ${w}`));}if(errors.length){console.error(`\nErrors (${errors.length}):`);errors.forEach(e=>console.error(`- ${e}`));process.exit(1);}console.log('\nValidation passed.');
