# Repository Workflows retirement map

This is the review and reconciliation record for this change, not a replacement routing index. Paths below are relative to the repository. New spec paths are under `openspec/specs/` after sync and under this change's `specs/` before sync. Existing form/loading specs remain unchanged. Proposed procedure files are created during apply, only where an existing canonical procedure does not already own the instructions.

## Retirement rule

The twenty concern documents and router have been inspected. Their exact file hashes and all heading-section ranges are recorded in `source-baseline.json`. The entries below cover every source section, including repository-context and verification sections. **Destinations are planned, not yet migrated.** During apply, record exact destination anchors for each source section and split mixed sections into individual clause rows. Mark a clause complete only when its full meaning, exceptions and verification are present at that destination. A theme match alone is insufficient. Duplicate retirement requires a named equivalent destination; nothing is discarded merely because it is awkward to specify.

Recheck hashes before deletion. Reconcile drift rather than silently overwriting it. Link closure, owner evidence and executable results are separate from OpenSpec syntax validation. The audit history stays excluded from generated projects.

## 1. Router — `SKILL.md`

- **Route the work / Orient through selected concerns / Preserve routing boundaries:** concise root AGENTS authority guidance plus stock OpenSpec context/discovery. Preserve focused scope, applicable-only source reading, highest complete owner, structural/API authority and targeted checks. Do not recreate the fourteen-entry selection table or load-all requirement.
- **Entry table:** behavioral destinations are the capabilities below; structural and procedural destinations remain their owners. No replacement entry-workflow reporting obligation survives after retirement.
- **Repository-mode overlays:** template classification by generated receipt versus canonical package/directories and propagation eligibility move to `template-assembly/AGENTS.md` and project-creation procedure. Scope only proven output edges; generated instances receive no generator guidance.
- **Compatibility and handoff:** retain operational skill exclusivity and owner/verification evidence in each affected operational workflow; retire the obsolete requirement to report selected router workflows/loaded concern names. Report actual changed scope and evidence instead.

## 2. `action-lifecycle.md`

- **Contract / Hard boundaries:** `data-lifecycle/action-behavior`, with form-specific submission rules left in `data-lifecycle/form-behavior` and read states in `data-lifecycle/loading-state-behavior`. Preserve synchronous guards, action-group ownership, clicked-only busy feedback, sibling conflict blocking, reversible optimism, confirmation, one completion navigation and active cancellation.
- **Feedback distinctions:** inline recoverable error, persistent usable-context notice, transient discrete result and durable instructions map to action behavior; exact InlineError/StatusMessage/Card presentation belongs to their Storybook contracts and `src/lib/feedback/AGENTS.md`.
- **Repository context:** retain dependency/feedback ownership in `src/components/ui/primitives/AGENTS.md`, `src/components/ui/overlays/AGENTS.md`, nearest mutation owner and relevant Storybook contracts. Pending close policy cross-references `interaction/keyboard-and-overlays`.
- **Verification / Coverage checks:** proposed `docs/testing/actions.md`; keep forms/loading procedures separate. Cover returned and thrown failure, rapid repeated action, delayed siblings, confirmation cancel/all close paths, rollback, retry, and exactly-once completion navigation. Reuse `verify:mutation-policy`, `verify:entity-deletion`, `verify:modals` and focused owner interactions; add missing behavior assertions only.

## 3. `api-transport.md`

- **Contract / Hard boundaries:** `integration/api-transport` owns consistent typed outcomes, injectable environment/transport, cancellation and safe error boundaries. `src/lib/api/AGENTS.md` and `src/lib/AGENTS.md` retain shared request-client location, thin wrappers, intentional exports, no UI imports/feedback/navigation, no repeated parser/auth/retry policy and no demo-only drifting wrappers.
- **Repository context:** keep public client, mock transport and caller server boundaries with these existing owners; contact delivery cross-references its independent capability.
- **Verification:** proposed `docs/testing/api-transport.md`, exercising real-shaped wrappers with injected success, non-success, malformed response, cancellation and network failure; check types, client secret exclusion and dependency direction.

## 4. `auth-organization.md`

- **Contract / Hard boundaries:** `identity/access-and-membership` owns server session/active membership, distinct global/org/platform axes, safe continuations, closed optional methods, invitation inert reads/explicit acceptance, recipient/token/expiry/revocation/reuse checks, reinvitation invalidation and last verified identity safety. `identity/private-file-access` owns authorized metadata/download/replacement/deletion, opaque references and expiring access.
- **Provider and topology policy / Repository context:** `src/lib/auth/AGENTS.md`, `src/app/(site)/dashboard/platform/AGENTS.md`, `src/lib/files/AGENTS.md` (create only if needed) and actual adapter owners retain provider-neutral interfaces, SDK isolation and explicit provider lifecycle; fixture non-durability remains explicit.
- **Verification:** proposed `docs/testing/identity.md`, reusing `verify:auth` and `verify:platform`, plus applicable endpoint/owner checks. Test direct unauthorized requests, stale organizations, invitation lifecycle, identity removal and private-file access/cleanup. No live identity-provider provisioning.

## 5. `catalogue-contracts.md`

- **Contract / Hard boundaries:** `ui-system/component-contracts` covers one supported implementation/contract, exhaustive neutral teaching, faithful stories/catalogue/export projections, deliberate profile omissions and preserved public identity.
- **Exact topology / Repository context:** `.storybook/CatalogRules.mdx`, `src/components/AGENTS.md`, `src/components/ui/AGENTS.md`, `src/lib/component-catalog/contract.tsx` teaching and `src/app/(component-export)/internal/demo/AGENTS.md` retain typed contract shape, ordering/fixed export sections, shell-free previews, isolated portal preview IDs, private helpers, generated projections and runtime/story dependency prohibition. Do not delete useful stories until their teaching is migrated.
- **Verification:** proposed `docs/testing/component-contracts.md`; reuse `catalog:check`, focused Storybook interactions, `verify:storybook-catalog`, profile checks and `verify:component-sweep` when export geometry changes.

## 6. `contact-delivery.md`

- **Contract / Hard boundaries:** `delivery/contact-delivery`, `delivery/submission-protection`, `integration/api-transport` and existing form behavior. Preserve server validation, guards before send, trimmed/deduplicated configured recipients, recipient-independent professional message content, source/contact details, configured reply path, missing-config unavailability, generic provider error, personal-data-free logging and form recovery.
- **Repository context:** normalized message builders and delivery adapters remain server-owned; `src/lib/forms/AGENTS.md` and `src/lib/api/AGENTS.md` keep dependency policy. This capability never enables delivery on fixture contact/support forms.
- **Verification and provisioning:** proposed `docs/testing/contact-delivery.md` for controlled automated boundaries. Existing Contact Form skill and credential/form-UX references retain recipient decisions, provisioning, secret handling, deployment/inbox procedures and intentional real-send authorization. Automated browsers intercept delivery before submission; no real send is authorized by this migration.

## 7. `content-sources.md`

- **Contract / Hard boundaries:** `content/source-resolution` owns static, guarded ready and activated powered semantics, normalized source-neutral data, seed/recovery preservation, activation/readback/parity gates and authoritative fail-closed behavior.
- **Topology / Repository context:** `src/lib/marketing-content/AGENTS.md`, Payload adapter ownership and assembly owners retain provider records resolved server-side, discriminated page/layout/section contracts, single frontend rendering and static-mode absence of Payload packages/routes/deployment hooks. Add a nearest adapter AGENTS only where no existing structural owner covers it.
- **Verification:** extend existing `docs/operations/payload-vercel-neon-blob.md` where necessary rather than creating a competing provisioning procedure; proposed `docs/testing/content-sources.md` owns local/fixture tests. Reuse `verify:site-layout`, `verify:payload-site-layout`, `verify:payload-pages` and content-mode assembly checks. Live Neon/Blob/Vercel activation remains a separate authorized operation.

## 8. `entity-architecture.md`

- **Contract / Hard boundaries:** `domain/entity-presentation` owns consistent identity/labels/fields/URLs/variants/commands, resettable external-write-free fixtures, collection paging versus overview continuation and genuine typed tool presentation. Cross-reference identity, action and loading capabilities rather than copy them.
- **Four layers / Repository context:** `src/app/(site)/dashboard/_lib/entities/AGENTS.md`, `_components/entities/AGENTS.md`, `_lib/AGENTS.md` and nearest renderers retain facts+inputs, React/fetch-free presentation factories, data-ready live/skeleton renderers and route adapters; direct factories, no global entity barrel/registry, provider normalization and no speculative full entity family. Shared tables/selectors/option rendering remain component-owned. Assistant wrapper only for a real typed tool path.
- **Verification:** proposed `docs/testing/entities.md`; reuse `verify:frontend-entities` and its individual entity/deletion/mutation/skeleton/policy checks. Preserve relevant form/loading browser coverage.

## 9. `form-protection.md`

- **Contract / Hard boundaries:** `delivery/submission-protection` retains public/external, attachment and explicit abuse-control applicability, ordinary authenticated-edit exception, server guard-before-effects, neutral honeypot/no downstream work, server file validation and policy-owned thresholds.
- **Repository context:** `src/lib/forms/AGENTS.md` owns reusable honeypot/cookie/cooldown/file helpers; SpamProtectionFields Storybook and text-input AGENTS own its UI. No endpoint duplication, client-only enforcement, new provider limit or personal-data logging.
- **Verification:** extend `docs/testing/forms.md` only with protection verification/cross-references, preserving its behavioral spec. Exercise genuine invalid server requests, neutral honeypot, cooldown and unauthorized/invalid files as applicable. Configuring a missing provider threshold still requires an explicit policy/user decision.

## 10. `form-semantics.md`

- **Contract:** complete form behavior is already in `data-lifecycle/form-behavior`; retain it unchanged. Supported input selection and native mounted owner guarantees map to `ui-system/component-contracts` and actual input teaching.
- **Hard boundaries / Repository context:** `src/components/ui/input/AGENTS.md`, nearest input-family AGENTS and Storybook retain highest complete owner, supported imports/compounds, native form/value/keyboard/file semantics and no raw/deep-import duplication.
- **Verification:** existing `docs/testing/forms.md`, `verify:forms` and focused owner interactions; no universal new form framework or all-input review.

## 11. `interaction-responsive.md`

- **Contract / Hard boundaries:** `interaction/keyboard-and-overlays` owns semantics/names/focus, scoped keyboard behavior, topmost focus return, dismissal/scroll and blocking versus anchored behavior. `interaction/responsive-and-motion` owns initial essential content, bounded hidden expensive branches, reduced/off/fallback agency, coherent motion ownership and interruption.
- **Exact APIs / Repository context:** Button treatment versus geometry, typography, shared focus, ContentPresence's measured size/spacing versus trigger semantics, shared motion provider/scheduler/timing/springs, overlay hosts and SVG casing remain with component contracts and primitive/motion/overlay AGENTS. Memoization remains justified by correctness or measurement. Existing loading rules stay in their spec.
- **Verification:** proposed `docs/testing/interactions.md`, focused Storybook and `verify:modals`; managed Preview/breakpoint review when needed. Fix semantic accessibility defects directly; retain the existing requirement to obtain direction before changing established visual design solely for a visual audit finding.

## 12. `loading-parity.md`

- **Contract:** already migrated to `data-lifecycle/loading-state-behavior`; no new loading delta or shimmer requirement.
- **Owner selection and review / Structural boundaries:** `src/components/AGENTS.md`, `src/components/ui/misc/state/AGENTS.md`, primitives and entity owner AGENTS retain highest complete live/skeleton owner, meaningful generic-state exceptions and explicit scope for a missing owner. No hand-rolled/forked loading tree.
- **Repository context / Verification:** `docs/testing/loading.md` owns execution and evidence; existing `verify:loading` and skeleton verifiers stay. Remove the bridge only after dependent links resolve.

## 13. `marketing-architecture.md`

- **Contract / Hard boundaries:** `content/marketing-composition` owns ordered normalized sections, shared shell data across viewport modes and destination meaning; route/source/media capabilities own their independent guarantees.
- **Topology / Repository context:** `src/lib/marketing-content/AGENTS.md` and `src/app/(site)/(marketing)/_components/AGENTS.md` retain route-family/document/registry delegation, source-neutral naming, renderer leaf conventions, shared SiteShell/header/menu/footer scroll ownership, Tailwind-first and narrowly justified CSS-module exceptions. Source asset fidelity does not grant shared-owner changes. Explicit utility exceptions remain bounded.
- **Verification:** proposed `docs/testing/marketing-composition.md`; reuse `verify:marketing`, `verify:marketing-sections`, `verify:site-layout`, route checks and focused owner interactions. Compose retains source intake/review procedures rather than moving them into behavioral requirements.

## 14. `media-delivery.md`

- **Contract / Hard boundaries:** `content/media-delivery` covers durable exact constituent assets, no flattened source captures/expiring URLs, truthful dimensions, authored versus decorative alt, responsive delivery and evidence-backed preload.
- **Exact implementation / Repository context:** marketing-content and component AGENTS/owner teaching retain optimized static image defaults, supported raster blur versus SVG treatment, static-versus-remote frontend value shape and server provider resolution. Preserve the exact local waiver syntax `averlo-media-exception-next-line <rule> -- <rationale>`, one rule/use per annotation and prohibited-exception boundaries.
- **Verification:** media section in `docs/testing/marketing-composition.md`; reuse `verify:marketing-media`, `verify:marketing`, focused rendering and applicable CMS/source checks. Keep original asset bytes/provenance evidence in Compose source intake.

## 15. `owner-discovery.md`

- **Contract / Hard boundaries:** `ui-system/component-contracts` owns supported owner behavior, complete neutral teaching, stable names, native semantics and faithful projections. `src/components/AGENTS.md` and `src/components/ui/AGENTS.md` retain evidence order: nearest AGENTS → Storybook contract → already callable docs → catalogue candidates → public facade/minimum source. No installation, guessed IDs/APIs, parallel tree/registry/index or unsupported-export inference.
- **Detailed workflow / Repository context:** preserve complete variant comparison and consumer search, inventory of every interactive role including disclosure/file/navigation/secondary actions, global-default changes at the owner, distinct reusable wrappers, smallest client boundaries and server-safe exports. Internal direct-module/cycle exceptions and explicitly user-directed visual override exceptions remain. Missing owner contract requires explicit scope to extend it.
- **Verification:** existing design-system evidence command and component-contract procedure retain owner receipts, meaningful keyboard/file checks, focused behavior/accessibility, catalogue/profile checks, semantic repair and visual-redesign approval distinction.

## 16. `performance-measurement.md`

- **Contract / Hard boundaries / Repository context / Verification:** consolidate into existing `docs/operations/scroll-performance.md` and its harness ownership. No new generic performance spec. Preserve real existing route, production-like local build, accepted baseline, same viewport/path/geometry gate, primary metric and paired tolerance, disposable clean-worktree loop, declared mutable product scope, read-only harness/schema/baseline/runtime state, retained/rejected candidate and confirm evidence.
- Preserve bans on historical benchmark-as-product evidence, shorter-page/scroll-distance cheats, harness mutation and internal measurement-only routes. Ordinary motion/visual work does not trigger measurement. Reuse `verify:scroll-performance`; link the procedure through WORKFLOWS when established as the canonical menu entry.

## 17. `route-architecture.md`

- **Contract / Hard boundaries:** `navigation/route-identity` owns one installed family identity, typed dynamic destinations, semantic ancestry, shared vocabulary, contextual command cleanup and close-before-execute; authorization remains server-owned.
- **Structural policy / Repository context:** dashboard registry AGENTS, dashboard AGENTS and route-family owners retain marketing/auth/dashboard registries, dashboard-only enrichment, domain roots, capability gating, width/nav-parent metadata and internal-route separation. Server page/loading plus route-local Surface composition remains local until actually reusable. Browser metadata stays separate.
- **Verification:** proposed `docs/testing/routes-and-metadata.md`; reuse `verify:route-surfaces`, `verify:dashboard-pages`, `verify:dashboard`, `verify:surface-contracts` and applicable site checks.

## 18. `route-metadata.md`

- **Contract / Hard boundaries:** `navigation/document-metadata` owns family title order, private robots policy, home exception, canonical installed href, consistent robots/social fields and same cached authoritative read as body. Utility code ownership stays explicit until a deliberate migration; invalid authoritative content cannot silently revive fallback metadata.
- **Repository context:** route/metadata factory owners and marketing-content AGENTS retain centralized derivation and provider adapters; no page-specific app-name copies or CMS-owned route identity.
- **Verification:** `docs/testing/routes-and-metadata.md`; reuse `verify:route-metadata` and applicable route/surface/Payload checks, with same-read and query-independent canonical scenarios.

## 19. `section-construction.md`

- **Contract / Hard boundaries:** `content/marketing-composition` owns semantic reviewable regions, meaningful source-neutral data, distinct content/shell/excluded/accumulated boundaries and stable selectors. Keep the user-visible result separate from exact renderer topology.
- **Structural clauses / Repository context:** marketing-content AGENTS retain installed route-family registration, page resolving MarketingPageDocument/delegating through renderMarketingSections, one blockType → one `sections/**/<blockType>/<PascalBlockType>Section.tsx`, supporting components colocated/no Section suffix, no direct route imports/opaque whole-page renderer and Tailwind/CSS exceptions. Shared Section Storybook retains root/background/frame APIs and registry attrs.
- **Source decomposition procedure:** Compose source-intake and Visual Parity focus-packet references retain pre-edit source hierarchy/bounds/heading/background/rhythm classification, case/block/renderer/selector row, evidenced footer as shell-only, approved excluded header, comparison-only accumulated gates, separate cases even with continuous appearance, pause on ambiguous split and explicit human Systemize decision for later consolidation. Do not turn shell cases into Section-root obligations or merge independent cases to satisfy code reuse.
- **Verification:** `docs/testing/marketing-composition.md` and retained Compose checks verify route ownership, registry topology, one content root per renderer, meaningful render data, case counts/boundaries, stable selectors, media and direct managed section-anchor review links.

## 20. `template-propagation.md`

- **Contract / Hard boundaries:** `template/project-assembly` owns positive selected output, independent projects, omissions, explicit overrides and established propagation. Keep this capability template-only.
- **Repository context:** `template-assembly/AGENTS.md`, profile AGENTS and project-creation procedure retain receipt/canonical classification and proven-edge-only inspection; no ambient all-profile audit, widened thin profile, machinery in instances or inference that direct assembler maintenance was requested.
- **Verification:** assembly procedure and `verify:profiles` retain inclusion/omission/override/dependency/script/inventory/output checks plus ordinary behavior checks. Replace obsolete overlay-name reporting with actual propagation evidence.

## 21. `visual-composition.md`

- **Contract / Hard boundaries:** `experience/content-hierarchy` owns coherent grouping, useful nonduplicated context, role separation, usable alignment and legibility. Surface Storybook plus `src/components/ui/primitives/surfaces/AGENTS.md` retain Page/ContentSection/Panel/Card/Float vocabulary, independent elevation/behavior, overlay Card fill, semantic Section separation, slot/facade/private-recipe policy, stable wrappers/gradient borders/aligned radii and closed shared accent treatment. InputFrame retains composer/shared input fill. Preserve the organization settings example and no per-property/nesting-for-spacing/page-card shortcuts.
- **Dashboard shell:** dashboard layout/toolbar/sidebar/account-menu teaching and dashboard AGENTS retain exact existing geometry: recessed surface/inset background/no outline; desktop 8px outer-right/bottom and 12px corners, tablet 4px/8px, phone no inset; 240px/64px desktop, 64px tablet rail+drawer, phone drawer. Preserve brand/back/forward/collapse, search width, footer AccountIdentity secondary organization label, nested gated organization menu/no separate switcher, helper links, assistant/new-chat/collapsible sections, breadcrumb/title typography, toolbar above workspace/aligned inner gutter, iconless conversation rows, no duplicate global header/route offsets and workspace versus assistant scroller ownership.
- **Edge-aligned actions / Vocabulary:** Button Storybook and primitive AGENTS retain treatment versus geometry (`bare` does not imply no padding), `size="none"` explicit geometry, visible-content versus control-box alignment, mixed-group spacing, baseline, nonoverlapping targets and hover/focus review. Preserve existing variant teaching at that owner; do not introduce the deferred canonical app-wide button-use spec.
- **Icons:** Icon Storybook/registry and icon AGENTS retain semantic action/file symbols, no arbitrary inline SVG/unrelated fallback, active-provider evidence, visible label where possible, accessible icon-only names and shared square sizing. ContentSection teaching retains text-only headings without decorative leading icons.
- **Page alignment and copy:** ContentSection/layout owners retain outer heading/action/card/table alignment, Heading ownership, one useful description, no redundant page intro or external-heading divider, with warnings/permissions/field guidance/counts preserved.
- **Color roles across surfaces:** SurfaceTint/foundation/input/identity owner teaching retains exact neutral roles, primary-text versus fill, closed semantic accents, actual composite light/dark/state contrast, applicable 4.5:1/3:1 thresholds, decorative-fill exception and name-stable static avatar palette/no status implication. No route-specific neutral ramps.
- **Repository context / Verification:** exact surface/layout/overlay owners plus proposed `docs/testing/component-contracts.md` and `docs/testing/interactions.md`; retain `verify:surface-contracts`, focused owner tests and managed breakpoint review where material.

## Dependent consumers and deletion gate

| Consumer | Required migration and evidence |
| --- | --- |
| Root AGENTS, PRODUCT, OpenSpec config | Authority wording and native discovery; no old skill requirement or duplicate capability index. Validate referenced paths. |
| Compose, Animate, Systemize Composition, Contact Form | Replace invocation with direct target-repository contract/procedure lookup; keep existing operational approvals, source boundaries and provider decisions. Test packaged resolution. |
| Plugin README and agent metadata | Remove primary-router claims and old reference links; delete router agent metadata with directory only at completion. No cache edit/publication. |
| `verify-skill-references.mjs` and tests | Remove hardcoded router/reference base and fourteen-row assertion; preserve generic link/path/command checks and show broken-reference rejection. |
| Compose workflow tests | Replace reads of retired references with actual destination assertions; retain source-intake, shared shell, decomposition, media and explicit workflow-approval coverage. |
| `template-assembly/assembler.mjs` | Remove generated router instructions; generate applicable spec/procedure guidance and verify no stale path. |
| Assembly manifests, surface/profile owners, thin-start inventory | Explicit applicable specs/docs/tests/scripts, template-only assembly spec/history, independent unchanged stock skills, feature-correct omissions and cross-reference closure. Verify full/thin × full/app-only/marketing-only; content modes as supported. |
| WORKFLOWS | Names-only links to established canonical procedures; no capability-by-capability launcher or routing index. |
| Historical docs/change records | Historical mentions may remain clearly historical; no executable/live policy dependency on deleted paths. Explicitly classify any remaining search result. |

Retirement requires concrete destination anchors for every baseline section and clause, valid links, unchanged maintained form/loading hashes, relevant behavior evidence, passing new ownership/reference tests and generated-profile evidence. Strict OpenSpec validation alone is not proof of migration completion.


## Implemented clause receipts

The source-group plan above is reconciled to exact destination anchors in these
change-local receipts. These are audit records, not runtime discovery files:

- [Foundation/router and template propagation](reconciliation-foundation.md)
- [Lifecycle, interaction, component, hierarchy and entity ownership](reconciliation-presentation.md)
- [Identity, transport, submission protection and delivery](reconciliation-identity.md)
- [Routes, metadata, sources, media and composition](reconciliation-content.md)

The [final section ledger](section-ledger.md) accounts for every recorded baseline heading. Clause rows
in the receipts split mixed structural, behavioral, operational and verification
rules; repeated titles and router mechanics have explicit duplicate/retirement
dispositions. Source hashes must be checked again before removing originals.
