# Implementation Plan: Inputs family

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

Replace `Field`'s clipped `max-h` message with `ContentPresence mode="sequenced"`, add opt-in `TextAreaInput autoGrow`, and add the two input lint rules.

## Technical Context

- **Owners**: `ui/primitives/Field.tsx`, `ui/input/text/TextAreaInput.tsx`; thin-start override `template/profiles/thin-start/overrides/src/components/ui/primitives/Field.tsx` (decide whether thin-start gets the reveal; keep its API list).
- **Depends on**: presence `mode` (`families/presence` T001).
- **API kept**: `message`, `tone`, `messageId`, `disableMessage`; the gap moves inside the presence box.
- **Testing**: `UI/Primitives/Field` play test: a two-line error never clips at 390 and 1440 (text height ≤ box height at rest); `UI/Input/Text/TextAreaInput` autoGrow story; `npm run verify:component-skeletons` for skeleton parity.
