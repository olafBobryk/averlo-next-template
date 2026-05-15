# Template Content Modes

This template supports three content modes. Choose the lightest mode that matches
the project, and keep the frontend rendering contract independent from the
content source.

## Static

Use this mode when a site does not need Payload CMS.

- Run `npm run prune:template -- --no-payload` in the clone.
- Build pages from plain TypeScript fallback content.
- Keep section data close to the renderer and only type the props the renderer
  needs.
- Do not add Payload packages, admin routes, API routes, or CMS-only metadata.
- Payload documentation may remain as template reference material, but the app
  should not contain Payload runtime code after pruning.

Static sites should still use the same render helpers under
`src/lib/marketing-content` when present. The important rule is that the
frontend renders simple page and section data, not a CMS schema.

## Payload-ready

Use this mode when the client might want Payload later, or when the decision is
not final while the site is being built.

- Keep the guarded Payload scaffold in the project.
- Keep Payload admin/API routes disabled until the project is ready to run a
  real CMS.
- Build sections from fallback documents and lightweight renderer props.
- Add new section renderers without forcing them to mirror Payload schema
  details.
- When Payload becomes required, add Payload schemas and adapter code that maps
  CMS documents into the same render props.

Payload-ready mode is intentionally not a live CMS. The scaffold exists so the
project can be activated without rewriting the frontend.

## Payload-powered Vercel

Use this mode when Payload is known to be part of the production website.

- Enable real Payload admin and API routes.
- Provision Neon Postgres and Vercel Blob for the Vercel project.
- Configure `DATABASE_URL`, `PAYLOAD_SECRET`, and `BLOB_READ_WRITE_TOKEN`.
- Keep fallback documents as the no-env, no-content, and preview safety path.
- Resolve Payload documents through server-side content resolvers. Do not fetch
  Payload REST or GraphQL directly from marketing components.

In this mode, Payload schemas may include CMS-only details such as relationships,
media objects, SEO fields, draft state, authors, taxonomies, localization, and
redirect metadata. Resolve that richer data in adapters before it reaches the
frontend renderer.

## Render Contract

The shared contract should stay small:

- a page has a `slug`, optional metadata, and `layout`
- a section has a `blockType`
- section props include only what the renderer needs
- site layout includes simple nav, CTA, footer, and social link data

Avoid making static or Payload-ready builds speak a full Payload-shaped contract.
The frontend should speak "render this page"; Payload is one source that can feed
that shape.
