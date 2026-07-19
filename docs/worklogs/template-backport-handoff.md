# Inference Console Port Handoff

## Objective

Port the accepted reusable architecture from pinned Inference Console commit
`8a13d12ea11461fe204625bd1247a6db16c4a207` into both Averlo template profiles.
Full start becomes a polished organization-first reference product; thin start
shares its visual foundation through filesystem-backed materialization.

## Working state

- Target worktree:
  `/Users/olafbobryk/Documents/Code/Personal/2025/averlo-next-template-inference-port`
- Branch: `codex/inference-port`
- Baseline: `50616826610a9acded69625133e476694cdf3358`
- Source: `/Users/olafbobryk/Documents/Code/Mazi/2026/inference-console`
- Source policy: use `git show` or `git archive` at the pinned commit; never read
  implementation input from its dirty working tree.
- Full preview: restart/verify with `npm run dev:agent -- --random` before review.
- Thin preview: restart/verify with `npm run dev:thin -- --random` before review.
- Worktree policy: retain through both visual gates. Do not merge, push, or
  remove it without explicit direction.

## Product spine

Reusable full/thin template parity plus a product-ready, organization-powered
full-start dashboard.

## Delivery order

1. P1-C1 — profile engine and Panel/Card reconciliation.
2. P1-C2 — shared visual system and component convergence; visual gate 1.
3. P1-C3 — provider-neutral auth and organization lifecycle.
4. P1-C4 — dashboard shell, registry, commands, and debug state.
5. P1-C5 — reference entities, policy, pruning, skill, and visual gate 2.

One verified commit closes each chunk. P1-C1 and P1-C2 are closed; P1-C3 is
current and P1-C4 through P1-C5 follow sequentially.

## P1-C1 state

- Status: complete in commit `6cb2c99`.
- Main baseline was committed cleanly as `5061682` before worktree creation.
- `template-profiles/thin-start/manifest.mjs` is authoritative for profile
  files, removals, package changes, route/script retention, API review, and
  verification.
- Former embedded component bodies are normal files beneath
  `template-profiles/thin-start/overrides/`.
- `create:thin-start` defaults to `.thin-start/workspace`, supports `--output`,
  and retains guarded `--in-place --confirm-instance` activation.
- `review:thin-start-api -- --root <workspace> --strict` reads the manifest.
- `dev:thin -- --random` refreshes the same profile before starting its isolated
  server.
- Full and thin share canonical `Panel` and `Card`. `Card` is implemented on
  `Panel`; unstructured surfaces and overlay roots use `Panel`.
- Thin Sonner toast remains an explicit file-backed override.

## P1-C2 state

- Status: complete; the closing commit immediately follows this handoff update.
- The pinned light/dark token, focus, motion, radius, status, spectrum, sidebar,
  and scrollbar grammar is installed with Inter through `next/font/google`.
- Shared primitives retain stronger template APIs while matching the source
  surface system. Button loading remains position-absolute and skeletons live
  on their owning component namespaces.
- `ModalForm`, `ModalStepForm`, `StepIndicator`, structured confirmation,
  DateInput, generic DateRange contracts, selection interception, file/profile
  lifecycle cleanup, More-menu factories, and NullState are implemented.
- The existing Markdown renderer remains shared. MDXEditor, source mode,
  mentions, modal editing, and color inputs are full-start only.
- Thin materialization removes editor/color source, CSS, dependency, and lockfile
  records while retaining shared Panel/Card and the common visual foundation.
- Both profiles pass typecheck, production build, smoke verification, and the
  strict thin API review. Responsive light/dark review passed for the full demo
  and the thin home/contact/internal-intelligence route matrix.
- Verified previews at chunk closure:
  `http://localhost:3037/internal/demo?motion=off&reveal=off` (full) and
  `http://localhost:3034?motion=off&reveal=off` (thin).

## Required gates

Every chunk runs `git diff --check`, focused Biome checks, `npm run typecheck`,
and relevant structural verification. Shared/profile chunks also materialize a
disposable thin workspace, run strict API review, install, typecheck, build, and
smoke both profiles.

Visual reviews use isolated random-port previews and
`?motion=off&reveal=off`. Gate 1 covers the full component demo and thin
home/contact/internal-intelligence matrix. Gate 2 covers the complete auth and
dashboard journey in light/dark and mobile/tablet/desktop.

## Stop conditions

Stop for human input if the source pin changes, the target prerequisite becomes
dirty outside the active chunk, a provider/backend dependency becomes necessary,
an existing public API must be removed, or visual parity requires changing the
accepted information architecture.

## Exclusions

Do not port source-specific Supabase, Resend, Lucide, DnD, charting, PDF,
branded-provider, notification, role, or domain implementations. Do not port SF
Pro, product logos/copy, custom profile gradients, or Inference-specific profile
backgrounds. Charts and summary metrics remain optional.
