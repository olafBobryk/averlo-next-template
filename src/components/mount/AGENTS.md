# Folder: `src/components/mount`

## Role
Client-only mounts for global UI hosts and singleton app-level systems that must exist once near the app root.

## Use This Folder When
- The app layout needs the modal host or toast host mounted.
- A global portal-based system requires a client boundary.
- A first-load intro or similar app-wide mount needs to coordinate global UI state.
- You need the host side of `showToast`, `useModal`, or related overlay APIs.

## Prefer These Files
- `src/components/mount/LoadingScreenMount.tsx`: first-load intro overlay that controls the app-ready signal.
- `src/components/mount/ModalClientMount.tsx`: mounts `ModalHost` on the client.
- `src/components/mount/ScrollController.tsx`: centralizes native smooth-scroll behavior and same-page anchor handling.
- `src/components/mount/ToastClientMount.tsx`: mounts `ToastHost` on the client.

## Invariants
- Mount hosts once. Duplicate modal or toast hosts create inconsistent behavior and are usually a bug.
- These mounts belong high in the app tree, typically close to `src/app/layout.tsx`.
- `LoadingScreenMount` is also a singleton root mount. It should be mounted once and should own when the app becomes intro-ready.
- Focus restoration for overlays depends on the shared host model staying intact.
- Use these mounts instead of embedding host components throughout feature code.

## How To Use It
- Place the modal, toast, and loading screen mounts in the global layout so any page can rely on the matching hooks or intro-ready state.
- Place `ScrollController` in the global layout when the app should coordinate same-page anchor scrolls and route resets through one client mount.
- If an overlay needs a special portal target, prefer host options or portal targets over introducing extra root mounts.

## Avoid
- Rendering `ModalHost`, `ToastHost`, or `LoadingScreenMount` repeatedly in page components.
- Building host-like wrappers inside feature code.
