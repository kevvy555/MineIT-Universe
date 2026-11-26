import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { approvalSummary } from "../js/catalogue-approval.js";
import { pendingColumnSelection } from "../js/substance-table.js";
import { fieldText } from "../js/substance-table-data.js";

// M01–M06: validate canonical machine identities, typed manufacturing data,
// preserved approvals, provisional price boundaries and compact review projection.
const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const machines = load("data/machines.json");
const parts = load("data/parts.json");
const buildings = load("data/buildings.json");
const materials = [...load("data/substances.json"), ...load("data/named-substances.json")];
const registry = load("data/column-definitions.json");
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
const ids = {
  machines: new Set(machines.map(m => m.id)),
  parts: new Set(parts.map(p => p.id)),
  materials: new Set(materials.map(m => m.id))
};
assert.equal(machines.length, 46);
assert.equal(ids.machines.size, machines.length);
const haulage = machines.find(m => m.id === "machine-haulage-truck");
assert.ok(haulage, "Canonical haulage truck must exist");
assert.equal(haulage.engineeringStatus, "not-reviewed");
assert.equal(haulage.approval, "Not Reviewed");
assert.deepEqual(haulage.servicePartRequirements, []);
assert.equal(haulage.fieldApprovalStatuses.servicePartRequirements, "Not Reviewed");
assert.equal(haulage.manufacturing.finishedPartInputs, null);
assert.equal(haulage.operating.ratedCapacity, null);
assert.equal(haulage.image.generated, false);

const all = [...machines, ...parts, ...buildings, ...materials];
const byId = new Map(all.map(x => [x.id, x]));
const catalogue = {
  collection: kind => ({ machines, parts, buildings, columnDefinitions: registry })[kind] || [],
  get: id => byId.get(id)
};
const selected = registry.filter(d => d.table === "machines");
assert.equal(selected.length, 30);
assert.deepEqual(new Set(selected.map(d => d.category)), new Set([
  "Identity & Classification", "Physical Construction", "Operation & Capabilities",
  "Manufacturing & Pricing", "Discovery & Approval", "Artwork & Visuals",
  "Condition & Maintenance"
]));
const required = selected.filter(d => d.requiresApproval).map(d => d.fieldKey);
const flatten = (obj, prefix = "", out = {}) => {
  for (const [key, value] of Object.entries(obj || {})) {
    const name = prefix ? prefix + "." + key : key;
    if (value && typeof value === "object" && !Array.isArray(value))
      flatten(value, name, out);
    else out[name] = value;
  }
  return out;
};
let pending = 0, priceProposals = 0, fullyApprovedBoms = 0, blocked = 0, mobileApproved = 0;
const initialMobileFields = new Set([
  "operating.ratedCapacityUnit", "operating.idlePowerUnits", "operating.operatingConsumables",
  "operating.consumableUnitPolicy", "operating.foundingCargoUnits", "operating.configurationProfiles",
  "operating.generatorFuelProfile", "operating.environmentalGate", "operating.storedEnergyCapacityPowerUnitHours"
]);
for (const machine of machines) {
  assert.equal(machine.entityType, "Machine");
  assert.equal(typeof machine.image?.generated, "boolean", machine.id + " image state retained");
  assert.ok(["generated", "not-generated"].includes(machine.image?.status));
  assert.ok(machine.image?.key?.endsWith(machine.id + ".webp"));
  assert.equal(machine.approvedPhysicalBOM, undefined, "No parallel BOM");
  assert.equal(machine.manufacturingDesignStatus, undefined, "No parallel design status");
  assert.equal(machine.needsApproval, undefined, "Needs Approval is never persisted");
  const bom = machine.manufacturing;
  assert.ok(bom && typeof bom === "object", machine.id + " missing BOM");
  assert.ok(bom.reviewBasis, machine.id + " missing proposal boundary");
  for (const [key, idKey, target, countKey] of [
    ["finishedPartInputs", "partId", ids.parts, "quantity"],
    ["nestedMachineInputs", "machineId", ids.machines, "quantity"],
    ["directMaterialInputs", "materialId", ids.materials, "quantityKg"]
  ]) {
    const list = bom[key];
    assert.ok(list === null || Array.isArray(list), machine.id + "." + key + " must be typed or null");
    if (!list) continue;
    assert.equal(new Set(list.map(x => x[idKey])).size, list.length, machine.id + " repeated ingredient");
    for (const input of list) {
      assert.ok(target.has(input[idKey]), machine.id + " unknown " + idKey + ": " + input[idKey]);
      assert.ok(Number.isFinite(input[countKey]) && input[countKey] > 0,
        machine.id + " invalid " + countKey);
      if (countKey === "quantity") assert.ok(Number.isInteger(input.quantity));
    }
  }
  for (const field of ["assemblyHours", "factoryHours", "testHours", "finishedMassKg",
                        "manufacturerCostCC", "manufacturerQuoteCC"]) {
    const n = bom[field];
    assert.ok(n === null || Number.isFinite(n) && n >= 0,
      machine.id + ": " + field + " must be numeric or explicitly unresolved");
  }
  assert.ok(bom.goodUnitYield === null ||
    (bom.goodUnitYield > 0 && bom.goodUnitYield <= 1));
  const approvedQuarry = machine.id === "machine-drill-machine" &&
    machine.mobileMineInitialBalance?.scope === "quarry";
  const delegatedMobile = machine.mobileMineInitialBalance?.approval === "Approved" &&
    (machine.mobileMineInitialBalance.scope === "mine-and-connected-power" || approvedQuarry);
  if (Number.isFinite(bom.manufacturerCostCC)) priceProposals++;
  if (delegatedMobile) {
    mobileApproved++;
    assert.match(machine.manufacturing.approvedPriceEvidence || "", approvedQuarry
      ? /User approval, 26 November 2026: MineIT-Android #571\/#572/ : /Delegated user approval, 22 November 2026/);
    assert.match(machine.manufacturing.approvedMassEvidence || "", approvedQuarry
      ? /User approval, 26 November 2026: MineIT-Android #571\/#572/ : /Delegated user approval, 22 November 2026/);
    if (approvedQuarry) {
      assert.equal(bom.manufacturerCostCC, 263722.38);
      assert.equal(bom.manufacturerQuoteCC, 329700);
      assert.equal(bom.finishedMassKg, 3787.5);
      assert.equal(machine.operating.ratedCapacity, 15);
      assert.equal(machine.operating.ratedCapacityUnit, "raw-resource-units-per-hour");
      assert.equal(machine.operating.powerUnits, 3);
      assert.equal(machine.operating.idlePowerUnits, 0.15);
      assert.equal(machine.operating.foundingCargoUnits, 38);
      assert.deepEqual(machine.operating.operatingConsumables, [
        { resourceId: "substance-refined-lubricant", quantityPerOperatingHour: 0.1, unit: "kg" },
        { resourceId: "substance-coolant", quantityPerOperatingHour: 0.2, unit: "kg" }
      ]);
      assert.equal(machine.servicePartRequirements.reduce((n, slot) => n + slot.quantity, 0), 39);
      for (const field of ["finishedPartInputs", "directMaterialInputs", "nestedMachineInputs",
        "assemblyHours", "factoryHours", "testHours", "goodUnitYield"])
        assert.equal(machine.fieldApprovalStatuses["manufacturing." + field], "Proposed");
    }
    assert.ok(Number.isFinite(bom.manufacturerCostCC) && bom.manufacturerCostCC > 0);
    assert.ok(Number.isFinite(bom.manufacturerQuoteCC) && bom.manufacturerQuoteCC >= bom.manufacturerCostCC);
    assert.ok(Number.isFinite(bom.finishedMassKg) && bom.finishedMassKg > 0);
    assert.ok(Number.isFinite(machine.operating.ratedCapacity) && machine.operating.ratedCapacity > 0);
    assert.ok(typeof machine.operating.ratedCapacityUnit === "string" && machine.operating.ratedCapacityUnit.length);
    assert.ok(Number.isFinite(machine.operating.powerUnits) && machine.operating.powerUnits >= 0);
    assert.ok(Number.isFinite(machine.operating.idlePowerUnits) && machine.operating.idlePowerUnits >= 0);
    assert.ok(Number.isInteger(machine.operating.foundingCargoUnits) && machine.operating.foundingCargoUnits > 0);
    assert.equal(machine.operating.foundingCargoUnits, Math.ceil(bom.finishedMassKg / 100));
    for (const field of ["manufacturing.finishedMassKg", "manufacturing.manufacturerCostCC",
      "manufacturing.manufacturerQuoteCC", "operating.ratedCapacity", "operating.powerUnits"])
      assert.equal(machine.fieldApprovalStatuses[field], "Approved", machine.id + ": " + field);
    for (const field of ["operating.ratedCapacityUnit", "operating.idlePowerUnits",
      "operating.operatingConsumables", "operating.consumableUnitPolicy", "operating.foundingCargoUnits"])
      assert.equal(machine.fieldApprovalStatuses[field], "Approved", machine.id + ": " + field);
  } else {
    assert.notEqual(machine.fieldApprovalStatuses["manufacturing.manufacturerCostCC"], "Approved",
      "Unapproved Android scenario CC cannot be promoted");
    assert.notEqual(machine.fieldApprovalStatuses["manufacturing.manufacturerQuoteCC"], "Approved",
      "Unapproved Android scenario CC cannot be promoted");
    assert.notEqual(machine.fieldApprovalStatuses["manufacturing.finishedMassKg"], "Approved",
      "Unapproved estimated Machine mass cannot be approved");
  }
  assert.equal(machine.manufacturerCostCC, undefined, "Do not install live machine price");
  assert.equal(machine.baseSellQuoteCC, undefined);
  const statusFields = Object.keys(machine.fieldApprovalStatuses);
  assert.deepEqual(new Set(statusFields.filter(key => required.includes(key))), new Set(required),
    machine.id + " must have explicit decisions for every required field");
  const extras = statusFields.filter(key => !required.includes(key));
  assert.ok(extras.every(key => delegatedMobile && initialMobileFields.has(key)),
    machine.id + " has noncanonical field-approval keys: " + extras.join(", "));
  const fields = flatten(machine);
  fields.buildingCompatibility = buildings
    .filter(b => (b.machineIds || []).includes(machine.id)).map(b => b.id);
  const summary = approvalSummary("machines", machine, fields, catalogue);
  assert.equal(summary.approval, machine.approval);
  assert.ok(summary.needsApproval.length > 0, machine.id + " has unresolved engineering/pricing");
  if (machine.approval === "Blocked") blocked++;
  for (const edge of machine.pendingPartCompatibility || []) {
    pending++;
    assert.equal(edge.reviewStatus, "unapproved-consumer-mapping");
  }
  if (!machine.amenityProfile) {
    assert.equal(bom.reviewBasis.startsWith("Approved physical"), false);
    continue;
  }
  fullyApprovedBoms++;
  assert.equal(machine.approval, "In Review",
    "Approved accommodation physical design does not approve Machine pricing");
  assert.match(bom.reviewBasis, /Approved physical Machine BOM/);
  for (const field of ["finishedPartInputs", "directMaterialInputs", "nestedMachineInputs",
                        "assemblyHours", "factoryHours", "testHours", "goodUnitYield"])
    assert.equal(machine.fieldApprovalStatuses["manufacturing." + field], "Approved",
      "Previously approved accommodation inputs must survive");
  for (const [operating, legacy] of [
    ["ratedCapacity", "residentServiceSlotsPerDay"],
    ["footprintM2", "floorAreaM2"],
    ["powerUnits", "operatingPowerUnits"]
  ]) {
    assert.equal(machine.operating[operating], machine.amenityProfile[legacy]);
    assert.equal(machine.fieldApprovalStatuses["operating." + operating], "Approved");
  }
  assert.ok(Number.isInteger(machine.operating.housingTechTier));
  assert.equal(machine.fieldApprovalStatuses["operating.housingTechTier"], "Approved");
}

/**
 * A nested Machine BOM must be a directed acyclic graph: cycles would make
 * manufacturing quantities recursively infinite. Keep a full path in errors.
 */
function assertAcyclicMachineBoms(graph) {
  const visited = new Set();
  const active = new Set();
  const path = [];
  function visit(id) {
    if (active.has(id)) {
      const cycleStart = path.indexOf(id);
      throw new Error("Cyclic nested Machine BOM: " +
        [...path.slice(cycleStart), id].join(" -> "));
    }
    if (visited.has(id)) return;
    assert.ok(graph.has(id), "Nested Machine BOM references missing Machine " + id);
    active.add(id);
    path.push(id);
    for (const child of graph.get(id)) visit(child);
    path.pop();
    active.delete(id);
    visited.add(id);
  }
  for (const id of graph.keys()) visit(id);
}

// Exercise direct and indirect cycles, not just the current (valid) catalogue.
assert.throws(() => assertAcyclicMachineBoms(new Map([["a", ["a"]]])),
  /Cyclic nested Machine BOM: a -> a/);
assert.throws(() => assertAcyclicMachineBoms(new Map([
  ["a", ["b"]], ["b", ["c"]], ["c", ["a"]]
])), /Cyclic nested Machine BOM: a -> b -> c -> a/);
assertAcyclicMachineBoms(new Map([["a", ["b"]], ["b", []], ["c", ["b"]]]));
assertAcyclicMachineBoms(new Map(machines.map(machine => [
  machine.id, (machine.manufacturing.nestedMachineInputs || []).map(input => input.machineId)
])));

assert.equal(pending, 14, "14 deliberate compatibility reviews must survive");
assert.equal(fullyApprovedBoms, 5, "Five approved accommodation physical BOMs must survive");
assert.equal(blocked, 7, "Seven remaining truly blocked Machine design records survive; three priced generators are In Review");
assert.equal(priceProposals, 39, "35 original numerical CC proposals plus 4 new user-approved Mobile baselines");
assert.equal(mobileApproved, 15, "15 approved initial Mobile Machine baselines verified with explicit price/mass evidence");
for (const row of reference.machines) assert.ok(ids.machines.has(row.id));
const aliases = new Map(machines.filter(m => m.provenance?.androidDiscoveryWorkingId)
  .map(m => [m.provenance.androidDiscoveryWorkingId, m.id]));
assert.equal(aliases.size, 8);
for (const proposed of reference.unmappedCandidates.machines)
  assert.ok(aliases.has(proposed.id), "Unmapped discovery candidate: " + proposed.id);
const rows = industrialReviewRows("machines", catalogue, reference);
assert.equal(rows.length, 46);
assert.deepEqual(new Set(rows.map(r => r.id)), ids.machines);
const displayed = new Set(rows.flatMap(r => Object.keys(r.fields)));
assert.deepEqual(displayed, new Set(selected.map(d => d.fieldKey)),
  "The Machines grid must expose only its 30 registered columns");
assert.ok(rows.every(r => r.canonical && !("catalogueStatus" in r.fields)));
assert.ok(rows.every(r => !Object.keys(r.fields).some(k =>
  k.startsWith("review.") || k.startsWith("provenance.") ||
  k.startsWith("fieldApprovalStatuses."))));
assert.equal(rows.filter(r => r.fields["image.generated"] === false).length, 4,
  "The ungenerated specialist and haulage Machine identities must remain in the art queue");
const individual = pendingColumnSelection(rows, [...displayed], "machine-ship-reactor");
assert.ok(individual.includes("manufacturing.manufacturerCostCC"));
assert.ok(individual.includes("pendingPartCompatibility"));
const everyone = pendingColumnSelection(rows, [...displayed]);
assert.ok(everyone.includes("manufacturing.finishedPartInputs"));
assert.ok(!everyone.includes("image.generated"));
assert.match(fieldText([{machineId:"machine-conventional-electric-motor",quantity:4}],catalogue),
  /Conventional Electric Motor × 4/);
const broken = { ...machines.find(m => m.amenityProfile),
  fieldApprovalStatuses: { ...machines.find(m => m.amenityProfile).fieldApprovalStatuses,
    "manufacturing.manufacturerQuoteCC": "Approved" } };
assert.throws(() => approvalSummary("machines", broken, flatten(broken), catalogue),
  /disagrees|cannot approve|requires approved price evidence/,
  "Provisional quote must never be treated as approved");
console.log("Machines consolidated: 46 canonical, 30 review fields, 5 approved physical BOMs, 39 numeric CC scenarios (15 user-approved Mobile baseline approvals), 7 blocked designs, 14 pending compatibility edges.");
