# Folder: `src/lib/feedback`

## Role
Shared non-visual feedback event helpers used by UI hosts.

## Use This Folder When
- You need to dispatch or manage toast-style feedback events.
- You are adding shared feedback utilities that UI hosts listen to.

## Preferred Starting Points
- `src/lib/feedback/toast.ts`: toast event contract and public helpers.

## Invariants
- Feedback helpers should stay UI-agnostic and event-based.
- Toast dispatch belongs here; rendering belongs in the component layer.
- Shared feedback contracts must stay stable because multiple components consume them.

## Avoid
- Importing UI components into feedback helpers.
- Duplicating toast event names or payload shapes outside the shared helper.
