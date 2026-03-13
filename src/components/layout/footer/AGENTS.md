# Folder: `src/components/layout/footer`

## Role
Site-wide footer assembly for persistent navigation, brand reinforcement, and closing-page CTAs.

## Use This Folder When
- Editing or extending the main footer.
- Adding footer links, brand copy, or a footer CTA.
- Standardizing the footer across routes.

## Prefer These Files
- `src/components/layout/footer/Footer.tsx`: canonical footer implementation.

## Invariants
- The footer should continue to use shared primitives like `Logo`, `Button`, and `Text` rather than local replacements.
- Footer actions must preserve visible focus and proper link or button semantics.
- Footer styling should stay aligned with the rest of the shell instead of introducing a competing design language.
- Footer updates should be global in intent, not route-specific hacks.

## How To Use It
- Extend `Footer.tsx` when a change should apply across the site.
- If a CTA belongs in the footer, prefer `Button` variants already used elsewhere so motion, focus, and loading states stay consistent.

## Avoid
- Copying footer sections into page code.
- Adding footer-only primitive variants when an existing primitive can be composed.
