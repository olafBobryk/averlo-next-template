# Artifact: Documentation Inventory

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record a lightweight starting classification so future scaffold and backport
work has a place to distinguish active docs from evidence and gated material.

## Artifact Type

doc

## Reference

- `artifacts/documentation-inventory.md`

## Applies To

- `documentation-baseline-and-legacy-classification`: records the accepted
  starting documentation boundary.

## Evidence Role

context

## Active Template Truth

- `AGENTS.md`
- `README.md`
- `docs/ORCHESTRATION.md`
- `docs/orchestration/**`
- `docs/template-content-modes.md`
- `docs/payload-vercel-neon-blob.md`
- `docs/responsive-rendering.md`
- `docs/worklogs/template-backport-differences-ledger.md`

## Historical Evidence

- Historical worklogs under `docs/worklogs/**` that describe completed recovery,
  benchmark, or backport decisions.
- Old template commits referenced from worklogs or backport ledgers.

## Source Repo Evidence

- Descendant/source repo orchestration docs used as examples.
- Backport source commits and source docs referenced from the template backport
  ledger.

## Local Generated State

- `.template-intelligence/**`
- `.serena/**`
- `.codex/tmp/**`
- generated dev-server and build output

## Human-Gated Material

- Scaffold extraction from source-repo orchestration docs.
- Prune or thin-start ownership changes.
- Template content-mode changes.
- Instance route, copy, asset, provider, deployment, or credential behavior.

## Notes

- This inventory is a starting boundary, not a final architecture document.
- Source docs may inform scaffold extraction only after the relevant graph node
  has been read and accepted as reusable.
