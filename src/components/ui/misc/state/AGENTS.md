# Folder: `src/components/ui/misc/state`

Implementation owners for `StateIndicator`, `ErrorState`, and `IdleState`.

## Read

- `specs/platform/data/loading/spec.md` when changing read-state behaviour;
  verify with [loading verification](../../../../../docs/testing/loading.md).
- Storybook owner stories for the state family API and defaults.

## Structure

- External consumers import the state family and its public types from
  `@/components/ui/misc`.
- Presets import `StateIndicator` directly from their sibling owner and compose
  it instead of duplicating its tree; no private state implementation is
  promoted as a separate public surface.
- State actions use shared `Button` primitives; typography uses shared `Text`.
- The base root retains `data-slot="state-indicator"` and `data-variant`.
