# Folder: `src/components/ui/helpers`

## Role
Small reusable helpers that standardize repeated interaction details.

## Use This Folder When
- The UI needs a stateful icon transition.
- A higher-level component already depends on a helper here and the same pattern should be reused.
- Multiple components need consistent copy-to-clipboard behavior.

## Prefer These Files
- `src/components/ui/helpers/IconSwap.tsx`: shared icon transition helper for toggled or stateful icons.
- `src/components/ui/helpers/useCopyAction.tsx`: shared copy-to-clipboard behavior + icon swap.

## Invariants
- Use `IconSwap` whenever a control flips between icons based on state, such as show or hide password, plus or minus, copy feedback, or similar toggles.
- Keep the accessible name on the parent button or control. `IconSwap` is visual, not the accessibility label.
- Focus visibility belongs to the surrounding interactive element, not the icon animation wrapper.
- Avoid one-off opacity, rotation, or scale stacks when `IconSwap` already solves the transition.

## How To Use It
- Use `items` plus `activeIndex` to map component state to icon state.
- Use per-item active or inactive classes when the transition needs rotation or scaling.
- Pair `IconSwap` with `Button` or another real control that already has focus and keyboard semantics.
- Use `useCopyAction` when multiple controls need copy behavior plus the same copied feedback icon.

## Avoid
- Making icon-only state changes without an accessible label on the parent control.
- Copying icon transition code into multiple components.
