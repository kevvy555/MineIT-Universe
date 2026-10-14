# 01 — Shared Industrial Model

**Status:** mixed: canonical foundation, user-agreed direction, candidate design. See [decision register](04-decisions-and-evidence.md). **No gameplay implementation authorised by this document.**

## 1. Purpose and scope

MineIT has a common physical economy across the shared universe, Desktop and Mobile:

```text
Naturally occurring raw materials (actual authored identities and discovered occurrences)
    -> extraction / biological collection / gas and liquid harvesting
    -> processing and refining, using appropriate process, power, people and machinery
    -> usable manufactured feedstocks (metals, ceramics, glass, chemicals, etc.)
    -> manufacture of specific parts / standard parts families
    -> machine construction / equipment commissioning
    -> installation into an asset, repair and replenishment
    -> productive assets that extract, trade, refine, transport, manufacture or support life
```

**Canonical fact:** the Universe already distinguishes `substances`, `parts`, `machines` and `buildings`, each with stable IDs and linked industrial meaning. It distinguishes *material identity* from a particular deposit, stock quantity, quality roll or market quote.

**Agreed product direction, #114:** MineIT Mobile presently remains a raw-resource extraction and trading game. Later refining, parts manufacture, machine production, ships and stations use **the same industrial economy**. Desktop uses more detailed parts/machines and can implement a different starting scenario. Neither platform should invent a universal resource named Ore that has the physical power to repair arbitrary equipment.

## 2. Five distinct things (do not collapse)

1. **Raw substance:** e.g. Iron Ore or Sulfur; where found and how extracted matter.
2. **Refined / processed stock:** e.g. structural alloy, conductive stock, glass, refined ceramic, lubricant or chemical feedstock. Production needs an appropriate transformation; merely owning raw ore is insufficient.
3. **Part / maintenance supply:** replaceable electrical, mechanical, environmental or thermal components. A *Desktop part* can be physically distinct; a *Mobile Parts category* is a standardised **bundle/abstraction** and not a new natural substance.
4. **Machine / installed equipment:** tangible functional capital with location, installed capacity and possible condition. It may be movable and salvageable. A *Mobile Machinery family* stands for compatible standard equipment of that functional discipline, **not** an identical machine in every environment.
5. **Asset:** a fixed building, refinery, orbital platform, skimmer, vehicle, ship, tug or station. It has a structure and an equipment fit-out; its actual operation depends on site, environment, power, labour, feeds and technology.

A building shell is not automatically equipped, an equipped building is not automatically staffed, and an idle machine is not an available inventory unit merely because it is stopped.

## 3. One construction and maintenance contract across all assets

**Agreed principle:** ships must not acquire a separate Parts/Machinery economy. A shared inventory item can equip another kind of asset if physically and technologically compatible. For instance, Control equipment needed in a HQ can also serve a relay, science facility or ship; extraction equipment can serve an asteroid miner and planetary mine; logistic handling can serve a port, warehouse or cargo vessel.

**Candidate interface (not approved engineering API):**

```text
AssetBlueprint = canonical identity + operational location + structure material requirements
              + EquipmentRequirement[family, count, capability/tech restriction]
              + Assembly/CommissioningParts[family, count]
              + MaintenanceProfile[family, operating activity]
              + Workforce/Power/Fuel/SpecialMaterialRequirements
              + operation and salvage rules
AssetState     = location + ownership + installed equipment + commissioning state
              + condition/wear + outputs/orders + persisted operational settings
```

This is a *conceptual* cross-game contract. Do **not** construct a single polymorphic mega-runtime or claim all environmental physics is identical. Ships have routes; asteroid rigs anchor; gas skimmers operate in atmospheric layers; planetary mines use deposits and terrain. **What is shared is the industrial supply and lifecycle, not the entire operational simulator.**

## 4. Ongoing maintenance

**Explicit Mobile player decision:** installed Machinery is capital equipment; Parts are acquired for initial commissioning/upgrades and are consumed **on an ongoing basis** for maintenance. Machinery is not burned daily.

**Still unresolved:** whether Parts shortage immediately reduces output or first accumulates condition/wear damage, when repair is possible, whether stopped buildings still use baseline parts, maintenance priority, overdrive exposure, salvage percentages, condition granularity and rates. These questions belong to #114 D01–D05; do not treat the previously discussed condition graph as an approved wear formula.

Desktop design already identifies replaceable components, installed machines and maintenance capability, but does **not** yet have a fully agreed production-grade maintenance simulation that Mobile must duplicate.

## 5. Physical compatibility and true reuse

'Interchangeable' means **the same inventory families/standards can be reused across compatible assets**. It does **not** mean:
- any spare fits any machine;
- all Machinery units have identical mass or cargo burden;
- a basic terrestrial engine is an interstellar drive;
- every refined metal can substitute for any other;
- station hulls can be built from arbitrary plant fibre;
- high-energy radiation, cryogenic and pressure environments need no specific technology;
- Veyrite, reactor fuel, propellant and lattice wear cease being real specialised systems.

Prefer few stable functional supply families with explicit capability, technology and environment checks over a separate 'Ship Parts' or 'Station Machinery' pseudo-economy.

## 6. Scenario differences are intentional

- **Desktop:** long-form 3D crashed/stranded-ship scenario; salvage, survey, materials analysis, machine construction, researching escape, physically local production.
- **Mobile:** Year-5326 multi-system Deep Reach corporation, initially imports equipment, exports raw material, manages colonies/fleets/contracts and later establishes its own industrial hubs.

They share the **meaning** of resources, equipment and buildings. They do not need to share exact construction recipes, maintenance values, timescales or presentation.
