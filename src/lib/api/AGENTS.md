# Folder: `src/lib/api`

## Role

Reusable API transport and endpoint wrappers: fetch clients, typed errors,
endpoint helpers and API-facing demo/test plumbing.

## Read

- `specs/platform/services/transport/spec.md` when changing request outcomes;
  verify with `docs/testing/api-transport.md`.
- `specs/platform/services/delivery/spec.md` only when a delivery-enabled
  submission is installed (the fixture contact/support endpoints install no
  delivery); verify with `docs/testing/contact-delivery.md`.

## Structure

- `createApiClient.ts` is the client factory: base URL, headers, parsing,
  error shaping, cancellation and shared retry/auth live there, not in endpoint
  wrappers. Endpoint wrappers stay thin and typed.
- `createMockFetch.ts` mocks behind the same wrappers; there are no demo-only
  call paths.
- This folder imports no UI components and triggers no UI side effects.
- Privileged headers, provider clients, credentials and recipient lists stay
  behind server-only modules. `index.ts` is the small deliberate public facade.
- Delivery (contact, enquiry, lead, booking, callback), when enabled, lives in a
  server submission owner that reuses these clients and the existing input and
  feedback owners; no parallel contact-only client or UI primitive.
