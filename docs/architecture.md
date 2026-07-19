# Averlo Template Architecture

Final accepted architecture for the Averlo full-start and thin-start profiles.
This document defines durable system boundaries and does not authorize or prescribe an implementation sequence.
Reviewed against [the staging acceptance ledger](./architecture-staging.md) on 2026-07-19 with no unresolved or drifted decisions.

## Source relationship

- Full start is the canonical broad template system.
- Inference Console is a pinned visual and behavioral reference, not a runtime dependency, general component donor, backend blueprint, or source dependency.
- Inference Console revision `8a13d12ea11461fe204625bd1247a6db16c4a207` is the immutable baseline for this convergence. Later source changes require an explicit repin decision.
- Structural primitive convergence begins with `Panel` and `Card`; styling convergence covers the complete shared consumer layer.
- Source convergence is additive. Matching the reference must not flatten mature template APIs that remain useful.

## Template profiles

### Shared-source invariant

- Components present in both full start and thin start normally share one implementation and visual contract.
- A profile-specific implementation exists only as an explicit, intentional override.
- Full start's live source is the canonical shared source rather than materialized output.
- Thin start references canonical shared files through an authoritative profile manifest.
- Genuine thin-specific replacements live as real source files outside the full-start import graph.

### Authoritative profile manifest

- One manifest declares shared inclusions, file-backed overrides, removals, dependencies, retained routes and scripts, public API allowances, and required validation.
- Generator reporting and API review derive from that manifest rather than parallel configuration lists.
- Review allowlists validate output; they never contain component source definitions.

### Thin-start materialization

- The thin-start generator is a materializer that selects shared files, applies explicit file-backed overrides, removes excluded surfaces, and adjusts profile dependencies.
- Component source does not live in generator strings.
- Routine thin-start development materializes into an ignored, isolated workspace that can run beside the canonical full-start preview without rewriting the canonical checkout.
- Materialized thin workspaces are disposable and are not edited directly. Changes belong in canonical shared source or explicit thin overrides before rematerialization.
- In-place materialization is reserved for creating a new template instance.

## Visual system

### Visual baseline

- The complete template adopts the pinned Inference Console visual system in light and dark modes.
- The shared foundation includes semantic colors, surfaces, borders, primary and status colors, sidebar tokens, chart and spectrum colors, radius scale, focus behavior, motion behavior, and scrollbar treatment.
- Template-specific automation and motion-disable behavior remains intact.
- The reusable template uses Inter through the shared application-font contract. Local SF Pro binaries are not distributed.
- Marketing and authentication retain their existing template composition and content architecture while adopting the converged tokens, primitives, and visual grammar.
- Dashboard parity is intentionally close to the reference across shell geometry, navigation, spacing, density, cards, tables, forms, overlays, interaction states, and responsive behavior.
- Spectrum accents remain reusable visual tokens. Inference Console logos, product copy, domain-specific artwork, and its custom profile-picture gradient background are excluded.

### Panel and Card

- `Panel` is the non-semantic surface primitive.
- `Panel` owns background, border, radius, shadow, overflow, width, padding, basic display and gap, polymorphic element selection, and ref forwarding.
- Responsive columns and card-specific structure belong to layout composition rather than `Panel`.
- `Card` is a structured content pattern built on `Panel`, with header, title, description, action, content, and footer slots.
- `Card` fixes sensible surface defaults and exposes a small density or size contract. Its slots own internal spacing and typography.
- Bounded Card escape hatches include overflow, shadow, semantic accent, and caller classes; Card does not pass through every Panel layout property.
- Shared semantic accents are `neutral`, `info`, `success`, `warning`, and `danger`, used consistently across surface and Card slots.
- Arbitrary hexadecimal Panel/Card accents and separate translucent-versus-solid public modes remain outside the contract unless a demonstrated dashboard requirement justifies them.
- Full and thin profiles expose the same Panel and Card implementation.
- Card slots render only under a real Card root. Card-like overlays use Card; structurally different overlays define overlay-owned slots.

### Button and Chip

- Button incorporates `default`, `primary`, `primaryDark`, `primarySoft`, `secondary`, `solid`, `danger`, `ghost`, `quiet`, and `card` visual variants and `sm`, `md`, `lg`, `xl`, `icon`, `icon-sm`, and `chip` sizes.
- Useful template contracts such as `outline`, icon-registry inputs, content and text configuration, radius and hit-area controls, focusability, typed link and button behavior, class and style extension, and layout alignment remain available unless explicitly superseded.
- Loading keeps normal content in layout while a position-absolute centered loader fades over it, preventing loading-state resizing.
- `Button.Skeleton` mirrors live size, alignment, radius, icons, label width, and variant treatment without changing final dimensions.
- Chip uses the compact rounded-medium reference design with semantic, spectrum, and custom colors and supports static, link, and button behavior.
- `Chip.Text` and `Chip.Skeleton` are part of the contract. Useful existing tone, helper-palette, icon, and canvas-measurement capabilities remain available.

### Markdown

- `MarkdownRenderer` is shared by full and thin profiles and operates on plain Markdown strings.
- It supports default and compact density, design-system-backed GFM, task lists, tables, images, code, quotes, links, validated generic button directives, and optional durable `@[user:<id>]` mention resolution.
- It does not accept arbitrary HTML, JSX, class injection, data registries, or product-specific directives.
- `MarkdownEditor` is a full-start-only client composite; thin start retains the renderer without the MDXEditor dependency.
- The editor persists only plain Markdown strings and provides responsive rich editing, lossless source mode, automatic source fallback, headings, inline formatting, lists and tasks, links, tables, images, code, dividers, undo and redo, optional mention insertion, generic button-directive editing, and default or compact density.
- Its toolbar composes the template's existing `MoreMenuDropdown`, `Button`, `Dropdown`, and `Listbox` rather than a duplicate package-owned menu system.
- Existing `MoreMenuDropdown` behavior remains canonical, including keyboard navigation, fixed or absolute positioning, portal support, hover and pinned modes, custom triggers, and active or disabled options.
- Baseline image insertion accepts image URLs only. File upload is a caller or product integration.
- Markdown stores mentions as durable `@[user:<id>]` references. Callers provide options and rendering resolution; shared Markdown components never fetch organizations or users directly.

### Full-start-only inputs and supporting primitives

- `ColorInput` and `ColorSwatchInput` belong to full start only.
- `ColorInput` supports controlled and uncontrolled hexadecimal selection, pointer and keyboard operation, normal form submission, field validation, and portal-aware dropdown positioning.
- `ColorSwatchInput` supports generic typed presets and an optional custom color. Shared semantic defaults are neutral, info, success, warning, and danger; product palettes remain outside the shared input.
- Accepted ports include their generic dependency closure: semantic accent helpers, `StatusMessage`, `ModalForm`, shared overlay chrome, and the markdown-mention parser.
- Existing template helpers remain canonical where they provide an equivalent or stronger contract.

## Full-start dashboard

### Product-neutral reference application

- The dashboard is a first-class, product-neutral reference application rather than an empty shell or fabricated business product.
- Capability-led fixtures demonstrate overview, collection, record detail, personal settings, organization settings, responsive behavior, and loading, empty, error, unavailable, and not-found states.
- Example capabilities are replaceable reference patterns, not requirements for every resulting product.
- Charts and summary metrics are optional extensions rather than baseline content.

### Routes and surface registry

- Baseline routes are `/dashboard`, `/dashboard/records`, `/dashboard/records/[recordId]`, and `/dashboard/settings`.
- Organization routes are `/dashboard/organization`, `/dashboard/organization/members`, and `/dashboard/organization/settings`.
- A typed dashboard surface registry is the source of truth for route identity, paths, labels, navigation placement, breadcrumbs, visibility, and standard-versus-wide layout mode.
- Navigation, breadcrumbs, and Command-K consume the same registry and organization context model.
- The overview is a lightweight capability and navigation directory rather than a required metrics dashboard.

### Shell and application components

- The shell uses a fixed responsive sidebar with desktop collapse and mobile overlay behavior, plus a persistent top bar with command and account surfaces.
- Pages use shared breadcrumbs, page headers, action zones, a constrained standard width, and an explicit wide-surface escape hatch.
- Product branding and domain behavior are not copied into the shell.
- Recurring dashboard patterns live in a full-start-only application component layer; thin start excludes that layer.
- The layer owns shell, navigation, page header, breadcrumbs, table panels, detail fields, property lists, and loading counterparts. Route-specific fixture content remains route-owned.

### Entity presentation

- Entity presentation is a full-start dashboard capability rather than a shared primitive, thin-start dependency, or application-wide global registry.
- The authoritative profile manifest exposes it as a named pruneable surface beneath the dashboard feature. Dashboard removal removes it automatically, and a dashboard-based instance may deliberately prune the reference entity system when adopting another frontend entity architecture.
- A small dashboard presentation foundation owns only reusable contracts such as entity nouns, action labels, empty-state copy, field and column metadata, semantic variants, and renderer inputs.
- Source is split by dependency layer and entity ownership. Each entity folder separates domain inputs, presentation definitions, derived view-model factories, render components, and surface adapters; product-specific roles, routes, labels, icons, permissions, formatting, and variants remain with that entity.
- Renderers receive ready data and never fetch. Routes and adapters own authorization, organization context, persistence, and mutations.
- The reference identity entity separates a global user from an organization-scoped member. Its resolved presentation provides deterministic display, email, initials, avatar, role, joined-date, profile-target, and Markdown-mention fallbacks.
- The example member demonstrates profile, compact, actor, avatar-only, avatar-list, table, detail, selector, Command-K, Markdown mention, empty, and skeleton presentations without the Inference-specific profile gradient.
- Entities implement only the presentation surfaces they need. An internal dashboard reference surface demonstrates the contracts and provides copyable usage.

### Frontend entity policy and workflow

- A repository-owned frontend entity policy is authoritative for entity ownership, presentation reuse, data-source boundaries, surface integration, skeleton parity, demonstrations, and documentation.
- Relevant dashboard, component, domain, and library `AGENTS.md` files link to the focused policy rather than duplicating or centralizing every rule at the root.
- Where an entity participates in tables, forms, filters, detail views, selectors, Command-K, Markdown mentions, empty states, or loading surfaces, those consumers reuse the owning presentation definitions.
- A generic `entity-frontend-system` Codex skill is an optional discovery and audit workflow linked from the policy. It inspects the repository's actual contracts, classifies entity surfaces, identifies gaps, and recommends relevant vertical skills or work without inventing product models, encoding template-specific paths, or automatically executing every recommendation.
- The skill contract is derived only after the presentation foundation, example member, and repository policy establish real APIs; the skill never supersedes repository policy.

### Records, detail, and mutations

- The collection reference demonstrates search, filtering, sorting, pagination, row navigation, and action menus.
- The detail reference demonstrates page actions, structured properties, related data, and a focused edit modal.
- `DashboardDetailField` supports static, link, action, copy, truncation, icon, disabled, and skeleton states.
- `DashboardPropertyList` provides responsive identity, value, and action columns, add-property selection, and row actions.
- `DashboardMarkdownEditorModalButton` provides focused Markdown editing. Callers own asynchronous persistence; the composite owns modal composition, validation display, loading feedback, errors, and success toasts.
- Detail and property components own presentation and interaction composition only. Routes own property schemas, authorization, persistence, and product-specific editors.
- Fixture adapters provide organization-scoped, resettable create, edit, archive, and delete commands and demonstrate confirmation, validation, toast, optimistic, and failure feedback.
- An entity-neutral deletion lifecycle definition and dashboard composition centralize impact descriptions, confirmation structure, danger-menu placement, mutation feedback, refresh behavior, and disabled explanations. Owning adapters retain the mutation and entity-specific consequences.
- Demo persistence may be explicitly non-durable; production adapters own durable storage.

### State and debug surfaces

- Real routes own their normal loading, error, not-found, and other relevant boundaries.
- Status and not-found surfaces use a shared frame derived from the dashboard surface registry rather than hardcoded product route prefixes.
- A guarded internal dashboard review route renders deterministic live, loading, empty, error, and unavailable variants.
- A default debug surface can force loading while preserving the real route shell.
- Debug controls are separate from normal navigation and product behavior.
- The debug menu is available in development or guarded internal-review mode by default; production exposure requires explicit environment opt-in.
- A generic activity or event row remains an optional dashboard extension. Inference-specific notifications, product permission presentations, charts, and provider-branded authentication buttons are demand-led rather than baseline ports.

## Data, authentication, and organizations

### Scaffold boundaries

- The default dashboard runs from deterministic typed fixtures behind lightweight adapters and does not require Payload, Supabase, or another hosted backend.
- Authentication uses a provider-neutral contract with a local mock or demo session. Dashboard routes remain guarded, and a real provider may replace the adapter.
- Fixture, authentication, active-organization selection, and persistence adapters are clearly labeled template scaffolding, not recommended final product implementations.

### Organization context

- Every authenticated dashboard request resolves organization context containing the organization, current membership, and effective capabilities.
- Routes and adapters consume resolved context rather than a fixed organization identifier.
- Every domain record, fixture record, relationship, member, invitation, and adapter operation is organization-scoped from its first representation.
- Singleton mode provisions one normal organization, automatically selects the sole valid membership, and hides switching by default.
- Singleton organization mode is the expected path for single-tenant and white-labelled products.
- The underlying organization and membership model still supports multiple organizations. A small explicit configuration enables the normal switcher without rewriting routes, adapters, or entity ownership.
- Organization architecture may be removed only as a deliberate exceptional instance decision.

### Active organization selection

- Canonical dashboard URLs do not include an organization slug.
- The organization adapter owns server-readable active selection and validates membership on every resolution.
- The template mock may use a protected server-readable cookie; product adapters choose an appropriate account preference or equivalent mechanism.
- When multiple memberships exist without a valid active selection, `/select-organization` is required after authentication and outside the organization-dependent dashboard shell.
- The resolver never silently chooses an arbitrary organization.
- Sign-out clears active selection, and revoked membership invalidates it immediately.

### Demo organization and permissions

- Demo mode uses a separate seeded, resettable organization with isolated users and fixture data but the same adapters and entity shapes.
- Demo access is explicit through demo login or organization selection, and demo users receive real demo-organization membership.
- Development debug controls may enter demo directly; normal users are never silently moved into demo data.
- The guarded debug menu can switch fixture organizations, enter demo, inspect membership and capabilities, force interface states, and reset fixtures.
- Baseline membership roles are `owner`, `admin`, and `member`.
- Product capabilities are resolved separately through the organization adapter or policy layer rather than product-specific base-role columns.

### Settings ownership

- `/dashboard/settings` owns personal profile, interface, authentication, and notification preferences.
- `/dashboard/organization` presents organization profile and overview information.
- `/dashboard/organization/members` owns members, invitations, roles, and access management.
- `/dashboard/organization/settings` owns organization identity, defaults, feature configuration, and organization-level destructive actions.

## Template-instance activation

- Beginning real implementation requires an explicit activation pass rather than silent inheritance of scaffold choices.
- Activation selects the real authentication provider, persistence layer, organization-selection mechanism, content mode, and disposition of demo and debug infrastructure.
- An instance does not preserve fixture, authentication, selection, or persistence scaffolding by default merely because it shipped in the template.
- Demo-organization support, fixture mutations, debug menu, and forced-state routes remain installed as dormant guarded infrastructure unless the instance deliberately removes them.
- Production access to retained demo and debug infrastructure remains disabled unless explicitly enabled through the appropriate guard and environment opt-in.

## Verification invariants

- Architecture-significant shared-system changes are reviewed against full and thin previews produced from the same commit.
- Both profiles receive type, build, smoke, public API-surface, and representative visual-route verification.
- Markdown verification covers renderer-editor round trips, lossless source fallback, responsive and keyboard-accessible toolbar behavior, and exclusion of mention parsing from code and links.
- Button verification covers zero layout shift during loading and dimensional parity between every live variant and its skeleton.
- Chip verification covers semantic, spectrum, custom, static, link, button, and skeleton states.
- Color-input verification covers pointer and keyboard operation, validation, form behavior, and portal positioning.
- Detail-system verification covers responsive property layout across its container breakpoint.
- Entity-presentation verification covers the example member across identity, table, detail, selector, Command-K, Markdown mention, empty, and loading surfaces and checks that owning definitions are reused rather than copied into routes.
- Profile verification proves that thin start excludes the dashboard presentation capability and that pruning the dashboard or its entity-presentation child surface leaves no imports, dependencies, demos, policies, or generated output behind.
- Dashboard visual review covers the baseline route matrix in light and dark modes, desktop and mobile shell behavior, Command-K, and deterministic live, loading, empty, error, unavailable, and not-found states.
