# Folder: `src/lib/forms`

## Role

Typed, UI-agnostic form-guard helpers for route handlers and example forms.

## Contract ownership

Server protection behavior is owned by
`openspec/specs/app/shared/services/delivery/submission-protection/spec.md`. Complete client form
behavior stays with `openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md`. Use
`docs/testing/forms.md` for protection checks and rendered form verification.
When an explicit delivery feature is installed, additionally read its
`docs/testing/contact-delivery.md` procedure.

## Invariants

- Guard helpers stay UI-agnostic and safe for route handlers.
- Honeypot hits should resolve as normal success responses and stop further work.
- Cooldown behavior should be expressed through typed cookie helpers.
- File-policy validation belongs on the server even when the client hints accepted types.

- Apply guards to public/external submissions (contact, enquiry, lead, booking,
  newsletter, callback, unauthenticated upload or another exposed endpoint). An
  ordinary authenticated dashboard edit gains no blanket abuse policy; internal
  forms require an explicit task, threat model or existing-owner requirement.
- Reuse `guard.ts` and the shared `SpamProtectionFields` input owner rather than
  recreating honeypot fields, cookie encoding, cooldown state or file policy in
  routes. Execute guards before provider, storage or persistence work. A detected
  honeypot must reveal neither detection nor downstream effects.
- Disabled buttons, delays, hidden fields and browser `accept` hints are client
  conveniences, never server authorization or security enforcement.
- `validateFiles` checks declared extension/MIME, count and byte limits. The
  consuming server owner must additionally authorize files, inspect required
  content and normalize accepted data where applicable; this helper does not
  inspect file signatures or grant resource access.
- Keep diagnostics free of submitted content, addresses, recipient details,
  credentials and personal provider-response data.
- Reuse established cooldown/rate-limit policy. Before selecting, provisioning
  or tuning a configurable provider limit, find repository policy. If absent and
  the threshold affects user throttling, cost or service limits, obtain an explicit
  user decision; never invent a value. Provider limits complement server guards.
  Preserve support's existing thirty-second cooldown; contact adds no threshold.

- When changing honeypot presentation, read
  `src/components/ui/input/text/AGENTS.md`,
  `src/components/ui/input/text/SpamProtectionFields.catalog.tsx` and its Storybook contract before the
  implementation. These remain the input API/teaching owners.
