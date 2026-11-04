import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { substanceRows } from "../js/substance-table-data.js";
import { approvalSummary, validApprovalStatuses } from "../js/catalogue-approval.js";
import { pendingColumnSelection } from "../js/substance-table.js";
import { createApprovalReferenceTables } from "../js/approval-tables.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const manifest = load("data/manifest.json");
assert.equal(manifest.collections.approvalStatuses, "approval-statuses.json");
assert.equal(manifest.collections.columnDefinitions, "column-definitions.json");
const collections = {
  parts: load("data/parts.json"),
  machines: load("data/machines.json"),
  buildings: load("data/buildings.json"),
  namedSubstances: load("data/named-substances.json"),
  mobileResourceDefinitions: load("data/mobile-resource-definitions.json"),
  mobileResourceOccurrenceProfiles: load("data/mobile-resource-occurrence-profiles.json"),
  mobileBiologicalResources: load("data/mobile-biological-resources.json"),
  substances: load("data/substances.json"),
  approvalStatuses: load("data/approval-statuses.json"),
  columnDefinitions: load("data/column-definitions.json")
};
const byId = new Map(Object.values(collections).flat().map(row => [row.id, row]));
const catalogue = { collection: kind => collections[kind] || [], get: id => byId.get(id) };
const statuses = collections.approvalStatuses;
const definitions = collections.columnDefinitions;

assert.equal(statuses.length, 8);
assert.deepEqual(new Set(statuses.map(s => s.name)), validApprovalStatuses);
assert.equal(new Set(statuses.map(s => s.id)).size, statuses.length);
assert.deepEqual(statuses.map(s => s.sortOrder), [1,2,3,4,5,6,7,8]);
assert.equal(new Set(definitions.map(d => d.id)).size, definitions.length);
assert.equal(new Set(definitions.map(d => d.table + ":" + d.fieldKey)).size, definitions.length);
assert.ok(definitions.every(d => ["substances", "parts", "machines", "buildings"].includes(d.table) &&
  d.fieldKey && d.name && d.category && typeof d.requiresApproval === "boolean"));
assert.ok(definitions.every(d => !d.requiresApproval || d.approvalPolicy));
assert.deepEqual(new Set(["substances", "parts", "machines", "buildings"]),
  new Set(definitions.map(d => d.table)));
const tables = createApprovalReferenceTables();
assert.deepEqual(new Set(Object.keys(tables)),
  new Set(["approvalStatuses", "columnDefinitions"]));

const industrialReference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
const resourceReference = load("game-specs/mineit-mobile/resource-balance-reference.json");
for (const kind of ["substances", "parts", "machines", "buildings"]) {
  const rows = kind === "substances"
    ? substanceRows(catalogue, resourceReference)
    : industrialReviewRows(kind, catalogue, industrialReference);
  const registered = new Set(definitions.filter(d => d.table === kind).map(d => d.fieldKey));
  const actual = new Set(rows.flatMap(row => Object.keys(row.fields)));
  assert.deepEqual(registered, actual, kind + ": every selectable field must be in the canonical registry");
  assert.ok(rows.every(row => validApprovalStatuses.has(row.fields.approval)),
    kind + ": all rows have a shared Approval state");
  assert.ok(rows.every(row => Array.isArray(row.fields.needsApproval)),
    kind + ": all rows identify review-required fields");
  assert.ok(rows.every(row => row.fields.needsApproval.every(label => typeof label === "string")),
    kind + ": Needs Approval should contain readable field names");
}

const partDefinitions = definitions.filter(d => d.table === "parts");
const partRequired = partDefinitions.filter(d => d.requiresApproval).map(d => d.fieldKey);
assert.deepEqual(new Set(partRequired), new Set([
  "partRole", "finishedUnitCount", "finishedUnitDescription", "materialInputs",
  "planningReference.finishedMassKg", "planningReference.manufacturerCostCC",
  "planningReference.baseManufacturerQuoteCC"
]));
assert.ok(!partDefinitions.some(d => d.fieldKey === "materialApprovalStatus"),
  "Old Part-specific approval column must be retired from the shared registry");
assert.equal(partDefinitions.length, 20,
  "The Parts review table only exposes necessary designer-facing columns");
const excluded = [
  "massReview", "partImage", "unresolvedMaterialInputs",
  "planningReference.basis", "planningReference.status", "planningReference.sourceSection",
  "image.key", "image.status", "image.notes", "image.promptDescription"
];
assert.ok(!partDefinitions.some(d => excluded.includes(d.fieldKey) ||
  d.fieldKey.startsWith("provenance.") ||
  d.fieldKey.startsWith("fieldApprovalStatuses.")),
  "Source audit metadata, duplicate status fields, and removed review columns stay out of Parts");
assert.deepEqual(partDefinitions.filter(d => d.fieldKey.startsWith("image."))
  .map(d => d.fieldKey), ["image.generated"],
  "The Parts review grid keeps only Image Generated as a Yes/No field");
for (const part of collections.parts) {
  assert.ok(validApprovalStatuses.has(part.approval));
  assert.equal(Object.hasOwn(part, "materialApprovalStatus"), false);
  assert.equal(Object.hasOwn(part, "needsApproval"), false,
    "Needs Approval must be derived, never saved as a competing status");
  assert.deepEqual(new Set(Object.keys(part.fieldApprovalStatuses || {})),
    new Set(partRequired), part.id + " must persist every explicit field decision");
  assert.ok(Object.values(part.fieldApprovalStatuses).every(value => validApprovalStatuses.has(value)));
}
assert.equal(collections.parts.filter(p => p.approval === "Blocked").length, 1);
assert.equal(collections.parts.filter(p => p.approval === "In Review").length, 18);

const machineDefinitions = definitions.filter(d => d.table === "machines");
const machineRequired = machineDefinitions.filter(d => d.requiresApproval)
  .map(d => d.fieldKey);
assert.equal(machineDefinitions.length, 25,
  "The Machines review offers exactly 25 designer-facing fields");
assert.deepEqual(new Set(machineRequired), new Set([
  "manufacturing.finishedPartInputs", "manufacturing.directMaterialInputs",
  "manufacturing.nestedMachineInputs", "manufacturing.assemblyHours",
  "manufacturing.factoryHours", "manufacturing.testHours",
  "manufacturing.goodUnitYield", "manufacturing.finishedMassKg",
  "manufacturing.manufacturerCostCC", "manufacturing.manufacturerQuoteCC",
  "operatingProfile.ratedCapacity", "operatingProfile.operatingPowerUnits",
  "operatingProfile.footprintM2", "pendingPartCompatibility",
  "inputSummary", "outputSummary"
]));
assert.ok(machineDefinitions.every(d => !d.fieldKey.startsWith("review.") &&
  !d.fieldKey.startsWith("provenance.") &&
  !d.fieldKey.startsWith("fieldApprovalStatuses.") &&
  !d.fieldKey.startsWith("approvedPhysicalBOM.") &&
  !d.fieldKey.startsWith("amenityProfile.")));
assert.deepEqual(machineDefinitions.filter(d => d.fieldKey.startsWith("image."))
  .map(d => d.fieldKey), ["image.generated"]);
for (const machine of collections.machines) {
  assert.ok(validApprovalStatuses.has(machine.approval));
  assert.deepEqual(new Set(Object.keys(machine.fieldApprovalStatuses || {})),
    new Set(machineRequired), machine.id + " must persist every explicit field decision");
  assert.ok(!Object.hasOwn(machine, "needsApproval"));
  assert.ok(!Object.hasOwn(machine, "approvedPhysicalBOM"));
  assert.ok(!Object.hasOwn(machine, "amenityProfile"));
  assert.ok(!machine.manufacturing || machine.manufacturing.authority);
}
const machineRows = industrialReviewRows("machines", catalogue, industrialReference);
assert.equal(machineRows.length, 42);
assert.equal(machineRows.filter(row => row.fields.approval === "Blocked").length, 7);
assert.equal(machineRows.filter(row => row.fields.approval === "In Review").length, 35);
const terminal = machineRows.find(row => row.id === "machine-personal-recreation-terminal");
assert.ok(!terminal.fields.needsApproval.includes("Direct Material Inputs"),
  "Approved residential manufacturing materials are not awaiting reapproval");
assert.ok(terminal.fields.needsApproval.includes("Manufacturer Cost (CC)"));
assert.ok(terminal.fields.needsApproval.includes("Finished Weight (kg)"));
const machinePossible = machineDefinitions.map(d => d.fieldKey);
assert.ok(!pendingColumnSelection(machineRows, machinePossible, terminal.id)
  .includes("manufacturing.finishedPartInputs"));
assert.ok(pendingColumnSelection(machineRows, machinePossible, terminal.id)
  .includes("manufacturing.manufacturerQuoteCC"));
assert.ok(pendingColumnSelection(machineRows, machinePossible).includes("inputSummary"),
  "Global outstanding shortcut includes still-missing operating design fields");
assert.throws(() => approvalSummary("machines", {
  ...terminal.record, approval: "Approved"
}, terminal.fields, catalogue), /disagrees with explicit field statuses/);
assert.throws(() => approvalSummary("machines", {
  ...terminal.record, fieldApprovalStatuses: {
    ...terminal.record.fieldApprovalStatuses,
    "manufacturing.manufacturerCostCC": "Approved"
  }
}, terminal.fields, catalogue), /cannot approve absent Machine field/);

const parts = industrialReviewRows("parts", catalogue, industrialReference);
const battery = parts.find(row => row.id === "part-lithium-based-battery-module");
const nuclear = parts.find(row => row.id === "part-nuclear-fuel-assembly");
const concrete = parts.find(row => row.id === "part-precast-concrete-sections");
assert.equal(battery.fields.approval, "In Review",
  "Recipe and finished weight are approved, but old manufacturer pricing is still provisional");
assert.ok(!battery.fields.needsApproval.includes("Material Inputs"));
assert.ok(!battery.fields.needsApproval.includes("Weight (kg)"));
assert.ok(battery.fields.needsApproval.includes("Manufacturer Cost (CC)"));
assert.ok(battery.fields.needsApproval.includes("Manufacturer Quote Cost (CC)"));
assert.ok(!Object.hasOwn(battery.fields, "massReview"));
assert.ok(!Object.hasOwn(battery.fields, "partImage"));
assert.equal(battery.fields["image.generated"], true);
assert.equal(nuclear.fields.approval, "Blocked",
  "Nuclear reactor quantities/price must not be treated as approved");
assert.ok(nuclear.fields.needsApproval.includes("Material Inputs"));
assert.ok(!Object.hasOwn(nuclear.fields, "massReview"));
assert.ok(concrete.fields.needsApproval.includes("Weight (kg)"));
assert.ok(!Object.hasOwn(concrete.fields, "massReview"));
assert.ok(collections.parts.every(p => !p.unresolvedMaterialInputs?.length),
  "The resolved material-identity placeholders may not return");
const fission = substanceRows(catalogue, resourceReference)
  .find(row => row.id === "named-substance-fission-fuel-material");
assert.equal(fission.fields.approval, "In Review");
assert.deepEqual(fission.fields.needsApproval, ["Classification Status"]);
assert.equal(approvalSummary("parts", battery.record, battery.fields, catalogue).approval, "In Review");
assert.throws(() => approvalSummary("parts",
  { ...battery.record, approval: "Approved" }, battery.fields, catalogue),
  /disagrees with explicit field statuses/,
  "Authoritative overall Approval cannot drift away from persisted field statuses");
const incomplete = { ...battery.record, fieldApprovalStatuses:
  { ...battery.record.fieldApprovalStatuses } };
delete incomplete.fieldApprovalStatuses.materialInputs;
assert.throws(() => approvalSummary("parts", incomplete, battery.fields, catalogue),
  /missing or invalid explicit approval/,
  "A missing field decision must fail rather than silently inheriting old approval");
const possible = partDefinitions.map(definition => definition.fieldKey);
assert.deepEqual(pendingColumnSelection(parts, possible, battery.id), [
  "name", "approval", "needsApproval",
  "planningReference.baseManufacturerQuoteCC", "planningReference.manufacturerCostCC"
], "Per-Part Show fields must select only the unapproved columns for that Part");
assert.ok(pendingColumnSelection(parts, possible, nuclear.id).includes("materialInputs"));
assert.ok(pendingColumnSelection(parts, possible, nuclear.id)
  .includes("planningReference.finishedMassKg"));
assert.ok(pendingColumnSelection(parts, possible).includes("finishedUnitDescription"),
  "The global shortcut must select the union of unapproved fields across Parts");
assert.ok(!pendingColumnSelection(parts, possible).includes("partRole"),
  "Already-approved Part roles must not appear in pending-field column selections");
assert.equal(pendingColumnSelection(parts, possible, "nonexistent").length, 3,
  "An unrecognised row cannot expose unrelated pending columns");
console.log("Approval governance validated: " + statuses.length + " statuses, " +
  definitions.length + " registered columns, 4 grids, 2 reference tables, and pending decisions preserved.");
