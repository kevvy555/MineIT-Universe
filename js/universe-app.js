import { loadUniverse } from './universe-data.js';

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
  regions: '◎', starSystems: '✦', planets: '●', settlements: '⬡', organisations: 'O',
  organisationUnits: '▦', facilities: '⌂', operations: '⚙', products: '◆', species: 'S',
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
    category('Facilities', nodes(related('facilities', facility => facility.planetId === world.id && !facility.settlementId)))
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

function buildDirectoryTree() {
  return {
    label: 'Directory',
    children: Object.entries(DIRECTORY)
      .map(([name, label]) => category(label, nodes(state.catalogue.collection(name))))
      .filter(Boolean)
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
    settlements: entity.locationType,
    organisations: `${entity.scale || ''} ${entity.organisationType || ''}`.trim(),
    organisationUnits: entity.unitType,
    facilities: `${entity.facilityType || ''} • ${entity.status || ''}`,
    operations: `${entity.operationType || ''} • ${entity.status || ''}`,
    products: entity.productType,
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
    fields.push(field('System', link(entity.systemId)), field('Parent world', entity.parentPlanetId ? link(entity.parentPlanetId) : '—'), field('Authority', link(entity.governingOrganisationId)), field('Environment', esc(entity.environment)), field('Population', population(entity.population)), field('Settlements', links(relatedIds('settlements', item => item.planetId === entity.id))), field('Moons', links(relatedIds('planets', item => item.parentPlanetId === entity.id))), field('Economic profile', tags(entity.economicProfile)));
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
  for (const [key, title] of [['biography', 'Biography'], ['personality', 'Personality'], ['history', 'History'], ['culture', 'Culture'], ['reputation', 'Reputation'], ['visualDescription', 'Visual description'], ['summary', 'Summary'], ['scope', 'Scope']]) {
    if (entity[key]) html += `<section class="section"><h2>${title}</h2><div class="longText">${esc(entity[key])}</div></section>`;
  }
  if (entity.visualIdentity) html += `<section class="section"><h2>Visual identity</h2><div class="longText"><pre class="rawBlock">${esc(JSON.stringify(entity.visualIdentity, null, 2))}</pre></div></section>`;
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
  return '';
}

function renderDetail() {
  const entity = state.catalogue.get(state.selectedId);
  if (!entity) return;
  const collection = state.catalogue.collectionNameFor(entity.id);
  const icon = ICONS[collection] || '?';
  const image = entity.image?.generated && entity.image?.key
    ? `<img src="${esc(state.catalogue.assetUrl(entity.image.key))}" alt="${esc(entity.name)}">`
    : esc(collection === 'people' ? entity.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() : icon);

  detailEl.innerHTML = `${validationStatus()}${canonWarning(entity, collection)}<div class="breadcrumbs">${breadcrumbs()}</div>
    <div class="hero"><div class="placeholder">${image}</div><div><div class="eyebrow">${esc(state.catalogue.typeLabelFor(entity.id))}</div><h1>${esc(entity.name)}</h1><div class="subtitle">${esc(subtitle(collection, entity))}</div></div></div>
    <div class="description">${esc(entity.description || '')}</div>
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
    const root = new URLSearchParams(location.search).get('dataRoot') || './data/';
    const { catalogue, validation } = await loadUniverse(root);
    state.catalogue = catalogue;
    state.validation = validation;
    state.selectedId = catalogue.collection('regions')[0]?.id || catalogue.allRecords()[0]?.record.id;
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
start();
