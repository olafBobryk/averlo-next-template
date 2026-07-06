# Workpiece: Template And Orchestration Baseline

Status: accepted

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the current baseline: the template checkout exists, and the docked
shape-strategy orchestration root is initialized. The baseline is the full
canonical template posture; lightweight pruning and thin-start activation are
target-instance choices, not the default state of this scaffold.

## Acceptance

- The dashboard has a visible start node and baseline node.
- The baseline node does not pretend to perform clone/setup work.
- The node states that this checkout starts as the full template baseline.
- Prune and thin-start are documented as clone, branch, worktree, or
  target-instance actions.

## Tests

- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `package.json`
- `AGENTS.md`
- `README.md`
- `docs/ORCHESTRATION.md`
- `docs/template-content-modes.md`
- `docs/thin-start-creation-boundary.md`
- `docs/orchestration/map.md`
- `docs/orchestration/checkpoints/start.md`
- `docs/orchestration/shapes/initialization.md`
- `docs/orchestration/pressure-ledger.md`
- `scripts/prune-template.mjs`
- `scripts/create-thin-start.mjs`

## Commit Evidence

- none

## Notes

- This is only a visible baseline node. Concrete product instances may later
  choose full-template, lightweight, thin-start, static, Payload-ready, or
  Payload-powered paths, but that choice should not split the template scaffold
  before source inventory by default.
