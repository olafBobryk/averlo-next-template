# Folder: `src/components/ui/motion`

## Ownership

Shared scalar sources, scalar visual effects, scroll velocity, cycling, and
text-motion implementations.

The `presence/` family owns controlled content insertion/removal and measured
layout-space transitions, independent of viewport/scroll source activation.
Its private `DisclosurePresence` implementation is shared by `ContentPresence`
and Accordion: measured spring dimensions, continuous opaque content, a 16px
soft clipping edge during movement, and unmasked visible overflow after settling.
When motion is disabled, omit the mask entirely, including during closing.
Keep that lifecycle in this owner; consumers must not add sequential fades.

## Public boundary

- Family indexes are the external surfaces. Internals import direct owners; do
  not add a broad `@/components/ui/motion` facade or runtime namespace object.
- `MotionProvider`, `MotionScope`, timing, and spring utilities remain
  foundation owners.

## Structural Invariants

- Application-level driver configuration and rollback are documented in
  `docs/motion-drivers.md`. Hybrid is the default; Motion is a maintained runtime
  fallback. Effects and product call sites must not select drivers.
- The site-level `MotionProvider` owns the single global motion scheduler.
  Page-local or nested global schedulers are prohibited.
- `ScrollController` owns Lenis as the optional page-scroll transport and keeps
  GSAP `ScrollTrigger` synchronized with it. Motion sources must not create a
  second scroll transport.
- In hybrid mode, GSAP drives reveal, in-view, and scroll-linked source progress.
  The Motion fallback retains its original sources and wheel transport. Motion
  drives direct interaction sources such as hover and boolean state. Effects remain
  driver-agnostic and consume only the shared scalar progress contract.
- `MotionSource.Sequence` enters its nearest scheduler once and owns relative
  descendant reveal-source batching.
- Viewport re-entry reset remains scheduler- and source-owned, cascading
  through shared progress. Effects must not install reveal observers or reset
  themselves.
- Fallback and reduced-motion paths must not gate primary copy, focus, keyboard
  access, or essential controls.
- Source progress, scheduler context, participant hooks, and auto-cycle
  controller context remain private. Effects consume progress only through the
  nearest source context.
- `CounterpartReveal` owns coincident base/counterpart geometry, decorative
  duplicate semantics, measured anchor alignment, and reversible reveal-mask
  selection. Callers own the two visual treatments, marked anchor, and a
  declarative circle, swipe, or grid strategy; strategies never own content.
- `owner-hover` resolves only the nearest `data-motion-owner` ancestor. The
  owner retains semantics, accessible naming, and visible focus treatment.
- Animated rules compose the canonical, unlabeled `Divider` through
  `MotionEffect.Divider`. Never scale labeled divider content.
- `Scroll.Lag` remains the velocity-only exception; indexed owners remain
  outside the scalar source/effect system.
- Implementations resolve timing and spring behavior through foundation owners;
  do not introduce hardcoded page-local timing systems.

## Responsive and interaction boundaries

- Use CSS for lightweight layout, styling and visibility. A client breakpoint
  branch is justified only to avoid hidden expensive observers, runtime, media,
  canvas or duplicated decorative DOM; never gate primary copy, headings,
  navigation, essential controls or accessibility on that decision.
- Sources own activation and overall progress; effects own visual mapping and
  internal phasing. No page-local reveal observers, reset logic, schedulers or
  timing families. Reduced, motion-off and fallback paths remain readable and
  keyboard operable before animation completes.
- ContentPresence owns measured normal-flow insertion/removal and optional gap,
  independent of viewport reveal. It does not own disclosure triggers, focus or
  announcements. Interaction wrappers preserve the real owner and never create
  duplicate focus stops. Keep JSX SVG attributes camelCase.
- Memoization requires correctness or measured performance benefit, not routine
  decoration. [Interaction verification](../../../../docs/testing/interactions.md)
  covers supported resize/interruption/re-entry and compact states; load measured
  scroll procedures only when performance is actually being measured.
