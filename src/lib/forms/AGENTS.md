# Folder: `src/lib/forms`

## Role
Typed form-guard helpers and submission rules for reusable example and app forms.

## Use This Folder When
- A route handler needs honeypot, cooldown-cookie, or file-policy enforcement.
- An internal demo or reference form should model the same server-side rules as production forms.
- Multiple forms need the same anti-spam contract without importing UI.

## Preferred Starting Points
- `src/lib/forms/guard.ts`: shared honeypot, cooldown, and file-policy helpers.

## Invariants
- Guard helpers stay UI-agnostic and safe for route handlers.
- Honeypot hits should resolve as normal success responses and stop further work.
- Cooldown behavior should be expressed through typed cookie helpers.
- File-policy validation belongs on the server even when the client hints accepted types.

## Avoid
- Repeating guard logic inline inside individual routes.
- Treating demo forms as exempt from the same server-side checks.
