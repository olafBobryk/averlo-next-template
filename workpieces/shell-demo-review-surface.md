# Workpiece: Shell Demo Review Surface

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the existing review surfaces for shell behavior.

## Acceptance

- Internal demo routes for layout, header, and footer are named.
- Section review identity on real pages is named as support evidence.
- Review surfaces are treated as verification paths, not product scope.

## Tests

- Check `/internal/demo/layout/header` and `/internal/demo/layout/footer` are
  named in the shell artifact.
- Check section identity attributes are documented as review aids.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/template-shell-contract.md`
- `src/app/(site)/(marketing)/internal/demo/content.tsx`
- `src/lib/marketing-content/sections/renderMarketingSections.tsx`

## Commit Evidence

- none

## Notes

- Starting a preview is not required for this documentation packet.
