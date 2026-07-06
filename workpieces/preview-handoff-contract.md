# Workpiece: Preview Handoff Contract

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Define how page-system workers report review links after preview setup: local
agent preview, remote preview when available, route path, section anchor, and
checkout identity.

## Acceptance

- Workers know when to report local preview, remote preview, route, and anchor
  URLs.
- Missing remote preview is represented as a gate, not as a fabricated URL.
- Section-scoped review still requires the section anchor or an explicit
  `section anchor missing` note.
- The handoff contract respects worker worktrees and does not assume the
  Codex top-right VS Code button opens the correct checkout.

## Tests

- Check preview handoff fields are named in the contract artifact.
- Check route/anchor review remains compatible with the existing preview skill.
- Check no generated preview metadata is committed.

## Artifacts

- `artifacts/preview-delivery-contract.md`

## Commit Evidence

- none
