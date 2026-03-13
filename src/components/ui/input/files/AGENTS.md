# Folder: `src/components/ui/input/files`

## Role
File selection and upload-oriented controls for forms and document workflows.

## Use This Folder When
- A page needs file picking, upload progress presentation, or uploaded-file listing.
- You want a file workflow that feels consistent with the rest of the library.
- The UI should reuse existing preview, list, and button conventions.

## Prefer These Files
- `src/components/ui/input/files/FileInput.tsx`: preferred upload widget for modern flows.
- `src/components/ui/input/files/UploadedFilesList.tsx`: list of uploaded files with removal actions.
- `src/components/ui/input/files/FileUploader.tsx`: older uploader abstraction; use only if it still matches the needed flow better than `FileInput`.

## Invariants
- Prefer `FileInput` for new work unless a legacy flow already depends on `FileUploader`.
- File actions should continue to use shared `Button`, `Text`, and preview conventions rather than custom upload cards.
- Removal or replacement actions must keep visible focus and keyboard accessibility.
- If a richer preview flow is needed, prefer composing with `FilePreview` and confirmation or image-inspection helpers instead of starting from scratch.

## How To Use It
- Use `FileInput` as the default entry point for new upload UI.
- Use `UploadedFilesList` when the workflow needs a persistent, editable list of selected or uploaded files.
- If removing a file is destructive or surprising, pair the flow with the shared confirmation modal helpers.

## Avoid
- Custom drag-and-drop and preview tiles in feature code when the existing file components are close enough.
- A page-local upload UX that ignores the shared focus, button, and preview patterns.
