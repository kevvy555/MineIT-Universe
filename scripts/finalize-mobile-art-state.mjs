import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const exists = async path => { try { await access(resolve(root, path)); return true; } catch { return false; } };

const buildingsPath = resolve(root, 'data', 'buildings.json');
const levelsPath = resolve(root, 'data', 'building-mobile-level-images.json');
const landscapesPath = resolve(root, 'data', 'visual-assets-mobile-landscape.json');
const buildings = JSON.parse(await readFile(buildingsPath, 'utf8'));
const levels = JSON.parse(await readFile(levelsPath, 'utf8'));
const landscapes = JSON.parse(await readFile(landscapesPath, 'utf8'));

for (const building of buildings) {
  const original = `assets/art/universe/buildings/Originals/${building.id}.png`;
  if (building.image.status !== 'needs-regeneration' && await exists(original) && await exists(building.image.key)) {
    building.image.generated = true;
    building.image.status = 'generated';
  }
  if (await exists(building.mobileLevelAtlas.key)) {
    building.mobileLevelAtlas.generated = true;
    building.mobileLevelAtlas.status = 'generated';
  }
}
for (const record of levels) {
  const original = `assets/art/universe/buildings/mobile-levels/Originals/${record.buildingId}-l${record.level}.png`;
  if (await exists(original) && await exists(record.image.key)) {
    record.image.generated = true;
    record.image.status = 'generated';
  }
}
for (const record of landscapes) {
  const original = `assets/art/visual-library/landscape/mobile/Originals/${record.id}.png`;
  if (await exists(original) && await exists(record.image.key)) {
    record.image.generated = true;
    record.image.status = 'generated';
  }
}

await writeFile(buildingsPath, `${JSON.stringify(buildings, null, 2)}\n`);
await writeFile(levelsPath, `${JSON.stringify(levels, null, 2)}\n`);
await writeFile(landscapesPath, `${JSON.stringify(landscapes, null, 2)}\n`);
console.log('Updated image state only where required original and published assets exist.');
