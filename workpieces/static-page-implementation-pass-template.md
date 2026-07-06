# Workpiece: Static Page Implementation Pass Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Template the static page implementation pass after the human or steward has
accepted either direct implementation or section-defined source contract prep.

## Acceptance

- The worker proceeds only after the prep-mode checkpoint accepts a route.
- If direct implementation was accepted, the worker uses source context,
  existing primitives, and existing components with minimal visual invention.
- If section-defined contract prep was accepted, the worker implements from the
  contract without treating unresolved later details as source truth.
- Motion and interaction behavior are implemented only when source context,
  product meaning, and accessibility implications are clear enough.
- Design-system decisions are explicit when reuse is messy: reuse existing
  components where possible, create shared components only when reasonable, and
  keep route-local layout contained when it is the least misleading choice.
- Verification prepares evidence for the human review routing decision.

## Tests

- Check the accepted prep-mode decision is recorded.
- Check design-system reuse/new/local decisions are traceable when relevant.
- Check motion and interaction behavior does not invent product meaning.
- Check implementation stays within the page workpiece boundary.
- Check verification evidence is ready before review routing.

## Artifacts

- Changed page and section files.
- Verification output.
- Design-system decision notes when relevant.
- Motion or interaction risk notes when relevant.

## Commit Evidence

- none

## Notes

- This template deliberately avoids a built-in per-section implementation loop.
