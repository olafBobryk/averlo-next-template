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

## Lightweight Instances

Use this path when a project should keep the normal Averlo template runtime
but drop optional authoring/demo route families. Run the dry-run first in the
target clone or renamed project instance:

```bash
npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
```

If the plan is accepted, apply the lightweight route-surface prune:

```bash
npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
```

Payload is independent from this route-surface choice. A static lightweight
instance should opt into Payload removal explicitly:

```bash
npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground --no-payload
```

The prune command accepts renamed package identities after template import by
checking the expected Averlo template file/script shape. A mutating prune on
the canonical template `main` checkout requires `--confirm-template-root`;
dry-runs remain allowed.

## Render Contract

The shared contract should stay small:

- a page has a `slug`, optional metadata, and `layout`
- a section has a `blockType`
- section props include only what the renderer needs
- site layout includes simple nav, CTA, footer, and social link data

Avoid making static or Payload-ready builds speak a full Payload-shaped contract.
The frontend should speak "render this page"; Payload is one source that can feed
that shape.

## Thin-Start Instances

Thin-start is an optional instance creation path, not a fourth content source
and not the default template state. Use it when a new project should begin with
the smallest accepted live primitive surface while keeping the original
Averlo component system parked as reference-only code.

Run the dry-run first in the target instance:

```bash
npm run create:thin-start -- --dry-run --in-place
```

If the plan is accepted, activate thin-start explicitly:

```bash
npm run create:thin-start -- --yes --in-place --confirm-instance
npm install
npm run review:thin-start-api -- --strict
npm run build
```

The `--confirm-instance` flag is intentional friction: it means the operator is
running the command in a new/disposable project instance, not on the canonical
default template. After activation, `.thin-start/` is an ignored parked
reference and must not enter the live import graph.

Use normal `npm run prune:template -- [flags]` for broad route/content-mode
surface removal. Use thin-start activation only when the desired instance shape
is the accepted minimal primitive surface. The detailed boundary lives in
`docs/thin-start-creation-boundary.md`.
