# Folder: `src/components/composites`

Reusable composed components that sit above primitives and inputs but below
route-scoped app shells.

## Structure

- Composites build on shared design-system primitives and helpers.
- Keep contracts small, synchronous and caller-owned.
- Do not import route-scoped content, product data or backend adapters here.
- If a composite becomes route-specific, move that wrapper to the route and keep
  only the reusable core here.
