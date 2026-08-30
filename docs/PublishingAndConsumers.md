# Publishing and Consumer Contract

## GitHub Pages

Publish the repository from `main` / root using GitHub Pages.

Expected public site:

```text
https://kevvy555.github.io/MineIT-Universe/
```

Expected bootstrap endpoint:

```text
https://kevvy555.github.io/MineIT-Universe/data/manifest.json
```

The root `index.html` is the standalone Universe Directory. `.nojekyll` ensures the repository is served as a plain static application without Jekyll processing.

## Canonical consumer flow

Applications should start from the manifest rather than hardcoding every collection path.

```js
const universeBase = 'https://kevvy555.github.io/MineIT-Universe/data/';
const manifest = await fetch(`${universeBase}manifest.json`).then(response => {
  if (!response.ok) throw new Error(`Universe manifest failed: ${response.status}`);
  return response.json();
});

const people = await fetch(`${universeBase}${manifest.collections.people}`).then(response => response.json());
```

MineIT Mobile should wrap this behind a dedicated loader/catalogue rather than scattering network calls through gameplay services.

## Cross-origin browser access

The Universe repository is intended to be public static content. MineIT Mobile may be hosted on a different HTTPS origin and use ordinary browser `fetch()` GET requests to read the public Pages JSON.

Keep consumer requests simple GETs. If the shared universe later requires authenticated writes, dynamic state or custom CORS/security headers, move that responsibility to an API/service rather than trying to turn GitHub Pages into a backend.

## Versioning

Consumers must read:

- `schemaVersion` — compatibility of the JSON contract;
- `contentVersion` — published universe content release.

A game should reject or migrate an unsupported `schemaVersion` deliberately.

## Offline/reproducible game behaviour

The standalone Directory can always display the latest published universe.

Games should eventually maintain a bundled or cached known-good snapshot so gameplay does not require a live connection. Cached/bundled files are derived copies only; canonical authoring remains in this repository.

Recommended game behaviour:

1. load bundled/cached compatible universe;
2. when online, inspect the published manifest;
3. download/cache a newer compatible content version where appropriate;
4. persist stable entity IDs in save state;
5. optionally record the universe content version associated with a save.

## Stable IDs

Cross-game identity is based on stable IDs, not names.

For example, all MineIT applications that resolve:

```text
person-talia-chen
```

are referring to the same canonical Talia Chen, even if her role, biography or portrait is updated in a later content release.
