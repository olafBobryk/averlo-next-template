# Payload scaffold ownership

Guarded Payload-ready scaffold, not an active CMS by default.

## Read

- `specs/platform/surfaces/marketing/content-sources/spec.md` when changing
  source selection, normalization or activation; verify with
  `docs/testing/content-sources.md`.
- Activation runbook: `docs/operations/payload-vercel-neon-blob.md`.

## Structure

- `collections/`, `globals/`, `blocks/` and `fields/` hold the schema;
  `siteLayoutSource.ts` and `marketingPageSource.ts` are the server-side source
  adapters; `marketingPageDocument.ts` normalizes into the source-neutral
  marketing contracts in `src/lib/marketing-content/types.ts`.
- Payload SDK types, collection details, relationships, media records, drafts,
  SEO, localization, redirects and taxonomies stay behind these adapters.
  Frontend sections never import Payload document shapes or call REST, GraphQL
  or Local API.
- Static assembly excludes this folder, `payload.config.ts`, the Payload routes,
  packages and deployment docs. Payload-ready assembly adds the guarded adapters
  only; admin and API routes stay inactive until an instance activates them.
- Change only the selected collection/global/block, its normalizer, source
  adapter and seed/readback verifier (`scripts/payload/`).
