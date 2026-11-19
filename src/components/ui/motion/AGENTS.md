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
  switch: scroll reveals are `MotionSource.Sequence mode="scroll"` with
  `MotionSource.Item` children; `reveal` sources stay for content with no
  scroll position.
- Every scroll-reveal item shows `reveal = intro(t) × reach(y)` (motion spec
  V1–V3; `source/entrySequence.ts`, `source/scrollReach.ts`). Items above the
  95% line at entry play one timed sequence in reading order and end fully
  revealed. Every other item scrubs from its own position, finishes at the
  max scroll at the latest, and reverses when scrolling back. Never add a
  latch or mode switch between the two terms, and never cap an intro by
  scroll progress.
- Don't add per-section offsets to make bottom content finish: `reach`
  already ends at the max scroll (V2).
- A section's top rule is `MotionEffect.Divider` in the first
  `MotionSource.Item` of its Sequence, not a static `border-t` (V4).
- `owner-hover` resolves only the nearest `data-motion-owner` ancestor.
- Animated rules compose the canonical, unlabeled `Divider` through
  `MotionEffect.Divider`.
- `Scroll.Lag` is the velocity-only exception; indexed owners stay outside the
  scalar source/effect system.
- Keep JSX SVG attributes camelCase.
