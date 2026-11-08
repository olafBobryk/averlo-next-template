# Shared route-surface ownership

## Read

- `specs/platform/navigation/routes/spec.md` when changing route identity;
  verify with `docs/testing/routes-and-metadata.md`.

## Structure

- `routeSurface.ts` is independent of React, dashboard presentation and provider
  data. It owns family-prefixed identity, exact/pattern matching, typed dynamic
  parameters and installed href lookup.
- Family registries (`src/config/surfaces/`) supply declarations;
  `src/config/surfaces.ts` composes installed families. Family enrichment stays
  with its family owner; browser metadata stays with `src/config/metadataConfig.ts`
  and `src/lib/metadata.ts`.
