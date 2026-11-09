# Folder: `src/components/ui/input/files`

This folder owns controlled file selection and profile-picture fields.

## Read

- `specs/platform/services/files/spec.md` and
  `specs/platform/services/delivery/spec.md` for upload validation and
  attachment rules (enforced server-side, outside this family).

## Structure

- `FilePreview` and `FileInspectModal` are private `FileInput` composition owners;
  no public exports or catalogue identities.
- `FileInput` owns client-side form state and presentation only. Upload transport,
  persistence, progress, server deletion and authoritative validation live
  outside this family.
- Preview callbacks and `FilePreviewProvider` delegate inspection to a
  caller-owned host: the callback contract stays here, the viewer in composites.
  Inputs never import composites or dashboard code.
- The editable file rail ends with the shared Card-backed add tile; read mode
  reuses the same preview topology without add/remove controls.
- The native file input stays synchronized with controlled visual state; object
  URLs are revoked when pending files are replaced or on unmount.
