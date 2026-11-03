import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { substanceRows, allSubstanceFields, applySubstanceTable } from "../js/substance-table-data.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const collections = {
  substances: load("data/substances.json"),
  mobileResourceDefinitions: load("data/mobile-resource-definitions.json"),
  mobileResourceOccurrenceProfiles: load("data/mobile-resource-occurrence-profiles.json"),
  mobileBiologicalResources: load("data/mobile-biological-resources.json"),
  namedSubstances: load("data/named-substances.json")
};
const all = Object.values(collections).flat();
const byId = new Map(all.map(record => [record.id, record]));
const catalogue = {
  get: id => byId.get(id),
  collection: name => collections[name] || []
};
const reference = load("game-specs/mineit-mobile/resource-balance-reference.json");
assert.equal(reference.authority, "reference-only-android-owned-gameplay-balance");
assert.match(reference.sourceCommit, /^[0-9a-f]{40}$/);
assert.equal(reference.resources.length, 42);
assert.deepEqual(new Set(reference.resources.map(r => r.resourceId)),
  new Set(collections.mobileResourceDefinitions.map(r => r.id)));
assert.equal(new Set(reference.resources.map(r => r.resourceId)).size, 42);

const rows = substanceRows(catalogue, reference);
assert.equal(rows.length, 191, "80 generic + 42 raw + 62 named + 7 biological");
assert.equal(new Set(rows.map(row => row.id)).size, rows.length, "No duplicated resources");
assert.equal(rows.filter(row => row.fields.kind === "Biological food").length, 7);
assert.equal(rows.filter(row => row.fields.kind === "Named material").length, 62);
assert.equal(rows.filter(row => row.fields.kind === "Natural resource").length, 42);
assert.equal(rows.find(row => row.id === "mobile-resource-iron-ore").fields.genericClassName,
  "Structural Metal Ore");
assert.ok(rows.find(row => row.id === "mobile-resource-iron-ore").fields["android.baseScan"]);
assert.ok(rows.find(row => row.id === "mobile-resource-iron-ore").fields["occurrence.primaryExtractionZoneIds"]);
const keys = allSubstanceFields(rows);
assert.ok(keys.includes("android.basePrice"));
assert.ok(keys.includes("occurrence.eligibleWorldTypeIds"));
assert.ok(keys.includes("image.status"));
assert.ok(keys.includes("sourceProvenance.path"));
const filtered = applySubstanceTable(rows, ["name", "android.baseScan"],
  { "android.baseScan": ">=6" }, "android.baseScan", -1, catalogue);
assert.ok(filtered.length > 0);
assert.ok(filtered.every(r => r.fields["android.baseScan"] >= 6));
const byName = applySubstanceTable(rows, ["name"], { name: "refined iron" }, "name", 1, catalogue);
assert.deepEqual(byName.map(r => r.record.name), ["Refined Iron"]);
console.log("Substances review valid:", rows.length, "unique records,", keys.length, "available fields.");
