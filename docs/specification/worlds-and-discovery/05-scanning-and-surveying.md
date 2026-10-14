# UNI-WORLD-005 — Scanning, Surveying and Discovery Semantics

**Status:** shared concept synthesis; numerical algorithms per platform. **Sources:** [Universe World Surface](../../../data/lore/Koplin_Universe_World_Surface.md), [Mobile persistent galaxy model](https://github.com/kevvy555/MineIT-Android/blob/develop/docs/migration/Overhaulv0.1/PERSISTENT_GALAXY_GENERATION_MODEL.md), [Desktop core loop](https://github.com/kevvy555/MineIT-Desktop/blob/main/Documentation/design/HighLevel/core-loop.md), [Desktop generation pipeline](https://github.com/kevvy555/MineIT-Desktop/blob/main/Documentation/design/Generation/CelestialBodyGeneration/GenerationPipeline.md).

## Three separable layers

1. **Physical state**: authored/generative celestial body, environment, actual deposits or biological sources, reserve and formation. Existing before discovery.
2. **Knowledge**: who knows what and with what confidence? Public survey, company survey, player scans, local sample analysis. Each is a view of the same physical truth.
3. **Action**: how the game reveals/investigates it. Desktop can use high-detail surveying/sampling and property analysis; Mobile uses fast map scans, selectable sectors and persistent knowledge levels.

A contract survey estimate is not an omniscient guarantee. A scanner upgrade can reveal an existing deeper deposit but must not reroll the planet to produce a required reward. Discovery and depletion are state transitions, not canon rewrites.

## Physical suitability remains upstream

A scanner can classify substances only where the environment/body type permits them. Compatible extraction method and appropriate infrastructure are distinct from merely discovering an occurrence.

## Implementation differences

- Desktop: granular sample groups, individual sample analysis, terrain-/depth-aware world and discovery.
- Mobile: multi-sector touch surveying/queue, charters tied to existing world truth, deterministic local sector scanning and depth progression.
- Universe: no player-specific scan coverage or runtime probability, only authored material/environment rules.

**Open:** cross-platform stable terminology for certainty, survey provenance, hazard grading and confidence; no mandatory identical scanner-count or detection formula.
