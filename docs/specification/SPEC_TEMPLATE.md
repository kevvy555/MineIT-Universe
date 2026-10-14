# MineIT Specification Chapter Template

> **This template is documentation guidance, not a game mechanic.**

```markdown
# <SPEC-ID> — <Focused Chapter Name>
**Owner:** MineIT-Universe shared | MineIT-Desktop | MineIT-Android
**Scope:** <what this chapter governs and what it does not>
**Design status:** Canon | Approved | Proposed | Mixed | Open
**Implementation status:** Implemented (evidence SHA/tests) | Partial | Not implemented | Not applicable
**Last review:** YYYY-MM-DD
**Sources:** ORIGINAL_SOURCE_URL / ISSUE_URL / CANON_RECORD_URL
**Companions:** SHARED_CHAPTER_URL / OTHER_PLATFORM_CHAPTER_URL

## Purpose and boundaries
...
## Approved requirements and invariants
...
## Proposed future mechanics (explicitly nonbinding)
...
## Edge cases and design risks
...
## Platform implementation and tests (only game-owned)
...
## Open decisions and acceptance notes
...
## Source reconciliation / deviations
...
```

### Authoring rules

- Keep one authoritative section for each rule. Cross-reference it elsewhere.
- Never copy entire old documents into new documents just to appear 'migrated'; preserve source links and capture essential requirements accurately.
- Record numerical formula, owner, approval and test evidence before announcing a source file fully reconciled.
- A rule-level approval applies only to the cited rule; whole-document status may be MIXED.
- Shared spec cannot override canonical lore; game-specific design cannot redefine canonical IDs.
- Older documents remain in place even after the new spec supersedes their design implications; links let reviewers trace them.
- Do not create empty placeholder chapters. The tree in the specification index can describe planned chapters without materialising them.

### Completion criteria

An existing source can be marked **Migrated** only when its requirements are mapped to new sections, conflicts decided, target source links valid and implementation state correctly stated. 'Indexed' is not 'migrated'; neither is 'summarised'.
