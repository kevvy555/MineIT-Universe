// Substance bulk-view projections are read-only and generated from canonical manifest collections.
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
      fields.kind = kind;
      fields.archetype = record.dominantArchetype || generic?.dominantArchetype ||
        (collection === "mobileBiologicalResources" ? "Organic" : "");
      fields.genericClassName = generic?.name || "";
      if (occurrence.has(record.id)) flatten(occurrence.get(record.id), "occurrence", fields);
      if (tuning.has(record.id)) flatten(tuning.get(record.id), "android", fields);
      result.push({ id: record.id, record, collection, fields });
    }
  };
  add("substances", "Generic class");
  add("mobileResourceDefinitions", "Natural resource");
  add("namedSubstances", "Named material");
  add("mobileBiologicalResources", "Biological food");
  return result.sort((a, b) => a.record.name.localeCompare(b.record.name));
}

export const DEFAULT_COLUMNS = ["name", "kind", "archetype", "genericClassName",
  "gameplayCategory", "materialStage", "renewable", "canonStatus", "android.baseScan"];

export function allSubstanceFields(rows) {
  const keys = new Set(rows.flatMap(row => Object.keys(row.fields)));
  const groupOrder = ["Identity", "Generic substance class", "Named materials",
    "Resource and gameplay metadata", "Occurrence and geology", "Biological food",
    "Android reference only", "Sources and provenance", "Artwork"];
  const identityOrder = ["name", "kind", "archetype", "genericClassName",
    "id", "genericSubstanceId", "description", "canonStatus"];
  return [...keys].sort((a, b) => {
    const ga = groupOrder.indexOf(columnGroup(a)), gb = groupOrder.indexOf(columnGroup(b));
    if (ga !== gb) return ga - gb;
    const ia = identityOrder.indexOf(a), ib = identityOrder.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return fieldLabel(a).localeCompare(fieldLabel(b));
  });
}

export function columnGroup(key) {
  if (key.startsWith("android.")) return "Android reference only";
  if (key.startsWith("occurrence.")) return "Occurrence and geology";
  if (key.startsWith("image.")) return "Artwork";
  if (key.startsWith("provenance.") || key.startsWith("sourceProvenance.") ||
    key.startsWith("source")) return "Sources and provenance";
  if (["name", "id", "kind", "archetype", "genericClassName", "genericSubstanceId",
    "description", "canonStatus", "entityType"].includes(key)) return "Identity";
  if (["substanceType", "thermalBehaviour", "standardState", "form", "refined",
    "tier", "industrialRole"].includes(key)) return "Generic substance class";
  if (["materialStage", "stockBehaviour", "classificationStatus", "discoveryStatus",
    "sourceRawResourceIds", "upstreamInputDescription"].includes(key)) return "Named materials";
  if (key.includes("Agriculture") || key.includes("Natural") || ["manufactured",
    "naturalOccurrenceAllowed", "notes", "excludedLandformIds"].includes(key)) return "Biological food";
  return "Resource and gameplay metadata";
}

export function fieldLabel(key) {
  const label = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\./g, " / ")
    .replace(/Ids\b/g, "IDs").replace(/\bId\b/g, "ID")
    .replace(/\bmobile\b/gi, "Mobile");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function fieldText(value, catalogue) {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) return value.map(item => fieldText(item, catalogue)).filter(Boolean).join(", ");
  if (typeof value === "string" && catalogue?.get(value)) return catalogue.get(value).name;
  return simple(value);
}

// A checked value is an exact inclusion match, not a substring. Array-valued columns
// (biomes, operational tags, etc.) expose and match each individual member.
export function valueToken(value) {
  return value === null || value === undefined || value === ""
    ? "blank" : typeof value + ":" + String(value);
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
