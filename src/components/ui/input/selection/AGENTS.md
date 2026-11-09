# Folder: `src/components/ui/input/selection`

This folder owns searchable, combobox and compact button-based selection
controls. Implementations import `InputSkeleton` and choice primitives directly,
never the public facade.

## Structure

- Combobox content, listbox, filtering, active-index, chip and controller modules
  are private: no public exports or catalogue identities.
- Searchable inputs compose the shared `Dropdown` and `Listbox` owners and keep
  their portal and active-option topology.
- Checkbox-style option marks reuse the choice subsystem.
- `ComboboxMultiSelectInput` owns the selected rail and query layout; callers do
  not supply replacement token layouts.
- `ButtonMultiSelectInput` expresses selection through shared Button variants,
  without choice indicators or visual overrides.
