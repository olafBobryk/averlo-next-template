# Architecture Staging

Consolidated into [the final architecture](./architecture.md) on 2026-07-19 and reviewed with no unresolved or drifted decisions. Retained as the historical acceptance ledger for the Averlo full-start and thin-start profiles.

## Template relationship and convergence scope

- Full start remains the canonical broad template system.
- Inference Console is a design reference, not a general component donor or runtime/source dependency.
- Structural primitive convergence begins with the `Panel` foundation and semantic `Card` system, while styling convergence covers the complete shared consumer layer.

## Inference Console visual-system baseline

- The complete template is reskinned to the visual system represented by the current Inference Console styling work.
- Inference Console revision `8a13d12ea11461fe204625bd1247a6db16c4a207` is the pinned source baseline for the visual-system port.
- Later committed or uncommitted Inference Console changes do not silently change the baseline; adopting them requires an explicit repin decision.
- The port covers the complete light and dark visual foundation: semantic colors, surfaces, borders, primary and status colors, sidebar tokens, chart and spectrum colors, radius scale, focus behavior, motion behavior, and scrollbar treatment.
- Template-specific automation and motion-disable behavior remains intact while adopting the source visual foundation.
- The reusable template uses Inter through the shared application-font contract. Local SF Pro binaries are not distributed with the template.
- The complete shared consumer layer adopts the source visual grammar, including typography, buttons, panels, cards, fields, inputs, dropdowns, listboxes, chips, skeletons, modals, toasts, and shared state surfaces.
- The reskin applies across marketing, authentication, dashboard, internal demonstrations, loading, error, empty, and overlay surfaces.
- Marketing and authentication retain the template's existing page composition and content architecture while adopting the pinned source's tokens, primitives, and visual grammar.
- Spectrum accents remain reusable visual tokens, while Inference Console logos, product copy, and domain-specific branded artwork remain outside the template.
- Dashboard visual parity is intentionally close to the Inference Console reference across shell geometry, navigation, spacing, density, cards, tables, forms, overlays, interaction states, and responsive behavior.
- The custom Inference Console profile-picture gradient background is explicitly excluded from the dashboard parity target.
- The pinned commit provides visual provenance and rendered references only; Inference Console product models, domain components, routes, and backend architecture are not template architecture.

## Panel and Card contract

- `Panel` is the non-semantic surface primitive.
- `Card` is a structured content pattern built on `Panel`, with header, title, description, action, content, and footer slots.
- `Panel` owns background, border, radius, shadow, overflow, width, padding, basic display and gap, polymorphic element selection, and ref forwarding.
- `Panel` does not own responsive columns or card-specific structure. Responsive composition belongs to layout components or caller-supplied classes.
- `Card` fixes sensible surface defaults and owns density through a small size contract.
- Card slots own their internal spacing and typography.
- `Card` may expose bounded escape hatches such as overflow, shadow, semantic accent, and caller-supplied classes, but it does not pass through every `Panel` layout property.
- The shared semantic accent vocabulary is `neutral`, `info`, `success`, `warning`, and `danger`.
- Surface and card-slot accents use the same semantic accent system.
- Arbitrary hexadecimal accents and separate translucent-versus-solid public modes stay outside the shared primitive contract unless a later dashboard requirement demonstrates that they are necessary.
- Full start and thin start both expose `Panel` and `Card` through the same implementation.
- Thin start remains smaller by excluding higher-level surfaces rather than hiding a foundational primitive used by `Card`.
- Card slots must be used under a real `Card` root. Consumers must not place card slots under a raw `Panel` by imitating Card data attributes.
- Overlays that need Card structure should use `Card` as their root; overlays with materially different structure should define overlay-owned slots.

## Additional shared-component convergence

- Source convergence is additive: matching the pinned Inference Console visual and behavioral contracts must not flatten or remove mature template APIs that remain useful.
- `MarkdownRenderer` remains a shared full-start and thin-start composite over plain Markdown strings.
- Its contract includes default and compact density, design-system-backed GFM rendering, task lists, tables, images, code, quotes, links, validated generic button directives, and optional durable `@[user:<id>]` mention resolution.
- Markdown rendering does not allow arbitrary HTML, JSX, class injection, data registries, or product-specific directives.
- `MarkdownEditor` is a full-start-only, client-only composite; thin start retains the renderer without the MDXEditor dependency.
- The editor persists only plain Markdown strings and supports responsive rich editing, lossless source mode, automatic source fallback, headings, inline formatting, lists and tasks, links, tables, images, code, dividers, undo and redo, optional mention insertion, generic button-directive editing, and default or compact density.
- The editor toolbar composes the template's existing `MoreMenuDropdown`, `Button`, `Dropdown`, and `Listbox` contracts rather than introducing a duplicate package-owned menu system.
- The existing `MoreMenuDropdown` remains canonical, including its keyboard navigation, fixed or absolute positioning, portal support, hover and pinned interaction modes, custom triggers, and active or disabled options.
- Button convergence incorporates the pinned `default`, `primary`, `primaryDark`, `primarySoft`, `secondary`, `solid`, `danger`, `ghost`, `quiet`, and `card` visual variants and the `sm`, `md`, `lg`, `xl`, `icon`, `icon-sm`, and `chip` sizes while preserving useful template contracts such as `outline`.
- Loading states and variant-aware skeleton treatments follow the converged visual vocabulary without replacing the template's richer existing API surface.
- Existing Button capabilities such as icon-registry inputs, content and text configuration, radius and hit-area controls, focusability, typed link and button behavior, class and style extension, and layout alignment remain available unless an explicit later decision supersedes them.
- Button loading preserves the template's position-absolute overlay strategy: normal content remains in layout and fades while the centered loader appears, preventing loading-state resizing.
- `Button.Skeleton` mirrors live size, alignment, radius, icons, label width, and variant treatment without changing the final component dimensions.
- Chip convergence adopts the pinned compact rounded-medium visual design, semantic, spectrum, and custom colors, interactive link or button behavior, static behavior, `Chip.Text`, and `Chip.Skeleton` while retaining useful existing tone, helper-palette, icon, and canvas-measurement capabilities.
- `ColorInput` and `ColorSwatchInput` join the full-start input library only; thin start does not include them.
- `ColorInput` supports controlled and uncontrolled hexadecimal selection, pointer and keyboard operation, normal form submission, field validation, and portal-aware dropdown positioning.
- `ColorSwatchInput` supports generic typed presets and an optional custom color. Its shared semantic defaults are neutral, info, success, warning, and danger; product-specific palettes stay outside the shared input.
- The accepted component ports include their generic dependency closure: semantic accent helpers, `StatusMessage`, `ModalForm`, shared overlay chrome, and the markdown-mention parser.
- Existing template helpers remain canonical wherever they provide an equivalent or stronger contract.
- Baseline Markdown image insertion accepts image URLs only. File upload remains a caller or product integration rather than a dependency of the shared editor.
- Markdown stores durable mentions as `@[user:<id>]`; callers provide mention options and rendering resolution, and shared Markdown components never fetch organizations or users directly.

## Full-start detail and property system

- The full-start application layer includes `DashboardDetailField` with static, link, action, copy, truncation, icon, disabled, and skeleton states.
- It includes `DashboardPropertyList` with responsive identity, value, and action columns, add-property selection, and row actions.
- It includes `DashboardMarkdownEditorModalButton` as the focused dashboard editing surface. Callers own asynchronous persistence while the composite owns modal composition, validation display, loading feedback, errors, and success toast feedback.
- Detail and property components remain product-neutral and stay outside thin start.
- Detail fields and property lists own presentation and interaction composition only. Routes own property schemas, authorization, persistence, and product-specific editors.

## Shared profile invariant

- Components present in both full start and thin start should normally share one implementation and visual contract.
- A profile-specific implementation is allowed only as an explicit, intentional profile override.

## Filesystem-backed template profiles

- Full start and thin start use layered, filesystem-backed profile sources.
- Full start's live source is the canonical shared source rather than being materialized from a separate package.
- Thin start references canonical shared files through its profile manifest.
- Only genuine thin-specific replacements are stored as separate, real source files outside the full-start import graph.
- One authoritative profile manifest declares shared inclusions, file-backed overrides, removals, dependencies, retained routes and scripts, public API allowances, and required validations.
- Generator reporting and API review derive from the authoritative profile manifest rather than maintaining parallel configuration lists.

## Thin-start materialization

- The thin-start generator is a materializer: it selects shared files, applies explicit file-backed overrides, removes excluded surfaces, and adjusts profile dependencies.
- Component source code must not live inside generator strings.
- Review allowlists validate the materialized output; they do not serve as component source definitions.
- Routine thin-start development materializes into an ignored, isolated profile workspace that can run beside the canonical full-start preview.
- Previewing thin start must not rewrite the canonical checkout.
- In-place materialization is reserved for creating a new template instance.
- Materialized thin-start workspaces are disposable and must not be edited directly.
- Changes are made in canonical shared source or explicit thin override files, then the materialized workspace is refreshed.

## Profile parity gate

- Architecture-significant shared-system changes can be reviewed against full-start and thin-start previews produced from the same commit.
- Both profiles receive type, build, and smoke verification.
- Both profiles receive public API-surface review and a small visual route matrix.
- Markdown verification covers renderer-editor round trips, lossless source fallback, responsive and keyboard-accessible toolbar behavior, and the exclusion of mention parsing from code and links.
- Button verification covers zero layout shift during position-absolute loading and dimensional parity between every live variant and its skeleton.
- Chip verification covers semantic, spectrum, custom, static, link, button, and skeleton states.
- Color-input verification covers pointer and keyboard operation, validation, form behavior, and portal positioning.
- Detail-system verification covers responsive property layout across its container breakpoint.

## Full-start dashboard role

- The full-start dashboard is a first-class, product-neutral reference application rather than an empty shell.
- It uses capability-led example surfaces rather than inventing a fake business product.
- It demonstrates overview, collection, record-detail, settings, and organization-level patterns with clearly replaceable fixture content.
- It demonstrates responsive behavior and loading, empty, and error states.

## Dashboard routes and surface registry

- The baseline dashboard routes are `/dashboard`, `/dashboard/records`, `/dashboard/records/[recordId]`, and `/dashboard/settings`.
- A typed dashboard surface registry is the source of truth for route identity, paths, labels, navigation placement, breadcrumbs, visibility, and standard-versus-wide layout mode.
- The Command-K menu consumes the same surface registry and context model as dashboard navigation and breadcrumbs, following the structural pattern proven in Inference Console.
- The dashboard overview is a lightweight capability and navigation directory.
- Charts and summary metrics are not required baseline dashboard content because many products do not need them.

## Record reference interaction

- The reference collection demonstrates search, filtering, sorting, pagination, row navigation, and action menus.
- The reference detail surface demonstrates page actions, structured properties, related data, and a focused edit modal.
- These are reference capabilities rather than requirements that every converted product must retain.
- The fixture adapter supports organization-scoped, resettable create, edit, archive, and delete commands.
- Demo mutations exercise confirmation, validation, toast, optimistic, and failure feedback patterns.
- Demo persistence may be explicitly non-durable; production adapters own durable storage.

## Dashboard shell

- The dashboard uses a fixed responsive sidebar with desktop collapse and a mobile overlay mode.
- It uses a persistent top bar with a command surface and account menu.
- Dashboard pages use shared breadcrumbs, page headers, and action zones.
- The shell provides a standard constrained content width and an explicit wide-surface escape hatch.
- Inference Console may inform structural maturity, but product-specific branding and domain behavior are not copied into the template shell.

## Dashboard data and authentication boundaries

- The default dashboard runs from deterministic typed fixture data behind lightweight adapters.
- Shared dashboard surfaces must not require Payload, Supabase, or another hosted backend.
- Dashboard adapters expose clear seams for replacing fixtures with a project data source.
- Dashboard data is organization-scoped behind the adapter boundary from the start.
- Applications without multi-organization UX still operate through a singleton organization rather than bypassing organization scope.
- The default demo pattern uses an organization-scoped demo context and the same data boundaries as a converted product.
- Dashboard authentication uses a provider-neutral contract with a local mock or demo session as the default implementation.
- Dashboard routes remain guarded; Payload or another authentication provider may replace the default adapter.
- Provider-neutral fixture, authentication, and selection adapters are template scaffolding rather than recommended final product implementations.
- When implementation begins in a template instance, the instance must explicitly choose its real data, authentication, organization-selection, and persistence implementations instead of preserving the scaffold by default.

## Template-instance activation boundary

- Beginning implementation in a template instance requires an explicit activation pass rather than silently inheriting scaffold choices.
- The activation pass selects the real authentication provider, persistence layer, organization-selection mechanism, content mode, and disposition of demo and debug infrastructure.
- Fixture data and provider-neutral adapters are clearly named and documented as scaffold or demo infrastructure rather than presented as production architecture.
- Organization ownership, membership, context, and capability contracts may be removed by an instance, but only as a deliberate exceptional decision.
- The expected path for single-tenant and white-labelled products is to retain the organization contract through singleton organization mode while hiding organization-management and switching UX that the product does not need.
- Demo-organization support, fixture mutations, the debug menu, and forced-state routes remain installed in an activated instance as dormant, guarded infrastructure.
- Production access to retained demo and debug infrastructure remains disabled unless the instance explicitly enables the appropriate guard and environment opt-in.

## Organization context and lifecycle

- Every authenticated dashboard request resolves an organization context containing the organization, current membership, and effective capabilities.
- Routes and adapters consume the resolved organization context rather than importing a fixed organization identifier.
- Singleton mode provisions one normal organization and hides organization switching by default.
- Demo mode uses a separate seeded, resettable demo organization with isolated users and fixture data.
- Singleton and demo modes use the same organization-scoped adapters and entity shapes.
- The organization context and membership model support multiple organizations even when the default interface is singleton-only.
- An organization switcher can be enabled through a small, explicit configuration change without rewriting routes, adapters, or entity ownership.
- Canonical dashboard URLs do not include an organization slug; the validated active organization comes from the organization context.
- The organization adapter owns a server-readable active-organization selection and validates membership whenever it resolves that selection.
- The template mock adapter may persist active organization selection in a protected server-readable cookie; a product adapter may use an account preference or another product-appropriate mechanism.
- Singleton mode automatically selects the only valid membership.
- When multiple memberships exist without a valid active selection, the user must choose through a dedicated organization-selection screen.
- `/select-organization` is the organization-selection route. It sits after authentication but outside the organization-dependent dashboard shell.
- The resolver must never silently select an arbitrary organization.
- Sign-out clears the active selection, and revoked membership invalidates it immediately.
- The normal organization switcher is controlled by an explicit feature or configuration setting.
- The guarded debug menu can switch fixture organizations, enter the demo organization, inspect current membership and capabilities, force interface states, and reset demo fixtures.
- Demo access is explicit through demo login or organization selection.
- Demo users receive real demo-organization membership through the same organization context model.
- Development debug controls may enter the demo organization directly, but normal users are never silently moved into demo data.

## Organization routes

- `/dashboard/organization` presents organization profile and overview information.
- `/dashboard/organization/members` presents members, invitations, and access management.
- `/dashboard/organization/settings` presents organization-owned preferences.
- `/dashboard/settings` remains personal account and interface settings.

## Settings ownership

- `/dashboard/settings` owns personal profile, interface preferences, authentication, and notification preferences.
- `/dashboard/organization/settings` owns organization identity, defaults, feature configuration, and organization-level destructive actions.
- `/dashboard/organization/members` owns members, invitations, and roles.

## Organization membership and permissions

- Baseline organization membership roles are `owner`, `admin`, and `member`.
- Product capabilities are resolved separately through the organization adapter or policy layer rather than adding product-specific role columns to the base membership.

## Organization-owned records

- Every product or domain record is organization-owned from its first representation, including fixture types.
- Relationships and adapter operations preserve the organization boundary.
- Members and invitations are organization-scoped.

## Dashboard component ownership

- Recurring dashboard patterns live in a full-start-only application component layer.
- This layer owns the shell, navigation, page header, breadcrumbs, table panels, detail fields, and their loading counterparts.
- Summary-card and chart-panel systems are opt-in extensions rather than required baseline components.
- Route-specific fixture content remains with its route.
- Thin start excludes the dashboard application component layer.

## Dashboard state review and debugging

- Real dashboard routes own their normal loading, error, and relevant not-found boundaries.
- A guarded internal dashboard review route renders deterministic live, loading, empty, error, and unavailable variants.
- The full-start dashboard includes a default debug surface that can force loading for diagnosis while preserving the real route shell.
- Debug controls are separate from normal user navigation and product behavior.
- The debug menu ships in full start but is available only in development or guarded internal-review mode by default.
- Production debug-menu exposure requires explicit environment opt-in.

## Final architecture disposition

- The accepted architecture will be consolidated into `docs/architecture.md` from the pinned Inference Console styling baseline.
- Final architecture is organized around template profiles, the visual system and primitives, the full-start dashboard, organization/authentication/data contracts, template-instance activation, and verification invariants.
- `docs/architecture-staging.md` remains as the historical acceptance ledger after consolidation, marked as consolidated and linked to the final architecture document.
- Consolidation may deduplicate and improve sequencing, but it must not add implementation planning or change accepted meaning.
- The final review traces every staging decision into the consolidated architecture, checks for wording drift, and marks consolidation complete only after parity passes.
