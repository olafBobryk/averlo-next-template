# Folder: `src/components/layout/header`

## Role
Responsive header system for global navigation, CTAs, and the compact mobile menu disclosure.

## Use This Folder When
- You are changing navigation items, shell CTAs, or mobile menu behavior.
- You need to adjust header behavior across breakpoints.
- You need to maintain parity between desktop and mobile navigation.

## Prefer These Files
- `src/components/layout/header/Header.tsx`: responsive wrapper that chooses the appropriate header variant.
- `src/components/layout/header/HeaderFull.tsx`: desktop header.
- `src/components/layout/header/HeaderCompact.tsx`: mobile header with inline expandable navigation.
- `src/components/layout/header/ContentSearch.tsx`: project-level route search used across header variants.

## Invariants
- Use `Header.tsx` by default. Reach for `HeaderFull` or `HeaderCompact` directly only when a breakpoint-specific render is truly required.
- Desktop and mobile navigation should expose the same information architecture unless there is an explicit product reason to diverge.
- Header-level search should point at real project routes and keep desktop and mobile coverage aligned.
- The compact menu should expand inline from `HeaderCompact` using shared library controls instead of a separate modal or page-local drawer.
- Focus is critical here:
  - The mobile menu trigger must keep a visible focus state.
  - Expanding the mobile menu should keep the trigger and newly revealed content keyboard reachable without trapping focus.
  - Closing the compact menu should leave focus on the current control or return it predictably to the trigger.
- Header actions should keep using shared `Accordion`, `Button`, `ContentSearch`, and `Logo` primitives.

## How To Use It
- For app shell usage, import `Header`.
- When adding nav items, update both the desktop and compact inline menu paths.
- When adding a new mobile-header interaction, build it through the existing disclosure flow instead of reviving a second overlay mechanism.

## Avoid
- A separate mobile navigation modal or drawer outside `HeaderCompact`.
- Divergent CTA wording or nav structure across header variants without explicit product intent.
- Hiding keyboard focus on the compact menu button or nav actions.
