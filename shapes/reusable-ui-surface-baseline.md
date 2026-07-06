# Shape: Reusable UI Surface Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Create the reusable UI scaffold path from source-bucket evidence. This shape
keeps UI work grouped by stable ownership buckets and treats markdown rendering
as a reusable composite inside the design-system surface.

## Workpiece References

- `workpieces/reusable-ui-bucket-map.md`: adopts bucket classification as the
  first decision layer for reusable UI work.
- `workpieces/design-system-port-execution-order.md`: applies the Figma Design
  System Port order from evidence and mapping through audit, tokens, primitives,
  consumers, demos, and docs.
- `workpieces/foundations-and-primitives-baseline.md`: reviews tokens,
  typography, buttons, fields, icons, focus, and base primitives.
- `workpieces/composites-baseline.md`: reviews source-agnostic compositions,
  including markdown rendering through design-system primitives.
- `workpieces/placeholder-image-fallbacks.md`: records source-agnostic
  placeholder image fallback options for future page implementation shapes.
- `workpieces/internal-demo-review-surface.md`: uses the internal demo as the
  review surface for primitives, inputs, composites, markdown, and placeholder
  image fallbacks when reusable coverage exists.

## Fixed Decisions

- The reusable-UI readiness checkpoint lives outside this shape, not inside its
  region.
- Source signals are classified by lifecycle and bucket before implementation.
- Figma design-system work must pass through source evidence, component mapping,
  and usage audit before token or primitive changes.
- Markdown rendering belongs in the composites bucket unless a route-specific
  wrapper adds page ownership.
- Placeholder images belong to reusable UI as temporary, source-agnostic
  fallback surfaces; final page imagery remains source/page-owned.
- The reusable UI baseline does not authorize shell, navigation, page, content
  architecture, provider, or deployment changes.
- The internal demo is the review surface for reusable UI coverage.
- Reusable UI closes at a steward checkpoint that feeds preview-delivery setup
  before page-system branches fan out.

## Autonomous Decisions

- Agents may update bucket rows when a reusable surface clearly belongs in an
  existing folder category.
- Agents may record gaps between current code and bucket expectations without
  implementing them.
- Agents may keep route-owned wrappers out of reusable UI buckets.
- Agents may execute the design-system port order only after a mapping row
  names the source, component ID, variants, and review surface.

## Escalation Triggers

- Stop before adding new component categories outside the accepted bucket map.
- Stop before moving route-specific behavior into shared UI folders.
- Stop before creating a separate content-page shape for markdown alone.
- Stop before importing product-specific media, final brand imagery, or page
  art direction into placeholder fallback ownership.
- Stop before changing public component APIs without a usage audit.
- Stop before changing thin-start or prune ownership.

## Return Evidence

- Bucket map points agents to the right UI folder before new reusable work.
- Design-system port mapping and execution order are visible before primitive
  work.
- Foundations, primitives, composites, and markdown are visible in the graph.
- Placeholder image fallback guidance is visible before page implementation
  workers need temporary imagery.
- Internal demo review coverage is named as the reusable UI verification path.
- The reusable UI checkpoint is visible outside this shape before
  preview-delivery setup begins.

## Run References

- none

## Commit Evidence

- none
