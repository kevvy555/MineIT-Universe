export const DEFAULT_DATA_ROOT = './data/';

const COLLECTION_LABELS = {
  starSystems: 'Star System',
  planets: 'Planet',
  settlements: 'Settlement',
  companies: 'Company',
  organisationUnits: 'Organisation Unit',
  facilities: 'Facility',
  operations: 'Operation',
  people: 'Person',
  ships: 'Ship'
};

const REFERENCE_FIELDS = {
  planets: ['systemId'],
  settlements: ['systemId', 'planetId', 'parentLocationId'],
  companies: ['headquartersLocationId'],
  organisationUnits: ['companyId', 'parentUnitId', 'primaryLocationId'],
  facilities: ['companyId', 'organisationUnitId', 'systemId', 'planetId', 'settlementId'],
  operations: ['companyId', 'organisationUnitId', 'facilityId'],
  people: ['companyId', 'organisationUnitId', 'workLocationId', 'homeLocationId'],
  ships: ['companyId', 'homePortLocationId']
};

const REFERENCE_ARRAY_FIELDS = {
  operations: ['managerPersonIds', 'procurementPersonIds', 'shipIds'],
  people: ['operationIds', 'shipIds'],
  ships: ['operationIds', 'personIds']
};

export class UniverseCatalogue {
  constructor(manifest, collections, dataRoot) {
    this.manifest = manifest;
    this.collections = collections;
    this.dataRoot = dataRoot;
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

  get(id) {
    return id ? this.byId.get(id) ?? null : null;
  }

  collection(name) {
    return this.collections[name] ?? [];
  }

  collectionNameFor(id) {
    return this.collectionById.get(id) ?? null;
  }

  typeLabelFor(id) {
    return COLLECTION_LABELS[this.collectionNameFor(id)] ?? 'Entity';
  }

  nameFor(id) {
    return this.get(id)?.name ?? id ?? '—';
  }

  recordsForCompany(companyId, collectionName) {
    return this.collection(collectionName).filter(record => record.companyId === companyId);
  }

  operationsForResource(resourceType, resourceId) {
    return this.collection('operations').filter(operation =>
      (operation.resourceRequirements ?? []).some(requirement =>
        requirement.resourceType === resourceType && requirement.resourceId === resourceId
      )
    );
  }

  allRecords() {
    return Object.entries(this.collections).flatMap(([collectionName, records]) =>
      records.map(record => ({ collectionName, record }))
    );
  }
}

function resolveCollectionUrl(dataRoot, collectionPath) {
  return new URL(collectionPath, new URL(dataRoot, window.location.href)).toString();
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status} ${response.statusText})`);
  }
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Invalid JSON at ${url}: ${error.message}`);
  }
}

export async function loadUniverse(dataRoot = DEFAULT_DATA_ROOT) {
  const manifestUrl = new URL('manifest.json', new URL(dataRoot, window.location.href)).toString();
  const manifest = await fetchJson(manifestUrl);

  if (!manifest.collections || typeof manifest.collections !== 'object') {
    throw new Error('Universe manifest does not declare collections.');
  }

  const entries = await Promise.all(
    Object.entries(manifest.collections).map(async ([collectionName, collectionPath]) => {
      const url = resolveCollectionUrl(dataRoot, collectionPath);
      const records = await fetchJson(url);
      if (!Array.isArray(records)) {
        throw new Error(`${collectionName} must contain a JSON array.`);
      }
      return [collectionName, records];
    })
  );

  const catalogue = new UniverseCatalogue(manifest, Object.fromEntries(entries), dataRoot);
  return { catalogue, validation: validateUniverse(catalogue) };
}

export function validateUniverse(catalogue) {
  const errors = [];
  const warnings = [];
  const seenIds = new Map();
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
      if (!idPattern.test(record.id)) {
        errors.push(`${record.id}: ID does not follow lower-kebab-case convention.`);
      }
      if (seenIds.has(record.id)) {
        errors.push(`${record.id}: duplicate ID in ${collectionName} and ${seenIds.get(record.id)}.`);
      } else {
        seenIds.set(record.id, collectionName);
      }
      if (!record.name) {
        warnings.push(`${record.id}: no display name.`);
      }
    }
  }

  const knownIds = new Set(seenIds.keys());
  const validateReference = (sourceId, field, value) => {
    if (value == null || value === '') return;
    if (!knownIds.has(value)) errors.push(`${sourceId}.${field} references missing entity ${value}.`);
  };

  for (const [collectionName, fields] of Object.entries(REFERENCE_FIELDS)) {
    for (const record of catalogue.collection(collectionName)) {
      for (const field of fields) validateReference(record.id, field, record[field]);
    }
  }

  for (const [collectionName, fields] of Object.entries(REFERENCE_ARRAY_FIELDS)) {
    for (const record of catalogue.collection(collectionName)) {
      for (const field of fields) {
        const values = record[field] ?? [];
        if (!Array.isArray(values)) {
          errors.push(`${record.id}.${field} must be an array.`);
          continue;
        }
        values.forEach(value => validateReference(record.id, field, value));
      }
    }
  }

  for (const unit of catalogue.collection('organisationUnits')) {
    if (!unit.parentUnitId) continue;
    const parent = catalogue.get(unit.parentUnitId);
    if (parent && parent.companyId !== unit.companyId) {
      errors.push(`${unit.id}: parent organisation unit belongs to a different company.`);
    }
  }

  for (const operation of catalogue.collection('operations')) {
    if (!(operation.resourceRequirements ?? []).length) {
      warnings.push(`${operation.id}: operation has no resource requirements.`);
    }
    for (const requirement of operation.resourceRequirements ?? []) {
      if (!requirement.resourceType || !requirement.resourceId || !requirement.reason) {
        errors.push(`${operation.id}: resource requirement is missing type, id or reason.`);
      }
    }
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0,
    entityCount: seenIds.size
  };
}
