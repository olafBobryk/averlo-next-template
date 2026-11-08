# Folder: `src/components/ui/input/editable`

This folder owns reusable display-to-edit field state.

## Structure

- `Field` and `InputFrame` stay mounted across display, edit, pending and error
  states.
- Mutation, validation, draft and focus-restoration state live inside
  `EditableTextField`, not in structural `Field` or ordinary `TextInput`.
- Callers do not control internal button variants, typography, animation or
  layout; a new presentation mode needs a distinct reusable use case.
