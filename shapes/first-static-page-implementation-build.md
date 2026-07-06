# Shape: First Static Page Implementation Build

Status: planned

Role: executable-path

Guide: ../_guides/artifacts/shape.md

## Intent

Hold the connected project path for the first concrete static page build. This
shape does not implement a page yet; it records that a future page packet should
choose and instantiate the floating static-page implementation strategy
template once the target route and source material are accepted.

## Workpiece References

- `workpieces/static-page-template-instantiation-placeholder.md`: placeholder
  for choosing a concrete page target and instantiating the floating template.

## Fixed Decisions

- The preview-delivery readiness checkpoint lives outside this shape, not
  inside its region.
- The reusable static-page template remains floating until a concrete page
  packet chooses it.
- The first implementation build should start from reusable UI and preview
  delivery readiness, not from product-specific page state.
- The first implementation placeholder starts from the same preview-delivery
  readiness checkpoint as the marketing shell and metadata/SEO workers.
- The first static page instantiation checkpoint lives outside this shape, not
  inside its region.
- Shell baseline is a sibling slice, not an upstream dependency of this
  placeholder.
- This placeholder does not choose prep mode, review routing, target route,
  source copy, or section boundaries.

## Autonomous Decisions

- Agents may prepare candidate target-page notes for a future packet.
- Agents may point future page work at the floating template contract and stop
  before implementation.

## Escalation Triggers

- Stop before creating or changing page route files.
- Stop before choosing the target page without steward direction.
- Stop before deciding direct implementation versus section-defined contract.
- Stop before deciding single-page review versus parallel section review.

## Return Evidence

- The dashboard shows a connected placeholder in parallel with shell and
  metadata/SEO work after preview-delivery readiness.
- The placeholder points future workers to the floating static-page template
  route without making that route part of the trunk.
- The first static page branch closes at its own checkpoint before any future
  concrete page packet chooses a target route.

## Run References

- none

## Commit Evidence

- none
