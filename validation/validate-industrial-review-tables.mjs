import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { industrialReviewRows } from "../js/industrial-table.js";
import { applySubstanceTable, uniqueColumnValues } from "../js/substance-table-data.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const reference = load("game-specs/mineit-mobile/industrial-discovery-reference.json");
assert.equal(reference.authority, "reference-only-android-industrial-discovery-not-canonical");
assert.match(reference.sourceCommit, /^[0-9a-f]{40}$/);
assert.equal(reference.sourceFiles.length, 10);

const expected = { parts: [14, 8], machines: [34, 8], buildings: [24, 0] };
for (const kind of ["parts", "machines", "buildings"]) {
  const canonical = load("data/" + kind + ".json");
  const candidates = new Set(reference.unmappedCandidates[kind].map(row => row.id));
  const canonicalIds = new Set(canonical.map(row => row.id));
  const reviewIds = new Set(reference[kind].map(row => row.id));
  const catalogue = {
    collection: collection => collection === kind ? canonical : [],
    get: id => canonical.find(row => row.id === id)
  };
  assert.equal(canonical.length, expected[kind][0]);
  assert.equal(candidates.size, expected[kind][1]);
  assert.equal(canonicalIds.size, canonical.length);
  assert.deepEqual(reviewIds, canonicalIds, "All canonical IDs matched by Android review");
  assert.ok([...candidates].every(id => !canonicalIds.has(id)),
    "Candidate identities must not shadow canonical records");

  const rows = industrialReviewRows(kind, catalogue, reference);
  assert.equal(rows.length, canonical.length + candidates.size);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  assert.ok(rows.every(row => typeof row.record.name === "string" && row.record.name));
  assert.ok(rows.filter(row => !row.canonical).every(row =>
    row.fields.catalogueStatus === "Discovery candidate — not canonical"));
  assert.ok(rows.filter(row => row.canonical).every(row =>
    row.fields.catalogueStatus === "Canonical"));
  assert.ok(rows.every(row => row.fields.name === row.record.name));
  assert.equal(applySubstanceTable(rows, ["name"], {}, "name", 1, catalogue).length,
    rows.length);
  assert.ok(uniqueColumnValues(rows, "catalogueStatus", catalogue).length > 0);
}
const b = load("data/buildings.json");
const catalogue = { collection: kind => kind === "buildings" ? b : [],
  get: id => b.find(row => row.id === id) };
const rows = industrialReviewRows("buildings", catalogue, reference);
const camp = rows.find(row => row.id === "building-collection-camp");
assert.equal(camp.fields["review.quantitativeBOM.site_construction_labour_hours"], 36);
assert.match(camp.fields["review.systematicReview.review_status"], /APPROVED/);
const quarry = rows.find(row => row.id === "building-quarry");
assert.match(quarry.fields["review.quantitativeBOM.approval_status"], /UNAPPROVED/);
assert.ok(rows.every(row => row.canonical), "No unsupported building identity promoted");
console.log("Industrial review tables validated: 22 Parts, 42 Machines, 24 Buildings.");
