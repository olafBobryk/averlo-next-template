# Folder: `src/components/ui/time`

## Role
Shared presentation helpers for dates, relative time, and timezone-aware display.

## Use This Folder When
- A page needs a formatted date label.
- A feature needs relative time such as "2 hours ago".
- You want date display to remain consistent across the app.

## Prefer These Files
- `src/components/ui/time/DateAgo.tsx`: relative-time display.
- `src/components/ui/time/DateIndicator.tsx`: formatted date display with timezone awareness.

## Invariants
- Prefer these shared components over page-local date formatting where the UX should feel consistent.
- Date display should remain centralized so timezone handling and typography stay predictable.
- Time display components should continue to use `Text` rather than custom typographic markup.
- If a time display becomes interactive, it must preserve visible focus through the surrounding control.

## How To Use It
- Use `DateAgo` for feeds, activity history, and recent updates.
- Use `DateIndicator` for explicit timestamps, schedule metadata, and more formal date presentation.

## Avoid
- Mixing multiple date string formats across the UI without a product reason.
- Rewriting timezone logic in page code when the shared component already covers the need.
