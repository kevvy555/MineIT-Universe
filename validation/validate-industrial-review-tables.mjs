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
  parts: { original: 14, reconciled: 8, total: 22 },
  machines: { original: 34, reconciled: 8, total: 42 },
  buildings: { original: 24, reconciled: 0, total: 24 }
};
const collections = Object.fromEntries(["parts", "machines", "buildings"].map(kind =>
  [kind, load("data/" + kind + ".json")]));
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
  assert.ok([...original].every(id => canonicalIds.has(id)));
  assert.equal(new Set(aliases).size, aliases.length, "Candidate aliases must be unique");
  assert.deepEqual(new Set(aliases), candidates, "Every candidate identity must be reconciled");
  assert.ok(aliases.every(id => !canonicalIds.has(id)),
    "Legacy candidate IDs must not become canonical keys");

  const rows = industrialReviewRows(kind, catalogue, reference);
  assert.equal(rows.length, canonical.length, "No duplicate candidate review rows");
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  assert.ok(rows.every(row => row.canonical && row.fields.catalogueStatus === "Canonical"));
  assert.ok(rows.every(row => row.fields.name === row.record.name));
  for (const row of rows.filter(row => row.record.provenance?.androidDiscoveryWorkingId)) {
    assert.ok(row.fields["review.materialBOM.review_status"] ||
      row.fields["review.manufacturingBOM.approval_status"],
      "Promoted record should retain its source discovery overlay");
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
console.log("Industrial review tables validated: 22 canonical Parts, 42 canonical Machines, 24 Buildings; no candidate duplicates.");
