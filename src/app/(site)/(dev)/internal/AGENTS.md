# Internal Surface Instructions

Local developer routes under `/internal`.

- Read `specs/platform/navigation/metadata/spec.md` (noindex, production gating) and `specs/platform/content/hierarchy/spec.md` (surface composition) when changing internal pages.
- The internal layout renders the shared `SiteShell` with `defaultSiteLayout` from `src/app/(site)/_components/layout/`. In profiles with marketing, assembly relocates this tree beneath `(marketing)` so the marketing layout owns the shell; do not add route-specific shell or chrome adapters.
- Pages compose `_components/InternalPage.tsx` (`InternalPage`, `InternalPageHeader`) and design-system surfaces from `src/components`.
- `testing/` is development-only (see its `AGENTS.md`). Production guards for `/api/debug`, `/api/dev` and `/api/internal` live with those routes.
