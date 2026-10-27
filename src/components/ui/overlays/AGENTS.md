# Folder: `src/components/ui/overlays`

## Ownership

This folder owns shared portal-backed overlay infrastructure.

## Dependency and runtime boundaries

- `Portal` is the low-level DOM escape boundary. Modal and toast systems own
  their specialized hosts and must not be reimplemented directly on Portal.
- Overlay code may compose foundations, primitives, and shared UI, but must not
  depend on feature-local state or route code.
- Portal targets are resolved only after client mount and fall back to
  `document.body`; direct scattered `createPortal` calls are forbidden.

## Structural invariants

- Application overlays participate in the shared portal and host model rather
  than creating parallel stacks.
- Overlay owners define focus entry, top-most behavior, dismissal, and focus
  restoration where their interaction requires it.
- Keep anchored nonblocking Dropdown navigation separate from focused blocking
  Modal behavior. A visual surface is not a focus, scroll or dismissal system.
  Do not compose a new portal stack when a documented specialized owner exists.
  Use [interaction verification](../../../../docs/testing/interactions.md) for
  keyboard names, nesting, focus return, pending locks and scroll restoration.
