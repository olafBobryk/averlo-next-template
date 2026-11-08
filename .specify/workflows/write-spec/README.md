# Write-spec workflow

Used by anyone writing or amending a spec. Read
`.specify/memory/constitution.md` first. The step outline is
[workflow.yml](workflow.yml); in an interactive session, follow these steps
yourself rather than running it (grilling needs Olaf in the chat, and `command`
steps would start a second, headless agent).

1. **Grill.** Ask Olaf every question whose answer changes behaviour, one topic
   at a time, until none is open (`$grilling` when available). Quote his answers
   verbatim; they become the Clarifications session.
2. **Ponytail.** Find the simplest working shape (`$ponytail` when available).
   Reuse in this order: an existing spec'd owner, the framework
   (`node_modules/next/dist/docs/`), an installed dependency, then new code.
   Write down what was dropped and why.
3. **Find the folder.** `specs/README.md` is the map. Amend the owner spec;
   create a new folder only for a genuinely new capability, next to its closest
   sibling. Generated projects put real business rules under `specs/product/`.
   Point Spec Kit at the folder (no numbered folders):

   ```sh
   export SPECIFY_FEATURE_DIRECTORY=specs/<tree>/<path>
   printf '{"feature_directory":"%s"}\n' "$SPECIFY_FEATURE_DIRECTORY" > .specify/feature.json
   ```

4. **Specify or clarify.**
   - New folder: `speckit-specify` with the change in Olaf's words. Pages use
     `.specify/templates/page-spec-template.md`.
   - Existing spec: add `### Session YYYY-MM-DD` under `## Clarifications`
     (`speckit-clarify`), then change or add requirements. Published
     requirement IDs stay stable; a retired ID is never reused.
5. **Review the spec with Olaf** before planning.
6. **Plan and tasks.** `speckit-plan` (stack, constraints, merge order of the
   owner branches) and `speckit-tasks`. Every task names the files it owns so
   the main thread can hand disjoint units to subagents; the last task proves
   the change (which checks, which preview). Run `speckit-analyze` for
   consistency on larger changes.
7. **Review plan and tasks with Olaf.** Complexity found later goes back into
   the spec, not into code.
8. When the work is done and proved, remove `plan.md` and `tasks.md` again; the
   spec stays as the living contract.
