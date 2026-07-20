# Folder: `src/components/ui/overlays/modal`

## Role
Shared modal shell, host, and hooks for confirmation dialogs, image inspection, and future modal flows. `ConfirmationModal` is a first-class Halo primitive, not a demo-only example.

## Use This Folder When
- A feature needs blocking or focused dialog UI.
- The product needs confirmation, image inspection, or a reusable custom modal.
- You need modal behavior that participates in the app-wide modal host.

## Prefer These Files
- `src/components/ui/overlays/modal/ModalShell.tsx`: base portal-backed modal shell.
- `src/components/ui/overlays/modal/ModalHost.tsx`: app-wide modal renderer.
- `src/components/ui/overlays/modal/useModal.tsx`: low-level modal hook.
- `src/components/ui/overlays/modal/ConfirmationModal.tsx`: shared confirmation dialog content.
- `src/components/ui/overlays/modal/useConfirmationModal.tsx`: easiest path for destructive or confirm actions.
- `src/components/ui/overlays/modal/ModalForm.tsx`: standard form body/footer and multi-step modal composition.
- `src/components/ui/misc/StepIndicator.tsx`: canonical progress UI for `ModalStepForm`.
- `src/components/ui/overlays/modal/ImageInspectModal.tsx`: shared image-viewing modal.
- `src/components/ui/overlays/modal/useImageInspectModal.tsx`: easiest path for image-inspection UX.

## Invariants
- `ModalHost` must be mounted once near the app root through the mount layer.
- New modal flows should prefer `useConfirmationModal`, `useImageInspectModal`, or `useModal` instead of home-grown dialog state.
- The focus invariant is especially strict here:
  - Opening a modal should move users into a clear modal focus context.
  - Focus should remain trapped in the top-most modal while it is open.
  - `Escape` should affect only the top-most modal.
  - Closing a modal should restore focus predictably to the invoking control when possible.
- Backdrop, shell, and panel behavior should stay centralized in `ModalShell`.
- Destructive confirmation patterns should reuse the shared confirmation modal before introducing custom dialog copy and controls.
- Confirmation handlers may return `false` to keep the modal open. Use structured `details`, semantic warnings, `confirmVariant`, and `confirmTone` instead of replacing the shared confirmation layout. Destructive confirmations default to the shared soft-danger tone.
- Form flows should begin with `ModalForm`; use `ModalStepForm` only when the interaction has real ordered steps rather than cosmetic progress.
- Do not add a second confirmation system. If a standard confirm-before-action flow needs different copy, pass different options to `useConfirmationModal`.

## How To Use It
- Use `useConfirmationModal` for delete, remove, disconnect, or other confirm-before-action flows.
- Use `useImageInspectModal` or `InspectableImage` for click-to-enlarge imagery.
- Use `useModal` only when a new modal type truly needs custom content beyond the existing specialized helpers.
- If styling needs adjustment, prefer modal options such as panel or backdrop class overrides instead of forking the shell.

## Avoid
- Page-local dialog stacks with their own focus logic.
- Custom confirm modals for standard destructive flows.
- Breaking focus trap or focus return behavior for styling reasons.
