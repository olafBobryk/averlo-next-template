# Shape: Template Shell Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Record the existing template shell contract before page-system work begins. The
shape makes current route IDs, layout data, section identity, header/footer
composition, navigation data, and shell review surfaces visible in the graph.

## Workpiece References

- `workpieces/shell-source-and-id-boundary.md`: records the existing ID surfaces
  and source files that already define shell and section identity.
- `workpieces/marketing-shell-structure-baseline.md`: records the current
  marketing shell assembly, header, footer, reveal root, and scroll mount.
- `workpieces/navigation-contract-baseline.md`: records the layout-data-driven
  navigation, menu, search, CTA, and link contract.
- `workpieces/shell-demo-review-surface.md`: records the internal demo and
  review URLs used to inspect shell behavior.

## Fixed Decisions

- The preview-delivery readiness checkpoint and shell-ready checkpoint live
  outside this shape, not inside its region.
- The shell ID system already exists in code through route IDs, layout document
  fields, demo IDs, and section identity attributes.
- Public shell navigation data flows through `SiteLayoutDocument` fallback and
  resolver data, not shared app config.
- Header and footer are marketing-route shell components, not shared app chrome.
- Shell baseline work does not authorize page, CMS, provider, deployment, or
  brand-specific IA changes.
- Shell work starts from the preview-delivery readiness checkpoint alongside
  metadata/SEO and first static page implementation-prep branches.

## Autonomous Decisions

- Agents may add source rows for existing shell files and demo routes.
- Agents may record gaps between shell contract and future page-system needs.
- Agents may keep product-specific navigation or localization out of the
  template shell unless accepted as an optional slot.

## Escalation Triggers

- Stop before changing public route IDs or `SiteLayoutDocument` shape.
- Stop before moving marketing shell components into shared UI folders.
- Stop before adding product-specific IA, language switchers, or brand CTA
  behavior to the template shell.
- Stop before changing thin-start or prune ownership.

## Return Evidence

- `artifacts/template-shell-contract.md` names the existing shell IDs, source
  files, and review surfaces.
- The dashboard shows shell source, structure, navigation, and demo review nodes
  after the preview-delivery readiness checkpoint.
- The shell checkpoint is visible outside this shape before page-system work.

## Run References

- none

## Commit Evidence

- none
