// Read-only approval projection from canonical records and the shared column registry.
// Historic discovery statuses remain evidence, not automatically approved prices/recipes.
export const validApprovalStatuses = new Set([
  "Not Reviewed", "Draft", "Proposed", "In Review",
  "Approved", "Blocked", "Rejected", "Superseded"
]);

function fieldState(kind, record, key, value) {
  const recorded = record.fieldApprovalStatuses?.[key];
  if (recorded && validApprovalStatuses.has(recorded)) return recorded;
  if (kind === "substances") {
    return key === "classificationStatus" && record.classificationStatus === "classified"
      ? "Approved" : "In Review";
  }
  if (kind === "parts") {
    if (key === "materialInputs")
      return record.materialApprovalStatus === "APPROVED" ? "Approved" : "In Review";
    if (key === "planningReference.finishedMassKg")
      return record.materialApprovalStatus === "APPROVED" && Number.isFinite(value)
        ? "Approved" : Number.isFinite(value) ? "In Review" : "Blocked";
    return Number.isFinite(value) ? "In Review" : "Blocked";
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
  const approval = values.length === 0 ? "Not Reviewed" :
    values.every(value => value === "Approved") ? "Approved" :
    values.includes("Blocked") ? "Blocked" : "In Review";
  return { approval, needsApproval: pending, fieldStates: states };
}

export function partMassReview(part) {
  const inputs = part.materialInputs || [];
  const required = inputs.filter(input => !input.requirement?.startsWith("conditional") &&
    input.requirement !== "upstream-precursor");
  if (!required.length || required.some(input => !Number.isFinite(input.quantityKg)))
    return "Pending material quantities";
  const inputKg = required.reduce((sum, input) => sum + input.quantityKg, 0);
  const optionalKg = inputs.filter(input => input.requirement?.startsWith("conditional") &&
    Number.isFinite(input.quantityKg)).reduce((sum, input) => sum + input.quantityKg, 0);
  const mass = part.planningReference?.finishedMassKg;
  if (!Number.isFinite(mass)) return "Finished weight pending";
  const round = value => Math.round(value * 100) / 100;
  const delta = round(inputKg - mass);
  const base = `${round(inputKg)} kg inputs vs ${mass} kg finished`;
  return delta === 0 && !optionalKg ? "Matched: " + base :
    base + ` (difference ${delta > 0 ? "+" : ""}${delta} kg)` +
    (optionalKg ? `; conditional +${round(optionalKg)} kg` : "") +
    " — reconcile process losses, options or weight";
}
