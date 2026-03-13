# Folder: `src/components/ui/input/choice`

## Role
Shared building blocks for radio, checkbox, and toggle-style inputs.

## Use This Folder When
- The UI needs a labeled choice control with a visually hidden native input.
- You are extending radios, checkboxes, switches, or grouped option inputs.
- A higher-level input should reuse the same indicator and focus behavior.

## Prefer These Files
- `src/components/ui/input/choice/ChoiceField.tsx`: shared label, input, and change-handling wrapper.
- `src/components/ui/input/choice/ChoiceIndicators.tsx`: shared indicator visuals for radio, multi-select, and toggle styles.

## Invariants
- Keep the native input in the DOM. Do not replace it with a div plus ARIA unless there is no viable native pattern.
- `ChoiceField` should continue to own the label-to-input relationship and Enter-key activation support.
- The visible indicator should stay separate from the real input but remain tied to it through peer and group state.
- The focus invariant is especially important here:
  - Focus lands on the real hidden input.
  - The visible indicator shows focus through `focusRing.peerDefault` or `focusRing.peerError`.
  - Error tone should continue to affect the focus treatment where appropriate.
- Checkbox, radio, and toggle semantics should remain native and keyboard-friendly.

## How To Use It
- Use `ChoiceField` as the structural wrapper whenever you need a custom-looking radio, checkbox, or toggle.
- Use the existing indicator exports from `ChoiceIndicators.tsx` before drawing new checkmarks, radio dots, or switches.
- Build grouped controls in `RadioInput`, `MultiselectInput`, or `ToggleInput` rather than consuming `ChoiceField` ad hoc in page code unless the pattern is clearly library-worthy.

## Avoid
- Reimplementing labeled choice controls from scratch.
- Moving focus styles onto the label while leaving the actual input focus invisible.
- Breaking native Space behavior or removing Enter activation support.
