# Identity verification

## Run identity checks

```sh
npm run verify:auth
npm run verify:platform
```

These checks use resettable, non-durable server-memory fixtures, not a live
identity or storage provider. They do not send recovery email. Behavioral
authority is [access and membership](../../openspec/specs/app/shared/services/identity/access-and-membership/spec.md)
and [private-file access](../../openspec/specs/app/shared/services/files/private-file-access/spec.md).
Structural ownership remains with [auth](../../src/lib/auth/AGENTS.md) and
[platform](../../src/app/(site)/dashboard/platform/AGENTS.md).

## Server authorization and continuations

`verify:auth` covers anonymous/expired sessions, revoked membership, organization
selection and safe continuation rejection (external, protocol-relative and
backslash destinations). `verify:platform` distinguishes platform administrators
from organization administrators and exercises fixture platform operations.
Global account identity, organization role and platform role are independent.

For installed dashboard forms, run [form verification](forms.md#run-form-verification)
against a managed Preview. It submits directly as anonymous and with a foreign
organization context as well as through the rendered login/support forms. This
proves the submission boundary rather than relying on hidden controls. When a
protected page or mutation changes, additionally verify its real anonymous and
forbidden route behavior: supported sign-in/denial routing, no blank content or
permanent loading, and authorization checked again at execution time. Test the
actual changed boundary; the fixture policy check alone cannot prove every
protected route.

## Optional methods and invitation lifecycle

`verify:auth` exercises unavailable magic-link sign-in, available fixture
recovery/update methods, invitation preview without acceptance, intended
recipient checks, explicit acceptance, reuse, expiration, revocation, replacement
by reinvitation and existing-member conflicts. It also checks role/ownership
constraints and rejection of removing the final verified sign-in identity.
Inspect the selected adapter method-availability declaration and server
`assertAuthMethodAvailable` call when enabling an optional method; no implicit
fallback may establish a session.

Keep invitation GET pages review-only. Check both the page and explicit
POST/server-action owner when changing invitation UI; fixture invitation tests
exercise domain operations, not browser GET routing. Keep provider SDK types
behind `AuthAdapter`, `OrganizationAdapter`, `InvitationAdapter` and
`IdentityAdapter`, composed only by server owners.

## Conditional private-file verification

The template's `private-files.ts` declares policy and `PrivateFileAdapter` but
installs no provider. `verify:auth` checks the positive byte bound, maximum
five-minute signed lifetime and explicit `configured: false` state with no
adapter. There are no private upload/download/replacement endpoints to exercise.
Do not describe this policy/interface check as runtime authorization, signed URL
or cleanup coverage; no storage provider should be provisioned for this check.

After an explicit instance-level storage decision installs an adapter, add tests
through that actual server boundary using an isolated fake transport or provider
fixture. Verify unauthorized upload, metadata read, content read, replacement and
delete disclose nothing and write nothing; client references never authorize
access. Verify valid metadata/type/size and required content checks, normalization,
opaque keys, only permitted metadata and short-lived signed access for the owning
organization. Verify replacement points to the new file, applicable superseded
object cleanup and explicit deletion, with safe failures and server-only provider
credentials. Keep fixtures external-write-free and record provider lifecycle
limitations explicitly. Browser preview helpers under `src/lib/files` do not
implement any of these storage guarantees.

## Scoped owner inspection

Read the changed auth contract/module, server composition and calling route or
action; use the dashboard registry owner only for capability visibility, denial
or organization context, and platform owner only for platform changes. Consult
component ownership when changing redirect guards or auth UI. Do not expand a
focused identity change into an unrelated component review. Run focused lint and
typecheck for changed contracts, then the installed-family build when applicable.
