# Folder: `src/components/ui/helpers`

This folder owns small reusable interaction helpers used by higher-level UI.

## Dependency and runtime boundaries

- Helpers may compose foundations, icons and primitives but never depend on
  inputs, overlays or feature code.
- Stateful helpers are client components and keep their timers and cleanup
  inside the owning hook.

## Ownership split

- `MorphLabel` owns in-place string label swaps (`Button` uses it for string
  children); `IconSwap` owns icon swaps and gates reduced motion itself. Rules:
  `specs/platform/design-system/motion/spec.md` (T1, I1).
- `IconSwap` owns only the visual state transition; the surrounding control owns
  its accessible name, keyboard semantics and focus.
- `ArrowAction` composes the canonical Button with decorative Icon layers;
  interactive instances keep Button-owned focus and semantics.
- `useCopyAction` owns clipboard execution, copied-state timing and cleanup;
  `CopyStatusIcon` owns only the matching decorative icon state.
- Do not fork these helpers into component-local animation or clipboard state.
