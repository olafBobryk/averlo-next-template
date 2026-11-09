# Folder: `src/lib/feedback`

## Role

Shared non-visual feedback event helpers used by UI hosts.

## Read

- `specs/platform/data/actions/spec.md` when changing non-form action feedback;
  verify with `docs/testing/actions.md`.

## Structure

- Helpers stay UI-agnostic and event-based: toast dispatch (`toast.ts`) lives
  here, rendering lives in the component layer (`src/components/ui/overlays/toast`).
- `index.ts` is a stable public contract consumed by many components.
- This folder is not a form framework or route-state owner; forms and reads keep
  their own owners.
