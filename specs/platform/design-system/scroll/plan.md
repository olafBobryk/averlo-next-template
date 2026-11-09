# Implementation Plan: Scroll containers

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

Build `ScrollArea` as the one inner-scroller owner, absorb `ScrollBorders` into it as `edgeStyle="border"`, migrate `ScrollBorders` users, and add a lint rule against ad hoc overflow.

## Technical Context

- **Owner**: `src/components/ui/misc/ScrollArea.tsx` (+ stories and catalogue entry; `componentCatalog.generated.ts` regenerated).
- **API**: `axis="y" | "x"`, `edge` / `edgeStart` / `edgeEnd` (padding the scroller absorbs, mask of the same size), `edgeStyle="fade" | "border"`, `scrollbar="auto" | "hidden"`, `showBackToTop`; always `overscroll-contain` on its axis; no mask in print.
- **Border mode**: inset overlay (pseudo-element or inset shadow), shown only while content hides past that edge; never changes the box.
- **Scrollbar colours**: theme tokens (already the case in `library.css`; keep it).
- **Testing**: Storybook play tests at 390 and 1440 (box size unchanged by the border, mask only while overflowing, both ends, one item, max height); `npm run lint`.

## Constitution Check

- One owner replaces one (`ScrollBorders`), so the owner count stays the same. ✓
- CSS mask and padding; no scroll library. ✓

## Current `ScrollBorders` users

`src/app/(site)/_components/layout/HeaderCompact.tsx`, `src/lib/marketing-content/sections/homeHero/previews/HeroPreview67.tsx`, `src/lib/marketing-content/sections/homeHero/heroSpecimens.tsx`, `src/components/ui/misc/index.ts`, plus its own stories and catalogue entry.
