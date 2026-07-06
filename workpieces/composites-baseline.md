# Workpiece: Composites Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Review reusable composed UI surfaces that sit above primitives and below
route-owned shells.

## Acceptance

- Markdown rendering is represented as a `composites` bucket surface.
- Composite contracts stay source-agnostic and caller-owned.
- Route-owned metadata, page chrome, and adapters remain outside reusable
  composites.

## Tests

- Check `MarkdownRenderer` is named as a composite, not a route or page-system
  shape.
- Check composite guidance points to design-system primitives.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/source-bucket-classification.md`
- `src/components/composites/markdown/AGENTS.md`

## Commit Evidence

- none

## Notes

- A future route wrapper may consume markdown, but the reusable renderer stays
  in the composite bucket.
