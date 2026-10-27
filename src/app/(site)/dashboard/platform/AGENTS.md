# Dashboard platform-management policy

- Observable access behavior is owned by
  `openspec/specs/app/shared/services/identity/access-and-membership/spec.md`; use
  `docs/testing/identity.md` for authorization and fixture verification.

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
- Check authorization again at execution time for every mutation; hiding a
  platform navigation item grants no permission. Follow supported sign-in or
  denial routing on unauthorized/forbidden outcomes rather than leaving blank
  or permanently loading content.
