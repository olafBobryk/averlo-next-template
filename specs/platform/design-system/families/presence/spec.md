# Specification: Presence and swap family

**Spec path**: `specs/platform/design-system/families/presence`

**Created**: 2026-11-08 (new)

**Status**: Accepted, living. Presence modes, `MorphLabel`, the `IconSwap` changes and `useAnimated()` are built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/motion` (U3, H1–H4, T1–T4, I1–I2, L2, L4)

**Verified by**: the Storybook stories listed under "Proof"

## Purpose

Things that appear, disappear, resize or swap in place go through one owner each: `ContentPresence` for content, `MorphLabel` for text, `IconSwap` for icons, and the feedback owners (`InlineError`, `StatusMessage`, `Field` messages) that compose them.

## Clarifications

### Session 2026-11-08

- **Q: Collapse or the existing presence owner?**
  - A: The existing owner. `ContentPresence`/`DisclosurePresence` gain `mode`; no second height owner (P1).
- **Q: MorphLabel behaviour?**
  - A: Sequenced, never a glyph outside the box (P3). A frame-sampling test proves it.
- **Q: IconSwap changes?**
  - A: It gates reduced motion internally (callers drop `transitionClassName` gating) and gains `<IconSwap swapKey={k}>{child}</IconSwap>`. Instant icon swaps in the assistant messages move onto it (P4).

## API and defaults

| Owner | Props | Defaults |
|---|---|---|
| `ContentPresence` (`ui/motion/presence`) | `open`, `children`, `axis: "x" \| "y"`, `gapBefore`, `gapAfter`, `durationMs`, `id`, `className`; `mode` (this batch): default masked, `"together"`, `"sequenced"` | `axis="y"`, masked default mode |
| `DisclosurePresence` (private) | shared by `ContentPresence` and Accordion | |
| `MorphLabel` (`ui/helpers/MorphLabel`, this batch) | one string child | |
| `IconSwap` (`ui/helpers/IconSwap`) | `items` + `activeIndex`, or (this batch) `swapKey` + one child; `size: "sm" \| "md" \| "lg"`, `className` | `size="md"` |
| `InlineError` | `open`, `variant: "inline" \| "card"`, `action`, `id` | `open`, `inline` |
| `StatusMessage` (+ `StatusMessagePresence`) | `tone`, `heading`, `iconName`, `action`, `onDismiss` | |
| `useAnimated()` (this batch) | none; returns `useMotionAllowed(true) && !useMotionDisableOverride()` | |

## Requirements

- **P1 MUST: one presence owner with modes.** `ContentPresence` measures real size (it retargets when content changes) and offers the three modes of motion H1. Existing consumers keep the masked default. Consumers never add their own sequential fades or second measurement.
- **P2 MUST: closed content is inert.** Closed presence content is `inert` and `aria-hidden`; presence never owns triggers, focus or announcements.
- **P3 MUST: `MorphLabel` never shows a glyph outside its box.** Grow: width leads and the new text fades in once it fits (about 60% of the width progress). Shrink: old text fades out, then the width closes, then the new text fades in. y ±0.4em with a 3px blur. Reduced motion and `?motion=off` snap. Outgoing text is `aria-hidden`.
- **P4 MUST: `IconSwap` gates itself.** Reduced motion (OS setting and `?motion=off`) snaps inside the component; callers pass no transition-disabling class. `swapKey` + child swaps a single icon by key.
- **P5 MUST: feedback presence composes this family.** `InlineError`, `StatusMessagePresence` and `Field` messages use `ContentPresence` and add no second measurement or animation.
- **P6 MUST: new motion code gates through `useAnimated()`.**
- **P7 MUST: interruption retargets.** Toggling mid-animation retargets from the on-screen value; resize during movement settles to usable content.

## Proof

| Rule | Story (Storybook title / export) | Status |
|---|---|---|
| P1, P7 | `UI/Motion/ContentPresence` `Vertical`, `Horizontal`, `Interruption`, `ResizeDuringInterruption`, `MaskFollowsHeightProgress`, `AccordionParity`, `SlowerReveal` | exists; `together` and `sequenced` stories this batch |
| P1 (U3) | `UI/Motion/ContentPresence` `MotionOff`, `ReducedMotion` | exists |
| P3 | `UI/Helpers/MorphLabel` grow, shrink and interrupt stories with a frame-sampling play test (no opaque glyph past the edge) | this batch |
| P4 | `UI/Helpers/IconSwap` `StatefulTransition`, `SizeScale`, plus `swapKey` and reduced-motion stories | additions this batch |
| P5 | `UI/Primitives/InlineError` `Recovery`, `LongMessage`; `UI/Primitives/StatusMessage` `ControlledPresence`; `UI/Primitives/Field` two-line error | exists; Field this batch |
| P2 | `UI/Misc/Accordion` `DisclosureContract` | exists |
