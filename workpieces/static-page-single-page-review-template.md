# Workpiece: Static Page Single Page Review Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Template the human review route where feedback remains in one page-level packet
after implementation.

## Acceptance

- The worker proceeds only after the review routing checkpoint accepts the
  single page review route.
- Review evidence is page-level: route, changed files, source references,
  verification, design-system notes, motion/interaction notes, and unresolved
  gaps.
- Section-level concerns may be listed, but they stay inside the same review
  packet.
- Feedback classification separates page-specific changes from path-level or
  project-level learning.

## Tests

- Check the review routing decision accepted single page review.
- Check page-level evidence is complete enough for human review.
- Check section concerns do not require extra thread fan-out.
- Check learning classification remains separate from feedback items.

## Artifacts

- Single page review packet.
- Human feedback.
- Feedback classification.

## Commit Evidence

- none

## Notes

- This route is preferred when feedback is cohesive and review overhead should
  stay low.
