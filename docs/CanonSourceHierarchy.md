# MineIT Canon Source Hierarchy

Status: **Authoritative repository policy**

## Purpose

The MineIT Universe repository now contains both structured entity data and the long-form source documents that define the setting. This document prevents structured/generated content from silently overriding established lore.

## Precedence

### 1. Foundation lore

`data/lore/Koplin_Universe_Expanded_Backstory_Lore_Bible.md`

This is the highest-precedence current source for Koplin civilisation history, the three peoples, the Continental War and reconciliation, the AI Wars and Commonwealth Compact, the Koplin Commonwealth, Year-5300 civilisation, Veyrite, Vector Exchange travel, the KSV Meridian/Far Lantern Expedition and the Anchor Network designer truth.

### 2. Scenario extensions

`data/lore/Koplin_Scenario_II_Deep_Reach_Mining_Charter.md`

This extends the foundation into Year 5326 and is authoritative for Koplin Deep Reach Corporation, the Charter Programme, one-year support, ten-year first-sale contracts, Commonwealth Credit, market-linked pricing/freight/barter, the KSV Wayfarer, Greywake and Year-5326 frontier commerce.

A scenario document cannot contradict the foundation lore unless an explicit canon revision says so.

### 3. Structured canonical records

JSON under `data/` exists so the Directory and games can query stable entities. It is not an independent source of lore.

When JSON and lore disagree, **the lore wins** and the JSON must be reconciled.

### 4. Game state

Prices quoted to a particular player, production queues, ownership changes within a save, reputation, contracts, player colonies and other mutable gameplay values belong to the game.

## Knowledge scope

The Lore Explorer is an omniscient development/reference tool. It may expose designer truth, including the Anchor Network, because the Universe design explicitly chose full canonical visibility.

Records that are not intended to be known by a Year-5300/5326 citizen must carry an explicit `knowledgeScope` such as `designer truth`.

## Current era

- Civilisation baseline used by the main lore bible: **Year 5300**.
- Deep Reach commercial scenario: **Year 5326**.
- The shared Universe manifest uses **Year 5326** as its commercial present while retaining Year 5300 as the civilisation baseline.

## Reconciliation rule

The original schema-v2 ten-system sample was generated before the full lore bibles were imported. Any part of that sample that conflicts with these source documents is provisional and must be corrected rather than defended as canon.

Examples include unsupported intelligent-alien species, sovereign AI institutions, the old Year-2389 date and the placeholder charter corporation. New development must follow the lore sources even before every old sample record has been migrated.
