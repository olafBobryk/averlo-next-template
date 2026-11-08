# Dashboard layout ownership

The shared dashboard shell: frame, sidebar, account menu, workspace toolbar and page section composition.

- Read `specs/platform/surfaces/dashboard/shell/spec.md` when changing shell geometry, sidebar, toolbar or account footer, and `specs/platform/content/hierarchy/spec.md` for page heading and gutter composition.
- `DashboardFrame.tsx` and `DashboardSidebarShell.tsx` own shell geometry; routes never compensate with offsets.
- `DashboardSection.tsx` is the standard page composition; `DashboardWorkspaceToolbar.tsx` (with colocated stories/catalog) owns toolbar APIs and full-height workspaces.
- Route identity and ancestry come from `../../_registry/`, not from layout.
- Verification: [component verification](../../../../../../docs/testing/component-contracts.md) and [interaction verification](../../../../../../docs/testing/interactions.md).
