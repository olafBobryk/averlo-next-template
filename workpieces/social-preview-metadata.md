# Workpiece: Social Preview Metadata

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record Open Graph and Twitter/X card defaults, social preview image source
truth, and missing source gates.

## Acceptance

- Social title, description, image, and card defaults are source-backed or
  gated.
- Missing social preview images are represented as gates.
- Route-level overrides follow the route metadata pattern.

## Tests

- Check social preview defaults are named in the metadata contract.
- Check missing image/source gates are explicit.

## Artifacts

- `artifacts/metadata-seo-contract.md`

## Commit Evidence

- none
