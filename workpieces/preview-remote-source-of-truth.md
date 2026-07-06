# Workpiece: Preview Remote Source Of Truth

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the source remote, upstream branch, and preview deployment source of
truth before page-system workers start producing reviewable branches.

## Acceptance

- The expected Git remote and upstream branch are recorded or explicitly gated.
- Local branch and push expectations are clear enough for worker handoff.
- Source remote ambiguity is recorded as a human gate.
- No secrets, deploy hooks, or platform tokens are printed or committed.

## Tests

- Check `git remote -v` and branch/upstream state when available.
- Check the preview contract records unresolved source-of-truth gates.
- Check no secret or deploy-hook values are copied into docs.

## Artifacts

- `artifacts/preview-delivery-contract.md`

## Commit Evidence

- none
