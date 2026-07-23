# Folder: `src/components/ui/input/selection`

## Role

Searchable, combobox, and compact button-based selection controls.

## Public Surface

- External consumers import selection components and public option types from `@/components/ui/input`.
- Family implementations import `InputSkeleton` and choice primitives directly instead of importing the public barrel.

## Invariants

- Preserve `Dropdown`, `Listbox`, portal, keyboard-navigation, active-option, and selection semantics.
- Use the choice subsystem for checkbox-style indicators instead of duplicating them here.
