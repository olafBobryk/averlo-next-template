# Workpiece: Marketing Shell Structure Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the current marketing shell assembly before page-system work depends on
it.

## Acceptance

- `MarketingShell`, `Header`, `Footer`, route-level reveal, and scroll mount
  ownership are named.
- Marketing shell components remain route-scoped.
- Shared UI primitives remain dependencies, not shell ownership.

## Tests

- Check the shell artifact names current marketing shell files.
- Check no shared UI folder is made responsible for public shell IA.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/template-shell-contract.md`
- `src/app/(site)/(marketing)/layout.tsx`
- `src/app/(site)/(marketing)/_components/layout/MarketingShell.tsx`
- `src/app/(site)/(marketing)/_components/AGENTS.md`

## Commit Evidence

- none

## Notes

- This baseline prepares shell dependencies for later page-system shapes.
