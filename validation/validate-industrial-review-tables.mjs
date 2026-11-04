import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { applySubstanceTable, uniqueColumnValues } from "../js/substance-table-data.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
assert.equal(reference.authority, "reference-only-android-industrial-discovery-not-canonical");
assert.match(reference.sourceCommit, /^[0-9a-f]{40}$/);
assert.equal(reference.sourceFiles.length, 10);
const expected = {
  parts: { original: 14, reconciled: 8, total: 19 },
  machines: { original: 34, reconciled: 8, total: 42 },
  buildings: { original: 24, reconciled: 0, total: 24 }
};
const collections = Object.fromEntries(["parts", "machines", "buildings", "columnDefinitions", "approvalStatuses"].map(kind =>
  [kind, load("data/" + ({columnDefinitions:"column-definitions",approvalStatuses:"approval-statuses"}[kind] || kind) + ".json")]));
const allById = new Map(Object.values(collections).flat().map(r => [r.id, r]));
const catalogue = {
  collection: kind => collections[kind] || [],
  get: id => allById.get(id)
};

for (const [kind, totals] of Object.entries(expected)) {
  const canonical = collections[kind];
  const original = new Set(reference[kind].map(row => row.id));
  const candidates = new Set(reference.unmappedCandidates[kind].map(row => row.id));
  const canonicalIds = new Set(canonical.map(row => row.id));
  const aliases = canonical.filter(row => row.provenance?.androidDiscoveryWorkingId)
    .map(row => row.provenance.androidDiscoveryWorkingId);
  assert.equal(canonical.length, totals.total);
  assert.equal(original.size, totals.original);
  assert.equal(candidates.size, totals.reconciled);
  assert.equal(canonicalIds.size, canonical.length);
  const retired = kind === "parts"
    ? new Set(["part-battery-parts", "part-thermal-optical-parts", "part-fabrication-parts"])
    : new Set();
  assert.ok([...original].every(id => canonicalIds.has(id) || retired.has(id)),
    "Historic source identities must be canonical or explicitly retired");
  assert.ok([...retired].every(id => !canonicalIds.has(id)),
    "Retired source Parts must not return to current canonical catalogue");
  assert.equal(new Set(aliases).size, aliases.length, "Candidate aliases must be unique");
  assert.deepEqual(new Set(aliases), candidates, "Every candidate identity must be reconciled");
  assert.ok(aliases.every(id => !canonicalIds.has(id)),
    "Legacy candidate IDs must not become canonical keys");

  const rows = industrialReviewRows(kind, catalogue, reference);
  assert.equal(rows.length, canonical.length, "No duplicate candidate review rows");
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  assert.ok(rows.every(row => row.canonical && row.fields.catalogueStatus === "Canonical"));
  assert.ok(rows.every(row => row.fields.name === row.record.name));
  assert.ok(rows.every(row => ["Not Reviewed", "In Review", "Approved", "Blocked"].includes(row.fields.approval)),
    kind + " should expose consistent shared Approval labels");
  assert.ok(rows.every(row => Array.isArray(row.fields.needsApproval)),
    kind + " should list fields awaiting approval");
  for (const row of rows.filter(row => row.record.provenance?.androidDiscoveryWorkingId)) {
    if (kind === "parts") {
      assert.ok(row.fields.materialApprovalStatus,
        "Consolidated Part must expose one canonical material approval status");
      assert.ok(!("review.materialBOM.review_status" in row.fields),
        "Parts should not duplicate historic status and canonical status columns");
    } else {
      assert.ok(row.fields["review.manufacturingBOM.approval_status"],
        "Unreconciled Machine manufacturing review remains visible");
    }
  }
  assert.equal(applySubstanceTable(rows, ["name"], {}, "name", 1, catalogue).length, rows.length);
  assert.equal(uniqueColumnValues(rows, "catalogueStatus", catalogue).length, 1);
}
const buildings = industrialReviewRows("buildings", catalogue, reference);
const camp = buildings.find(row => row.id === "building-collection-camp");
assert.equal(camp.fields["review.quantitativeBOM.site_construction_labour_hours"], 36);
assert.match(camp.fields["review.systematicReview.review_status"], /APPROVED/);
const quarry = buildings.find(row => row.id === "building-quarry");
assert.match(quarry.fields["review.quantitativeBOM.approval_status"], /UNAPPROVED/);
console.log("Industrial review tables validated: 19 canonical Parts, 42 canonical Machines, 24 Buildings; three retired source IDs ignored.");
