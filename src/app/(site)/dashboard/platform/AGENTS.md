# Dashboard platform-management policy

- `/dashboard/platform` is an internal branch of the shared dashboard shell,
  not a separate shell and not an organization-admin surface.
- Authorize every route and mutation with `AuthUser.platformRole`. Organization
  owner or administrator membership never grants platform access.
- Keep Platform, Inbox, Reports, and their detail routes in the canonical
  dashboard surface registry. Do not create a second platform route model.
- Reuse dashboard-owned tables, details, Member/Organization presentation,
  Cards, inputs, Chips, loading states, and feedback primitives.
- Fixture operations are resettable, server-memory demonstrations. Do not send
  email, upload attachments, or add external persistence without an explicit
  instance-level decision.
