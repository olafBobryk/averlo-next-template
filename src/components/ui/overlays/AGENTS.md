# Folder: `src/components/ui/overlays`

## Role
Shared portal-backed overlay infrastructure.

## Use This Folder When
- A UI surface needs to render outside normal layout flow.
- You are working on modals, toasts, or portal-based dropdown foundations.
- The solution needs the shared overlay stack instead of a feature-local one.

## Prefer These Files
- `src/components/ui/overlays/Portal.tsx`: shared portal helper.

## Invariants
- Overlay UI should route through the shared portal and host model.
- Do not create multiple competing overlay systems in feature code.
- Focus must be predictable around overlays: entering, trapping where necessary, and restoring on close.
- Portal targets should be configured through the existing APIs rather than bypassing the overlay system.

## How To Use It
- Use `Portal` when a reusable component needs to render outside its parent stacking context.
- For modal or toast behavior, prefer the specialized systems in the subfolders rather than consuming `Portal` directly in page code.

## Avoid
- Ad hoc `createPortal` usage scattered through feature components when a shared overlay primitive already exists.
- Overlay implementations that do not define a clear focus story.

## See Also
- `src/components/ui/overlays/modal/AGENTS.md`
- `src/components/ui/overlays/toast/AGENTS.md`
- `src/components/ui/primitives/AGENTS.md`
