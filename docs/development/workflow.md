# Development workflow

How a change moves from Olaf's request to a reported PR in this template. The
canonical steps live in `.specify/workflows/` (menu: [WORKFLOWS](../../WORKFLOWS.md));
this page walks through one example and records the defaults the steps assume.

## Worked example: add a pricing page

**Request.** Olaf: "Add a pricing page to the marketing site: three tiers,
monthly/yearly toggle, FAQ below."

1. **Route** ([main workflow](../../.specify/workflows/main/README.md) step 1).
   A new public page is a new feature, so it needs a spec. Nothing is split into
   separate threads unless Olaf decides.
2. **Grill** ([write-spec](../../.specify/workflows/write-spec/README.md) step 1).
   Questions whose answers change behaviour: Are prices static content or from
   the CMS source? Does the toggle change the URL (shareable) or only local
   state? Which tier is highlighted? Is there a CTA per tier, and where does it
   go? Does the FAQ reuse the existing FAQ section? Olaf's answers are quoted
   verbatim.
3. **Ponytail** (step 2). The page is a `MarketingPageDocument` with existing
   sections: reuse the FAQ section, compose tiers from `Card` and `Button`,
   drive the toggle with a `searchParams` value (no client store, no new
   dependency). Dropped: a pricing calculator, a new "PricingTable" primitive.
4. **Spec** (steps 3–7). `specs/README.md` says public pages are owned by
   `specs/platform/surfaces/marketing/pages/` (rules for any page) and, in a
   generated project, a page spec under `specs/product/marketing/pages/pricing/`
   from `.specify/templates/page-spec-template.md`. In the template itself the
   page is a demonstration, so the change amends the marketing `pages` spec with
   a new Clarifications session and adds `plan.md`/`tasks.md`:
   - T001 section document + fallback content (`src/lib/marketing-content/**`)
   - T002 tier composition (`src/lib/marketing-content/sections/pricing/**`)
   - T003 route and metadata (`src/app/(site)/(marketing)/pricing/**`)
   - T004 proof: `verify:static`, `verify:marketing`, preview at 390 and 1440.
   Olaf approves spec, plan and tasks before any code.
5. **Integration branch and subagents** (main step 3). Cut
   `feat/pricing-page` from `origin/main` in `../.worktrees/averlo-next-template/pricing-page`.
   T001 and T002 touch disjoint folders, so two subagents run in parallel, each
   in its own worktree cut from the integration branch, each with the brief
   template (goal, owned files, spec path, done definition, report format).
   T003 waits for T001 because the route reads the document. Merge order:
   T001, T002, then T003.
6. **Checks** ([verify](../../.specify/workflows/verify/README.md)). On the
   integration branch: `static`, `build`, `smoke`, `marketing`. Subagent results
   do not count for the merged branch.
7. **Local review** (main step 4). `npm run dev` starts an isolated preview;
   load `/pricing` at 390 and 1440 yourself, then give Olaf the verified URL.
8. **PR** (main step 6). Push `feat/pricing-page`, `gh pr create`, do not merge.
   The body lists the amended spec, the checks with results, and the preview.
9. **Report** (main step 7). Lead with the PR link and the preview link; then
   what changed, checks run, and what is not verified (for example "CI not yet
   green", "not checked in Safari").

## Next.js defaults

Next.js 16 ships its docs in `node_modules/next/dist/docs/`; read the relevant
page before writing code. These are the template's documented defaults. Nothing
here is installed by default: adopting zod or TanStack Query adds a dependency
and is a spec decision.

| Default | Rule | Source |
| --- | --- | --- |
| Server Components fetch | Data is read in Server Components or server-only modules by default; files with server-only code import `server-only` (and keep the `*.server.ts` suffix). Client Components sit at the leaves. | `01-app/01-getting-started/05-server-and-client-components.md`, `01-app/02-guides/server-and-client-boundary.md`, `01-app/01-getting-started/06-fetching-data.md` |
| Data access | A server-only data-access layer returns DTOs; only it reads secrets and `process.env`. | `01-app/02-guides/data-security.md` |
| Forms | Server Actions + `useActionState`; validate with zod `safeParse` on the server and the same schema on the client. Every action authenticates, authorizes and validates its input itself. | `01-app/02-guides/forms.md`, `01-app/02-guides/server-actions.md` |
| Client cache | TanStack Query only when Client Components need a real shared live cache (polling, focus refetch, dedupe, optimistic updates across components). Prefetch on the server and pass `<HydrationBoundary>`. A single read passes a promise and `use()`s it. | `01-app/02-guides/client-side-data-fetching/index.md`, `01-app/02-guides/client-side-data-fetching/tanstack-query.md` |
| Caching | Cache Components (`cacheComponents: true`, `use cache`, `cacheLife`, `cacheTag`) is opt-in per route through a spec; the template does not enable it. | `01-app/01-getting-started/08-caching.md`, `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`, `01-app/03-api-reference/01-directives/use-cache.md`, `01-app/02-guides/migrating-to-cache-components.md` |
| State | Shareable state lives in the URL (`searchParams`); component state stays local (`useState`); a global client store needs a spec. | `01-app/03-api-reference/04-functions/use-search-params.md` |
| Testing | Component families are proven by Storybook play tests (`npm run test-storybook`); pages by Playwright characterization tests that diff screenshots, payloads and events before and after a change; logic by `npm run test:unit`. | `.specify/memory/constitution.md`, `specs/platform/surfaces/*/pages/spec.md` |
| Environment | Only `NEXT_PUBLIC_*` reaches the browser bundle; everything else stays server-side. `.gitignore` covers every `.env*` file except committed examples (`.env.example`). | `01-app/02-guides/environment-variables.md` |

## Env and secrets

- Secrets live only in owner-only, gitignored files (`.env.local`,
  `.env.<provider>.local`) or the platform's environment store. Create the file,
  `chmod 600` it, and give Olaf a clickable absolute link to paste the value
  into. Never ask for a secret in chat, and never print, log, quote or commit
  one.
- Document every variable (name, purpose, where it is read) in `.env.example`
  without a value.
- Server code reads secrets through the data-access layer; never prefix a
  secret with `NEXT_PUBLIC_`.
- Fixtures never send email or write externally; real delivery is enabled per
  project through its spec and configured provider.

## Release

`create-averlo` (`packages/create-averlo`) is the public initializer. It pins
the template commit it was built from, so every template change reaches new
projects only through a release.

1. Merge the PR to `main`. `.github/workflows/publish-create-averlo.yml` stages
   the next patch version, runs `verify:profiles` and
   `verify:create-averlo --integration`, smoke-tests the packed tarball,
   publishes through npm trusted publishing, waits for the registry, smoke-tests
   public generation and creates a `create-averlo-v<version>` GitHub release.
2. A manual release tag `create-averlo-v*` publishes a chosen version.
3. Before merging anything that touches assembly, `.specify/` or `specs/`, run
   `npm run verify:profiles` and `npm run verify:create-averlo` locally.
4. After release, check a fresh project:
   `npx create-averlo@latest demo --profile thin-start --content static` then
   `npx create-averlo@latest verify demo --profile thin-start --content static`.

Existing projects are never updated by a release; they pull nothing unless
their owner chooses to.

## Backport

When a generated project does something worth keeping, run the
[backport workflow](../../.specify/workflows/backport/README.md) in the
template: pin the child repo and SHA, diff from that SHA, port rules not values,
amend the owner specs first, and record `Backport from <repo>@<sha>` in the PR.
