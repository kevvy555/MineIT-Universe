import { createSubstanceTable } from "./substance-table.js";
import { approvalSummary } from "./catalogue-approval.js";

// This is a read-only projection, not an independently authored industrial catalogue.
// Canonical identities and relationships are loaded from the Universe manifest.
const flatten = (record, prefix = "", result = {}) => {
  for (const [key, value] of Object.entries(record || {})) {
    const field = prefix ? prefix + "." + key : key;
    if (value && !Array.isArray(value) && typeof value === "object")
      flatten(value, field, result);
    else result[field] = prefix.startsWith('review') && typeof value === 'string' &&
      /^-?\d+(?:\.\d+)?$/.test(value) ? Number(value) : value;
  }
  return result;
};
const group = (name, fields) => ({ name, fields: fields.split(" ") });
const common = [
  group("Identity & Classification", "name id catalogueStatus entityType category subCategory subCategories categories buildingType sources"),
  group("Canon & Provenance", "canonStatus provenance.desktopPath image.notes")
];
const visuals = group("Artwork & Visuals",
  "image.key image.generated image.status image.promptDescription mobileLevelAtlas.key mobileLevelAtlas.generated mobileLevelAtlas.status");

const configurations = {
  parts: {
    title: "Parts",
    description: "19 finished Part products. Three superseded generic Parts were retired; unresolved Machine and research relationships remain pending review. Quantities, masses and CC prices are discovery planning references, not live game recipes or prices.",
    defaultColumns: ["name", "category", "subCategory", "finishedUnitCount", "materialInputs",
      "approval", "needsApproval", "image.generated", "planningReference.finishedMassKg",
      "planningReference.manufacturerCostCC", "planningReference.baseManufacturerQuoteCC"],
    pendingColumnAction: true,
    columnLabels: {
      finishedUnitCount: "FinishedUnitCount",
      finishedUnitDescription: "Finished Unit Description",
      "planningReference.finishedMassKg": "Weight (kg)",
      "planningReference.manufacturerCostCC": "Manufacturer Cost (CC)",
      "planningReference.baseManufacturerQuoteCC": "Manufacturer Quote Cost (CC)",
      "image.generated": "Image Generated",
      approval: "Approval",
      needsApproval: "Needs Approval"
    },
    linkedFields: ["substanceIds", "materialInputs", "machineIds"],
    groups: [
      group("Identity & Classification",
        "name id partRole category subCategory subCategories sources finishedUnitCount finishedUnitDescription"),
      group("Materials & Construction",
        "substanceIds materialInputs"),
      group("Machines & Usage", "machineIds"),
      group("Production & Prices",
        "planningReference.finishedMassKg planningReference.manufacturerCostCC planningReference.baseManufacturerQuoteCC"),
      group("Discovery & Approval", "approval needsApproval"),
      group("Canon", "canonStatus"),
      group("Artwork & Visuals", "image.generated"),
      group("Description", "description")
    ]
  },
  machines: {
    title: "Machines",
    description: "42 canonical Machines. Physical designs, operating ratings and manufacturer prices remain independently reviewable; historical proposals are never approved by import.",
    defaultColumns: ["name", "category", "manufacturing.finishedPartInputs",
      "approval", "needsApproval", "manufacturing.manufacturerCostCC", "image.generated"],
    pendingColumnAction: true,
    linkedFields: ["manufacturing.finishedPartInputs", "manufacturing.directMaterialInputs",
      "manufacturing.nestedMachineInputs", "buildingCompatibilityIds"],
    groups: [
      group("Identity & Classification", "name category subCategory description"),
      group("Physical Construction",
        "manufacturing.finishedPartInputs manufacturing.directMaterialInputs manufacturing.nestedMachineInputs pendingPartCompatibility"),
      group("Operation & Capabilities",
        "outputSummary inputSummary operatingProfile.ratedCapacity operatingProfile.operatingPowerUnits operatingProfile.footprintM2 buildingCompatibilityIds technologyUnlock"),
      group("Manufacturing & Pricing",
        "manufacturing.assemblyHours manufacturing.factoryHours manufacturing.testHours manufacturing.goodUnitYield manufacturing.finishedMassKg manufacturing.manufacturerCostCC manufacturing.manufacturerQuoteCC"),
      group("Discovery & Approval", "approval needsApproval"),
      group("Artwork & Visuals", "image.generated")
    ]
  },
  buildings: {
    title: "Buildings",
    description: "Canonical Buildings with Android construction BOMs, machine-fit proposals, costs and review states. No provisional proposal is gameplay canon.",
    defaultColumns: ["name", "category", "buildingType", "machineIds",
      "approval", "needsApproval",
      "review.quantitativeBOM.structural_shell_and_fit_out_inputs_kg",
      "review.quantitativeBOM.site_construction_labour_hours"],
    groups: [
      common[0],
      group("Structural Shell & Fit-out",
        "structuralShellSubstanceIds fitOutSubstanceIds review.bomCoverage.source_shell_substance_ids_unquantified review.bomCoverage.source_fit_out_substance_ids_unquantified"),
      group("Construction BOM & Labour",
        "review.quantitativeBOM.unit_definition review.quantitativeBOM.structural_shell_and_fit_out_inputs_kg review.quantitativeBOM.site_construction_labour_hours review.quantitativeBOM.installed_structure_material_mass_kg review.quantitativeBOM.transportable_nonlocal_material_mass_kg_if_aggregate_locally_sourced"),
      group("Machinery & Installation",
        "machineIds review.systematicReview.source_candidate_machine_ids_not_obligatory review.systematicReview.proposed_required_machine_direction review.bomCoverage.source_candidate_installed_machine_ids_not_all_mandatory review.bomCoverage.installed_machine_counts_status review.quantitativeBOM.proposed_required_machine_ids_and_counts review.quantitativeBOM.optional_machine_ids_conditional"),
      group("Production, Capacity & Progression",
        "review.quantitativeBOM.source_android_gameplay_cost_and_constraints review.bomCoverage.site_specific_notes review.systematicReview.key_system_or_asset_issue"),
      group("Condition & Ownership", "review.bomCoverage.condition_and_title_valuation_status"),
      group("Economics & Valuation",
        "review.quantitativeBOM.direct_material_cost_CC_status review.quantitativeBOM.labour_cost_CC_partial review.quantitativeBOM.base_installed_construction_cost_CC review.quantitativeBOM.base_new_build_sell_quote_CC"),
      group("Discovery & Approval",
        "approval needsApproval review.systematicReview.review_order review.systematicReview.review_status review.systematicReview.numeric_bom_reference review.bomCoverage.review_status review.bomCoverage.shell_construction_material_quantities_status review.quantitativeBOM.approval_status review.quantitativeBOM.unresolved_dependencies"),
      common[1], visuals, group("Description", "description")
    ]
  }
};

// Source-specific fields are classified alongside their related primary attributes.
const additionalGroupFields = {
  buildings: {
    "Identity & Classification": "review.systematicReview.building_name review.bomCoverage.building_name review.quantitativeBOM.building_name",
    "Canon & Provenance": "provenance.mobile.path provenance.mobile.kind provenance.mobile.displayName provenance.scope",
    "Artwork & Visuals": "mobileLevelAtlas.frameWidth mobileLevelAtlas.frameHeight mobileLevelAtlas.frameOrder mobileLevelAtlas.notes image.modelPrompt"
  }
};

export async function loadIndustrialDiscoveryReference() {
  try {
    const response = await fetch("./game-specs/mineit-mobile/industrial-discovery-reference.json",
      { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const reference = await response.json();
    if (reference.authority !== "reference-only-android-industrial-discovery-not-canonical")
      throw new Error("Unexpected industrial snapshot provenance");
    return reference;
  } catch (error) {
    console.warn("Android industrial discovery snapshot unavailable:", error);
    return null;
  }
}

export function industrialReviewRows(kind, catalogue, reference) {
  if (!["parts", "machines", "buildings"].includes(kind))
    throw new Error("Unsupported industrial catalogue: " + kind);
  const canonicalRecords = catalogue.collection(kind);
  // Parts and Machines use their registered column sets as allow-lists.
  // Preserve full provenance and approval evidence under data/; show the
  // single relevant review surface instead of exposing imported snapshots.
  const reviewedColumns = ["parts", "machines"].includes(kind) ?
    new Set(catalogue.collection("columnDefinitions")
      .filter(definition => definition.table === kind)
      .map(definition => definition.fieldKey)) : null;
  const aliases = new Map(canonicalRecords
    .filter(record => record.provenance?.androidDiscoveryWorkingId)
    .map(record => [record.provenance.androidDiscoveryWorkingId, record.id]));
  const source = new Map((reference?.[kind] || []).map(row => [row.id, row.review]));
  // Candidate discovery IDs are historical source keys, not additional entities
  // after their approved identity is reconciled into the canonical collection.
  const candidates = new Map();
  for (const candidate of reference?.unmappedCandidates?.[kind] || []) {
    const canonicalId = aliases.get(candidate.id);
    if (canonicalId) {
      const review = source.get(canonicalId) || {};
      review[candidate.section] = candidate.fields;
      source.set(canonicalId, review);
      continue;
    }
    const row = candidates.get(candidate.id) || {
      id: candidate.id, name: "", review: {}
    };
    row.name ||= candidate.fields.product_name || candidate.fields.machine_name ||
      candidate.fields.candidate_machine_name || candidate.fields.name || "";
    row.review[candidate.section] = candidate.fields;
    candidates.set(candidate.id, row);
  }
  const canonicalRows = canonicalRecords.map(record => {
    const fields = flatten(record);
    fields.catalogueStatus = "Canonical";
    // Canonical Parts and Machines already contain their typed review data.
    // The Android snapshot remains read-only history, never a competing grid.
    if (kind === "buildings" && source.has(record.id))
      flatten(source.get(record.id), "review", fields);
    if (kind === "machines") {
      // Missing capability summaries remain visible/approval-pending, not
      // silently omitted from an individual Machine's 25-column review.
      fields.inputSummary = record.inputSummary ?? null;
      fields.outputSummary = record.outputSummary ?? null;
      fields["operatingProfile.ratedCapacity"] = record.operatingProfile?.ratedCapacity ?? null;
      fields.pendingPartCompatibility = (record.pendingPartCompatibility || [])
        .map(item => item.supersededFamily);
      fields.buildingCompatibilityIds = catalogue.collection("buildings")
        .filter(building => (building.machineIds || []).includes(record.id))
        .map(building => building.id);
      const unlocks = catalogue.collection("researchTechnologies")
        .filter(tech => (tech.unlockedMachineIds || []).includes(record.id))
        .map(tech => tech.name);
      if (record.operatingProfile?.housingTechnologyTier)
        unlocks.push("Housing T" + record.operatingProfile.housingTechnologyTier);
      fields.technologyUnlock = unlocks;
    }
    const summary = approvalSummary(kind, record, fields, catalogue);
    fields.approval = summary.approval;
    fields.needsApproval = summary.needsApproval;
    if (reviewedColumns) {
      for (const field of Object.keys(fields))
        if (!reviewedColumns.has(field)) delete fields[field];
    }
    const pendingColumnKeys = Object.entries(summary.fieldStates)
      .filter(([, status]) => status !== "Approved")
      .map(([field]) => field);
    return { id: record.id, record, collection: kind, fields, canonical: true, pendingColumnKeys };
  });
  // Any still-unmapped proposal remains visibly non-canonical.
  const reviewRows = [...candidates.values()].map(candidate => {
    const record = {
      id: candidate.id, name: candidate.name || candidate.id,
      catalogueStatus: "Discovery candidate — not canonical"
    };
    const fields = flatten(record);
    flatten(candidate.review, "review", fields);
    fields.approval = "Proposed";
    fields.needsApproval = ["Canonical identity"];
    return { id: candidate.id, record, collection: kind,
      fields, canonical: false };
  });
  return [...canonicalRows, ...reviewRows]
    .sort((a, b) => a.record.name.localeCompare(b.record.name));
}

export function createIndustrialTables() {
  return Object.fromEntries(Object.entries(configurations).map(([kind, config]) =>
    [kind, createSubstanceTable({
      ...config,
      tableKind: kind,
      groups: config.groups.map(group => ({
        ...group,
        fields: [...group.fields,
          ...(additionalGroupFields[kind]?.[group.name] || "").split(" ").filter(Boolean)]
      })),
      // Fresh Machine and Parts column sets keep obsolete 103-column selections
      // from hiding the new review actions or carrying removed audit fields.
      storageKey: kind === "parts" ? "mineitPartsReviewColumns" :
        kind === "machines" ? "mineitMachinesReviewColumns" :
        "mineit" + config.title + "Columns",
      rows(catalogue, reference) {
        return industrialReviewRows(kind, catalogue, reference);
      },
      sourceNote(reference) {
        if (kind === "parts")
          return "Parts identities, material links and planning data now come from canonical Universe data/parts.json. " +
            "The 18 CC reference prices and masses are discovery planning only, NOT live rates. " +
            "Three superseded generic identities have been removed; unresolved Machine/research mappings are marked for review. Material identities are resolved; qualification, quantity and pricing reviews remain visible in Needs Approval.";
        if (kind === "machines")
          return "Machines, typed BOM proposals and field-level decisions come from canonical Universe data/machines.json. " +
            "The 34 historical Android Machine proposals remain unapproved; five Accommodation physical BOMs and ratings retain their approvals, but manufacturer CC quotes are provisional. " +
            "Compatibility and specialist engineering gates stay explicitly unresolved.";
        return reference
          ? "Android discovery is a read-only review snapshot at " +
            reference.sourceCommit.slice(0, 8) +
            ". Approved and provisional values are labelled in their source fields. " +
            (reference.unmappedCandidates?.[kind]?.length || 0) +
            " Source working IDs reconciled to canonical entities are shown once; any remaining proposals are labelled non-canonical."
          : "Android industrial discovery reference is unavailable. Canonical Universe records remain visible.";
      }
    })]));
}
