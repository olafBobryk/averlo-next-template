# Shape: Source Inventory

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Create a small source-collection boundary before reusable UI work begins. This
shape records available source material, optional Figma evidence, and the
initial bucket classification without making implementation decisions.

## Workpiece References

- `workpieces/project-source-collection.md`: records available repo, sibling,
  cousin, design-link, and missing-source inputs.
- `workpieces/optional-figma-source-index.md`: records Figma file or node
  sources when supplied and stays non-blocking when none are supplied.
- `workpieces/source-bucket-classification.md`: classifies source signals into
  reusable UI buckets before UI work starts.
- `workpieces/design-system-port-mapping.md`: combines source IDs, optional
  Figma node evidence, stable component IDs, and explicit variants into a
  design-system port mapping table.

## Fixed Decisions

- The steward handoff checkpoints before and after source inventory live
  outside this shape, not inside its region.
- Figma is optional source evidence, not required project truth.
- Missing source material should be recorded explicitly instead of blocking the
  graph by default.
- Source collection does not implement tokens, components, routes, or page
  systems.
- Product-specific source facts remain evidence and do not become template
  architecture without acceptance.
- Stable component IDs and explicit variant props are the bridge between source
  evidence and implementation.
- Source inventory starts from an explicit checkpoint and ends at an explicit
  checkpoint so a steward can pause or split worker packets cleanly.

## Autonomous Decisions

- Agents may add source rows for repo docs, current template code, sibling or
  cousin projects, and design links.
- Agents may mark Figma source rows as `not-supplied` when no file or node is
  available.
- Agents may classify a source signal into a bucket when the ownership is clear.
- Agents may add mapping rows for existing template components when the code
  target and variant props are clear.

## Escalation Triggers

- Stop before treating a missing Figma file as a blocker.
- Stop before copying source-project names, route copy, assets, or statuses into
  scaffold docs.
- Stop before changing component taxonomy or prune ownership from source
  evidence alone.

## Return Evidence

- `artifacts/project-source-index.md` names known source inputs and gaps.
- `artifacts/figma-source-index.md` records supplied design-file sources or the
  absence of them.
- `artifacts/source-bucket-classification.md` maps source signals into reusable
  UI buckets.
- `artifacts/design-system-port-mapping.md` maps source IDs to stable component
  IDs, explicit variants, review surfaces, and the next implementation step.
- The dashboard shows the source inventory shape before reusable UI work.
- The documentation-baseline and reusable-UI readiness checkpoints are visible
  outside this shape as steward handoff points.

## Run References

- none

## Commit Evidence

- none
