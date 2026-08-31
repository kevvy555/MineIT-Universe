export const DEFAULT_DATA_ROOT = './data/';

const COLLECTION_LABELS = {
  regions: 'Region',
  starSystems: 'Star System',
  planets: 'World',
  settlements: 'Settlement / Station',
  organisations: 'Organisation',
  organisationUnits: 'Organisation Unit',
  facilities: 'Facility',
  operations: 'Operation',
  products: 'Product',
  species: 'Species / People Category',
  people: 'Person',
  shipClasses: 'Ship Class',
  ships: 'Ship',
  projects: 'Project',
  events: 'Historical Event',
  relationships: 'Relationship',
  currencies: 'Currency',
  loreDocuments: 'Canon Source',
  loreTopics: 'Lore Topic'
};

const SCALAR_REFS = {
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

const ARRAY_REFS = {
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

const IMAGE_STATUSES = new Set(['not-generated', 'generated', 'approved', 'needs-regeneration']);

export class UniverseCatalogue {
  constructor(manifest, collections, dataRoot, manifestUrl) {
    this.manifest = manifest;
    this.collections = collections;
    this.dataRoot = dataRoot;
    this.manifestUrl = manifestUrl;
    this.byId = new Map();
    this.collectionById = new Map();

    for (const [collectionName, records] of Object.entries(collections)) {
      for (const record of records) {
        if (!this.byId.has(record.id)) {
          this.byId.set(record.id, record);
          this.collectionById.set(record.id, collectionName);
        }
      }
    }
  }

  get(id) { return id ? this.byId.get(id) ?? null : null; }
  collection(name) { return this.collections[name] ?? []; }
  collectionNameFor(id) { return this.collectionById.get(id) ?? null; }
  typeLabelFor(id) { return COLLECTION_LABELS[this.collectionNameFor(id)] ?? 'Entity'; }
  nameFor(id) { return this.get(id)?.name ?? id ?? '—'; }

  allRecords() {
    return Object.entries(this.collections).flatMap(([collectionName, records]) =>
      records.map(record => ({ collectionName, record }))
    );
  }

  operationsForResource(resourceType, resourceId) {
    return this.collection('operations').filter(operation =>
      (operation.resourceRequirements ?? []).some(requirement =>
        requirement.resourceType === resourceType && requirement.resourceId === resourceId
      )
    );
  }

  assetUrl(key) {
    if (!key) return null;
    return new URL(`../${key.replace(/^\.?\//, '')}`, this.manifestUrl).toString();
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load ${url} (${response.status} ${response.statusText})`);
  try { return await response.json(); }
  catch (error) { throw new Error(`Invalid JSON at ${url}: ${error.message}`); }
}

export async function loadUniverse(dataRoot = DEFAULT_DATA_ROOT) {
  const rootUrl = new URL(dataRoot, window.location.href);
  const manifestUrl = new URL('manifest.json', rootUrl).toString();
  const manifest = await fetchJson(manifestUrl);

  if (!manifest.collections || typeof manifest.collections !== 'object') {
    throw new Error('Universe manifest does not declare collections.');
  }

  const entries = await Promise.all(Object.entries(manifest.collections).map(async ([name, path]) => {
    const url = new URL(path, rootUrl).toString();
    const records = await fetchJson(url);
    if (!Array.isArray(records)) throw new Error(`${name} must contain a JSON array.`);
    return [name, records];
  }));

  const catalogue = new UniverseCatalogue(manifest, Object.fromEntries(entries), dataRoot, manifestUrl);
  return { catalogue, validation: validateUniverse(catalogue) };
}

export function validateUniverse(catalogue) {
  const errors = [];
  const warnings = [];
  const seen = new Map();
  const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const [collectionName, records] of Object.entries(catalogue.collections)) {
    for (const record of records) {
      if (!record || typeof record !== 'object') {
        errors.push(`${collectionName} contains a non-object record.`);
        continue;
      }
      if (!record.id) {
        errors.push(`${collectionName} contains a record without an id.`);
        continue;
      }
      if (!idPattern.test(record.id)) errors.push(`${record.id}: invalid lower-kebab-case ID.`);
      if (seen.has(record.id)) errors.push(`${record.id}: duplicate ID in ${collectionName} and ${seen.get(record.id)}.`);
      else seen.set(record.id, collectionName);
      if (!record.name) warnings.push(`${record.id}: no display name.`);

      if (record.image) {
        if (typeof record.image.generated !== 'boolean') errors.push(`${record.id}.image.generated must be boolean.`);
        if (!IMAGE_STATUSES.has(record.image.status)) errors.push(`${record.id}.image.status is invalid.`);
        if (!record.image.key) errors.push(`${record.id}.image.key is required.`);
        if (record.image.status === 'not-generated' && record.image.generated !== false) {
          errors.push(`${record.id}: not-generated image must have generated=false.`);
        }
        if (['generated', 'approved'].includes(record.image.status) && record.image.generated !== true) {
          errors.push(`${record.id}: ${record.image.status} image must have generated=true.`);
        }
      }
    }
  }

  const knownIds = new Set(seen.keys());
  const ref = (sourceId, field, value) => {
    if (value == null || value === '') return;
    if (!knownIds.has(value)) errors.push(`${sourceId}.${field} references missing entity ${value}.`);
  };

  for (const { record } of catalogue.allRecords()) {
    if (record.sourceDocumentId) ref(record.id, 'sourceDocumentId', record.sourceDocumentId);
  }

  for (const [collectionName, fields] of Object.entries(SCALAR_REFS)) {
    for (const record of catalogue.collection(collectionName)) {
      for (const field of fields) ref(record.id, field, record[field]);
    }
  }

  for (const [collectionName, fields] of Object.entries(ARRAY_REFS)) {
    for (const record of catalogue.collection(collectionName)) {
      for (const field of fields) {
        const values = record[field] ?? [];
        if (!Array.isArray(values)) {
          errors.push(`${record.id}.${field} must be an array.`);
          continue;
        }
        values.forEach(value => ref(record.id, field, value));
      }
    }
  }

  for (const unit of catalogue.collection('organisationUnits')) {
    if (!unit.parentUnitId) continue;
    const parent = catalogue.get(unit.parentUnitId);
    if (parent && parent.organisationId !== unit.organisationId) {
      errors.push(`${unit.id}: parent organisation unit belongs to another organisation.`);
    }
  }

  for (const planet of catalogue.collection('planets')) {
    if (!planet.parentPlanetId) continue;
    const parent = catalogue.get(planet.parentPlanetId);
    if (parent && parent.systemId !== planet.systemId) {
      errors.push(`${planet.id}: parent planet/moon belongs to another system.`);
    }
  }

  for (const relationship of catalogue.collection('relationships')) {
    if (relationship.personAId === relationship.personBId) {
      errors.push(`${relationship.id}: person relationship cannot point to the same person twice.`);
    }
  }

  for (const operation of catalogue.collection('operations')) {
    for (const requirement of operation.resourceRequirements ?? []) {
      if (!requirement.resourceType || !requirement.resourceId || !requirement.reason) {
        errors.push(`${operation.id}: resource requirement is missing type, id or reason.`);
      }
    }
  }

  const retiredSpecies = new Set(catalogue.collection('species')
    .filter(species => species.canonStatus === 'retired-pre-lore-placeholder')
    .map(species => species.id));
  for (const person of catalogue.collection('people')) {
    if (retiredSpecies.has(person.speciesId)) {
      warnings.push(`${person.id}: pre-lore generated person still requires heritage reconciliation.`);
    }
  }

  return { errors, warnings, isValid: errors.length === 0, entityCount: seen.size };
}
