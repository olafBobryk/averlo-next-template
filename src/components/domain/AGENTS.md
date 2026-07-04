# Folder: `src/components/domain`

## Role
Reusable domain-level components that sit above primitives but below route-scoped app shells.

## Use This Folder When
- A component models a concrete app behavior or data interaction pattern.
- The component should stay reusable across multiple route scopes.
- The component needs caller-provided data rather than importing route-specific content itself.

## Prefer These Files
- `src/components/domain/search/ContentSearch.tsx`: shared route-search combobox that accepts caller-provided entries.

## Invariants
- Domain components must stay data-source agnostic. Route-specific content belongs in adapters outside this folder.
- Prefer small, synchronous contracts that take ready-to-render data instead of introducing providers or fetch logic by default.
- Keep composition grounded in shared library components before adding bespoke markup.

## Avoid
- Importing route-scoped content or app-section constants directly into this folder.
- Recreating shell-specific wrappers when an adapter layer can compose the shared domain component.
