import { createSubstanceTable } from "./substance-table.js";

// This is a read-only projection, not an independently authored industrial catalogue.
// Canonical identities and relationships are loaded from the Universe manifest.
const flatten = (record, prefix = "", result = {}) => {
  for (const [key, value] of Object.entries(record || {})) {
    const field = prefix ? prefix + "." + key : key;
    if (value && !Array.isArray(value) && typeof value === "object")
      flatten(value, field, result);
    else result[field] = value;
  }
  return result;
};
const group = (name, fields) => ({ name, fields: fields.split(" ") });
const common = [
  group("Identity & Classification", "name id entityType category subCategory subCategories categories buildingType sources"),
  group("Canon & Provenance", "canonStatus provenance.desktopPath image.notes")
];
const visuals = group("Artwork & Visuals",
  "image.key image.generated image.status image.promptDescription mobileLevelAtlas.key mobileLevelAtlas.generated mobileLevelAtlas.status");

const configurations = {
  parts: {
    title: "Parts",
    description: "Canonical Parts and Android discovery proposals side-by-side. Filter, sort or open an existing Part; proposals do not create new canonical items.",
    defaultColumns: ["name", "category", "subCategory", "substanceIds",
      "review.materialBOM.review_status",
      "review.quantities.approved_planning_input_materials_kg_per_finished_unit",
      "review.prices.base_manufacturer_sell_quote_cc_per_finished_unit"],
    groups: [
      common[0],
      group("Materials & Construction",
        "substanceIds review.materialBOM.proposed_named_inputs review.materialBOM.proposed_finished_unit review.materialBOM.approved_finished_stock_count review.quantities.approved_planning_input_materials_kg_per_finished_unit"),
      group("Machines & Usage", "machineIds review.materialBOM.open_decision"),
      group("Production & Prices",
        "review.prices.manufacturer_cost_cc_per_finished_unit review.prices.base_manufacturer_sell_quote_cc_per_finished_unit"),
      group("Discovery & Approval", "review.materialBOM.review_status"),
      common[1], visuals,
      group("Description", "description")
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

export function createIndustrialTables() {
  return Object.fromEntries(Object.entries(configurations).map(([kind, config]) =>
    [kind, createSubstanceTable({
      ...config,
      storageKey: "mineit" + config.title + "Columns",
      rows(catalogue, reference) {
        const source = new Map((reference?.[kind] || []).map(row => [row.id, row.review]));
        return catalogue.collection(kind).map(record => {
          const fields = flatten(record);
          if (source.has(record.id)) flatten(source.get(record.id), "review", fields);
          return { id: record.id, record, collection: kind, fields };
        }).sort((a, b) => a.record.name.localeCompare(b.record.name));
      },
      sourceNote(reference) {
        return reference
          ? "Android discovery is a read-only review snapshot at " +
            reference.sourceCommit.slice(0, 8) +
            ". Approved and provisional values are labelled in their source fields. " +
            (reference.unmappedCandidates?.[kind]?.length || 0) +
            " proposals without canonical IDs are not silently added to this table."
          : "Android industrial discovery reference is unavailable. Canonical Universe records remain visible.";
      }
    })]));
}
