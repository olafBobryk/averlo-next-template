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
- `layout/Footer.tsx`: public footer.
- `layout/MarketingContentSearch.tsx`: adapter that feeds public/demo pages into the shared `ContentSearch`.

## Invariants
- Public navigation data lives here, not in shared app config.
- Header and footer behavior should stay aligned across breakpoints.
- Shared building blocks should come from `src/components`, but public-shell orchestration belongs here.
