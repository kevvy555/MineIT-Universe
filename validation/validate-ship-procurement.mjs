import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const dataRoot=resolve(here,'../data');
const manifest=JSON.parse(await readFile(resolve(dataRoot,'manifest.json'),'utf8'));

async function loadCollection(name){
  const specification=manifest.collections?.[name];
  if(!specification)throw new Error(`Manifest collection ${name} is missing.`);
  const files=Array.isArray(specification)?specification:[specification];
  const records=[];
  for(const file of files){
    const parsed=JSON.parse(await readFile(resolve(dataRoot,file),'utf8'));
    if(!Array.isArray(parsed))throw new Error(`${name} shard ${file} must contain an array.`);
    records.push(...parsed);
  }
  return records;
}

const [shipClasses,runtimeProfiles]=await Promise.all([
  loadCollection('shipClasses'),
  loadCollection('shipClassRuntimeProfiles')
]);
const errors=[];

if(manifest.schemaVersion<6)errors.push('Ship procurement requires schemaVersion 6 or newer.');
const retail=shipClasses.filter(record=>record.retailStatus==='factory-new');
if(retail.length!==30)errors.push(`Expected 30 factory-new classes; found ${retail.length}.`);

const profilesByClass=new Map();
for(const profile of runtimeProfiles){
  if(!profile?.id)errors.push('Ship runtime profile missing id.');
  if(!profile?.shipClassId){errors.push(`${profile?.id||'unknown profile'}: shipClassId is required.`);continue;}
  if(profilesByClass.has(profile.shipClassId))errors.push(`${profile.shipClassId}: duplicate runtime profile.`);
  profilesByClass.set(profile.shipClassId,profile);
  if(!shipClasses.some(shipClass=>shipClass.id===profile.shipClassId))errors.push(`${profile.id}: references missing ship class ${profile.shipClassId}.`);
}

function validateRuntime(shipClass,{required=true}={}){
  const profile=profilesByClass.get(shipClass.id);
  if(!profile){if(required)errors.push(`${shipClass.id}: ship runtime profile is missing.`);return;}
  const lead=profile.production?.factoryLeadTimeDays;
  if(!Number.isInteger(lead)||lead<=0)errors.push(`${profile.id}: production.factoryLeadTimeDays must be a positive integer.`);
  const spec=shipClass.specifications??{},runtime=profile.specifications??{};
  if(spec.vectorExchangeCapable){
    if(!Number.isFinite(spec.transitWeeksPerLightYear)||spec.transitWeeksPerLightYear<=0)errors.push(`${shipClass.id}: VE class needs positive transitWeeksPerLightYear.`);
    if(!Number.isFinite(runtime.fuelUsePerLightYear)||runtime.fuelUsePerLightYear<=0)errors.push(`${profile.id}: VE class needs positive fuelUsePerLightYear.`);
  }else if(runtime.fuelUsePerLightYear!=null){
    errors.push(`${profile.id}: non-VE class should not publish interstellar fuelUsePerLightYear.`);
  }
}
for(const shipClass of retail)validateRuntime(shipClass);

const starter=shipClasses.find(record=>record.id==='ship-class-asterion-pioneer-colony-transport');
if(!starter)errors.push('Canonical starter colony ship class is missing.');
else{
  if(starter.manufacturerOrganisationId!=='organisation-asterion-shipworks')errors.push('Starter colony ship must resolve to Asterion Shipworks.');
  if(starter.shipLineId!=='ship-line-asterion-nomad')errors.push('Starter colony ship must resolve to the Asterion Nomad Line.');
  if(starter.retailStatus!=='charter-issued')errors.push('Starter colony ship must remain charter-issued, not factory-new retail.');
  const spec=starter.specifications??{};
  const expected={cargoCapacity:8000,fuelCapacity:2000,foodCapacity:2000,colonistCapacity:250,minimumCrew:10};
  for(const[field,value]of Object.entries(expected))if(spec[field]!==value)errors.push(`Starter colony ship ${field} must remain ${value}.`);
  validateRuntime(starter);
  const runtime=profilesByClass.get(starter.id)?.specifications??{};
  if(runtime.fuelUsePerLightYear!==260)errors.push('Starter colony ship fuelUsePerLightYear must remain 260.');
}

const expectedProfileCount=retail.length+(starter?1:0);
const relevantProfiles=runtimeProfiles.filter(profile=>retail.some(shipClass=>shipClass.id===profile.shipClassId)||profile.shipClassId===starter?.id);
if(relevantProfiles.length!==expectedProfileCount)errors.push(`Expected ${expectedProfileCount} procurement runtime profiles; found ${relevantProfiles.length}.`);

if(errors.length){
  console.error(`Ship procurement validation failed (${errors.length}):`);
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Ship procurement catalogue valid: ${retail.length} retail classes plus canonical starter vessel; ${runtimeProfiles.length} runtime profiles.`);
