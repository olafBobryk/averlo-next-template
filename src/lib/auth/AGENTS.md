# Authentication and organization policy

## Contract ownership

- Observable access behavior is owned by
  `openspec/specs/app/shared/services/identity/access-and-membership/spec.md`; private-file behavior
  by `openspec/specs/app/shared/services/files/private-file-access/spec.md`. Read the applicable
  contract and `docs/testing/identity.md` when changing these boundaries.
- This directory owns provider-neutral `AuthAdapter`, `OrganizationAdapter`,
  `InvitationAdapter`, and `IdentityAdapter` contracts and selected server
  composition. Keep provider records and SDK types behind those adapters.

## Server and fixture structure

- Keep application routes and presentation provider-neutral. Provider SDKs
  belong behind adapters in this directory and must not leak into dashboard or
  auth-page components.
- Resolve the session and active organization on the server for every dashboard
  request. A selected organization is valid only while an active membership
  exists. Enforce authorization at both server-page and mutation boundaries;
  navigation visibility is only presentation. Keep global identity, organization
  role, and `platformRole` as distinct access axes.
- Use `getSafeContinuationPath` for every user-controlled continuation. Never
  redirect directly from `next`, callback, invitation, or provider values.
- Optional adapter methods are unavailable by default. Call
  `assertAuthMethodAvailable` before executing a provider-specific flow.
- Invitation GET pages are review-only. Membership creation must happen through
  an explicit POST or server action after recipient, token, organization,
  expiry, revocation, and reuse checks.
- Never remove the final verified identity that can authenticate an account.
- The fixture adapter is non-durable and stores opaque sessions in server
  memory. It is a reference implementation, not the recommended production
  persistence model.
- The fixture implementation is organized under `fixture/`. The adapter and
  verification scripts import its explicit `fixture/index.ts` surface; modules
  inside the family import their direct owners and must not self-import through
  that index.
- Private files require organization authorization, validated metadata, opaque
  storage keys, short signed-access lifetimes, replacement cleanup, and explicit
  deletion. No storage provider is installed by default.

## Private-file integration

- `private-files.ts` owns `PrivateFileAdapter`, its provider state and policy.
  Resolve storage records before the frontend contract. Keep provider credentials
  server-only and authorize metadata as well as content at every upload, read,
  replace and delete boundary. Client references never authorize access.
- Keep replacement cleanup and explicit deletion with the configured adapter;
  never silently select or provision storage. This template installs no provider:
  `configured: false` is an intentional unavailable state, not a working upload
  or signed-download implementation. Enable one only through an explicit
  instance-level decision, then run the conditional lifecycle checks in
  `docs/testing/identity.md`. Browser preview helpers in `src/lib/files` do not
  constitute private-file storage or authorization.
