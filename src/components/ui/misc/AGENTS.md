# Folder: `src/components/ui/misc`

## Ownership

This folder owns cross-cutting state, loading, display, copy, disclosure, media,
and utility components that are neither complete inputs nor overlays.

## Dependency and profile boundary

- Misc internals and lower-level UI dependencies import direct owners where
  required to preserve dependency direction. Primitives must not import the
  misc facade and create a cycle.
- The barrel is explicit. Accordion client/shared modules and input-owned file
  preview helpers remain private.
- Thin start owns a separate `@/components/ui/misc` facade that exports only
  `Skeleton`.

## Structural Invariants

- Component-specific skeletons preserve the live owner’s outer DOM, wrapper
  layout, spacing, and breakpoint structure while replacing content nodes.
  Skeleton trees remain non-interactive.
- Chip soft fills resolve against the inherited `--ui-surface-color`. Profile
  pictures use the shared primary, success, warning, danger and violet color set
  with the default static Chip tint. The same full name selects the same accent
  across cards, menus and navigation; tint resolves against its owning surface. Display initials
  and size never change that color; helperIndex is only used without a name.
  Callers do not own replacement background recipes.
- Profile-picture stacks own overlap clipping and z-order without
  surface-colored rings.
- `ImageSwitcher` owns its preload and transition lifecycle; `SuspenseBoundary`
  keeps controlled and React Suspense modes in one owner.

## Related Structural Rules

- Accordion implementation topology: `accordion/AGENTS.md`.
- State-family implementation topology: `state/AGENTS.md`.

- Validate semantic ink and tinted controls in light and dark on Surface, Card,
  and Float, including hover/pressed backgrounds. Ordinary text targets 4.5:1.
  Avatar fills are decorative identity cues, not status or pressed states. Their
  initials require 4.5:1; decorative fills have no minimum boundary contrast.
  Meaningful icons and control boundaries retain their applicable contrast rules.
