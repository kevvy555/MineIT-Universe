// Read-only approval projection from canonical records and the shared column registry.
// Historic discovery statuses remain evidence, not automatically approved prices/recipes.
export const validApprovalStatuses = new Set([
  "Not Reviewed", "Draft", "Proposed", "In Review",
  "Approved", "Blocked", "Rejected", "Superseded"
]);

function fieldState(kind, record, key, value) {
  const recorded = record.fieldApprovalStatuses?.[key];
  if (kind === "parts") {
    if (!validApprovalStatuses.has(recorded)) {
      throw new Error(record.id + ": missing or invalid explicit approval for " + key);
    }
    if (recorded === "Approved") {
      const missing = value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (missing) throw new Error(record.id + ": cannot approve absent field " + key);
      if (key === "materialInputs" && value.some(input =>
        input.approval === "planning-only-unqualified" ||
        (input.requirement === "standard" && !Number.isFinite(input.quantityKg))))
        throw new Error(record.id + ": cannot approve incomplete material recipe");
    }
    return recorded;
  }
  if (recorded && validApprovalStatuses.has(recorded)) return recorded;
  if (kind === "substances") {
    return key === "classificationStatus" && record.classificationStatus === "classified"
      ? "Approved" : "In Review";
  }
  // A proposal in the imported Android discovery snapshot is not a canonical
  // authorisation. Missing fields are not automatically assumed required.
  if (kind === "machines" && key === "approvedPhysicalBOM.directMaterialInputs" &&
    /^APPROVED/i.test(record.approvedPhysicalBOM?.approval || "")) return "Approved";
  return "In Review";
}

export function approvalSummary(kind, record, fields, catalogue) {
  const definitions = catalogue.collection("columnDefinitions")
    .filter(column => column.table === kind && column.requiresApproval);
  const pending = [];
  const states = {};
  for (const definition of definitions) {
    const key = definition.fieldKey;
    const value = fields[key];
    // Only parts require every declared review field. Legacy Machine/Building
    // fields may not apply, and natural resources have no classification field.
    if (kind !== "parts" && (value === undefined || value === null || value === "")) continue;
    const state = fieldState(kind, record, key, value);
    states[key] = state;
    if (state !== "Approved") pending.push(definition.name);
  }
  const values = Object.values(states);
  const derived = values.length === 0 || values.every(value => value === "Not Reviewed")
    ? "Not Reviewed" :
    values.every(value => value === "Approved") ? "Approved" :
    values.includes("Blocked") ? "Blocked" :
    values.includes("Rejected") ? "Rejected" :
    values.every(value => value === "Superseded") ? "Superseded" :
    values.every(value => ["Draft", "Not Reviewed"].includes(value)) ? "Draft" :
    values.every(value => ["Proposed", "Not Reviewed"].includes(value)) ? "Proposed" :
    "In Review";
  if (kind === "parts") {
    if (!validApprovalStatuses.has(record.approval)) {
      throw new Error(record.id + ": missing or invalid canonical Part approval");
    }
    if (record.approval !== derived) {
      throw new Error(record.id + ": canonical Approval " + record.approval +
        " disagrees with explicit field statuses (" + derived + ")");
    }
  }
  return { approval: kind === "parts" ? record.approval : derived,
    needsApproval: pending, fieldStates: states };
}

