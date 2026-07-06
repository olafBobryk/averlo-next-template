# Workpiece: Internal Demo Review Surface

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Use the internal demo as the review surface for reusable UI primitives, inputs,
composites, markdown, and placeholder image fallbacks when reusable coverage
exists.

## Acceptance

- The internal demo is named as the shared review surface for reusable UI
  coverage.
- Demo coverage stays tied to reusable components rather than product pages.
- Markdown review lives under the composites demo path.
- Placeholder image fallback review stays source-agnostic and does not approve
  final page imagery.

## Tests

- Check the dashboard graph reaches this workpiece before the reusable UI
  checkpoint.
- Check the demo path is treated as review evidence, not product scope.
- Check placeholder image fallback coverage is optional and source-agnostic.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `src/app/(site)/(marketing)/internal/demo/content.tsx`
- `src/components/composites/markdown/MarkdownRenderer.tsx`
- `artifacts/placeholder-image-fallbacks.md`

## Commit Evidence

- none

## Notes

- This workpiece does not require starting a preview unless UI code changes.
