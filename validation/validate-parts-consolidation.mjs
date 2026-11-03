import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { fieldText } from "../js/substance-table-data.js";

const load = file => JSON.parse(readFileSync(new URL("../" + file, import.meta.url), "utf8"));
const parts = load("data/parts.json");
const machines = load("data/machines.json");
const materials = [...load("data/substances.json"), ...load("data/named-substances.json")];
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
const byId = new Map([...parts, ...machines, ...materials].map(r => [r.id, r]));
const catalogue = { collection: kind => kind === "parts" ? parts : [],
  get: id => byId.get(id) };
assert.equal(parts.length, 22);
assert.equal(new Set(parts.map(p => p.id)).size, parts.length);

const legacy = parts.filter(p => p.partRole === "legacy-compatibility");
const finished = parts.filter(p => p.partRole === "finished-product");
assert.equal(legacy.length, 3);
assert.equal(finished.length, 19);
assert.deepEqual(new Set(legacy.map(p => p.id)), new Set([
  "part-battery-parts", "part-thermal-optical-parts", "part-fabrication-parts"
]));
assert.equal(finished.filter(p => p.materialApprovalStatus === "APPROVED_INPUT_FAMILIES").length, 16);
assert.equal(finished.filter(p => p.materialApprovalStatus === "APPROVED_PRODUCT_BOM_PENDING").length, 3);
assert.ok(legacy.every(p => p.materialApprovalStatus === "SOURCE_REFERENCE_SPLIT_APPROVED"));
assert.ok(legacy.every(p => !p.finishedUnit && !p.planningReference));
assert.ok(finished.every(p => p.finishedUnit?.unit === "each" && p.finishedUnit.count === 1));
assert.ok(legacy.every(p => p.legacyReplacementPartIds.length === 2 &&
  p.legacyReplacementPartIds.every(id => byId.get(id)?.partRole === "finished-product")));
assert.ok(parts.every(p => !p.materialDesignStatus && !p.materialDesignNotes));

let inputCount = 0, planningInputCount = 0, unresolvedCount = 0;
const allowedRequirements = new Set(["standard", "candidate", "upstream-source",
  "upstream-precursor", "conditional-alternative", "conditional-specialist",
  "conditional-reinforcement"]);
const allowedApprovals = new Set(["approved-input-family", "approved-conditional-family",
  "approved-upstream-source", "planning-only-unqualified"]);
for (const part of parts) {
  assert.ok(part.id.startsWith("part-"));
  assert.ok(typeof part.materialApprovalStatus === "string");
  assert.ok(!(part.subCategories?.length === 1 && part.subCategories[0] === part.subCategory),
    part.id + " duplicates the primary subcategory");
  for (const id of part.substanceIds) {
    assert.ok(byId.has(id), part.id + " broken generic Substance ID " + id);
  }
  for (const id of part.machineIds || []) {
    assert.ok(byId.has(id), part.id + " broken Machine ID " + id);
  }
  if (part.partRole !== "finished-product") continue;
  const inputIds = new Set();
  for (const input of part.materialInputs) {
    assert.ok(byId.has(input.substanceId), part.id + " broken input " + input.substanceId);
    assert.ok(!inputIds.has(input.substanceId), part.id + " duplicate typed material input");
    inputIds.add(input.substanceId);
    assert.ok(allowedRequirements.has(input.requirement), part.id + " invalid requirement");
    assert.ok(allowedApprovals.has(input.approval), part.id + " invalid input approval");
    if (input.planningQuantityKg != null) {
      assert.ok(Number.isFinite(input.planningQuantityKg) && input.planningQuantityKg > 0);
      planningInputCount++;
    }
    inputCount++;
  }
  for (const unresolved of part.unresolvedMaterialInputs || []) {
    assert.ok(unresolved.label && unresolved.status);
    assert.ok(!unresolved.substanceId,
      "Unqualified inputs must not pretend to have canonical Substance IDs");
    if (unresolved.planningAllowanceKg != null)
      assert.ok(Number.isFinite(unresolved.planningAllowanceKg) && unresolved.planningAllowanceKg > 0);
    unresolvedCount++;
  }
  assert.ok(part.planningReference);
  assert.equal(part.provenance?.partsDiscovery?.sourceCommit, reference.sourceCommit);
  assert.ok(part.planningReference.status.includes("planning") ||
    part.planningReference.status === "blocked-pending-engineering");
  assert.equal(part.planningReference.manufacturerCostCC == null,
    part.planningReference.baseManufacturerQuoteCC == null);
  assert.ok(part.manufacturerCostCC == null && part.baseSellQuoteCC == null,
    "Planning references must not become live manufacturer prices");
}
assert.equal(inputCount, 61);
assert.equal(planningInputCount, 58);
assert.equal(unresolvedCount, 5);
assert.equal(finished.filter(p => Number.isFinite(p.planningReference.finishedMassKg)).length, 18);
assert.equal(finished.filter(p => Number.isFinite(p.planningReference.manufacturerCostCC)).length, 18);
assert.equal(finished.filter(p => Number.isFinite(p.planningReference.baseManufacturerQuoteCC)).length, 18);
const nuclear = byId.get("part-nuclear-fuel-assembly");
assert.equal(nuclear.planningReference.status, "blocked-pending-engineering");
assert.equal(nuclear.planningReference.manufacturerCostCC, undefined);
assert.ok(nuclear.materialInputs.every(input => input.requirement === "upstream-precursor"));
const steel = byId.get("part-precast-concrete-sections").materialInputs
  .find(input => input.substanceId === "named-substance-steel");
assert.equal(steel.requirement, "conditional-reinforcement");
assert.equal(steel.planningQuantityKg, 25);
const lithium = byId.get("part-lithium-based-battery-module");
assert.equal(lithium.materialInputs.find(i =>
  i.substanceId === "named-substance-lithium-carbonate").requirement, "upstream-precursor");
assert.ok(lithium.unresolvedMaterialInputs.some(x => x.label.includes("cathode")));
const source = byId.get("part-extraction-parts");
assert.deepEqual(new Set(source.materialInputs.map(i => i.substanceId)),
  new Set(["named-substance-steel", "named-substance-cemented-tungsten-carbide"]));
const readable = fieldText(source.materialInputs[0], catalogue);
assert.match(readable, /Steel/);
assert.match(readable, /kg planning/);
const reviewed = industrialReviewRows("parts", catalogue, reference);
assert.equal(reviewed.length, 22);
assert.ok(reviewed.every(row => row.canonical && row.fields.partRole));
assert.ok(reviewed.every(row => !("review.materialBOM.product_name" in row.fields) &&
  !("review.quantities.approved_planning_input_materials_kg_per_finished_unit" in row.fields)));
assert.equal(reviewed.find(row => row.id === "part-extraction-parts")
  .fields["planningReference.manufacturerCostCC"], 1917.63);
assert.equal(reviewed.find(row => row.id === "part-precast-concrete-sections")
  .fields["planningReference.finishedMassKg"], 1160);
assert.ok(reviewed.every(row => row.fields.materialApprovalStatus));
console.log("Parts consolidation validated: 19 finished, 3 legacy, 61 linked inputs, " +
  "58 planning quantities, 5 unresolved input descriptions, 18 reference prices.");
