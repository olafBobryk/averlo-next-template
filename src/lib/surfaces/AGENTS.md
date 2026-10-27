# Shared route-surface ownership

- Keep the route contract independent of React, dashboard presentation and
  provider data. It owns canonical family-prefixed identity, exact/pattern
  matching, typed dynamic parameters and installed href lookup; family registries
  supply declarations and `src/config/surfaces.ts` composes installed families.
- One product destination has one identity. Do not add parallel maps for helper
  UI, filters, summaries, repeated renderings, nested actions or developer pages.
  Family enrichment stays with its family owner; browser metadata stays with
  `src/config/metadataConfig.ts` and `src/lib/metadata.ts`.
- Behavioral authority is `openspec/specs/app/shared/frontend/navigation/route-identity/spec.md`.
  Verify changes through `docs/testing/routes-and-metadata.md`, including dynamic
  parameter escaping, exact/pattern lookup and absent-profile boundaries.
