# Workpiece: Favicon And App Icons

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record favicon, app icon, manifest icon, and missing asset ownership before
global metadata defaults are finalized.

## Acceptance

- Existing icon files and expected generated assets are listed.
- Missing icon assets are gated rather than silently substituted.
- Icon decisions remain compatible with static and Payload-backed modes.

## Tests

- Check referenced icon and manifest assets exist or are gated.
- Check resource 404s are included in metadata verification.

## Artifacts

- `artifacts/metadata-seo-contract.md`

## Commit Evidence

- none
