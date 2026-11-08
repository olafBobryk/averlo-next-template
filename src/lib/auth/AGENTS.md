# Authentication and organization policy

Provider-neutral auth, organization, invitation, identity and private-file
adapters plus their selected server composition.

## Read

- `specs/platform/services/identity/spec.md` when changing sessions,
  organizations, invitations, continuations or identities.
- `specs/platform/services/files/spec.md` when changing private files.
- Verification: `docs/testing/identity.md`.

## Structure

- `contracts.ts` defines `AuthAdapter`, `OrganizationAdapter`,
  `InvitationAdapter` and `IdentityAdapter`; `server.ts` composes the selected
  adapter. Provider SDKs and records stay behind these adapters and never reach
  dashboard or auth-page components.
- `continuation.ts` owns `getSafeContinuationPath`; optional adapter methods are
  gated by `assertAuthMethodAvailable`.
- The fixture implementation lives under `fixture/`. `fixture-adapter.ts` and
  verification scripts import its `fixture/index.ts` surface; modules inside the
  family import their direct owners and never self-import through that index.
- `private-files.ts` owns `PrivateFileAdapter` and its provider state; storage
  records resolve server-side before the frontend contract. No storage provider
  is installed (`configured: false`). `src/lib/files` browser preview helpers are
  not private-file storage.
