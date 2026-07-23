# Folder: `src/components/ui/input/numeric`

## Role

Typed, unit-bound, and range-style numeric controls.

## Public Surface

- External consumers import `NumberInput`, `UnitNumberInput`, and `SliderInput` from `@/components/ui/input`.
- Components inside this family import their owning siblings directly.

## Invariants

- Preserve native number and range semantics, validation, focus treatment, and shared `Field` plus `InputFrame` geometry.
- Keep unit presentation separate from numeric value ownership.
