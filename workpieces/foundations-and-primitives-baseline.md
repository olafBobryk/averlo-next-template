# Workpiece: Foundations And Primitives Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Review the reusable foundation and primitive layer after bucket ownership is
clear.

## Acceptance

- Tokens, typography, buttons, fields, icons, focus, and base primitives are
  named as reusable UI baseline surfaces.
- Current code remains implementation material until a specific port or change
  is accepted.
- Missing primitive coverage is recorded without widening scope.

## Tests

- Check the bucket artifact names `foundations` and `primitives`.
- Check this workpiece does not authorize shell, page, provider, or deployment
  changes.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/source-bucket-classification.md`

## Commit Evidence

- none

## Notes

- This is the graph boundary for reusable UI readiness, not a component port.
