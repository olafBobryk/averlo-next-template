# Specification: Dashboard shell

**Spec path**: `specs/platform/surfaces/dashboard/shell`

**Created**: 2026-11-08

**Status**: Accepted, living

**Builds on**: `specs/platform/surfaces/dashboard/navigation`, `specs/platform/navigation/routes`, `specs/platform/services/identity`, `specs/platform/content/hierarchy`

**Verified by**: [docs/testing/component-contracts.md](../../../../../docs/testing/component-contracts.md), [docs/testing/interactions.md](../../../../../docs/testing/interactions.md), the dashboard layout owners' stories

## Purpose

One shared dashboard shell owns the chrome around every dashboard page: geometry, sidebar, toolbar, account footer, command registration and the platform branch. Pages compose inside it and never compensate for it.

## Requirements

### FR-001: Surfaces and workspace

The shared shell MUST own the recessed `surface` outside the inset `background` workspace. Sidebar and toolbar share `surface`; the workspace has no border. `Panel` owns persistent sidebar chrome, not the content workspace.

### FR-002: Geometry per viewport

The workspace MUST touch the sidebar. Desktop keeps 8px right/bottom gutters and 12px corners; tablet keeps 4px gutters and 8px corners; phones have no inset. The desktop sidebar is 240px or a collapsed 64px rail; tablet uses a 64px rail and a drawer; phones use the drawer alone. Routes MUST NOT compensate with offsets.

### FR-003: Sidebar layout

A small brand and bare Back/Forward/collapse actions MUST occupy the sidebar top. Search occupies the next row and matches the navigation width. Section labels stay quiet; sections longer than three rows may collapse, differing only by the heading caret. The Assistant section places New chat first. Conversation rows are iconless.

### FR-004: Account footer

The account footer MUST compose `AccountIdentity` with the organization name as its muted secondary label, with no separate organization row and no top switcher. The account dropdown nests organization administration and switching capability actions and puts helper links in a left-aligned divided footer.

### FR-005: Toolbar and page composition

`DashboardSection` MUST be the standard page composition; `DashboardWorkspaceToolbar` also supports full-height workspaces. Toolbar identity, ancestry and actions sit above the workspace on shell chrome and align to its inner gutter, not its outside edge. Ancestors and the current title match in text size and weight. No second global header and no body copy of the page heading.

### FR-006: Gutters and alignment

Page gutters MUST align external headings and actions to Card/table outside edges; internal padding stays inside. No divider between an external heading and a bounded card.

### FR-007: Scrolling ownership

Workspace pages MUST own page scrolling; Assistant owns message scrolling.

### FR-008: Contextual commands

Contextual commands MUST register through the shell-owned command provider and unregister when their owning surface unmounts. Command search closes before navigation or execution. Modal-backed commands require an exposed owning action API (`specs/platform/navigation/routes` FR-003).

### FR-009: Platform branch

`/dashboard/platform` MUST be an internal branch of the shared shell, not a separate shell and not an organization-admin surface. Every platform route and mutation is authorized with the platform role; organization owner or administrator membership never grants platform access. Platform routes stay in the canonical dashboard registry; there is no second platform route model. Hiding a navigation item grants no permission (`specs/platform/services/identity` FR-001).

### FR-010: Route identity stays with the registry

Canonical route identity and ancestry MUST remain with the route registry, not the layout. Browser metadata comes from the shared family factories, not shell enrichment (`specs/platform/navigation/metadata`).

### FR-011: The sidebar is the navigation layer

The workspace MUST be one inset surface below a contextual toolbar on the recessed outer background. The sidebar is the raised navigation layer that owns workspace identity, search and account controls, and its category labels come from dashboard registry metadata. Section headings sit outside the cards that group related properties (`specs/platform/content/hierarchy` FR-005).

### FR-012: Command search opens in place

Command search MUST expand from the visible sidebar field or rail control without moving the field or dimming the app. Phone drawer search stays anchored in its drawer; only keyboard opening without a visible anchor uses the viewport inset. Command hierarchy uses plain icons, two-line rows and indentation.

### FR-013: File preview split

The file preview split MUST mount around both the page toolbar and its content. The file toolbar aligns with the page toolbar on the shell surface, both panes use the page background, and the viewer is neither a nested card nor an independently elevated surface.

## Success Criteria

- **SC-001**: At desktop, tablet and phone widths the workspace gutters, corners and sidebar widths match FR-002, and no route adds a compensating offset.
- **SC-002**: Leaving a surface removes its contextual commands from command search.
