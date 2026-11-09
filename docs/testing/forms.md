# Form verification

## Run form verification

Use the Preview workflow to start or recover `npm run dev` in this checkout.
Verify its printed loopback URL, then run:

```sh
npm run verify:forms -- --base-url 'http://localhost:PORT?motion=off&reveal=off'
```

Replace the example with the wrapper's actual automation URL. The verifier does
not start or stop a server. It rejects non-loopback URLs, requires a healthy app,
and fails for unavailable installed forms. It runs Chromium at 1280 × 900 and
390 × 844 using new browser contexts and synthetic fixture data. If Chromium is
not installed, install this project's browser with `npx playwright install chromium`.

Results are written to ignored `test-results/forms/results.json`; failed cases
also save a screenshot there. The runner's exit code is nonzero for any failure.
It submits fixture-only support requests and never sends email. Do not point it
at real customer data or replace its fixture accounts with production identities.

## Contract and coverage

[form-behavior](../../specs/platform/data/forms/spec.md) is the behavioral
authority. Tests exercise complete forms rather than every input separately.
The checks below target the currently installed examples. Their contact/support
no-delivery results remain intentional demo behavior; the reusable app contract
permits an explicitly specified production outcome through its real authorized
boundary. Template demonstration and inheritance obligations have separate
template owners and are not imposed on independent apps by the form contract.

| Contract | Executable evidence |
| --- | --- |
| Accessible field errors, required labels, keyboard submission, narrow layout | Shared lifecycle assertions run on each installed form in both viewports |
| Immediate duplicate guard, delayed pending, retained label | Two submit events in one browser turn plus another while the request is held |
| Operational failure, one error, preserved values, retry | Intercept one request as failed, then retry against the actual server |
| Login rejection and password clearing | Rejected server action using invalid fixture credentials |
| Safe navigation and organization selection | Real server-action sign-in in isolated cookie jars |
| Server validation and support authorization | Direct invalid, anonymous and foreign-membership requests |
| Public demo guard and disclosure | Invalid payload, malformed body, honeypot short circuit and explicit no-delivery result |
| Form-specific success | Login navigates; support clears; contact retains values |

The endpoint cases and successful browser submissions are real requests.
Interception is limited to deterministic browser failure and pending scenarios.
A spec that reads correctly does not establish runtime behavior; only these checks do.

## Changing the contract

Change form behaviour by amending `specs/platform/data/forms/spec.md` through the
[write-spec workflow](../../.specify/workflows/write-spec/README.md) (a new
Clarifications session plus tasks), then rerun this procedure.

## Independent projects

Assembly copies the platform specs, `.specify/` and this procedure. Dashboard
profiles receive login/support test modules; marketing profiles receive contact.
The common runner checks the forms installed in the current project's source
tree. An installed form missing its test module is an error, not a skipped test.
New projects own these copies and amend them through their own write-spec runs.

## Submission protection

The behavioral authority is
[submission protection](../../specs/platform/services/delivery/spec.md);
[forms ownership](../../src/lib/forms/AGENTS.md) keeps helper structure. Run the
installed guard tests without a server:

```sh
npx tsx --test src/lib/forms/guard.test.ts
npx biome check src/lib/forms/guard.ts src/lib/forms/guard.test.ts
if [ -f src/lib/forms/contact.test.ts ]; then
  npx tsx --test src/lib/forms/contact.test.ts
  npx biome check src/lib/forms/contact.test.ts
fi
```

Use the managed Preview and form command above for installed rendered forms and
real server submissions. For an explicitly installed delivery feature, also read
`docs/testing/contact-delivery.md`; fixture forms continue to send no email.

Apply the protection contract to contact, enquiry, lead, booking, newsletter,
callback, unauthenticated upload and other public/external or explicitly
abuse-sensitive boundaries. Ordinary authenticated dashboard edits need no
blanket guard; an internal form needs an explicit task, threat model or owner
requirement. Test guards before provider, storage or persistence effects. A
honeypot must terminate with its normal neutral outward result, reveal no
detection and perform no downstream work.

The focused guard tests prove honeypot precedence, typed string/object cookie
reading, cookie flags and configured cooldown, plus server count, individual byte,
total byte, extension and MIME file checks. Support retains its existing thirty-
second policy and contact adds no threshold. Form browser tests verify direct
invalid server submissions and foreign organization rejection. Client disabled
state, delays, hidden fields and `accept` hints never replace those checks.

No attachment submission/storage boundary is installed on these forms. The helper
tests cannot prove file-content inspection or resource authorization: when an
attachment owner is installed, test direct requests for authorization, type, size,
required content inspection and normalization on the actual server before effects.
For a configured private storage lifecycle, also read the installed identity
procedure at `docs/testing/identity.md`, section “Conditional private-file
verification”. Keep guard diagnostics free of personal
values, addresses, recipient details, credentials and personal provider responses.

When provider rate limiting applies, first find repository policy. If no threshold
is selected and it affects user throttling, provider cost or service limits, wait
for an explicit user choice before enabling, provisioning or tuning it. Test the
approved provider setting if selected; provider limits complement server guards.
Otherwise record that no provider limit was configured.

