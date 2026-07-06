# Workpiece: Shell Source And ID Boundary

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the existing shell and ID surfaces that page-system work should depend
on instead of reinventing.

## Acceptance

- `artifacts/template-shell-contract.md` lists route IDs, layout document fields,
  demo IDs, and section identity attributes.
- Existing code is treated as current template truth.
- Missing or future shell needs are recorded as gaps, not implemented here.

## Tests

- Check `artifacts/template-shell-contract.md` exists.
- Check the artifact points to existing source files.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/template-shell-contract.md`
- `src/lib/routes.ts`
- `src/lib/marketing-content/types.ts`
- `src/lib/marketing-content/sections/renderMarketingSections.tsx`

## Commit Evidence

- none

## Notes

- This workpiece documents existing code; it does not create a new ID system.
