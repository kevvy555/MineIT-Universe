import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { fieldText } from "../js/substance-table-data.js";

const load = file => JSON.parse(readFileSync(new URL("../" + file, import.meta.url), "utf8"));
const parts = load("data/parts.json");
const machines = load("data/machines.json");
const materials = [...load("data/substances.json"), ...load("data/named-substances.json"), ...load("data/mobile-resource-definitions.json")];
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
const byId = new Map([...parts, ...machines, ...materials].map(r => [r.id, r]));
const catalogue = { collection: kind => kind === "parts" ? parts : [],
  get: id => byId.get(id) };
assert.equal(parts.length, 19);
assert.equal(new Set(parts.map(p => p.id)).size, parts.length);

const legacy = parts.filter(p => p.partRole === "legacy-compatibility");
const finished = parts.filter(p => p.partRole === "finished-product");
assert.equal(legacy.length, 0);
assert.equal(finished.length, 19);
const retiredIds = new Set(["part-battery-parts", "part-thermal-optical-parts", "part-fabrication-parts"]);
assert.ok(parts.every(p => !retiredIds.has(p.id)), "Superseded identities must not appear as Parts");
assert.equal(finished.filter(p => p.materialApprovalStatus === "APPROVED_INPUT_FAMILIES").length, 16);
assert.equal(finished.filter(p => p.materialApprovalStatus === "APPROVED_PRODUCT_BOM_PENDING").length, 2);
assert.equal(finished.filter(p => p.materialApprovalStatus === "APPROVED").length, 1);
assert.ok(parts.every(p => p.materialApprovalStatus !== "SOURCE_REFERENCE_SPLIT_APPROVED"));
assert.ok(finished.every(p => p.finishedUnitCount === 1 &&
  typeof p.finishedUnitDescription === "string" && p.finishedUnitDescription.length > 0));
assert.ok(parts.every(p => p.finishedUnit === undefined),
  "Separate count/unit object should not be reintroduced");
assert.ok(parts.every(p => !p.legacyReplacementPartIds));
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
    if (input.quantityKg != null) {
      assert.ok(Number.isFinite(input.quantityKg) && input.quantityKg > 0);
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
assert.equal(inputCount, 65);
assert.equal(planningInputCount, 62);
assert.equal(unresolvedCount, 1);
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
assert.equal(steel.quantityKg, 25);
const concrete = byId.get("part-precast-concrete-sections");
assert.equal(concrete.unresolvedMaterialInputs, undefined);
for (const [id, kg] of [["mobile-resource-silica-sand", 300], ["substance-fresh-water", 75]]) {
  const ingredient = concrete.materialInputs.find(input => input.substanceId === id);
  assert.ok(ingredient, "Missing approved concrete material " + id);
  assert.equal(ingredient.quantityKg, kg);
  assert.equal(ingredient.requirement, "standard");
  assert.ok(byId.has(id), "Concrete material must resolve to canonical resource " + id);
}
assert.equal(concrete.materialInputs.length, 5);
const lithium = byId.get("part-lithium-based-battery-module");
const approvedLfpBOM = [
  ["named-substance-lfp-cathode-material", 5],
  ["substance-refined-graphite", 2.5],
  ["named-substance-lfp-battery-electrolyte", 2],
  ["named-substance-refined-copper", 2],
  ["named-substance-aluminium", 0.5],
  ["named-substance-polymer-feedstock", 3],
  ["named-substance-stainless-steel", 3]
];
assert.equal(lithium.materialApprovalStatus, "APPROVED");
assert.deepEqual(lithium.materialInputs.map(input => [input.substanceId, input.quantityKg]), approvedLfpBOM);
assert.ok(lithium.materialInputs.every(input => input.requirement === "standard" &&
  input.approval === "approved-input-family"), "The user-approved LFP recipe uses seven resolved inputs");
assert.ok(!lithium.unresolvedMaterialInputs?.length);
assert.ok(!lithium.substanceIds.includes("named-substance-lithium-carbonate"),
  "Lithium carbonate is a cathode precursor, never an extra finished-module input");
assert.deepEqual(lithium.substanceIds, approvedLfpBOM.map(([id]) => id));
assert.equal(approvedLfpBOM.reduce((sum, [, kg]) => sum + kg, 0), lithium.planningReference.finishedMassKg);
assert.equal(lithium.planningReference.finishedMassKg, 18);
for (const id of ["named-substance-lfp-cathode-material", "named-substance-lfp-battery-electrolyte"]) {
  const material = byId.get(id);
  assert.equal(material?.materialStage, "processed", id + " must be refined");
  assert.equal(material?.stockBehaviour, "stockable", id + " must be tradable stock");
}
const cathode = byId.get("named-substance-lfp-cathode-material");
assert.deepEqual(cathode.upstreamMaterialIds, ["named-substance-lithium-carbonate"]);
const electrolyte = byId.get("named-substance-lfp-battery-electrolyte");
assert.match(electrolyte.upstreamInputDescription, /LiPF6/);
assert.equal(electrolyte.classificationStatus, "requires-generic-class-review",
  "Nonaqueous electrolyte must not inherit the source-canonical aqueous electrolyte class");
const source = byId.get("part-extraction-parts");
assert.deepEqual(new Set(source.materialInputs.map(i => i.substanceId)),
  new Set(["named-substance-steel", "named-substance-cemented-tungsten-carbide"]));
const readable = fieldText(source.materialInputs[0], catalogue);
assert.match(readable, /Steel/);
assert.match(readable, /kg/);
const reviewed = industrialReviewRows("parts", catalogue, reference);
assert.equal(reviewed.length, 19);
assert.ok(reviewed.every(row => row.canonical && row.fields.partRole));
assert.ok(reviewed.every(row => !("review.materialBOM.product_name" in row.fields) &&
  !("review.quantities.approved_planning_input_materials_kg_per_finished_unit" in row.fields)));
assert.ok(reviewed.every(row => row.fields.finishedUnitCount === 1));
assert.ok(reviewed.every(row => ["Available", "Not generated"].includes(row.fields.partImage)));
assert.equal(reviewed.filter(row => row.fields.partImage === "Available").length, 1);
assert.ok(reviewed.every(row => !("finishedUnit.count" in row.fields)));
assert.equal(reviewed.find(row => row.id === "part-precast-concrete-sections")
  .fields.materialInputs.find(i => i.substanceId === "named-substance-cement").quantityKg, 175);
assert.equal(reviewed.find(row => row.id === "part-extraction-parts")
  .fields["planningReference.manufacturerCostCC"], 1917.63);
assert.equal(reviewed.find(row => row.id === "part-precast-concrete-sections")
  .fields["planningReference.finishedMassKg"], 1160);
assert.ok(reviewed.every(row => row.fields.materialApprovalStatus));
console.log("Parts consolidation validated: 19 finished, zero legacy, 65 linked inputs, " +
  "62 material quantities, 1 unresolved input description, 18 reference prices.");
