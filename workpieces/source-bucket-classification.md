# Workpiece: Source Bucket Classification

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Classify collected source signals into reusable UI ownership buckets before
component or page work begins.

## Acceptance

- `artifacts/source-bucket-classification.md` maps signals into accepted
  buckets.
- Route-local and skipped signals are named separately from reusable UI signals.
- Ambiguous ownership is recorded as a gap instead of forced into a shared
  folder.

## Tests

- Check every bucket row has a signal, source, bucket, status, and next action.
- Check markdown rendering is classified as `composites`.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/source-bucket-classification.md`
- `artifacts/project-source-index.md`

## Commit Evidence

- none

## Notes

- Bucket classification is a planning boundary, not implementation.
