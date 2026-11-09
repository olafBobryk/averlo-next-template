# Dashboard route ownership

The dashboard is the product-neutral reference application area.

- Read `specs/platform/surfaces/dashboard/pages/spec.md` when adding or changing a dashboard page, and `specs/platform/surfaces/dashboard/navigation/spec.md` when registering one.
- Every route in `dashboardSurfaceRegistry` (`_registry/surfaceRegistry.ts`) owns `page.tsx`, `loading.tsx` and one route-local `_components/<Name>Surface.tsx` exporting `<Name>Surface` and `<Name>SurfaceSkeleton`. Add `_actions.ts` or `_lib/` only for route-owned behaviour.
- `page.tsx` is server-owned: authorization, data loading, presentation conversion, redirects and not-found. Provider-dependent client work sits behind the surface entry.
- `loading.tsx` imports only its matching surface entry and renders its skeleton.
- Exempt from that shape: redirect-only `/dashboard/overview` and `/dashboard/organization/members`, and the structural `/dashboard/[...catchAll]` not-found route.
- Reusable entities, tables, layout, commands and platform helpers stay under `_components/`, `_lib/` and `_registry/`; route-specific sections and mutations stay beside their route until they have an independent shared owner.
- Run `npm run verify:dashboard-pages` after adding, removing or moving a route.
