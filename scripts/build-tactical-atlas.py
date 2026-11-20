#!/usr/bin/env python3
"""Build deterministic tactical texture pages from the Universe tactical catalog.

Slot assignments are explicit and stable. A 64 px cell contains the unscaled
source PNG centred in transparent padding. Pillow is needed only to build art;
the committed output can be validated without Pillow by the Node validator.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / 'assets/art/universe/tactical/atlas'
ASSET_FILE = ROOT / 'data/mobile-tactical-assets.json'
SLOT_FILE = ROOT / 'game-specs/mineit-mobile/tactical-atlas-slots.json'


def load_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def rect(x, y, width, height):
    return {'x': x, 'y': y, 'width': width, 'height': height}


def build_atlas(assets, layout, output: Path, atlas_size=512, source_root=ROOT):
    if atlas_size not in (512, 1024):
        raise ValueError('Atlas size must be 512 or 1024')
    if layout.get('formatVersion') != 1 or layout.get('slotSize') != [64, 64]:
        raise ValueError('Unsupported slot layout')
    slots = layout['slots']
    reserved = layout.get('reservedSlots', [])
    identifiers = [item['id'] for item in assets]
    if len(set(identifiers)) != len(identifiers) or set(slots) != set(identifiers):
        raise ValueError('Slot assignments must match the tactical asset IDs exactly')
    indices = list(slots.values()) + reserved
    if any(type(value) is not int or value < 0 for value in indices) or len(set(indices)) != len(indices):
        raise ValueError('Slot assignments and reservations must be unique non-negative integers')
    if not assets:
        raise ValueError('Cannot build an empty atlas')
    output.mkdir(parents=True, exist_ok=True)
    columns = atlas_size // 64
    capacity = columns * columns
    pages = {}
    entries = []
    for item in sorted(assets, key=lambda value: slots[value['id']]):
        slot = slots[item['id']]
        page_number, page_slot = divmod(slot, capacity)
        page = pages.setdefault(page_number, Image.new('RGBA', (atlas_size, atlas_size)))
        fx, fy = (page_slot % columns) * 64, (page_slot // columns) * 64
        source = source_root / item['smallImageKey']
        raw = source.read_bytes()
        with Image.open(source) as opened:
            image = opened.convert('RGBA')
        if list(image.size) != item['smallSize'] or image.width > 32 or image.height > 32:
            raise ValueError(f"Invalid source dimensions: {item['id']}")
        if image.getchannel('A').getbbox() is None:
            raise ValueError(f"Transparent source: {item['id']}")
        x, y = fx + (64 - image.width) // 2, fy + (64 - image.height) // 2
        page.paste(image, (x, y))
        filename = f'tactical-atlas-{page_number}.png'
        kind = item['assetType']
        badge_level = int(item['id'].rsplit('-', 1)[-1]) if kind == 'level-badge' else None
        orientation = item.get('orientation') or ('screen-upright overlay' if kind == 'level-badge' else 'screen-upright symbol')
        entry = {
            'assetId': item['id'], 'entityId': item.get('entityId'), 'name': item['name'],
            'assetType': kind, 'variant': 'level-badge' if badge_level else 'base',
            'level': badge_level, 'supportedLevels': [1, 2, 3, 4, 5] if kind == 'building-symbol' else [],
            'sourceImage': item['smallImageKey'], 'sourceSha256': hashlib.sha256(raw).hexdigest(),
            'slot': slot, 'page': page_number, 'atlas': filename,
            'frame': rect(fx, fy, 64, 64), 'sprite': rect(x, y, image.width, image.height),
            'uvEdges': [x / atlas_size, y / atlas_size, (x + image.width) / atlas_size, (y + image.height) / atlas_size],
            'uvTexelCenters': [(x + .5) / atlas_size, (y + .5) / atlas_size,
                               (x + image.width - .5) / atlas_size, (y + image.height - .5) / atlas_size],
            'orientation': orientation, 'anchor': [0.5, 0.5],
        }
        entries.append(entry)
    atlas_paths = []
    for number, page in sorted(pages.items()):
        filename = f'tactical-atlas-{number}.png'
        page.save(output / filename, format='PNG', optimize=False, compress_level=9)
        atlas_paths.append({'page': number, 'file': filename, 'width': atlas_size, 'height': atlas_size,
                            'sha256': hashlib.sha256((output / filename).read_bytes()).hexdigest()})
    metadata = {
        'formatVersion': 1, 'name': 'MineIT Mobile tactical symbols',
        'atlasSize': [atlas_size, atlas_size], 'frameSize': [64, 64], 'slotCapacityPerAtlas': capacity,
        'origin': 'top-left', 'alpha': 'straight', 'slotsFile': 'game-specs/mineit-mobile/tactical-atlas-slots.json',
        'pages': atlas_paths,
        'levelOverlay': {'mode': 'separate-sprite', 'badgeSize': [13, 13], 'baseSize': [32, 32],
                         'topLeftOnBase': [19, 19], 'levels': {str(i): f'tactical-level-{i}' for i in range(1, 6)}},
        'sampling': 'Use sprite rectangles or texel-centre UVs with linear filtering; avoid whole-atlas mipmaps without per-sprite isolation.',
        'sprites': entries,
    }
    (output / 'tactical-atlas.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    lines = ['# MineIT Mobile tactical sprite atlas', '',
             'Coordinates are pixels from the top left. Each 64 × 64 frame includes transparent padding; the sprite rectangle is the unscaled source image. Level badges are separate overlays.', '',
             '| Slot | Tactical asset ID | Canonical entity ID | Level | Source image | Atlas | Frame X,Y | Sprite X,Y | Sprite size | Orientation | Anchor |',
             '|---:|---|---|---:|---|---|---|---|---|---|---|']
    for e in entries:
        f, s = e['frame'], e['sprite']
        lines.append(f"| {e['slot']} | `{e['assetId']}` | {('`' + e['entityId'] + '`') if e['entityId'] else '—'} | {e['level'] if e['level'] is not None else '—'} | `{e['sourceImage']}` | {e['atlas']} | {f['x']}, {f['y']} | {s['x']}, {s['y']} | {s['width']} × {s['height']} | {e['orientation']} | centre |")
    (output / 'tactical-atlas.md').write_text('\n'.join(lines) + '\n', encoding='utf-8', newline='\n')
    # Review sheet is deliberately derived from the same source pixels, not new art.
    font = ImageFont.load_default()
    width, cell_h, cols = 1000, 128, 4
    sheet = Image.new('RGB', (width, ((len(entries) + cols - 1) // cols) * cell_h), '#27343c')
    draw = ImageDraw.Draw(sheet)
    for i, e in enumerate(entries):
        px, py = (i % cols) * 250, (i // cols) * cell_h
        source = Image.open(source_root / e['sourceImage']).convert('RGBA')
        preview = source.resize((source.width * 2, source.height * 2), Image.Resampling.NEAREST)
        sheet.paste(preview, (px + (250 - preview.width) // 2, py + 6), preview)
        draw.text((px + 6, py + 76), e['name'], font=font, fill='white')
        draw.text((px + 6, py + 96), f"slot {e['slot']}  {e['sprite']['width']}x{e['sprite']['height']}", font=font, fill='#bbcbd0')
    sheet.save(output / 'tactical-atlas-contact-sheet.png')
    # Inspect readability against three real Universe terrain materials at three
    # marker sizes. Badges are overlaid independently on building samples.
    terrain_root = source_root / 'assets/art/visual-library/terrain/materials'
    terrain_names = ('grassland', 'desert', 'barren-rock')
    backgrounds = [Image.open(terrain_root / f'visual-terrain-material-{name}-01.webp').convert('RGB').resize((256, 256), Image.Resampling.LANCZOS) for name in terrain_names]
    preview_sheet = Image.new('RGB', (1080, 55 + len(entries) * 58), '#17242b')
    text = ImageDraw.Draw(preview_sheet)
    text.text((8, 8), 'Size comparison on Universe terrain: grassland / desert / rock', font=font, fill='white')
    for column, size in enumerate((24, 32, 48)):
        text.text((190 + column * 290, 28), f'{size} px marker', font=font, fill='white')
    for row, entry in enumerate(entries):
        top = 51 + row * 58
        text.text((8, top + 19), entry['name'].replace(' tactical symbol', '').replace(' tactical badge', ' badge'), font=font, fill='white')
        source = Image.open(source_root / entry['sourceImage']).convert('RGBA')
        if entry['assetType'] == 'building-symbol':
            badge_id = f'tactical-level-{row % 5 + 1}'
            badge_entry = next((e for e in entries if e['assetId'] == badge_id), None)
            if badge_entry is not None:
                badge = Image.open(source_root / badge_entry['sourceImage']).convert('RGBA')
                source.alpha_composite(badge, (19, 19))
        for column, size in enumerate((24, 32, 48)):
            scaled = max(1, round(size * source.width / 32))
            image = source.resize((scaled, scaled), Image.Resampling.LANCZOS)
            for terrain_index, ground in enumerate(backgrounds):
                x = 190 + column * 290 + terrain_index * 95
                patch = ground.crop((48, 48, 138, 104))
                preview_sheet.paste(patch, (x, top))
                preview_sheet.paste(image, (x + (90 - scaled) // 2, top + (56 - scaled) // 2), image)
    preview_sheet.save(output / 'tactical-atlas-terrain-comparison.png')
    return metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--size', type=int, choices=(512, 1024), default=512)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    metadata = build_atlas(load_json(ASSET_FILE), load_json(SLOT_FILE), args.output, args.size)
    print(f"Built {len(metadata['sprites'])} tactical sprites in {len(metadata['pages'])} page(s).")


if __name__ == '__main__':
    main()
