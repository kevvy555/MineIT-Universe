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

const COLLECTION_DIRECTORY_LABELS = {
  starSystems: 'Systems',
  planets: 'Planets',
  settlements: 'Settlements / Stations',
  companies: 'Companies',
  organisationUnits: 'Organisation Units',
  facilities: 'Facilities',
  operations: 'Operations',
  people: 'People',
  ships: 'Ships'
};

const ICONS = {
  starSystems: '✦', planets: '●', settlements: '⬡', companies: 'C',
  organisationUnits: '▦', facilities: '⌂', operations: '⚙', people: 'P', ships: '▲'
};

const nodeKey = node => node.id || `label:${node.label}`;
const byName = (a, b) => state.catalogue.nameFor(a.id).localeCompare(state.catalogue.nameFor(b.id));
const entityNode = (id, children = []) => ({ id, children: children.filter(Boolean) });
const categoryNode = (label, children = []) => children.filter(Boolean).length ? ({ label, children: children.filter(Boolean) }) : null;
const entityNodes = records => records.map(record => entityNode(record.id)).sort(byName);

function uniqueIds(records) {
  return [...new Set(records.filter(Boolean).map(record => typeof record === 'string' ? record : record.id))];
}

function recordsAtLocation(locationId, collectionName, fields) {
  return state.catalogue.collection(collectionName).filter(record => fields.some(field => record[field] === locationId));
}

function facilityNode(facility) {
  const operations = state.catalogue.collection('operations').filter(operation => operation.facilityId === facility.id);
  const people = recordsAtLocation(facility.id, 'people', ['workLocationId', 'homeLocationId']);
  return entityNode(facility.id, [
    categoryNode('Operations', entityNodes(operations)),
    categoryNode('People', entityNodes(people))
  ]);
}

function settlementNode(settlement) {
  const companies = state.catalogue.collection('companies').filter(company => company.headquartersLocationId === settlement.id);
  const facilities = state.catalogue.collection('facilities').filter(facility => facility.settlementId === settlement.id);
  const people = recordsAtLocation(settlement.id, 'people', ['workLocationId', 'homeLocationId']);
  const ships = state.catalogue.collection('ships').filter(ship => ship.homePortLocationId === settlement.id);
  return entityNode(settlement.id, [
    categoryNode('Companies', entityNodes(companies)),
    categoryNode('Facilities', facilities.map(facilityNode).sort(byName)),
    categoryNode('People', entityNodes(people)),
    categoryNode('Ships', entityNodes(ships))
  ]);
}

function planetNode(planet) {
  const settlements = state.catalogue.collection('settlements').filter(settlement => settlement.planetId === planet.id);
  const surfaceFacilities = state.catalogue.collection('facilities').filter(facility => facility.planetId === planet.id && !facility.settlementId);
  return entityNode(planet.id, [
    ...settlements.map(settlementNode).sort(byName),
    categoryNode('Surface Facilities', surfaceFacilities.map(facilityNode).sort(byName))
  ]);
}

function buildGeographyTree() {
  const systems = state.catalogue.collection('starSystems').map(system => {
    const planets = state.catalogue.collection('planets').filter(planet => planet.systemId === system.id);
    return entityNode(system.id, planets.map(planetNode).sort(byName));
  });
  return { label: state.catalogue.manifest.name || 'MineIT Universe', children: systems.sort(byName) };
}

function organisationUnitNode(unit) {
  const childUnits = state.catalogue.collection('organisationUnits').filter(child => child.parentUnitId === unit.id);
  const people = state.catalogue.collection('people').filter(person => person.organisationUnitId === unit.id);
  const facilities = state.catalogue.collection('facilities').filter(facility => facility.organisationUnitId === unit.id);
  const operations = state.catalogue.collection('operations').filter(operation => operation.organisationUnitId === unit.id);
  return entityNode(unit.id, [
    ...childUnits.map(organisationUnitNode).sort(byName),
    categoryNode('People', entityNodes(people)),
    categoryNode('Facilities', entityNodes(facilities)),
    categoryNode('Operations', entityNodes(operations))
  ]);
}

function buildOrganisationTree() {
  const companies = state.catalogue.collection('companies').map(company => {
    const rootUnits = state.catalogue.collection('organisationUnits').filter(unit => unit.companyId === company.id && !unit.parentUnitId);
    const directPeople = state.catalogue.collection('people').filter(person => person.companyId === company.id && !person.organisationUnitId);
    const ships = state.catalogue.collection('ships').filter(ship => ship.companyId === company.id);
    return entityNode(company.id, [
      ...rootUnits.map(organisationUnitNode).sort(byName),
      categoryNode('People', entityNodes(directPeople)),
      categoryNode('Ships', entityNodes(ships))
    ]);
  });
  return { label: 'Companies', children: companies.sort(byName) };
}

function buildDirectoryTree() {
  return {
    label: 'Directory',
    children: Object.keys(COLLECTION_DIRECTORY_LABELS).map(collectionName =>
      categoryNode(COLLECTION_DIRECTORY_LABELS[collectionName], entityNodes(state.catalogue.collection(collectionName)))
    ).filter(Boolean)
  };
}

function buildTree() {
  if (state.activeView === 'organisation') return buildOrganisationTree();
  if (state.activeView === 'directory') return buildDirectoryTree();
  return buildGeographyTree();
}

function findPath(node, targetId, path = []) {
  const next = [...path, node];
  if (node.id === targetId) return next;
  for (const child of node.children || []) {
    const found = findPath(child, targetId, next);
    if (found) return found;
  }
  return null;
}

function revealSelected() {
  state.currentTree = buildTree();
  const path = findPath(state.currentTree, state.selectedId);
  if (path) path.slice(0, -1).forEach(node => state.openNodes.add(nodeKey(node)));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderNode(node) {
  const key = nodeKey(node);
  const children = node.children || [];
  const hasChildren = children.length > 0;
  const isOpen = state.openNodes.has(key);
  const entity = node.id ? state.catalogue.get(node.id) : null;
  const li = document.createElement('li');
  const row = document.createElement('div');
  row.className = `treeRow${node.id === state.selectedId ? ' selected' : ''}`;
  if (node.id === state.selectedId) row.dataset.selected = 'true';

  const twist = document.createElement('button');
  twist.className = `twisty${hasChildren ? '' : ' empty'}`;
  twist.textContent = hasChildren ? (isOpen ? '▾' : '▸') : '';
  twist.addEventListener('click', event => {
    event.stopPropagation();
    if (!hasChildren) return;
    isOpen ? state.openNodes.delete(key) : state.openNodes.add(key);
    renderTree();
  });

  const button = document.createElement('button');
  button.className = `node${node.id ? '' : ' categoryNode'}`;
  const label = entity?.name || node.label || node.id;
  const kind = entity ? state.catalogue.typeLabelFor(node.id) : '';
  button.innerHTML = `${escapeHtml(label)}${kind ? ` <span class="kind">${escapeHtml(kind)}</span>` : ''}`;
  button.addEventListener('click', () => {
    if (node.id) selectEntity(node.id);
    else if (hasChildren) {
      isOpen ? state.openNodes.delete(key) : state.openNodes.add(key);
      renderTree();
    }
  });

  row.append(twist, button);
  li.append(row);
  if (hasChildren && isOpen) {
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
      const haystack = [record.name, record.role, record.description, record.purpose, record.legalName, collectionName].filter(Boolean).join(' ').toLowerCase();
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

function entityLink(id, label) {
  if (!id) return '—';
  const entity = state.catalogue.get(id);
  if (!entity) return `<span class="status error">Broken reference: ${escapeHtml(id)}</span>`;
  return `<button class="entityLink" data-ref="${escapeHtml(id)}">${escapeHtml(label || entity.name)}</button>`;
}

function multiLinks(ids) {
  const values = (ids || []).filter(Boolean);
  if (!values.length) return '—';
  return `<div class="multiLinks">${values.map(id => entityLink(id)).join('')}</div>`;
}

function tags(values) {
  if (!values?.length) return '—';
  return `<div class="tagList">${values.map(value => `<span class="tag">${escapeHtml(value)}</span>`).join('')}</div>`;
}

function field(label, value) {
  return `<div class="field"><div class="fieldLabel">${escapeHtml(label)}</div><div class="fieldValue">${value ?? '—'}</div></div>`;
}

function formatPopulation(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat('en-GB').format(value) : '—';
}

function relatedIds(collectionName, predicate) {
  return state.catalogue.collection(collectionName).filter(predicate).map(record => record.id);
}

function typeSubtitle(collectionName, entity) {
  if (collectionName === 'people') return entity.role;
  if (collectionName === 'companies') return `${entity.scale} ${entity.organisationType}`;
  if (collectionName === 'operations') return `${entity.operationType} • ${entity.status}`;
  if (collectionName === 'facilities') return `${entity.facilityType} • ${entity.status}`;
  if (collectionName === 'organisationUnits') return entity.unitType;
  if (collectionName === 'planets') return entity.worldType;
  if (collectionName === 'settlements') return entity.locationType;
  if (collectionName === 'ships') return entity.role;
  if (collectionName === 'starSystems') return entity.starType;
  return '';
}

function detailFields(collectionName, entity) {
  const fields = [];
  if (collectionName === 'starSystems') {
    fields.push(field('Region', escapeHtml(entity.region)), field('Star type', escapeHtml(entity.starType)));
    fields.push(field('Coordinates', escapeHtml(`${entity.coordinates?.x}, ${entity.coordinates?.y}, ${entity.coordinates?.z}`)));
    fields.push(field('Planets', multiLinks(relatedIds('planets', planet => planet.systemId === entity.id))));
    fields.push(field('Settlements', multiLinks(relatedIds('settlements', settlement => settlement.systemId === entity.id))));
    fields.push(field('Economic profile', tags(entity.economicProfile)));
  } else if (collectionName === 'planets') {
    fields.push(field('System', entityLink(entity.systemId)), field('World type', escapeHtml(entity.worldType)), field('Environment', escapeHtml(entity.environment)), field('Population', formatPopulation(entity.population)));
    fields.push(field('Settlements', multiLinks(relatedIds('settlements', settlement => settlement.planetId === entity.id))));
    fields.push(field('Facilities', multiLinks(relatedIds('facilities', facility => facility.planetId === entity.id))));
    const companyIds = uniqueIds(state.catalogue.collection('facilities').filter(facility => facility.planetId === entity.id).map(facility => facility.companyId));
    fields.push(field('Operators', multiLinks(companyIds)), field('Economic profile', tags(entity.economicProfile)));
  } else if (collectionName === 'settlements') {
    fields.push(field('System', entityLink(entity.systemId)), field('Planet', entityLink(entity.planetId)), field('Location type', escapeHtml(entity.locationType)), field('Population', formatPopulation(entity.population)), field('Purpose', escapeHtml(entity.purpose)));
    fields.push(field('Companies', multiLinks(relatedIds('companies', company => company.headquartersLocationId === entity.id))));
    fields.push(field('Facilities', multiLinks(relatedIds('facilities', facility => facility.settlementId === entity.id))));
    fields.push(field('People', multiLinks(relatedIds('people', person => person.workLocationId === entity.id || person.homeLocationId === entity.id))));
    fields.push(field('Home-ported ships', multiLinks(relatedIds('ships', ship => ship.homePortLocationId === entity.id))));
  } else if (collectionName === 'companies') {
    fields.push(field('Legal name', escapeHtml(entity.legalName)), field('Organisation type', escapeHtml(entity.organisationType)), field('Scale', escapeHtml(entity.scale)), field('Headquarters', entityLink(entity.headquartersLocationId)), field('Industries', tags(entity.industries)));
    fields.push(field('Organisation units', multiLinks(relatedIds('organisationUnits', unit => unit.companyId === entity.id))));
    fields.push(field('Facilities', multiLinks(relatedIds('facilities', facility => facility.companyId === entity.id))));
    fields.push(field('Operations', multiLinks(relatedIds('operations', operation => operation.companyId === entity.id))));
    fields.push(field('People', multiLinks(relatedIds('people', person => person.companyId === entity.id))));
    fields.push(field('Ships', multiLinks(relatedIds('ships', ship => ship.companyId === entity.id))));
  } else if (collectionName === 'organisationUnits') {
    fields.push(field('Company', entityLink(entity.companyId)), field('Unit type', escapeHtml(entity.unitType)), field('Parent unit', entity.parentUnitId ? entityLink(entity.parentUnitId) : '—'), field('Primary location', entityLink(entity.primaryLocationId)), field('Purpose', escapeHtml(entity.purpose)));
    fields.push(field('Child units', multiLinks(relatedIds('organisationUnits', unit => unit.parentUnitId === entity.id))));
    fields.push(field('People', multiLinks(relatedIds('people', person => person.organisationUnitId === entity.id))));
    fields.push(field('Facilities', multiLinks(relatedIds('facilities', facility => facility.organisationUnitId === entity.id))));
    fields.push(field('Operations', multiLinks(relatedIds('operations', operation => operation.organisationUnitId === entity.id))));
  } else if (collectionName === 'facilities') {
    fields.push(field('Owner', entityLink(entity.companyId)), field('Organisation unit', entityLink(entity.organisationUnitId)), field('System', entityLink(entity.systemId)), field('Planet', entityLink(entity.planetId)), field('Settlement', entity.settlementId ? entityLink(entity.settlementId) : '—'));
    fields.push(field('Facility type', escapeHtml(entity.facilityType)), field('Status', escapeHtml(entity.status)));
    fields.push(field('Operations', multiLinks(relatedIds('operations', operation => operation.facilityId === entity.id))));
    fields.push(field('People working here', multiLinks(relatedIds('people', person => person.workLocationId === entity.id))));
  } else if (collectionName === 'operations') {
    fields.push(field('Company', entityLink(entity.companyId)), field('Organisation unit', entityLink(entity.organisationUnitId)), field('Facility', entityLink(entity.facilityId)), field('Operation type', escapeHtml(entity.operationType)), field('Status', escapeHtml(entity.status)));
    fields.push(field('Managers', multiLinks(entity.managerPersonIds)), field('Procurement contacts', multiLinks(entity.procurementPersonIds)), field('Ships', multiLinks(entity.shipIds)));
  } else if (collectionName === 'people') {
    fields.push(field('Role', escapeHtml(entity.role)), field('Company', entityLink(entity.companyId)), field('Organisation unit', entityLink(entity.organisationUnitId)), field('Works at', entityLink(entity.workLocationId)), field('Home location', entityLink(entity.homeLocationId)));
    fields.push(field('Operations', multiLinks(entity.operationIds)), field('Ships', multiLinks(entity.shipIds)), field('Commercial authority', entity.commercialAuthority ? 'Yes' : 'No'), field('Responsibilities', tags(entity.responsibilities)));
  } else if (collectionName === 'ships') {
    fields.push(field('Owner', entityLink(entity.companyId)), field('Ship class', escapeHtml(entity.shipClassId)), field('Home port', entityLink(entity.homePortLocationId)), field('Role', escapeHtml(entity.role)), field('Operations', multiLinks(entity.operationIds)), field('Associated people', multiLinks(entity.personIds)));
  }
  return fields.join('');
}

function imagePrompt(entity) {
  const company = entity.companyId ? state.catalogue.get(entity.companyId) : (state.catalogue.collectionNameFor(entity.id) === 'companies' ? entity : null);
  const identity = company?.visualIdentity ? `Company visual identity: ${JSON.stringify(company.visualIdentity)}.` : '';
  return [
    'MineIT universe: grounded high-detail industrial science-fiction, believable materials and workplaces.',
    entity.visualDescription ? `Persistent visual facts: ${entity.visualDescription}` : '',
    identity,
    entity.image?.promptDescription ? `Entity composition: ${entity.image.promptDescription}` : ''
  ].filter(Boolean).join('\n');
}

function extraSections(collectionName, entity) {
  let html = '';
  if (collectionName === 'operations' && entity.resourceRequirements?.length) {
    html += `<section class="section"><h2>Resource requirements</h2>${entity.resourceRequirements.map(requirement => `
      <div class="resource"><div class="resourceTop"><strong>${escapeHtml(requirement.displayName || `${requirement.resourceType}:${requirement.resourceId}`)}</strong><div class="resourceMeta">${escapeHtml(requirement.importance)} • ${escapeHtml(requirement.demandScale)} demand • ${escapeHtml(requirement.qualityPreference)} quality</div></div><p>${escapeHtml(requirement.reason)}</p></div>`).join('')}</section>`;
  }
  const longFields = [
    ['history', 'History'], ['culture', 'Culture'], ['reputation', 'Reputation'], ['purpose', 'Purpose'],
    ['biography', 'Biography'], ['personality', 'Personality'], ['visualDescription', 'Visual description']
  ];
  for (const [key, title] of longFields) {
    if (entity[key]) html += `<section class="section"><h2>${title}</h2><div class="longText">${escapeHtml(entity[key])}</div></section>`;
  }
  if (entity.visualIdentity) {
    html += `<section class="section"><h2>Visual identity</h2><div class="longText"><pre class="rawBlock">${escapeHtml(JSON.stringify(entity.visualIdentity, null, 2))}</pre></div></section>`;
  }
  if (entity.image) {
    const prompt = imagePrompt(entity);
    html += `<section class="section"><h2>Image generation</h2><div class="fieldRows">
      ${field('Asset', `<code>${escapeHtml(entity.image.key)}</code>`)}
      ${field('Status', escapeHtml(entity.image.status || 'unknown'))}
      ${field('Prompt', `<button class="copyButton" id="copyPrompt">Copy image prompt</button>`)}
      </div><div class="longText"><pre class="rawBlock">${escapeHtml(prompt)}</pre></div></section>`;
  }
  return html;
}

function breadcrumbs() {
  const tree = state.currentTree || buildTree();
  const path = findPath(tree, state.selectedId);
  if (!path) return '';
  return path.filter(node => node.id).map(node => entityLink(node.id)).join('<span>›</span>');
}

function validationStatus() {
  if (!state.validation) return '';
  if (state.validation.errors.length) return `<div class="status error">${state.validation.errors.length} validation error(s). Open Development details below.</div>`;
  if (state.validation.warnings.length) return `<div class="status warning">Universe loaded with ${state.validation.warnings.length} warning(s).</div>`;
  return `<div class="status ok">Canonical universe loaded: ${state.validation.entityCount} entities • schema ${escapeHtml(state.catalogue.manifest.schemaVersion)} • content ${escapeHtml(state.catalogue.manifest.contentVersion)}</div>`;
}

function renderDetail() {
  const entity = state.catalogue.get(state.selectedId);
  if (!entity) return;
  const collectionName = state.catalogue.collectionNameFor(entity.id);
  const icon = ICONS[collectionName] || '?';
  const imageMarkup = entity.image?.status !== 'missing' && entity.image?.key
    ? `<img src="${escapeHtml(entity.image.key)}" alt="${escapeHtml(entity.name)}">`
    : escapeHtml(icon === 'P' ? entity.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() : icon);

  detailEl.innerHTML = `
    ${validationStatus()}
    <div class="breadcrumbs">${breadcrumbs()}</div>
    <div class="hero"><div class="placeholder">${imageMarkup}</div><div><div class="eyebrow">${escapeHtml(state.catalogue.typeLabelFor(entity.id))}</div><h1>${escapeHtml(entity.name)}</h1><div class="subtitle">${escapeHtml(typeSubtitle(collectionName, entity))}</div></div></div>
    <div class="description">${escapeHtml(entity.description || '')}</div>
    <section class="section"><h2>Details</h2><div class="fieldRows">${detailFields(collectionName, entity)}</div></section>
    ${extraSections(collectionName, entity)}
    <section class="section"><h2>Development details</h2><div class="longText"><div class="dev"><span>ID</span><code>${escapeHtml(entity.id)}</code><span>Collection</span><code>${escapeHtml(collectionName)}</code><span>Perspective</span><code>${escapeHtml(state.activeView)}</code><span>Content version</span><code>${escapeHtml(state.catalogue.manifest.contentVersion)}</code></div></div>
      <div class="longText"><pre class="rawBlock">${escapeHtml(JSON.stringify(entity, null, 2))}</pre></div>
      ${state.validation.errors.length ? `<div class="longText"><pre class="rawBlock">${escapeHtml(state.validation.errors.join('\n'))}</pre></div>` : ''}
    </section>`;

  detailEl.querySelectorAll('[data-ref]').forEach(button => button.addEventListener('click', () => selectEntity(button.dataset.ref)));
  document.getElementById('copyPrompt')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(imagePrompt(entity));
    const button = document.getElementById('copyPrompt');
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy image prompt'; }, 1000);
  });
}

function selectEntity(id) {
  if (!state.catalogue.get(id)) return;
  state.selectedId = id;
  revealSelected();
  renderDetail();
  renderTree();
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
  const applySplit = percent => {
    const value = Math.max(25, Math.min(75, percent));
    detailPane.style.flexBasis = `${value}%`;
    sessionStorage.setItem('mineitUniverseSplit', String(value));
  };
  divider.addEventListener('pointerdown', event => {
    dragging = true;
    divider.classList.add('dragging');
    divider.setPointerCapture(event.pointerId);
  });
  divider.addEventListener('pointermove', event => {
    if (!dragging) return;
    const rect = workspace.getBoundingClientRect();
    applySplit(((event.clientY - rect.top) / rect.height) * 100);
  });
  const stop = event => {
    dragging = false;
    divider.classList.remove('dragging');
    try { divider.releasePointerCapture(event.pointerId); } catch { /* no-op */ }
  };
  divider.addEventListener('pointerup', stop);
  divider.addEventListener('pointercancel', stop);
  const saved = Number(sessionStorage.getItem('mineitUniverseSplit'));
  if (Number.isFinite(saved) && saved >= 25 && saved <= 75) applySplit(saved);
}

async function start() {
  detailEl.innerHTML = '<div class="status loading">Loading canonical MineIT universe…</div>';
  try {
    const dataRoot = new URLSearchParams(window.location.search).get('dataRoot') || './data/';
    const { catalogue, validation } = await loadUniverse(dataRoot);
    state.catalogue = catalogue;
    state.validation = validation;
    state.selectedId = catalogue.collection('companies')[0]?.id || catalogue.collection('starSystems')[0]?.id || catalogue.allRecords()[0]?.record.id;
    versionEl.textContent = `Universe ${catalogue.manifest.contentVersion}`;
    revealSelected();
    renderTree();
    renderDetail();
  } catch (error) {
    detailEl.innerHTML = `<div class="status error"><strong>Universe failed to load.</strong><br>${escapeHtml(error.message)}<br><br>This Directory must be served over HTTP/HTTPS; opening it directly with file:// cannot load the JSON collections.</div>`;
    treeEl.innerHTML = '<div class="searchEmpty">No universe data loaded.</div>';
  }
}

document.querySelectorAll('.perspective').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
searchEl.addEventListener('input', renderTree);
document.getElementById('collapseAll').addEventListener('click', collapseAll);
document.getElementById('expandCurrent').addEventListener('click', expandCurrent);
installDivider();
start();
