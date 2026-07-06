# Artifact: Template Shell Contract

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record the existing shell, navigation, and identity contract that page-system
work should reuse.

## Artifact Type

doc

## Reference

- `artifacts/template-shell-contract.md`

## Applies To

- `shell-source-and-id-boundary`: current ID and source boundary.
- `marketing-shell-structure-baseline`: shell assembly evidence.
- `navigation-contract-baseline`: navigation and link contract evidence.
- `shell-demo-review-surface`: review path evidence.
- `shell-ready-for-page-systems`: checkpoint evidence.

## Evidence Role

decision-support

## Existing ID Surfaces

| Surface | Source | Purpose |
| --- | --- | --- |
| Route IDs | `src/lib/routes.ts` and `src/config/routes.ts` | Stable app route handles resolved through `hrefFor`. |
| Layout document fields | `src/lib/marketing-content/types.ts` | Header, footer, menu, search, CTA, and social-link data contract. |
| Marketing links | `src/lib/marketing-content/links.ts` | Resolves route-backed and literal marketing links. |
| Section IDs | `src/lib/marketing-content/sections/renderMarketingSections.tsx` | Emits `data-section-id`, `data-section-type`, and `data-section-label` review identity. |
| Demo IDs | `src/app/(site)/(marketing)/internal/demo/content.tsx` | Internal demo page IDs and item IDs for shell review surfaces. |

## Shell Source Rows

| Source ID | Path | Role | Status | Notes |
| --- | --- | --- | --- | --- |
| `marketing-layout` | `src/app/(site)/(marketing)/layout.tsx` | route layout | active | Fetches site layout and mounts the marketing shell. |
| `marketing-shell` | `src/app/(site)/(marketing)/_components/layout/MarketingShell.tsx` | shell assembly | active | Composes header, reveal root, footer, and scroll controller. |
| `marketing-header` | `src/app/(site)/(marketing)/_components/layout/Header.tsx` | responsive header wrapper | active | Chooses desktop and compact header variants. |
| `marketing-header-full` | `src/app/(site)/(marketing)/_components/layout/HeaderFull.tsx` | desktop header | active | Uses grouped nav, search, menu, and CTA data. |
| `marketing-header-compact` | `src/app/(site)/(marketing)/_components/layout/HeaderCompact.tsx` | compact header | active | Uses the same layout data as desktop header. |
| `marketing-header-menu-content` | `src/app/(site)/(marketing)/_components/layout/HeaderMenuContent.tsx` | menu/search content | active | Shared grouped menu and search rendering. |
| `marketing-footer` | `src/app/(site)/(marketing)/_components/layout/Footer.tsx` | footer shell | active | Uses layout footer nav and social links. |
| `marketing-content-search` | `src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx` | route search adapter | active | Feeds marketing links into shared `ContentSearch`. |

## Review Surfaces

| Surface | Route Or Source | Purpose |
| --- | --- | --- |
| Layout overview | `/internal/demo/layout` | Navigate shell demos. |
| Header demo | `/internal/demo/layout/header` | Review header wrapper, desktop header, compact header, menu content, and search adapter usage. |
| Footer demo | `/internal/demo/layout/footer` | Review footer usage. |
| Section identity review | `/?review=sections&motion=off&reveal=off` | Review section IDs and labels on real pages. |

## Rules

- Shell components are route-scoped marketing shell code, not shared UI
  primitives.
- Navigation data flows through `SiteLayoutDocument` fallback/resolver data.
- Header and compact header should stay sourced from the same layout data.
- Product-specific IA, localization, brand CTA behavior, and assets stay out
  unless a later packet accepts them as template options.

## Notes

- This artifact records existing code. It does not create new shell behavior.
