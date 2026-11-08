# Implementation Plan: Buttons family

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

`Button` morphs by default: string-child changes render through `MorphLabel` and the width eases on the disclosure spring; `morph={false}` opts out; loading keeps the fixed-width crossfade.

## Technical Context

- **Owner**: `ui/primitives/Button.tsx` (+ `Button.stories.tsx`, catalogue entry).
- **Depends on**: `MorphLabel` (`families/presence` T003), `useAnimated()` (`motion` T001).
- **Consumers**: none change; `useCopyAction` may adopt the morph for its label.
- **Testing**: label-change story with a frame-sampling play test (no glyph outside the box, width settles to the new label); `morph={false}` and `?motion=off` stories; existing `AsyncStateParity` and `GeometryAndSkeletons` stay green.
