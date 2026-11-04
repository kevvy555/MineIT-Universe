import { createSubstanceTable } from "./substance-table.js";

// Reference tables render the same manifest-loaded canonical records used by
// the four catalogue review grids. They are intentionally read-only.
const configurations = {
  approvalStatuses: {
    title: "Approval Statuses",
    description: "One shared vocabulary for all catalogue approval reviews. The source records are in the canonical Universe manifest.",
    defaultColumns: ["name", "description", "sortOrder"],
    groups: [
      { name: "Status", fields: ["name", "id", "sortOrder"] },
      { name: "Meaning & Governance", fields: ["description", "scope", "canonStatus"] }
    ]
  },
  columnDefinitions: {
    title: "Column Definitions",
    description: "Every available column in the Substances, Parts, Machines and Buildings grids, including its shared approval requirement.",
    defaultColumns: ["name", "table", "category", "requiresApproval", "approvalPolicy", "fieldKey"],
    columnLabels: {
      table: "Catalogue Table",
      category: "Column Category",
      requiresApproval: "Requires Approval",
      approvalPolicy: "Approval Policy",
      fieldKey: "Field Key"
    },
    groups: [
      { name: "Column Identity", fields: ["name", "table", "fieldKey", "id"] },
      { name: "Classification", fields: ["category", "description"] },
      { name: "Approval Governance", fields: ["requiresApproval", "approvalPolicy"] }
    ]
  }
};
export function createApprovalReferenceTables() {
  return Object.fromEntries(Object.entries(configurations).map(([kind, config]) =>
    [kind, createSubstanceTable({
      ...config, tableKind: kind, storageKey: "mineitApprovalReference-" + kind,
      rows(catalogue) {
        return catalogue.collection(kind).map(record => ({
          id: record.id, record, collection: kind, canonical: true,
          fields: { ...record }
        })).sort((a, b) => a.record.name.localeCompare(b.record.name));
      },
      sourceNote() {
        return "Read-only canonical governance data from data/ via the Universe manifest. Change the source registry and validate it to update these definitions.";
      }
    })]));
}
