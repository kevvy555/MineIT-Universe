"""Focused regression tests for stable tactical atlas generation."""
import copy
import hashlib
import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('tactical_atlas', ROOT / 'scripts/build-tactical-atlas.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
ASSETS = builder.load_json(builder.ASSET_FILE)
LAYOUT = builder.load_json(builder.SLOT_FILE)


class TacticalAtlasTests(unittest.TestCase):
    def test_complete_catalog_and_deterministic_output(self):
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            meta = builder.build_atlas(ASSETS, LAYOUT, Path(a))
            builder.build_atlas(ASSETS, LAYOUT, Path(b))
            self.assertEqual(len(meta['sprites']), 32)
            self.assertEqual([meta['atlasSize'], meta['frameSize']], [[512, 512], [64, 64]])
            self.assertEqual({entry['assetId'] for entry in meta['sprites']}, {item['id'] for item in ASSETS})
            for name in ('tactical-atlas-0.png', 'tactical-atlas.json', 'tactical-atlas.md', 'tactical-atlas-contact-sheet.png', 'tactical-atlas-terrain-comparison.png'):
                digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
                self.assertEqual(digest(Path(a) / name), digest(Path(b) / name), name)
                self.assertEqual(digest(Path(a) / name), digest(builder.DEFAULT_OUTPUT / name), name + ' committed output is stale')
            by_id = {item['assetId']: item for item in meta['sprites']}
            self.assertEqual(by_id['tactical-vehicle-haulage-truck']['entityId'], 'machine-haulage-truck')
            self.assertEqual(by_id['tactical-machine-exploration-vehicle']['entityId'], 'machine-exploration-vehicle')
            self.assertIn('heading convention not established', by_id['tactical-machine-exploration-vehicle']['orientation'])
            for level in range(1, 6):
                self.assertEqual(by_id[f'tactical-level-{level}']['level'], level)

    def test_expansion_and_multiple_pages_preserve_slots(self):
        assets = ASSETS[:2]
        slots = {assets[0]['id']: 0, assets[1]['id']: 64}
        layout = {'formatVersion': 1, 'slotSize': [64, 64], 'slots': slots, 'reservedSlots': []}
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            small = builder.build_atlas(assets, layout, Path(a), 512)
            large = builder.build_atlas(assets, layout, Path(b), 1024)
            self.assertEqual([entry['slot'] for entry in small['sprites']], [0, 64])
            self.assertEqual([entry['slot'] for entry in large['sprites']], [0, 64])
            self.assertEqual([entry['page'] for entry in small['sprites']], [0, 1])
            self.assertEqual([entry['page'] for entry in large['sprites']], [0, 0])
            self.assertTrue((Path(a) / 'tactical-atlas-1.png').is_file())
            self.assertEqual(large['sprites'][1]['frame']['y'], 256)

    def test_missing_assets_and_invalid_slots_fail_closed(self):
        assets = copy.deepcopy(ASSETS[:2]); layout = {'formatVersion': 1, 'slotSize': [64, 64],
            'slots': {assets[0]['id']: 0, assets[1]['id']: 1}, 'reservedSlots': []}
        with tempfile.TemporaryDirectory() as directory:
            assets[0]['smallImageKey'] = 'no-such-image.png'
            with self.assertRaises(FileNotFoundError): builder.build_atlas(assets, layout, Path(directory))
            duplicate = copy.deepcopy(layout); duplicate['slots'][assets[1]['id']] = 0
            with self.assertRaisesRegex(ValueError, 'unique'): builder.build_atlas(assets, duplicate, Path(directory))
            reserved = copy.deepcopy(layout); reserved['reservedSlots'] = [0]
            with self.assertRaisesRegex(ValueError, 'unique'): builder.build_atlas(assets, reserved, Path(directory))
            missing = copy.deepcopy(layout); del missing['slots'][assets[1]['id']]
            with self.assertRaisesRegex(ValueError, 'match'): builder.build_atlas(assets, missing, Path(directory))


if __name__ == '__main__':
    unittest.main()
