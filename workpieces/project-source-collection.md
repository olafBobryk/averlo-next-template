# Workpiece: Project Source Collection

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Collect the source material available to the template before reusable UI work
starts.

## Acceptance

- `artifacts/project-source-index.md` records known source inputs and explicit
  gaps.
- Source rows distinguish repo truth, current implementation material, sibling
  or cousin evidence, design links, and missing material.
- Product-specific source facts stay evidence only.

## Tests

- Check `artifacts/project-source-index.md` exists.
- Check source rows do not copy product route copy, assets, statuses, or local
  runtime state.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/project-source-index.md`
- `artifacts/figma-source-index.md`

## Commit Evidence

- none

## Notes

- This workpiece collects sources; it does not decide component APIs.
