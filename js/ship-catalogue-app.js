const $=id=>document.getElementById(id);
const catalogueEl=$('catalogue'),manufacturersEl=$('manufacturers'),summaryEl=$('summary');
const state={manufacturer:'all',data:null};
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const fmt=v=>new Intl.NumberFormat('en-GB').format(v);
const money=v=>v>=1_000_000_000?`CC ${(v/1_000_000_000).toFixed(2)}bn`:v>=1_000_000?`CC ${(v/1_000_000).toFixed(v>=100_000_000?0:1)}m`:`CC ${fmt(v)}`;
const rating=n=>`${'●'.repeat(n)}${'○'.repeat(Math.max(0,5-n))}`;

async function load(){
  const manifest=await fetch('./data/manifest.json').then(r=>r.json());
  const get=key=>fetch(`./data/${manifest.collections[key]}`).then(r=>r.json());
  const [organisations,facilities,shipLines,shipClasses,currencies]=await Promise.all([get('organisations'),get('facilities'),get('shipLines'),get('shipClasses'),get('currencies')]);
  state.data={manifest,organisations,facilities,shipLines,shipClasses,currencies};
  renderFilters();render();
}

function org(id){return state.data.organisations.find(x=>x.id===id);}
function facility(id){return state.data.facilities.find(x=>x.id===id);}
function classesFor(line){return state.data.shipClasses.filter(c=>c.shipLineId===line.id&&c.retailStatus==='factory-new').sort((a,b)=>a.specifications.cargoCapacity-b.specifications.cargoCapacity);}

function renderFilters(){
  const ids=[...new Set(state.data.shipClasses.filter(c=>c.retailStatus==='factory-new').map(c=>c.manufacturerOrganisationId))];
  manufacturersEl.innerHTML=`<button data-id="all" class="filter active">All</button>`+ids.map(id=>`<button data-id="${esc(id)}" class="filter">${esc(org(id)?.name||id)}</button>`).join('');
  manufacturersEl.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.manufacturer=b.dataset.id;manufacturersEl.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render();});
}

function spec(label,value){return `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;}
function card(c){
  const s=c.specifications,p=c.pricing,img=c.image;
  return `<article class="shipCard">
    <div class="shipImage">${img?.generated?`<img src="./${esc(img.key)}" alt="${esc(c.name)}">`:`<div class="imageMissing"><b>IMAGE NOT GENERATED</b><span>${esc(img?.status||'not-generated')}</span></div>`}</div>
    <div class="shipBody">
      <div class="shipHeading"><div><small>${esc(c.role)}</small><h3>${esc(c.name)}</h3></div><b class="price">${money(p.manufacturerListPrice)}</b></div>
      <p>${esc(c.description)}</p>
      <div class="specGrid">
        ${spec('Cargo',fmt(s.cargoCapacity))}${spec('Fuel',fmt(s.fuelCapacity))}${spec('Food',fmt(s.foodCapacity))}${spec('Colonists',fmt(s.colonistCapacity))}
        ${spec('Crew',`${s.minimumCrew}–${s.maximumCrew}`)}${spec('Berth',s.berthClass)}${spec('Landing',s.atmosphericCapability)}${spec('Range',s.rangeClass)}
      </div>
      <div class="ratings">${spec('Speed',rating(s.speedRating))}${spec('Efficiency',rating(s.fuelEfficiencyRating))}${spec('Reliability',rating(s.reliabilityRating))}</div>
      <div class="drive">${s.vectorExchangeCapable?`Vector Exchange • ${s.transitWeeksPerLightYear} weeks/light-year`:'In-system only • No Vector Exchange Drive'}</div>
      <div class="traits">${(c.specialTraits||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      <details><summary>Image generation prompt</summary><p class="prompt">${esc(img?.promptDescription||'')}</p><button class="copyPrompt" data-prompt="${esc(img?.promptDescription||'')}">Copy prompt</button></details>
    </div>
  </article>`;
}

function render(){
  const retail=state.data.shipClasses.filter(c=>c.retailStatus==='factory-new');
  summaryEl.textContent=`${retail.length} factory-new ships • 5 manufacturers`;
  const lines=state.data.shipLines.filter(l=>state.manufacturer==='all'||l.manufacturerOrganisationId===state.manufacturer);
  const groups=[];
  for(const manufacturerId of [...new Set(lines.map(l=>l.manufacturerOrganisationId))]){
    const maker=org(manufacturerId),makerLines=lines.filter(l=>l.manufacturerOrganisationId===manufacturerId);
    groups.push(`<section class="manufacturer"><header><div><small>SHIPBUILDER</small><h2>${esc(maker.name)}</h2><p>${esc(maker.description)}</p></div><div class="speciality">${esc(maker.shipbuildingSpecialisation)}</div></header>${makerLines.map(line=>{
      const yard=facility(line.flagshipYardFacilityId),ships=classesFor(line);
      return `<section class="line"><div class="lineHead"><div><small>SHIP LINE</small><h3>${esc(line.name)}</h3><p>${esc(line.description)}</p></div><div><b>${ships.length} models</b><span>${esc(yard?.name||'')}</span></div></div><div class="ships">${ships.map(card).join('')}</div></section>`;
    }).join('')}</section>`);
  }
  catalogueEl.innerHTML=groups.join('')||'<div class="loading">No ships match this manufacturer.</div>';
  catalogueEl.querySelectorAll('.copyPrompt').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.prompt);const old=b.textContent;b.textContent='Copied';setTimeout(()=>b.textContent=old,1200);});
}

load().catch(error=>{catalogueEl.innerHTML=`<div class="error"><b>Catalogue failed to load.</b><br>${esc(error.message)}</div>`;console.error(error);});
