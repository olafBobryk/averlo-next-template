# Workpiece: Navigation Contract Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the current navigation contract for the template marketing shell.

## Acceptance

- `SiteLayoutDocument` is named as the public navigation data contract.
- `getMarketingLinkHref` and `hrefFor` are named as link resolution boundaries.
- Header menu, search groups, CTA, footer links, and social links stay
  layout-data driven.

## Tests

- Check the shell artifact names layout data and link helper files.
- Check route-specific navigation copy is not promoted into shared UI.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/template-shell-contract.md`
- `src/lib/marketing-content/types.ts`
- `src/lib/marketing-content/links.ts`
- `src/lib/routes.ts`

## Commit Evidence

- none

## Notes

- Future projects can replace layout data without changing shared primitives.
