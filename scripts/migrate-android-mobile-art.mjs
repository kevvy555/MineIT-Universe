import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const buildingsPath = resolve(root, 'data', 'buildings.json');
const levelsPath = resolve(root, 'data', 'building-mobile-level-images.json');
const landscapesPath = resolve(root, 'data', 'visual-assets-mobile-landscape.json');
const buildings = JSON.parse(await readFile(buildingsPath, 'utf8'));
const levels = JSON.parse(await readFile(levelsPath, 'utf8'));
const landscapes = JSON.parse(await readFile(landscapesPath, 'utf8'));

const migratedBuildingIds = new Set([
  'building-accommodation-building', 'building-algae-facility', 'building-bio-harvester',
  'building-deep-mine', 'building-extraction-rig', 'building-farm', 'building-industry',
  'building-quarry', 'building-ranch', 'building-simple-pit-mine'
]);

async function requireAsset(path) { await access(resolve(root, path)); }

for (const building of buildings) {
  if (!migratedBuildingIds.has(building.id)) continue;
  await requireAsset(building.image.key);
  await requireAsset(`assets/art/universe/buildings/Originals/${building.id}.png`);
  await requireAsset(building.mobileLevelAtlas.key);
  building.image.generated = true;
  building.image.status = 'generated';
  building.image.notes = `${building.image.notes.replace(/ Migrated from MineIT Android[^.]*\./g, '')} Migrated from the established MineIT Android L3 source image as the representative canonical catalogue view.`;
  building.mobileLevelAtlas.generated = true;
  building.mobileLevelAtlas.status = 'generated';
}

for (const levelImage of levels) {
  if (!migratedBuildingIds.has(levelImage.buildingId)) continue;
  await requireAsset(levelImage.image.key);
  await requireAsset(`assets/art/universe/buildings/mobile-levels/Originals/${levelImage.buildingId}-l${levelImage.level}.png`);
  levelImage.image.generated = true;
  levelImage.image.status = 'generated';
  levelImage.image.notes = `${levelImage.image.notes.replace(/ Migrated from the established MineIT Android source artwork\./g, '')} Migrated from the established MineIT Android source artwork.`;
}

const migratedLandscapeRoots = [
  'visual-landscape-generated-plains-grassland',
  'visual-landscape-generated-hills-grassland',
  'visual-landscape-generated-mountains-grassland',
  'visual-landscape-generated-lake'
];
const landscapeById = new Map(landscapes.map(record => [record.id, record]));
for (const rootId of migratedLandscapeRoots) {
  const base = landscapeById.get(`${rootId}-01`);
  if (!base) throw new Error(`Missing prepared landscape base ${rootId}-01`);
  for (let variant = 1; variant <= 4; variant += 1) {
    const suffix = String(variant).padStart(2, '0');
    const id = `${rootId}-${suffix}`;
    let record = landscapeById.get(id);
    if (!record) {
      record = structuredClone(base);
      record.id = id;
      record.name = base.name.replace(/01$/, suffix);
      record.variant = variant;
      record.image.key = `assets/art/visual-library/landscape/mobile/${id}.webp`;
      record.image.notes = `${base.image.notes} Migrated variant ${variant} from the established MineIT Android terrain artwork.`;
      landscapes.push(record);
      landscapeById.set(id, record);
    }
    await requireAsset(record.image.key);
    await requireAsset(`assets/art/visual-library/landscape/mobile/Originals/${id}.png`);
    record.image.generated = true;
    record.image.status = 'generated';
  }
}

await writeFile(buildingsPath, `${JSON.stringify(buildings, null, 2)}\n`);
await writeFile(levelsPath, `${JSON.stringify(levels, null, 2)}\n`);
await writeFile(landscapesPath, `${JSON.stringify(landscapes, null, 2)}\n`);
console.log('Registered 10 building families, 50 level images, 10 atlases and 16 terrain variants migrated from MineIT Android.');
