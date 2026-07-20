# Folder: `src/components/ui/primitives`

## Role
Lowest-level reusable building blocks. Agents should check this folder before writing raw UI markup.

## Use This Folder When
- You need a reusable button, text style, field wrapper, input shell, dropdown surface, listbox, card, divider, or section container.
- A new higher-level component should be composed from existing building blocks.
- A page wants custom arrangement but standard library behavior.

## Preferred Starting Points
- `src/components/ui/primitives/Text.tsx`: canonical typography component.
- `src/components/ui/primitives/Button.tsx`: canonical action and button-like link component.
- `src/components/ui/primitives/InputFrame.tsx`: canonical shell for text-like inputs.
- `src/components/ui/primitives/Field.tsx`: canonical label, description, and message wrapper.
- `src/components/ui/primitives/Dropdown.tsx`: canonical trigger-plus-menu overlay primitive.
- `src/components/ui/primitives/Listbox.tsx`: canonical accessible option list for menus and selectors.
- `src/components/ui/primitives/Panel.tsx`: generic surface, layout, and overlay-root primitive.
- `src/components/ui/primitives/Card.tsx`: structured card built on `Panel`, with owned header, action, content, and footer slots.
- `src/components/ui/primitives/Section.tsx`: page section wrapper.
- `src/components/ui/primitives/Divider.tsx`: horizontal or vertical separator with optional horizontal label.
- `src/components/ui/primitives/StatusMessage.tsx`: semantic inline status surface for information, success, warning, and danger copy.
- `src/components/ui/primitives/accent.ts`: the closed semantic accent contract shared by Panel, Card, and compact status surfaces.
- `src/components/ui/primitives/dropdownStyles.ts`: shared dropdown classnames.

## Invariants
- Start here before building custom equivalents from raw HTML.
- `Text` should own most component-level typography decisions.
- `Button` should own most interactive button or button-like link behavior, including loading, icon layout, and visible focus.
  - Loading must preserve the live button's dimensions: keep the content in flow and place the loader over it with absolute positioning.
- `InputFrame` should own the visual shell for text-like controls.
- `Field` should own labels, descriptions, required markers, and inline status messages.
- `Dropdown` and `Listbox` should own menu positioning and accessible option-list behavior rather than page-local popover logic.
  - Use the default fixed positioning when the menu must stay attached during scroll.
  - Use the absolute positioning option only when a one-time local placement is acceptable and the menu should stay in the trigger's local layout context.
- The focus invariant must remain intact:
  - `Button` focus should use the shared visible focus ring.
  - `InputFrame` focus should come from `focus-within` tokens on the shell plus the real focusable input inside.
  - Listbox-like controls must preserve active, selected, and keyboard navigation states.
- Class overrides should be additive. Extend through props and `className` rather than forking primitives.
- For transparent gradient-border cards, keep wrapper and inner surface responsibilities separate: the wrapper owns the border effect, the card owns the fill.

## How To Use The Core Primitives
- Use `Text` for headings, labels, supporting copy, and muted text instead of raw typographic utility strings.
- Use `Button` for CTAs, icon buttons, loading actions, and button-styled links.
- Wrap text-like fields in `Field`, then place the real input inside `InputFrame`.
- Use `inputVariants(...)` on the actual input element so padding and disabled state stay aligned with the shell.
- Use `Dropdown` when you need a trigger and floating menu; use `Listbox` when the menu is fundamentally a list of options.
  - Prefer the default fixed strategy for filter menus and controls inside scrolling layouts.
- Use `Panel`, `Card`, `Section`, and `Divider` to preserve shared container spacing and surface rhythm.
  - Use `Panel` for non-semantic surfaces, generic grouped layout, and overlay roots.
  - Use `Card` only when its structured slots describe the content.
  - Use `CardHeader`, `CardContent`, and `CardFooter` under a real `Card` root; do not imitate Card data attributes on `Panel`.
  - Use semantic `accent` values from `accent.ts`; do not pass product-specific color strings into shared surfaces.
  - Use `Divider` instead of ad hoc border divs when separating content groups or labeling a horizontal break.
  - Labeled `Divider` rules must terminate at the label's padded box. Do not paint `bg-background` behind the label; the divider must remain neutral on Card, Panel, modal, and page surfaces.
- Use `Section.Background` when a section needs image, gradient, or node-based background media behind its normal content flow.
  - The background spans the full section, not the inner max-width container.
  - It is decorative by default; set `interactive` only when the background truly needs live controls.
- When building transparent bordered cards, keep the wrapper transparent, keep the card background explicit, and align wrapper and card radii.

## UX Conventions To Preserve
- Do not build raw password visibility buttons, select menus, or pseudo-fields from primitives if `ui/input/` already provides a finished control.
- Use component-owned `Button.Skeleton`, `Text.Skeleton`, `Field.Skeleton`, and `InputFrame.Skeleton` when their live counterpart is loading.
- Keep primitive skeleton imports server-safe. Split client behavior from shared types/skeleton exports when a primitive otherwise forces server consumers across a client boundary.
- If a component needs icon transitions, pair `Button` with `IconSwap` instead of custom animation wrappers.

## Avoid
- Raw `<button>`, `<label>`, or styled `<input>` markup in reusable UI when the primitive already exists.
- Duplicating dropdown layout classes instead of routing them through the shared styles.
- Hiding focus rings without the shared replacement tokens.
- Combining border, fill, and transparency responsibilities on one element when the wrapper-plus-card pattern is already established.
