# Configuration ownership

## Route identity

- Declare each installed product destination once in its marketing, auth or
  dashboard family registry. `src/lib/surfaces/routeSurface.ts` composes shared
  identity, href lookup, exact/pattern matching and typed dynamic materialization;
  `surfaces.ts` selects installed families and `src/lib/routes.ts` exposes lookup.
- Keep dashboard enrichment in its registry owner; do not duplicate canonical
  IDs/hrefs/matching or import dashboard information architecture into other
  families. Internal developer routes are not peer product destinations.

## Document metadata

- `openspec/specs/app/shared/frontend/navigation/document-metadata/spec.md` owns behavior and
  `docs/testing/routes-and-metadata.md` owns execution. `metadataConfig.ts` owns
  shared app identity and static marketing metadata; `src/lib/metadata.ts` owns
  family factories. Route pages do not independently hardcode app names,
  separators, robots, canonical or social metadata.
- When public marketing is installed, its title conventions and authoritative
  metadata/body read follow `app/marketing/metadata/public-document-metadata`
  with `app/marketing/content-sources/source-resolution`. Discover only the
  applicable surface contracts through stock OpenSpec list/show; they are not
  dependencies of an absent marketing area.
- Navigation labels/descriptions remain route presentation data. Source-neutral
  marketing documents may supply title/description, never canonical hrefs,
  indexability or provider fields. Do not create a second marketing document
  from navigation labels or copy dashboard metadata into page-local exports.
- Dashboard/auth and internal development titles are `Route name | App name`,
  always `noindex, nofollow`. Public document titles are `App name | Route name`;
  home uses the app name alone. Testing, component-export and other private
  development routes also remain non-indexable.
- Keep title, description, canonical, robots, Open Graph and Twitter output in
  parity. Canonicals derive from installed hrefs, never incidental request queries
  or CMS input. Code-owned marketing utilities retain static repository metadata
  until their rendered document explicitly migrates to the page contract.
- Dynamic metadata and body use the same request-memoized server document read.
  Authoritative failures are fatal to both; no second provider read or stale
  fallback solely for metadata. Follow the marketing-content adapter owner when
  source selection, normalization or page metadata changes.
