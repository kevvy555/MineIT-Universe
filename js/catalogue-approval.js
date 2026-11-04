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
  if (kind === "machines") {
    if (!validApprovalStatuses.has(recorded))
      throw new Error(record.id + ": missing or invalid explicit approval for " + key);
    // A no-replacement decision is not an automatic approval. A field can be
    // explicitly inapplicable only when its data does not contradict that claim.
    if (record.fieldApplicability?.[key] === false) {
      const empty = value == null || value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (!empty) throw new Error(record.id + ": inapplicable field contains data: " + key);
      return null;
    }
    if (recorded === "Approved") {
      const missing = value == null || value === "" ||
        (Array.isArray(value) && value.length === 0);
      if (missing) throw new Error(record.id + ": cannot approve absent Machine field " + key);
      if (key === "manufacturing.directMaterialInputs" &&
        value.some(input => input.qualification === "grade-tbd" ||
          !Number.isFinite(input.quantityKg) || input.quantityKg <= 0))
        throw new Error(record.id + ": cannot approve unqualified Machine material BOM");
      if (key === "operatingProfile.ratedCapacity" &&
        (!(value.quantity > 0) || !value.unit))
        throw new Error(record.id + ": invalid approved capacity and unit");
      if (key === "manufacturing.goodUnitYield" && !(value > 0 && value <= 1))
        throw new Error(record.id + ": invalid approved manufacturing yield");
      if (key === "pendingPartCompatibility")
        throw new Error(record.id + ": pending compatibility cannot be approved while unresolved");
    }
    return recorded;
  }
  if (recorded && validApprovalStatuses.has(recorded)) return recorded;
  if (kind === "substances") {
    return key === "classificationStatus" && record.classificationStatus === "classified"
      ? "Approved" : "In Review";
  }
  // Building and Substance reference snapshots still use projected statuses.
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
    // Parts and Machines require explicit decisions even for missing values.
    // Buildings/Substances retain legacy optional projection rules.
    if (!["parts", "machines"].includes(kind) &&
        (value === undefined || value === null || value === "")) continue;
    const state = fieldState(kind, record, key, value);
    if (state === null) continue; // Explicitly non-applicable, not approved.
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
  if (kind === "parts" || kind === "machines") {
    if (!validApprovalStatuses.has(record.approval)) {
      throw new Error(record.id + ": missing or invalid canonical " + kind + " approval");
    }
    if (record.approval !== derived) {
      throw new Error(record.id + ": canonical Approval " + record.approval +
        " disagrees with explicit field statuses (" + derived + ")");
    }
  }
  return { approval: ["parts", "machines"].includes(kind) ? record.approval : derived,
    needsApproval: pending, fieldStates: states };
}

