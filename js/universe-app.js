import { loadUniverse } from './universe-data.js';
import { bindOriginalImageOpener } from './image-lightbox.js';

const state = {
  catalogue: null,
  validation: null,
  activeView: 'geography',
  selectedId: null,
  openNodes: new Set(),
  currentTree: null
};

const treeEl = document.getElementById('tree');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const versionEl = document.getElementById('version');
const detailPane = document.getElementById('detail');
const workspace = document.getElementById('workspace');
const divider = document.getElementById('divider');

const DIRECTORY = {
  regions: 'Regions',
  starSystems: 'Star Systems',
  planets: 'Planets / Moons',
  settlements: 'Settlements / Stations',
  organisations: 'Organisations',
  organisationUnits: 'Organisation Units',
  facilities: 'Facilities',
  operations: 'Operations',
  products: 'Products',
  species: 'Species / People Categories',
  people: 'People',
  shipClasses: 'Ship Classes',
  ships: 'Named Ships',
  projects: 'Projects',
  events: 'Historical Events',
  relationships: 'Relationships',
  currencies: 'Currencies',
  loreDocuments: 'Canon Sources',
  loreTopics: 'Lore Quick Reference'
};

const ICONS = {
  regions: '◎', starSystems: '✦', planets: '●', celestialBodyKinds: '◉', worldTypes: '◌',
  atmosphereTypes: '☁', surfaceLandforms: '⛰', surfaceBiomes: '⚘', surfaceFeatures: '◻',
  surfaceHydrospheres: '≈', geologyProvinces: '▣', findSites: '⌖', games: '▶',
  landscapeTilesets: '▦', landscapeTiles: '▪',
  settlements: '⬡', organisations: 'O',
  organisationUnits: '▦', facilities: '⌂', operations: '⚙', products: '◆', substances: '▣',
  parts: '⧉', machines: '⚒', buildings: '⌂', species: 'S',
  people: 'P', shipClasses: '△', ships: '▲', projects: '◇', events: '◷', relationships: '↔',
  currencies: '¤', loreDocuments: '▤', loreTopics: 'i'
};

const nodeKey = node => node.id || `label:${node.label}`;
const entityNode = (id, children = []) => ({ id, children: children.filter(Boolean) });
const category = (label, children = []) => children.filter(Boolean).length ? { label, children: children.filter(Boolean) } : null;
const byName = (a, b) => state.catalogue.nameFor(a.id).localeCompare(state.catalogue.nameFor(b.id));
const nodes = records => records.map(record => entityNode(record.id)).sort(byName);
const related = (collection, predicate) => state.catalogue.collection(collection).filter(predicate);
const relatedIds = (collection, predicate) => related(collection, predicate).map(record => record.id);
const uniq = values => [...new Set((values || []).filter(Boolean))];

function organisationUnitNode(unit) {
  return entityNode(unit.id, [
    ...related('organisationUnits', candidate => candidate.parentUnitId === unit.id).map(organisationUnitNode).sort(byName),
    category('People', nodes(related('people', person => person.organisationUnitId === unit.id))),
    category('Facilities', nodes(related('facilities', facility => facility.organisationUnitId === unit.id))),
    category('Operations', nodes(related('operations', operation => operation.organisationUnitId === unit.id)))
  ]);
}

function organisationNode(org) {
  return entityNode(org.id, [
    ...related('organisationUnits', unit => unit.organisationId === org.id && !unit.parentUnitId).map(organisationUnitNode).sort(byName),
    category('People', nodes(related('people', person => person.organisationId === org.id && !person.organisationUnitId))),
    category('Facilities', nodes(related('facilities', facility => facility.organisationId === org.id && !facility.organisationUnitId))),
    category('Named Ships', nodes(related('ships', ship => ship.organisationId === org.id))),
    category('Projects', nodes(related('projects', project => (project.organisationIds || []).includes(org.id))))
  ]);
}

function settlementNode(settlement) {
  return entityNode(settlement.id, [
    category('Organisations', nodes(related('organisations', org => org.headquartersLocationId === settlement.id))),
    category('Facilities', nodes(related('facilities', facility => facility.settlementId === settlement.id))),
    category('People', nodes(related('people', person => person.workLocationId === settlement.id || person.homeLocationId === settlement.id))),
    category('Named Ships', nodes(related('ships', ship => ship.homePortLocationId === settlement.id)))
  ]);
}

function worldNode(world) {
  const moons = related('planets', planet => planet.parentPlanetId === world.id);
  return entityNode(world.id, [
    category('Moons', moons.map(worldNode).sort(byName)),
    category('Settlements / Stations', related('settlements', settlement => settlement.planetId === world.id).map(settlementNode).sort(byName)),
    category('Facilities', nodes(related('facilities', facility => facility.planetId === world.id && !facility.settlementId))),
    category('Landscape tileset', nodes(related('landscapeTilesets', tileset => tileset.planetId === world.id)))
  ]);
}

function systemNode(system) {
  const roots = related('planets', planet => planet.systemId === system.id && !planet.parentPlanetId);
  return entityNode(system.id, [
    ...roots.map(worldNode).sort(byName),
    category('Projects', nodes(related('projects', project => (project.locationIds || []).includes(system.id)))),
    category('Historical Events', nodes(related('events', event => (event.linkedEntityIds || []).includes(system.id))))
  ]);
}

function buildGeographyTree() {
  const regions = state.catalogue.collection('regions').map(region =>
    entityNode(region.id, state.catalogue.collection('starSystems').filter(system => system.regionId === region.id).map(systemNode).sort(byName))
  );
  return { label: state.catalogue.manifest.name || 'MineIT Universe', children: regions.sort(byName) };
}

function buildOrganisationTree() {
  return { label: 'Organisations', children: state.catalogue.collection('organisations').map(organisationNode).sort(byName) };
}

function groupRecords(records, keyFn) {
  const groups = new Map();
  for (const record of records) {
    const key = keyFn(record) || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function buildSubstancesDirectoryNode() {
  const records = state.catalogue.collection('substances');
  return category('Substances', groupRecords(records, record => record.dominantArchetype).map(([archetype, items]) => {
    const raw = items.filter(item => !item.refined);
    const refined = items.filter(item => item.refined);
    return category(archetype, [
      category('Raw', nodes(raw)),
      category('Refined', nodes(refined))
    ].filter(Boolean));
  }));
}

function buildPartsDirectoryNode() {
  const records = state.catalogue.collection('parts');
  return category('Parts', groupRecords(records, record => record.category).map(([partCategory, items]) =>
    category(partCategory, groupRecords(items, record => record.subCategory).map(([subCategory, subItems]) =>
      category(subCategory, nodes(subItems))
    ))
  ));
}

function buildMachinesDirectoryNode() {
  const records = state.catalogue.collection('machines');
  return category('Machines', groupRecords(records, record => record.category).map(([machineCategory, items]) =>
    category(machineCategory, nodes(items))
  ));
}

function buildBuildingsDirectoryNode() {
  const records = state.catalogue.collection('buildings');
  return category('Buildings', groupRecords(records, record => record.category).map(([buildingCategory, items]) =>
    category(buildingCategory, nodes(items))
  ));
}

function buildGamesDirectoryNode() {
  return category('Games', nodes(state.catalogue.collection('games')));
}

function buildLandDirectoryNode() {
  const worldTypes = state.catalogue.collection('worldTypes');
  return category('Land', [
    category('Celestial Body Kinds', nodes(state.catalogue.collection('celestialBodyKinds'))),
    category('World Types', groupRecords(worldTypes, record => state.catalogue.nameFor(record.appliesToKindId)).map(([kind, items]) =>
      category(kind, nodes(items))
    )),
    category('Atmosphere Types', nodes(state.catalogue.collection('atmosphereTypes'))),
    category('Landforms', nodes(state.catalogue.collection('surfaceLandforms'))),
    category('Biomes', nodes(state.catalogue.collection('surfaceBiomes'))),
    category('Surface Features', nodes(state.catalogue.collection('surfaceFeatures'))),
    category('Hydrosphere', nodes(state.catalogue.collection('surfaceHydrospheres'))),
    category('Geology Provinces', nodes(state.catalogue.collection('geologyProvinces'))),
    category('Find Sites', nodes(state.catalogue.collection('findSites'))),
    category('Landscape Tilesets', state.catalogue.collection('landscapeTilesets').map(tileset =>
      entityNode(tileset.id, groupRecords(
        related('landscapeTiles', tile => tile.tilesetId === tileset.id),
        tile => tile.biomeId
          ? state.catalogue.nameFor(tile.biomeId)
          : (tile.hydrosphereId ? state.catalogue.nameFor(tile.hydrosphereId) : 'Water')
      ).map(([label, items]) => category(label, nodes(items))))
    ))
  ]);
}

function buildDirectoryTree() {
  const beforeProducts = ['regions', 'starSystems', 'planets', 'settlements', 'organisations', 'organisationUnits', 'facilities', 'operations', 'products'];
  const afterIndustrial = ['species', 'people', 'shipClasses', 'ships', 'projects', 'events', 'relationships', 'currencies', 'loreDocuments', 'loreTopics'];
  const flatNode = name => category(DIRECTORY[name], nodes(state.catalogue.collection(name)));
  return {
    label: 'Directory',
    children: [
      buildGamesDirectoryNode(),
      ...beforeProducts.map(flatNode),
      buildLandDirectoryNode(),
      buildSubstancesDirectoryNode(),
      buildPartsDirectoryNode(),
      buildMachinesDirectoryNode(),
      buildBuildingsDirectoryNode(),
      ...afterIndustrial.map(flatNode)
    ].filter(Boolean)
  };
}

function buildTree() {
  if (state.activeView === 'organisation') return buildOrganisationTree();
  if (state.activeView === 'directory') return buildDirectoryTree();
  return buildGeographyTree();
}

function findPath(node, id, path = []) {
  const next = [...path, node];
  if (node.id === id) return next;
  for (const child of node.children || []) {
    const found = findPath(child, id, next);
    if (found) return found;
  }
  return null;
}

function revealSelected() {
  state.currentTree = buildTree();
  const path = findPath(state.currentTree, state.selectedId);
  if (path) path.slice(0, -1).forEach(node => state.openNodes.add(nodeKey(node)));
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function link(id, label) {
  if (!id) return '—';
  const entity = state.catalogue.get(id);
  return entity
    ? `<button class="entityLink" data-ref="${esc(id)}">${esc(label || entity.name)}</button>`
    : `<span class="status error">Broken: ${esc(id)}</span>`;
}

function links(ids) {
  const list = uniq(ids);
  return list.length ? `<div class="multiLinks">${list.map(id => link(id)).join('')}</div>` : '—';
}

function tags(values) {
  return values?.length ? `<div class="tagList">${values.map(value => `<span class="tag">${esc(value)}</span>`).join('')}</div>` : '—';
}

function field(label, value) {
  return `<div class="field"><div class="fieldLabel">${esc(label)}</div><div class="fieldValue">${value ?? '—'}</div></div>`;
}

function population(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat('en-GB').format(value) : '—';
}

function renderNode(node) {
  const key = nodeKey(node);
  const children = node.children || [];
  const open = state.openNodes.has(key);
  const entity = node.id ? state.catalogue.get(node.id) : null;
  const li = document.createElement('li');
  const row = document.createElement('div');
  row.className = `treeRow${node.id === state.selectedId ? ' selected' : ''}`;
  if (node.id === state.selectedId) row.dataset.selected = 'true';

  const twist = document.createElement('button');
  twist.className = `twisty${children.length ? '' : ' empty'}`;
  twist.textContent = children.length ? (open ? '▾' : '▸') : '';
  twist.onclick = event => {
    event.stopPropagation();
    open ? state.openNodes.delete(key) : state.openNodes.add(key);
    renderTree();
  };

  const button = document.createElement('button');
  button.className = `node${node.id ? '' : ' categoryNode'}`;
  button.innerHTML = `${esc(entity?.name || node.label || node.id)}${entity ? ` <span class="kind">${esc(state.catalogue.typeLabelFor(node.id))}</span>` : ''}`;
  button.onclick = () => {
    if (node.id) selectEntity(node.id);
    else {
      open ? state.openNodes.delete(key) : state.openNodes.add(key);
      renderTree();
    }
  };

  row.append(twist, button);
  li.append(row);
  if (children.length && open) {
    const ul = document.createElement('ul');
    children.forEach(child => ul.append(renderNode(child)));
    li.append(ul);
  }
  return li;
}

function renderTree() {
  treeEl.innerHTML = '';
  const query = searchEl.value.trim().toLowerCase();
  if (query) {
    const matches = state.catalogue.allRecords().filter(({ record, collectionName }) => {
      const haystack = [
        record.name,
        record.role,
        record.description,
        record.summary,
        record.scope,
        record.organisationType,
        record.sourceSection,
        record.knowledgeScope,
        record.symbol,
        record.canonStatus,
        record.dominantArchetype,
        record.substanceType,
        record.thermalBehaviour,
        record.standardState,
        record.tier,
        record.industrialRole,
        record.form,
        record.category,
        record.subCategory,
        record.buildingType,
        record.entityType,
        record.gameName,
        record.designName,
        record.layer,
        record.catalogTier,
        record.depthBand,
        record.shortName,
        record.playPattern,
        record.form,
        record.platform,
        record.surfaceAssignmentStatus,
        record.adjacencyRole,
        collectionName,
        record.id
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
    if (!matches.length) {
      treeEl.innerHTML = '<div class="searchEmpty">No matching universe entities.</div>';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'treeRoot';
    matches.sort((a, b) => a.record.name.localeCompare(b.record.name)).forEach(({ record }) => ul.append(renderNode({ id: record.id })));
    treeEl.append(ul);
    return;
  }

  state.currentTree = buildTree();
  const ul = document.createElement('ul');
  ul.className = 'treeRoot';
  ul.append(renderNode(state.currentTree));
  treeEl.append(ul);
}

function subtitle(collection, entity) {
  const map = {
    regions: entity.regionType,
    starSystems: entity.starType,
    planets: entity.worldType,
    celestialBodyKinds: entity.codeName,
    worldTypes: entity.gameName || entity.designName,
    atmosphereTypes: entity.name,
    surfaceLandforms: entity.layer,
    surfaceBiomes: entity.layer,
    surfaceFeatures: entity.layer,
    surfaceHydrospheres: entity.layer,
    geologyProvinces: entity.layer,
    findSites: `${entity.catalogTier || ''} • ${entity.depthBand || ''}`.trim(),
    landscapeTilesets: entity.planetId ? state.catalogue.nameFor(entity.planetId) : '',
    landscapeTiles: [entity.landformId && state.catalogue.nameFor(entity.landformId), entity.biomeId && state.catalogue.nameFor(entity.biomeId), entity.hydrosphereId && state.catalogue.nameFor(entity.hydrosphereId)].filter(Boolean).join(' • '),
    games: `${entity.form || ''} • ${entity.playPattern || ''}`.trim(),
    settlements: entity.locationType,
    organisations: `${entity.scale || ''} ${entity.organisationType || ''}`.trim(),
    organisationUnits: entity.unitType,
    facilities: `${entity.facilityType || ''} • ${entity.status || ''}`,
    operations: `${entity.operationType || ''} • ${entity.status || ''}`,
    products: entity.productType,
    substances: `${entity.dominantArchetype || ''} • ${entity.refined ? 'Refined' : 'Raw'}`.trim(),
    parts: `${entity.category || ''} • ${entity.subCategory || ''}`.trim(),
    machines: `${entity.category || ''} • ${entity.subCategory || ''}`.trim(),
    buildings: entity.category,
    species: entity.speciesType,
    people: entity.role,
    shipClasses: entity.role,
    ships: entity.role,
    projects: `${entity.projectType || ''} • ${entity.status || ''}`,
    events: `${entity.date || ''} • ${entity.eventType || ''}`,
    relationships: entity.relationshipType,
    currencies: entity.symbol ? `${entity.symbol} • ${entity.currencyType || 'Currency'}` : entity.currencyType,
    loreDocuments: `${entity.canonLevel || ''} • ${entity.canonStatus || ''}`,
    loreTopics: `${entity.topicType || ''} • ${entity.knowledgeScope || ''}`
  };
  return map[collection] || '';
}

function sourceFields(entity) {
  let html = '';
  if (entity.canonStatus) html += field('Canon status', esc(entity.canonStatus));
  if (entity.sourceDocumentId) html += field('Canon source', link(entity.sourceDocumentId));
  if (entity.sourceSection) html += field('Source section', esc(entity.sourceSection));
  return html;
}

function loreOpenLink(documentId, section = '') {
  if (!documentId) return '—';
  const query = new URLSearchParams({ doc: documentId });
  if (section) query.set('section', section);
  return `<a class="entityLink" href="./lore.html?${esc(query.toString())}">Open in Lore Explorer</a>`;
}

function fieldsFor(collection, entity) {
  const fields = [];

  if (collection === 'regions') {
    fields.push(field('Systems', links(relatedIds('starSystems', item => item.regionId === entity.id))), field('Administration', links(entity.administrativeOrganisationIds)), field('Economic profile', tags(entity.economicProfile)));
  }
  if (collection === 'starSystems') {
    fields.push(field('Region', link(entity.regionId)), field('Star type', esc(entity.starType)), field('Authority', link(entity.primaryAuthorityOrganisationId)), field('Coordinates', esc(`${entity.coordinates?.x}, ${entity.coordinates?.y}, ${entity.coordinates?.z}`)), field('Worlds', links(relatedIds('planets', item => item.systemId === entity.id))), field('Economic profile', tags(entity.economicProfile)));
    if (entity.planetCount != null) fields.push(field('Canonical planet count', esc(entity.planetCount)));
    if (entity.homeworldId) fields.push(field('Homeworld', link(entity.homeworldId)));
  }
  if (collection === 'planets') {
    fields.push(
      field('System', link(entity.systemId)),
      field('Parent world', entity.parentPlanetId ? link(entity.parentPlanetId) : '—'),
      field('Authority', link(entity.governingOrganisationId)),
      field('Body kind', link(entity.celestialBodyKindId)),
      field('World type', entity.worldTypeId ? link(entity.worldTypeId) : '—'),
      field('Atmosphere', entity.atmosphereTypeId ? link(entity.atmosphereTypeId) : '—'),
      field('Dominant landforms', links(entity.dominantLandformIds)),
      field('Dominant biomes', links(entity.dominantBiomeIds)),
      field('Dominant water', links(entity.dominantHydrosphereIds)),
      field('Surface assignment', esc(entity.surfaceAssignmentStatus)),
      field('Landscape tileset', entity.landscapeTilesetId ? link(entity.landscapeTilesetId) : '—'),
      field('Environment', esc(entity.environment)),
      field('Population', population(entity.population)),
      field('Settlements', links(relatedIds('settlements', item => item.planetId === entity.id))),
      field('Moons', links(relatedIds('planets', item => item.parentPlanetId === entity.id))),
      field('Economic profile', tags(entity.economicProfile))
    );
  }
  if (collection === 'settlements') {
    fields.push(field('System', link(entity.systemId)), field('World', link(entity.planetId)), field('Authority', link(entity.governingOrganisationId)), field('Population', population(entity.population)), field('Purpose', esc(entity.purpose)), field('Organisations', links(relatedIds('organisations', item => item.headquartersLocationId === entity.id))), field('Facilities', links(relatedIds('facilities', item => item.settlementId === entity.id))), field('People', links(relatedIds('people', item => item.workLocationId === entity.id || item.homeLocationId === entity.id))), field('Ships', links(relatedIds('ships', item => item.homePortLocationId === entity.id))));
  }
  if (collection === 'organisations') {
    fields.push(field('Legal name', esc(entity.legalName)), field('Type', esc(entity.organisationType)), field('Scale', esc(entity.scale)), field('Commercial', entity.commercial ? 'Yes' : 'No'), field('Headquarters', link(entity.headquartersLocationId)), field('Parent organisation', entity.parentOrganisationId ? link(entity.parentOrganisationId) : '—'), field('Industries', tags(entity.industries)), field('Units', links(relatedIds('organisationUnits', item => item.organisationId === entity.id))), field('Facilities', links(relatedIds('facilities', item => item.organisationId === entity.id))), field('Operations', links(relatedIds('operations', item => item.organisationId === entity.id))), field('People', links(relatedIds('people', item => item.organisationId === entity.id))), field('Ships', links(relatedIds('ships', item => item.organisationId === entity.id))));
  }
  if (collection === 'organisationUnits') {
    fields.push(field('Organisation', link(entity.organisationId)), field('Type', esc(entity.unitType)), field('Parent unit', entity.parentUnitId ? link(entity.parentUnitId) : '—'), field('Primary location', link(entity.primaryLocationId)), field('Purpose', esc(entity.purpose)), field('People', links(relatedIds('people', item => item.organisationUnitId === entity.id))));
  }
  if (collection === 'facilities') {
    fields.push(field('Organisation', link(entity.organisationId)), field('Organisation unit', entity.organisationUnitId ? link(entity.organisationUnitId) : '—'), field('System', link(entity.systemId)), field('World', link(entity.planetId)), field('Settlement', entity.settlementId ? link(entity.settlementId) : '—'), field('Type', esc(entity.facilityType)), field('Status', esc(entity.status)), field('Partners', links(entity.partnerOrganisationIds)), field('Operations', links(relatedIds('operations', item => item.facilityId === entity.id))));
  }
  if (collection === 'operations') {
    fields.push(field('Organisation', link(entity.organisationId)), field('Organisation unit', entity.organisationUnitId ? link(entity.organisationUnitId) : '—'), field('Facility', link(entity.facilityId)), field('Type', esc(entity.operationType)), field('Status', esc(entity.status)), field('Managers', links(entity.managerPersonIds)), field('Procurement contacts', links(entity.procurementPersonIds)), field('Ships', links(entity.shipIds)), field('Products', links(entity.productIds)));
  }
  if (collection === 'products') {
    fields.push(field('Type', esc(entity.productType)), field('Producers', links(entity.producerOrganisationIds)), field('Producing operations', links(relatedIds('operations', item => (item.productIds || []).includes(entity.id)))));
  }
  if (collection === 'substances') {
    fields.push(
      field('Archetype', esc(entity.dominantArchetype)),
      field('Substance type', esc(entity.substanceType)),
      field('Thermal behaviour', esc(entity.thermalBehaviour)),
      field('Standard state', esc(entity.standardState)),
      field('Form', esc(entity.form)),
      field('Tier', esc(entity.tier)),
      field('Stock class', entity.refined ? 'Refined' : 'Raw'),
      field('Industrial role', esc(entity.industrialRole)),
      field('Used by parts', links(relatedIds('parts', part => (part.substanceIds || []).includes(entity.id)))),
      field('Building shell uses', links(relatedIds('buildings', building => (building.structuralShellSubstanceIds || []).includes(entity.id)))),
      field('Building fit-out uses', links(relatedIds('buildings', building => (building.fitOutSubstanceIds || []).includes(entity.id)))),
      field('Find sites', links(relatedIds('findSites', site => (site.substanceIds || []).includes(entity.id)))),
      field('Open materials lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'parts') {
    fields.push(
      field('Category', esc(entity.category)),
      field('Sub-category', esc((entity.subCategories || [entity.subCategory]).filter(Boolean).join(', '))),
      field('Sources', tags(entity.sources)),
      field('Substances', links(entity.substanceIds)),
      field('Used in machines', links(entity.machineIds))
    );
  }
  if (collection === 'machines') {
    fields.push(
      field('Category', esc(entity.category)),
      field('Sub-category', esc(entity.subCategory)),
      field('Sources', tags(entity.sources)),
      field('Construction parts', links(entity.partIds)),
      field('Installed in buildings', links(relatedIds('buildings', building => (building.machineIds || []).includes(entity.id)))),
      field('Input', esc(entity.inputSummary)),
      field('Output', esc(entity.outputSummary)),
      field('Fuel type', esc(entity.fuelType))
    );
  }
  if (collection === 'buildings') {
    fields.push(
      field('Category', esc(entity.category)),
      field('Categories', tags(entity.categories)),
      field('Building type', esc(entity.buildingType)),
      field('Sources', tags(entity.sources)),
      field('Structural shell substances', links(entity.structuralShellSubstanceIds)),
      field('Fit-out substances', links(entity.fitOutSubstanceIds)),
      field('Installed machines', links(entity.machineIds))
    );
  }
  if (collection === 'games') {
    fields.push(
      field('Short name', esc(entity.shortName)),
      field('Form', esc(entity.form)),
      field('Play pattern', esc(entity.playPattern)),
      field('Platform', esc(entity.platform)),
      field('Status', esc(entity.status)),
      field('Knowledge scope', esc(entity.knowledgeScope)),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'celestialBodyKinds') {
    fields.push(
      field('Code name', esc(entity.codeName)),
      field('Walkable surface', entity.walkableSurface ? 'Yes' : 'No'),
      field('Ordinary mining', entity.ordinaryMining ? 'Yes' : 'No'),
      field('Radius band', esc(entity.radiusBand)),
      field('World types', links(relatedIds('worldTypes', item => item.appliesToKindId === entity.id))),
      field('Named bodies', links(relatedIds('planets', item => item.celestialBodyKindId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'worldTypes') {
    fields.push(
      field('Design name', esc(entity.designName)),
      field('Game name', esc(entity.gameName)),
      field('Applies to kind', link(entity.appliesToKindId)),
      field('Assignment mode', esc(entity.assignmentMode)),
      field('Named worlds', links(relatedIds('planets', item => item.worldTypeId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'atmosphereTypes') {
    fields.push(
      field('Legal on rocky planets', entity.rockyPlanetLegal === false ? 'No' : 'Yes'),
      field('Named worlds', links(relatedIds('planets', item => item.atmosphereTypeId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'surfaceLandforms') {
    fields.push(
      field('Layer', esc(entity.layer)),
      field('Dominant on worlds', links(relatedIds('planets', item => (item.dominantLandformIds || []).includes(entity.id)))),
      field('Find sites', links(relatedIds('findSites', item => (item.landformIds || []).includes(entity.id)))),
      field('Landscape tiles', links(relatedIds('landscapeTiles', item => item.landformId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'surfaceBiomes') {
    fields.push(
      field('Layer', esc(entity.layer)),
      field('Dominant on worlds', links(relatedIds('planets', item => (item.dominantBiomeIds || []).includes(entity.id)))),
      field('Find sites', links(relatedIds('findSites', item => (item.biomeIds || []).includes(entity.id)))),
      field('Landscape tiles', links(relatedIds('landscapeTiles', item => item.biomeId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'surfaceFeatures') {
    fields.push(
      field('Layer', esc(entity.layer)),
      field('Find sites', links(relatedIds('findSites', item => (item.surfaceFeatureIds || []).includes(entity.id)))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'surfaceHydrospheres') {
    fields.push(
      field('Layer', esc(entity.layer)),
      field('Dominant on worlds', links(relatedIds('planets', item => (item.dominantHydrosphereIds || []).includes(entity.id)))),
      field('Find sites', links(relatedIds('findSites', item => (item.hydrosphereIds || []).includes(entity.id)))),
      field('Landscape tiles', links(relatedIds('landscapeTiles', item => item.hydrosphereId === entity.id))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'geologyProvinces') {
    fields.push(
      field('Find sites', links(relatedIds('findSites', item => (item.geologyProvinceIds || []).includes(entity.id)))),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'findSites') {
    fields.push(
      field('Catalogue tier', esc(entity.catalogTier)),
      field('Depth band', esc(entity.depthBand)),
      field('Landforms', links(entity.landformIds)),
      field('Biomes', links(entity.biomeIds)),
      field('Hydrosphere', links(entity.hydrosphereIds)),
      field('Surface features', links(entity.surfaceFeatureIds)),
      field('Geology provinces', links(entity.geologyProvinceIds)),
      field('Substances', links(entity.substanceIds)),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'landscapeTilesets') {
    fields.push(
      field('World', link(entity.planetId)),
      field('Intended game', entity.intendedGameId ? link(entity.intendedGameId) : '—'),
      field('Coverage complete', entity.coverageComplete ? 'Yes' : 'No'),
      field('Landforms', links(entity.landformIds)),
      field('Biomes', links(entity.biomeIds)),
      field('Water', links(entity.hydrosphereIds)),
      field('Tile count', esc(related('landscapeTiles', item => item.tilesetId === entity.id).length)),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'landscapeTiles') {
    fields.push(
      field('Tileset', link(entity.tilesetId)),
      field('World', link(entity.planetId)),
      field('Landform', entity.landformId ? link(entity.landformId) : '—'),
      field('Biome', entity.biomeId ? link(entity.biomeId) : '—'),
      field('Water', entity.hydrosphereId ? link(entity.hydrosphereId) : '—'),
      field('Variant', esc(entity.variant)),
      field('Adjacency role', esc(entity.adjacencyRole)),
      field('Intended use', esc(entity.intendedUse)),
      field('Open land lore', loreOpenLink(entity.sourceDocumentId, entity.sourceSection))
    );
  }
  if (collection === 'species') {
    if (entity.homeworldId) fields.push(field('Homeworld', link(entity.homeworldId)));
    fields.push(field('Type', esc(entity.speciesType)), field('People', links(relatedIds('people', item => item.speciesId === entity.id))));
  }
  if (collection === 'people') {
    const relationships = related('relationships', item => item.personAId === entity.id || item.personBId === entity.id).map(item => item.id);
    fields.push(field('Species / people category', link(entity.speciesId)), field('Role', esc(entity.role)), field('Organisation', link(entity.organisationId)), field('Organisation unit', entity.organisationUnitId ? link(entity.organisationUnitId) : '—'), field('Works at', link(entity.workLocationId)), field('Home', link(entity.homeLocationId)), field('Commercial authority', entity.commercialAuthority ? 'Yes' : 'No'), field('Responsibilities', tags(entity.responsibilities)), field('Operations', links(entity.operationIds)), field('Ships', links(entity.shipIds)), field('Relationships', links(relationships)));
  }
  if (collection === 'shipClasses') {
    fields.push(field('Manufacturer', link(entity.manufacturerOrganisationId)), field('Designers', links(entity.designerOrganisationIds)), field('Role', esc(entity.role)), field('Capacity class', esc(entity.capacityClass)), field('Named ships', links(relatedIds('ships', item => item.shipClassId === entity.id))));
  }
  if (collection === 'ships') {
    fields.push(field('Organisation', link(entity.organisationId)), field('Ship class', link(entity.shipClassId)), field('Home port', link(entity.homePortLocationId)), field('Role', esc(entity.role)), field('Operations', links(entity.operationIds)), field('People', links(entity.personIds)));
  }
  if (collection === 'projects') {
    fields.push(field('Type', esc(entity.projectType)), field('Status', esc(entity.status)), field('Organisations', links(entity.organisationIds)), field('Locations', links(entity.locationIds)), field('People', links(entity.personIds)), field('Ships', links(entity.shipIds)), field('Operations', links(entity.operationIds)));
  }
  if (collection === 'events') {
    fields.push(field('Date', esc(entity.date)), field('Type', esc(entity.eventType)), field('Linked entities', links(entity.linkedEntityIds)));
  }
  if (collection === 'relationships') {
    fields.push(field('Person A', link(entity.personAId)), field('Person B', link(entity.personBId)), field('Type', esc(entity.relationshipType)), field('Active', entity.active ? 'Yes' : 'No'));
  }
  if (collection === 'currencies') {
    fields.push(field('Symbol', esc(entity.symbol)), field('Type', esc(entity.currencyType)), field('Canonical year', esc(entity.canonicalYear)));
  }
  if (collection === 'loreDocuments') {
    fields.push(field('Document type', esc(entity.documentType)), field('Canon level', esc(entity.canonLevel)), field('Canon status', esc(entity.canonStatus)), field('Precedence', esc(entity.precedence)), field('Baseline year', esc(entity.baselineYear)), field('Knowledge scope', esc(entity.knowledgeScope)), field('Source path', `<code>${esc(entity.contentPath)}</code>`), field('Open source', loreOpenLink(entity.id)));
  }
  if (collection === 'loreTopics') {
    fields.push(field('Type', esc(entity.topicType)), field('Knowledge scope', esc(entity.knowledgeScope)), field('Source', link(entity.sourceDocumentId)), field('Section', esc(entity.sourceSection)), field('Open source', loreOpenLink(entity.sourceDocumentId, entity.sourceSection)));
  }

  if (!['loreDocuments', 'loreTopics'].includes(collection)) fields.push(sourceFields(entity));
  return fields.join('');
}

function resourceSection(entity) {
  if (!entity.resourceRequirements?.length) return '';
  return `<section class="section"><h2>Resource requirements</h2>${entity.resourceRequirements.map(requirement => `
    <div class="resource">
      <div class="resourceTop"><strong>${esc(requirement.displayName || `${requirement.resourceType}:${requirement.resourceId}`)}</strong><div class="resourceMeta">${esc(requirement.importance)} • ${esc(requirement.demandScale)} demand • ${esc(requirement.qualityPreference)} quality</div></div>
      <p>${esc(requirement.reason)}</p>
    </div>`).join('')}</section>`;
}

function imagePrompt(entity) {
  const org = entity.organisationId ? state.catalogue.get(entity.organisationId) : null;
  return [
    'MineIT universe; grounded high-detail industrial science fiction.',
    entity.visualDescription ? `Persistent visual facts: ${entity.visualDescription}` : '',
    org?.visualIdentity ? `Organisation identity: ${JSON.stringify(org.visualIdentity)}.` : '',
    entity.image?.promptDescription || ''
  ].filter(Boolean).join('\n');
}

function imageSection(entity) {
  if (!entity.image) return '';
  const generated = entity.image.generated === true;
  return `<section class="section"><h2>Image generation</h2><div class="fieldRows">${field('Generated', generated ? 'Yes' : 'No')}${field('Status', esc(entity.image.status))}${field('Asset', `<code>${esc(entity.image.key)}</code>`)}${field('Prompt', '<button class="copyButton" id="copyPrompt">Copy image prompt</button>')}</div><div class="longText"><pre class="rawBlock">${esc(imagePrompt(entity))}</pre></div></section>`;
}

function extraSections(entity) {
  let html = '';
  for (const [key, title] of [['biography', 'Biography'], ['personality', 'Personality'], ['history', 'History'], ['culture', 'Culture'], ['reputation', 'Reputation'], ['visualDescription', 'Visual description'], ['summary', 'Summary'], ['scope', 'Scope'], ['sharedLandUse', 'Shared land use'], ['sharedSubstanceUse', 'Shared substance use'], ['scenarioNotes', 'Scenario notes']]) {
    if (entity[key]) html += `<section class="section"><h2>${title}</h2><div class="longText">${esc(entity[key])}</div></section>`;
  }
  if (entity.visualIdentity) html += `<section class="section"><h2>Visual identity</h2><div class="longText"><pre class="rawBlock">${esc(JSON.stringify(entity.visualIdentity, null, 2))}</pre></div></section>`;
  if (entity.styleLock) html += `<section class="section"><h2>Style lock</h2><div class="longText"><pre class="rawBlock">${esc(JSON.stringify(entity.styleLock, null, 2))}</pre></div></section>`;
  return html;
}

function breadcrumbs() {
  const path = findPath(state.currentTree || buildTree(), state.selectedId);
  return path ? path.filter(node => node.id).map(node => link(node.id)).join('<span>›</span>') : '';
}

function validationStatus() {
  const validation = state.validation;
  if (!validation) return '';
  if (validation.errors.length) return `<div class="status error">${validation.errors.length} validation error(s).</div>`;
  return `<div class="status ok">Canonical universe loaded: ${validation.entityCount} entities • schema ${esc(state.catalogue.manifest.schemaVersion)} • content ${esc(state.catalogue.manifest.contentVersion)} • Year ${esc(state.catalogue.manifest.canonicalYear ?? '—')}</div>`;
}

function canonWarning(entity, collection) {
  if (entity.canonStatus === 'retired-pre-lore-placeholder') {
    return '<div class="status warning">Retired pre-lore placeholder retained only for stable references. Do not treat this record as current canon.</div>';
  }
  if (collection === 'people') {
    const species = state.catalogue.get(entity.speciesId);
    if (species?.canonStatus === 'retired-pre-lore-placeholder') {
      return '<div class="status warning">This person belongs to the pre-lore generated sample and still requires heritage/biography reconciliation. The linked legacy species text is not current canon.</div>';
    }
  }
  if (entity.canonStatus === 'generated-expansion') {
    return '<div class="status warning">Generated expansion content: compatible unless a higher-precedence lore source establishes otherwise.</div>';
  }
  if (entity.surfaceAssignmentStatus === 'kind-only') {
    return '<div class="status warning">Surface not yet authored. Only the celestial-body kind is canonical; do not invent a land grid for this body.</div>';
  }
  if (entity.surfaceAssignmentStatus === 'inferred-from-existing-record') {
    return '<div class="status warning">Land labels inferred from the existing Directory record. Not a source-canonical map; games may generate local squares from these dominant labels.</div>';
  }
  return '';
}

function tileCaption(tile) {
  if (tile.hydrosphereId && !tile.landformId) {
    const variant = tile.variant && tile.variant !== 1 ? ` ${String(tile.variant).padStart(2, '0')}` : '';
    return `${state.catalogue.nameFor(tile.hydrosphereId)}${variant}`;
  }
  const parts = [tile.landformId && state.catalogue.nameFor(tile.landformId), tile.biomeId && state.catalogue.nameFor(tile.biomeId)].filter(Boolean);
  if (tile.variant && tile.variant !== 1) parts.push(String(tile.variant).padStart(2, '0'));
  return parts.join(' · ') || tile.name;
}

function landscapeGallerySection(tiles, heading) {
  const ready = tiles.filter(tile => tile.image?.generated && tile.image?.key);
  if (!ready.length) return '';
  const groups = groupRecords(ready, tile => {
    if (tile.biomeId) return state.catalogue.nameFor(tile.biomeId);
    if (tile.hydrosphereId) return state.catalogue.nameFor(tile.hydrosphereId);
    return 'Other';
  });
  return `<section class="section"><h2>${esc(heading)}</h2>${groups.map(([label, items]) => `
    <div class="landscapeGroup"><h3>${esc(label)}</h3>
      <div class="landscapeGallery">${items.map(tile => {
        const previewUrl = state.catalogue.assetUrl(tile.image.key);
        return `<button type="button" class="landscapeTile" data-ref="${esc(tile.id)}"><img src="${esc(previewUrl)}" alt="${esc(tile.name)}"><span>${esc(tileCaption(tile))}</span></button>`;
      }).join('')}</div>
    </div>`).join('')}</section>`;
}

function adjacencyPreviewSection(entity) {
  const ids = entity.adjacencyPreviewIds || [];
  if (ids.length !== 4) return '';
  const tiles = ids.map(id => state.catalogue.get(id)).filter(tile => tile?.image?.generated && tile.image.key);
  if (tiles.length !== 4) return '';
  return `<section class="section"><h2>Adjacent mountain check</h2>
    <p class="landscapeNote">Four mountain tiles from this set placed in a 2×2. They should read as one range, not four isolated peaks.</p>
    <div class="landscapeAdjacency">${tiles.map(tile => {
      const previewUrl = state.catalogue.assetUrl(tile.image.key);
      const originalUrl = state.catalogue.assetUrl(state.catalogue.originalAssetKey(tile.image.key)) || previewUrl;
      return `<button type="button" class="portraitButton" data-original-image="${esc(originalUrl)}" data-preview-image="${esc(previewUrl)}" data-image-name="${esc(tile.name)}" aria-label="${esc(tile.name)}"><img src="${esc(previewUrl)}" alt="${esc(tile.name)}"></button>`;
    }).join('')}</div>
  </section>`;
}

function landscapeSections(collection, entity) {
  if (collection === 'planets') {
    return landscapeGallerySection(state.catalogue.landscapeTilesForPlanet(entity.id), 'Landscape tiles');
  }
  if (collection === 'landscapeTilesets') {
    return `${adjacencyPreviewSection(entity)}${landscapeGallerySection(state.catalogue.landscapeTilesForTileset(entity.id), 'Tiles')}`;
  }
  if (collection === 'surfaceLandforms') {
    return landscapeGallerySection(related('landscapeTiles', tile => tile.landformId === entity.id), 'World tiles using this landform');
  }
  if (collection === 'surfaceBiomes') {
    return landscapeGallerySection(related('landscapeTiles', tile => tile.biomeId === entity.id), 'World tiles using this biome');
  }
  if (collection === 'surfaceHydrospheres') {
    return landscapeGallerySection(related('landscapeTiles', tile => tile.hydrosphereId === entity.id), 'World tiles using this water type');
  }
  return '';
}

function renderDetail() {
  const entity = state.catalogue.get(state.selectedId);
  if (!entity) return;
  const collection = state.catalogue.collectionNameFor(entity.id);
  const icon = ICONS[collection] || '?';
  const previewUrl = entity.image?.generated && entity.image?.key ? state.catalogue.assetUrl(entity.image.key) : null;
  const originalUrl = previewUrl ? (state.catalogue.assetUrl(state.catalogue.originalAssetKey(entity.image.key)) || previewUrl) : null;
  const landscapeArt = collection === 'starSystems';
  const squareArt = collection === 'landscapeTiles';
  const heroClass = landscapeArt ? ' heroLandscape' : squareArt ? ' heroSquare' : '';
  const placeholderClass = landscapeArt ? ' landscape' : squareArt ? ' square' : '';
  const image = previewUrl
    ? `<button type="button" class="portraitButton" data-original-image="${esc(originalUrl)}" data-preview-image="${esc(previewUrl)}" data-image-name="${esc(entity.name)}" aria-label="View original image of ${esc(entity.name)}"><img src="${esc(previewUrl)}" alt="${esc(entity.name)}"></button>`
    : esc(collection === 'people' ? entity.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() : icon);

  detailEl.innerHTML = `${validationStatus()}${canonWarning(entity, collection)}<div class="breadcrumbs">${breadcrumbs()}</div>
    <div class="hero${heroClass}"><div class="placeholder${placeholderClass}">${image}</div><div><div class="eyebrow">${esc(state.catalogue.typeLabelFor(entity.id))}</div><h1>${esc(entity.name)}</h1><div class="subtitle">${esc(subtitle(collection, entity))}</div></div></div>
    <div class="description">${esc(entity.description || '')}</div>
    ${landscapeSections(collection, entity)}
    <section class="section"><h2>Details</h2><div class="fieldRows">${fieldsFor(collection, entity)}</div></section>
    ${resourceSection(entity)}${extraSections(entity)}${imageSection(entity)}
    <section class="section"><h2>Development details</h2><div class="longText"><div class="dev"><span>ID</span><code>${esc(entity.id)}</code><span>Collection</span><code>${esc(collection)}</code><span>Perspective</span><code>${esc(state.activeView)}</code><span>Content version</span><code>${esc(state.catalogue.manifest.contentVersion)}</code></div><pre class="rawBlock">${esc(JSON.stringify(entity, null, 2))}</pre></div></section>`;

  detailEl.querySelectorAll('[data-ref]').forEach(button => button.onclick = () => selectEntity(button.dataset.ref));
  document.getElementById('copyPrompt')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(imagePrompt(entity));
    const button = document.getElementById('copyPrompt');
    button.textContent = 'Copied';
    setTimeout(() => button.textContent = 'Copy image prompt', 1000);
  });
}

function selectEntity(id) {
  if (!state.catalogue.get(id)) return;
  state.selectedId = id;
  revealSelected();
  renderTree();
  renderDetail();
  requestAnimationFrame(() => treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' }));
}

function switchView(view) {
  state.activeView = view;
  document.querySelectorAll('.perspective').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  revealSelected();
  renderTree();
  renderDetail();
  requestAnimationFrame(() => treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' }));
}

function collapseAll() {
  state.openNodes.clear();
  revealSelected();
  renderTree();
}

function expandCurrent() {
  revealSelected();
  renderTree();
  requestAnimationFrame(() => treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' }));
}

function installDivider() {
  let dragging = false;
  const apply = percent => {
    const value = Math.max(25, Math.min(75, percent));
    detailPane.style.flexBasis = `${value}%`;
    sessionStorage.setItem('mineitUniverseSplit', String(value));
  };
  divider.onpointerdown = event => {
    dragging = true;
    divider.classList.add('dragging');
    divider.setPointerCapture(event.pointerId);
  };
  divider.onpointermove = event => {
    if (!dragging) return;
    const rect = workspace.getBoundingClientRect();
    apply(((event.clientY - rect.top) / rect.height) * 100);
  };
  const stop = event => {
    dragging = false;
    divider.classList.remove('dragging');
    try { divider.releasePointerCapture(event.pointerId); } catch { /* already released */ }
  };
  divider.onpointerup = stop;
  divider.onpointercancel = stop;
  const saved = Number(sessionStorage.getItem('mineitUniverseSplit'));
  if (Number.isFinite(saved) && saved >= 25 && saved <= 75) apply(saved);
}

async function start() {
  detailEl.innerHTML = '<div class="status loading">Loading canonical MineIT universe…</div>';
  try {
    const params = new URLSearchParams(location.search);
    const root = params.get('dataRoot') || './data/';
    const { catalogue, validation } = await loadUniverse(root);
    state.catalogue = catalogue;
    state.validation = validation;

    const requestedView = params.get('view');
    if (['geography', 'organisation', 'directory'].includes(requestedView)) {
      state.activeView = requestedView;
      document.querySelectorAll('.perspective').forEach(button => button.classList.toggle('active', button.dataset.view === requestedView));
    }

    const focusCollection = params.get('focus');
    const focusedRecords = focusCollection ? catalogue.collection(focusCollection) : [];
    const requestedId = params.get('id');
    state.selectedId = (requestedId && catalogue.get(requestedId) ? requestedId : null)
      || focusedRecords[0]?.id
      || catalogue.collection('regions')[0]?.id
      || catalogue.allRecords()[0]?.record.id;

    versionEl.textContent = `Universe ${catalogue.manifest.contentVersion} • Y${catalogue.manifest.canonicalYear}`;
    revealSelected();
    renderTree();
    renderDetail();
  } catch (error) {
    detailEl.innerHTML = `<div class="status error"><strong>Universe failed to load.</strong><br>${esc(error.message)}</div>`;
    treeEl.innerHTML = '<div class="searchEmpty">No universe data loaded.</div>';
  }
}

document.querySelectorAll('.perspective').forEach(button => button.onclick = () => switchView(button.dataset.view));
searchEl.oninput = renderTree;
document.getElementById('collapseAll').onclick = collapseAll;
document.getElementById('expandCurrent').onclick = expandCurrent;
installDivider();
bindOriginalImageOpener(detailEl);
start();
