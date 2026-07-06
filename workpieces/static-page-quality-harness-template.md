# Workpiece: Static Page Quality Harness Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Optionally run page-target quality checks after a static page pattern return.
For the full template this can include the scroll-performance measurement and
autoresearch worktree harness; pruned or thin-start instances may omit it.
The steward invokes this only when scroll performance, layout stability, review
friction, or repeated visual regressions justify a measured follow-up.

## Acceptance

- The page worker records whether the quality harness was used, skipped, or
  unavailable because tooling was pruned.
- The harness reason names the risk being measured, such as scroll
  performance, layout stability, review friction, or repeated visual
  regressions.
- When used, the harness targets a real route path and allowed mutable scope.
- Scroll-performance/autoresearch output stays in ignored runtime paths unless
  a benchmark row is intentionally recorded.
- The harness does not replace human review or accepted review routing.

## Tests

- For full-template instances, use page-target commands such as
  `npm run measure:scroll-performance -- --path <route> --output tmp/<name>.json`.
- For optimization loops, use `npm run setup:scroll-performance-autoresearch`
  with explicit `--path` and `--mutable` scopes.
- For pruned instances, record that `--no-scroll-performance` removed the
  harness and skip without blocking return.

## Artifacts

- Optional page-quality findings.
- Optional scroll-performance measurement output under ignored `tmp/`.
- Optional benchmark row only when intentionally recorded.

## Commit Evidence

- none
