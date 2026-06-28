# Averlo Next Template

![Averlo Next Template banner](public/averlo-next-template-banner.png)

Clone the template, give an agent the setup prompt, choose the lightest content
mode that fits the project, and build the project-specific design system on top
of an existing Next.js App Router scaffold.

Averlo Next Template is intentionally small at the live page layer: a marketing
shell, typed section rendering, fallback content, shared primitives, motion
foundations, agent-safe dev tooling, and optional Payload CMS scaffolding. The
goal is to let agents implement a real design system and site structure without
starting from a blank app or first dismantling a demo-heavy product.

## Instant Setup

Template repository: [https://github.com/olafBobryk/averlo-next-template](https://github.com/olafBobryk/averlo-next-template)

### First-Time Bootstrap

Copy this prompt into Codex or another coding agent when you have not cloned
the template yet:

**Create a new Averlo Next Template project from `https://github.com/olafBobryk/averlo-next-template`. Clone it into a new local folder, then read `AGENTS.md`, `README.md`, and `docs/template-content-modes.md`. Keep secrets, deploy hooks, environment files, generated agent indexes, local build output, and local service metadata out of Git. Use the existing marketing shell, section registry, UI primitives, content-mode docs, prune tooling, and agent dev-server workflow as the starting point. Help me choose static, Payload-ready, or Payload-powered mode before changing the content architecture.**

Equivalent shell-first setup:

```sh
git clone https://github.com/olafBobryk/averlo-next-template.git my-site
cd my-site
npm install
npm run dev
```

### Already Cloned

**Set up this repository as an Averlo Next Template project. Read `AGENTS.md`, `README.md`, and `docs/template-content-modes.md` first. Summarize the current content mode, route shell, section registry, UI primitive surface, and optional template workflows. Keep secrets, deploy hooks, environment files, generated indexes, and local build output out of Git. Use `npm run dev:agent` for browser automation and do not use the user's dev server for agent testing.**

### Continue Existing Project

**Continue this Averlo Next Template project. Read the nearest `AGENTS.md` files before changing code. Summarize what has been customized, which optional surfaces are still present, which content mode is active, and what checks are needed. Prefer existing UI primitives, section renderers, resolvers, and template scripts before adding new structure.**

## Public Safety

This repo is intended to be public-template safe. Do not commit local secrets,
tokens, deploy hooks, database URLs, Payload secrets, `.env` files, generated
agent indexes, local Vercel metadata, build output, dependency folders, raw
client files, or throwaway worktrees.

Use ignored local files or platform environment stores for secrets. Keep
source-specific CMS and deployment details behind server-side resolvers and
adapters so the frontend continues to render a small page/section contract.

## What Ships Here

- **Next.js App Router foundation:** public route shell, API routes, metadata,
  sitemap generation, guarded Payload routes, and error states.
- **Marketing shell:** header, compact/full navigation, footer, scroll
  controller, menu/search data, and route-level reveal motion.
- **Typed section renderer:** lightweight page and section types, fallback
  content, a renderer registry, and a starter home hero section.
- **Design-system starting point:** primitives, inputs, overlays, motion
  helpers, focus/motion foundations, branding, and mount components.
- **Content modes:** static fallback content, Payload-ready scaffold, or
  Payload-powered Vercel setup.
- **Agent workflows:** Template Intelligence, isolated agent dev server,
  template pruning, smoke checks, and optional thin-start activation.

## Included Workflows

### Agent Dev Server

Use the isolated agent dev server for browser testing and automation:

```sh
npm run dev:agent
```

The normal `npm run dev` and `npm run dev:user` paths are reserved for a human
local server.

### Template Intelligence

Generate and query the local map before substantial implementation work:

```sh
npm run intelligence:generate
npm run intelligence:query -- route-architecture
npm run intelligence:query -- ui-primitives
npm run intelligence:query -- content-modes
```

The generated `.template-intelligence/` and `.serena/` folders are ignored
local artifacts. See `docs/template-intelligence.md` for the full workflow.

### Content Modes

Choose the lightest content mode that fits the project:

- **Static:** remove Payload with `npm run prune:template -- --no-payload` and
  build from TypeScript fallback content.
- **Payload-ready:** keep guarded Payload files, but do not expose live
  admin/API routes until CMS editing is required.
- **Payload-powered Vercel:** enable real Payload admin/API routes, provision
  Neon Postgres and Vercel Blob, and adapt Payload documents into the same
  lightweight render props.

Read `docs/template-content-modes.md` for mode boundaries and
`docs/payload-vercel-neon-blob.md` before activating Payload on Vercel.

### Lightweight Prune

Dry-run before removing optional surfaces:

```sh
npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
```

Apply the lightweight route-surface prune after reviewing the plan:

```sh
npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
```

For a static site, remove Payload explicitly:

```sh
npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground --no-payload
```

### Thin-Start Mode

Thin-start is an explicit instance activation path, not the default template
state. Use it only when a project should begin with the smallest accepted live
primitive surface while keeping the original Averlo system parked as
reference-only code.

```sh
npm run create:thin-start -- --dry-run --in-place
npm run create:thin-start -- --yes --in-place --confirm-instance
npm install
npm run review:thin-start-api -- --strict
npm run build
```

Read `docs/thin-start-creation-boundary.md` before using this path.

## Repository Layout

```text
.
|-- AGENTS.md
|-- README.md
|-- docs/
|   |-- payload-vercel-neon-blob.md
|   |-- responsive-rendering.md
|   |-- template-content-modes.md
|   |-- template-intelligence.md
|   `-- thin-start-creation-boundary.md
|-- public/
|   `-- averlo-next-template-banner.png
|-- scripts/
|   |-- dev-server.mjs
|   |-- generate-template-intelligence.mjs
|   |-- prune-template.mjs
|   |-- create-thin-start.mjs
|   `-- verify-smoke.mjs
|-- src/
|   |-- app/
|   |   |-- (site)/(marketing)/
|   |   |-- (payload)/
|   |   `-- api/
|   |-- components/
|   |   |-- branding/
|   |   |-- mount/
|   |   `-- ui/
|   |-- lib/
|   |   `-- marketing-content/
|   `-- payload/
|-- package.json
`-- next.config.ts
```

## Useful Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Human local development server. |
| `npm run dev:agent` | Isolated server for agent browser testing. |
| `npm run verify:static` | Biome plus TypeScript checks. |
| `npm run build` | Production Next.js build. |
| `npm run verify:smoke` | Route smoke verification. |
| `npm run prune:template` | Remove optional template surfaces in a clone. |
| `npm run create:thin-start` | Activate the optional thin-start instance path. |

## Deployment

The template is designed for Vercel. Static and Payload-ready projects can ship
without live Payload routes. Payload-powered projects should use Neon Postgres
for `DATABASE_URL`, Vercel Blob for `BLOB_READ_WRITE_TOKEN`, and a
project-specific `PAYLOAD_SECRET`.
