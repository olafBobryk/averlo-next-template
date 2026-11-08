# Folder: `src/components/ui/input/choice`

This folder owns the native choice composition layer and complete grouped radio,
checkbox and toggle fields.

## Read

- `specs/platform/design-system/families/inputs/spec.md` for indicator geometry
  and selection-state rules.

## Structure

- Family implementations import `ChoiceField` and `ChoiceIndicators` directly.
- There is no separate `CheckboxInput`; `MultiselectInput` owns checkbox-style
  grouped input.
- The native input stays in the DOM; the visible indicator is a sibling driven by
  peer/group state and consumes shared peer focus tokens.
- Full-start checkbox artwork renders through the shared `Icon` registry; thin
  start keeps its local fallback because it does not select the icon subsystem.
