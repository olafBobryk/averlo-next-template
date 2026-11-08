# Folder: `src/components/ui/input/color`

This full-start-only folder owns free color entry and semantic swatch selection.

## Structure

- `ColorPickerPanel` is a private owner shared within this folder; no catalogue
  identity or public barrel export.
- Both inputs compose the shared `Field`, `InputFrame` and `Dropdown.Panel`
  topology instead of a second overlay system.
- `ColorSwatchInput` keeps semantic `value` and `customColorHex` as independent
  controlled/uncontrolled channels.
- Semantic presets stay product-neutral.
