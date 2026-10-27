# Verify component contracts

[Component contracts](../../openspec/specs/app/shared/frontend/components/component-contracts/spec.md)
and [content hierarchy](../../openspec/specs/app/shared/frontend/content/content-hierarchy/spec.md)
own shared behavior. [Component policy](../../src/components/AGENTS.md), nearest
AGENTS and [Catalog Rules](../../.storybook/CatalogRules.mdx) own discovery,
topology and catalogue structure. Colocated app-safe owner contracts and stories
own supported imports, API/variants, exclusions, examples and guarantees. There
is no parallel owner index; Storybook navigation and callable documentation are
the catalogue.

Discover current capabilities with `openspec list --specs`, then read only the
relevant identity with `openspec show <capability-id> --type spec`. Select the
changed surface, relevant `app/shared/` dependencies and existing `product/`
business requirements; do not load ambient siblings. Shared frontend owns
component/interaction/presentation rules, shared services own service boundaries,
and shared data-lifecycle keeps each complete read/submission/action lifecycle
across client and server. Surface-specific policy stays with marketing/dashboard.
Generated projects own selected independent app copies and author product specs
only for real business requirements. A product rule cannot silently override a
conflicting shared obligation; change the relevant specification explicitly.
Only actual canonical template work reads its separate template demo/assembly
contracts. Folder placement neither installs a feature nor creates inheritance.

## Discovery and owner review

Read root/nearest AGENTS first, then the relevant owner contract/story, then callable
Storybook documentation if already available. Do not install a service, guess an
ID or infer props from a discovery result. If unresolved, inspect catalogue
candidates, documented facade and minimum implementation source in that order.
Search/source exports are routing evidence, not public support. Load only the
applicable component/UI/primitive/child policy; selection uses the exact owner.

Inventory all interactive roles, including file inputs, disclosures, navigation
and secondary actions. Prefer the highest complete owner and its compounds,
typography and surfaces. Raw native HTML does not excuse duplicating an owner.
Compare every supported variant value and current consumers by behavior, semantic
purpose and full visual signature before extending an owner. Neutral reusable
teaching must be exhaustive. Report a missing boundary for explicit extension
authorization instead of rebuilding private APIs, creating a product alias or
styling around focus/semantic responsibilities.

Record discovery evidence with actual repository paths:

```sh
npm run design-system:evidence -- --target src/components/ui/primitives/Button.tsx --owner src/components/ui/primitives/Button.stories.tsx
npm run verify:design-system-evidence
```

The receipt records policy→owner story→implementation order; it is not proof that
the behavior works. Review actual raw disclosures, local chrome and typography,
keyboard/file interactions, not only a closed-state screenshot. Fix clear semantic
defects; obtain direction before a broad visual audit changes established design.

## Run component verification

```sh
npm run catalog:check
npm run verify:surface-contracts
npm run verify:storybook-catalog
```

The last command builds Storybook before validating its catalogue. Coordinate
heavy builds with other work. For focused interaction tests, use Preview to obtain
and verify the managed Storybook port, then the installed Storybook CLI. Discover
current documentation/story IDs and read owner documentation before tests; never
guess IDs. With the verified port and discovered IDs:

```sh
STORYBOOK_FEATURE_AI_CLI=1 npx storybook ai -p <verified-port> get-stories-by-component --componentPaths '["<absolute-owner-source-path>"]'
STORYBOOK_FEATURE_AI_CLI=1 npx storybook ai -p <verified-port> get-documentation --id '<discovered-docs-id>'
STORYBOOK_FEATURE_AI_CLI=1 npx storybook ai -p <verified-port> run-story-tests --stories '[{"storyId":"<discovered-story-id>"}]'
```

Semantic accessibility and behavior block migration. A story-scoped visual-token
`a11y.test="todo"` still requires explicit semantic play assertions or a strict
companion; never downgrade an entire family/global default. Check all affected
variants, meaningful states, supported compounds and failure cases. Keep useful
old demonstrations until their lowest-owner teaching is migrated. Runtime must
not import Storybook, CSF, stories or catalogue projection modules. Export previews
use generated order/fixed sections, scoped portals and IDs, one authored axis,
and shell-free geometry. Verify profiles when public contract/inventory differs;
run `verify:component-sweep` only for changed export projection/geometry, not this
documentation-only migration. Do not load raw benchmark fixtures as ordinary context.

## Hierarchy and visual evidence

Use surface/nearest layout/overlay policy only when that owner changes. Verify
hierarchy, stable wrappers, slot/child order, fill, radius, elevation, borders,
semantic accents and responsive composition. Keep unboxed external ContentSection
headings and cohesive Cards, useful warnings/permissions/counts, shared page gutters,
native focus/targets and the existing palette. Supported edge-alignment/Button API
teaching remains in Button's contract; shell geometry/account footer remain in
layout policy and Toolbar teaching. Surface Tint's light/dark contrast matrices
cover actual composited ink/fill pairs; review affected interactive states too.
This procedure introduces no new global button-selection policy or redesign.

## Loading and form boundaries

Use [forms](forms.md) and [loading](loading.md) for their maintained behavior and
execution. Before changing a loading owner, inspect its live owner and dependencies:
classify each part as static, data-dependent, action-pending or unclear. Inspect
the data boundary and ask if genuinely unresolved. Known content stays real;
component-owned skeletons cover only unknown content. Generic Skeleton is allowed
only without an existing owner or inside an approved reusable extension. Report
a missing owner before local approximation; no fake field/bar block framework.

Compare live/loading invocation, wrappers, child order/counts, IDs, responsive copy,
typography, variants and controls, including repeated last rows, footer borders,
padding and corners. Run component/route/entity skeleton verifiers as applicable,
plus managed normal/forced states at affected widths. Do not load a route registry
merely because the component is on a route. Run form/loading browser regressions
only when their consumers change. Keep complete form behavior out of input API
teaching; retain the native mounted control and approved input extension boundary.

Save focused receipts, test output, screenshots and explicit gaps under ignored
`test-results/`. A static verifier, projection or passing story is evidence of its
own boundary, not blanket application conformance.
