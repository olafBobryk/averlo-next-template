# Folder: `src/components/ui/overlays/toast`

Client-only transient-feedback host.

## Read

- `specs/platform/data/actions/spec.md` when changing feedback behaviour.

## Structure

- `ToastHost` mounts exactly once through `ToastClientMount` near the
  application root.
- `src/lib/feedback/toast.ts` is the paired dispatch API; UI consumers do not
  create feature-local Sonner hosts or state.
- The host may depend on focus and theme tokens but must not depend on route or
  feature code. Dispatch, accessibility semantics and motion policy stay
  centralized here.
