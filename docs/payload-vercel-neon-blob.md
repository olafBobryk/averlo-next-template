# Payload on Vercel with Neon and Blob

This template ships with a guarded Payload scaffold. By default, the live
marketing site renders fallback content from `src/lib/marketing-content` and
does not call Payload REST, GraphQL, or an external API from frontend components.

Use this guide when a cloned project should become a real Payload-powered
website on Vercel.

## When To Use This

- Use **Static** mode when the site does not need a CMS. Run
  `npm run prune:template -- --no-payload`.
- Use **Payload-ready** mode when the CMS decision is not final. Keep this
  scaffold, keep admin/API disabled, and keep building sections from fallback
  render data.
- Use **Payload-powered Vercel** mode when the project will run Payload in
  production. Complete the activation checklist below.

See `docs/template-content-modes.md` for the full mode model.

## Required Vercel Services

- Neon Postgres from the Vercel Marketplace for the Payload database.
- Vercel Blob for Payload media uploads.
- Environment variables configured in Vercel and pulled into local development.

Recommended references:

- [Payload installation](https://payloadcms.com/docs/getting-started/installation)
- [Payload Postgres](https://payloadcms.com/docs/database/postgres)
- [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
- [Neon on Vercel](https://vercel.com/marketplace/neon)

## Environment Variables

Set these in Vercel project settings:

```bash
DATABASE_URL="postgres://..."
PAYLOAD_SECRET="use-a-long-random-secret"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
```

Then sync them locally:

```bash
vercel env pull .env.local --yes
```

`DATABASE_URL` is provided by the Neon integration. `BLOB_READ_WRITE_TOKEN` is
created when Blob storage is added to the Vercel project. `PAYLOAD_SECRET` must
be generated per project and never committed.

## Neon Setup

1. Open the Vercel project dashboard.
2. Install Neon from the Vercel Marketplace.
3. Attach the Neon database to the project.
4. Confirm `DATABASE_URL` is present for Development, Preview, and Production.
5. Pull env vars locally with `vercel env pull .env.local --yes`.

Prefer the Vercel Marketplace integration over manual Neon provisioning because
it keeps project env vars and deployment environments aligned.

## Blob Setup

1. Open the Vercel project dashboard.
2. Add a Blob store to the project.
3. Confirm `BLOB_READ_WRITE_TOKEN` is present for the environments that need CMS
   uploads.
4. Pull env vars locally after the token exists.

The scaffolded Payload config uses `@payloadcms/storage-vercel-blob` for the
`media` collection. When the token is missing, the Blob adapter is disabled and
Payload falls back to local upload behavior.

## Activation Checklist

The current scaffold is Payload-ready, not Payload-powered. To activate Payload:

1. Replace the `/admin` stub with Payload's real Next.js admin page.
2. Replace the `/api/[...slug]` stub with Payload's real route handlers.
3. Keep `payload.config.ts` wired through `@payload-config`.
4. Add or update Payload collections, globals, and blocks for the site's CMS
   needs.
5. Update `getMarketingPage()` and `getSiteLayout()` to read via the Payload
   Local API on the server.
6. Map Payload documents into the lightweight render contract used by the
   marketing frontend.
7. Keep fallback documents for no-env, no-content, local clone, and preview
   safety.
8. Run a production build and verify `/admin`, `/api`, and the public marketing
   pages with Vercel env vars present.

Do not make marketing components fetch Payload REST or GraphQL directly. Keep
all source-specific logic inside the server-side content resolvers and adapters.

## Content Adapter Rule

Payload schemas may be richer than the frontend render contract. That is
expected. Relationships, media records, SEO fields, draft state, localization,
authors, redirects, and taxonomy data should be resolved before rendering.

Frontend sections should receive simple props that match what the component
renders. If a section later needs more data, extend that section's render props
and then adapt Payload and fallback data into the new shape.
