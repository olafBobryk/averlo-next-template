# Tasks: Motion and responsive rendering

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Tasks marked **[batch 2026-11-08]** were built in that batch and merged to main on 8 and 9 November 2026.

- [x] T001 [batch 2026-11-08] Add `useAnimated()` beside `useMotionAllowed` as exactly `useMotionAllowed(true) && !useMotionDisableOverride()`; use it in new code (U3).
- [x] T002 [batch 2026-11-08] Retune motion token names and values and record them in the spec's token table (main thread) (U1).
- [x] T003 [batch 2026-11-08] Biome GritQL rule: no duration, easing or spring literals outside the token files; existing hits get `// biome-ignore lint/plugin/<rule>: debt` (U1, SC-001).
- [x] T004 [batch 2026-11-08] Biome GritQL rule: no `max-h-*`, `grid-rows-[0fr]` or `interpolate-size` height tricks in feature code; existing hits tagged `debt` (H3).
- [x] T005 [batch 2026-11-08] Fix `MotionEffectTextStagger` treating 0.4em as px.
- [x] T006 [batch 2026-11-08] One page-wide skeleton shimmer clock (shared sweep; stops under reduced motion and `data-motion-override="off"`), keeping the template fill; run the scroll-performance check before accepting (L1.5).
- [x] T007 [batch 2026-11-08] Presence modes, `MorphLabel`, `IconSwap` gate and `swapKey`: see `families/presence/tasks.md` (H1, T1, I1).
- [x] T008 [batch 2026-11-08] Default Button morph: see `families/buttons/tasks.md` (B1).
