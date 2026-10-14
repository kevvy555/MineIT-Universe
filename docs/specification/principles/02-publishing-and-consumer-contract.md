# UNI-PRN-002 — Universe Publication, Versioning and Game Consumer Boundary

**Owner:** Universe publishing/integration · **Status:** original architecture rules reviewed; **consumer recommendation** separated from required canon/identity ownership · **Reviewed:** 14 October 2026.

**Source reviewed completely and retained:** [Publishing and Consumer Contract](../../PublishingAndConsumers.md) (UNI-SRC-014). Companion: [source authority](../DESIGN_AUTHORITY.md); [Android bundled catalogue boundary](https://github.com/kevvy555/MineIT-Android/blob/docs/industrial-design-spec-114/docs/specification/architecture/05-universe-data-integration.md). No Pages deployment or code was changed in this documentation commit.

## Authoritative publication

Universe's original publication contract targets GitHub Pages from `main` at repository root, with a standalone Directory at `index.html` and `.nojekyll` for non-Jekyll static serving. **Expected published bootstrap path:** `https://kevvy555.github.io/MineIT-Universe/data/manifest.json`. This is an *expected endpoint from the original contract*, not a fresh uptime/deployment verification.

Consumers read the **manifest first** and discover collection files/shards through its declarations; never maintain a manually authored shadow collection manifest or independent production entity dataset in a game. Parse `schemaVersion` separately from `contentVersion`: the former determines structural compatibility (reject or intentionally migrate unsupported schemas), and the latter identifies the canonical content release.

For a browser-based Directory or cross-origin public reader, ordinary HTTPS GET access to public Pages JSON is appropriate; do not attempt authenticated writes, dynamic persistence or custom security/CORS headers on static Pages. Move such future capabilities behind a separately designed service/API.

## Games, offline state and identities

Shared invariant: games refer to persistent objects by stable **IDs, never mutable display names**. A saved person ID refers to the same person when role, portrait or employer description evolves in a later content version. Mutable player contracts, deposits and colony states **never** write back to `data/`.

The historic source proposes this *consumer policy*, not a mandatory live-network update model: start with compatible bundled/cached content; optionally inspect newer online manifest; download/cache a compatible content version; persist stable entity IDs; optionally record the content version associated with a save. **Android's later approved build-pinned, offline-capable snapshot contract is the controlling platform policy**; do not let this older optional-update sequence silently override the currently locked mobile bundle or pin. Desktop similarly chooses its integration and upgrade policy separately.

The original source also states that a Mobile world with `landscapeTilesetId` should resolve its **world-specific 1:1 landform/biome tiles**, not generic grass/mountain art. Asset discovery remains via canonical ID-keyed paths and manifests. Whether a consumer already implements this must be separately verified.

## Traceability and validation

Before promoting any claim to `IMPLEMENTED`, check actual Pages routing, manifest/schema and shard loading, failure behavior, pinned build metadata/offline startup, ID resolution, asset keys, and save-version compatibility on a named commit/release. This chapter does not replace either game's data adapter, and does not approve runtime network fallback during gameplay.
