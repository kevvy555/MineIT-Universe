import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows, createIndustrialTables } from "../js/industrial-table.js";
import { approvalSummary, validApprovalStatuses } from "../js/catalogue-approval.js";
import { applySubstanceTable, fieldText, uniqueColumnValues } from "../js/substance-table-data.js";
import { pendingColumnSelection } from "../js/substance-table.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const machines = load("data/machines.json");
const parts = load("data/parts.json");
const buildings = load("data/buildings.json");
const technologies = load("data/research-technologies.json");
const materials = [...load("data/named-substances.json"), ...load("data/substances.json")];
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
const definitions = load("data/column-definitions.json").filter(column => column.table === "machines");
const required = definitions.filter(column => column.requiresApproval).map(column => column.fieldKey);
const catalogueCollections = {machines, parts, buildings, researchTechnologies: technologies,
  columnDefinitions: load("data/column-definitions.json")};
const byId = new Map([...machines, ...parts, ...buildings, ...materials, ...technologies]
  .map(item => [item.id, item]));
const catalogue = {collection: kind => catalogueCollections[kind] || [], get: id => byId.get(id)};
const machineIds = new Set(machines.map(machine => machine.id));
const partIds = new Set(parts.map(part => part.id));
const materialIds = new Set(materials.map(material => material.id));

assert.equal(machines.length, 42);
assert.equal(machineIds.size, 42);
assert.equal(definitions.length, 25);
assert.equal(required.length, 16);
assert.equal(new Set(definitions.map(column => column.category)).size, 6);
assert.deepEqual(new Set(Object.keys(createIndustrialTables())),
  new Set(["parts", "machines", "buildings"]));
assert.equal(reference.machines.length, 34);
assert.equal(new Set(reference.unmappedCandidates.machines.map(item => item.id)).size, 8);
assert.deepEqual(new Set(reference.unmappedCandidates.machines.map(item => item.id)),
  new Set(machines.filter(machine => machine.provenance?.androidDiscoveryWorkingId)
    .map(machine => machine.provenance.androidDiscoveryWorkingId)));

let physicalApproved = 0, sourceProposals = 0, prices = 0, pendingLinks = 0;
let nestedEntries = 0;
const graph = new Map();
for (const machine of machines) {
  const m = machine.manufacturing;
  const op = machine.operatingProfile;
  assert.ok(m && op, machine.id + " needs consolidated manufacturing and operating structure");
  assert.ok(validApprovalStatuses.has(machine.approval));
  assert.equal(machine.entityType, "Machine");
  assert.equal(machine.image.generated, true, machine.id + " artwork must remain generated");
  assert.ok(!Object.hasOwn(machine, "approvedPhysicalBOM"));
  assert.ok(!Object.hasOwn(machine, "amenityProfile"));
  assert.deepEqual(new Set(Object.keys(machine.fieldApprovalStatuses || {})),
    new Set(required), machine.id + " has missing/extra approval fields");
  assert.ok(Object.values(machine.fieldApprovalStatuses)
    .every(state => validApprovalStatuses.has(state)));
  assert.equal(machine.fieldApplicability?.pendingPartCompatibility,
    !!machine.pendingPartCompatibility?.length);
  assert.equal(machine.manufacturing.authority === "approved-physical-bom-prices-provisional",
    !!machine.manufacturing.physicalApprovalEvidence);
  assert.ok(["approved-physical-bom-prices-provisional",
    "unapproved-android-discovery-proposal",
    "discovery-identity-quantities-pending"].includes(m.authority));
  for (const [key, valid, idKey] of [
    ["finishedPartInputs", partIds, "partId"],
    ["nestedMachineInputs", machineIds, "machineId"],
    ["directMaterialInputs", materialIds, "materialId"]
  ]) {
    assert.ok(Array.isArray(m[key]), machine.id + ": " + key + " must be an array");
    const seen = new Set();
    for (const input of m[key]) {
      assert.ok(valid.has(input[idKey]), machine.id + ": unknown " + idKey + " " + input[idKey]);
      assert.ok(!seen.has(input[idKey]), machine.id + ": duplicate input " + input[idKey]);
      seen.add(input[idKey]);
      const qty = key === "directMaterialInputs" ? input.quantityKg : input.quantity;
      assert.ok(Number.isFinite(qty) && qty > 0 && (key === "directMaterialInputs" ||
        Number.isInteger(qty)), machine.id + ": invalid quantity in " + key);
      if (input.qualification) assert.equal(input.qualification, "grade-tbd");
    }
  }
  graph.set(machine.id, m.nestedMachineInputs.map(input => input.machineId));
  nestedEntries += m.nestedMachineInputs.length;
  for (const field of ["assemblyHours", "factoryHours", "testHours", "finishedMassKg",
    "manufacturerCostCC", "manufacturerQuoteCC"]) {
    assert.ok(m[field] === null || (Number.isFinite(m[field]) && m[field] >= 0),
      machine.id + ": invalid " + field);
  }
  assert.ok(m.goodUnitYield === null || (m.goodUnitYield > 0 && m.goodUnitYield <= 1));
  if (m.manufacturerCostCC !== null) prices++;
  if (m.authority === "unapproved-android-discovery-proposal") sourceProposals++;
  if (m.physicalApprovalEvidence) {
    physicalApproved++;
    assert.equal(m.physicalApprovalEvidence, "approved-physical-bom-2026-11-02");
    assert.equal(op.ratingApprovalEvidence, "approved-discovery-2026-11-02");
    assert.ok(op.ratedCapacity.quantity > 0 && op.ratedCapacity.unit);
    assert.ok(op.operatingPowerUnits > 0 && op.footprintM2 > 0);
    for (const key of ["manufacturing.finishedPartInputs", "manufacturing.directMaterialInputs",
      "manufacturing.assemblyHours", "manufacturing.factoryHours", "manufacturing.testHours",
      "manufacturing.goodUnitYield", "operatingProfile.ratedCapacity",
      "operatingProfile.operatingPowerUnits", "operatingProfile.footprintM2"])
      assert.equal(machine.fieldApprovalStatuses[key], "Approved",
        machine.id + ": the approved BOM/rating must remain approved");
  }
  for (const key of ["manufacturing.manufacturerCostCC", "manufacturing.manufacturerQuoteCC"])
    assert.notEqual(machine.fieldApprovalStatuses[key], "Approved",
      machine.id + ": historical scenario prices are not approved");
  pendingLinks += (machine.pendingPartCompatibility || []).length;
  for (const review of machine.pendingPartCompatibility || []) {
    assert.equal(review.reviewStatus, "unapproved-consumer-mapping");
    assert.ok(review.notes && review.supersededFamily);
    for (const id of review.candidatePartIds || [])
      assert.ok(partIds.has(id), machine.id + ": invalid compatibility candidate");
  }
}
assert.equal(sourceProposals, 34);
assert.equal(physicalApproved, 5);
assert.equal(prices, 29);
assert.equal(pendingLinks, 14);
assert.equal(machines.filter(machine => machine.pendingPartCompatibility?.length).length, 10);
assert.equal(machines.filter(machine => machine.approval === "Blocked").length, 7);
assert.equal(machines.filter(machine => machine.approval === "In Review").length, 35);
assert.equal(machines.filter(machine => machine.approval === "Approved").length, 0,
  "Approved physical BOM alone is not a fully approved Machine");
assert.equal(machines.find(machine => machine.id === "machine-personal-recreation-terminal")
  .operatingProfile.ratedCapacity.quantity, 1);
assert.equal(machines.find(machine => machine.id === "machine-integrated-wellness-leisure-system")
  .operatingProfile.ratedCapacity.quantity, 120);
assert.equal(machines.find(machine => machine.id === "machine-ship-scanner")
  .manufacturing.manufacturerCostCC, 109058.24);
assert.equal(machines.find(machine => machine.id === "machine-ship-reactor")
  .manufacturing.manufacturerCostCC, null);

const visit = (id, active = new Set(), done = new Set()) => {
  if (done.has(id)) return;
  assert.ok(!active.has(id), "Cyclic nested machine BOM: " + id);
  active.add(id);
  for (const child of graph.get(id) || []) visit(child, active, done);
  active.delete(id);
  done.add(id);
};
const done = new Set();
for (const machine of machines) visit(machine.id, new Set(), done);

const rows = industrialReviewRows("machines", catalogue, reference);
const fallbackRows = industrialReviewRows("machines", catalogue, null);
assert.equal(rows.length, 42);
assert.deepEqual(rows.map(row => row.fields), fallbackRows.map(row => row.fields),
  "Machine review must not depend on a second imported Android dataset");
const allowed = new Set(definitions.map(definition => definition.fieldKey));
assert.deepEqual(new Set(rows.flatMap(row => Object.keys(row.fields))), allowed,
  "No obsolete provenance, source proposal or exposed field-status columns may leak");
assert.ok(![...allowed].some(key => key.startsWith("review.") ||
  key.startsWith("provenance.") || key.startsWith("fieldApprovalStatuses.") ||
  key.startsWith("approvedPhysicalBOM.") || key.startsWith("amenityProfile.")));
assert.deepEqual([...allowed].filter(key => key.startsWith("image.")), ["image.generated"]);
for (const row of rows) {
  assert.deepEqual(new Set(Object.keys(row.fields)), allowed,
    "Every Machine row must support the complete 25-field column chooser");
  assert.deepEqual(approvalSummary("machines", row.record, row.fields, catalogue)
    .needsApproval, row.fields.needsApproval);
  assert.equal(row.fields.approval, row.record.approval);
  assert.ok(Array.isArray(row.fields.buildingCompatibilityIds));
  assert.ok(Array.isArray(row.fields.technologyUnlock));
  assert.ok(row.fields.needsApproval.includes("Manufacturer Cost (CC)"));
}
const scanner = rows.find(row => row.id === "machine-ship-scanner");
assert.match(fieldText(scanner.fields["manufacturing.finishedPartInputs"], catalogue),
  /Power Electronics/);
assert.equal(scanner.fields["manufacturing.manufacturerCostCC"], 109058.24);
const welcome = rows.find(row => row.id === "machine-personal-recreation-terminal");
assert.equal(fieldText(welcome.fields["operatingProfile.ratedCapacity"], catalogue),
  "1 resident service slots/day");
assert.ok(welcome.fields.technologyUnlock.includes("Housing T1"));
assert.ok(welcome.fields.needsApproval.includes("Manufacturer Quote (CC)"));
assert.ok(!welcome.fields.needsApproval.includes("Direct Material Inputs"));
const possible = definitions.map(definition => definition.fieldKey);
const rowPending = pendingColumnSelection(rows, possible, welcome.id);
assert.ok(rowPending.includes("manufacturing.manufacturerCostCC"));
assert.ok(!rowPending.includes("manufacturing.directMaterialInputs"));
const globalPending = pendingColumnSelection(rows, possible);
assert.ok(globalPending.includes("manufacturing.directMaterialInputs"));
assert.ok(globalPending.includes("manufacturing.manufacturerCostCC"));
assert.deepEqual(pendingColumnSelection(rows, possible, "missing"),
  ["name", "approval", "needsApproval"]);
assert.equal(applySubstanceTable(rows, ["name", "approval"], {}, "name", 1, catalogue).length, 42);
assert.equal(uniqueColumnValues(rows, "approval", catalogue).length, 2);
assert.throws(() => approvalSummary("machines", {
  ...welcome.record, approval: "Approved"
}, welcome.fields, catalogue), /disagrees with explicit field statuses/);
assert.throws(() => approvalSummary("machines", {
  ...welcome.record, fieldApprovalStatuses: {
    ...welcome.record.fieldApprovalStatuses, "manufacturing.finishedPartInputs": "Not Reviewed"
  }
}, welcome.fields, catalogue), /disagrees with explicit field statuses|In Review/);
console.log("Machines consolidation valid: 42 IDs, 25 fields, 34 unapproved proposals, " +
  "5 approved physical BOMs, 29 provisional costs, 14 pending Part relationships.");
