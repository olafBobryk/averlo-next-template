# Folder: `src/components/ui/foundations`

This folder owns library-wide focus, motion, settings, appearance, text-scale,
surface-tint and CSS-token infrastructure.

## Read

- `specs/platform/design-system/motion/spec.md` when changing motion timing,
  springs or theme transitions.
- `specs/platform/design-system/usage/spec.md` when changing focus, fill or
  tint tokens.

## Dependency and runtime boundaries

- Foundation modules never depend on higher-level primitives, inputs, overlays
  or feature code.
- `SettingsProvider`, motion override hooks and `MotionProvider` are client
  boundaries. Pure token modules (`focus.ts`, `motionTiming.ts`, `spring.ts`,
  `surfaceTint.ts`) stay usable without React state.
- `MotionProvider` owns the motion driver and the global reveal scheduler. Step
  values live only in `motionTiming.ts`, `spring.ts` and `library.css`.
- Appearance and text scale are application-root state: no route-local theme
  stores, route-owned `.dark` effects or root font-size mutation.
- Shared focus tokens here are the only library-level focus-ring recipes; feature
  code does not duplicate them.
- `--background`, `--surface`, `--card` and `--popover` are the independent
  Page, Panel, Card and Float fill owners.
