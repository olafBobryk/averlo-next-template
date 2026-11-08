# Configuration ownership

App configuration: installed route families, shared app identity and metadata
defaults, capabilities, motion and scroll configuration.

## Read

- `specs/platform/navigation/routes/spec.md` when changing route identity.
- `specs/platform/navigation/metadata/spec.md` when changing titles, robots,
  canonicals or social metadata; with marketing installed, also
  `specs/platform/surfaces/marketing/metadata/spec.md`.
- Verification: `docs/testing/routes-and-metadata.md`.

## Structure

- Each installed product destination is declared once in its family registry
  under `surfaces/` (`marketing.ts`, `auth.ts`, `dashboard.ts`).
  `src/lib/surfaces/routeSurface.ts` composes identity, href lookup, matching
  and dynamic materialization; `surfaces.ts` selects installed families and
  `src/lib/routes.ts` exposes lookup.
- Dashboard enrichment stays in its registry owner; other families never
  import dashboard information architecture. Internal developer routes are not
  peer product destinations.
- `metadataConfig.ts` owns shared app identity and static marketing metadata;
  `src/lib/metadata.ts` owns the per-family metadata factories. Route pages call
  those factories instead of hardcoding names, separators or robots.
- Dynamic marketing metadata reads through the marketing-content adapter owner
  (`src/lib/marketing-content/`), never a separate provider read.
