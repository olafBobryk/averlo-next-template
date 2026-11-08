# Folder: `src/components/ui/misc`

Cross-cutting state, loading, display, copy, disclosure, media and utility
components that are neither complete inputs nor overlays.

## Read

- `specs/platform/content/hierarchy/spec.md` when changing Chip, avatar or
  identity colour, or semantic tint.
- `specs/platform/data/loading/spec.md` when changing skeletons or state owners.
- Storybook owner stories for component APIs and defaults.

## Structure

- Misc internals and lower-level UI dependencies import direct owners where
  required to preserve dependency direction. Primitives must not import the
  misc facade and create a cycle.
- The barrel is explicit. Accordion client/shared modules and input-owned file
  preview helpers remain private.
- Thin start owns a separate `@/components/ui/misc` facade that exports only
  `Skeleton`.
- Accordion topology: `accordion/AGENTS.md`. State-family topology:
  `state/AGENTS.md`.
