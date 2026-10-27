# Dashboard layout ownership

## Shell and geometry

- The shared shell owns the recessed `surface` outside the inset `background`
  workspace. Sidebar and toolbar share `surface`; the workspace has no border.
  Panel owns persistent sidebar chrome, not the content workspace.
- The workspace touches the sidebar. Desktop keeps 8px right/bottom gutters and
  12px corners; tablet keeps 4px gutters and 8px corners; phones have no inset.
  Desktop sidebar is 240px or a collapsed 64px rail; tablet uses a 64px rail and
  drawer; phones use the drawer alone. Routes must not compensate with offsets.
- A small brand and bare Back/Forward/collapse actions occupy the sidebar top.
  Search occupies the next row and matches navigation width. Sidebar section
  labels stay quiet; sections longer than three rows may collapse, differing
  only by the heading caret. The Assistant section places New chat first.
- The account footer composes AccountIdentity with organization name as its
  muted secondary label: no separate organization row or top switcher. The account
  dropdown nests Organization administration/switching capability actions and
  puts helper links in a left-aligned divided footer.

## Workspace ownership

- DashboardSection is the standard page composition; DashboardWorkspaceToolbar
  also supports full-height workspaces. Toolbar identity/ancestry/actions sit
  above the workspace on shell chrome and align to its inner gutter, not its
  outside edge. Ancestors and current title match text size and weight.
- Do not add a second global header or body copy of the page heading. Body
  descriptions and ContentSection groups follow the toolbar. Workspace pages
  own page scrolling; Assistant owns message scrolling. Conversation rows are
  iconless. Exact APIs, long-title/loading examples and supported compounds
  remain with the toolbar's colocated contract and stories.
- Page gutters align external headings/actions to Card/table outside edges;
  internal padding stays inside. A standalone table uses ContentSection.Heading,
  not Card.Heading. Keep one useful description, omit repeated page introductions
  and do not add a divider between an external heading and bounded card. Preserve
  warnings, permission explanations, field guidance and result counts.

Use [component verification](../../../../../../docs/testing/component-contracts.md)
and [interaction verification](../../../../../../docs/testing/interactions.md).
Canonical route identity and ancestry remain with the route registry, not layout.
