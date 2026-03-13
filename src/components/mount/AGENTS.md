# Folder: `src/components/mount`

## Role
Client-only mounts for global UI hosts that must exist once near the app root.

## Use This Folder When
- The app layout needs the modal host or toast host mounted.
- A global portal-based system requires a client boundary.
- You need the host side of `showToast`, `useModal`, or related overlay APIs.

## Prefer These Files
- `src/components/mount/ModalClientMount.tsx`: mounts `ModalHost` on the client.
- `src/components/mount/ToastClientMount.tsx`: mounts `ToastHost` on the client.

## Invariants
- Mount hosts once. Duplicate modal or toast hosts create inconsistent behavior and are usually a bug.
- These mounts belong high in the app tree, typically close to `src/app/layout.tsx`.
- Focus restoration for overlays depends on the shared host model staying intact.
- Use these mounts instead of embedding host components throughout feature code.

## How To Use It
- Place the modal and toast mounts in the global layout so any page can use the matching hooks or event APIs.
- If an overlay needs a special portal target, prefer host options or portal targets over introducing extra root mounts.

## Avoid
- Rendering `ModalHost` or `ToastHost` repeatedly in page components.
- Building host-like wrappers inside feature code.
