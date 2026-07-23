# Folder: `src/app/(site)/(marketing)/_components`

## Role
Route-scoped public-site shell components and adapters.

## Use This Folder When
- You are changing the marketing header, footer, shell wiring, or public navigation data.
- The component is specific to the public site and should not be treated as shared app chrome.
- You need an adapter that feeds marketing content into a shared component.

## Prefer These Files
- `layout/MarketingShell.tsx`: public shell assembly.
- `layout/Header.tsx`: responsive public header wrapper.
- `layout/HeaderMenuContent.tsx`: grouped menu, search input, search results, and no-results primitives used by both header breakpoints.
- `layout/Footer.tsx`: public footer.

## Invariants
- Public navigation data flows through `SiteLayoutDocument` fallback/resolver data, not shared app config.
- Header and footer behavior should stay aligned across breakpoints.
- The marketing header uses grouped `menuGroups` and `searchGroups`; keep desktop and compact search behavior sourced from the same layout data.
- Keep localized routing, language switchers, and brand-specific CTA treatments out of the template header unless they become explicit optional slots.
- Shared building blocks should come from `src/components`, but public-shell orchestration belongs here.
