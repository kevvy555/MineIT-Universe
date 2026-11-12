#!/usr/bin/env python3
"""Derive five seamless viewing scales from each canonical terrain material."""

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
COLLECTION = ROOT / "data/terrain-materials.json"
SPANS_METRES = [6.25, 25, 100, 400, 1600]
TILE_SIZE = 512
GUTTER = 4
INNER_SIZE = TILE_SIZE - 2 * GUTTER
ATLAS_SIZE = (3 * TILE_SIZE, 2 * TILE_SIZE)


def periodic_noise(size: int, seed: int, frequency: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    coordinates = np.arange(size, dtype=np.float32) / size * (2 * np.pi)
    x, y = np.meshgrid(coordinates, coordinates)
    noise = np.zeros((size, size), dtype=np.float32)
    amplitude = 0.0
    for order in range(1, 4):
        for axis_x, axis_y in ((order, 0), (0, order), (order, order), (order, -order)):
            weight = 1.0 / order
            phase = rng.uniform(0.0, 2 * np.pi)
            noise += weight * np.sin(frequency * (axis_x * x + axis_y * y) + phase)
            amplitude += weight
    return noise / amplitude


def macro_tile(source: np.ndarray, seed: int, frequency: int, strength: float) -> Image.Image:
    pixels = source.reshape(-1, 3).astype(np.float32)
    mean = pixels.mean(axis=0)
    covariance = np.cov(pixels, rowvar=False)
    values, vectors = np.linalg.eigh(covariance)
    principal = vectors[:, -1] * np.sqrt(max(values[-1], 0.0))
    secondary = vectors[:, -2] * np.sqrt(max(values[-2], 0.0))
    broad = periodic_noise(INNER_SIZE, seed, frequency)
    detail = periodic_noise(INNER_SIZE, seed + 971, frequency * 2)
    colour = mean + strength * (broad[..., None] * principal + 0.5 * detail[..., None] * secondary)
    return Image.fromarray(np.clip(colour, 0, 255).astype(np.uint8), "RGB")


def tile_with_gutter(image: Image.Image) -> Image.Image:
    pixels = np.asarray(image, dtype=np.uint8)
    wrapped = np.pad(pixels, ((GUTTER, GUTTER), (GUTTER, GUTTER), (0, 0)), mode="wrap")
    return Image.fromarray(wrapped, "RGB")


def build(material: dict) -> None:
    source_path = ROOT / material["image"]["key"]
    source = Image.open(source_path).convert("RGB").resize((INNER_SIZE, INNER_SIZE), Image.Resampling.LANCZOS)
    source_pixels = np.asarray(source, dtype=np.float32)
    seed = int.from_bytes(hashlib.sha256(material["id"].encode()).digest()[:8], "little")
    near = ImageEnhance.Sharpness(source).enhance(1.2)
    regional = macro_tile(source_pixels, seed, 2, 2.2)
    broad = macro_tile(source_pixels, seed + 1, 1, 2.8)
    hundred = Image.blend(source.filter(ImageFilter.GaussianBlur(18)), regional, 0.65)
    tiles = [near, source, hundred, regional, broad]
    atlas = Image.new("RGB", ATLAS_SIZE)
    for level, image in enumerate(tiles):
        atlas.paste(tile_with_gutter(image), ((level % 3) * TILE_SIZE, (level // 3) * TILE_SIZE))
    atlas.paste(tile_with_gutter(broad), (2 * TILE_SIZE, TILE_SIZE))

    stem = Path(material["image"]["key"]).stem + "-lod"
    folder = ROOT / "assets/art/visual-library/terrain/materials"
    published = folder / f"{stem}.webp"
    original = folder / "Originals" / f"{stem}.png"
    original.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(original, format="PNG", optimize=True)
    atlas.save(published, format="WEBP", quality=91, method=6)
    material["lodAtlas"] = {
        "levelRepeatMetres": SPANS_METRES,
        "tilePixelSize": TILE_SIZE,
        "gutterPixels": GUTTER,
        "atlasPixelSize": list(ATLAS_SIZE),
        "originalPath": original.relative_to(ROOT).as_posix(),
        "generationScript": "scripts/build_terrain_lod_atlases.py",
        "sourceImageKey": material["image"]["key"],
        "image": {
            "key": published.relative_to(ROOT).as_posix(),
            "generated": True,
            "status": "generated",
            "promptDescription": "Five seamless material scales derived deterministically from the canonical source: fine 6.25 m, local 25 m, regional 100 m, broad 400 m, and orbit-view 1600 m.",
            "notes": "The three broadest scales use periodic palette-preserving colour variation; the lossless atlas original is stored beside the published WebP.",
        },
    }
    print(f"{material['biomeId']}: {published.stat().st_size:,} bytes")


def main() -> None:
    materials = json.loads(COLLECTION.read_text(encoding="utf-8"))
    for material in materials:
        build(material)
    COLLECTION.write_text(json.dumps(materials, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
