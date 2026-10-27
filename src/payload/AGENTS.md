# Payload scaffold ownership

- This folder is a guarded Payload-ready scaffold, not an active CMS by default. Admin and API routes remain unavailable until an instance explicitly completes activation.
- Keep Payload SDK types, collection details, relationships, media records, drafts, SEO, localization, redirects, and taxonomies behind server-side adapters.
- Normalize Payload data into the source-neutral marketing contracts before rendering. Frontend sections must not import Payload document shapes.
- Static project assembly excludes this folder, Payload configuration, routes, packages, and deployment documentation entirely.
- Payload-powered Vercel activation follows `docs/operations/payload-vercel-neon-blob.md`, provisions Neon and Vercel Blob, and supplies project secrets through environment storage.
- Preserve committed fallback content until schema migration, seed/readback, and rendered parity are proven.
- The guarded site-layout and marketing-page adapters may read published content only when `MARKETING_CONTENT_SOURCE=payload`. Their seed and readback verifiers are activation gates, not permission to expose the still-disabled admin or API routes.

## Source activation and verification

- Behavioral authority is `openspec/specs/app/marketing/content-sources/source-resolution/spec.md`;
  use `docs/testing/content-sources.md` for fixture verification. Read only the
  selected collection/global/block, normalizer, source adapter, seed and readback
  verifier. Provider-backed media also follows the marketing-content owner.
- Keep `MARKETING_CONTENT_SOURCE=fallback` until schema, service, published seed,
  readback and rendered parity gates pass. Fallback remains the ready default,
  migration seed, parity baseline and recovery reference until those gates pass.
- After Payload becomes explicitly authoritative, missing configuration,
  failed/missing/unpublished/malformed documents and invalid required surface
  references fail closed; do not silently serve stale TypeScript content.
- Marketing renderers never call REST, GraphQL or Local API or receive unresolved
  records. Normalize every selected source into the existing page/layout/media
  contracts instead of introducing a CMS-specific frontend layout.
- Implementation of guarded schema, normalization, seed/readback and activation
  gates does not authorize live service provisioning, credentials, deployment or
  production resource changes. Follow the existing operational workflow for
  Neon, Blob, Vercel environments and secrets; never infer permission from a
  successful fixture verifier.
