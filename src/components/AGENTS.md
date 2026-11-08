# Folder: `src/components`

Reusable components and shared UI. Route-specific pieces stay with their route
until they gain an independent shared owner.

## Read

- `specs/platform/design-system/usage/spec.md` before adding, extending or
  wrapping a reusable component (which owner to use for what).
- The colocated Storybook owner stories for supported APIs and defaults;
  [component verification](../../docs/testing/component-contracts.md) to verify.
- The nearest child `AGENTS.md` for the family you change; skip unrelated families.

## Structure

- Keep the smallest coherent stateful/browser boundary client-side; server-safe
  exports stay free of client-only dependency paths.
- A public rename migrates consumers, profile inventories, catalogue contracts
  and verifiers together.

## Directory map

- `branding/`: brand identity.
- `composites/`: reusable compositions above primitives.
- `domain/`: reusable domain-level extensions for assembled projects.
- `mount/`: client-only application hosts.
- `ui/foundations/`: shared tokens and foundations.
- `ui/helpers/`: small component helpers.
- `ui/icons/`: icon rendering and registries.
- `ui/primitives/`: low-level reusable building blocks.
- `ui/input/`: complete form controls.
- `ui/misc/`: cross-cutting display and interaction helpers.
- `ui/motion/`: motion and scroll helpers.
- `ui/overlays/`: portal-backed overlays.
- `ui/time/`: date and relative-time presentation.
