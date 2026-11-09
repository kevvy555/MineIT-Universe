import { substanceRows, allSubstanceFields, DEFAULT_COLUMNS, columnGroup,
  fieldLabel, fieldText, applySubstanceTable, uniqueColumnValues,
  SUBSTANCE_COLUMN_GROUPS, selectionForCategory } from "./substance-table-data.js";

const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

// Stable field keys drive both global and per-item pending-column shortcuts.
export function pendingColumnSelection(rows, possible, rowId = null) {
  const relevant = rowId === null ? rows : rows.filter(row => row.id === rowId);
  const keys = relevant.flatMap(row => row.pendingColumnKeys || []);
  const available = new Set(possible);
  return [...new Set(["name", "approval", "needsApproval", ...keys])]
    .filter(key => available.has(key));
}

export async function loadAndroidResourceReference() {
  try {
    const response = await fetch("./game-specs/mineit-mobile/resource-balance-reference.json",
      { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (data.authority !== "reference-only-android-owned-gameplay-balance")
      throw new Error("Unexpected reference provenance");
    return data;
  } catch (error) {
    console.warn("Android reference snapshot unavailable:", error);
    return null;
  }
}

export function createSubstanceTable(config = {}) {
  let displayLabels = config.columnLabels || {};
  const labelFor = key => displayLabels[key] || fieldLabel(key);
  let selected = [...(config.defaultColumns || DEFAULT_COLUMNS)];
  let textFilters = {};
  let valueFilters = {};
  let sortKey = "name";
  let direction = 1;
  let cleanupListeners = () => {};
  try {
    const stored = JSON.parse(sessionStorage.getItem((config.storageKey || "mineitSubstanceColumns")) || "null");
    if (Array.isArray(stored) && stored.every(x => typeof x === "string"))
      selected = [...new Set(["name", ...stored])];
  } catch { /* browser storage may be disabled */ }

  function render(container, catalogue, reference, onSelect, onBack) {
    cleanupListeners();
    // The manifest column registry governs the displayed field names, including
    // the Approval and Needs Approval columns, across all catalogue grids.
    displayLabels = Object.fromEntries(catalogue.collection("columnDefinitions")
      .filter(definition => definition.table === (config.tableKind || "substances"))
      .map(definition => [definition.fieldKey, definition.name]));
    Object.assign(displayLabels, config.columnLabels || {});
    const previousScroll = container.querySelector(".substance-review-scroll");
    const scrollLeft = previousScroll?.scrollLeft || 0;
    const scrollTop = previousScroll?.scrollTop || 0;
    const wasOpen = container.querySelector("#substanceColumnPicker")?.open || false;
    const rows = config.rows ? config.rows(catalogue, reference) : substanceRows(catalogue, reference);
    const hidden = new Set(config.hiddenFields || []);
    const availableFields = new Set(rows.flatMap(row => Object.keys(row.fields))
      .filter(key => !hidden.has(key)));
    const possible = config.groups
      ? [...new Set([...config.groups.flatMap(group => group.fields)
        .filter(key => availableFields.has(key)), ...availableFields])]
      : allSubstanceFields(rows);
    selected = selected.filter(key => possible.includes(key));
    if (!selected.includes("name")) selected.unshift("name");
    const ordered = possible.filter(key => selected.includes(key));
    const available = new Set(possible);
    const groups = (config.groups || SUBSTANCE_COLUMN_GROUPS).map(group => ({
      ...group, fields: group.fields.filter(key => available.has(key))
    }));
    if (config.groups) {
      const grouped = new Set(groups.flatMap(group => group.fields));
      const other = possible.filter(key => !grouped.has(key)).sort();
      if (other.length) groups.push({ name: "Additional Review Fields", fields: other });
    }
    // Every category stays expanded: no subpanels, no nested scrolling.
    const picker = groups.map(group => {
      const checked = group.fields.filter(key => ordered.includes(key)).length;
      const options = group.fields.map(key =>
        '<label class="substance-choice" title="' + esc(group.name + ' — ' + labelFor(key)) +
        '"><input type="checkbox" aria-label="' + esc(group.name + ': ' + labelFor(key)) +
        '" data-column="' + esc(key) + '" ' + (ordered.includes(key) ? "checked " : "") +
        (key === "name" ? "disabled " : "") + '><span>' + esc(labelFor(key)) +
        '</span></label>').join("");
      return '<section class="substance-column-category" data-column-group="' + esc(group.name) +
        '"><div class="substance-category-heading"><strong>' + esc(group.name) +
        '</strong><span class="substance-category-count">' + checked + ' / ' +
        group.fields.length + '</span><div class="substance-category-actions">' +
        '<button type="button" data-group-select="' + esc(group.name) + '">Select all</button>' +
        '<button type="button" data-group-clear="' + esc(group.name) + '">Deselect all</button>' +
        '</div></div><div class="substance-category-fields">' + options + '</div></section>';
    }).join("");

    container.innerHTML = '<div class="substance-review">' +
      '<div class="substance-review-title"><div><div class="eyebrow">Universe Catalogue / bulk review</div>' +
      '<h1>' + esc(config.title || "Substances") + '</h1><p>' +
      esc(config.description || "Generic raw/refined substance categories, natural resources, processed materials and biological resources in one table. Choose columns, filter individual values, or click a name to open its details.") +
      '</p></div>' +
      '<strong id="substanceCount"></strong></div>' +
      '<div class="substance-review-tools"><div class="substance-tool-actions">' +
      '<button type="button" id="substanceBack">← Catalogue tree</button>' +
      '<button type="button" id="substanceClear">Clear filters</button></div>' +
      '<details id="substanceColumnPicker" ' + (wasOpen ? "open" : "") +
      '><summary>Choose columns (' + ordered.length + ' of ' + possible.length +
      ')</summary><div class="substance-column-actions">' +
      '<button type="button" id="substanceSelectAll">Select all</button>' +
      '<button type="button" id="substanceClearColumns">Deselect all</button>' +
      (config.pendingColumnAction ?
        '<button type="button" id="substanceShowPendingColumns" title="Show all fields with outstanding approvals">Show all pending fields</button>' : '') +
      '<span>Name stays visible to open details.</span></div>' +
      '<div class="substance-pick-grid">' + picker + '</div></details></div>' +
      '<p class="substance-source-note">' + (config.sourceNote ? esc(config.sourceNote(reference)) : reference ?
      'Android tuning columns are <strong>reference only</strong> from commit <code>' +
      esc(reference.sourceCommit.slice(0, 8)) +
      '</code>; gameplay prices and scan levels are not Universe canon.' :
      'Android tuning reference is unavailable; Universe definitions are unaffected.') +
      '</p><div class="substance-review-scroll"><table class="substance-review-table">' +
      '<thead><tr id="substanceHeading"></tr><tr id="substanceFilterHead"></tr></thead>' +
      '<tbody id="substanceTableBody"></tbody></table></div>' +
      '<div class="substance-filter-popup" id="substanceValuePopup" role="dialog" hidden></div></div>';

    const titleRow = container.querySelector("#substanceHeading");
    const filterRow = container.querySelector("#substanceFilterHead");
    const popup = container.querySelector("#substanceValuePopup");
    const valueButtons = new Map();
    let activeButton = null;

    function closePopup() {
      popup.hidden = true;
      if (activeButton) activeButton.setAttribute("aria-expanded", "false");
      activeButton = null;
    }

    function updateValueButtons() {
      for (const [key, button] of valueButtons) {
        const count = valueFilters[key]?.size || 0;
        button.textContent = count ? "Values (" + count + ") ▾" : "Values ▾";
        button.classList.toggle("has-selection", count > 0);
        button.setAttribute("aria-label", "Select values for " + labelFor(key) +
          (count ? ", " + count + " selected" : ""));
      }
    }

    function showPopup(key, button) {
      if (!popup.hidden && activeButton === button) { closePopup(); return; }
      closePopup();
      activeButton = button;
      button.setAttribute("aria-expanded", "true");
      const choices = uniqueColumnValues(rows, key, catalogue);
      popup.innerHTML = '<div class="substance-popup-heading"><strong>' +
        esc(labelFor(key)) + '</strong><button type="button" data-close aria-label="Close filter">×</button></div>' +
        '<input type="search" class="substance-popup-search" aria-label="Find values" placeholder="Search values…">' +
        '<div class="substance-popup-options" role="group" aria-label="Values for ' +
        esc(labelFor(key)) + '"></div>' +
        '<div class="substance-popup-actions"><button type="button" data-select>Choose shown</button>' +
        '<button type="button" data-clear>Clear selection</button></div>';
      const search = popup.querySelector(".substance-popup-search");
      const list = popup.querySelector(".substance-popup-options");
      const chosen = () => valueFilters[key] || (valueFilters[key] = new Set());
      const shown = () => choices.filter(choice =>
        choice.label.toLowerCase().includes(search.value.trim().toLowerCase()));

      function refreshChoices() {
        list.innerHTML = shown().map(choice =>
          '<label class="substance-value-choice"><input type="checkbox" data-token="' +
          esc(choice.token) + '" ' + (chosen().has(choice.token) ? "checked " : "") +
          '><span>' + esc(choice.label) + '</span><small>' +
          choice.count + '</small></label>').join("") ||
          '<p class="substance-value-empty">No matching values</p>';
        list.querySelectorAll("[data-token]").forEach(checkbox => checkbox.onchange = () => {
          if (checkbox.checked) chosen().add(checkbox.dataset.token);
          else chosen().delete(checkbox.dataset.token);
          updateRows();
          updateValueButtons();
        });
      }

      search.oninput = refreshChoices;
      popup.querySelector("[data-close]").onclick = closePopup;
      popup.querySelector("[data-select]").onclick = () => {
        for (const option of shown()) chosen().add(option.token);
        refreshChoices();
        updateRows();
        updateValueButtons();
      };
      popup.querySelector("[data-clear]").onclick = () => {
        chosen().clear();
        refreshChoices();
        updateRows();
        updateValueButtons();
      };
      refreshChoices();
      popup.hidden = false;
      const bounds = button.getBoundingClientRect();
      const width = Math.min(350, window.innerWidth - 16);
      popup.style.width = width + "px";
      popup.style.left = Math.max(8, Math.min(bounds.left, window.innerWidth - width - 8)) + "px";
      const height = Math.min(420, window.innerHeight - 24);
      const below = window.innerHeight - bounds.bottom;
      popup.style.top = Math.max(8, below < height && bounds.top > height
        ? bounds.top - height - 4
        : Math.min(bounds.bottom + 4, window.innerHeight - height - 8)) + "px";
      search.focus();
    }

    for (const key of ordered) {
      const th = document.createElement("th");
      const button = document.createElement("button");
      button.className = "substance-sort";
      button.type = "button";
      button.title = "Sort by " + labelFor(key);
      button.textContent = labelFor(key) + (sortKey === key ?
        (direction > 0 ? " ▲" : " ▼") : " ↕");
      button.onclick = () => {
        if (sortKey === key) direction = -direction;
        else { sortKey = key; direction = 1; }
        render(container, catalogue, reference, onSelect, onBack);
      };
      th.append(button);
      titleRow.append(th);

      const filterCell = document.createElement("th");
      const controls = document.createElement("div");
      controls.className = "substance-filter-controls";
      const input = document.createElement("input");
      input.className = "substance-column-filter";
      input.type = "search";
      input.placeholder = "Text filter";
      input.value = textFilters[key] || "";
      input.setAttribute("aria-label", "Text filter " + labelFor(key));
      input.addEventListener("input", () => {
        textFilters[key] = input.value;
        updateRows();
      });
      const valuesButton = document.createElement("button");
      valuesButton.className = "substance-value-button";
      valuesButton.type = "button";
      valuesButton.setAttribute("aria-expanded", "false");
      valuesButton.setAttribute("aria-haspopup", "dialog");
      valuesButton.onclick = () => showPopup(key, valuesButton);
      valueButtons.set(key, valuesButton);
      controls.append(input, valuesButton);
      filterCell.append(controls);
      filterRow.append(filterCell);
    }

    function renderLinkedCell(raw, key) {
      const items = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
      if (key === "materialInputs") {
        const lines = items.map(item => {
          const id = item.substanceId;
          const target = id && catalogue.get(id);
          const label = target?.name || id || "Unresolved";
          const material = target
            ? '<button class="substance-item substance-reference" type="button" data-entity-id="' +
              esc(id) + '" title="Open ' + esc(label) + '">' + esc(label) + '</button>'
            : '<span class="status error">Broken: ' + esc(label) + '</span>';
          const quantity = Number.isFinite(item.quantityKg)
            ? esc(item.quantityKg + " kg") : "—";
          const requirement = item.requirement?.startsWith("conditional") ? "Conditional" :
            item.requirement?.startsWith("upstream") ? "Upstream" :
            item.requirement === "candidate" ? "Candidate" : "Required";
          const approval = item.approval === "planning-only-unqualified"
            ? " · needs qualification" : "";
          return '<div class="part-material-row"><span>' + material +
            '</span><span class="part-material-quantity">' + quantity +
            '</span><span class="part-material-requirement">' +
            esc(requirement + approval) + '</span></div>';
        });
        return '<div class="part-material-list">' + (lines.join("") || "—") + '</div>';
      }
      const links = items.map(item => {
        const id = typeof item === "string" ? item :
          item.substanceId || item.materialId || item.partId || item.machineId;
        const label = fieldText(item, catalogue);
        if (!id) return '<span class="substance-unlinked">' + esc(label) + '</span>';
        const target = catalogue.get(id);
        if (!target) return '<span class="status error" title="Unresolved canonical ID">' +
          esc(id) + '</span>';
        return '<button class="substance-item substance-reference" type="button" data-entity-id="' +
          esc(id) + '" title="Open ' + esc(target.name) + '">' + esc(label) + '</button>';
      });
      return '<div class="substance-ref-list">' + (links.join("") || "—") + '</div>';
    }

    function renderPendingApprovalCell(row) {
      const labels = row.fields.needsApproval || [];
      const readable = Array.isArray(labels) ? labels.join(", ") : String(labels);
      const pending = row.pendingColumnKeys || [];
      return '<div class="substance-pending-review"><span class="substance-pending-text" title="' +
        esc(readable) + '">' + esc(readable || "None") + '</span>' +
        (pending.length ?
          '<button type="button" class="substance-pending-button" data-pending-for="' +
          esc(row.id) + '" title="Show pending fields for ' + esc(row.record.name) +
          '" aria-label="Show pending fields for ' + esc(row.record.name) +
          '">Show fields</button>' : '') + '</div>';
    }

    function renderImageCell(row) {
      const image = row.record.image;
      if (!image?.generated || !image.key) {
        const status = image?.status === "not-generated" ? "Not generated" : "No image metadata";
        return '<span class="substance-image-missing">' + esc(status) + '</span>';
      }
      const source = catalogue.assetUrl(image.key);
      return '<button class="substance-image-button" type="button" data-item-id="' +
        esc(row.id) + '" title="Open ' + esc(row.record.name) +
        ' details" aria-label="Open ' + esc(row.record.name) + ' details">' +
        '<img class="substance-image-preview" src="' + esc(source) + '" alt="' +
        esc(row.record.name) + '" loading="lazy" decoding="async"></button>';
    }

    function updateRows() {
      const result = applySubstanceTable(rows, ordered, textFilters,
        sortKey, direction, catalogue, valueFilters);
      container.querySelector("#substanceCount").textContent =
        result.length + " / " + rows.length + " records";
      const tbody = container.querySelector("#substanceTableBody");
      tbody.innerHTML = result.map(row => '<tr>' + ordered.map(key => {
        const value = fieldText(row.fields[key], catalogue);
        const label = value || "—";
        const linked = (config.linkedFields || ["upstreamMaterialIds"]).includes(key) &&
          Array.isArray(row.fields[key]);
        const imagePreview = key === "image.preview";
        const cellClass = linked ? "substance-link-cell" :
          imagePreview ? "substance-image-cell" : "";
        return '<td' + (cellClass ? ' class="' + cellClass + '"' : '') +
          ' title="' + esc(value) + '">' + (key === "name" && row.canonical !== false ?
          '<button class="substance-item" type="button" data-item-id="' +
          esc(row.id) + '">' + esc(label) + '</button>' :
          imagePreview ? renderImageCell(row) :
          linked ? renderLinkedCell(row.fields[key], key) :
          (key === "needsApproval" && config.pendingColumnAction)
            ? renderPendingApprovalCell(row) : esc(label)) + '</td>';
      }).join("") + '</tr>').join("") ||
        '<tr><td colspan="' + ordered.length + '" class="substance-no-results">No matching ' +
        esc(config.title || "substances") + '</td></tr>';
      tbody.querySelectorAll("[data-item-id]").forEach(button =>
        button.onclick = () => onSelect(button.dataset.itemId));
      tbody.querySelectorAll("[data-entity-id]").forEach(button =>
        button.onclick = () => onSelect(button.dataset.entityId));
      if (config.pendingColumnAction)
        tbody.querySelectorAll("[data-pending-for]").forEach(button => button.onclick = () => {
          const target = rows.find(row => row.id === button.dataset.pendingFor);
          if (!target) return;
          // Focus the selected item and all fields still awaiting its approval.
          textFilters = { name: target.record.name };
          valueFilters = {};
          container.querySelector(".substance-review-scroll").scrollTop = 0;
          setColumns(pendingColumnSelection(rows, possible, target.id));
        });
    }

    function setColumns(keys) {
      selected = [...new Set(["name", ...keys])];
      if (!selected.includes(sortKey)) { sortKey = "name"; direction = 1; }
      try { sessionStorage.setItem((config.storageKey || "mineitSubstanceColumns"), JSON.stringify(selected)); }
      catch { /* browser storage may be unavailable */ }
      render(container, catalogue, reference, onSelect, onBack);
    }
    container.querySelectorAll("[data-column]").forEach(box => box.onchange = () => {
      setColumns(box.checked ? [...selected, box.dataset.column] :
        selected.filter(key => key !== box.dataset.column));
    });
    container.querySelector("#substanceSelectAll").onclick = () => setColumns(possible);
    container.querySelector("#substanceClearColumns").onclick = () => setColumns(["name"]);
    if (config.pendingColumnAction)
      container.querySelector("#substanceShowPendingColumns").onclick = () => {
        // The global shortcut restores all items after a row-specific review.
        textFilters = {};
        valueFilters = {};
        container.querySelector(".substance-review-scroll").scrollTop = 0;
        setColumns(pendingColumnSelection(rows, possible));
      };
    container.querySelectorAll("[data-group-select]").forEach(button => button.onclick = () => {
      const group = groups.find(item => item.name === button.dataset.groupSelect);
      if (group) setColumns(selectionForCategory(selected, group.fields, true));
    });
    container.querySelectorAll("[data-group-clear]").forEach(button => button.onclick = () => {
      const group = groups.find(item => item.name === button.dataset.groupClear);
      if (group) setColumns(selectionForCategory(selected, group.fields, false));
    });
    container.querySelector("#substanceClear").onclick = () => {
      textFilters = {};
      valueFilters = {};
      render(container, catalogue, reference, onSelect, onBack);
    };
    container.querySelector("#substanceBack").onclick = onBack;
    const onOutside = event => {
      if (!popup.hidden && !popup.contains(event.target) && event.target !== activeButton)
        closePopup();
    };
    const onEscape = event => {
      if (event.key === "Escape" && !popup.hidden) {
        const opener = activeButton;
        closePopup();
        opener?.focus();
      }
    };
    const onResize = () => closePopup();
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", onResize);
    container.addEventListener("scroll", onResize);
    container.querySelector(".substance-review-scroll").addEventListener("scroll", onResize);
    cleanupListeners = () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("scroll", onResize);
    };
    updateValueButtons();
    updateRows();
    const viewport = container.querySelector(".substance-review-scroll");
    viewport.scrollLeft = scrollLeft;
    viewport.scrollTop = scrollTop;
  }
  return { render, close: () => cleanupListeners() };
}
