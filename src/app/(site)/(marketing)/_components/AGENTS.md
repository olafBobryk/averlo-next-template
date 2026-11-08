# Folder: `src/app/(site)/(marketing)/_components`

Route-scoped public-site adapters that feed resolved marketing layout data into the shared site shell.

- Read `specs/platform/surfaces/marketing/composition/spec.md` when changing shell or page composition, and `specs/platform/surfaces/marketing/content-sources/spec.md` when changing where layout data comes from.
- `src/app/(site)/(marketing)/layout.tsx` passes resolved layout data directly to the one shared `SiteShell`.
- Shared header, menu, footer, shell order and scroll lifecycle live in `src/app/(site)/_components/layout/` (`SiteShell.tsx`, `siteLayout.ts`); do not create route-specific copies. Marketing content adaptation stays here.
- Public navigation data flows through `SiteLayoutDocument` fallback/resolver data from `src/lib/marketing-content/`, never shared app config.
- Shared building blocks come from `src/components`; this folder only orchestrates public-shell content.
- Verification: `docs/testing/marketing-composition.md`.
