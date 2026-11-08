# Folder: `src/components/ui/time`

Shared relative-time and timezone-aware calendar-date presentation.

## Structure

- Time presentation depends on the `Text` primitive for typography and must not
  depend on feature or route code.
- `DateAgo` is a client component because it schedules relative-time refreshes;
  it clears its interval on unmount.
- `DateIndicator` stays server-safe and resolves formatting through the shared
  application timezone boundary.
- Date parsing, relative-time thresholds, ordinal formatting and timezone
  resolution stay centralized in these owners.
- Skeleton members delegate to `Text.Skeleton`; they are not separate component
  identities.
