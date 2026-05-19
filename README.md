# Webvizion Website Template

This repository is the base template for building Webvizion websites.

It provides:
- a Next.js app-router foundation
- a shared component library under `src/components`
- a marketing site shell under `src/app/(site)/(marketing)`
- an optional dashboard shell under `src/app/(site)/dashboard`
- a centralized demo/catalog system under `src/app/(site)/(marketing)/internal/demo`
- a dictionary area under `src/app/(site)/(marketing)/internal/dictionary`
- an internal reference area under `src/app/(site)/(marketing)/internal/reference`
- optional Payload-ready content scaffolding for CMS-capable websites
- reusable UI, motion, overlay, and feedback patterns for Webvizion site builds

## What This Project Is For

Use this template when starting or extending a Webvizion website.

It is intended to give Webvizion projects:
- a consistent component and layout system
- reusable interaction patterns instead of page-local UI
- a demo environment for documenting and testing components
- an optional dashboard/auth shell when the project needs a product area
- a lightweight content-rendering layer that can stay static or later be backed
  by Payload
- a shared baseline for future site work

## Getting Started

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Included Surfaces

The template currently ships with four route-level surfaces:

- `/(marketing)`: the public website shell
- `/dashboard`: the optional dashboard shell with its own providers, auth gate, and sidebar
- `/internal/demo`: internal component and utility demos
- `/internal/dictionary`: structured reference patterns and source material
- `/(payload)`: guarded Payload admin/API stubs for Payload-ready clones

The internal surfaces are useful while authoring the template. New project clones do not need to keep all of them.

## Content Modes

The template supports three content modes:

- **Static:** remove Payload with `npm run prune:template -- --no-payload` and build from plain TypeScript fallback content.
- **Payload-ready:** keep the guarded Payload scaffold while the CMS decision is open. Build sections from lightweight fallback/render data, then activate Payload later by adapting CMS documents into that same render shape.
- **Payload-powered Vercel:** enable real Payload admin/API routes, provision Neon Postgres and Vercel Blob in Vercel, and read Payload through server-side content resolvers.

The frontend should speak a small rendering contract: pages, sections, and site layout data. It should not speak a full Payload schema. Payload-specific metadata belongs in Payload schemas and adapter code.

See `docs/template-content-modes.md` for the mode model and `docs/payload-vercel-neon-blob.md` for the Vercel activation path.

## Pruning a Clone

After cloning the repo, you can remove optional surfaces in place with:

```bash
npm run prune:template -- [flags]
```

Available flags:

- `--no-dashboard`: removes `/dashboard`, `/login`, and dashboard-only auth helpers
- `--no-demo`: removes the internal demo surface
- `--no-dictionary`: removes the internal dictionary surface
- `--no-reference`: removes the internal reference/docs surface
- `--no-payload`: removes the guarded Payload scaffold and Payload packages
- `--dry-run`: prints the plan without changing files
- `--yes`: skips the confirmation prompt

Examples:

```bash
# See what a marketing-only prune would remove
npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference

# Remove dashboard/auth from a cloned project
npm run prune:template -- --yes --no-dashboard

# Remove Payload from a static clone
npm run prune:template -- --yes --no-payload
```

The prune command deletes owned route trees and rewrites the centralized route, nav, search, and API export files so the cloned project stays buildable.

## Key Areas

- `src/app`: application routes, layouts, and pages
- `src/app/(site)/(marketing)`: public site routes and marketing shell assembly
- `src/app/(site)/dashboard`: optional dashboard shell and dashboard pages
- `src/app/(site)/(marketing)/internal/demo`: internal component demo and documentation system
- `src/app/(site)/(marketing)/internal/dictionary`: structured pattern vault for source material
- `src/app/(site)/(marketing)/internal/reference`: repo-level utility links and operational notes
- `src/components`: shared Webvizion UI library
- `src/lib`: reusable non-UI utilities such as API, feedback, and mocks
- `src/lib/marketing-content`: lightweight content resolvers, fallbacks, and section renderers
- `src/payload`: Payload collections, globals, blocks, and CMS helpers
- `docs`: template mode, Payload, and setup documentation

## Demo System

The component demo system lives under `src/app/(site)/(marketing)/internal/demo`.

It is useful for:
- browsing available UI primitives and higher-level components
- validating interaction states and variants
- documenting reusable patterns for future Webvizion websites

Most demo content is centralized in `src/app/(site)/(marketing)/internal/demo/content.tsx`.

## Dictionary

The dictionary is not the canonical live app. It is a structured pattern vault for reusable source material.

Use it to:

- inspect reference implementations
- copy or adapt `_source/` files into live template code
- review `manifest.ts` notes before porting a pattern

The live template design system remains the source of truth. Borrow structure and interaction logic first; do not copy dictionary styling blindly.

## Dashboard

The dashboard lives under `src/app/(site)/dashboard` and is route-scoped on purpose.

It currently provides:

- a dedicated dashboard layout chain
- a mock auth flow and `/login` route
- a responsive sidebar and dashboard page wrapper
- dashboard-scoped status, error, and not-found surfaces

If a project is purely marketing-site work, remove it with `npm run prune:template -- --no-dashboard`.

## Development Notes

- Prefer extending the shared component system instead of building page-local one-off UI.
- Check the nearest `AGENTS.md` file before adding new reusable features.
- Keep demos and documentation updated when shared components change.
- Use Tailwind responsive classes for visual breakpoint changes, and reserve
  `useTailwindBreakpoints` for branches where hidden content would still mount
  expensive client work. See `docs/responsive-rendering.md`.

## Deployment

This project is designed to be deployed as a Webvizion website, typically on Vercel.

For Payload-powered Vercel projects, use Neon Postgres for `DATABASE_URL`, Vercel Blob for `BLOB_READ_WRITE_TOKEN`, and a project-specific `PAYLOAD_SECRET`. The guarded admin/API stubs are not a live CMS; activate them only when the project is intentionally Payload-powered.
