# Compose workflow

"Build this page from this design." Turns one source frame (Figma or a
screenshot) into a page built from the design system, then closes the visual
gap with measured passes. Rules live in the specs; this is only the order.
Steps: [workflow.yml](workflow.yml).

Rules it follows: `specs/platform/design-system/usage` (FR-021 levels, FR-022
add an item), `specs/platform/surfaces/marketing/composition` (shell, sections,
native build, fonts and assets), `specs/platform/surfaces/marketing/pages` or
`specs/platform/surfaces/dashboard/pages`, and `specs/platform/design-system/motion`
(the build takes its motion from the usage map; there is no animation stage).
Olaf can cancel at any step.

1. **Intake.**
   - Source: the frame URL and node, or the PNG. Export each section frame at
     1x to `.codex/compose/<page>/source/<section-id>.png` (gitignored).
   - Target: the page spec (new pages through the write-spec workflow, from the
     page-spec template). Fonts and assets are supplied before building
     (composition FR-016).
   - Mapping table in the page spec: one row per source piece with its owner
     from the Storybook catalogue, its level 1–5 and a reason (usage FR-021).
   - Parity threshold: default **5% changed pixels per section** at a fixed
     viewport (default 1440 wide, `?motion=off`). It is set here and never
     changed afterwards unless Olaf explicitly asks.
2. **Build with existing owners.** Levels 1 and 2 as mapped; level 3–5 rows
   use their closest level 1–2 owner until approved. One block and renderer per
   source section; the header (dashboard: the shell) stays as it is.
3. **First look.** Capture the build (step 5 commands) and show Olaf the
   source and the build side by side per section, with the level 3–5 rows for
   per-row approval. Wait for go or stop.
4. **Apply approved additions** through usage FR-022 (owner, family-spec line,
   story with play test, catalogue entry, PR list). Rejected rows stay at their
   level 1–2 owner.
5. **Parity loop.** Each pass:

   ```sh
   npm run preview:capture -- --route '/<route>?motion=off' --review composition \
     --width 1440 --output .codex/compose/<page>/build.png
   # top of a section in the same state:
   #   Math.round(document.querySelector('[data-section-id="<id>"]').getBoundingClientRect().top + scrollY)
   node scripts/compose-diff.mjs --source .codex/compose/<page>/source/<id>.png \
     --build .codex/compose/<page>/build.png --top <top> --threshold 5 \
     --out .codex/compose/<page>/diff-<id>.png
   ```

   Fix the worst section first, within the approved mapping. Stop when every
   section is at or under the threshold, after 5 passes, or after 2 passes
   with no improvement. A fix that needs a new level 3–5 row goes back to
   Olaf, not into code.
6. **Review.** Report each section's changed-pixel percentage (only 0% is
   "exact"; anything else is "measured"), the diff images, the approved
   additions, the checks run and the verified preview links. The PR goes
   through the main workflow.
