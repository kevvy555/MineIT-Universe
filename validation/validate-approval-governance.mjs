import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { substanceRows } from "../js/substance-table-data.js";
import { approvalSummary, partMassReview, validApprovalStatuses } from "../js/catalogue-approval.js";
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
assert.equal(battery.fields.massReview, "Matched: 18 kg inputs vs 18 kg finished");
assert.equal(nuclear.fields.approval, "Blocked",
  "Nuclear reactor quantities/price must not be treated as approved");
assert.ok(nuclear.fields.needsApproval.includes("Material Inputs"));
assert.match(nuclear.fields.massReview, /Pending material quantities/);
assert.ok(concrete.fields.needsApproval.includes("Weight (kg)"));
assert.match(concrete.fields.massReview, /conditional/);
assert.ok(collections.parts.every(p => !p.unresolvedMaterialInputs?.length),
  "The resolved material-identity placeholders may not return");
const fission = substanceRows(catalogue, resourceReference)
  .find(row => row.id === "named-substance-fission-fuel-material");
assert.equal(fission.fields.approval, "In Review");
assert.deepEqual(fission.fields.needsApproval, ["classificationStatus"]);
assert.equal(approvalSummary("parts", battery.record, battery.fields, catalogue).approval, "In Review");
assert.match(partMassReview(concrete.record), /reconcile/);
console.log("Approval governance validated: " + statuses.length + " statuses, " +
  definitions.length + " registered columns, 4 grids, 2 reference tables, and pending decisions preserved.");
