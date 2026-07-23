# Folder: `src/components/ui/input/color`

## Role

Color value entry and semantic swatch selection.

## Public Surface

- External consumers import `ColorInput`, `ColorSwatchInput`, and public color types from `@/components/ui/input`.
- `ColorPickerPanel` remains an implementation detail shared directly inside this folder.

## Invariants

- Preserve controlled and uncontrolled color contracts, native form output, keyboard operation, and portal-aware positioning.
- Keep generic semantic presets product-neutral.
