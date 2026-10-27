# Folder: `src/components/ui/misc/state`

## Ownership

Implementation owners for `StateIndicator`, `ErrorState`, and `IdleState`.

## Public Boundary

- External consumers import the state family and its public types from
  `@/components/ui/misc`.
- Presets import `StateIndicator` directly from their sibling owner; no private
  state implementation is promoted as a separate public surface.

## Structural Invariants

- Presets compose `StateIndicator` instead of duplicating its icon, text,
  action, layout, or variant tree.
- State actions remain shared `Button` primitives, and typography remains
  shared `Text` primitives.
- The base root retains `data-slot="state-indicator"` and `data-variant` for
  composition, testing, and styling ownership.
- Select an existing complete state/live/skeleton owner before generic loading
  pieces. A generic state is appropriate only when no complete owner applies or
  within an approved reusable extension. Report a missing boundary before adding
  an approximate feature-local state tree. Known static context stays live and
  loading placeholders remain non-interactive; [loading verification](../../../../../docs/testing/loading.md)
  and the maintained loading capability own observable read-state behavior.
