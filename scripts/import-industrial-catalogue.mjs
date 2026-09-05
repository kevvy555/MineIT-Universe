import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, relative, resolve } from 'path';

const sourceRoot = process.argv[2] || process.env.MINEIT_SOURCE_ROOT;
if (!sourceRoot) {
  throw new Error('Provide the MineIT repository root (or Machines & Buildings directory): node scripts/import-industrial-catalogue.mjs <path>');
}

const supplied = resolve(sourceRoot);
const DESKTOP = existsSync(join(supplied, 'Parts', 'Parts.md'))
  ? supplied
  : join(supplied, 'Documentation', 'design', 'Machines & Buildings');
if (!existsSync(join(DESKTOP, 'Parts', 'Parts.md')) || !existsSync(join(DESKTOP, 'Machines', 'Machines.md'))) {
  throw new Error(`Could not find Desktop industrial design beneath ${supplied}.`);
}

const substances = JSON.parse(readFileSync('data/substances.json', 'utf8'));
const existingParts = JSON.parse(readFileSync('data/parts.json', 'utf8'));
const existingMachines = JSON.parse(readFileSync('data/machines.json', 'utf8'));
const existingBuildings = JSON.parse(readFileSync('data/buildings.json', 'utf8'));
const existingPartById = new Map(existingParts.map(record => [record.id, record]));
const existingMachineById = new Map(existingMachines.map(record => [record.id, record]));
const existingBuildingById = new Map(existingBuildings.map(record => [record.id, record]));
const uniq = values => [...new Set((values || []).filter(Boolean))];

function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const substanceByName = new Map();
for (const substance of substances) substanceByName.set(substance.name.toLowerCase(), substance.id);

const aliases = {
  'reactive metal ore': 'substance-reactive-metal-ore',
  'conductive metal ore': 'substance-conductive-metal-ore',
  'magnetic metal ore': 'substance-magnetic-metal-ore',
  'structural metal ore': 'substance-structural-metal-ore',
  'refined reactive metal': 'substance-refined-reactive-metal',
  'refined conductive metal': 'substance-refined-conductive-metal',
  'refined magnetic metal': 'substance-refined-magnetic-metal',
  'refined structural metal': 'substance-refined-structural-metal',
  'silica mineral': 'substance-silica-mineral',
  'clay mineral': 'substance-clay-mineral',
  'insulating mineral': 'substance-insulating-mineral',
  'stone aggregate': 'substance-stone-aggregate',
  'glass': 'substance-glass',
  'refined ceramic': 'substance-refined-ceramic',
  'refined insulator': 'substance-refined-insulator',
  'carbon-rich mineral': 'substance-carbon-rich-mineral',
  'solid fuel deposit': 'substance-solid-fuel-deposit',
  'lubricant-capable liquid': 'substance-lubricant-capable-liquid',
  'liquid fuel deposit': 'substance-liquid-fuel-deposit',
  'refined graphite': 'substance-refined-graphite',
  'refined lubricant': 'substance-refined-lubricant',
  'fresh water': 'substance-fresh-water',
  'saltwater': 'substance-saltwater',
  'saltwater (+ salt)': 'substance-saltwater',
  'acidic liquid': 'substance-acidic-liquid',
  'alkaline liquid': 'substance-alkaline-liquid',
  'electrolyte solution': 'substance-electrolyte-solution',
  'electrolyte solution (+ salt)': 'substance-electrolyte-solution',
  'gas fuel deposit': 'substance-gas-fuel-deposit',
  'woody plant material': 'substance-woody-plant',
  'woody plant': 'substance-woody-plant'
};
for (const [key, value] of Object.entries(aliases)) substanceByName.set(key, value);

function resolveSubstance(name) {
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ');
  return substanceByName.get(key) || substanceByName.get(key.replace(/\s*\([^)]*\)\s*/g, '').trim()) || null;
}

function parseSubstanceList(raw) {
  if (!raw) return { ids: [], unresolved: [] };
  const parts = String(raw).split(/[,;]/).map(part => part.replace(/^[^:]+:\s*/, '').trim()).filter(Boolean);
  const ids = [];
  const unresolved = [];
  for (const part of parts) {
    const cleaned = part
      .replace(/\s*\(optional\)\s*/ig, '')
      .replace(/\s*\(pre-existing[^)]*\)\s*/ig, '')
      .trim();
    if (!cleaned || /^n\/?a$/i.test(cleaned) || /^none$/i.test(cleaned)) continue;
    const id = resolveSubstance(cleaned);
    if (id) ids.push(id);
    else unresolved.push(cleaned);
  }
  return { ids: uniq(ids), unresolved };
}

function parseFieldTable(block) {
  const fields = {};
  for (const row of block.matchAll(/\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/g)) fields[row[1].trim()] = row[2].trim();
  return fields;
}

function parsePartSections(md) {
  const sections = [];
  for (const block of md.split(/\n(?=### )/)) {
    const heading = block.match(/^### (.+)\n/);
    if (!heading) continue;
    const name = heading[1].trim().replace(/\s*\(P1\)\s*$/, '');
    const summary = block.match(/\n\*([^*]+)\*\n/)?.[1]?.trim() || '';
    const fields = parseFieldTable(block);
    if (fields.Type === 'Part') sections.push({ name, summary, fields });
  }
  return sections;
}

function resolvePartId(name, partIdByName) {
  const key = name.toLowerCase().replace(/\s*\(p1\)\s*$/, '').trim();
  if (partIdByName.has(key)) return partIdByName.get(key);
  for (const [candidate, id] of partIdByName.entries()) if (candidate.includes(key) || key.includes(candidate)) return id;
  return null;
}

function parsePartLinks(raw, partIdByName) {
  if (!raw) return { ids: [], unresolved: [] };
  const cleaned = raw.replace(/\(pre-existing[^)]*\)/gi, '').replace(/\(optional\)/gi, '');
  const linkNames = [...cleaned.matchAll(/\[([^\]]+)\]\([^)]+\)/g)].map(match => match[1]);
  const remainder = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, ',').split(/[,;]/).map(part => part.trim()).filter(Boolean);
  const names = [...linkNames, ...remainder]
    .map(name => name.replace(/\s*\(optional\)\s*/ig, '').replace(/^optional:\s*/i, '').replace(/\s*\(P1\)\s*$/, '').trim())
    .filter(name => name && !/^optional:?$/i.test(name));
  const ids = [];
  const unresolved = [];
  const seen = new Set();
  for (const name of names) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const id = resolvePartId(name, partIdByName);
    if (id) ids.push(id);
    else unresolved.push(name);
  }
  return { ids: uniq(ids), unresolved };
}

function preserveApprovedText(record, approved) {
  if (!approved) return record;
  return {
    ...record,
    name: approved.name || record.name,
    sources: approved.sources || record.sources,
    description: approved.description || record.description,
    canonStatus: approved.canonStatus || record.canonStatus,
    provenance: { ...record.provenance, ...approved.provenance }
  };
}

const partWarnings = [];
const machineWarnings = [];
const buildingWarnings = [];

const partsMd = readFileSync(join(DESKTOP, 'Parts', 'Parts.md'), 'utf8').replace(/\r\n/g, '\n');
const parts = [];
const partIdByName = new Map();
for (const section of parsePartSections(partsMd)) {
  if (partIdByName.has(section.name.toLowerCase())) continue;
  const subCategories = (section.fields.SubCategory || 'General').split(',').map(value => value.trim()).filter(Boolean);
  const substanceRefs = parseSubstanceList(section.fields.Substances);
  if (substanceRefs.unresolved.length) partWarnings.push(`${section.name}: unresolved substances: ${substanceRefs.unresolved.join('; ')}`);
  const id = `part-${slug(section.name)}`;
  let record = {
    id,
    name: section.name,
    entityType: 'Part',
    category: section.fields.Category || 'Other',
    subCategory: subCategories[0] || 'General',
    subCategories,
    sources: (section.fields.Source || '').split(',').map(value => value.trim()).filter(Boolean),
    substanceIds: substanceRefs.ids,
    declaredMachineNames: (section.fields['Used In'] || '').split(',').map(value => value.replace(/\(optional\)/gi, '').trim()).filter(Boolean),
    description: section.summary || `${section.name} is an industrial part used in Commonwealth frontier construction.`,
    canonStatus: 'source-canonical',
    provenance: { desktopPath: 'Machines & Buildings/Parts/Parts.md' }
  };
  record = preserveApprovedText(record, existingPartById.get(id));
  parts.push(record);
  partIdByName.set(section.name.toLowerCase(), id);
}

const machinesMd = readFileSync(join(DESKTOP, 'Machines', 'Machines.md'), 'utf8').replace(/\r\n/g, '\n');
const machines = [];
const machineIdByName = new Map();
for (const block of machinesMd.split(/\n(?=\*\*[^*\n]+\*\*\n)/)) {
  const title = block.match(/^\*\*([^*\n]+)\*\*\n/);
  if (!title) continue;
  const name = title[1].trim();
  if (['Metal', 'Silicate', 'Carbon', 'Water', 'Volatile', 'Organic'].includes(name)) continue;
  const fields = parseFieldTable(block);
  if (fields.Type !== 'Machine' && fields.Type !== 'Equipment') continue;
  const partRefs = parsePartLinks(fields['Construction Parts'] || '', partIdByName);
  if (partRefs.unresolved.length) machineWarnings.push(`${name}: unresolved parts: ${partRefs.unresolved.join('; ')}`);
  const id = `machine-${slug(name)}`;
  let record = {
    id,
    name,
    entityType: 'Machine',
    category: fields.Category || 'Other',
    subCategory: fields.SubCategory || 'General',
    sources: (fields.Source || '').split(',').map(value => value.trim()).filter(Boolean),
    partIds: partRefs.ids,
    description: fields.Description || block.match(/\n\*([^*\n]+)\*\n/)?.[1]?.trim() || `${name} is an industrial machine used in Commonwealth frontier operations.`,
    canonStatus: 'source-canonical',
    provenance: { desktopPath: 'Machines & Buildings/Machines/Machines.md' }
  };
  if (fields.Input) record.inputSummary = fields.Input;
  if (fields.Output) record.outputSummary = fields.Output;
  if (fields['Fuel Type']) record.fuelType = fields['Fuel Type'];
  record = preserveApprovedText(record, existingMachineById.get(id));
  const approved = existingMachineById.get(id);
  if (approved?.inputSummary) record.inputSummary = approved.inputSummary;
  if (approved?.outputSummary) record.outputSummary = approved.outputSummary;
  if (approved?.fuelType) record.fuelType = approved.fuelType;
  machines.push(record);
  machineIdByName.set(name.toLowerCase(), id);
}

// Machine construction declarations are authoritative. The reverse part.machineIds index is
// derived from machine.partIds so the two directions cannot drift when source docs omit a
// reciprocal "Used In" entry.
for (const part of parts) {
  const derivedMachineIds = machines.filter(machine => (machine.partIds || []).includes(part.id)).map(machine => machine.id);
  for (const declaredName of part.declaredMachineNames || []) {
    const declaredId = machineIdByName.get(declaredName.toLowerCase());
    if (!declaredId) {
      partWarnings.push(`${part.name}: unresolved declared machine: ${declaredName}`);
      continue;
    }
    if (!derivedMachineIds.includes(declaredId)) {
      partWarnings.push(`${part.name}: source declares use in ${declaredName}, but that machine does not reference ${part.id}`);
    }
  }
  part.machineIds = uniq(derivedMachineIds);
  delete part.declaredMachineNames;
}

function walkMarkdown(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(path, files);
    else if (entry.name.endsWith('.md') && !/(Images|UI|Template|Definition|BuildingStorage)\.md$/i.test(entry.name) && entry.name !== 'Buildings.md') files.push(path);
  }
  return files;
}

function extractSectionValues(chunk, headerPattern) {
  const lines = chunk.split('\n');
  const values = [];
  let mode = false;
  for (const line of lines) {
    if (headerPattern.test(line)) { mode = true; continue; }
    if (!mode) continue;
    if (/Substances \(|Machines \(/i.test(line) && !headerPattern.test(line)) break;
    if (/^##\s+/.test(line) || /^---\s*$/.test(line)) break;
    if (!line.includes('|')) {
      if (!line.trim() && values.length) break;
      continue;
    }
    if (/\|\s*-[-| ]+\s*\|/.test(line)) continue;
    const cells = line.split('|').map(cell => cell.trim()).filter((_, index, array) => index > 0 && index < array.length - 1);
    if (!cells.length) continue;
    const value = cells[0].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
    if (!value || /^(role|n\/a|none|-)$/i.test(value) || /substances|machines/i.test(value)) continue;
    values.push(value);
  }
  return values;
}

const buildings = [];
for (const file of walkMarkdown(join(DESKTOP, 'Buildings'))) {
  const md = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const isCollectionBundle = /CollectionBuildings\.md$/i.test(file);
  const chunks = isCollectionBundle
    ? md.split(/\n(?=## )/).filter(chunk => /^## /.test(chunk) && !/^## (Overview|Notes|Related|Contents|Substance|MVP)/i.test(chunk))
    : [md];

  for (const chunk of chunks) {
    const fields = parseFieldTable(chunk);
    let name = fields.Name || null;
    if (!name) {
      const heading = chunk.match(/^#\s+(.+)$/m) || chunk.match(/^##\s+(.+)$/m);
      name = heading?.[1]?.replace(/\[|\]|\([^)]*\)/g, '').trim();
    }
    if (!name || /\b(template|ui|images)\b/i.test(name)) continue;
    if (/specification$/i.test(name) && fields.BuildingType) name = fields.BuildingType;
    else name = name.replace(/\s+Specification$/i, '').trim();
    if (fields.BuildingType === 'Stockpile') name = 'Stockpile';
    if (fields.Type && fields.Type !== 'Building' && !fields.BuildingType && !isCollectionBundle) continue;

    if (isCollectionBundle) {
      const detailsType = chunk.match(/\|\s*Building Type\s*\|\s*([^|]+)\|/i)?.[1]?.trim();
      if (detailsType) fields.BuildingType = detailsType;
      fields.Type = 'Building';
      fields.Category = fields.Category || 'Resource Extraction';
      fields.Source = fields.Source || 'Manufactured';
    }

    const categories = (fields.Category || 'Other').split(',').map(value => value.trim()).filter(Boolean);
    const shell = parseSubstanceList([
      ...extractSectionValues(chunk, /Substances \(structural shell\)/i),
      ...extractSectionValues(chunk, /Substances \(construction\)/i)
    ].join(', '));
    const fit = parseSubstanceList(extractSectionValues(chunk, /Substances \(fit-out\)/i).join(', '));
    shell.unresolved = shell.unresolved.filter(item => !/^\*?none\*?$/i.test(item));
    fit.unresolved = fit.unresolved.filter(item => !/^\*?none\*?$/i.test(item));

    const machineIds = [];
    for (const machineName of extractSectionValues(chunk, /Machines \(installed\)/i)) {
      const id = machineIdByName.get(machineName.toLowerCase());
      if (id) machineIds.push(id);
      else if (machineName && !/none|n\/a|manual|worker/i.test(machineName)) buildingWarnings.push(`${name}: unresolved machine ${machineName}`);
    }
    if (shell.unresolved.length) buildingWarnings.push(`${name}: unresolved shell: ${shell.unresolved.join('; ')}`);
    if (fit.unresolved.length) buildingWarnings.push(`${name}: unresolved fit-out: ${fit.unresolved.join('; ')}`);

    const id = `building-${slug(name)}`;
    if (buildings.some(building => building.id === id)) continue;
    const imported = {
      id,
      name,
      entityType: 'Building',
      category: categories[0] || 'Other',
      categories,
      buildingType: fields.BuildingType || null,
      sources: (fields.Source || '').split(',').map(value => value.trim()).filter(Boolean),
      structuralShellSubstanceIds: shell.ids,
      fitOutSubstanceIds: fit.ids,
      machineIds: uniq(machineIds),
      description: chunk.match(/\n\*([^*\n]+)\*\n/)?.[1]?.trim() || fields.Description || `${name} is a Commonwealth frontier building.`,
      canonStatus: 'source-canonical',
      provenance: { desktopPath: relative(DESKTOP, file).replace(/\\/g, '/') }
    };
    const approved = existingBuildingById.get(id);
    let record = preserveApprovedText(imported, approved);
    if (approved) {
      record.category = approved.category || record.category;
      record.categories = approved.categories || record.categories;
      record.buildingType = approved.buildingType ?? record.buildingType;
      record.structuralShellSubstanceIds = uniq([...record.structuralShellSubstanceIds, ...(approved.structuralShellSubstanceIds || [])]);
      record.fitOutSubstanceIds = uniq([...record.fitOutSubstanceIds, ...(approved.fitOutSubstanceIds || [])]);
      record.machineIds = uniq([...record.machineIds, ...(approved.machineIds || [])]);
    }
    buildings.push(record);
  }
}

// Mobile-only archetypes are reconciled into Universe once and retained here on subsequent
// Desktop source imports. Universe is authoritative after reconciliation; this importer is not
// a second production catalogue.
for (const approved of existingBuildings) {
  if (!approved.provenance?.mobile || buildings.some(building => building.id === approved.id)) continue;
  buildings.push(approved);
}

const warnings = [...partWarnings, ...machineWarnings, ...buildingWarnings];
if (warnings.length) {
  console.error(JSON.stringify({ partWarnings, machineWarnings, buildingWarnings }, null, 2));
  throw new Error(`Industrial catalogue import stopped with ${warnings.length} unresolved source relationship(s).`);
}

writeFileSync('data/parts.json', `${JSON.stringify(parts, null, 2)}\n`);
writeFileSync('data/machines.json', `${JSON.stringify(machines, null, 2)}\n`);
writeFileSync('data/buildings.json', `${JSON.stringify(buildings, null, 2)}\n`);

console.log(JSON.stringify({
  source: DESKTOP,
  parts: parts.length,
  machines: machines.length,
  buildings: buildings.length,
  mobileBuildingArchetypes: buildings.filter(building => building.provenance?.mobile).length,
  status: 'ok'
}, null, 2));
