# Workpiece: Metadata Verification

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Verify metadata assets, resource loading, route metadata output, and remaining
metadata gates before closing the metadata/SEO baseline.

## Acceptance

- Missing metadata assets and resource 404s are checked or gated.
- Route metadata sanity checks are recorded.
- Remaining source or external SEO gates are explicit.
- Production aliases, analytics, and external SEO settings remain out of scope.

## Tests

- Check metadata resource paths and manifest/icon assets.
- Check route metadata output for representative routes when available.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/metadata-seo-contract.md`

## Commit Evidence

- none
