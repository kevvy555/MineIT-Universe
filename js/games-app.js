import { loadUniverse } from './universe-data.js';

const root = document.getElementById('games');
const summary = document.getElementById('summary');
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function card(game) {
  const directoryHref = `./index.html?view=directory&focus=games`;
  const recordHref = `./index.html?view=directory&id=${encodeURIComponent(game.id)}`;
  return `<article class="game" id="${esc(game.id)}">
    <header>
      <small>${esc(game.platform)} • ${esc(game.status)}</small>
      <h2>${esc(game.name)}</h2>
      <p>${esc(game.description)}</p>
      <div class="meta">
        <span>${esc(game.form)}</span>
        <span>${esc(game.playPattern)}</span>
        <span>${esc(game.shortName)}</span>
      </div>
    </header>
    <div class="body">
      <div><h3>Land</h3><p>${esc(game.sharedLandUse)}</p></div>
      <div><h3>Substances and industry</h3><p>${esc(game.sharedSubstanceUse)}</p></div>
      <div><h3>Scenario</h3><p>${esc(game.scenarioNotes)}</p></div>
      <div class="links">
        <a href="${esc(recordHref)}">Open in Directory</a>
        <a href="${esc(directoryHref)}">All games</a>
        <a href="./index.html?view=directory&amp;focus=surfaceLandforms">Land vocabulary</a>
        ${game.id === 'game-mineit-mobile' ? '<a href="./index.html?view=directory&amp;focus=landscapeTilesets">World landscape tiles</a>' : ''}
        <a href="./lore.html?doc=lore-koplin-world-surface&amp;section=${encodeURIComponent(game.sourceSection || '')}">Land lore</a>
      </div>
    </div>
  </article>`;
}

try {
  const { catalogue } = await loadUniverse();
  const games = catalogue.collection('games');
  summary.textContent = `${games.length} MineIT games • Universe ${catalogue.manifest.contentVersion}`;
  root.innerHTML = games.map(card).join('') || '<div class="error">No game records in the universe catalogue.</div>';
} catch (error) {
  summary.textContent = 'Games failed to load';
  root.innerHTML = `<div class="error">${esc(error.message)}</div>`;
}
