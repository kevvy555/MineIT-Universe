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


## Additional complete-source reconciliation: initial game integration plan (UNI-SRC-011)

[MineIT Universe Integration](../../MineitUniverseDatabaseIntegration.md) was **reviewed in full on 14 October 2026**. Its source status is an **architecture plan** predating newer materialised and pinned Android integration, not a guarantee that every proposed read-only catalogue query is deployed.

The historical plan established a **single read-only Universe catalogue** used by Directory and games with stable `personId`, `operationId`, `locationId`, `shipId` (and authored organisation/facility) references. Saves persist those IDs alongside **mutable** price, amount, reputation, timing, buyer satisfaction, collection ship assignment and colony facts. Do not duplicate biography, image keys, company history, logos or lore prose in save state.

The plan's proposed game-side query surface included `person(id)`, `company(id)`, `operation(id)`, `facility(id)`, `location(id)`, `ship(id)`, `peopleForCompany(companyId)`, `operationsForResource(type,id)`, `procurementContactsForOperation(id)` and `shipsForCompany(id)`. These are **illustrative consuming-application API intentions**; `company` is **not** an independent canonical collection beside Universe `organisations`, and current Kotlin/desktop APIs need independent confirmation.

Its buyer discovery chain is: compatible player resource → structurally needing **operation** → organisation/facility → procurement-responsible **person** → platform-derived saved offer/visit. It does **not** justify a second buyer catalogue, fixed offers in Universe or permanently assigning buyers to vessels. See [commercial identity spec](../commerce-and-corporations/02-commercial-contacts-and-offers.md).

The older plan recommends a configurable GitHub Pages base URL, manifest/schema/content loading, local read-only indexes, a bundled/cached offline snapshot and incremental buyer integration, while keeping current web buyer mechanics. **Later Android build-pinned/offline Universe integration takes precedence** over optional live updates and the early 'future integration' status. Canonical civilisation exists independently of each save's procedurally generated frontier worlds/deposits/claims.

The plan allows a **future shared mutable service/API** only if the wider universe itself genuinely acquires dynamic cross-game events (company promotions, wars, facility openings or player-world impacts). Even then retain two separate data concepts: immutable/reviewed canonical identity and mutable shared event/state; **GitHub Pages remains a static read-only publisher**, not a writable global simulation database.

**Review status:** all original integration-plan boundaries and examples are mapped here and to linked commerce/materialisation chapters. The original's sequential implementation checklist, example identities/ship names, endpoint and read-model methods remain **historical proposals** until actual manifest, loader, consumer tests and save ID references are verified. The original source is preserved.
