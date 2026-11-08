# Folder: `src/components/ui/overlays`

Shared portal-backed overlay infrastructure.

## Read

- `specs/platform/design-system/families/overlays/spec.md` when changing focus,
  dismissal, stacking, scroll lock or anchored versus blocking behaviour.
- [Interaction verification](../../../../docs/testing/interactions.md) for
  keyboard names, nesting, focus return, pending locks and scroll restoration.

## Structure

- `Portal` is the low-level DOM escape boundary. Modal and toast systems own
  their specialized hosts and are not reimplemented directly on Portal.
- Overlay code may compose foundations, primitives and shared UI, but must not
  depend on feature-local state or route code.
- Portal targets resolve only after client mount and fall back to
  `document.body`; no scattered direct `createPortal` calls.
- Application overlays use the shared portal and host model rather than
  parallel stacks. Anchored Dropdown navigation (`../primitives/dropdown/`) and
  blocking Modal (`modal/`) stay separate owners.
- Modal topology: `modal/AGENTS.md`. Toast topology: `toast/AGENTS.md`.
