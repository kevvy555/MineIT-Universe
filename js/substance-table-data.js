// Substance bulk-view projections are read-only and generated from canonical manifest collections.
import { approvalSummary } from "./catalogue-approval.js";
const simple = value => Array.isArray(value) ? value.join(", ") :
  value === true ? "Yes" : value === false ? "No" :
  value == null ? "" : String(value);

function flatten(record, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(record || {})) {
    const name = prefix ? prefix + "." + key : key;
    if (value && !Array.isArray(value) && typeof value === "object") flatten(value, name, result);
    else result[name] = value;
  }
  return result;
}

export function substanceRows(catalogue, androidReference) {
  const tuning = new Map((androidReference?.resources || []).map(item => [item.resourceId, item]));
  const occurrence = new Map(catalogue.collection("mobileResourceOccurrenceProfiles")
    .map(item => [item.resourceId, item]));
  const result = [];
  const add = (collection, kind) => {
    for (const record of catalogue.collection(collection)) {
      const generic = record.genericSubstanceId ? catalogue.get(record.genericSubstanceId) : null;
      const fields = flatten(record);
      fields["image.preview"] = record.image?.generated && record.image?.key
        ? "Available" : record.image ? "Not generated" : "No image metadata";
      fields.kind = typeof kind === "function" ? kind(record) : kind;
      fields.archetype = record.dominantArchetype || generic?.dominantArchetype ||
        (collection === "mobileBiologicalResources" ? "Organic" : "");
      fields.genericClassName = collection === "substances" ? record.name : generic?.name || "";
      if (collection === "substances") fields.materialStage = record.refined ? "refined" : "raw";
      else if (collection === "mobileResourceDefinitions") fields.materialStage = "raw";
      else if (collection === "mobileBiologicalResources") delete fields.materialStage;

      // The bulk review table presents one normalized value for each classification
      // concept. The canonical records retain these source fields for consumers that
      // need their exact schema-specific representation.
      delete fields.entityType;
      delete fields.dominantArchetype;
      delete fields.genericSubstanceId;
      delete fields.refined;
      if (occurrence.has(record.id)) flatten(occurrence.get(record.id), "occurrence", fields);
      if (tuning.has(record.id)) flatten(tuning.get(record.id), "android", fields);
      const summary = approvalSummary("substances", record, fields, catalogue);
      fields.approval = summary.approval;
      fields.needsApproval = summary.needsApproval;
      result.push({ id: record.id, record, collection, fields });
    }
  };
  // Generic raw/refined categories own the canonical material art under
  // assets/art/universe/substances, so they are first-class review rows.
  add("substances", record => record.sourceSection === "Mobile familiar-resource integration"
    ? "Ontology parent category"
    : (record.refined ? "Refined substance category" : "Raw substance category"));
  add("mobileResourceDefinitions", "Natural resource");
  add("namedSubstances", "Named material");
  add("mobileBiologicalResources", "Biological food");
  return result.sort((a, b) => a.record.name.localeCompare(b.record.name));
}

export const DEFAULT_COLUMNS = ["name", "image.preview", "kind", "archetype", "genericClassName",
  "gameplayCategory", "materialStage", "approval", "needsApproval", "renewable",
  "canonStatus", "android.baseScan"];

// The ten designer-approved categories govern the UI and preserve the original JSON
// field names. They do not create a second data source or change catalogue records.
export const SUBSTANCE_COLUMN_GROUPS = [
  {
    "name": "Identity & Classification",
    "fields": [
      "name",
      "id",
      "kind",
      "archetype",
      "genericClassName",
      "classificationStatus",
      "materialStage",
      "substanceType",
      "standardState",
      "form",
      "tier"
    ]
  },
  {
    "name": "Properties & Applications",
    "fields": [
      "description",
      "industrialRole",
      "stockBehaviour",
      "renewable",
      "naturalOccurrence",
      "thermalBehaviour",
      "visualDescription"
    ]
  },
  {
    "name": "Production & Materials",
    "fields": [
      "sourceRawResourceIds",
      "upstreamMaterialIds",
      "upstreamInputDescription"
    ]
  },
  {
    "name": "Game Integration",
    "fields": [
      "gameId",
      "gameplayCategory",
      "mobileKey"
    ]
  },
  {
    "name": "Governance & Approval",
    "fields": [
      "approval",
      "needsApproval",
      "canonStatus",
      "discoveryStatus",
      "knowledgeScope"
    ]
  },
  {
    "name": "Geological Occurrence",
    "fields": [
      "occurrence.id",
      "occurrence.name",
      "occurrence.resourceId",
      "occurrence.canonStatus",
      "occurrence.knowledgeScope",
      "occurrence.naturalOccurrence",
      "occurrence.occurrenceClass",
      "occurrence.worldTypeEligibility",
      "occurrence.allowedCelestialBodyKindIds",
      "occurrence.eligibleWorldTypeIds",
      "occurrence.preferredWorldTypeIds",
      "occurrence.excludedWorldTypeIds",
      "occurrence.primaryExtractionZoneIds",
      "occurrence.secondaryExtractionZoneIds",
      "occurrence.preferredGeologyProvinceIds",
      "occurrence.requiredBiomeIds",
      "occurrence.requiredHydrosphereIds",
      "occurrence.excludedAtmosphereTypeIds",
      "occurrence.notes"
    ]
  },
  {
    "name": "Biology & Agriculture",
    "fields": [
      "naturalOccurrenceAllowed",
      "manufactured",
      "introducedAgricultureAllowed",
      "controlledAgricultureAllowed",
      "allowedCelestialBodyKindIds",
      "naturalWorldTypeIds",
      "openAgricultureWorldTypeIds",
      "requiredNaturalBiomeIds",
      "requiredNaturalHydrosphereIds",
      "excludedLandformIds",
      "notes"
    ]
  },
  {
    "name": "Game Balancing — Android",
    "fields": [
      "android.resourceId",
      "android.rarity",
      "android.weight",
      "android.qualityBias",
      "android.baseScan",
      "android.baselineExtractionMethod",
      "android.baselineExtractionFamily",
      "android.basePrice",
      "android.operationalTags",
      "android.legacyAliases"
    ]
  },
  {
    "name": "Sources & Provenance",
    "fields": [
      "provenance.sourceRepository",
      "provenance.sourcePath",
      "provenance.approvedDate",
      "sourceProvenance.repository",
      "sourceProvenance.path",
      "sourceProvenance.workingId",
      "sourceDocumentId",
      "sourceSection"
    ]
  },
  {
    "name": "Artwork & Visuals",
    "fields": [
      "image.preview",
      "image.key",
      "image.generated",
      "image.status",
      "image.promptDescription",
      "image.notes"
    ]
  }
];

const groupByField = new Map(SUBSTANCE_COLUMN_GROUPS.flatMap(group =>
  group.fields.map(field => [field, group.name])));

export function columnGroup(key) {
  // Newly introduced fields remain accessible; tests require deliberate classification.
  return groupByField.get(key) || 'Uncategorised';
}

export function allSubstanceFields(rows) {
  const available = new Set(rows.flatMap(row => Object.keys(row.fields)));
  const ordered = SUBSTANCE_COLUMN_GROUPS.flatMap(group =>
    group.fields.filter(field => available.delete(field)));
  return [...ordered, ...[...available].sort((a, b) => a.localeCompare(b))];
}

export function selectionForCategory(current, fields, selected) {
  const next = new Set(current);
  for (const field of fields) {
    if (selected) next.add(field);
    else if (field !== 'name') next.delete(field);
  }
  next.add('name'); // Name always remains as the route back to details.
  return [...next];
}

export function fieldLabel(key) {
  if (key === "genericClassName") return "Generic Class";
  const label = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\./g, " / ").replace(/_/g, " ")
    .replace(/Ids\b/g, "IDs").replace(/\bId\b/g, "ID")
    .replace(/\bmobile\b/gi, "Mobile");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function fieldText(value, catalogue) {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) return value.map(item => fieldText(item, catalogue)).filter(Boolean).join(", ");
  if (typeof value === "string" && catalogue?.get(value)) return catalogue.get(value).name;
  if (value && typeof value === "object") {
    if (value.supersededFamily && Array.isArray(value.candidatePartIds))
      return value.supersededFamily + ": " + value.candidatePartIds
        .map(id => catalogue?.get(id)?.name || id).join(" / ") + " (pending)";
    if (value.machineId) return (catalogue?.get(value.machineId)?.name || value.machineId) +
      " × " + value.quantity;
    if (value.partId) return (catalogue?.get(value.partId)?.name || value.partId) +
      " × " + value.quantity;
    if (value.materialId) return (catalogue?.get(value.materialId)?.name || value.materialId) +
      " × " + value.quantityKg + " kg";
    if (value.substanceId) {
      const name = catalogue?.get(value.substanceId)?.name || value.substanceId;
      const qty = Number.isFinite(value.quantityKg) ?
        " · " + value.quantityKg + " kg" : "";
      const use = value.requirement?.startsWith("conditional") ? " (conditional)" :
        value.approval === "planning-only-unqualified" ? " (unqualified)" :
        value.requirement?.startsWith("upstream") ? " (upstream)" : "";
      return name + qty + use;
    }
    if (value.label) return value.label +
      (Number.isFinite(value.planningAllowanceKg) ?
      " · " + value.planningAllowanceKg + " kg (unresolved)" : " (unresolved)");
    return JSON.stringify(value);
  }
  return simple(value);
}

// A checked value is an exact inclusion match, not a substring. Array-valued columns
// (biomes, operational tags, etc.) expose and match each individual member.
export function valueToken(value) {
  return value === null || value === undefined || value === ""
    ? "blank" : typeof value + ":" +
      (value && typeof value === "object" ? JSON.stringify(value) : String(value));
}

export function rowValueTokens(value) {
  if (Array.isArray(value)) return value.length
    ? [...new Set(value.map(valueToken))] : ["blank"];
  return [valueToken(value)];
}

export function uniqueColumnValues(rows, key, catalogue) {
  const choices = new Map();
  for (const row of rows) {
    const values = row.fields[key];
    const entries = Array.isArray(values) ? (values.length ? values : [null]) : [values];
    const seen = new Set();
    for (const value of entries) {
      const token = valueToken(value);
      if (seen.has(token)) continue;
      seen.add(token);
      if (!choices.has(token)) choices.set(token, {
        token, label: token === "blank" ? "(No value)" : fieldText(value, catalogue),
        value, count: 0
      });
      choices.get(token).count++;
    }
  }
  return [...choices.values()].sort((a, b) => {
    if (a.token === "blank") return 1;
    if (b.token === "blank") return -1;
    if (typeof a.value === "number" && typeof b.value === "number")
      return a.value - b.value;
    return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" });
  });
}

export function applySubstanceTable(rows, columns, filters = {}, sortKey = "name",
  direction = 1, catalogue, selectedValues = {}) {
  const found = rows.filter(row => columns.every(key => {
    const filter = String(filters[key] || "").trim().toLowerCase();
    const value = row.fields[key];
    if (filter) {
      const numeric = filter.match(/^(>=|<=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/);
      if (numeric && typeof value === "number") {
        const n = Number(numeric[2]);
        if (!({ ">": value > n, "<": value < n, "=": value === n,
          ">=": value >= n, "<=": value <= n })[numeric[1]]) return false;
      } else if (!fieldText(value, catalogue).toLowerCase().includes(filter) &&
                 !simple(value).toLowerCase().includes(filter)) return false;
    }
    const allowed = selectedValues[key];
    if (allowed?.size && !rowValueTokens(value).some(token => allowed.has(token))) return false;
    return true;
  }));
  found.sort((a, b) => {
    const x = a.fields[sortKey], y = b.fields[sortKey];
    if (x == null || x === "") return y == null || y === "" ? a.record.name.localeCompare(b.record.name) : 1;
    if (y == null || y === "") return -1;
    const n = typeof x === "number" && typeof y === "number" ? x - y :
      fieldText(x, catalogue).localeCompare(fieldText(y, catalogue), undefined, { numeric: true, sensitivity: "base" });
    return n ? direction * n : a.record.name.localeCompare(b.record.name);
  });
  return found;
}
