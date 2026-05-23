# Folder: `src/components/ui/input/files`

## Role
File selection and upload-oriented controls for forms and document workflows.

## Use This Folder When
- A page needs file picking, upload progress presentation, or uploaded-file listing.
- You want a file workflow that feels consistent with the rest of the library.
- The UI should reuse existing preview, list, and button conventions.

## Prefer These Files
- `src/components/ui/input/files/FileUploadInput.tsx`: preferred file picker for modern flows.
- `src/components/ui/misc/FileGallery.tsx`: preview gallery for pending and uploaded files.
- `src/components/ui/misc/FilePreview.tsx`: individual preview tile used by galleries.

## Invariants
- Prefer `FileUploadInput` for new work and pair it with `FileGallery` when selected files should be visible before submit.
- File actions should continue to use shared `Button`, `Text`, and preview conventions rather than custom upload cards.
- Removal or replacement actions must keep visible focus and keyboard accessibility.
- If a richer preview flow is needed, prefer composing with `FilePreview` and confirmation or image-inspection helpers instead of starting from scratch.

## How To Use It
- Use `FileUploadInput` as the default entry point for new file selection UI.
- Use `FileGallery` when the workflow needs a persistent, editable list of selected or uploaded files.
- Use `dropTitle`, `dropDescription`, `pendingFilesLabel`, and gallery/preview `labels` when product copy needs to change without forking the file components.
- If removing a file is destructive or surprising, pair the flow with the shared confirmation modal helpers.

## Avoid
- Custom drag-and-drop and preview tiles in feature code when the existing file components are close enough.
- A page-local upload UX that ignores the shared focus, button, and preview patterns.
