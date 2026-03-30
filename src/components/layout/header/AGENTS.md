# Folder: `src/components/layout/header`

## Role
Responsive header system for global navigation, CTAs, and the mobile menu modal.

## Use This Folder When
- You are changing navigation items, shell CTAs, or mobile menu behavior.
- You need to adjust header behavior across breakpoints.
- You need to maintain parity between desktop and mobile navigation.

## Prefer These Files
- `src/components/layout/header/Header.tsx`: responsive wrapper that chooses the appropriate header variant.
- `src/components/layout/header/HeaderFull.tsx`: desktop header.
- `src/components/layout/header/HeaderCompact.tsx`: mobile header trigger bar.
- `src/components/layout/header/HeaderCompactModal.tsx`: mobile full-screen menu content rendered in a modal shell.
- `src/components/layout/header/ContentSearch.tsx`: project-level route search used across header variants.

## Invariants
- Use `Header.tsx` by default. Reach for `HeaderFull` or `HeaderCompact` directly only when a breakpoint-specific render is truly required.
- Desktop and mobile navigation should expose the same information architecture unless there is an explicit product reason to diverge.
- Header-level search should point at real project routes and keep desktop and mobile coverage aligned.
- The compact menu should continue to use the modal system rather than a page-local drawer or ad hoc overlay.
- Focus is critical here:
  - The mobile menu trigger must keep a visible focus state.
  - Opening the mobile menu should move users into a focusable modal context.
  - Closing the modal should return focus predictably to the trigger or calling context.
- Header actions should keep using shared `Button`, `Icon`, `Logo`, and modal primitives.

## How To Use It
- For app shell usage, import `Header`.
- When adding nav items, update both the desktop and compact modal paths.
- When adding a new mobile-header interaction, build it through the existing modal flow instead of creating a second overlay mechanism.

## Avoid
- A separate mobile navigation drawer outside `HeaderCompactModal`.
- Divergent CTA wording or nav structure across header variants without explicit product intent.
- Hiding keyboard focus on the compact menu button or nav actions.
