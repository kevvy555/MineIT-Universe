# MineIT Universe Generation Architecture

## Purpose

The canonical Koplin Universe is the first materialised MineIT universe. It is authored, lore-led and persistent, but the data model must also support future universes whose structural graph is generated deterministically from a seed.

Games must not care how a universe was authored. They consume the same manifest, logical collections and stable-ID graph whether a universe was manually authored, deterministically generated, AI-enriched, or produced through a mixture of those techniques.

## Materialised-universe principle

A published universe is always materialised data.

```text
Authored facts ───────────────┐
                              ├─> materialised JSON graph ─> games / Directory
Seeded structural generator ──┤
                              │
AI enrichment ────────────────┘
```

A game never asks an AI to regenerate canon at runtime. AI-generated descriptions, biographies, prompts and other enrichments are frozen into the materialised universe once authored.

The manifest `generation` block records how the published universe was produced.

### Authored canonical universe

```json
"generation": {
  "mode": "authored-materialised",
  "materialised": true,
  "seed": null,
  "generatorVersion": null
}
```

### Future generated universe

```json
"generation": {
  "mode": "generated-materialised",
  "materialised": true,
  "seed": 834723,
  "generatorVersion": "1.0"
}
```

A generated universe must retain both seed and generator version because a later generator version may legitimately produce a different universe from the same numeric seed.

## Deterministic generation owns structure

A future generator is expected to determine reproducible structural facts such as:

- regions and star systems;
- stars, planets and moons;
- names from deterministic naming systems;
- settlements and infrastructure;
- organisations and organisation hierarchies;
- economic sectors and industrial specialisation;
- facilities and operations;
- persistent people and their organisational assignments;
- ship names, classes, operators and fleets;
- projects, relationships and historical event skeletons;
- structural resource requirements and other causal economic links.

The generator should create causal graphs rather than isolated filler records.

## AI enrichment owns rich authored content

AI may enrich deterministic structure with material that ordinary algorithms are poor at creating, including:

- biographies;
- company histories;
- descriptive prose;
- event narratives;
- visual descriptions;
- image-generation prompts;
- nuanced organisational character and cultural detail.

These outputs are stored in the resulting universe. They are not expected to be bit-for-bit reproducible solely from the seed.

## Entity provenance

Records created from generated or legacy source material should retain provenance when useful.

Example:

```json
"provenance": {
  "origin": "legacy-deterministic-source",
  "sourceId": "generation-source-legacy-buyer-directory",
  "sourceRecordKey": "buyer-0042",
  "sourceSeed": 8302026,
  "materialisation": "ai-authored-reconciliation"
}
```

Provenance explains where an entity came from. It does not reduce the entity to a procedural placeholder once materialised: a materialised person is a persistent person in that universe.

## Stable identity

Stable IDs are graph identity, not display labels. Future generated universes may use seed-neutral or seed-qualified IDs such as `person-u834723-000472`; the current authored Koplin IDs remain valid and do not require migration merely to support future generation.

Games must never treat names as foreign keys.

## Logical collection sharding

Schema 5 permits a manifest collection entry to be either a single file or an array of files.

```json
"people": [
  "people.json",
  "people-commercial-01.json",
  "people-commercial-02.json"
]
```

The loader merges all shards into one logical collection before building the Universe graph. This means thousands of generated people, organisations or operations can be stored in manageable files without changing the consumer API.

Sharding is physical storage only. It must never create parallel canonical datasets.

## Reusable visual assets

An entity identity and its artwork are conceptually separate.

The first implementation uses an identity-neutral commercial portrait series:

```text
visual-person-portrait-0001
  -> assets/art/visual-library/people/portrait-0001.webp
```

In the canonical Koplin Universe that portrait can depict one named person. In a different generated universe the same visual asset may depict a completely different person.

Reusable images must therefore avoid baked-in identity data such as:

- person names;
- company names;
- readable corporate logos;
- ship registration numbers;
- system names;
- universe-specific written labels.

Bespoke canonical artwork remains allowed where reuse is not a goal.

## Legacy deterministic sources

Legacy generators are retained as explicit `generationSources` records when their algorithms or vocabularies remain useful. Their outputs are not automatically canon.

The Stage 8 1,000-buyer generator is the first example. Useful elements include name generation, industry taxonomy, procurement-role taxonomy and portrait traits. Invalid assumptions such as one buyer per company, fake home strings, buyer reputation tiers and permanent buyer-to-ship pairing are deliberately discarded during materialisation.

## Compatibility rule

The current authored Koplin Universe remains the primary canon. Future generator work must target the schema and output materialised JSON rather than forcing the current canon to become procedural.

This allows MineIT to build the rich static Universe first without creating a later rewrite requirement.
