import { createSubstanceTable } from "./substance-table.js";

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
    description: "19 finished Part products and three legacy compatibility identities. Quantities, masses and CC prices are approved discovery planning references, not live game recipes or prices.",
    defaultColumns: ["name", "partRole", "category", "subCategory", "materialInputs",
      "materialApprovalStatus", "planningReference.finishedMassKg",
      "planningReference.manufacturerCostCC", "planningReference.baseManufacturerQuoteCC"],
    hiddenFields: ["entityType", "catalogueStatus"],
    linkedFields: ["substanceIds", "materialInputs", "machineIds", "legacyReplacementPartIds"],
    groups: [
      group("Identity & Classification",
        "name id partRole category subCategory subCategories sources finishedUnit.count finishedUnit.unit finishedUnit.description"),
      group("Materials & Construction",
        "substanceIds materialInputs unresolvedMaterialInputs"),
      group("Machines & Usage", "machineIds legacyReplacementPartIds"),
      group("Production & Prices",
        "planningReference.finishedMassKg planningReference.manufacturerCostCC planningReference.baseManufacturerQuoteCC planningReference.status planningReference.basis"),
      group("Discovery & Approval", "materialApprovalStatus"),
      common[1], visuals, group("Description", "description")
    ]
  },
  machines: {
    title: "Machines",
    description: "Canonical Machines and Android manufacturing proposals. Parts BOMs and proposed prices remain review references until reconciled.",
    defaultColumns: ["name", "category", "subCategory", "partIds",
      "review.manufacturingBOM.proposed_finished_part_ids_and_counts",
      "review.manufacturingBOM.approval_status"],
    groups: [
      common[0],
      group("Parts & Materials",
        "partIds review.manufacturingBOM.canonical_source_part_ids review.manufacturingBOM.proposed_finished_part_ids_and_counts review.manufacturingBOM.proposed_direct_processed_materials_kg review.luxuryBOM.proposed_direct_finished_part_counts review.luxuryBOM.proposed_direct_processed_materials_kg"),
      group("Nested Machines & Capabilities",
        "review.manufacturingBOM.proposed_nested_machine_ids_and_counts outputSummary inputSummary fuelType review.electricMotors.intended_machine_consumers review.electricMotors.existing_manufacturing_destination"),
      group("Power & Service",
        "review.luxuryRatings.required_housing_tech_level review.luxuryRatings.amenity_category review.luxuryRatings.proposed_resident_service_equivalents_per_day review.luxuryRatings.proposed_machine_footprint_m2 review.luxuryRatings.proposed_operating_power_units review.luxuryRatings.proposed_operating_consumables"),
      group("Manufacturing & Quality",
        "review.manufacturingBOM.proposed_assembly_labour_hours review.manufacturingBOM.proposed_factory_equipment_hours review.manufacturingBOM.proposed_test_hours review.manufacturingBOM.proposed_good_unit_yield review.manufacturingBOM.estimated_finished_freight_mass_kg review.manufacturingBOM.accounted_material_subassembly_mass_kg_partial_if_blocked"),
      group("Costs & Reference Quotes",
        "review.manufacturingBOM.embedded_parts_factory_cost_CC review.manufacturingBOM.direct_processed_material_cost_CC review.manufacturingBOM.nested_machine_factory_cost_CC review.manufacturingBOM.proposed_manufacturer_cost_CC review.manufacturingBOM.proposed_base_sell_quote_CC"),
      group("Discovery & Approval",
        "review.manufacturingBOM.approval_status review.manufacturingBOM.unresolved_design_constraints"),
      common[1], visuals, group("Description", "description")
    ]
  },
  buildings: {
    title: "Buildings",
    description: "Canonical Buildings with Android construction BOMs, machine-fit proposals, costs and review states. No provisional proposal is gameplay canon.",
    defaultColumns: ["name", "category", "buildingType", "machineIds",
      "review.systematicReview.review_status",
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
        "review.systematicReview.review_order review.systematicReview.review_status review.systematicReview.numeric_bom_reference review.bomCoverage.review_status review.bomCoverage.shell_construction_material_quantities_status review.quantitativeBOM.approval_status review.quantitativeBOM.unresolved_dependencies"),
      common[1], visuals, group("Description", "description")
    ]
  }
};

// Source-specific fields are classified alongside their related primary attributes.
const additionalGroupFields = {
  parts: {
    "Canon & Provenance": "provenance.authoredFor provenance.sourceRepository provenance.sourcePath provenance.sourceCommit provenance.androidDiscoveryWorkingId provenance.partsDiscovery.repository provenance.partsDiscovery.sourceCommit provenance.partsDiscovery.sourceSections",
    "Artwork & Visuals": "image.promptDescription"
  },
  machines: {
    "Identity & Classification": "review.manufacturingBOM.machine_name review.manufacturingBOM.category review.luxuryRatings.candidate_machine_name review.luxuryBOM.name review.electricMotors.product_name review.electricMotors.product_kind",
    "Parts & Materials": "review.luxuryRatings.finished_part_inputs_approved_2026_11_02 review.electricMotors.approved_principal_materials principalMaterialIds approvedPhysicalBOM.finishedPartInputs approvedPhysicalBOM.directMaterialInputs",
    "Power & Service": "review.luxuryRatings.notes review.luxuryBOM.housing_tech_unlock review.luxuryBOM.amenity_category review.luxuryBOM.resident_service_slots_per_day_APPROVED review.luxuryBOM.footprint_m2_APPROVED review.luxuryBOM.operating_power_units_APPROVED review.luxuryBOM.operating_consumables_and_maintenance amenityProfile.approval amenityProfile.category amenityProfile.residentServiceSlotsPerDay amenityProfile.floorAreaM2 amenityProfile.operatingPowerUnits",
    "Manufacturing & Quality": "review.luxuryBOM.proposed_assembly_labour_h review.luxuryBOM.proposed_factory_shop_h review.luxuryBOM.proposed_qualification_test_h review.luxuryBOM.proposed_good_unit_yield review.luxuryBOM.accounted_direct_and_part_input_mass_kg approvedPhysicalBOM.approval approvedPhysicalBOM.assemblyLabourHours approvedPhysicalBOM.factoryShopHours approvedPhysicalBOM.qualificationTestHours approvedPhysicalBOM.targetGoodUnitYield",
    "Costs & Reference Quotes": "review.luxuryBOM.reference_part_factory_cost_CC review.luxuryBOM.provisional_direct_material_cost_CC review.luxuryBOM.provisional_labour_cost_CC review.luxuryBOM.provisional_factory_and_test_cost_CC review.luxuryBOM.provisional_manufacturer_cost_CC review.luxuryBOM.provisional_manufacturer_sell_quote_CC review.electricMotors.pricing_and_units",
    "Discovery & Approval": "review.luxuryRatings.approval_status review.luxuryBOM.approval_status review.luxuryBOM.unresolved_engineering_and_pricing_constraints review.electricMotors.approval_status review.electricMotors.unresolved_requirements manufacturingDesignStatus manufacturingDesignNotes",
    "Canon & Provenance": "provenance.authoredFor provenance.sourceState provenance.sourceRepository provenance.sourcePath provenance.sourceCommit provenance.androidDiscoveryWorkingId provenance.lorePath"
  },
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
    // Parts have now reconciled these discovery inputs into canonical, typed
    // fields. Keep the frozen Android snapshot for history, not duplicate columns.
    if (kind !== "parts" && source.has(record.id))
      flatten(source.get(record.id), "review", fields);
    return { id: record.id, record, collection: kind, fields, canonical: true };
  });
  // Any still-unmapped proposal remains visibly non-canonical.
  const reviewRows = [...candidates.values()].map(candidate => {
    const record = {
      id: candidate.id, name: candidate.name || candidate.id,
      catalogueStatus: "Discovery candidate — not canonical"
    };
    const fields = flatten(record);
    flatten(candidate.review, "review", fields);
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
      groups: config.groups.map(group => ({
        ...group,
        fields: [...group.fields,
          ...(additionalGroupFields[kind]?.[group.name] || "").split(" ").filter(Boolean)]
      })),
      storageKey: "mineit" + config.title + "Columns",
      rows(catalogue, reference) {
        return industrialReviewRows(kind, catalogue, reference);
      },
      sourceNote(reference) {
        if (kind === "parts")
          return "Parts identities, material links and planning data now come from canonical Universe data/parts.json. " +
            "The 18 CC reference prices and masses are discovery planning only, NOT live rates. " +
            "Three compatibility IDs are not separate tradable Parts; unknown input materials remain explicitly unresolved.";
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
