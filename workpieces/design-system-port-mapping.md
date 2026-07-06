# Workpiece: Design System Port Mapping

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Combine source IDs, optional Figma node evidence, stable component IDs, and
explicit variant props before reusable UI implementation starts.

## Acceptance

- `artifacts/design-system-port-mapping.md` has rows that connect source
  evidence to code concepts.
- Mapping rows use stable component IDs rather than Figma layer names.
- Rows name the review surface where the mapped component should be inspected.
- Optional Figma rows may stay `not-supplied`; repo and sibling evidence can
  still produce mapping rows.

## Tests

- Check every mapping row has source, bucket, component ID, variant props, review
  surface, decision, and next action.
- Check missing Figma evidence is non-blocking.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/design-system-port-mapping.md`
- `artifacts/source-bucket-classification.md`
- `artifacts/figma-source-index.md`

## Commit Evidence

- none

## Notes

- This workpiece records mapping. It does not change tokens or components.
