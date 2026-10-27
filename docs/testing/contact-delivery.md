# Contact delivery and protection verification

## Run no-delivery checks

```sh
npx tsx --test src/lib/forms/guard.test.ts
npx biome check src/lib/forms/guard.ts src/lib/forms/guard.test.ts
if [ -f src/lib/forms/contact.test.ts ]; then
  npx tsx --test src/lib/forms/contact.test.ts
  npx biome check src/lib/forms/contact.test.ts
fi
```

Then run [form verification](forms.md#run-form-verification) against the Preview
workflow's verified automation URL. The browser runner uses synthetic fixture data
and isolated contexts. It intercepts delayed/failed submissions before the
browser submits, then retries genuine fixture endpoints. It checks validation,
keyboard/focus, immediate duplicate prevention, visible pending state, failure
preservation, retry and accessible results. Login/support run only in dashboard
profiles and contact only in marketing profiles.

Behavioral authority is [submission protection](../../openspec/specs/app/shared/services/delivery/submission-protection/spec.md),
[explicitly enabled contact delivery](../../openspec/specs/app/shared/services/delivery/contact-delivery/spec.md)
and the existing [form contract](../../openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md).
Structural owners are [forms](../../src/lib/forms/AGENTS.md),
[API](../../src/lib/api/AGENTS.md) and the existing input owners. Reuse existing
inputs, transport, toast, modal and feedback owners; do not create contact-only
substitutes.

## Current fixture boundary

`/api/contact` is a server-owned public demo. It validates email/message and
returns an explicit nothing-sent-or-stored result. `/api/support` authorizes an
organization and creates a resettable server-memory inbox fixture request with
its established cooldown; it sends no email. A fixture success is never evidence
of delivery. The marketing-profile `contact.test.ts` imports the real contact POST handler, asserts direct
invalid payload rejection and a neutral honeypot response, and observes zero
fetch calls or console-log calls. The browser runner also exercises genuine
valid submissions, malformed/invalid payloads, support authorization and cooldown.

No contact delivery adapter or delivery-enabled endpoint is installed here.
Provider success/failure, recipient deduplication, missing delivery configuration
and real inbox confirmation are therefore inapplicable runtime cases, not passing
tests. Do not add a provider or reinterpret demo success as a missing-config
fallback to manufacture coverage.

## Protection verification

Use the shared [submission-protection procedure](forms.md#submission-protection).
It covers server guard execution, cooldown cookies, applicable file policy,
authorization, diagnostic privacy and explicit provider-limit decisions.

## Conditional delivery verification

Only after delivery is explicitly enabled, test its actual server owner using an
injected provider with controlled success, rejection and missing-config outcomes.
Normalize/validate all fields server-side independently of client hints and prove
applicable guards run before send work. Trim and deduplicate recipients outside
the reusable recipient-independent professional message builder. Assert the source,
contact/message details and supported reply-to path survive normalization without
recipient-specific assumptions; application recipients remain server configuration.

Missing required configuration must produce unavailability; provider rejection must
return generic recoverable failure and never claim delivery. Assert no message
contents, email addresses, recipient lists, credentials, secrets or provider
responses containing personal data are logged or returned. Keep credentials and
privileged clients server-only. Verify client validation/focus, duplicate start,
pending/results, failure preservation and success ownership with interception
installed before any submit. Use focused transport/form/type/build checks; record
provider acceptance separately from confirmed inbox delivery.

## Provisioning and intentional-send gates

Implementation verification authorizes no external provisioning, recipient setup,
credential changes, deployment or real sends. Those operations belong to the
separately selected installed Averlo Contact Form operational skill and its current
credential policy. Do not read credential-policy files or provisioning scripts
unless that operational workflow is explicitly selected. Consult its form-UX
reference only if repository-local UI ownership is incomplete.

Preserve its gates: establish the intended recipient explicitly; use the approved
server sender/reply-to and professional message policy; create only project-scoped
sending access with the required domain restriction; keep any full-access
management credential with its global owner and obtain its immediate approval
before creation. Never put management credentials in a repo or deployment. Use an
ignored owner-only local secret file for required sending credentials and never
print, quote, log, commit or place them in command arguments.

Intercept browser delivery first. An intentional local send uses only the
operational workflow's designated test recipient and verifies the HTTP/UI result
and inbox separately. Production recipient configuration preserves the approved
client recipient and required Bobryk copy; production sends require the workflow's
explicit client-confirmation gate. Deployment requires a separately authorized
publication workflow, and sending credentials must not be installed in Preview or
Development deployment environments. Do not use a real client site as a regression
fixture or claim inbox delivery from a provider-accepted response alone.
