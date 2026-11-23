import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8').then(JSON.parse);
const [categories,buildings]=await Promise.all([read('data/building-categories.json'),read('data/buildings.json')]);
const expected=new Map([['Command','Cmd'],['Housing','Accom'],['Industry','Ind'],['Power','Pwr'],['Processing','Proc'],['Research','Rsch'],['Resource Collection','Coll'],['Resource Extraction','Extract'],['Resource Production','Prod'],['Storage','Str']]);
assert.equal(categories.length,13);assert.equal(new Set(categories.map(c=>c.id)).size,13);assert.equal(new Set(categories.map(c=>c.name)).size,13);
for(const b of buildings)assert(categories.some(c=>c.name===b.category),`${b.id}: unregistered primary category`);
for(const c of categories){assert.equal(c.showInLoadoutFilter,expected.has(c.name));if(!c.showInLoadoutFilter)continue;assert.equal(c.shortName,expected.get(c.name));assert(c.image.generated);assert.equal(c.image.status,'generated');assert(c.image.promptDescription);for(const key of [c.originalKey,c.image.key]){assert(key.startsWith('assets/art/universe/tactical/categories/'));assert(!key.includes('..'));await access(new URL('../'+key,import.meta.url))}const png=await readFile(new URL('../'+c.originalKey,import.meta.url));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');}
console.log('Building categories valid: 10 illustrated loadout filters, 3 hidden categories, all primary building categories covered.');
