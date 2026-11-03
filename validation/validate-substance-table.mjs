import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { substanceRows, allSubstanceFields, applySubstanceTable,
  uniqueColumnValues, valueToken, rowValueTokens } from "../js/substance-table-data.js";

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
assert.equal(keys[0], "name", "Name is always the first available column");
assert.ok(keys.indexOf("kind") < keys.indexOf("android.baseScan"), "Identity precedes Android reference");

const kindOptions = uniqueColumnValues(rows, "kind", catalogue);
assert.deepEqual(kindOptions.map(x => x.label), ["Biological food", "Generic class", "Named material", "Natural resource"]);
assert.equal(kindOptions.reduce((sum, entry) => sum + entry.count, 0), rows.length);
const selectedKinds = { kind: new Set([valueToken("Natural resource"), valueToken("Named material")]) };
const included = applySubstanceTable(rows, ["kind"], {}, "name", 1, catalogue, selectedKinds);
assert.equal(included.length, 104, "Selected dropdown values combine with OR within one column");
const metalsOnly = applySubstanceTable(rows, ["kind", "archetype"], {}, "name", 1, catalogue,
  { kind: new Set([valueToken("Natural resource")]), archetype: new Set([valueToken("Metal")]) });
assert.ok(metalsOnly.length > 0 && metalsOnly.length < 42);
assert.ok(metalsOnly.every(row => row.fields.kind === "Natural resource" && row.fields.archetype === "Metal"),
  "Separate column selections combine with AND");

const tags = uniqueColumnValues(rows, "android.operationalTags", catalogue);
assert.ok(tags.some(entry => entry.label === "refining-feedstock"),
  "Array-valued fields offer individual named options");
const withTag = applySubstanceTable(rows, ["android.operationalTags"], {}, "name", 1, catalogue,
  { "android.operationalTags": new Set([valueToken("refining-feedstock")]) });
assert.ok(withTag.length > 0);
assert.ok(withTag.every(row => row.fields["android.operationalTags"]?.includes("refining-feedstock")));
assert.deepEqual(rowValueTokens([]), ["blank"]);
const missingScan = applySubstanceTable(rows, ["android.baseScan"], {}, "name", 1, catalogue,
  { "android.baseScan": new Set(["blank"]) });
assert.equal(missingScan.length, 191 - 42, "The no-value option filters missing Android fields");
const scanChoice = uniqueColumnValues(rows, "android.baseScan", catalogue);
assert.ok(scanChoice.some(x => x.token === "number:1"));
assert.ok(scanChoice.some(x => x.token === "blank"));
const combined = applySubstanceTable(rows, ["kind", "name"], {name:"iron"}, "name", 1, catalogue,
  {kind:new Set([valueToken("Named material")])});
assert.deepEqual(combined.map(x=>x.record.name), ["Refined Iron"]);

console.log("Substances review valid:", rows.length, "unique records,", keys.length,
  "fields; multi-select value filters and sort ordering verified.");
