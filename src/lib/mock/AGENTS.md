# Folder: `src/lib/mock`

## Role
High-level fake data helpers for demos, local development, and lightweight testing.

## Use This Folder When
- You need a simple fake fetcher or async stub for component demos.
- You want mock data behavior without rewriting endpoint wrapper logic.
- You need a convenience helper built on top of lower-level API mocks.

## Preferred Starting Points
- `src/lib/mock/createFakeFetcher.ts`: convenience async fake fetcher backed by `createMockFetch`.

## Invariants
- High-level fake helpers should build on the lower-level API mock layer where possible.
- Keep fake helpers deterministic enough to be useful in demos while still allowing configurable failure rates and delays.
- Mock helpers should return data or throw errors, not show UI feedback directly.

## Avoid
- Re-implementing mock response timing and failure logic in multiple files.
- Building fake helpers that drift from the underlying transport contract.
