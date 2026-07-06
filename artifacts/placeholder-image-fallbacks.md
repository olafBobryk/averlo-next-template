# Artifact: Placeholder Image Fallbacks

Status: planned

Guide: ../_guides/artifacts/artifact.md

## Intent

Track reusable placeholder image fallbacks that future page implementation
shapes may use when a layout needs media before final source-backed imagery is
available.

## Artifact Type

doc

## Reference

- `artifacts/placeholder-image-fallbacks.md`

## Applies To

- `placeholder-image-fallbacks`: fallback image ownership and gates.
- `internal-demo-review-surface`: optional review coverage for fallback media.
- Future static page implementation shapes: temporary media source references.

## Evidence Role

decision-support

## Fallback Rows

| Fallback ID | Intended Use | Source | Status | Gate To Clear |
| --- | --- | --- | --- | --- |
| `generic-placeholder-image` | Neutral media slot while final imagery is missing | template-owned fallback | planned | Replace or approve final source-backed image before launch-sensitive review. |

## Rules

- Use placeholders to keep layout and visual rhythm testable before final image
  sourcing.
- Keep final imagery, brand photography, product screenshots, and page-specific
  art direction owned by the consuming page/source packet.
- Mark placeholder usage as temporary evidence unless the project explicitly
  accepts generic placeholder media.

## Notes

- This artifact is intentionally small. It records reusable fallback choices;
  it is not an asset library or content system.
