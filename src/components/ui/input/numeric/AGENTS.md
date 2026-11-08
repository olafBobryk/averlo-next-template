# Folder: `src/components/ui/input/numeric`

This folder owns typed, fixed-unit and range-style numeric controls. Family
implementations import their owning siblings directly.

## Structure

- Real number and range inputs keep `Field` plus `InputFrame` topology.
- Unit presentation stays separate from numeric value ownership.
- `SliderInput` keeps its range control, progress track, numeric field and unit
  inside one `InputFrame`; the visible custom track never replaces the native
  range input.
