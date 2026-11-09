# Agent Instructions

The canonical Averlo Next template: a product-neutral Next.js foundation that
materializes independent projects through positive assembly.

## Read first

- `.specify/memory/constitution.md`: principles every agent follows.
- `PRODUCT.md` before product, audience or UX decisions.
- Main thread (the agent talking to Olaf): `.specify/workflows/main/README.md`.
  A subagent follows its brief and the files below instead.
- Writing or amending a spec: `.specify/workflows/write-spec/README.md`.
- Behaviour: `specs/README.md` maps every spec; read the owner spec of the
  surface you change and its shared dependencies. `specs/template/` applies only
  to assembly or demo work.
- Structure, topology, import direction and server/client boundaries: the
  nearest `AGENTS.md`. Component APIs and defaults: the owner's Storybook stories.
- Procedures: `WORKFLOWS.md` (names-only menu); worked example and Next.js
  defaults: `docs/development/workflow.md`.

## Structure

- `src/app/(site)/dashboard` is the application area and `src/app/(site)/(marketing)`
  the public site; a generated project's profile decides which exist.
- Provider-specific records and metadata resolve in server-side resolvers or
  adapters before data reaches the frontend contract.
- `template-assembly/`, `template-profiles/`, `template-surfaces/`, `packages/`
  and `plugins/` are template-only and never ship to generated projects.
- Building from a design source follows `.specify/workflows/compose/README.md`;
  mapping a whole design file follows `.specify/workflows/systemize/README.md`.
  Motion comes from `specs/platform/design-system/motion` during the build.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
