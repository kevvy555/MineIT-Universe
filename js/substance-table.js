import { substanceRows, allSubstanceFields, DEFAULT_COLUMNS, columnGroup,
  fieldLabel, fieldText, applySubstanceTable } from "./substance-table-data.js";

const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

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

export function createSubstanceTable() {
  let selected = [...DEFAULT_COLUMNS];
  let filters = {};
  let sortKey = "name";
  let direction = 1;
  try {
    const stored = JSON.parse(sessionStorage.getItem("mineitSubstanceColumns") || "null");
    if (Array.isArray(stored) && stored.every(x => typeof x === "string"))
      selected = [...new Set(["name", ...stored])];
  } catch { /* browser storage can be unavailable */ }

  function render(container, catalogue, reference, onSelect) {
    const wasOpen = container.querySelector("#substanceColumnPicker")?.open || false;
    const rows = substanceRows(catalogue, reference);
    const possible = allSubstanceFields(rows);
    selected = selected.filter(key => possible.includes(key));
    if (!selected.includes("name")) selected.unshift("name");
    const ordered = possible.filter(key => selected.includes(key));
    const groups = [...new Set(possible.map(columnGroup))];

    const picker = groups.map(group => {
      const options = possible.filter(key => columnGroup(key) === group);
      return '<fieldset><legend>' + esc(group) + '</legend>' +
        options.map(key => '<label class="substance-choice"><input type="checkbox" data-column="' +
          esc(key) + '" ' + (ordered.includes(key) ? "checked " : "") +
          (key === "name" ? "disabled " : "") + '><span>' +
          esc(fieldLabel(key)) + '</span></label>').join("") + '</fieldset>';
    }).join("");

    container.innerHTML = '<div class="substance-review">' +
      '<div class="substance-review-title"><div><div class="eyebrow">Universe Catalogue / bulk review</div>' +
      '<h1>Substances</h1><p>All generic classes and physical resources in one table. ' +
      'Select a name to open its details.</p></div>' +
      '<strong id="substanceCount"></strong></div>' +
      '<div class="substance-review-tools"><details id="substanceColumnPicker" ' +
      (wasOpen ? "open" : "") + '><summary>Choose columns (' + ordered.length +
      ' of ' + possible.length + ')</summary><div class="substance-pick-grid">' + picker +
      '</div></details><button type="button" id="substanceClear">Clear filters</button></div>' +
      '<p class="substance-source-note">' + (reference ?
      'Android tuning columns are <strong>reference only</strong> from commit <code>' +
      esc(reference.sourceCommit.slice(0, 8)) +
      '</code>; gameplay prices and scan levels are not Universe canon.' :
      'Android tuning reference is unavailable; Universe definitions are unaffected.') +
      '</p><div class="substance-review-scroll"><table class="substance-review-table">' +
      '<thead><tr id="substanceHeading"></tr><tr id="substanceFilterHead"></tr></thead>' +
      '<tbody id="substanceTableBody"></tbody></table></div></div>';

    const titleRow = container.querySelector("#substanceHeading");
    const filterRow = container.querySelector("#substanceFilterHead");
    for (const key of ordered) {
      const th = document.createElement("th");
      const button = document.createElement("button");
      button.className = "substance-sort";
      button.type = "button";
      button.title = "Sort by " + fieldLabel(key);
      button.textContent = fieldLabel(key) + (sortKey === key ?
        (direction > 0 ? " ▲" : " ▼") : " ↕");
      button.onclick = () => {
        if (sortKey === key) direction = -direction;
        else { sortKey = key; direction = 1; }
        render(container, catalogue, reference, onSelect);
      };
      th.append(button);
      titleRow.append(th);

      const filterCell = document.createElement("th");
      const input = document.createElement("input");
      input.className = "substance-column-filter";
      input.type = "search";
      input.placeholder = "Filter";
      input.value = filters[key] || "";
      input.setAttribute("aria-label", "Filter " + fieldLabel(key));
      input.addEventListener("input", () => {
        filters[key] = input.value;
        updateRows();
      });
      filterCell.append(input);
      filterRow.append(filterCell);
    }

    function updateRows() {
      const result = applySubstanceTable(rows, ordered, filters, sortKey, direction, catalogue);
      container.querySelector("#substanceCount").textContent =
        result.length + " / " + rows.length + " records";
      const tbody = container.querySelector("#substanceTableBody");
      tbody.innerHTML = result.map(row => '<tr>' + ordered.map(key => {
        const value = fieldText(row.fields[key], catalogue);
        const label = value || "—";
        return '<td title="' + esc(value) + '">' + (key === "name" ?
          '<button class="substance-item" type="button" data-item-id="' +
          esc(row.id) + '">' + esc(label) + '</button>' : esc(label)) + '</td>';
      }).join("") + '</tr>').join("");
      tbody.querySelectorAll("[data-item-id]").forEach(button =>
        button.onclick = () => onSelect(button.dataset.itemId));
    }
    container.querySelectorAll("[data-column]").forEach(box => box.onchange = () => {
      selected = box.checked ? [...selected, box.dataset.column] :
        selected.filter(key => key !== box.dataset.column);
      try { sessionStorage.setItem("mineitSubstanceColumns", JSON.stringify(selected)); }
      catch { /* storage unavailable */ }
      render(container, catalogue, reference, onSelect);
    });
    container.querySelector("#substanceClear").onclick = () => {
      filters = {};
      render(container, catalogue, reference, onSelect);
    };
    updateRows();
  }
  return { render };
}
