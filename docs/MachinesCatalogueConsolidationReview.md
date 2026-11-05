# Machines catalogue consolidation — M01–M06

**Status:** technical catalogue/review consolidation, NOT approval of unreviewed Machine designs, prices or Android gameplay.  
**Canonical owner:** `MineIT-Universe/data/machines.json`.  
**Discovery authority:** `MineIT-Android/develop/docs/discovery/galaxy-economic-foundation.md`, especially §§16–17, 60–61, 70–73 and active checkpoint H012.

## M01 — Source crosswalk and approval contract
The canonical catalogue contains **42 stable Machine identities**: 34 source Universe Machines, 2 approved motor identities, 1 strategic Vector Exchange Drive and 5 accommodation Machines. The frozen Android discovery snapshot contains 34 source manufacturing proposals and 20 historical candidate-section rows resolving to **8** additional Machine identities. No candidate is a second canonical SKU. Existing artwork and provenance remain attached to those 42 identities.

The old Machine review registered 103 columns, mixing canonical data, snapshots and per-field historical approval labels. The redesigned projection exposes **26 designer-facing fields in six horizontally arranged groups**: Identity & Classification (4), Physical Construction (5), Operation & Capabilities (7), Manufacturing & Pricing (7), Discovery & Approval (2), Artwork & Visuals (1). This is a read-only view, never a separate authorised catalogue.

## M02 — One manufacturing structure
All Machine records now use `manufacturing`: arrays of `{partId,quantity}`, `{materialId,quantityKg}`, `{machineId,quantity}`, typed labour/shop/test hours, good-unit yield, provisional finished weight, manufacturer cost and base quote. `null` signifies an unresolved input/rating; an empty array is a candidate or explicitly approved absence of a component family, NOT automatically an approved omission.

The **five accommodation physical BOMs approved on 2 November 2026** retain their finished Part counts, direct materials, assembly/shop/test hours and yields with explicit `Approved` field decisions. Their rated resident service slots, extra floor area, abstract operating Power and T1–T5 technology tiers also remain approved. Their **CC costs, suggested selling quotes and freight masses remain proposals**. Every other Machine manufacturing BOM is a typed but **not user-approved reference proposal**, preserving the historic Android comparison and specific unresolved constraints. Numeric values formerly stored as strings are interpreted as numbers; legacy discovery candidate IDs resolve to established stable Part/Machine IDs.

Source `partIds` remain *compatible or source-linked Part identities*, not manufactured unit quantities. The complete manufacturing inputs are in `manufacturing`. Building compatibility is derived by reversing `buildings[].machineIds` without copying relationship facts or asserting every listed Machine is mandatory in every Building. Mutable installed condition, ownership, wear and inventory remain Android per-save state, never here.

## M03 — Explicit and applicability-aware approval
Each Machine now has **one canonical overall `approval`** and a `fieldApprovalStatuses` map covering each review-required field. The overall status is validated against its component statuses, and `needsApproval` is **computed**, not stored. The special Housing technology tier is required only for the five residential amenity products; it cannot block unrelated Machines. Empty nested Machines and absence of pending Part compatibility may be expressly approved; a missing required rating or a nonempty pending compatibility list may not. Approved material BOMs reject unqualified materials.

A physical BOM approval does not approve its manufacturer price. Seven source/scenario designs whose pricing/engineering is blocked remain Blocked. Other full-Machine approvals remain In Review until every applicable review gate is satisfied. The 14 unresolved links created during legacy Part retirement remain visible across 10 Machines and are not silently resolved.

## M04 — Compact Machine review
The Machines grid uses exactly the 26 approved-design **review** columns, with six horizontal filter/selection groups, global/group Select all and Deselect all, readable sortable headers, value and text filtering, selectable linked Part/Material/nested Machine/Building identities, row-level **Show fields**, and global **Show all pending fields**. Only `Approval` and `Needs Approval` are approval-status columns. Image state is shown only as `Image Generated` Yes/No. Prior per-user Machine column selections are version-reset to avoid stale historic fields.

The individual Machine detail page now also displays linked finished Parts, direct materials, and nested Machine BOM quantities; manufacturing effort, yield, mass and CC proposals; approved or provisional operating ratings; overall status and pending fields. Unknown input lists show as **TBD**, not falsely approved absences. Every link resolves back to the canonical catalogue, and unqualified material grades are labelled. The display uses the existing mobile-portrait wrapping layout; it does not install an alternative Machine schema.

## M05 — Validation and safety boundaries
`validation/validate-machines-consolidation.mjs` covers canonical identities, candidate crosswalks, typed numeric quantities, positive ingredient counts, stable material/Part/Machine references, preservation of five signed-off residential physical designs, all 14 pending compatibility edges, 7 blocked designs, price status boundaries, unapproved CC values, overall approval consistency, exactly 26 selectable review fields, and correct pending-column shortcuts. Existing industrial/universe/approval tests are updated and retained in CI.

In the future, manufacturer cost must derive from **one-counted** finished Parts and nested Machines, extra processed materials, labour, shop/testing, yield and an agreed upstream unit-price model. The 70/140/110 CC/h and 25%/50 CC quote figures remain *discovery scenarios*, not authorised Android prices. No production cost tariffs, planet saves, APKs or Android gameplay files were changed.

Machine validation also walks the nested Machine BOM dependency graph and rejects direct or multi-step cycles with the full offending path. Regression fixtures cover self-dependency, indirect cycles and a valid shared dependency. The check is part of the existing required CI validator. It changes no canonical records or approval states.

## M06 — Review workflow and future sign-off
Use the concise Machine review alongside the approved **Building-led validation process** in Android discovery §61: assess actual Building fit-out and Machine rating by machine family, then update only explicitly approved fields. This consolidation **does not close or supersede active Android H012** (common Mine design discovery). Do not revive the 30 rejected bulk Machine sign-offs. Six specialised refinery Machine identities in §16 remain unapproved candidates, not automatically added to the 42 existing Machines.

**Acceptance:** 42 rows; 26 columns; 5 preserved approved physical BOMs; 14 pending compatibility edges; no misleading fully approved Machine pricing; no phantom candidates; unmodified source artwork; passing automated GitHub Actions validations. Browser and portrait-device layout still require human visual confirmation after deployment; automated data/UI contract checks do not claim real-device testing.
