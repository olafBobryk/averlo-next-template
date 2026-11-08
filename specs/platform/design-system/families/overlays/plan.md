# Implementation Plan: Overlays family

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

Swap the Dropdown positioning engine to `@floating-ui/react-dom` behind the existing props, add `presentation="anchored" | "sheet" | "auto"`, add `?motion=off` to the Dropdown motion gate, and give the toast promise helper a cancel option.

## Technical Context

- **Owners**: `ui/primitives/dropdown/{positioning.ts,DropdownRoot.tsx,DropdownSurface.tsx,types.ts}`, `src/lib/feedback/toast.ts`.
- **Dependency**: `@floating-ui/react-dom`, pinned exactly with `scripts/pin-deps.mjs` (stated reason: maintained collision handling with `autoUpdate`, replacing hand-written flip/shift).
- **Engine**: `offset`, `flip`, `shift({ padding: collisionPadding })`, `size` for the height cap, `autoUpdate` while open. Public props unchanged; the 28 importing files should not change.
- **Presentation**: `auto` measures whether the anchored panel fits its minimum size in the available space; if not, a full-width sheet docked to the bottom edge. No device or breakpoint logic.
- **Motion gate**: `useAnimated()` (adds `?motion=off` to today's reduced-motion gate).
- **Testing**: `UI/Primitives/Dropdown` stories (existing 12 play tests green, plus flip/shift/cap and presentation stories at 390 and 1440, and `?motion=off`); `UI/Overlays/Toast` cancel case; `npm run verify:modals`.
