import { loadUniverse } from './universe-data.js';

const TILE_PX = 512;
const TILE_OVERLAP = 1;
const MIN_SCALE = 0.045;
const MAX_SCALE = 3.2;

const state = {
  catalogue: null,
  atlas: null,
  tiles: [],
  readyTiles: [],
  bounds: null,
  scale: 1,
  tx: 0,
  ty: 0,
  fitScale: 1,
  selectedId: null,
  pointers: new Map(),
  pinch: null,
  suppressClickUntil: 0,
  autoFit: true,
  loadedImages: 0,
  failedImages: 0
};

const viewport = document.getElementById('atlasViewport');
const stage = document.getElementById('atlasStage');
const grid = document.getElementById('atlasGrid');
const info = document.getElementById('atlasInfo');
const atlasSelect = document.getElementById('atlasSelect');
const versionEl = document.getElementById('atlasVersion');
const titleEl = document.getElementById('atlasTitle');
const eyebrowEl = document.getElementById('atlasEyebrow');
const summaryEl = document.getElementById('atlasSummary');
const scaleEl = document.getElementById('atlasScale');
const loadEl = document.getElementById('atlasLoad');
const labelsEl = document.getElementById('showLabels');

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function boundsFor(tiles) {
  return {
    minX: Math.min(...tiles.map(tile => tile.x)),
    maxX: Math.max(...tiles.map(tile => tile.x)),
    minY: Math.min(...tiles.map(tile => tile.y)),
    maxY: Math.max(...tiles.map(tile => tile.y))
  };
}

function tilePosition(tile) {
  return {
    left: (tile.x - state.bounds.minX) * TILE_PX,
    top: (state.bounds.maxY - tile.y) * TILE_PX
  };
}

function stageSize() {
  if (!state.bounds) return { width: 0, height: 0 };
  return {
    width: (state.bounds.maxX - state.bounds.minX + 1) * TILE_PX,
    height: (state.bounds.maxY - state.bounds.minY + 1) * TILE_PX
  };
}

function updateTransform() {
  stage.style.transform = `translate(${state.tx}px,${state.ty}px) scale(${state.scale})`;
  const km = state.atlas?.tileSizeKm || 1;
  scaleEl.innerHTML = `1 tile = ${esc(km)} km × ${esc(km)} km • <span class="atlasZoomReadout">${Math.round(state.scale * 100)}%</span>`;
  grid.classList.toggle('showLabels', labelsEl.checked && state.scale >= 0.22);
}

function fitMap() {
  if (!state.readyTiles.length) return;
  const rect = viewport.getBoundingClientRect();
  const size = stageSize();
  const padding = 24;
  const sx = Math.max(1, rect.width - padding * 2) / size.width;
  const sy = Math.max(1, rect.height - padding * 2) / size.height;
  state.scale = clamp(Math.min(sx, sy), MIN_SCALE, MAX_SCALE);
  state.fitScale = state.scale;
  state.tx = (rect.width - size.width * state.scale) / 2;
  state.ty = (rect.height - size.height * state.scale) / 2;
  state.autoFit = true;
  updateTransform();
}

function zoomAt(clientX, clientY, factor) {
  const rect = viewport.getBoundingClientRect();
  const vx = clientX - rect.left;
  const vy = clientY - rect.top;
  const worldX = (vx - state.tx) / state.scale;
  const worldY = (vy - state.ty) / state.scale;
  const next = clamp(state.scale * factor, MIN_SCALE, MAX_SCALE);
  if (next === state.scale) return;
  state.scale = next;
  state.tx = vx - worldX * next;
  state.ty = vy - worldY * next;
  state.autoFit = false;
  updateTransform();
}

function zoomCentre(factor) {
  const rect = viewport.getBoundingClientRect();
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
}

function centreOnTile(tile, preferredScale) {
  if (!tile || !state.bounds) return;
  const rect = viewport.getBoundingClientRect();
  const pos = tilePosition(tile);
  const targetScale = clamp(preferredScale ?? Math.max(state.fitScale * 2.4, 0.42), MIN_SCALE, MAX_SCALE);
  state.scale = targetScale;
  state.tx = rect.width / 2 - (pos.left + TILE_PX / 2) * targetScale;
  state.ty = rect.height / 2 - (pos.top + TILE_PX / 2) * targetScale;
  state.autoFit = false;
  updateTransform();
}

function homeMap() {
  const origin = state.readyTiles.find(tile => tile.x === 0 && tile.y === 0) || state.readyTiles[0];
  centreOnTile(origin, Math.max(state.fitScale * 2.2, 0.38));
}

function updateLoadStatus() {
  const total = state.readyTiles.length;
  const done = state.loadedImages + state.failedImages;
  if (!total || done >= total) {
    loadEl.classList.remove('visible');
    return;
  }
  loadEl.textContent = `Loading map ${done}/${total}…`;
  loadEl.classList.add('visible');
}

function summaryFor(atlas, count) {
  const planet = state.catalogue.get(atlas.planetId);
  const origin = state.catalogue.get(atlas.originSettlementId);
  return `${planet?.name || atlas.planetId} • ${origin?.name || atlas.coordinateSystem?.origin || 'Surface atlas'} • ${count} generated km² mapped`;
}

function setQuery(atlasId, tileId = null) {
  const url = new URL(location.href);
  url.searchParams.set('atlas', atlasId);
  if (tileId) url.searchParams.set('tile', tileId);
  else url.searchParams.delete('tile');
  history.replaceState(null, '', url);
}

function renderTileInfo(tile) {
  state.selectedId = tile.id;
  grid.querySelectorAll('.atlasTile.selected').forEach(el => el.classList.remove('selected'));
  grid.querySelector(`[data-tile-id="${CSS.escape(tile.id)}"]`)?.classList.add('selected');
  info.classList.add('hasSelection');

  const imageUrl = state.catalogue.assetUrl(tile.image.key);
  info.innerHTML = `
    <div class="atlasInfoHeader">
      <div>
        <div class="atlasInfoKicker">ATLAS TILE ${esc(tile.sequence)}</div>
        <h2>${esc(tile.districtName || tile.name)}</h2>
      </div>
      <span class="atlasCoord">(${esc(tile.x)}, ${esc(tile.y)})</span>
    </div>
    <p class="atlasTileDescription">${esc(tile.description || '')}</p>
    <div class="atlasFields">
      <div class="atlasField"><span>Coordinate</span><span>${esc(tile.x)}, ${esc(tile.y)}</span></div>
      <div class="atlasField"><span>Area</span><span>${esc(tile.mappedAreaKm2 || 1)} km²</span></div>
      <div class="atlasField"><span>Ring</span><span>${esc(tile.ring)}</span></div>
      <div class="atlasField"><span>Batch</span><span>${esc(tile.batch)}</span></div>
      <div class="atlasField"><span>Zone</span><span>${esc(tile.zone || '—')}</span></div>
      <div class="atlasField"><span>Sector</span><span>${esc(tile.sector || '—')}</span></div>
      <div class="atlasField"><span>Image state</span><span>${esc(tile.image.status)}</span></div>
    </div>
    <div class="atlasActions">
      <button type="button" id="focusTile">Centre tile</button>
      <a href="${esc(imageUrl)}" target="_blank" rel="noopener">Open image</a>
      <a href="./index.html?id=${encodeURIComponent(tile.planetId)}">Koplin 3 details</a>
    </div>`;

  document.getElementById('focusTile')?.addEventListener('click', () => centreOnTile(tile));
  setQuery(state.atlas.id, tile.id);
}

function renderMap() {
  grid.innerHTML = '';
  state.loadedImages = 0;
  state.failedImages = 0;

  if (!state.readyTiles.length) {
    grid.innerHTML = '<div class="status warning">This atlas has no generated images yet.</div>';
    return;
  }

  state.bounds = boundsFor(state.readyTiles);
  const size = stageSize();
  stage.style.width = `${size.width}px`;
  stage.style.height = `${size.height}px`;
  grid.style.width = `${size.width}px`;
  grid.style.height = `${size.height}px`;

  for (const tile of state.readyTiles) {
    const pos = tilePosition(tile);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `atlasTile${tile.x === 0 && tile.y === 0 ? ' origin' : ''}`;
    button.dataset.tileId = tile.id;
    button.style.left = `${pos.left}px`;
    button.style.top = `${pos.top}px`;
    button.style.width = `${TILE_PX + TILE_OVERLAP}px`;
    button.style.height = `${TILE_PX + TILE_OVERLAP}px`;
    button.setAttribute('aria-label', `${tile.districtName || tile.name}, coordinate ${tile.x}, ${tile.y}`);

    const img = document.createElement('img');
    img.src = state.catalogue.assetUrl(tile.image.key);
    img.alt = '';
    img.draggable = false;
    img.loading = 'eager';
    img.decoding = 'async';
    img.onload = () => { state.loadedImages += 1; updateLoadStatus(); };
    img.onerror = () => { state.failedImages += 1; button.classList.add('missing'); updateLoadStatus(); };

    const label = document.createElement('span');
    label.className = 'atlasTileLabel';
    label.innerHTML = `<strong>(${esc(tile.x)}, ${esc(tile.y)})</strong><span>${esc(tile.districtName || tile.name)}</span>`;

    button.append(img, label);
    button.addEventListener('click', () => {
      if (Date.now() < state.suppressClickUntil) return;
      renderTileInfo(tile);
    });
    grid.append(button);
  }

  updateLoadStatus();
  requestAnimationFrame(() => {
    fitMap();
    const requestedTile = new URLSearchParams(location.search).get('tile');
    const tile = requestedTile && state.readyTiles.find(item => item.id === requestedTile);
    if (tile) {
      renderTileInfo(tile);
      centreOnTile(tile);
    }
  });
}

function selectAtlas(id) {
  const atlas = state.catalogue.get(id);
  if (!atlas || state.catalogue.collectionNameFor(id) !== 'worldAtlases') return;
  state.atlas = atlas;
  state.tiles = state.catalogue.collection('worldAtlasTiles').filter(tile => tile.atlasId === atlas.id).sort((a, b) => a.sequence - b.sequence);
  state.readyTiles = state.tiles.filter(tile => tile.image?.generated === true && tile.image?.key);

  titleEl.textContent = atlas.name;
  eyebrowEl.textContent = `${atlas.canonStatus || 'CANONICAL'} • ${atlas.tileSizeKm || 1} KM TILES`.toUpperCase();
  summaryEl.textContent = summaryFor(atlas, state.readyTiles.length);
  atlasSelect.value = atlas.id;
  setQuery(atlas.id);
  renderMap();
}

function installGestures() {
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.0015));
  }, { passive: false });

  viewport.addEventListener('dblclick', event => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, 1.6);
  });

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    viewport.setPointerCapture(event.pointerId);
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    state.pinch = null;
    viewport.classList.add('dragging');
  });

  viewport.addEventListener('pointermove', event => {
    if (!state.pointers.has(event.pointerId)) return;
    const previous = state.pointers.get(event.pointerId);
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.pointers.size >= 2) {
      const points = [...state.pointers.values()].slice(0, 2);
      const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      if (state.pinch) {
        const factor = distance / Math.max(1, state.pinch.distance);
        zoomAt(midpoint.x, midpoint.y, factor);
        state.tx += midpoint.x - state.pinch.midpoint.x;
        state.ty += midpoint.y - state.pinch.midpoint.y;
        updateTransform();
      }
      state.pinch = { distance, midpoint };
      state.suppressClickUntil = Date.now() + 250;
      return;
    }

    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    if (Math.abs(dx) + Math.abs(dy) > 1) {
      state.tx += dx;
      state.ty += dy;
      state.autoFit = false;
      state.suppressClickUntil = Date.now() + 180;
      updateTransform();
    }
  });

  const endPointer = event => {
    state.pointers.delete(event.pointerId);
    state.pinch = null;
    if (!state.pointers.size) viewport.classList.remove('dragging');
    try { viewport.releasePointerCapture(event.pointerId); } catch { /* already released */ }
  };
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
}

async function start() {
  try {
    const params = new URLSearchParams(location.search);
    const root = params.get('dataRoot') || './data/';
    const { catalogue, validation } = await loadUniverse(root);
    state.catalogue = catalogue;

    const atlases = catalogue.collection('worldAtlases');
    if (!atlases.length) throw new Error('No world atlases are declared by the canonical manifest.');

    atlasSelect.innerHTML = atlases.map(atlas => `<option value="${esc(atlas.id)}">${esc(atlas.name)}</option>`).join('');
    atlasSelect.hidden = atlases.length < 2;
    versionEl.textContent = `Universe ${catalogue.manifest.contentVersion} • Y${catalogue.manifest.canonicalYear}`;

    if (validation.errors.length) {
      loadEl.textContent = `${validation.errors.length} universe validation error(s)`;
      loadEl.classList.add('visible');
    }

    const requested = params.get('atlas');
    const initial = atlases.find(atlas => atlas.id === requested) || atlases.find(atlas => atlas.status === 'active-authoring') || atlases[0];
    selectAtlas(initial.id);
  } catch (error) {
    titleEl.textContent = 'Atlas failed to load';
    summaryEl.textContent = error.message;
    loadEl.textContent = error.message;
    loadEl.classList.add('visible');
  }
}

document.getElementById('zoomIn').addEventListener('click', () => zoomCentre(1.35));
document.getElementById('zoomOut').addEventListener('click', () => zoomCentre(1 / 1.35));
document.getElementById('fitMap').addEventListener('click', fitMap);
document.getElementById('homeMap').addEventListener('click', homeMap);
labelsEl.addEventListener('change', updateTransform);
atlasSelect.addEventListener('change', () => selectAtlas(atlasSelect.value));
new ResizeObserver(() => { if (state.autoFit) fitMap(); }).observe(viewport);
installGestures();
start();
