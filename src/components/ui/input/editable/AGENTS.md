# Folder: `src/components/ui/input/editable`

## Role

Reusable display-to-edit field composites. These components own the transition between a readable value, a real form control, validation, pending mutation state, and focus restoration.

## Public Surface

- Import `EditableTextField` from `@/components/ui/input/editable`.
- Use `presentation="field"` for a stable input shell and `presentation="inline"` only for deliberate title or rename interactions.
- Use `EditableTextField.Skeleton` with the same presentation as the live component.

## Invariants

- Keep `Field` mounted across display, edit, pending, and error states.
- Field presentation keeps `InputFrame` mounted so view and edit geometry do not shift.
- Stay in edit mode while saving. Disable Cancel and conflicting input while pending.
- Validation and mutation errors remain inline through `Field`; callers own mutation toasts.
- Escape cancels, Enter submits, and Save or Cancel returns focus to the display trigger.
- Do not add caller-controlled Button variants, typography variants, animation systems, or layout internals. Add a semantic presentation only when a real reusable use case exists.
- Do not move editable mutation state into the structural `Field` primitive or the ordinary `TextInput`.
