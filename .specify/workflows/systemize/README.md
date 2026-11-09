# Systemize workflow

"Map this whole design file to our design system." Runs the compose intake
mapping over every frame of a Figma file and produces one approved list. It
never edits components. Steps: [workflow.yml](workflow.yml).

1. **Map.** Walk every frame of the file. For each distinct visible piece,
   name its owner from the Storybook catalogue and its level 1–5
   (`specs/platform/design-system/usage` FR-021), with a reason.
2. **Deduplicate.** Collapse repeats into one list of unique components: piece,
   owner, level, reason, and the frames it appears in. Two or more distinct
   versions of one part are one level 4 row, not several level 3 rows.
3. **Approve.** Olaf approves, rejects or defers each level 3–5 row. Levels 1
   and 2 need no sign-off.
4. **Output.** The approved list only, recorded in
   `docs/design-system/decisions/<file-slug>.md` (usage FR-024). Building
   happens outside this workflow: each approved row goes through the
   [write-spec workflow](../write-spec/README.md) and the
   [main workflow](../main/README.md) using usage FR-022.
