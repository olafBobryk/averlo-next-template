# Implementation Plan: Motion and responsive rendering

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08 (integration branch `feat/spec-kit-foundations`)

## Summary

Make the motion rules enforceable in the template: one gate (`useAnimated()`), presence modes, `MorphLabel`, the default Button morph, the `IconSwap` changes, a page-wide skeleton shimmer clock, and lint rules that stop new motion literals and height tricks. Family work is planned in the family specs; this plan lists the cross-cutting parts.

## Technical Context

- **Stack**: Next.js 16 App Router, React, `motion` (motion/react), Tailwind CSS, Biome 2 with GritQL plugins.
- **Owners**: `ui/foundations/{motionTiming,spring,motionDisableOverride}.ts`, `ui/foundations/{library,motion}.css`, `src/hooks/useMotionAllowed.ts`, `ui/motion/presence/`, `ui/helpers/{IconSwap,MorphLabel}.tsx`, `ui/primitives/Button.tsx`, `ui/misc/Skeleton.*`, `ui/motion/effect/MotionEffectTextStagger.tsx`.
- **Testing**: Storybook play tests (`npm run test-storybook`, light and dark) at 390 and 1440, motion on and `?motion=off`; `npm run lint`; `docs/operations/scroll-performance.md` for the shimmer clock.
- **Constraints**: rules only from other repos, never values or code (constitution V); token values are retuned separately in this batch; no token renames unless that retune says so.

## Constitution Check

- Spec first: rules accepted in `spec.md` before code. ✓
- Design-system reuse: extends existing owners; the only new owner is `MorphLabel` (stated reason: no state-driven text swap exists). ✓
- Ponytail: `useAnimated()` is one expression; the shimmer clock is CSS; lint uses Biome's built-in plugin support, no new tool. ✓

## Order

1. `useAnimated()` (presence, MorphLabel, IconSwap and Dropdown use it).
2. Presence modes → Field message (`families/inputs`).
3. `MorphLabel` → Button morph (`families/buttons`).
4. Lint rules last, with existing hits tagged `debt`.
