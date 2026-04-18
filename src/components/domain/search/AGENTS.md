# Folder: `src/components/domain/search`

## Role
Shared search widgets that accept caller-owned content sources.

## Use This Folder When
- You need searchable navigation or page discovery UI that should work across multiple route scopes.
- The caller can provide the search entries directly.
- You want to reuse the combobox behavior without inheriting marketing-specific pages or labels.

## Prefer These Files
- `src/components/domain/search/ContentSearch.tsx`: generic route-search combobox that accepts `entries`.

## Invariants
- The shared search component should not import marketing routes, dashboard routes, or demo content directly.
- Callers own entry construction, labeling, and any route-family filtering.
- Keep the contract synchronous and simple unless a concrete async need appears.

## Avoid
- Adding route-specific adapters here.
- Coupling the shared search surface to one shell’s navigation config.
