# Shape: Initialization

Status: active

Guide: ../_guides/artifacts/shape.md

## Intent

Create a small visible setup boundary for the existing template checkout. This
shape should make the current baseline easy to see in the dashboard without
turning setup into a heavyweight process.

## Workpiece References

- `workpieces/template-and-orchestration-baseline.md`: first node in this
  shape; records that the checkout and docked orchestration root already exist.
- `workpieces/documentation-baseline-and-legacy-classification.md`: second node
  in this shape; marks the starting point for sorting docs before scaffold
  work continues.

## Fixed Decisions

- The start checkpoint lives outside this shape.
- The steward handoff checkpoint after initialization lives outside this shape,
  not inside its region.
- The first workpiece records existing baseline state; it does not recreate
  clone/setup history.
- The pressure ledger stays blank until real orchestration friction occurs.
- Source-repo orchestration state is evidence only; it is not projection truth
  for this template.

## Autonomous Decisions

- Agents may update project-local orchestration docs while keeping this shape
  focused on baseline visibility.
- Agents may keep historical details only when needed as evidence.

## Escalation Triggers

- Stop before deleting, moving, or pruning route families.
- Stop before changing template content modes, Payload posture, or thin-start
  ownership.
- Stop before turning source-repo facts into template architecture without
  explicit acceptance.

## Return Evidence

- Dashboard projects the initialization path without warnings.
- The documentation baseline checkpoint is visible outside this shape so the
  steward can stay there and send a source-inventory worker.

## Run References

- none

## Commit Evidence

- none
