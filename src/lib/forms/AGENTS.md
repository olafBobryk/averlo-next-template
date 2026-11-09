# Folder: `src/lib/forms`

## Role

Typed, UI-agnostic form-guard helpers for route handlers and example forms.

## Read

- `specs/platform/services/delivery/spec.md` when changing server submission
  protection; `specs/platform/data/forms/spec.md` for client form behaviour.
- Verification: `docs/testing/forms.md`, plus `docs/testing/contact-delivery.md`
  when delivery is installed.

## Structure

- `guard.ts` owns honeypot, typed cooldown cookies and `validateFiles`; routes
  reuse it instead of recreating fields, cookie encoding or file policy. Guards
  are safe for route handlers and run server-side.
- The honeypot UI owner is `src/components/ui/input/text/SpamProtectionFields.tsx`
  (see `src/components/ui/input/text/AGENTS.md` and its catalog/story).
