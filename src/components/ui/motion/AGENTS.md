# Folder: `src/components/ui/motion`

Shared scalar sources, scalar visual effects, scroll velocity, cycling,
text-motion and presence implementations.

## Read

- `specs/platform/design-system/motion/spec.md` when changing sources, effects,
  schedulers, drivers or reduced-motion paths.
- `specs/platform/design-system/scroll/spec.md` when changing scroll transport,
  `ScrollController` or `Scroll.*`.
- `specs/platform/design-system/families/presence/spec.md` when changing
  `presence/` (`ContentPresence`, `DisclosurePresence`).
- `docs/motion-drivers.md` for driver configuration and rollback.
- [Interaction verification](../../../../docs/testing/interactions.md) for
  resize, interruption and re-entry checks.

## Structure

- Family indexes are the external surfaces. Internals import direct owners; do
  not add a broad `@/components/ui/motion` facade or runtime namespace object.
- `MotionProvider`, `MotionScope`, timing and spring utilities are foundation
  owners; implementations resolve timing and springs through them.
- `presence/` owns controlled insertion/removal and measured layout-space
  transitions. Its private `DisclosurePresence` is shared by `ContentPresence`
  and Accordion.
- The site-level `MotionProvider` owns the single global motion scheduler.
  `ScrollController` owns Lenis and keeps GSAP `ScrollTrigger` in sync with it.
- Source progress, scheduler context, participant hooks and auto-cycle
  controller context are private; effects consume progress only through the
  nearest source context.
- `owner-hover` resolves only the nearest `data-motion-owner` ancestor.
- Animated rules compose the canonical, unlabeled `Divider` through
  `MotionEffect.Divider`.
- `Scroll.Lag` is the velocity-only exception; indexed owners stay outside the
  scalar source/effect system.
- Keep JSX SVG attributes camelCase.
