# Folder: `src/app/(site)/(marketing)/_components`

## Role
Route-scoped public-site shell components and adapters.

## Use This Folder When
- You are adapting resolved marketing layout data into the shared site shell.
- The component is specific to the public site and should not be treated as shared app chrome.
- You need an adapter that feeds marketing content into a shared component.

## Prefer These Files
- `src/app/(site)/(marketing)/layout.tsx`: passes resolved marketing layout data directly to the shared `SiteShell`.
- `src/app/(site)/_components/layout/SiteShell.tsx`: the one visual shell used by marketing and internal routes.
- `src/app/(site)/_components/layout/siteLayout.ts`: the profile-safe shell contract and default layout data.

## Invariants
- Public navigation data flows through `SiteLayoutDocument` fallback/resolver data, not shared app config.
- Header and footer behavior should stay aligned across breakpoints.
- The marketing header uses grouped `menuGroups` and `searchGroups`; keep desktop and compact search behavior sourced from the same layout data.
- Keep localized routing, language switchers, and brand-specific CTA treatments out of the template header unless they become explicit optional slots.
- Shared header, menu, footer, shell order, and scroll lifecycle belong to `src/app/(site)/_components/layout`; marketing content adaptation remains here.
- Shared building blocks should come from `src/components`, but public-shell content orchestration belongs here.

## Composition and review boundaries

- `openspec/specs/app/marketing/composition/marketing-composition/spec.md` owns observable shell
  behavior; `docs/testing/marketing-composition.md` owns verification.
- Keep one shared SiteShell, header, menu, footer and scroll lifecycle. Do not
  create route-specific copies, hide shell regions through route CSS, or
  reproduce a source footer inside content blocks. Shell media follows
  `src/lib/marketing-content/AGENTS.md` and its exact constituent-asset rules.
- Retain stable header, content, footer and content-plus-footer composition
  frames. Review state/capture boundaries belong to SiteShell/Preview, never
  route CSS. Content, shell, excluded regions and accumulated gates have separate
  review roles; shell cases have no content-block or shared `Section` obligation.
- During Compose the approved header is immutable and excluded from source
  parity, while remaining on the production page. Editing, retheming or replacing
  it requires separately scoped non-Compose work. Source frames and exact local
  identity assets do not authorize changes to nested shared design-system owners.
- Navigation/CTA data has one exclusive `surfaceId` or `href`: installed
  Marketing/Auth destinations use surface IDs; external URLs, fragments and
  generated internal destinations use their appropriate direct-link boundary.
  Do not introduce localization, language switching or brand-specific CTA
  contracts without an explicit optional slot.
