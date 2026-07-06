# Workpiece: Static Page Entry Recommendation Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Template the first page-level strategy step: inspect source context and
recommend whether a future static page should proceed directly into
implementation or first define a section/source contract.

## Acceptance

- The recommendation names one proposed prep mode: direct implementation or
  section-defined source contract.
- The recommendation cites concrete source/context reasons without becoming a
  full implementation plan.
- Motion, interaction, accessibility, page semantics, and design-system fit are
  considered when relevant.
- The recommendation remains advisory; the human or steward makes the final
  prep-mode decision at the checkpoint.
- No route/component files are edited during this recommendation step.

## Tests

- Check the recommendation names the proposed prep mode.
- Check the recommendation cites source/context reasons.
- Check motion/interaction and design-system fit are considered when relevant.
- Check the recommendation does not silently choose the final prep mode.
- Check no implementation files are edited.

## Artifacts

- Entry recommendation.
- Source/context notes that support the recommendation.
- Human/steward prep-mode decision or explicit pending gate.

## Commit Evidence

- none

## Notes

- This workpiece is routing advice, not implementation permission.
