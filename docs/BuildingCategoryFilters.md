# Building category filter presentation

`data/building-categories.json` registers stable category identities, full labels,
short text fallbacks, filter visibility and generated tactical-style artwork.
The manifest exposes this collection as `buildingCategories`.

| Full label | Text fallback |
| --- | --- |
| Command | Cmd |
| Housing | Accom |
| Industry | Ind |
| Power | Pwr |
| Processing | Proc |
| Research | Rsch |
| Resource Collection | Coll |
| Resource Extraction | Extract |
| Resource Production | Prod |
| Storage | Str |

Scenario Infrastructure, Ship Production and Space Operations are registered but
have `showInLoadoutFilter: false`. They do not get loadout category buttons.
Existing building category assignments are preserved. Consumers match a category
record's full `name` to a building's `categories` array (or primary `category`).
Buildings can therefore appear in more than one category. An All filter can
include every building independently of category-button visibility.

Filter controls use the icon first and `shortName` when it cannot be displayed;
the full name remains the accessible name and tooltip. Original transparent PNGs
and published WebPs are stored under `assets/art/universe/tactical/categories/`.
Image prompts and generation status remain in the category records. These filter
icons do not replace existing building tactical symbols or catalogue images.
