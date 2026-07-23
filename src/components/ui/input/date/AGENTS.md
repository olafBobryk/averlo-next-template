# Folder: `src/components/ui/input/date`

## Role

Canonical single-date and date-range input system. Both public inputs must compose the same calendar popover and UTC date utilities rather than implementing independent calendars.

## Public Surface

- Import `DateInput`, `DateRangeInput`, and their public types from `@/components/ui/input/date`.
- `DateInput` is shared by full-start and thin-start.
- `DateRangeInput` remains full-start-only.
- Both inputs expose closed loading geometry through `Component.Skeleton`.

## Invariants

- Values use validated `YYYY-MM-DD` strings and UTC arithmetic so display and form output do not shift across time zones.
- An omitted value is empty. Do not silently select today or a default range.
- `CalendarPopover` owns month navigation, the date grid, draft-range preview, Today/Clear utilities, focus restoration, keyboard navigation, and outside dismissal for both inputs.
- The anchored `Dropdown.Panel` is only the overlay shell. Its visible content is one compact `Card` composed through `Card.Header`, `Card.Content`, and a wrapping `Card.Footer` shared by single and range modes.
- The calendar header uses separate shared `Dropdown.Listbox` controls for month and year. Their triggers are caret-free ghost `Button` controls at `size="sm"`; do not restore a bespoke combined heading or calendar icon.
- Keep every calendar footer action in that one `flex-row flex-wrap` footer. Range presets are direct footer actions beside Today and Clear rather than a second stacked action section.
- Range presets are optional target extensions below the shared source-native calendar. Do not restore manual text range fields or the old Listbox-based preset menu.
- Preserve `Field`, `InputFrame`, and `Dropdown.Panel` ownership. Do not create a second field shell or overlay system.
- Keep min/max dates disabled and never emit invalid or impossible dates.
- The first range endpoint is a draft. Commit only after the second endpoint, a preset, Today, or Clear.

## Skeletons

- Use `DateInput.Skeleton` and `DateRangeInput.Skeleton` at call sites.
- Closed date inputs delegate to `InputSkeleton`; an open calendar is interactive chrome and does not need a loading placeholder.
