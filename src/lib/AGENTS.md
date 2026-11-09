# Folder: `src/lib`

## Role

Shared non-UI application utilities. Keep reusable project foundations
independent from React components.

## Structure

- Network and transport code lives here (`api/`), never in `src/components`.
- `src/lib` returns data or throws typed errors; UI feedback rendering belongs
  in `src/app` or `src/components`.
- Keep factories dependency-injectable: demos and tests swap the client or
  fetcher instead of duplicating endpoint logic.
