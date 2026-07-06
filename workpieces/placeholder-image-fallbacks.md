# Workpiece: Placeholder Image Fallbacks

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record a lightweight, source-agnostic placeholder image fallback surface for
future implementation shapes that need visual media before final page assets
are supplied.

## Acceptance

- Placeholder images are treated as temporary reusable fallbacks, not final
  product assets.
- Future page workers can reference a named placeholder fallback instead of
  inventing page-local placeholders.
- Missing final imagery remains a page/source gate and is not hidden by the
  placeholder.
- Placeholder guidance stays compatible with the design system and thin-start
  surface.

## Tests

- Check placeholder image fallback guidance is visible before page-system work
  begins.
- Check final image source gaps remain explicit gates in page implementation
  packets.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/placeholder-image-fallbacks.md`
- `artifacts/source-bucket-classification.md`

## Commit Evidence

- none

## Notes

- This workpiece may point to existing generic placeholder components, image
  helpers, demo fixtures, or neutral fallback assets when the template has
  them.
- This workpiece does not import sibling project assets or authorize final page
  imagery decisions.
