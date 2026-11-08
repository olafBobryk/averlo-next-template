# Specification: Building dashboard pages

**Spec path**: `specs/platform/surfaces/dashboard/pages`

**Created**: 2026-11-08 (new; rules moved from the dashboard route, entity and registry `AGENTS.md` files)

**Status**: Accepted, living

**Builds on**: `specs/platform/surfaces/dashboard/{shell,navigation}`, `specs/platform/navigation/routes`, `specs/platform/content/{entities,hierarchy}`, `specs/platform/data/{loading,actions,forms}`, `specs/platform/services/identity`, `specs/platform/design-system/usage`

**Verified by**: `npm run verify:dashboard-pages`, [docs/testing/entities.md](../../../../../docs/testing/entities.md), [docs/testing/routes-and-metadata.md](../../../../../docs/testing/routes-and-metadata.md), each page's characterisation test

## Purpose

How to add any dashboard page: route shape, registry entry, server ownership, composition inside the shell, tables, states and proof. A real page's own spec lives in a project's `specs/product/dashboard/<area>/`, written from `.specify/templates/page-spec-template.md`.

## Clarifications

### Session 2026-11-08

- **Q: Where did these rules come from?**
  - A: They were behaviour rules in the dashboard `AGENTS.md` files with no spec home. They move here so those files keep only structure and pointers; wording is kept close to the source.

## Requirements

### FR-001: One page spec per page

A new dashboard page MUST have a page spec from `.specify/templates/page-spec-template.md` before code.

### FR-002: Registered surface shape

Every route registered in the dashboard surface registry MUST own `page.tsx`, `loading.tsx` and one route-local `_components/<Name>Surface.tsx` exporting `<Name>Surface` and `<Name>SurfaceSkeleton`. Add `_actions.ts` or `_lib/` only for genuinely route-owned behaviour. Redirect-only pages and the structural catch-all not-found route are exempt.

### FR-003: Declared once in the registry

The route MUST be declared once in the dashboard route registry, with its parent, sidebar tier, required capability, layout width, domain area, optional non-route source roots and commands once in the matching dashboard metadata entry. Adding, moving or removing a destination updates its registry entry in the same change.

### FR-004: Server-owned page

`page.tsx` MUST own authorization, data loading, presentation conversion, redirects and not-found decisions on the server. Provider-dependent client work sits behind the surface entry. A capability-hidden destination MUST also be denied by its server page; visibility is not authorization (`specs/platform/services/identity`).

### FR-005: Loading delegates to the surface skeleton

`loading.tsx` MUST import only the matching surface entry and render its skeleton; it does not duplicate route layout or another route's loading boundary. Skeletons preserve live geometry (`specs/platform/data/loading` FR-003).

### FR-006: The surface composes inside the shell

The surface MUST own its `DashboardSection` (or the full-height workspace toolbar), contextual commands, layout and section composition. It adds no second global header and no body copy of the page heading; body descriptions and `ContentSection` groups follow the toolbar. Keep one useful description, omit repeated introductions, and preserve warnings, permission explanations, field guidance and result counts (`specs/platform/content/hierarchy`).

### FR-007: Reuse dashboard owners

Pages MUST use the shared table, detail, property-list, Markdown, selector, More-menu, state, toast and modal components before creating local substitutes. Entity renderers receive resolved facts or presentation view models and never fetch sessions, organizations, capabilities or persistence; import the entity-owned presentation factory directly, with no global renderer or presentation registry. Route-specific sections stay beside their route until they have an independent shared owner.

### FR-008: Tables

`DashboardTablePanel` MUST own responsive table mechanics: the first identity column is always kept, optional columns drop right to left when the card overflows, and at most one `kind: "action"` column is the final, always-visible, sticky column. Set a higher `responsivePriority` only when a later optional column must survive longer. Mirror `kind` and `responsivePriority` in `DashboardTablePanel.Skeleton`. A table that needs its own header composes `ContentSection.Header`; if the section already supplies title, context and actions, omit the table header (no null or empty placeholder header, no table-specific toolbar props, no second Card). A standalone table uses `ContentSection.Heading`, not `Card.Heading`.

### FR-009: Pagination versus continuation

A fully loaded collection MUST set `pageSize` on the table and its skeleton, and the table sorts the complete collection before paging. An overview excerpt MAY use `viewMoreHref` instead; never both. Remote pagination needs an explicit data contract, not a guessed total (`specs/platform/content/entities` FR-003).

### FR-010: Mutations and deletion

Mutations MUST follow `specs/platform/data/actions`. Entity deletion uses the shared confirmation, includes impacts and warnings where useful, rolls optimistic state back on returned or thrown failure, and returns `false` to keep a failed confirmation open with its input, selection and last durable state. Completion declares `refresh` for collection actions or `navigate` for detail exits; navigation is one push or replacement and never refreshes the deleted route. Authorization is checked again at execution.

### FR-011: Product-neutral template routes

Template dashboard routes MUST stay product-neutral reference implementations; capability fixtures demonstrate reusable patterns without product-specific domain assumptions.

### FR-012: Proved

`npm run verify:dashboard-pages` MUST pass after adding, removing or moving a route, and a characterisation test MUST cover the page's sections and states at 390 and 1440.

## Success Criteria

- **SC-001**: `npm run verify:dashboard-pages` reports no unregistered page and no stale registered route.
- **SC-002**: Live and skeleton tables hide columns in the same order at every tested width.
