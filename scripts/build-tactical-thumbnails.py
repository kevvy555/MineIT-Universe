"""Derive the published and small tactical assets from their retained originals.

Requires Pillow with WebP support. Run from the repository root.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
items = json.loads((ROOT / 'data/mobile-tactical-assets.json').read_text(encoding='utf-8'))
for item in items:
    original = Image.open(ROOT / item['originalKey']).convert('RGBA')
    original.save(ROOT / item['image']['key'], 'WEBP', lossless=True)
    width, height = item['smallSize']
    if item['assetType'] == 'level-badge':
        small = original.resize((width, height), Image.Resampling.LANCZOS)
    else:
        threshold = 64 if item['assetType'] == 'infrastructure-symbol' else 24
        box = original.getchannel('A').point(lambda value: 255 if value >= threshold else 0).getbbox()
        if box is None:
            raise ValueError(f"Empty artwork: {item['id']}")
        original = original.crop(box)
        max_dimension = width if item['assetType'] == 'infrastructure-symbol' else width - 4
        original.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        small = Image.new('RGBA', (width, height))
        small.alpha_composite(original, ((width - original.width) // 2, (height - original.height) // 2))
    small.save(ROOT / item['smallImageKey'])
references = {item['generationReference']['originalKey']: item['generationReference']['previewKey']
              for item in items if item.get('generationReference')}
for original_key, preview_key in references.items():
    Image.open(ROOT / original_key).convert('RGBA').save(ROOT / preview_key, 'WEBP', lossless=True)
print(f'Rebuilt {len(items)} tactical image pairs and {len(references)} reference previews.')
