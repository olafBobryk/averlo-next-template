# Tasks: Presence and swap family

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

- [ ] T001 [batch 2026-11-08] `DisclosurePresence`/`ContentPresence` gain `mode` (default masked, `sequenced`) with stories and play tests; existing consumers unchanged (P1).
- [ ] T002 [batch 2026-11-08] `Field` message adopts `sequenced`: see `families/inputs` T001 (P5).
- [ ] T003 [batch 2026-11-08] Add `ui/helpers/MorphLabel.tsx` with stories, catalogue entry and a frame-sampling play test proving no opaque glyph is past the edge (P3).
- [ ] T004 [batch 2026-11-08] `IconSwap` gates reduced motion internally and gains `swapKey` + child; callers drop transition-disabling classes (P4).
- [ ] T005 [batch 2026-11-08] Move the instant icon swaps in `AssistantMessage` and `UserMessage` onto `IconSwap` (P4).
- [ ] T006 [batch 2026-11-08] New presence and swap code gates through `useAnimated()` (`motion` T001) (P6).
