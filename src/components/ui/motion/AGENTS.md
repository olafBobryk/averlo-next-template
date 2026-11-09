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
- `MotionProvider`, `motionTiming` and `spring` are foundation owners;
  implementations name a step and resolve timing and springs through them.
- `presence/` owns controlled insertion/removal and measured layout-space
  transitions. Its private `DisclosurePresence` is shared by `ContentPresence`
  and Accordion.
- The site-level `MotionProvider` owns the single global motion scheduler.
  `ScrollController` owns Lenis and keeps GSAP `ScrollTrigger` in sync with it.
- Source progress, scheduler context, participant hooks and auto-cycle
  controller context are private; effects consume progress only through the
  nearest source context.
- Section reveals have no separate reveal facade or marketing scroll-mode
  switch: scroll-scrubbed reveals are `MotionSource.Sequence mode="scroll"`
  with `MotionSource.Item` children; `reveal` sources stay for content with no
  scroll position.
- `owner-hover` resolves only the nearest `data-motion-owner` ancestor.
- Animated rules compose the canonical, unlabeled `Divider` through
  `MotionEffect.Divider`.
- `Scroll.Lag` is the velocity-only exception; indexed owners stay outside the
  scalar source/effect system.
- Keep JSX SVG attributes camelCase.
