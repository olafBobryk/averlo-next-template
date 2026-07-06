# Workpiece: Reusable UI Bucket Map

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Use the source-bucket classification as the first decision layer for reusable UI
work.

## Acceptance

- Reusable UI work starts from the accepted bucket map.
- The bucket map points agents to existing component folders before new shared
  code is proposed.
- Non-reusable signals remain route-local or skipped.

## Tests

- Check `artifacts/source-bucket-classification.md` includes the accepted bucket
  list.
- Check the reusable UI shape references this workpiece before foundations or
  composites.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/source-bucket-classification.md`

## Commit Evidence

- none

## Notes

- Buckets are ownership hints, not a reason to create new folders.
