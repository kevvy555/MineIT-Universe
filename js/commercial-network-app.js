import { loadUniverse } from './universe-data.js';

const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const state = { catalogue:null, contacts:[], sectors:[], organisations:[], operations:[], query:'', sectorId:'', organisationId:'', resourceKey:'' };

function option(value,label){return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;}
function requirementKey(requirement){return `${requirement.resourceType}:${requirement.resourceId}`;}
function operationFor(person){return (person.operationIds ?? []).map(id=>state.catalogue.get(id)).find(Boolean) ?? null;}
function sectorFor(person){return state.catalogue.get(person.commercialProfile?.economicSectorId);}
function organisationFor(person){return state.catalogue.get(person.organisationId);}

function fillFilters(){
  $('sector').innerHTML = option('','All sectors') + state.sectors.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(s=>option(s.id,s.name)).join('');
  const commercialOrgIds = new Set(state.contacts.map(person=>person.organisationId));
  const orgs = state.organisations.filter(org=>commercialOrgIds.has(org.id)).sort((a,b)=>a.name.localeCompare(b.name));
  $('organisation').innerHTML = option('','All organisations') + orgs.map(org=>option(org.id,org.name)).join('');
  const resources = new Map();
  for(const operation of state.operations) for(const requirement of operation.resourceRequirements ?? []) resources.set(requirementKey(requirement),requirement.displayName);
  $('resource').innerHTML = option('','All resources') + [...resources.entries()].sort((a,b)=>a[1].localeCompare(b[1])).map(([key,name])=>option(key,name)).join('');
}

function summary(){
  const orgCount = new Set(state.contacts.map(person=>person.organisationId)).size;
  const resources = new Set(state.operations.flatMap(operation=>(operation.resourceRequirements ?? []).map(requirementKey)));
  $('summary').innerHTML = [
    [state.contacts.length,'Commercial contacts'],
    [state.sectors.length,'Economic sectors'],
    [orgCount,'Buyer organisations'],
    [resources.size,'Demanded resources']
  ].map(([value,label])=>`<div class="metric"><b>${value}</b><span>${label}</span></div>`).join('');
}

function matches(person){
  const operation = operationFor(person), sector = sectorFor(person), org = organisationFor(person);
  if(state.sectorId && person.commercialProfile?.economicSectorId !== state.sectorId) return false;
  if(state.organisationId && person.organisationId !== state.organisationId) return false;
  if(state.resourceKey && !(operation?.resourceRequirements ?? []).some(requirement=>requirementKey(requirement)===state.resourceKey)) return false;
  if(!state.query) return true;
  const resourceText = (operation?.resourceRequirements ?? []).map(r=>r.displayName).join(' ');
  return [person.name,person.role,person.description,org?.name,sector?.name,resourceText].join(' ').toLowerCase().includes(state.query);
}

function portrait(person){
  if(person.image?.generated) return `<img class="portrait" src="${escapeHtml(state.catalogue.assetUrl(person.image.key))}" alt="${escapeHtml(person.name)}">`;
  return `<div class="portrait">IMAGE<br>NOT<br>GENERATED</div>`;
}

function card(person){
  const operation = operationFor(person), sector = sectorFor(person), org = organisationFor(person);
  const location = state.catalogue.get(person.workLocationId);
  const demand = (operation?.resourceRequirements ?? []).map(requirement=>`<span class="chip ${escapeHtml(requirement.importance)}" title="${escapeHtml(requirement.reason)}">${escapeHtml(requirement.displayName)} · ${escapeHtml(requirement.qualityPreference)}</span>`).join('');
  return `<article class="card" data-person="${escapeHtml(person.id)}">
    <div class="cardHead">${portrait(person)}<div class="identity">
      <h2>${escapeHtml(person.name)}</h2>
      <div class="role">${escapeHtml(person.role)}</div>
      <div class="org">${escapeHtml(org?.name ?? 'Unknown organisation')}</div>
      <div class="meta">${escapeHtml(sector?.name ?? 'Unknown sector')}<br>${escapeHtml(location?.name ?? person.workLocationId)}<br>${escapeHtml(person.speciesId ? state.catalogue.nameFor(person.speciesId) : '')}</div>
    </div></div>
    <div class="demand"><div class="demandTitle"><span>Structural procurement demand</span><span>${(operation?.resourceRequirements ?? []).length} resources</span></div><div class="chips">${demand || '<span class="chip">No demand linked</span>'}</div></div>
    <div class="footer"><span class="status">UNIVERSE IDENTITY · GAME TERMS GENERATED PER SAVE</span><button class="copy" data-copy="${escapeHtml(person.id)}">COPY PROMPT</button></div>
  </article>`;
}

function render(){
  const filtered = state.contacts.filter(matches).sort((a,b)=>a.name.localeCompare(b.name));
  $('context').textContent = `${filtered.length} of ${state.contacts.length} persistent commercial contacts. Resource demand is canonical; price, quantity, cadence, reputation access and collection vessel remain game state.`;
  $('cards').innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="empty">No commercial contacts match these filters.</div>';
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const person = state.catalogue.get(button.dataset.copy);
    if(!person?.image?.promptDescription) return;
    try { await navigator.clipboard.writeText(person.image.promptDescription); button.textContent='COPIED'; setTimeout(()=>button.textContent='COPY PROMPT',1200); }
    catch { button.textContent='COPY FAILED'; }
  }));
}

function bind(){
  $('search').addEventListener('input',event=>{state.query=event.target.value.trim().toLowerCase();render();});
  $('sector').addEventListener('change',event=>{state.sectorId=event.target.value;render();});
  $('organisation').addEventListener('change',event=>{state.organisationId=event.target.value;render();});
  $('resource').addEventListener('change',event=>{state.resourceKey=event.target.value;render();});
}

try {
  const { catalogue, validation } = await loadUniverse();
  state.catalogue = catalogue;
  state.contacts = catalogue.commercialContacts();
  state.sectors = catalogue.collection('economicSectors');
  state.organisations = catalogue.collection('organisations');
  state.operations = catalogue.collection('operations').filter(operation=>operation.operationType==='procurement and supply contracting');
  $('version').textContent = `v${catalogue.manifest.contentVersion}`;
  if(!validation.isValid) console.error('Universe validation errors',validation.errors);
  summary(); fillFilters(); bind(); render();
} catch(error) {
  console.error(error);
  $('cards').innerHTML = `<div class="empty">Failed to load the canonical commercial network: ${escapeHtml(error.message)}</div>`;
  $('version').textContent = 'ERROR';
}
