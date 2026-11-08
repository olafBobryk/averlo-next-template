# Folder: `src/components/ui/input/date`

This folder owns the canonical single-date and date-range system.
`DateRangeInput` is full-start-only; `DateInput` and the shared calendar core are
available to thin start.

## Structure

- Both public inputs compose one private `CalendarPopover` and shared date
  utilities. `CalendarPopover` owns calendar state and interaction; no second
  calendar, overlay or manual text-field topology.
- `Field` and `InputFrame` stay mounted as the field shell.
- `Dropdown.Panel` is only the anchored shell; its content is one compact `Card`
  with `Card.Header`, `Card.Content` and a single wrapping `Card.Footer` in single
  and range modes.
- Month and year controls are separate shared `Dropdown.Listbox` owners.
- Range draft state stays internal until a complete range is committed.
