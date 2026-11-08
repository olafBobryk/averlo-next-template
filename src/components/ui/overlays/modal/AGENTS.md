# Folder: `src/components/ui/overlays/modal`

Client-only modal host, shell, Card surface, slots, submission context, and
specialized confirmation and image-inspection flows.

## Read

- `specs/platform/design-system/families/overlays/spec.md` when changing focus,
  stacking, scroll lock, dismissal or pending close locks.
- Storybook owner stories for modal APIs and defaults.

## Structure

- `ModalHost` mounts exactly once through the application mount layer.
- `ModalShell` owns portal, backdrop, placement, motion, focus, stacking, scroll
  lock and dismissal. It owns no visual surface.
- `ModalHost` wraps hosted content in exactly one `ModalCard`. Direct
  `ModalShell` consumers render exactly one `ModalCard` themselves; no `Panel`
  or nested Card shells.
- `ModalHeader`, `ModalContent` and `ModalFooter` own slot spacing. Only
  `ModalContent` owns standard modal scrolling.
- Raw modal events in `@/lib/modal` are host plumbing, not consumer APIs.
- Submission and close-disable state stay centralized in this folder so every
  hosted close path observes the same lock.
