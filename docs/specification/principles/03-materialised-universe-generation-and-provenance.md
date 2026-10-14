# UNI-PRN-003 — Materialised Universe, Seeded Structure and Provenance

**Owner:** MineIT-Universe generation architecture and canonical publication · **Source:** [Universe Generation Architecture](../../UniverseGenerationArchitecture.md) (UNI-SRC-019, reviewed in full on 14 October 2026). **Authority:** architecture policy for authored/materialised identities, subordinate to [lore and canon precedence](../DESIGN_AUTHORITY.md); **Implementation:** latest producer/consumer runtime unverified.

## One published graph, regardless of authoring technique

The authored Koplin Universe is **authored-materialised**. Future universes may be **generated-materialised**; they still publish concrete stable-ID records into the **same** manifest-backed collections and graph. No game or Directory asks AI to regenerate canon at runtime. Generated relationships are frozen before publication; AI-written prose and visual prompts are authored enrichment of the frozen graph, not deterministic game-day facts.

The source specifies the manifest `generation` contract:

| Mode | Materialised | Seed | Generator version |
| --- | --- | --- | --- |
| Current Koplin `authored-materialised` | `true` | `null` | `null` |
| Future `generated-materialised` | `true` | mandatory deterministic value | mandatory explicit version |

`generatorVersion` matters because equal seeds under different algorithms need not produce identical structures. These are **source-defined examples and a target interface**, not permission to rename or overwrite the present manifest.

## What determinism may construct

The structural generator, not AI narration, controls reproducible star systems/bodies, regions/settlements, facility/infrastructure hierarchy, organisations and sector specialisms, economic operations and causal resource requirements, people and assignments, vessel ownership, projects/events skeletons and their graph relationships. Avoid numeric-target filler that cannot connect causally to the rest of the universe.

AI enrichment may add biographies, event and organisation narratives, cultural detail, descriptions, identity-neutral image prompts and other rich authored text. These outputs are persisted with the materialised entities; **bit-for-bit prompt reproducibility from the seed is not promised**. Once materialised, the entity is durable, not a temporary generated candidate.

## IDs, provenance, sharding

Persistent stable IDs — not names — bind relationships. Future IDs may be seed-qualified (e.g. `person-u834723-000472`); existing Koplin IDs stay untouched. For legacy-derived objects retain provenance when useful: `origin`, `sourceId`, `sourceRecordKey`, `sourceSeed`, and `materialisation`. Provenance is historical evidence, **not a gameplay reroll instruction**.

The original source explains manifest **schema 5** allowing a collection to be one JSON file or an array of shards. Every shard with one collection name is **one logical dataset**; loaders merge shards before resolving IDs. Shards are not new independently authoritative people/companies collections. The schema-5 reference is source-era provenance: check the **current** manifest/schema and consumer pin before presenting it as latest.

`generationSources` may retain source algorithms/vocabularies without canonising raw outputs. Historical Stage-8's 1,000 candidate buyers supply name, sector, procurement and portrait vocabularies; discarded assumptions include fictitious home locations, permanent buyer/ship pairs, automatic one-to-one companies and buyer tier/status attributes. Actual materialised procurement contacts are canonical people under [UNI-COM-002](../commerce-and-corporations/02-commercial-contacts-and-offers.md), **not** another `buyers.json`.

Reusable `visualAssetSeries` graphics are identity-neutral; a portrait can be assigned to different stable people in different universes. Do not bake person/company names, system text, registration numbers or readable identity logos into reusable art. Bespoke identity-bearing artwork remains permissible and Universe-owned.

## Platform scope and acceptance

Universe owns **published authored/materialised graph** and reference vocabularies; Mobile's frontier-world generation, Desktop's sampled terrain, generated deposits, user saves, resource quality and contract terms remain their respective gameplay. A game's deterministic save seed is not proof its world was promoted to authored Universe canon.

Before claiming implemented integration, check manifest `generation`, stable-ID uniqueness across shards, provenance, seeded/versioned reproducibility, references, content consumer compatibility, and visual-library identity neutrality against latest code/data. **No generator, manifest or game state changed in this documentation batch.**
