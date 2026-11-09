# Folder: `src/components/ui/primitives/surfaces`

Server-safe Panel, Card, Float, and semantic elevation vocabulary used on the
Page canvas.

## Read

- `specs/platform/content/hierarchy/spec.md` when deciding grouping, Card or
  ContentSection usage, headings or section backgrounds.
- Storybook owner stories for surface APIs and defaults.

## Structure

- The public boundary is the explicit `index.ts` facade. Internal composition
  may import sibling modules directly to avoid facade cycles.
- Page is a foundation canvas rather than a React component. Overlay remains an
  interaction context owned by overlay systems.
- Structure and elevation are independent: Card may use float or overlay
  elevation without becoming Float, and Float remains behavior-free.
- Card parts remain under a real Card root and preserve their `data-slot` and
  `group/card` selectors. ContentSection parts use their own slots.
- Opaque surfaces publish their resolved fill through `--ui-surface-color`;
  transparent surfaces inherit the nearest owning surface.
- The shared class recipe and inspection helpers are implementation-only: not
  exported from the facade and without a separate Storybook identity.
- Surface primitives own no portal, focus, dismissal, positioning or modal
  behavior.
