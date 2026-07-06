# Shape: Metadata SEO Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Record the reusable metadata and SEO infrastructure slice in parallel with
shell and first static page work. This shape owns global metadata defaults,
icons, manifest, route metadata pattern, social preview metadata, and metadata
verification without owning page copy, production aliases, analytics, or
external SEO settings.

## Workpiece References

- `workpieces/metadata-source-discovery.md`: discovers source truth for brand,
  domain, icons, robots, indexing, and route metadata.
- `workpieces/favicon-and-app-icons.md`: records favicon, app icon, manifest
  icon, and missing asset decisions.
- `workpieces/global-default-metadata.md`: records root metadata, viewport,
  theme color, robots defaults, manifest, and title template behavior.
- `workpieces/route-metadata-pattern.md`: records how routes provide metadata
  without coupling page components to CMS implementation details.
- `workpieces/social-preview-metadata.md`: records Open Graph and Twitter/X
  card defaults plus missing image/source gates.
- `workpieces/metadata-verification.md`: records metadata asset and route
  metadata verification.

## Fixed Decisions

- Metadata/SEO is a page-system infrastructure slice, not a page-specific
  content branch.
- The slice starts from preview-delivery readiness in parallel with shell and
  first static page prep.
- Static, Payload-ready, and Payload-powered projects should be able to consume
  the same metadata contract.
- Missing brand, social image, domain, indexing, or icon source truth is a
  human gate, not something to invent.

## Autonomous Decisions

- Agents may inspect existing metadata helpers, app icons, manifest files,
  robots configuration, and route metadata patterns.
- Agents may record missing metadata sources as gates.
- Agents may keep metadata source adapters server-side and page components
  source-agnostic.

## Escalation Triggers

- Stop before changing production aliases, analytics, search-console behavior,
  external SEO settings, or domain routing.
- Stop before inventing brand, social image, indexing, or required metadata
  source truth.
- Stop before coupling reusable route metadata patterns to one CMS mode.

## Return Evidence

- `artifacts/metadata-seo-contract.md` names metadata source truth, route
  pattern, social preview, and verification expectations.
- The dashboard shows metadata/SEO baseline in parallel with shell and first
  static page prep after preview delivery readiness.
- The metadata/SEO checkpoint is visible outside this shape.

## Run References

- none

## Commit Evidence

- none
