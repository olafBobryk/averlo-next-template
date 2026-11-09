# Contact-delivery workflow

Builds, configures, tests and ships an Averlo-managed contact, enquiry, lead,
booking or callback form in an independent Next.js project on Vercel with
Resend. Runs in the project, only when Olaf explicitly asks; template fixture
forms stay no-delivery. Behaviour is owned by
[`specs/platform/services/delivery`](../../../specs/platform/services/delivery/spec.md)
(FR-001 to FR-017) and `specs/platform/data/forms`; this is the procedure.
Helpers are `npx --yes create-averlo contact audit|provision|sync`
(create-averlo 0.2 or newer). Steps: [workflow.yml](workflow.yml).

1. **Recipient.** Establish the client's enquiry address from configuration or
   Olaf. If it cannot be found, stop and ask exactly:
   `What email address should receive website enquiries?`
2. **Audit.** Read the project's `AGENTS.md`, `PRODUCT.md`, `specs/README.md`
   and the owner specs above, then run
   `npx --yes create-averlo contact audit --repo <project>` (read-only JSON:
   candidate files and non-secret `.env.local` metadata). Treat it as
   orientation and inspect the actual form, route, config and deployment.
3. **Implement** the form and server route to the specs with existing
   components: inline validation, visible focus, a double-submit guard and
   accessible status on the client; normalization, sender, `replyTo`, copy,
   `503` and private logging on the server (FR-013 to FR-015).
4. **Provision** a per-project key only when needed. Before the full-access
   management credential is first created, ask Olaf for explicit confirmation.
   Then `npx --yes create-averlo contact provision --repo <project> --project <vercel-project>`
   creates a domain-restricted `sending_access` key and writes it to `.env.local`.
5. **Mocked browser test.** Intercept or mock the POST and verify validation,
   focus, loading, failure preservation and success without sending.
6. **Local real send** through the actual form in a browser session, with
   local recipients exactly `bobryk.olaf@gmail.com`. Check the HTTP/UI result,
   then confirm the received copy in Gmail. Without Gmail, claim only that
   Resend accepted the send.
7. **Deploy** only when Olaf explicitly authorises publishing (`$production-ship`).
8. **Sync Production** with
   `npx --yes create-averlo contact sync --repo <project> --client-email <email>`:
   the key and the client plus `bobryk.olaf@gmail.com` recipients, Production
   only. Never add sending credentials to Preview or Development.
9. **One production send** through the live form. Confirm the Bobryk copy and
   the visible To list in Gmail, then report exactly:
   `We sent a website-enquiry test to {clientEmail}. Could you confirm it arrived?`

## Credential policy

### Separation

- Management credential: `~/.codex/secrets/averlo-contact-form/resend-management.token`,
  full access, mode `600`, owner-only. Use only for Resend key/domain
  administration (list domains; create, list and revoke keys). Ask for
  confirmation immediately before creating it.
- Project credential: domain-restricted `sending_access` key for verified
  `averlo.co`. Store in the project's ignored, mode-`600` `.env.local` as
  `RESEND_API_KEY`.
- Never put the management credential in a repository or upload it to Vercel.
  Never use it to send an email.

### Repository values

Maintain these keys without overwriting unrelated `.env.local` values:

- `RESEND_API_KEY`
- `AVERLO_RESEND_API_KEY_ID`
- `AVERLO_CONTACT_CLIENT_EMAIL` when known
- `CONTACT_FORM_RECIPIENTS`

Local recipients must be exactly `bobryk.olaf@gmail.com`. Vercel Production
recipients must be the validated client email plus Bobryk, trimmed and
deduplicated. Never infer a client address from a submitter or silently remove
the Bobryk copy.

Ensure `.env.local` is ignored before writing. Refuse symlinks and non-regular
files. Write atomically with owner-only permissions. Never print, quote,
summarize, commit or emit secret values, or pass them in command arguments.

### Rotation

Create a new child key, deploy it, verify an actual form send, and only then
revoke the old key. Resend reveals a key value only once; an ID alone cannot
recover it.

Use stdin for `vercel env` values. Do not place values in argv, logs,
screenshots, commits, Preview or Development.

## Safety

- Preserve existing user changes; never use a client production site as a
  regression fixture.
- Each operational step (provisioning, recipient setup, inbox confirmation,
  deployment, an intentional send) is a separate gate (spec FR-009).
