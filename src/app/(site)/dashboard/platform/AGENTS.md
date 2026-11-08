# Dashboard platform-management policy

`/dashboard/platform` (Platform, Inbox, Reports and their details) is an internal branch of the shared dashboard shell, not a separate shell and not an organization-admin surface.

- Read `specs/platform/services/identity/spec.md` when changing platform access; verification is `docs/testing/identity.md`.
- Authorization uses `AuthUser.platformRole`, resolved server-side through `../_lib/platform/access.server.ts`; fixtures live in `../_lib/platform/`.
- Routes stay in the canonical dashboard surface registry (`../_registry/surfaceRegistry.ts`); no second platform route model.
- Reuse dashboard-owned tables, details, Member/Organization presentation, Cards, inputs, Chips, loading states and feedback primitives.
