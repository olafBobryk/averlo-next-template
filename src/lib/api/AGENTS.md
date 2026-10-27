# Folder: `src/lib/api`

## Role

Reusable API transport and endpoint wrappers. This folder owns fetch clients,
typed errors, endpoint helpers, and API-facing demo/test plumbing.

## Contract ownership

Observable transport outcomes are owned by
`openspec/specs/app/shared/services/transport/api-transport/spec.md`. Use
`docs/testing/api-transport.md` for focused executable checks. Delivery-enabled
submission behavior, when that capability is installed, is separately owned by
`openspec/specs/app/shared/services/delivery/contact-delivery/spec.md`; the fixture contact/support
endpoints do not install delivery.

## Invariants

- Endpoint wrappers should be thin and typed.
- Shared request behavior belongs in the client factory, not repeated in each endpoint file.
- Mocks should work with the same endpoint wrappers instead of creating separate demo-only call paths.
- API utilities should not import UI components or trigger UI side effects directly.

- Centralize base URL, headers, response parsing, error shaping, cancellation and
  shared retry/auth behavior in the selected client; do not duplicate them in
  endpoint wrappers. Do not scatter raw fetch where a wrapper already owns the
  endpoint contract.
- Keep the fetcher/client replaceable. Browser defaults must be explicit; inject
  project environment and service assumptions into generic helpers. Tests and
  demos exercise actual application wrappers through the same transport seam.
- Return typed data or typed transport failures. The caller owns notifications,
  navigation, visual state and recovery; transport must not import UI owners.
- Keep privileged headers, provider clients, credentials and recipient lists
  behind server-only boundaries. Public client exports are small and deliberate;
  expose a facade wrapper only for intended cross-owner reuse.

## Conditional delivery boundary

- Contact, enquiry, lead, booking and callback delivery, when explicitly enabled,
  belongs to a server submission owner using existing API/input/feedback owners.
  Do not create parallel contact-only clients or UI primitives.
- Normalize and validate fields and run applicable shared guards before effects.
  Normalize configured recipients separately from recipient-independent message
  construction: trim/deduplicate addresses, identify the enquiry source and
  contact/message details, and retain the supported reply path.
- Credentials and recipient selection are server configuration. Missing delivery
  configuration must return unavailability; provider errors must remain generic
  and recoverable. Never log or return personal submission content, addresses,
  recipients, secrets, or provider responses containing personal data.
- Follow `docs/testing/forms.md` for shared guard checks. When delivery is
  explicitly installed, follow `docs/testing/contact-delivery.md` for
  interception-first verification and the separate operational gates for provisioning, recipient setup, inbox
  confirmation, deployment configuration and intentional sends. No such external
  operation is authorized by an implementation or verification task alone.
