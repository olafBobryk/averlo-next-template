# Template Backport Differences Ledger

## Purpose

- Goal: Compare reusable ideas from newer Averlo Next Template descendants back
  against the canonical template and prepare implementation packets without
  importing product-specific scope.
- Template root:
  `/Users/olafbobryk/Documents/Code/Personal/2025/averlo-next-template`
- Source A:
  `/Users/olafbobryk/Documents/Code/Mazi/2026/inference-web-clean`
- Source B:
  `/Users/olafbobryk/Documents/Code/Averlo/2026/averlo-rebrand`
- Historical template recovery source:
  Git ref `7235466` (`84cd3c6` has the same historical `src/components/ui`
  tree) is the source for UI work that already existed in this template before
  `c7397aa` reduced the shared UI surface.
- Framework: Use `template-backport-workflow` classifications:
  `Port`, `Adapt`, `Skip`, and `Defer`.
- Ledger owner: Orchestrator chat. Explorer agents return rows, but do not edit
  this file directly.
- Last updated: 2026-07-01

## Operating Rules

- Classify by lifecycle and pruning ownership before import path.
- Shared UI or workflow code must be generic, documented, demoed, and usable
  outside one product instance before it can survive template pruning.
- Product routes, client copy, brand assets, source-specific IA, backend
  persistence obligations, auth/role behavior, deploy hooks, credentials, and
  generated benchmark logs stay out of the template.
- Backend-bound source behavior must become local, stubbed, or omitted unless
  the template already owns the matching backend contract.
- Use one read-only explorer per source repo for each exploration pass.
  Explorers must read the template backport workflow, template `AGENTS.md`, and
  the relevant source `AGENTS.md`, then return ledger-ready rows only.
- The orchestrator deduplicates rows, assigns stable IDs, updates decisions, and
  creates implementation packets by ownership after ledger review.

## Source Inventory

| Source | Root | Role | Current use |
| --- | --- | --- | --- |
| Template | `/Users/olafbobryk/Documents/Code/Personal/2025/averlo-next-template` | Canonical target | Receives only reusable, template-safe backports. |
| Inference | `/Users/olafbobryk/Documents/Code/Mazi/2026/inference-web-clean` | Product descendant | Source for UI primitive, helper, command-search, loading, and app-shell patterns. |
| Averlo Rebrand | `/Users/olafbobryk/Documents/Code/Averlo/2026/averlo-rebrand` | Product descendant | Source for dev/test workflow, orchestration, scroll-performance, content, metadata, shell, and motion patterns. |
| Historical Template UI | Git ref `7235466` in this repo | Pre-thin-start template state | Primary source for recovered helpers, richer Button behavior, and future form/misc UI packets that already belonged to the template. |

## Candidate Differences

| ID | Source | Candidate | Evidence paths | Template target | Classification | Decision | Risk/gate | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INF-UI-001 | Inference / Historical Template UI | Fill documented UI library gaps: `icons`, `helpers`, `misc`, `Panel`, and `Divider`. | `src/components/ui/helpers/IconSwap.tsx`<br>`src/components/ui/icons/**`<br>`src/components/ui/misc/**`<br>`src/components/ui/primitives/Panel.tsx`<br>`src/components/ui/primitives/Divider.tsx` | `src/components/ui/**` | Adapt | Implemented from history, with gates | Generic `Panel` and `Divider` primitives added; helpers, icons, time helpers, and core misc were restored from `7235466`; graph/health/media-inspection surfaces remain gated. | Complete for core UI recovery; keep only file/media and graph/health gates open. |
| INF-UI-002 | Inference / Historical Template UI | Central icon registry/provider with named icons, missing-icon handling, and override support. | `src/components/ui/icons/Icon.tsx`<br>`src/components/ui/icons/iconRegistry.tsx`<br>`src/app/(site)/layout.tsx` | UI foundations and site layout | Adapt | Partially implemented from history | Historical `src/components/ui/icons/**` restored from `7235466`; app layout/provider wiring was not restored to avoid route/layout scope creep. | Complete unless future consumers need custom provider overrides. |
| INF-UI-003 | Inference / Historical Template UI | Richer `Button` primitive with icon-name support, loading overlay, disabled link handling, skeleton state, and layout controls. | `src/components/ui/primitives/Button.tsx` | `src/components/ui/primitives/Button.tsx` | Adapt | Implemented from history | Restored richer historical behavior from `7235466` while preserving current default CTA behavior; later bulk recovery re-enabled string icon-name rendering through the restored icon registry. | Complete for this pass. |
| INF-UI-004 | Inference | More accessible positioned `Dropdown` with portal/fixed positioning, collision handling, hover pinning, Escape/Tab behavior, and focus handling. | `src/components/ui/primitives/Dropdown.tsx` | `src/components/ui/primitives/Dropdown.tsx` | Adapt | Implemented | Hover pinning, icon registry, `renderMenu`, and motion dependencies intentionally skipped; additive open/positioning props were accepted. | Complete for this pass. |
| INF-UI-005 | Inference / Historical Template UI | Form and typography primitive upgrades: typed tags, skeleton typography, start/end field slots, autofill handling, and live error/message IDs. | `src/components/ui/primitives/Text.tsx`<br>`src/components/ui/primitives/InputFrame.tsx`<br>`src/components/ui/primitives/Field.tsx`<br>`src/components/ui/input/**` | UI primitives and input components | Adapt | Implemented from history | Restored richer `Text`, `Field`, `InputFrame`, and generic input controls from `7235466`, preserving current compatibility where needed. | Complete for core form/input recovery. |
| INF-UI-006 | Inference | Modal focus and scroll management: focus restore, Tab trap, top-most Escape guard, nested scroll-lock counter, and motion props. | `src/components/ui/overlays/modal/ModalShell.tsx`<br>`src/components/ui/overlays/modal/ModalHost.tsx` | Modal overlay primitives | Port/Adapt | Implemented | Source-specific gradient backdrop, sizing, z-index scheme, `Panel`, and motion visuals intentionally skipped. | Complete for this pass. |
| INF-UI-007 | Inference / Historical Template UI | Generic loading and skeleton feedback bundle. | `src/components/ui/misc/Skeleton.tsx`<br>`src/components/ui/misc/Loader.tsx`<br>`src/components/mount/LoadingScreenMount.tsx` | UI misc and mount components | Adapt | Implemented | `Skeleton` and `Loader` preserved with current accepted adaptations; branded/source loading screen visuals remain out of scope. | Complete for shared loading primitives. |
| INF-UI-008 | Inference / Historical Template UI | Copy action and animated copy/check helper. | `src/components/ui/helpers/useCopyAction.tsx`<br>`src/components/ui/helpers/IconSwap.tsx`<br>`src/components/ui/misc/CopyField.tsx` | `src/components/ui/helpers/**`<br>`src/components/ui/misc/CopyField.tsx` | Port | Implemented from history | Restored `IconSwap`, `useCopyAction`, helper guidance, and `CopyField`; adapted copy/check icons to local ReactNode SVGs instead of the deferred icon registry. | Complete for this pass. |
| INF-UI-009 | Inference | Responsive hero section min-height and inner-height fix. | `src/components/ui/primitives/Section.tsx` | `src/components/ui/primitives/Section.tsx` | Port | Implemented | Class-only primitive change; worker skipped visual preview because no route/API change was introduced. | Complete for this pass. |
| INF-APP-001 | Inference | Generic command/search registry pattern: flatten route tree, match keywords/actions, rebuild hierarchy, and preserve review query flags. | `src/app/(site)/_components/inference-webos/InferenceCommandSearch.tsx`<br>`src/app/(site)/_components/inference-webos/InferenceSideRail.tsx` | Future template route/search registry | Defer/Adapt | Deferred | Current implementation is source IA, copy, and app-shell specific. | Revisit only if template search/navigation scope expands. |
| INF-UI-010 | Inference / Historical Template UI | Generic avatar, chip, helper palette, and physically clipped overlapping avatar stack pattern. | `src/components/ui/misc/Pill.tsx`<br>`src/components/ui/misc/ProfilePicture.tsx`<br>`src/components/ui/misc/Chip.tsx`<br>`src/components/domain/inference/InferenceAtoms.tsx` | UI misc and optional demo/reference surface | Adapt | Implemented from history, with media gates | Restored historical `Pill`, `ProfilePicture`, `Chip`, and other core misc controls from `7235466`; skipped Inference domain atoms and gated file/media preview components. | Complete for generic avatar/chip/misc recovery. |
| ARB-DEV-001 | Averlo Rebrand | Random agent preview ports and section-anchor review link policy. | `AGENTS.md`<br>`docs/orchestration/artifacts/preview-port-policy.md`<br>`scripts/dev-server.mjs` | Dev server workflow | Port | Implemented | Verified `--random` dry-run and preserved user server isolation. | Complete for this pass. |
| ARB-DEV-002 | Averlo Rebrand | Shared local production preview helper for smoke checks. | `scripts/_lib/local-production-preview.mjs`<br>`scripts/verify-smoke.mjs`<br>`scripts/prune-template.mjs` | Testing scripts | Port | Implemented | Product route list was not ported; internal-route env remains local to smoke verification; prune renderer now preserves helper output. | Complete for this pass. |
| ARB-TOOL-001 | Averlo Rebrand | Deterministic scroll-performance harness with internal fixture page and benchmark scripts. | `src/app/(site)/(marketing)/internal/scroll-performance/page.tsx`<br>`scripts/measure-scroll-performance.mjs`<br>`docs/worklogs/scroll-performance-benchmark.md` | Internal tooling | Adapt | Candidate, gated | Adds Playwright and a prunable internal route; outputs must be ignored. | Separate tooling packet with explicit dependency gate. |
| ARB-TOOL-002 | Averlo Rebrand | Scroll-performance autoresearch loop. | `scripts/setup-scroll-performance-autoresearch.mjs`<br>`scripts/score-scroll-performance-candidate.mjs`<br>`autoresearch/scroll-performance-program.md` | Experimental workflow | Defer | Deferred | Creates worktrees, writes runtime state, and can hard-reset discarded candidates. | Keep as research-only until tooling policy is accepted. |
| ARB-ORG-001 | Averlo Rebrand | Static-page orchestration template: entry recommendation, section contract, review routing, and learning return. | `docs/orchestration/shapes/static-page-implementation-strategy-template.md`<br>`docs/orchestration/workpieces/static-page-entry-recommendation-template.md`<br>`docs/orchestration/workpieces/static-page-section-defined-contract-template.md`<br>`docs/orchestration/workpieces/static-page-pattern-return-template.md` | Orchestration/process docs | Adapt | Strategy baseline initialized | Current shape strategy support docs were initialized and updated from `codex-orchestrator-dashboard`; Averlo product projection was not copied. | Defer starter static-page shapes unless the template should ship accepted project-local orchestration examples. |
| ARB-ORG-002 | Averlo Rebrand | Docked orchestration CLI pointer/shim from commit `795ee82`. | `docs/ORCHESTRATION.md`<br>`scripts/orchestration.mjs`<br>`package.json`<br>`.gitignore` | Orchestration pointer and CLI shim | Adapt | Implemented | `docs/orchestration/` is ignored and externally managed as a nested root; Averlo product graph, agents, runs, checkpoints, and `.codex-orchestration/` state were not copied. | Complete for shim/pointer; initialize the docked root separately when projection state is needed. |
| ARB-CONTENT-001 | Averlo Rebrand | Markdown content-page renderer and fixture surface for legal/docs-style pages. | `src/components/domain/content-page`<br>`src/app/(site)/(marketing)/internal/content-page-system/markdown-test/fixture.ts`<br>`src/app/(site)/(marketing)/internal/content-page-system/online-feature-list-test/fixture.ts` | Content pages and internal reference fixtures | Adapt | Candidate, gated | Bespoke parser and contact-copy special case need replacement or tests. | Create content/metadata packet after scope decision. |
| ARB-CONTENT-002 | Averlo Rebrand | Static-first resolver and site-content boundary with small render props. | `src/lib/marketing-content/resolvers.ts`<br>`src/lib/marketing-content/types.ts`<br>`src/lib/marketing-content/sections/registry.tsx` | Content modes | Adapt | Candidate, not implemented | Do not port page slugs, IA, copy, or client section types. | Compare against existing content-mode docs before implementation. |
| ARB-UI-001 | Averlo Rebrand / Historical Template UI | UI primitive affordances: loading buttons, touch hit areas, stable field errors, chip multiselect, and scroll borders. | `src/components/ui/primitives/Button.tsx`<br>`src/components/ui/primitives/Field.tsx`<br>`src/components/ui/input/ButtonMultiSelectInput.tsx`<br>`src/components/ui/misc/ScrollBorders.tsx` | UI primitives, inputs, and misc | Adapt | Implemented from history/adapted | Generic `ScrollBorders` added; historical Button touch hit areas, loading overlay, skeleton behavior, `Field`, and historical multiselect/combobox controls restored. `ButtonMultiSelectInput` was not a historical template file and was not added. | Complete for reusable primitive/input affordances. |
| ARB-MOTION-001 | Averlo Rebrand | Motion/reveal primitive upgrades: corner-clip image reveal, numeric reveal, and automation-friendly motion flags. | `src/components/ui/motion/reveal/RevealImage.tsx`<br>`src/components/ui/motion/reveal/RevealNumeric.tsx`<br>`src/components/ui/foundations/motionDisableOverride.ts` | Motion primitives and foundations | Adapt | Implemented | Product loading SVG data was not ported; intro/loading URL override integration was wired into the loading mount. | Browser verification remains optional for future consumers using these primitives. |
| ARB-SHELL-001 | Averlo Rebrand | Shell-owned CTA and shared layout provider pattern. | `src/app/(site)/(marketing)/_components/layout/MarketingShell.tsx`<br>`src/app/(site)/(marketing)/_components/layout/MarketingSharedLayout.tsx`<br>`src/app/(site)/(marketing)/_components/layout/Cta.tsx` | Marketing shell | Adapt | Candidate, gated | Do not import visuals, assets, copy, or routes; expose generic shell slot only. | Consider after content/shell ownership review. |
| ARB-META-001 | Averlo Rebrand | Static metadata factory and root metadata helper. | `src/lib/site-content/metadata.ts`<br>`src/config/metadataConfig.ts` | Metadata and SEO | Adapt | Candidate, not implemented | Product URL, keywords, icons, route list, and manifest assets must not port. | Include with content/metadata packet. |

## Skip/Gate List

| ID | Source | Item | Decision | Reason | Follow-up |
| --- | --- | --- | --- | --- | --- |
| SKIP-INF-001 | Inference | `src/app/(site)/(app)/**`, `/deal/**`, `/access/**`, and `_components/auth/inference*` | Skip | Product IA, mock access/session behavior, and deal routes. | Do not port. |
| SKIP-INF-002 | Inference | `src/app/(site)/_components/inference-webos/**` | Skip except extracted patterns | WebOS shell, assistant state, deal data, route map, and visuals are source-specific. | Keep only command/search pattern as deferred idea. |
| SKIP-INF-003 | Inference | `src/components/domain/inference/**` | Skip except generic avatar-stack idea | Domain atoms depend on Inference tokens, copy, sizes, and routes. | Extract only reusable visual mechanics if needed. |
| SKIP-INF-004 | Inference | `public/brand/inference/**` and Navon logo/root metadata changes | Skip | Brand and client assets. | Do not port. |
| GATE-INF-001 | Inference | `src/font/sf-pro/**` and root font wiring | Gate/Skip | Large local font payload and licensing/bundle concerns. | Do not add as template default without explicit font policy. |
| SKIP-INF-005 | Inference | Supabase/customer push token migrations or service-role workflows | Skip | Backend persistence and external service obligations. | Do not port. |
| GATE-INF-002 | Inference | `react-markdown` and `remark-gfm` dependency additions | Gate | Observed use is source assistant markdown; generic renderer scope is separate. | Revisit only with content-page packet. |
| SKIP-INF-006 | Inference | Inference KPI/WebOS media rules in global CSS | Skip | Product-specific viewport scaling and hover behavior. | Do not port. |
| SKIP-ARB-001 | Averlo Rebrand | Product routes and IA: `about`, `work`, `services`, `blog`, `booking`, `contact`, and `terms-of-use` trees | Skip | Source-specific pages, copy, assets, and navigation. | Do not port. |
| GATE-ARB-001 | Averlo Rebrand | `src/lib/booking`, `/api/booking`, `/api/contact`, `/api/internal/email-preview` | Gate/Skip | Provider-backed email/calendar/booking behavior creates external-state obligations. | Do not port unless template explicitly adopts matching provider contract. |
| GATE-ARB-002 | Averlo Rebrand | `google-auth-library`, `resend`, `playwright`, `@icons-pack/react-simple-icons`, and `lucide-react` | Gate | Dependencies vary by candidate and may broaden template cost/scope. | Decide per packet, with dependency rationale. |
| SKIP-ARB-002 | Averlo Rebrand | `public/assets/**`, source favicons, manifest assets, and brand imagery | Skip | Brand/client assets. | Use only as pattern evidence. |
| GATE-ARB-003 | Averlo Rebrand | `docs/orchestration/**` product graph | Gate | Active Averlo orchestration state should not port wholesale. | Use the docked `docs/orchestration/` root only when initialized separately; do not copy product projection docs into the template. |
| GATE-ARB-004 | Averlo Rebrand | `vercel.json`, `.vercelignore`, deploy hooks, and deployment metadata | Gate/Skip | Instance-specific deployment shape and possible secret-adjacent config. | Do not port without separate deployment policy. |
| SKIP-GLOBAL-001 | Both | `docs/worklogs/template-intelligence-benchmark-runs.jsonl` and generated local indexes | Skip | Generated/local benchmark drift is not reusable template behavior. | Do not copy source rows into template. |
| SKIP-GLOBAL-002 | Both | Secrets, tokens, API keys, chat IDs, deploy hooks, and env values | Skip | Project policy forbids exposing or committing secrets. | Use ignored repo-local env files when needed. |

## Decisions

| Date | Decision | Rationale | Status |
| --- | --- | --- | --- |
| 2026-07-01 | Use Averlo Rebrand as the Averlo source for this ledger. | It is recent, clean, and contains active orchestration and workflow artifacts. | accepted |
| 2026-07-01 | Keep the central differences ledger tracked under `docs/worklogs`. | Findings should be durable and reviewable before implementation packets are created. | accepted |
| 2026-07-01 | Explorers are read-only and the orchestrator owns ledger writes. | Prevents concurrent writes to one tracked file and keeps classification consistent. | accepted |
| 2026-07-01 | This pass records candidates only; it does not backport code. | Implementation needs packet-specific ownership, docs/demo/prune updates, and verification. | accepted |
| 2026-07-01 | Do not run the hybrid preset for this ledger-only pass when it would append tracked benchmark rows outside the requested change. | The shell lacks default `npm`/`node`/`uv`/`serena` PATH entries, and the requested first step is ledger creation only. | accepted |
| 2026-07-01 | Initialize and update the current shape strategy from `codex-orchestrator-dashboard` instead of copying Averlo Rebrand orchestration projection docs. | The template had no recognized strategy root; `init:shape-strategy` plus `update:shape-strategy` produces current generic support docs without importing product graph state. | accepted |
| 2026-07-01 | Keep ARB-UI-001 limited to `ScrollBorders` for this pass. | Button, Field, and multiselect changes are broader primitive API decisions and should not be bundled with a small scroll affordance. | accepted |
| 2026-07-01 | Keep prune-generated smoke verification on the shared local production helper. | The Averlo Rebrand helper was accepted for `verify:smoke`; leaving the old inline renderer would regress pruned clones during later template cleanup. | accepted |
| 2026-07-01 | Adapt `INF-UI-001` Panel and Divider with template-local visual scale. | The source primitives are generic, but the template uses smaller `rounded-md` surfaces and does not currently ship the old internal demo route requested by component guidance. | accepted |
| 2026-07-01 | Split copy helper from icon registry work. | Current template and Averlo Rebrand Button APIs accept `ReactNode` icons; copy behavior can use existing toast policy without committing to `lucide-react`, Phosphor, or a local SVG registry. | accepted |
| 2026-07-01 | Recover UI helpers and Button from historical template ref `7235466` before sourcing those ideas from product descendants. | `IconSwap`, `useCopyAction`, `CopyField`, and richer `Button` already existed in this template and were removed by `c7397aa`; restoring history preserves template intent without importing product scope. | accepted |
| 2026-07-01 | Prefer path-limited bulk recovery from `7235466` over component-by-component historical recovery. | A raw revert of `c7397aa` conflicts in current layout/content files and re-adds auth, dashboard, internal demo, reference, and playground surfaces; targeted directory restores recover the reusable UI library without widening app scope. | accepted |
| 2026-07-01 | Adopt the docked `docs/orchestration/` pointer and CLI shim, and remove `.codex-orchestration/` from this checkout. | The current orchestration strategy is an ignored nested root managed separately; legacy `.codex-orchestration/` evidence is not projection truth. | accepted |
| 2026-07-01 | Add a soft canonical-`main` prune warning while preserving the hard mutating gate. | Dry-runs should warn maintainers that pruning template `main` can collapse the full template, while mutating runs still require `--confirm-template-root`. | accepted |
| 2026-07-01 | Keep `prune:template --confirm-template-root` idempotent against already-thinned optional surfaces. | The recovered checkout no longer has `MarketingContentSearch.tsx`; confirmed prune should skip that optional rewrite and still generate fallback content matching `SiteLayoutDocument`. | accepted |

## Explorer Runs

| Date | Agent | Source | Mode | Result |
| --- | --- | --- | --- | --- |
| 2026-07-01 | `019f1b40-0694-7953-8d84-015c5102d17c` | Inference | Read-only explorer | Returned UI, icon, modal, dropdown, loading, command-search, avatar, and skip/gate findings. |
| 2026-07-01 | `019f1b40-0a75-7f13-ba54-962ede99efe0` | Averlo Rebrand | Read-only explorer | Returned dev/test, scroll-performance, orchestration, content, UI, motion, shell, metadata, and skip/gate findings. |
| 2026-07-01 | `019f1b54-04ad-7e00-b4ad-9e209bcfb3ff` | Averlo Rebrand | Worker | Implemented `ARB-MOTION-001` motion/reveal primitives. |
| 2026-07-01 | `019f1b54-5119-74f3-93fa-d993e9d9a3d4` | Averlo Rebrand | Worker | Implemented `ARB-DEV-001` and `ARB-DEV-002` dev/test workflow changes. |
| 2026-07-01 | `019f1b54-904b-74f1-bbcf-856a7b289e2a` | Averlo Rebrand | Worker | Implemented narrowed `ScrollBorders` slice from `ARB-UI-001`. |
| 2026-07-01 | `019f1b59-56c1-7b53-ac70-fcd72163f751` | Inference | Worker | Implemented light `Skeleton` and `Loader` slice from `INF-UI-007`. |
| 2026-07-01 | `019f1b68-00f7-7520-8e2e-c84fcbfbf036` | Inference | Worker | Implemented `INF-UI-009` responsive hero `Section` sizing. |
| 2026-07-01 | `019f1b71-8934-7d72-bee2-cc207c6549f2` | Inference | Worker | Implemented `INF-UI-004` dropdown behavior backport. |
| 2026-07-01 | `019f1b71-dfc8-7eb1-90c5-c6838e135580` | Inference | Worker | Implemented `INF-UI-006` modal behavior backport. |
| 2026-07-01 | `019f1b72-2913-76b3-9dd4-e341b87aa866` | Inference/Rebrand | Read-only explorer | Recommended `split-copy-and-icons`: implement `IconSwap` and `useCopyAction` before any icon registry/provider. |
| 2026-07-01 | `019f1ba3-9207-7bb1-8c20-7f68b62cd052` | Historical Template UI | Read-only explorer | Mapped `7235466` UI files back to ledger rows and split future recovery into icon, form/input, core misc, file/media, and graph/health packets. |
| 2026-07-01 | `019f1ba3-6294-7fe2-8144-b0e20e3d326b` | Historical Template UI | Worker | Restored `INF-UI-008`, `CopyField`, and `INF-UI-003` richer Button behavior from `7235466`, intentionally skipping icon registry. |
| 2026-07-01 | `019f1bb4-7d20-7bf1-834a-e17635dc61b8` | Historical Template UI | Worker | Bulk-restored reusable UI library surfaces from `7235466`: icons, inputs, time helpers, richer `Text`/`Field`/`InputFrame`, and core misc, while keeping app routes, graph/health, and media-inspection surfaces gated. |
| 2026-07-01 | Orchestrator | Averlo Rebrand / Template | Cleanup packet | Implemented `ARB-ORG-002`, removed `.codex-orchestration/`, added canonical-`main` prune warning, and verified the confirmed prune path in a disposable checkout. |

## Next Packets

| Packet | Candidate IDs | Purpose | Required checks |
| --- | --- | --- | --- |
| File/media/profile controls gate | `INF-UI-010` | Decide whether file upload/gallery/preview, inspectable image, profile picture, signature, phone, and image-switcher controls belong back in the template. | Dependency and pruning gate; `npm run lint`; `npm run typecheck`; `npm run build`; browser checks if UI routes are added. |
| Reference/intelligence graph and health gate | `INF-UI-001` | Decide whether historical `GraphMap`, `InteractionGate`, and `HealthCheckIndicator` belong in the template and adapt to the current health/intelligence contracts. | Dependency gate; prune dry-run; health contract check; `npm run build`. |
| Content/metadata patterns | `ARB-CONTENT-001`, `ARB-CONTENT-002`, `ARB-META-001` | Adapt static-first content, content-page fixture, markdown/legal page, and metadata helper ideas without product IA. | `npm run lint`; `npm run typecheck`; content route smoke checks if routes are added. |
| Internal tooling | `ARB-TOOL-001`, `ARB-TOOL-002` | Decide whether scroll-performance tooling belongs in the template and how it prunes. | Dependency gate; prune dry-run; ignored-output check; browser fixture check if accepted. |
| Orchestration starter examples | `ARB-ORG-001` | Decide whether the template should ship starter project-local shapes beyond the generic strategy support docs. | Shape-strategy adapter check; no product graph references. |

## Verification Log

| Date | Check | Result | Notes |
| --- | --- | --- | --- |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id backport-port-consolidation ...` | passed | Generated Template Intelligence, queried `ui-primitives` and `dev-server`, made two Serena semantic calls, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run lint` | passed | Biome reported config info messages only. |
| 2026-07-01 | `npm run typecheck` | passed | TypeScript completed with no errors. |
| 2026-07-01 | `npm run build` | passed | Next build completed; `.env.local` was present but not inspected. |
| 2026-07-01 | `npm run verify:smoke` | passed | Local production smoke checked `/`, `/internal/intelligence`, and `/api/health`; health `503` accepted. |
| 2026-07-01 | `npm run dev:agent -- --dry-run` | passed | Printed `http://localhost:3013` with automation URL. |
| 2026-07-01 | `npm run dev:agent -- --random --dry-run` | passed | Printed a random agent port with automation URL. |
| 2026-07-01 | `check-shape-strategy-adapter` | passed | Adapter read the initialized strategy root with no warnings. |
| 2026-07-01 | `git diff --check` | passed | No whitespace errors. |
| 2026-07-01 | `node --check scripts/prune-template.mjs scripts/verify-smoke.mjs scripts/_lib/local-production-preview.mjs` | passed | Syntax checks completed for prune and smoke helper scripts. |
| 2026-07-01 | `npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground` | passed | Dry-run preserved smoke rewrite as a central file without mutating the checkout. |
| 2026-07-01 | `npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground --no-payload` | passed | Dry-run covered the no-Payload variant and package rewrite plan. |
| 2026-07-01 | `npm run prune:template -- --dry-run --no-intelligence` | passed | Dry-run covered the route-list variant where `/internal/intelligence` is removed. |
| 2026-07-01 | Rendered prune smoke verifier sanity check | passed | Retained routes include `/internal/intelligence`; intelligence-pruned routes omit it; both use the shared production preview helper. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id INF-UI-009 ...` | passed | Worker generated Template Intelligence, queried `ui-primitives`, made two Serena semantic calls, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run lint`, `npm run typecheck`, `git diff --check` | passed | Worker verification for the responsive hero `Section` sizing port. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id INF-UI-001-panel-divider ...` | passed | Generated Template Intelligence, queried `ui-primitives`, made two Serena semantic calls, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check` | passed | Verification for added `Panel` and `Divider` primitives. |
| 2026-07-01 | `npm run verify:smoke` | passed | Final local production smoke after primitive additions checked `/`, `/internal/intelligence`, and `/api/health`. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id INF-UI-004-dropdown ...` | passed | Worker generated Template Intelligence, queried `ui-primitives`, made two Serena semantic calls, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id INF-UI-006-modal ...` | passed | Worker generated Template Intelligence, queried `ui-primitives`, made two Serena semantic calls, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check` | passed | Integrated verification after dropdown and modal behavior backports. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id historical-ui-restore ...` | passed | Reran with valid topics `ui-primitives` and `prune-behavior` after an invalid topic attempt; recorded a Hybrid benchmark row. |
| 2026-07-01 | `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` | passed | Orchestrator verification after restoring historical `IconSwap`, `useCopyAction`, `CopyField`, and richer `Button` behavior from `7235466`; lint reported existing Biome config info only. |
| 2026-07-01 | `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` | passed | Worker verification after bulk UI recovery from `7235466`; restored icons, inputs, time helpers, and core misc while leaving graph/health/media-inspection surfaces gated. |
| 2026-07-01 | `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` | passed | Orchestrator verification after integrating the bulk UI recovery and ledger updates; lint reported existing Biome config info only. |
| 2026-07-01 | `npm run intelligence:hybrid -- --task-id orchestration-prune-cleanup ...` | passed | Generated Template Intelligence, queried `dev-server` and `prune-behavior`, made a Serena semantic lookup, and recorded a Hybrid benchmark row. |
| 2026-07-01 | `node --check scripts/orchestration.mjs scripts/prune-template.mjs` | passed | Syntax checks completed after adding the orchestration shim and prune warning/idempotency changes. |
| 2026-07-01 | `npm run orchestration -- state` | expected failure | Cleanly reported that no docked `docs/orchestration` CLI root exists yet. |
| 2026-07-01 | `npm run orchestration-state` | expected failure | Same clean missing-docked-root message as the direct orchestration command. |
| 2026-07-01 | `npm run prune:template -- --dry-run --no-dashboard` | passed | Printed the canonical-template `main` warning and did not mutate files. |
| 2026-07-01 | `npm run prune:template -- --yes --no-dashboard` | expected failure | Printed the warning and kept the hard gate without `--confirm-template-root`. |
| 2026-07-01 | `npm run prune:template -- --yes --no-dashboard --confirm-template-root` in disposable checkout | passed | Confirmed maintainer path completed formatter, reference validation, and build outside the dirty working tree. |
| 2026-07-01 | `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` | passed | Final cleanup packet verification; lint reported existing Biome config info only. |
