import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { substanceRows, allSubstanceFields, applySubstanceTable,
  uniqueColumnValues, valueToken, rowValueTokens, SUBSTANCE_COLUMN_GROUPS,
  columnGroup, selectionForCategory } from "../js/substance-table-data.js";

const load = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const collections = {
  substances: load("data/substances.json"),
  mobileResourceDefinitions: load("data/mobile-resource-definitions.json"),
  mobileResourceOccurrenceProfiles: load("data/mobile-resource-occurrence-profiles.json"),
  mobileBiologicalResources: load("data/mobile-biological-resources.json"),
  namedSubstances: load("data/named-substances.json"),
  approvalStatuses: load("data/approval-statuses.json"),
  columnDefinitions: load("data/column-definitions.json")
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
assert.equal(rows.length, 206, "92 generic + 42 natural + 65 named + 7 biological");
assert.equal(rows.filter(row => row.collection === "substances").length, 92);
assert.equal(collections.substances.length, 92);
assert.equal(new Set(rows.map(row => row.id)).size, rows.length, "No duplicated resources");
assert.equal(rows.filter(row => row.fields.kind === "Biological food").length, 7);
assert.equal(rows.filter(row => row.fields.kind === "Named material").length, 65);
assert.equal(rows.filter(row => row.fields.kind === "Natural resource").length, 42);
assert.equal(rows.filter(row => row.fields.kind === "Raw substance category").length, 42);
assert.equal(rows.filter(row => row.fields.kind === "Refined substance category").length, 45);
assert.equal(rows.filter(row => row.fields.kind === "Ontology parent category").length, 5);
assert.equal(rows.find(row => row.id === "mobile-resource-iron-ore").fields.genericClassName,
  "Structural Metal Ore");
assert.equal(rows.find(row => row.id === "substance-structural-metal-ore").fields.materialStage,
  "raw", "Raw generic categories use the consolidated material-stage field");
assert.equal(rows.find(row => row.id === "substance-refined-structural-metal").fields.materialStage,
  "refined", "Refined generic categories use the consolidated material-stage field");
assert.equal(rows.find(row => row.id === "mobile-resource-iron-ore").fields.materialStage,
  "raw", "Natural resources use the consolidated material-stage field");
assert.equal(rows.find(row => row.id === "mobile-food-crops").fields.materialStage, undefined,
  "Biological foods do not receive an inapplicable material stage");
assert.ok(rows.find(row => row.id === "mobile-resource-iron-ore").fields["android.baseScan"]);
assert.ok(rows.find(row => row.id === "mobile-resource-iron-ore").fields["occurrence.primaryExtractionZoneIds"]);
const keys = allSubstanceFields(rows);
assert.ok(keys.includes("android.basePrice"));
assert.ok(keys.includes("occurrence.eligibleWorldTypeIds"));
assert.ok(keys.includes("image.status"));
assert.ok(keys.includes("image.preview"));
assert.equal(rows.find(row => row.id === "mobile-resource-iron-ore").fields["image.preview"],
  "Available");
assert.equal(rows.find(row => row.id === "named-substance-aluminium").fields["image.preview"],
  "Available");
assert.equal(rows.find(row => row.id === "substance-refined-structural-metal").fields["image.preview"],
  "Available");
assert.equal(rows.find(row => row.id === "substance-carbonate-mineral").fields["image.preview"],
  "Available");
assert.ok(rows.every(row => row.fields["image.preview"] === "Available"),
  "Every substance-table row must have a generated catalogue image");
assert.ok(keys.includes("sourceProvenance.path"));
assert.ok(keys.includes("upstreamMaterialIds"), "LFP cathode source links must remain reviewable");
assert.ok(keys.includes("approval") && keys.includes("needsApproval"),
  "Every substance row exposes the shared review columns");
for (const duplicateField of ["entityType", "dominantArchetype", "genericSubstanceId", "refined"]) {
  assert.ok(!keys.includes(duplicateField), duplicateField + " is consolidated in the table projection");
}
assert.equal(rows.find(row => row.id === "named-substance-fission-fuel-material").fields.approval,
  "Approved", "Approved fission-fuel classification must resolve through the shared class");
const approvedClassificationLinks = new Map([
  ["named-substance-cement", "substance-hydraulic-binder"],
  ["named-substance-cemented-tungsten-carbide", "substance-cemented-carbide-composite"],
  ["named-substance-electronic-grade-silicon", "substance-refined-semiconductor-material"],
  ["named-substance-engineered-veyrite-lattice", "substance-engineered-phase-coherent-lattice"],
  ["named-substance-fission-fuel-material", "substance-refined-fission-fuel"],
  ["named-substance-fusion-fuel", "substance-manufactured-fusion-fuel"],
  ["named-substance-lfp-battery-electrolyte", "substance-nonaqueous-electrolyte"],
  ["named-substance-lfp-cathode-material", "substance-battery-cathode-compound"],
  ["named-substance-lithium-carbonate", "substance-refined-carbonate-salt"],
  ["named-substance-natural-veyrite", "substance-phase-coherent-mineral"],
  ["named-substance-refined-gold", "substance-refined-precious-metal"],
  ["named-substance-refined-palladium", "substance-refined-precious-metal"],
  ["named-substance-refined-platinum", "substance-refined-precious-metal"],
  ["named-substance-refined-silver", "substance-refined-precious-metal"],
  ["named-substance-spent-nuclear-fuel", "substance-irradiated-nuclear-material"]
]);
for (const [recordId, genericId] of approvedClassificationLinks) {
  const record = collections.namedSubstances.find(item => item.id === recordId);
  assert.equal(record.genericSubstanceId, genericId, recordId + " uses the approved generic class");
  assert.equal(record.classificationStatus, "classified", recordId + " is no longer a data gap");
  assert.ok(collections.substances.some(item => item.id === genericId), genericId + " must resolve");
}
assert.equal(collections.namedSubstances.filter(record => !record.genericSubstanceId).length, 0,
  "Every current named material has an approved generic class");
const lfpMaterialRows = rows.filter(row => row.id === "named-substance-lfp-cathode-material" ||
  row.id === "named-substance-lfp-battery-electrolyte");
assert.equal(lfpMaterialRows.length, 2, "Both stockable refined battery materials must appear");
assert.ok(lfpMaterialRows.every(row => row.fields.materialStage === "processed" &&
  row.fields.stockBehaviour === "stockable"));
assert.deepEqual(rows.find(row => row.id === "named-substance-lfp-cathode-material").fields.upstreamMaterialIds,
  ["named-substance-lithium-carbonate"]);
assert.deepEqual(rows.find(row => row.id === "named-substance-fission-fuel-material").fields.upstreamMaterialIds,
  ["named-substance-uranium-concentrate"]);
const fissionFuel = rows.find(row => row.id === "named-substance-fission-fuel-material");
assert.equal(fissionFuel.fields.materialStage, "processed");
assert.equal(fissionFuel.fields.stockBehaviour, "stockable");
const filtered = applySubstanceTable(rows, ["name", "android.baseScan"],
  { "android.baseScan": ">=6" }, "android.baseScan", -1, catalogue);
assert.ok(filtered.length > 0);
assert.ok(filtered.every(r => r.fields["android.baseScan"] >= 6));
const byName = applySubstanceTable(rows, ["name"], { name: "refined iron" }, "name", 1, catalogue);
assert.deepEqual(byName.map(r => r.record.name), ["Refined Iron"]);
assert.equal(keys[0], "name", "Name is always the first available column");
assert.ok(keys.indexOf("kind") < keys.indexOf("android.baseScan"), "Identity precedes Android reference");

// All current fields must belong to exactly one of the ten approved categories.
assert.deepEqual(SUBSTANCE_COLUMN_GROUPS.map(group => group.name), [
  "Identity & Classification", "Properties & Applications", "Production & Materials",
  "Game Integration", "Governance & Approval", "Geological Occurrence",
  "Biology & Agriculture", "Game Balancing — Android",
  "Sources & Provenance", "Artwork & Visuals"
]);
const groupedFields = SUBSTANCE_COLUMN_GROUPS.flatMap(group => group.fields);
assert.equal(groupedFields.length, 83, "The consolidated current column set is preserved");
assert.equal(new Set(groupedFields).size, 83, "Every field belongs to one category");
assert.deepEqual(new Set(groupedFields), new Set(keys), "No missing or extra field definitions");
assert.ok(SUBSTANCE_COLUMN_GROUPS.every(group => group.fields.length > 0));
for (const group of SUBSTANCE_COLUMN_GROUPS) {
  assert.ok(group.fields.every(field => columnGroup(field) === group.name),
    "Column grouping must be stable and explicit");
}
const geological = SUBSTANCE_COLUMN_GROUPS.find(group => group.name === "Geological Occurrence");
const baseline = ["name", "kind", "android.baseScan"];
const geologySelected = selectionForCategory(baseline, geological.fields, true);
assert.equal(geologySelected.length, baseline.length + geological.fields.length);
assert.ok(geological.fields.every(field => geologySelected.includes(field)));
assert.deepEqual(new Set(selectionForCategory(geologySelected, geological.fields, false)),
  new Set(baseline), "Deselecting one category must preserve selections in other categories");
const identity = SUBSTANCE_COLUMN_GROUPS.find(group => group.name === "Identity & Classification");
assert.deepEqual(identity.fields, [
  "name", "id", "kind", "archetype", "genericClassName", "classificationStatus",
  "materialStage", "substanceType", "standardState", "form", "tier"
], "Identity & Classification exposes one field per review concept");
assert.deepEqual(selectionForCategory(identity.fields, identity.fields, false), ["name"],
  "Name cannot be deselected, including by category clear");
assert.deepEqual(new Set(selectionForCategory([], keys, true)), new Set(keys),
  "Global select includes all available columns");
assert.deepEqual(selectionForCategory(keys, keys, false), ["name"],
  "Global deselect leaves only the required Name column");

const kindOptions = uniqueColumnValues(rows, "kind", catalogue);
assert.deepEqual(kindOptions.map(x => x.label), [
  "Biological food", "Named material", "Natural resource", "Ontology parent category",
  "Raw substance category", "Refined substance category"
]);
assert.equal(kindOptions.reduce((sum, entry) => sum + entry.count, 0), rows.length);
const selectedKinds = { kind: new Set([valueToken("Natural resource"), valueToken("Named material")]) };
const included = applySubstanceTable(rows, ["kind"], {}, "name", 1, catalogue, selectedKinds);
assert.equal(included.length,
  collections.mobileResourceDefinitions.length + collections.namedSubstances.length,
  "Selected dropdown values combine with OR within one column");
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
assert.equal(missingScan.length, rows.length - reference.resources.length,
  "The no-value option filters missing Android fields");
const scanChoice = uniqueColumnValues(rows, "android.baseScan", catalogue);
assert.ok(scanChoice.some(x => x.token === "number:1"));
assert.ok(scanChoice.some(x => x.token === "blank"));
const combined = applySubstanceTable(rows, ["kind", "name"], {name:"iron"}, "name", 1, catalogue,
  {kind:new Set([valueToken("Named material")])});
assert.ok(combined.length >= 2 && combined.some(row => row.record.name === "Refined Iron"),
  "Combined filters retain matching named refined materials");
assert.ok(combined.every(row => row.fields.kind === "Named material" &&
  row.record.name.toLowerCase().includes("iron")),
  "Combined filters match all named materials containing iron, including LFP cathode");

const directoryCss = readFileSync(new URL("../css/substance-table.css", import.meta.url), "utf8");
const directoryApp = readFileSync(new URL("../js/universe-app.js", import.meta.url), "utf8");
const tableApp = readFileSync(new URL("../js/substance-table.js", import.meta.url), "utf8");
assert.ok(!directoryCss.includes(".workspace.substance-table-mode"),
  "The bulk table must not hide the catalogue tree or occupy the full workspace");
assert.ok(!directoryApp.includes("classList.toggle('substance-table-mode'"),
  "The Directory must preserve the original split-pane presentation");
assert.match(directoryCss, /\.substance-review-tools details\{width:100%;max-width:none/,
  "The column selector should span the entire right-hand table pane");
assert.match(directoryCss, /\.substance-pick-grid\{width:100%;max-height:none;overflow:visible/,
  "Column-selection checkboxes must have no nested scroll container");
assert.match(tableApp, /groups\.map\(group/,
  "Render ten categories at once without collapsed subsections");
assert.match(tableApp, /data-group-select/,
  "Every category has a Select all control");
assert.match(tableApp, /data-group-clear/,
  "Every category has a Deselect all control");
assert.match(tableApp, /data-column-group/,
  "Group headings must be visible in the expanded column chooser");
assert.match(tableApp, /renderImageCell/,
  "The substance table must render canonical image assets as previews");
assert.match(directoryCss, /\.substance-pick-grid\{width:100%;max-height:none;overflow:visible/,
  "The category chooser must remain unscrollable");
assert.match(directoryCss,
  /\.substance-pick-grid\{width:100%;max-height:none;overflow:visible;\s*display:grid;grid-template-columns:repeat\(auto-fit,/,
  "Category panels must flow horizontally across available width and wrap responsively");
assert.doesNotMatch(directoryCss,
  /\.substance-pick-grid\{[^}]*flex-direction:column/,
  "Categories must not occupy one full-width vertical row each");
assert.match(directoryCss,
  /\.substance-category-fields\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,
  "Category checkboxes should remain compact and readable");

console.log("Substances review valid:", rows.length, "unique records,", keys.length,
  "fields; multi-select value filters and sort ordering verified.");
