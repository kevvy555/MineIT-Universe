import { loadUniverse } from './universe-data.js';

const state={catalogue:null,validation:null,activeView:'geography',selectedId:null,openNodes:new Set(),currentTree:null};
const treeEl=document.getElementById('tree'),detailEl=document.getElementById('detail'),searchEl=document.getElementById('search'),versionEl=document.getElementById('version'),detailPane=document.getElementById('detail'),workspace=document.getElementById('workspace'),divider=document.getElementById('divider');

const DIRECTORY={regions:'Regions',starSystems:'Star Systems',planets:'Planets / Moons',settlements:'Settlements / Stations',organisations:'Organisations',organisationUnits:'Organisation Units',facilities:'Facilities',operations:'Operations',products:'Products',species:'Species',people:'People',shipClasses:'Ship Classes',ships:'Named Ships',projects:'Projects',events:'Historical Events',relationships:'Relationships'};
const ICONS={regions:'◎',starSystems:'✦',planets:'●',settlements:'⬡',organisations:'O',organisationUnits:'▦',facilities:'⌂',operations:'⚙',products:'◆',species:'S',people:'P',shipClasses:'△',ships:'▲',projects:'◇',events:'◷',relationships:'↔'};
const nodeKey=n=>n.id||`label:${n.label}`;
const entityNode=(id,children=[])=>({id,children:children.filter(Boolean)});
const category=(label,children=[])=>children.filter(Boolean).length?{label,children:children.filter(Boolean)}:null;
const byName=(a,b)=>state.catalogue.nameFor(a.id).localeCompare(state.catalogue.nameFor(b.id));
const nodes=records=>records.map(r=>entityNode(r.id)).sort(byName);
const related=(collection,predicate)=>state.catalogue.collection(collection).filter(predicate);
const relatedIds=(collection,predicate)=>related(collection,predicate).map(r=>r.id);
const uniq=values=>[...new Set((values||[]).filter(Boolean))];

function organisationUnitNode(unit){
  return entityNode(unit.id,[
    ...related('organisationUnits',u=>u.parentUnitId===unit.id).map(organisationUnitNode).sort(byName),
    category('People',nodes(related('people',p=>p.organisationUnitId===unit.id))),
    category('Facilities',nodes(related('facilities',f=>f.organisationUnitId===unit.id))),
    category('Operations',nodes(related('operations',o=>o.organisationUnitId===unit.id)))
  ]);
}

function organisationNode(org){
  return entityNode(org.id,[
    ...related('organisationUnits',u=>u.organisationId===org.id&&!u.parentUnitId).map(organisationUnitNode).sort(byName),
    category('People',nodes(related('people',p=>p.organisationId===org.id&&!p.organisationUnitId))),
    category('Facilities',nodes(related('facilities',f=>f.organisationId===org.id&&!f.organisationUnitId))),
    category('Named Ships',nodes(related('ships',s=>s.organisationId===org.id))),
    category('Projects',nodes(related('projects',p=>(p.organisationIds||[]).includes(org.id))))
  ]);
}

function settlementNode(settlement){
  return entityNode(settlement.id,[
    category('Organisations',nodes(related('organisations',o=>o.headquartersLocationId===settlement.id))),
    category('Facilities',nodes(related('facilities',f=>f.settlementId===settlement.id))),
    category('People',nodes(related('people',p=>p.workLocationId===settlement.id||p.homeLocationId===settlement.id))),
    category('Named Ships',nodes(related('ships',s=>s.homePortLocationId===settlement.id)))
  ]);
}

function worldNode(world){
  const moons=related('planets',p=>p.parentPlanetId===world.id);
  return entityNode(world.id,[
    category('Moons',moons.map(worldNode).sort(byName)),
    category('Settlements / Stations',related('settlements',s=>s.planetId===world.id).map(settlementNode).sort(byName)),
    category('Facilities',nodes(related('facilities',f=>f.planetId===world.id&&!f.settlementId)))
  ]);
}

function systemNode(system){
  const roots=related('planets',p=>p.systemId===system.id&&!p.parentPlanetId);
  return entityNode(system.id,[
    ...roots.map(worldNode).sort(byName),
    category('Projects',nodes(related('projects',p=>(p.locationIds||[]).includes(system.id)))),
    category('Historical Events',nodes(related('events',e=>(e.linkedEntityIds||[]).includes(system.id))))
  ]);
}

function buildGeographyTree(){
  const regions=state.catalogue.collection('regions').map(region=>entityNode(region.id,state.catalogue.collection('starSystems').filter(s=>s.regionId===region.id).map(systemNode).sort(byName)));
  return {label:state.catalogue.manifest.name||'MineIT Universe',children:regions.sort(byName)};
}
function buildOrganisationTree(){return {label:'Organisations',children:state.catalogue.collection('organisations').map(organisationNode).sort(byName)};}
function buildDirectoryTree(){return {label:'Directory',children:Object.entries(DIRECTORY).map(([name,label])=>category(label,nodes(state.catalogue.collection(name)))).filter(Boolean)};}
function buildTree(){return state.activeView==='organisation'?buildOrganisationTree():state.activeView==='directory'?buildDirectoryTree():buildGeographyTree();}
function findPath(node,id,path=[]){const next=[...path,node];if(node.id===id)return next;for(const c of node.children||[]){const found=findPath(c,id,next);if(found)return found;}return null;}
function revealSelected(){state.currentTree=buildTree();const path=findPath(state.currentTree,state.selectedId);if(path)path.slice(0,-1).forEach(n=>state.openNodes.add(nodeKey(n)));}

function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}
function link(id,label){if(!id)return '—';const e=state.catalogue.get(id);return e?`<button class="entityLink" data-ref="${esc(id)}">${esc(label||e.name)}</button>`:`<span class="status error">Broken: ${esc(id)}</span>`;}
function links(ids){const list=uniq(ids);return list.length?`<div class="multiLinks">${list.map(id=>link(id)).join('')}</div>`:'—';}
function tags(values){return values?.length?`<div class="tagList">${values.map(v=>`<span class="tag">${esc(v)}</span>`).join('')}</div>`:'—';}
function field(label,value){return `<div class="field"><div class="fieldLabel">${esc(label)}</div><div class="fieldValue">${value??'—'}</div></div>`;}
function population(v){return Number.isFinite(v)?new Intl.NumberFormat('en-GB').format(v):'—';}
function renderNode(node){
  const key=nodeKey(node),children=node.children||[],open=state.openNodes.has(key),entity=node.id?state.catalogue.get(node.id):null;
  const li=document.createElement('li'),row=document.createElement('div');row.className=`treeRow${node.id===state.selectedId?' selected':''}`;if(node.id===state.selectedId)row.dataset.selected='true';
  const twist=document.createElement('button');twist.className=`twisty${children.length?'':' empty'}`;twist.textContent=children.length?(open?'▾':'▸'):'';twist.onclick=e=>{e.stopPropagation();open?state.openNodes.delete(key):state.openNodes.add(key);renderTree();};
  const button=document.createElement('button');button.className=`node${node.id?'':' categoryNode'}`;button.innerHTML=`${esc(entity?.name||node.label||node.id)}${entity?` <span class="kind">${esc(state.catalogue.typeLabelFor(node.id))}</span>`:''}`;button.onclick=()=>node.id?selectEntity(node.id):(open?state.openNodes.delete(key):state.openNodes.add(key),renderTree());
  row.append(twist,button);li.append(row);if(children.length&&open){const ul=document.createElement('ul');children.forEach(c=>ul.append(renderNode(c)));li.append(ul);}return li;
}
function renderTree(){
  treeEl.innerHTML='';const q=searchEl.value.trim().toLowerCase();
  if(q){const matches=state.catalogue.allRecords().filter(({record,collectionName})=>`${record.name||''} ${record.role||''} ${record.description||''} ${record.organisationType||''} ${collectionName} ${record.id}`.toLowerCase().includes(q));if(!matches.length){treeEl.innerHTML='<div class="searchEmpty">No matching universe entities.</div>';return;}const ul=document.createElement('ul');ul.className='treeRoot';matches.sort((a,b)=>a.record.name.localeCompare(b.record.name)).forEach(({record})=>ul.append(renderNode({id:record.id})));treeEl.append(ul);return;}
  state.currentTree=buildTree();const ul=document.createElement('ul');ul.className='treeRoot';ul.append(renderNode(state.currentTree));treeEl.append(ul);
}

function subtitle(collection,e){
  const map={regions:e.regionType,starSystems:e.starType,planets:e.worldType,settlements:e.locationType,organisations:`${e.scale||''} ${e.organisationType||''}`.trim(),organisationUnits:e.unitType,facilities:`${e.facilityType||''} • ${e.status||''}`,operations:`${e.operationType||''} • ${e.status||''}`,products:e.productType,species:e.speciesType,people:e.role,shipClasses:e.role,ships:e.role,projects:`${e.projectType||''} • ${e.status||''}`,events:`${e.date||''} • ${e.eventType||''}`,relationships:e.relationshipType};return map[collection]||'';
}

function fieldsFor(collection,e){const f=[];
  if(collection==='regions'){f.push(field('Systems',links(relatedIds('starSystems',x=>x.regionId===e.id))),field('Administration',links(e.administrativeOrganisationIds)),field('Economic profile',tags(e.economicProfile)));}
  if(collection==='starSystems'){f.push(field('Region',link(e.regionId)),field('Star type',esc(e.starType)),field('Authority',link(e.primaryAuthorityOrganisationId)),field('Coordinates',esc(`${e.coordinates?.x}, ${e.coordinates?.y}, ${e.coordinates?.z}`)),field('Worlds',links(relatedIds('planets',x=>x.systemId===e.id))),field('Economic profile',tags(e.economicProfile)));}
  if(collection==='planets'){f.push(field('System',link(e.systemId)),field('Parent world',e.parentPlanetId?link(e.parentPlanetId):'—'),field('Authority',link(e.governingOrganisationId)),field('Environment',esc(e.environment)),field('Population',population(e.population)),field('Settlements',links(relatedIds('settlements',x=>x.planetId===e.id))),field('Moons',links(relatedIds('planets',x=>x.parentPlanetId===e.id))),field('Economic profile',tags(e.economicProfile)));}
  if(collection==='settlements'){f.push(field('System',link(e.systemId)),field('World',link(e.planetId)),field('Authority',link(e.governingOrganisationId)),field('Population',population(e.population)),field('Purpose',esc(e.purpose)),field('Organisations',links(relatedIds('organisations',x=>x.headquartersLocationId===e.id))),field('Facilities',links(relatedIds('facilities',x=>x.settlementId===e.id))),field('People',links(relatedIds('people',x=>x.workLocationId===e.id||x.homeLocationId===e.id))),field('Ships',links(relatedIds('ships',x=>x.homePortLocationId===e.id))));}
  if(collection==='organisations'){f.push(field('Legal name',esc(e.legalName)),field('Type',esc(e.organisationType)),field('Scale',esc(e.scale)),field('Commercial',e.commercial?'Yes':'No'),field('Headquarters',link(e.headquartersLocationId)),field('Parent organisation',e.parentOrganisationId?link(e.parentOrganisationId):'—'),field('Industries',tags(e.industries)),field('Units',links(relatedIds('organisationUnits',x=>x.organisationId===e.id))),field('Facilities',links(relatedIds('facilities',x=>x.organisationId===e.id))),field('Operations',links(relatedIds('operations',x=>x.organisationId===e.id))),field('People',links(relatedIds('people',x=>x.organisationId===e.id))),field('Ships',links(relatedIds('ships',x=>x.organisationId===e.id))));}
  if(collection==='organisationUnits'){f.push(field('Organisation',link(e.organisationId)),field('Type',esc(e.unitType)),field('Parent unit',e.parentUnitId?link(e.parentUnitId):'—'),field('Primary location',link(e.primaryLocationId)),field('Purpose',esc(e.purpose)),field('People',links(relatedIds('people',x=>x.organisationUnitId===e.id))));}
  if(collection==='facilities'){f.push(field('Organisation',link(e.organisationId)),field('Organisation unit',e.organisationUnitId?link(e.organisationUnitId):'—'),field('System',link(e.systemId)),field('World',link(e.planetId)),field('Settlement',e.settlementId?link(e.settlementId):'—'),field('Type',esc(e.facilityType)),field('Status',esc(e.status)),field('Partners',links(e.partnerOrganisationIds)),field('Operations',links(relatedIds('operations',x=>x.facilityId===e.id))));}
  if(collection==='operations'){f.push(field('Organisation',link(e.organisationId)),field('Organisation unit',e.organisationUnitId?link(e.organisationUnitId):'—'),field('Facility',link(e.facilityId)),field('Type',esc(e.operationType)),field('Status',esc(e.status)),field('Managers',links(e.managerPersonIds)),field('Procurement contacts',links(e.procurementPersonIds)),field('Ships',links(e.shipIds)),field('Products',links(e.productIds)));}
  if(collection==='products'){f.push(field('Type',esc(e.productType)),field('Producers',links(e.producerOrganisationIds)),field('Producing operations',links(relatedIds('operations',x=>(x.productIds||[]).includes(e.id)))));}
  if(collection==='species'){f.push(field('Type',esc(e.speciesType)),field('People',links(relatedIds('people',x=>x.speciesId===e.id))));}
  if(collection==='people'){const rels=related('relationships',x=>x.personAId===e.id||x.personBId===e.id).map(x=>x.id);f.push(field('Species',link(e.speciesId)),field('Role',esc(e.role)),field('Organisation',link(e.organisationId)),field('Organisation unit',e.organisationUnitId?link(e.organisationUnitId):'—'),field('Works at',link(e.workLocationId)),field('Home',link(e.homeLocationId)),field('Commercial authority',e.commercialAuthority?'Yes':'No'),field('Responsibilities',tags(e.responsibilities)),field('Operations',links(e.operationIds)),field('Ships',links(e.shipIds)),field('Relationships',links(rels)));}
  if(collection==='shipClasses'){f.push(field('Manufacturer',link(e.manufacturerOrganisationId)),field('Designers',links(e.designerOrganisationIds)),field('Role',esc(e.role)),field('Capacity class',esc(e.capacityClass)),field('Named ships',links(relatedIds('ships',x=>x.shipClassId===e.id))));}
  if(collection==='ships'){f.push(field('Organisation',link(e.organisationId)),field('Ship class',link(e.shipClassId)),field('Home port',link(e.homePortLocationId)),field('Role',esc(e.role)),field('Operations',links(e.operationIds)),field('People',links(e.personIds)));}
  if(collection==='projects'){f.push(field('Type',esc(e.projectType)),field('Status',esc(e.status)),field('Organisations',links(e.organisationIds)),field('Locations',links(e.locationIds)),field('People',links(e.personIds)),field('Ships',links(e.shipIds)),field('Operations',links(e.operationIds)));}
  if(collection==='events'){f.push(field('Date',esc(e.date)),field('Type',esc(e.eventType)),field('Linked entities',links(e.linkedEntityIds)));}
  if(collection==='relationships'){f.push(field('Person A',link(e.personAId)),field('Person B',link(e.personBId)),field('Type',esc(e.relationshipType)),field('Active',e.active?'Yes':'No'));}
  return f.join('');
}

function resourceSection(e){if(!e.resourceRequirements?.length)return'';return `<section class="section"><h2>Resource requirements</h2>${e.resourceRequirements.map(r=>`<div class="resource"><div class="resourceTop"><strong>${esc(r.displayName||`${r.resourceType}:${r.resourceId}`)}</strong><div class="resourceMeta">${esc(r.importance)} • ${esc(r.demandScale)} demand • ${esc(r.qualityPreference)} quality</div></div><p>${esc(r.reason)}</p></div>`).join('')}</section>`;}
function imagePrompt(e){const org=e.organisationId?state.catalogue.get(e.organisationId):null;return ['MineIT universe; grounded high-detail industrial science fiction.',e.visualDescription?`Persistent visual facts: ${e.visualDescription}`:'',org?.visualIdentity?`Organisation identity: ${JSON.stringify(org.visualIdentity)}.`:'',e.image?.promptDescription||''].filter(Boolean).join('\n');}
function imageSection(e){if(!e.image)return'';const generated=e.image.generated===true;return `<section class="section"><h2>Image generation</h2><div class="fieldRows">${field('Generated',generated?'Yes':'No')}${field('Status',esc(e.image.status))}${field('Asset',`<code>${esc(e.image.key)}</code>`)}${field('Prompt','<button class="copyButton" id="copyPrompt">Copy image prompt</button>')}</div><div class="longText"><pre class="rawBlock">${esc(imagePrompt(e))}</pre></div></section>`;}
function extraSections(e){let html='';for(const [key,title] of [['biography','Biography'],['personality','Personality'],['history','History'],['culture','Culture'],['reputation','Reputation'],['visualDescription','Visual description']])if(e[key])html+=`<section class="section"><h2>${title}</h2><div class="longText">${esc(e[key])}</div></section>`;if(e.visualIdentity)html+=`<section class="section"><h2>Visual identity</h2><div class="longText"><pre class="rawBlock">${esc(JSON.stringify(e.visualIdentity,null,2))}</pre></div></section>`;return html;}
function breadcrumbs(){const path=findPath(state.currentTree||buildTree(),state.selectedId);return path?path.filter(n=>n.id).map(n=>link(n.id)).join('<span>›</span>'):'';}
function validationStatus(){const v=state.validation;if(!v)return'';if(v.errors.length)return `<div class="status error">${v.errors.length} validation error(s).</div>`;return `<div class="status ok">Canonical universe loaded: ${v.entityCount} entities • schema ${esc(state.catalogue.manifest.schemaVersion)} • content ${esc(state.catalogue.manifest.contentVersion)} • canon date ${esc(state.catalogue.manifest.canonicalDate||'—')}</div>`;}
function renderDetail(){
  const e=state.catalogue.get(state.selectedId);if(!e)return;const collection=state.catalogue.collectionNameFor(e.id),icon=ICONS[collection]||'?';
  const image=e.image?.generated&&e.image?.key?`<img src="${esc(state.catalogue.assetUrl(e.image.key))}" alt="${esc(e.name)}">`:esc(collection==='people'?e.name.split(/\s+/).map(p=>p[0]).join('').slice(0,2).toUpperCase():icon);
  detailEl.innerHTML=`${validationStatus()}<div class="breadcrumbs">${breadcrumbs()}</div><div class="hero"><div class="placeholder">${image}</div><div><div class="eyebrow">${esc(state.catalogue.typeLabelFor(e.id))}</div><h1>${esc(e.name)}</h1><div class="subtitle">${esc(subtitle(collection,e))}</div></div></div><div class="description">${esc(e.description||'')}</div><section class="section"><h2>Details</h2><div class="fieldRows">${fieldsFor(collection,e)}</div></section>${resourceSection(e)}${extraSections(e)}${imageSection(e)}<section class="section"><h2>Development details</h2><div class="longText"><div class="dev"><span>ID</span><code>${esc(e.id)}</code><span>Collection</span><code>${esc(collection)}</code><span>Perspective</span><code>${esc(state.activeView)}</code><span>Content version</span><code>${esc(state.catalogue.manifest.contentVersion)}</code></div><pre class="rawBlock">${esc(JSON.stringify(e,null,2))}</pre></div></section>`;
  detailEl.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>selectEntity(b.dataset.ref));document.getElementById('copyPrompt')?.addEventListener('click',async()=>{await navigator.clipboard.writeText(imagePrompt(e));const b=document.getElementById('copyPrompt');b.textContent='Copied';setTimeout(()=>b.textContent='Copy image prompt',1000);});
}
function selectEntity(id){if(!state.catalogue.get(id))return;state.selectedId=id;revealSelected();renderTree();renderDetail();requestAnimationFrame(()=>treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({block:'nearest'}));}
function switchView(view){state.activeView=view;document.querySelectorAll('.perspective').forEach(b=>b.classList.toggle('active',b.dataset.view===view));revealSelected();renderTree();renderDetail();requestAnimationFrame(()=>treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({block:'nearest'}));}
function collapseAll(){state.openNodes.clear();revealSelected();renderTree();}
function expandCurrent(){revealSelected();renderTree();requestAnimationFrame(()=>treeEl.querySelector('[data-selected="true"]')?.scrollIntoView({block:'nearest'}));}
function installDivider(){let dragging=false;const apply=p=>{const v=Math.max(25,Math.min(75,p));detailPane.style.flexBasis=`${v}%`;sessionStorage.setItem('mineitUniverseSplit',String(v));};divider.onpointerdown=e=>{dragging=true;divider.classList.add('dragging');divider.setPointerCapture(e.pointerId);};divider.onpointermove=e=>{if(!dragging)return;const r=workspace.getBoundingClientRect();apply(((e.clientY-r.top)/r.height)*100);};const stop=e=>{dragging=false;divider.classList.remove('dragging');try{divider.releasePointerCapture(e.pointerId);}catch{}};divider.onpointerup=stop;divider.onpointercancel=stop;const saved=Number(sessionStorage.getItem('mineitUniverseSplit'));if(Number.isFinite(saved)&&saved>=25&&saved<=75)apply(saved);}
async function start(){detailEl.innerHTML='<div class="status loading">Loading canonical MineIT universe…</div>';try{const root=new URLSearchParams(location.search).get('dataRoot')||'./data/';const {catalogue,validation}=await loadUniverse(root);state.catalogue=catalogue;state.validation=validation;state.selectedId=catalogue.collection('regions')[0]?.id||catalogue.allRecords()[0]?.record.id;versionEl.textContent=`Universe ${catalogue.manifest.contentVersion}`;revealSelected();renderTree();renderDetail();}catch(error){detailEl.innerHTML=`<div class="status error"><strong>Universe failed to load.</strong><br>${esc(error.message)}</div>`;treeEl.innerHTML='<div class="searchEmpty">No universe data loaded.</div>';}}
document.querySelectorAll('.perspective').forEach(b=>b.onclick=()=>switchView(b.dataset.view));searchEl.oninput=renderTree;document.getElementById('collapseAll').onclick=collapseAll;document.getElementById('expandCurrent').onclick=expandCurrent;installDivider();start();
