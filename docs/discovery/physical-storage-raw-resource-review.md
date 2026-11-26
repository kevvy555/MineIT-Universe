# Raw-resource physical property review — U02 / #35

**Status: proposals for owner approval; not canonical or runtime data.** All 42 current resource IDs reviewed. Density describes the stored resource form; no second material-density concept. Numbers are initial game-design estimates, not measured engineering specifications. Precious-metal IDs map to precious metal ore, so the density is a stored raw mineral/concentrate estimate, not pure metal density. Gemstone unit sizes are small parcels. Resource quantity and monetary value remain unchanged. Specialist resources do not participate in these buildings; uranium has a provisional mass/density for future review but must remain excluded. Liquids, compressed gas, methane ice and He-3 depend on storage state, so no arbitrary density is assigned. No live biological populations or food added.

| Resource ID | Name | kg/unit | kg/m³ | derived m³/unit | Storage |
|---|---|---:|---:|---:|---|
| mobile-resource-timber | Timber | 25 | 500 | 0.050000 | both |
| mobile-resource-plant-fibre | Plant Fibre | 10 | 180 | 0.055556 | warehouse |
| mobile-resource-stone | Construction Stone | 100 | 1700 | 0.058824 | both |
| mobile-resource-clay | Clay | 100 | 1600 | 0.062500 | both |
| mobile-resource-silica-sand | Silica Sand | 100 | 1600 | 0.062500 | both |
| mobile-resource-limestone | Limestone | 100 | 1500 | 0.066667 | both |
| mobile-resource-gypsum | Gypsum | 50 | 1250 | 0.040000 | both |
| mobile-resource-biomass | Biomass | 25 | 300 | 0.083333 | both |
| mobile-resource-peat | Peat | 25 | 400 | 0.062500 | both |
| mobile-resource-coal | Coal | 50 | 800 | 0.062500 | both |
| mobile-resource-crude-oil | Crude Oil | — | — | — | specialist / defer |
| mobile-resource-natural-gas | Natural Gas | — | — | — | specialist / defer |
| mobile-resource-hydrogen | Hydrogen | — | — | — | specialist / defer |
| mobile-resource-methane-ice | Methane Ice | — | — | — | specialist / defer |
| mobile-resource-uranium-ore | Uranium Ore | 100 | 2200 | 0.045455 | specialist |
| mobile-resource-helium-3 | Helium-3 | — | — | — | specialist / defer |
| mobile-resource-iron-ore | Iron Ore | 100 | 2500 | 0.040000 | both |
| mobile-resource-chromium-ore | Chromium Ore | 100 | 2500 | 0.040000 | both |
| mobile-resource-copper-ore | Copper Ore | 100 | 2400 | 0.041667 | both |
| mobile-resource-tin-ore | Tin Ore | 50 | 2500 | 0.020000 | both |
| mobile-resource-bauxite | Bauxite | 100 | 1300 | 0.076923 | both |
| mobile-resource-titanium-ore | Titanium Ore | 100 | 2300 | 0.043478 | both |
| mobile-resource-nickel-ore | Nickel Ore | 100 | 1900 | 0.052632 | both |
| mobile-resource-cobalt-ore | Cobalt Ore | 50 | 2200 | 0.022727 | both |
| mobile-resource-lithium-ore | Lithium Ore | 50 | 1500 | 0.033333 | both |
| mobile-resource-zinc-ore | Zinc Ore | 100 | 2200 | 0.045455 | both |
| mobile-resource-lead-ore | Lead Ore | 100 | 3000 | 0.033333 | both |
| mobile-resource-tungsten-ore | Tungsten Ore | 50 | 3000 | 0.016667 | both |
| mobile-resource-rare-earth-ore | Rare Earth Ore | 50 | 2000 | 0.025000 | both |
| mobile-resource-graphite | Graphite | 25 | 750 | 0.033333 | both |
| mobile-resource-sulfur | Sulfur | 25 | 1000 | 0.025000 | warehouse |
| mobile-resource-phosphate-rock | Phosphate Rock | 100 | 1500 | 0.066667 | both |
| mobile-resource-quartz | Quartz | 50 | 1500 | 0.033333 | both |
| mobile-resource-mica | Mica | 10 | 500 | 0.020000 | warehouse |
| mobile-resource-silver | Silver | 1 | 2500 | 0.00040000 | warehouse |
| mobile-resource-gold | Gold | 0.1 | 3000 | 0.000033333 | warehouse |
| mobile-resource-platinum | Platinum | 0.1 | 3000 | 0.000033333 | warehouse |
| mobile-resource-palladium | Palladium | 0.1 | 3000 | 0.000033333 | warehouse |
| mobile-resource-diamond | Diamond | 0.001 | 1500 | 6.6667e-7 | warehouse |
| mobile-resource-ruby | Ruby | 0.001 | 1800 | 5.5556e-7 | warehouse |
| mobile-resource-sapphire | Sapphire | 0.001 | 1800 | 5.5556e-7 | warehouse |
| mobile-resource-emerald | Emerald | 0.001 | 1400 | 7.1429e-7 | warehouse |

Compatibility: both = warehouse and stockpile; warehouse = enclosed/packaged only. Timber/fibre and high-value material should not be simulated as loose rock; timber pile is a simplified stack shape if later required, or warehouse-only until a representation exists. Sulfur is warehouse-only as packaged goods in this game; specialist safety simulation not in scope. Physical values for existing 42 rows must be approved before canonical promotion. Derived m³ display is rounded only; calculate from unrounded inputs at runtime.

Coverage: 42 rows; 37 numerical proposals; 5 deferred rows. No production changes or tests.
