import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const buildingsPath = resolve(root, 'data', 'buildings.json');
const levelsPath = resolve(root, 'data', 'building-mobile-level-images.json');
const buildings = JSON.parse(await readFile(buildingsPath, 'utf8'));
let existingLevelImages = [];
try { existingLevelImages = JSON.parse(await readFile(levelsPath, 'utf8')); } catch {}
const existingLevelImageById = new Map(existingLevelImages.map(record => [record.id, record]));

const style = 'Perfect 1:1 square MineIT Mobile building tile on a genuinely transparent background. Polished stylized isometric 3D game art viewed from a consistent three-quarter elevated angle, matching the established Mobile development-building language: clean rounded white ceramic/composite shells, charcoal structural frames and platforms, vivid orange trim and safety rails, restrained electric-blue emissive details, warm amber windows, crisp bevels, compact modular construction and a strong readable silhouette at 128×128. Centre the complete structure with comfortable transparent margin. No terrain scene, sky, horizon, rectangular backdrop, people, readable text, logos, company marks, registration numbers, UI, border or watermark.';

const canonicalComplexity = 'Show a complete mature reference configuration that clearly communicates the building identity without representing a numbered gameplay level.';
const levelComplexity = {
  1: 'Level 1 progression: a compact starter installation with the minimum functional modules, one clear primary structure, sparse support equipment and the simplest readable silhouette.',
  2: 'Level 2 progression: retain the Level 1 design language and core layout, then add one meaningful functional module, reinforced platforms, extra utilities and modest capacity without becoming dense.',
  3: 'Level 3 progression: an established mid-tier compound evolved from the lower levels, with several connected modules, increased capacity, moderate verticality and balanced operational detail.',
  4: 'Level 4 progression: an advanced expanded complex evolved from Level 3, with multiple major modules, stronger vertical elements, sophisticated support infrastructure and a dense but readable silhouette.',
  5: 'Level 5 progression: the flagship maximum-development form evolved from Level 4, a large cohesive complex with multiple specialised modules, the greatest verticality and capacity, refined infrastructure and the richest readable detail.'
};

for (const building of buildings) {
  const authoredPrompt = building.image.promptDescription.includes('Building identity and required functional content: ')
    ? building.image.promptDescription.split('Building identity and required functional content: ')[1]
    : building.image.promptDescription;
  const subject = authoredPrompt
    .replace(/^Grounded high-detail industrial science-fiction /, '')
    .replace(/ Year-5326 Koplin Commonwealth frontier industrial realism\. Shared visual kit: charcoal weathered structural metal, pale ceramic wear surfaces, dark exposed fasteners, practical colony lighting\./g, '')
    .replace(/; exterior (?:full-structure|overview) catalogue view/g, '')
    .trim();
  building.image.promptDescription = `${style} ${canonicalComplexity} Building identity and required functional content: ${subject}`;
  const notes = building.image.notes.replace(/ Canonical identity art follows the MineIT Mobile isometric style; separate linked L1-L5 presentation images are materialised in building-mobile-level-images\.json\.$/, '');
  building.image.notes = `${notes} Canonical identity art follows the MineIT Mobile isometric style; separate linked L1-L5 presentation images are materialised in building-mobile-level-images.json.`;
  if (building.image.generated) building.image.status = 'needs-regeneration';
  building.mobileLevelAtlas ??= {
    key: `assets/art/universe/buildings/mobile-levels/atlases/${building.id}-levels-256.webp`,
    generated: false,
    status: 'not-generated',
    frameWidth: 256,
    frameHeight: 256,
    frameOrder: [1, 2, 3, 4, 5],
    notes: 'Derived MineIT Mobile runtime atlas containing five horizontal 256x256 frames, L1 through L5.'
  };
}

const levelImages = buildings.flatMap(building => [1, 2, 3, 4, 5].map(level => {
  const existing = existingLevelImageById.get(`mobile-${building.id}-l${level}`);
  return ({
  id: `mobile-${building.id}-l${level}`,
  name: `${building.name} — Mobile Level ${level}`,
  buildingId: building.id,
  intendedGameId: 'game-mineit-mobile',
  assetType: 'mobile-building-level-image',
  level,
  image: {
    key: `assets/art/universe/buildings/mobile-levels/${building.id}-l${level}.webp`,
    generated: existing?.image?.generated ?? false,
    status: existing?.image?.status ?? 'not-generated',
    promptDescription: `${style} ${levelComplexity[level]} Preserve this building's identity and required functional content across the progression: ${building.description} Specific visual requirements: ${building.image.promptDescription.split('Building identity and required functional content: ')[1]}`,
    notes: `MineIT Mobile level-${level} presentation for ${building.id}. Store the lossless PNG under assets/art/universe/buildings/mobile-levels/Originals/${building.id}-l${level}.png and publish the WebP at image.key. This is a game-facing progression view linked to the canonical building identity, not a separate building entity.`
  }
})}));

await writeFile(buildingsPath, `${JSON.stringify(buildings, null, 2)}\n`);
await writeFile(levelsPath, `${JSON.stringify(levelImages, null, 2)}\n`);
console.log(`Prepared ${buildings.length} canonical prompts and ${levelImages.length} Mobile level-image records.`);
