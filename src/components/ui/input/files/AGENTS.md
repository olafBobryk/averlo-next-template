# Folder: `src/components/ui/input/files`

## Role
Controlled file selection and preview fields for forms and document workflows.

## Use This Folder When
- A page needs file picking or a combined pending/uploaded file list.
- You want a file workflow that feels consistent with the rest of the library.
- The UI should reuse existing preview, list, and button conventions.

## Prefer These Files
- `src/components/ui/input/files/FileInput.tsx`: the public field for selection, previews, inspection, and editable/read-only file presentation.
- `src/components/ui/input/files/ProfilePictureInput.tsx`: profile/avatar image selection with preview, validation, and removal behavior.
- `src/components/ui/input/files/FilePreview.tsx` and `FileInspectModal.tsx`: private preview and inspection composition owned by `FileInput`.

## Public Surface
- External consumers import `FileInput`, `ProfilePictureInput`, and their public types from `@/components/ui/input`.
- Files inside this family import implementation owners directly. `FilePreview` and `FileInspectModal` are not public barrel exports.

## Invariants
- Prefer `FileInput` for new generic file work; do not compose separate picker and gallery surfaces.
- The last editable item is the shared dashed add tile. Preview and inspection helpers remain implementation details of the field.
- Use `mode="read"` for inspectable display without add/remove controls. Use `disabled` only to disable the interactions available in the selected mode.
- File actions should continue to use shared Button, Field, modal, confirmation, and preview conventions rather than custom upload cards.
- Removal or replacement actions must keep visible focus and keyboard accessibility.
- Keep the native file list synchronized with visual state. Form reset, reset signals, replacement, removal, and unmount cleanup must not leave stale files or object URLs behind.
- `FileInput` owns client-side form state and presentation only. Upload transport, persistence, progress, and server deletion remain caller responsibilities.
- Treat `accept` as the single file-type contract for picker, capture, and drag/drop input. Native filtering is only a hint; `FileInput` must validate every incoming file, retain accepted files from mixed batches, and report rejected files inline and through `onFilesRejected`.
- Client-side file matching is selection UX, not a security boundary. Upload handlers must independently validate file content and limits on the server.

## How To Use It
- Use `FileInput` as the entry point for both file selection and existing-file presentation.
- Use `items` and `onItemsChange` for the controlled pending/uploaded list; an empty editable list naturally renders only the add tile.
- Use field and preview `labels` when product copy needs to change without forking the component.
- If removing a file is destructive or surprising, pair the flow with the shared confirmation modal helpers.

## Avoid
- Custom drag-and-drop and preview tiles in feature code when `FileInput` is close enough.
- A page-local upload UX that ignores the shared focus, button, and preview patterns.
