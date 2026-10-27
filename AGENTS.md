# Agent Instructions

## Project

- This is the canonical Averlo Next template: a product-neutral Next.js
  foundation that materializes independent projects through positive assembly.
- Read `PRODUCT.md` before making product, audience, or UX decisions. Treat it
  as product intent; use repository policy, skills, and verifiers for
  engineering contracts.

## Averlo Plugin Pack

- The optional Averlo plugin supplies explicitly selected operational workflows.
  Ordinary implementation and review use canonical contracts and verifiers;
  missing plugin skills do not block that work.
- `$averlo:compose` owns native source-backed composition and measured human
  review passes. `$averlo:systemize-composition` explicitly owns later shared
  design-system decisions, `$averlo:animate` explicitly owns motion, and
  `$averlo:visual-parity` supplies subordinate evidence. A source-backed
  composition must not call Figma or edit product code until Compose is loaded;
  systemization and animation must not begin without their explicit workflows.
- Root and nearest `AGENTS.md` files own structural policy. Existing verifier
  commands own deterministic policy.

## Contract ownership

- Maintained contracts have three roots. `template/` owns canonical-only
  `assembly/project-assembly` and `demonstrations/demo-behavior`. `app/` owns
  reusable behavior: `shared/frontend`, `shared/services` and complete
  `shared/data-lifecycle` capabilities, plus `marketing/` and `dashboard/` surface
  policy. `product/` is reserved for an independent project's real business
  requirements; do not invent placeholder specifications or product domains.
- Applicable app and template contracts both govern this canonical repository.
  Generated projects receive explicitly selected independent app copies and
  may author their own product contracts; they never inherit template contracts.
  Demo reset/no-delivery/non-durability does not prohibit authorized real
  persistence or configured delivery in an independent product. Folder placement
  alone does not install a feature, provider or contract.
- Discover maintained capabilities with `openspec list --specs`, then read the
  relevant identity with `openspec show <capability-id> --type spec`. Start with
  the changed surface, its relevant shared dependencies and existing product
  requirements. Read template contracts only for actual canonical template,
  demo or assembly work. Scope units by their targets or state boundaries;
  adjacent unchanged behavior and sibling folders do not trigger extra loading
  or procedures. Add no parent-policy duplication, implicit router, capability
  index, routing skill or custom schema; use the normal stock change lifecycle.
- Product business rules refine compatible generic implementation contracts.
  An incompatible obligation requires an explicit specification change; do not
  silently override a shared rule based on its folder or presumed precedence.
- Nearest `AGENTS.md` owns source topology, dependency direction and server/client
  boundaries. Storybook owner contracts own supported component APIs and defaults.
  Canonical procedures own execution and evidence; `WORKFLOWS.md` is their names-only menu.
- Find the highest complete existing owner before composing lower-level pieces.
  Preserve explicit exceptions and approval boundaries; a missing contract is
  a scope gap to resolve, not permission to invent an API or product policy.

## Development and Review Isolation

- Complete-form behavior is owned by `openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md`.
  Use standard OpenSpec operations for changes to that contract and
  `docs/testing/forms.md` for executable verification. Component APIs and
  structural ownership remain with Storybook and the nearest `AGENTS.md`.

- Initial and region loading behavior is owned by
  `openspec/specs/app/shared/data-lifecycle/loading-state-behavior/spec.md`; use
  `docs/testing/loading.md` for verification. The `app/shared/data-lifecycle/` family groups
  independent read/presentation and submission contracts without duplicate parent rules.

- Use `$preview` to start, recover, verify, or hand off application and Storybook
  previews. It owns wrapper selection, server isolation, generated preview
  state, review modes, section anchors, screenshots, and verified review links.
- Do not start development servers or report a preview as live outside that
  workflow.

## Application Areas

- The dashboard is the application implementation area.
- Marketing is the public-site implementation area.
- A generated project's selected profile determines which areas exist. Use the
  matching repository workflow and nearest `AGENTS.md` for their structure.
- Resolve provider-specific records and metadata in server-side resolvers or
  adapters before data reaches the frontend contract.

## Design System

- For UI work, follow the nearest `AGENTS.md`, Storybook owner evidence, and
  existing repository verifiers rather than treating this file as a component
  catalogue or API reference. Use applicable maintained behavior contracts.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
