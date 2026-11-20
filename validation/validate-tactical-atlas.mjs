import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const manifest = readJson('data/manifest.json');
const assets = readJson('data/mobile-tactical-assets.json');
const assignments = readJson('game-specs/mineit-mobile/tactical-atlas-slots.json');
const metadataPath = manifest.assetBundles?.mobileTacticalAtlas;
assert.equal(metadataPath, 'assets/art/universe/tactical/atlas/tactical-atlas.json');
const metadata = readJson(metadataPath);
const atlasDir = dirname(resolve(root, metadataPath));
assert.equal(metadata.formatVersion, 1);
assert.deepEqual(metadata.atlasSize, [512, 512]);
assert.deepEqual(metadata.frameSize, [64, 64]);
assert.equal(metadata.slotCapacityPerAtlas, 64);
assert.equal(metadata.origin, 'top-left');
assert.equal(metadata.alpha, 'straight');
assert.equal(metadata.sprites.length, assets.length);
assert.deepEqual(new Set(metadata.sprites.map(s => s.assetId)), new Set(assets.map(a => a.id)));
assert.equal(new Set(metadata.sprites.map(s => s.slot)).size, assets.length);
assert.deepEqual(metadata.levelOverlay, {
  mode: 'separate-sprite', badgeSize: [13, 13], baseSize: [32, 32], topLeftOnBase: [19, 19],
  levels: Object.fromEntries([1, 2, 3, 4, 5].map(i => [String(i), `tactical-level-${i}`]))
});

// Decode non-interlaced 8-bit RGBA PNGs using only Node built-ins. Checking
// pixels independently catches wrong ordering, scaling, padding and stale art.
function readRgbaPng(path) {
  const data = readFileSync(path);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let pos = 8, width, height, chunks = [];
  while (pos < data.length) {
    const length = data.readUInt32BE(pos), type = data.toString('ascii', pos + 4, pos + 8);
    const payload = data.subarray(pos + 8, pos + 8 + length);
    assert.equal(payload.length, length, `Truncated PNG chunk: ${path}`);
    if (type === 'IHDR') {
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      assert.deepEqual([...payload.subarray(8)], [8, 6, 0, 0, 0], `Expected RGBA PNG: ${path}`);
    }
    if (type === 'IDAT') chunks.push(payload);
    pos += 12 + length;
    if (type === 'IEND') break;
  }
  assert.ok(width && height && chunks.length, `Incomplete PNG: ${path}`);
  const compressed = inflateSync(Buffer.concat(chunks)), stride = width * 4;
  assert.equal(compressed.length, (stride + 1) * height);
  const pixels = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
    return da <= db && da <= dc ? a : db <= dc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = compressed[y * (stride + 1)]; assert.ok(filter <= 4);
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft = y && x >= 4 ? pixels[(y - 1) * stride + x - 4] : 0;
      const prior = [0, left, up, Math.floor((left + up) / 2), paeth(left, up, upperLeft)][filter];
      pixels[y * stride + x] = (compressed[y * (stride + 1) + x + 1] + prior) & 255;
    }
  }
  return { width, height, pixels };
}
const { createHash } = await import('node:crypto');
const pages = new Map();
for (const page of metadata.pages) {
  assert.match(page.file, /^tactical-atlas-\d+\.png$/);
  assert.equal(pages.has(page.page), false);
  const path = resolve(atlasDir, page.file);
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), page.sha256);
  const image = readRgbaPng(path);
  assert.deepEqual([image.width, image.height], metadata.atlasSize);
  pages.set(page.page, { ...image, name: page.file });
}
const byId = new Map(assets.map(a => [a.id, a]));
for (const entry of metadata.sprites) {
  const item = byId.get(entry.assetId), page = pages.get(entry.page), f = entry.frame, s = entry.sprite;
  assert.ok(item && page && page.name === entry.atlas);
  assert.equal(entry.entityId, item.entityId);
  assert.equal(entry.assetType, item.assetType);
  assert.equal(entry.slot, assignments.slots[entry.assetId]);
  assert.equal(entry.page, Math.floor(entry.slot / 64));
  assert.deepEqual(f, {x: (entry.slot % 8) * 64, y: Math.floor((entry.slot % 64) / 8) * 64, width: 64, height: 64});
  assert.deepEqual([s.width, s.height], item.smallSize);
  assert.deepEqual([s.x, s.y], [f.x + Math.floor((64 - s.width) / 2), f.y + Math.floor((64 - s.height) / 2)]);
  assert.deepEqual(entry.anchor, [0.5, 0.5]);
  assert.equal(entry.sourceImage, item.smallImageKey);
  assert.equal(createHash('sha256').update(readFileSync(resolve(root, item.smallImageKey))).digest('hex'), entry.sourceSha256);
  assert.deepEqual(entry.uvEdges, [s.x / 512, s.y / 512, (s.x + s.width) / 512, (s.y + s.height) / 512]);
  assert.deepEqual(entry.uvTexelCenters, [(s.x + .5) / 512, (s.y + .5) / 512, (s.x + s.width - .5) / 512, (s.y + s.height - .5) / 512]);
  if (item.assetType === 'building-symbol') assert.deepEqual(entry.supportedLevels, [1, 2, 3, 4, 5]);
  if (item.assetType === 'level-badge') {
    assert.equal(entry.variant, 'level-badge');
    assert.equal(entry.level, Number(item.id.slice(-1)));
  } else { assert.equal(entry.variant, 'base'); assert.equal(entry.level, null); }
  if (item.orientation) assert.equal(entry.orientation, item.orientation);
  const src = readRgbaPng(resolve(root, item.smallImageKey));
  assert.deepEqual([src.width, src.height], [s.width, s.height]);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const atlasAt = ((f.y + y) * page.width + f.x + x) * 4;
    const inSprite = f.x + x >= s.x && f.x + x < s.x + s.width && f.y + y >= s.y && f.y + y < s.y + s.height;
    if (inSprite) {
      const sourceAt = ((f.y + y - s.y) * s.width + (f.x + x - s.x)) * 4;
      assert.equal(page.pixels.readUInt32BE(atlasAt), src.pixels.readUInt32BE(sourceAt), `${entry.assetId}: atlas pixel mismatch`);
    } else assert.equal(page.pixels[atlasAt + 3], 0, `${entry.assetId}: non-transparent frame padding`);
  }
}
// Every unassigned cell must be completely transparent.
for (const [pageNumber, page] of pages) {
  const used = new Set(metadata.sprites.filter(s => s.page === pageNumber).map(s => s.slot % 64));
  for (let y = 0; y < page.height; y++) for (let x = 0; x < page.width; x++) {
    const cell = Math.floor(y / 64) * 8 + Math.floor(x / 64);
    if (!used.has(cell)) assert.equal(page.pixels[(y * page.width + x) * 4 + 3], 0, 'Unused cell is not transparent');
  }
}
console.log(`Tactical atlas validated: ${metadata.sprites.length} sprites, ${metadata.pages.length} page(s), stable slots and source-identical pixels.`);
