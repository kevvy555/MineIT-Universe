# UNI-COM-002 — Commercial Contact Identity and Game-Generated Offers

**Owner:** Universe commercial semantics · **Status:** source-backed shared **canonical ownership boundary**, not a universal trading algorithm or a claim of current game behaviour · **Reviewed:** 14 October 2026.

**Original source reviewed in full and preserved:** [Commercial Buyer Model](../../CommercialBuyerModel.md) (UNI-SRC-006). Related [corporate ownership](01-corporations-and-ownership.md), [canonical source authority](../DESIGN_AUTHORITY.md), [Mobile contract/reputation owner](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/commerce-and-contracts/README.md).

## Persistent identity is not an offer

A **buyer** is a *game-facing role*, never a second canonical Universe record type. Stable commercial identity comes through `Person → Organisation → Operation → Resource requirements`. A person is eligible to supply game offers through `commercialProfile.canSourceGameOffers: true` together with their linked procurement operations. **Do not author `buyers.json`** or one-to-one permanent `buyer ↔ company ↔ collection ship` records.

Universe owns the person's stable ID, employer and location, procurement role, persistent biography/visual identity, an operation's resource/quality preference, structural importance and **causal reason for demand**. Those are discoverable graph facts, not the transaction quote. The consuming game's market and save own buyer visibility/unlocks, player reputation thresholds, current resource offer, delivery quantity, price, collection interval, satisfaction/misses, termination/cooldown, contract history and assigned collection vessel.

A consuming game derives eligible offers by:
1. traversing canonical contacts and linked procurement operations;
2. selecting the operation's structural required resources;
3. intersecting them with the game's supported resource catalogue and available unlocks;
4. applying game-specific market, reputation, fulfilment and balance rules;
5. persisting the **canonical person ID plus operation ID** alongside mutable contract terms.

This is a **design derivation boundary**, not an assertion that Android/Desktop currently run the exact same algorithm.

## Legacy identity reconciliation

The old Stage 8 source deterministically generated **1,000** potential identities (seed `8302026`); first materialisation retained **100** commercial contacts as real people with canonical employer, work/home location and one of three source-canonical Koplin peoples. These numbers describe a materialisation milestone, **not a guaranteed live count**; validate latest manifest collections before publishing counts as current.

Preserve usable provenance: generated names/portrait descriptors, **20** economic-sector vocabularies, procurement roles, sector resource affinities, possible company and ship name vocabulary. Once a deterministic candidate is materialised into a particular Universe graph, it becomes a persistent person, not a reusable disposable buyer name.

**Explicitly reject** historical assumptions that generated fake home strings are real locations, every contact represents a unique company, a person owns an immutable `typicalQuality`/player reputation threshold or fixed Entry/Regional/Major/Strategic/Premier tier, and all buyers own a permanently paired collection ship. Legacy fallback resource selection is not structural canon.

Economic sectors are stable `economicSectors` identities with an anchor organisation and procurement role; the operation owns resource-specific requirements (importance, demand scale, quality and reason). For instance, shipbuilding can structurally need reactive/conductive/magnetic ores and precious catalysts without canonising a game's current unit price or shipment size.

## Collection, sharding and art

Collection capacity and route depend on a particular live order, cargo, range, berth and available employer/logistics-partner/third-party carrier. A small high-value lot and major industrial shipment may use different vessels for the same contact. **Do not put vessel assignment into canonical person identity.**

Manifest-defined shards for people/operations form logical collections, not separate buyer namespaces. Identity-neutral reusable portrait assets (`visual-asset-series.json`) must not bake person/company names into pixels; reusing the visual does not reuse the person's ID.

## Verification and open scope

Check current `data/manifest.json` / shards, person→organisation→operation references, `economicSectors` and `commercialProfile` values before reporting exact published contacts. Each game must separately test stable identity persistence, offer eligibility, mutable term isolation and logistics assignments. Cross-game offer calculation/stock/market contracts and exact reputation/quality rules remain **platform-owned or OPEN** until approved. Original source remains authoritative for its documented decision history; canonical graph/data and lore retain higher authority.
