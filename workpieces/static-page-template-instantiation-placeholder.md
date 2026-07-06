# Workpiece: Static Page Template Instantiation Placeholder

Status: planned

Role: executable-path

Guide: ../_guides/artifacts/workpiece.md

## Intent

Hold the connected graph position for the first concrete static page build
without choosing or executing that build yet. When a target page is accepted,
the future packet should instantiate the floating static-page implementation
strategy template with page-specific workpieces and decisions.

## Acceptance

- The placeholder points to the floating static-page template contract.
- The placeholder says a future concrete page packet must choose the target
  route, source material, prep mode, and review route.
- The placeholder does not create page files, route files, section contracts,
  review packets, or implementation decisions.
- The placeholder is visible in parallel with shell and metadata/SEO work after
  the preview-delivery readiness checkpoint.
- Shell and metadata/SEO remain sibling slices; a future page packet records
  any explicit dependency when it needs one.
- The placeholder closes at `first-static-page-instantiation-ready` without
  choosing a target page.

## Tests

- Check the map connects `preview-delivery-ready-for-page-systems` to this
  placeholder as a parallel branch.
- Check the map connects this placeholder to
  `first-static-page-instantiation-ready`.
- Check the map does not make shell readiness an upstream dependency of this
  placeholder.
- Check the static-page implementation strategy template remains an intentional
  disconnected component.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/static-page-doc-template-contract.md`
- `shapes/static-page-implementation-strategy-template.md`

## Commit Evidence

- none

## Notes

- This workpiece is intentionally a gate, not a build packet.
