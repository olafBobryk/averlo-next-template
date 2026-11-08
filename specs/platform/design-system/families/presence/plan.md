# Implementation Plan: Presence and swap family

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

Add `mode` to the presence owner, add `MorphLabel`, make `IconSwap` gate itself and accept `swapKey`, and move instant assistant icon swaps onto it.

## Technical Context

- **Owners**: `ui/motion/presence/{DisclosurePresence,ContentPresence}.tsx`, `ui/helpers/MorphLabel.tsx` (new), `ui/helpers/IconSwap.tsx`, `ui/motion/AGENTS.md` wording ("consumers must not add sequential fades" becomes "choose a mode") is rewired by the AGENTS agent.
- **Presence modes**: default masked (unchanged for existing consumers), `sequenced` (open: height leads, the content fades in once the box fits it; close: fade out, then height; clipped only while fully transparent). Keep the measured `ResizeObserver` sizing.
- **MorphLabel**: one string child; measured width on the disclosure spring; sequenced grow and shrink; y ±0.4em + 3px blur on the feedback spring; snaps under reduced motion and `?motion=off`.
- **IconSwap**: internal reduced-motion gate (CSS, server-safe), `swapKey` + child form beside `items`/`activeIndex`.
- **Presence consumers to re-check**: `InlineError`, `StatusMessagePresence`, `misc/accordion/AccordionClient`, `domain/assistant/MessageQueue`, `homeHero` previews.
- **Testing**: `UI/Motion/ContentPresence` mode stories; `UI/Helpers/MorphLabel` frame-sampling play test; `UI/Helpers/IconSwap` swapKey and reduced-motion stories.
