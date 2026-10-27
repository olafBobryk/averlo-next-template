# Identity, transport and delivery reconciliation

This is a change-local migration audit, not an extra discovery mechanism. Source
identities are the four matching entries in `source-baseline.json`; SHA-256 checks
on 2026-10-26 confirmed all four unchanged before handback. The parent syncs main
specs, changes the menu/operational consumers and marks tasks centrally. No retired
reference was edited by this batch.

## API transport source

Source: `references/api-transport.md`. Paragraph and bullet numbers below refer
to that recorded source section in order.

| Source section/clause | Exact destination and disposition |
| --- | --- |
| Title; Contract ¶1: reusable non-UI location, thin typed wrappers, shared base/headers/parsing/errors/cancellation | [API role](../../../../src/lib/api/AGENTS.md#role), [API invariants](../../../../src/lib/api/AGENTS.md#invariants); [consistent outcomes](../../../specs/integration/api-transport/spec.md#requirement-consistent-request-outcomes) owns observable results |
| Contract ¶2: injectable transport, real wrappers for tests/demos, explicit browser defaults, injected service/environment assumptions | [API invariants](../../../../src/lib/api/AGENTS.md#invariants), [replaceable transport](../../../specs/integration/api-transport/spec.md#requirement-replaceable-transport-with-identical-behavior) |
| Contract ¶3: typed data/errors, caller feedback, server-only privileged headers/credentials | [API invariants](../../../../src/lib/api/AGENTS.md#invariants), [secrets and feedback](../../../specs/integration/api-transport/spec.md#requirement-secrets-and-feedback-remain-with-their-owners) |
| Contract ¶4: deliberate small public exports, facade only for cross-owner reuse | [API invariants](../../../../src/lib/api/AGENTS.md#invariants) retains implementation policy |
| Hard boundaries 1–5: no scattered fetch, UI effects, drifting demos, duplicate parsing/auth/retry or browser secrets | [API invariants](../../../../src/lib/api/AGENTS.md#invariants), [dependency and secret review](../../../../docs/testing/api-transport.md#dependency-and-secret-review); overlap is intentional structural/verification separation |
| Repository context bullets 1–4: lib/API owners, selected client/wrapper/mock, caller boundary | [dependency and secret review](../../../../docs/testing/api-transport.md#dependency-and-secret-review); existing `src/lib/AGENTS.md` continues shared non-UI ownership |
| Repository context bullet 5: contact concern only when selected | [API contract ownership](../../../../src/lib/api/AGENTS.md#contract-ownership), [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary) |
| Verification bullets 1–4: injected actual wrapper, success/error/malformed/cancel/network, lint/types, dependency/secret exclusion | [run transport checks](../../../../docs/testing/api-transport.md#run-transport-checks), [outcome contract](../../../../docs/testing/api-transport.md#outcome-contract), [dependency and secret review](../../../../docs/testing/api-transport.md#dependency-and-secret-review) |

## Auth and organization source

Source: `references/auth-organization.md`.

| Source section/clause | Exact destination and disposition |
| --- | --- |
| Title; Contract ¶1: provider-neutral routes, four adapter contracts and server composition | [auth contract ownership](../../../../src/lib/auth/AGENTS.md#contract-ownership), [server and fixture structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure) |
| Contract ¶2: server session/org each protected request, active selected membership, distinct identity/org/platform axes | [server authorization](../../../specs/identity/access-and-membership/spec.md#requirement-server-authorization-at-every-protected-boundary), [auth structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure), [platform policy](../../../../src/app/(site)/dashboard/platform/AGENTS.md#dashboard-platform-management-policy) |
| Contract ¶3: safe resolver, unavailable optional methods, page+mutation authorization rather than hidden controls | [safe continuations and explicit methods](../../../specs/identity/access-and-membership/spec.md#requirement-safe-continuations-and-explicit-authentication-methods), [auth structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure), [server verification](../../../../docs/testing/identity.md#server-authorization-and-continuations) |
| Contract ¶4: GET inert; explicit mutation checks token/recipient/org/expiry/revocation/prior use; reinvite invalidates; final identity retained | [invitation acceptance](../../../specs/identity/access-and-membership/spec.md#requirement-invitation-acceptance-is-deliberate-and-bounded), [retained identity](../../../specs/identity/access-and-membership/spec.md#requirement-retain-a-verified-sign-in-identity), [auth structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure), [invitation verification](../../../../docs/testing/identity.md#optional-methods-and-invitation-lifecycle) |
| Contract ¶5 first sentence: fixture non-durability | [safe continuations and explicit methods](../../../specs/identity/access-and-membership/spec.md#requirement-safe-continuations-and-explicit-authentication-methods), [auth structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure) |
| Contract ¶5 private files: organization auth, validated metadata, opaque keys, signed lifetime, replacement cleanup, explicit delete, no implicit storage choice | [file lifecycle authorization](../../../specs/identity/private-file-access/spec.md#requirement-authorize-file-lifecycle-boundaries), [bounded access](../../../specs/identity/private-file-access/spec.md#requirement-opaque-references-and-bounded-access), [cleanup](../../../specs/identity/private-file-access/spec.md#requirement-explicit-replacement-and-cleanup), [private-file integration](../../../../src/lib/auth/AGENTS.md#private-file-integration) |
| Hard boundaries 1–6: no SDK presentation imports, unsafe continuation/stale/client/GET trust, implied optional availability, mixed access axes, durable fixture claim, implicit provider installation | [auth contract ownership](../../../../src/lib/auth/AGENTS.md#contract-ownership), [server and fixture structure](../../../../src/lib/auth/AGENTS.md#server-and-fixture-structure), [private-file integration](../../../../src/lib/auth/AGENTS.md#private-file-integration); all retained, no file-storage implementation invented |
| Repository context bullets 1–4: scope auth modules, registry for visibility/denial/org, platform when selected, components for guards/UI | [scoped owner inspection](../../../../docs/testing/identity.md#scoped-owner-inspection) |
| Verification bullets 1–4: auth/platform checks, supported 401/403 route behavior, mutation execution-time authorization | [run identity checks](../../../../docs/testing/identity.md#run-identity-checks), [server verification](../../../../docs/testing/identity.md#server-authorization-and-continuations), [access denial usability](../../../specs/identity/access-and-membership/spec.md#requirement-access-denial-remains-usable) |

No new `src/lib/files/AGENTS.md` is needed: that family owns browser file-preview
utilities, not private storage. The explicit distinction and all storage policy
remain with the actual `private-files.ts` auth owner.

## Contact delivery source

Source: `references/contact-delivery.md`.

| Source section/clause | Exact destination and disposition |
| --- | --- |
| Title; Contract ¶1: contact/enquiry/lead/booking/callback server submission owner, existing form/action/feedback/transport/interaction client owners | [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks); existing lifecycle/interaction capabilities remain independent |
| Contract ¶2: independent server normalization/validation, guards before effects, trim/dedup recipients, server credentials, missing-config unavailable, generic provider failure | [configured server delivery](../../../specs/delivery/contact-delivery/spec.md#requirement-delivery-is-explicitly-configured-and-server-owned), [recipient-independent content](../../../specs/delivery/contact-delivery/spec.md#requirement-recipient-independent-message-content), [private outcomes](../../../specs/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes), [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary) |
| Contract ¶3: professional recipient-independent normalized source/contact/message content, supported reply path, recipient routing in config | [recipient-independent content](../../../specs/delivery/contact-delivery/spec.md#requirement-recipient-independent-message-content), [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification) |
| Contract ¶4 privacy: no message/email/recipient/personal provider/credential logs | [private outcomes](../../../specs/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes), [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification) |
| Contract ¶4 lifecycle: retained values, synchronous duplicate start, pending/result ownership | [private outcomes](../../../specs/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes) cross-refers unchanged form capability; [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks) reuses its runner, no duplicate form requirements |
| Contract ¶5: interception before real send; provisioning/recipients/inbox/deploy/real-send separate operational workflow | [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification), [provisioning and intentional-send gates](../../../../docs/testing/contact-delivery.md#provisioning-and-intentional-send-gates) |
| Hard boundaries 1–3: no browser credentials/management keys/recipients/privileged clients, no personal data returned/logged, no unconfigured success | [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [private outcomes](../../../specs/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes), [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification) |
| Hard boundary 4: no implementation-authorized provisioning/production recipients/deploy/real sends | [provisioning and intentional-send gates](../../../../docs/testing/contact-delivery.md#provisioning-and-intentional-send-gates); operational skill retains actual execution and approvals, parent updates its references |
| Hard boundary 5: no parallel contact-only input/toast/modal/API owner | [conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks) |
| Repository context bullets 1–2, 5: operational skill implementation/provisioning boundary, form UX only if local rules incomplete, no credential/provisioning reads unless separately selected | [provisioning and intentional-send gates](../../../../docs/testing/contact-delivery.md#provisioning-and-intentional-send-gates); installed Contact Form operational skill remains canonical for provider-specific details, with existing form/input owners consulted first |
| Repository context bullets 3–4: API and actual form/server/adapter/nearest ownership | [API contract ownership](../../../../src/lib/api/AGENTS.md#contract-ownership), [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks), [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification) |
| Verification bullets 1–4: intercepted client lifecycle; normalized server/recipients/config/provider/logging; form/transport/type/build; real-send separate | [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks), [conditional verification](../../../../docs/testing/contact-delivery.md#conditional-delivery-verification), [provisioning and intentional-send gates](../../../../docs/testing/contact-delivery.md#provisioning-and-intentional-send-gates) |

## Form protection source

Source: `references/form-protection.md`.

| Source section/clause | Exact destination and disposition |
| --- | --- |
| Title; Contract ¶1: named public/external exposures; ordinary authenticated edits excluded; internal guards need explicit task/threat/owner signal | [guard applicability](../../../specs/delivery/submission-protection/spec.md#requirement-apply-guards-at-exposed-boundaries), [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [protection verification](../../../../docs/testing/forms.md#submission-protection) |
| Contract ¶2: server-owned shared honeypot/guard/cookie/cooldown/file helpers; guard before effects; neutral no-work honeypot | [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [neutral honeypots](../../../specs/delivery/submission-protection/spec.md#requirement-honeypot-responses-remain-neutral), [protection verification](../../../../docs/testing/forms.md#submission-protection) |
| Contract ¶2 client filtering/hidden/accepted hints are convenience, never authorization/security | [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [server attachment validation](../../../specs/delivery/submission-protection/spec.md#requirement-server-owned-attachment-validation) |
| Contract ¶3: file type/size/content/auth/normalization; UI-agnostic guards; no personal submission/recipient/provider/credential logs | [server attachment validation](../../../specs/delivery/submission-protection/spec.md#requirement-server-owned-attachment-validation), [private diagnostics](../../../specs/delivery/submission-protection/spec.md#requirement-policy-owned-throttling-and-private-diagnostics), [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [protection verification](../../../../docs/testing/forms.md#submission-protection) |
| Contract ¶4: provider configurable limit checks repo policy; absent threshold affecting throttling/cost/limits needs explicit user choice; provider limit complements guards | [policy-owned throttling](../../../specs/delivery/submission-protection/spec.md#requirement-policy-owned-throttling-and-private-diagnostics), [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [protection verification](../../../../docs/testing/forms.md#submission-protection) |
| Hard boundaries 1–5: no blanket dashboard policy, client enforcement substitution, duplicated guard state, observable detection/downstream work, unapproved provider limit | [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [protection verification](../../../../docs/testing/forms.md#submission-protection); every exception retained |
| Repository context bullets 1–4: guard owner/types, SpamProtectionFields owner/catalogue/Storybook, actual endpoint exposure owner, API only for provider transport/limits | [forms contract ownership](../../../../src/lib/forms/AGENTS.md#contract-ownership), [forms invariants](../../../../src/lib/forms/AGENTS.md#invariants), [API conditional delivery boundary](../../../../src/lib/api/AGENTS.md#conditional-delivery-boundary), [protection verification](../../../../docs/testing/forms.md#submission-protection) |
| Verification bullets 1–5: real valid once, neutral no-effects honey, applicable cooldown/cookie/files, direct validation/auth bypass, approved selected limit or explicitly none | [protection verification](../../../../docs/testing/forms.md#submission-protection), [run no-delivery checks](../../../../docs/testing/contact-delivery.md#run-no-delivery-checks), [forms protection cross-reference](../../../../docs/testing/forms.md#submission-protection) |

## Verification evidence and applicability

Ignored evidence is under `test-results/retirement/identity/`.

| Check | Actual result | Evidence |
| --- | --- | --- |
| Focused transport and guard tests | 12 tests passed; actual session wrapper success/HTTP rejection/malformed/network/cancel, shared client request/outcome contract; guard ordering/cookies/files; actual contact handler invalid/honeypot zero fetch/log calls | `focused-tests.log`; permanent generic `src/lib/api/createApiClient.test.ts`, `src/lib/forms/guard.test.ts`, dashboard `src/lib/api/auth.test.ts`, marketing `src/lib/forms/contact.test.ts` |
| `verify:auth` | Passed existing session/org/continuation/invitation/identity/method suite; added explicit unconfigured private-file provider/no-adapter assertion | `auth.log` |
| `verify:platform` | Passed fixture role/access and platform operations | `platform.log` |
| Focused Biome | Nine implementation/test/verifier files passed | `lint.log` |
| `npm run typecheck` | Passed after typed auth parser repair | `typecheck.log` |
| `verify:forms` | 6 form/viewport combinations, 34 scenario groups passed against retained managed Preview 3011, desktop 1280 and narrow 390; real invalid/success and intercepted pending/failure; no real email | `forms.log`, independent copied `forms-results.json` |
| Direct identity runtime | Four browser/API groups passed: anonymous org/invitation mutations 401 and platform → rendered login; unavailable real magic-link action stays anonymous with safe `/dashboard` next; member org/invitation mutations 403 without org change plus platform → usable overview; organization admin without platform role also → overview | `runtime.mjs`, `runtime.log`, `runtime-results.json` |
| Source baseline identity | Four source SHA-256 values match recorded baseline | `source-baseline.json` and parent integration audit |

Actual defect repaired: auth wrappers' shared `readJson` leaked a raw parser
exception for malformed JSON/null. It now returns the existing `AuthApiError`;
native network/cancel failures, including response-body failures, remain unchanged.
The shared client also no longer mistakes interrupted response bodies for malformed
JSON. No provider or UI design
was added.

Private-file upload/metadata/content authorization, signed access and replacement/
delete cleanup tests are **inapplicable here**: policy/interface exist but
`privateFileProvider.configured` is false and no lifecycle endpoints are installed.
The conditional procedure preserves all checks for a future explicitly selected
adapter. Likewise recipient/provider success/failure/missing-config/inbox tests are
**inapplicable here**: contact/support intentionally install no delivery adapter.
Guard metadata bounds are tested; file-content inspection/resource authorization
cannot be claimed without an installed attachment boundary. No provider threshold
was selected or configured, no provisioning ran, and no messages were sent.

The batch does not claim all protected routes were exhaustively audited, a live
provider was tested, or a new build was run; root owns integration build and
assembly/menu/spec validation. Maintained form/loading requirements were not
edited. All conditional guarantees remain canonical rather than being deleted
to match an absent implementation.
