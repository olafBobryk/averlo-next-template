# Verify action behavior

The maintained [action contract](../../openspec/specs/app/shared/data-lifecycle/action-behavior/spec.md)
owns non-form changes. [Forms](forms.md) own complete submissions and
[loading](loading.md) owns initial reads; use their existing procedures instead
of restating their scenarios. [Feedback ownership](../../src/lib/feedback/AGENTS.md)
and the relevant confirmation, InlineError, StatusMessage and toast Storybook
owners define structural boundaries and supported APIs.

## Run action verification

```sh
npm run verify:mutation-policy
npm run verify:entity-deletion
npm run verify:modals
```

These checks always cover installed modal submission handoff. The canonical
template additionally checks its thin overrides; generated projects check their
independent installed copies and explicitly omit absent dashboard adoption. A
generated receipt takes precedence over the package name; template-only checks
require the template package name and both assembly/profile directories. Dashboard
checks cover adoption and deletion completion structure plus fixture failed-delete
durability. They are not browser proof of
all pending or rollback paths. Run the affected owners' Storybook interaction
tests and actual rendered flow below; [component verification](component-contracts.md)
describes focused Storybook commands. Read only applicable feedback/overlay/modal/
toast and nearest feature policy. Do not load contact delivery or route-authoring
procedures for an ordinary mutation.

## Delayed action group and completion

Use a verified Preview automation URL and fresh fixture browser context. Delay
the real mutation request at the browser boundary, preserving the actual rendered
action and application handler. Activate the action rapidly, then a conflicting
sibling: assert one request, only the initiating action busy, unchanged dimensions
and accessible label, disabled siblings without spinners, no detached saving
indicator, and cleared pending identity after settlement. Retry uses that same
synchronous guard. Independent initial/loading regions and drafts retain their
separate owners; a pending send retains the send control and an active cancellable
run still exposes cancellation.

Release an actual successful request and verify one transient shared outcome for
a discrete save. If completion needs lasting instructions, verify replacement
content keeps them after notifications expire. Detail deletion replaces the route
once and does not refresh/revisit the deleted detail; collection deletion uses its
collection's declared refresh. Cancel confirmation before execution and assert no
mutation. Recheck authorization at the real server boundary, not client visibility.

## Failure and feedback evidence

Exercise both returned failure and thrown/rejected transport through the actual
handler. Check optimistic state is restored, durable state unchanged and the same
flow offers retry while retaining input, attachments and selection according to
its recovery copy. A failed confirmation stays open and all dismissal paths unlock;
use [interaction verification](interactions.md#blocking-and-anchored-overlays).

Review the actual pending, failed, recovered and successful states at desktop and
narrow widths. Verify one accessible announcement, local placement and natural
wrapping of message/retry. Field validation stays with Field; local recoverable
action failure uses InlineError (card for standalone page/composer adjacency,
inline within an already bounded owner); persistent usable-context service failure,
expired access or read-only explanation uses StatusMessage, dismissible only when
safe. Region fetch failure uses the region's retry state. Do not duplicate one
failure through toast, InlineError, StatusMessage and replacement content. Distinct
channels may coexist only with distinct meanings. Healthy pages need no fabricated
notice; read-only content explains unavailable controls nearby.

## Evidence and scope

Save request counts, outcome assertions, screenshots and traces under ignored
`test-results/` with the tested route, viewport, owner, failure type and result.
Controlled failures establish UI recovery; genuine success and direct invalid/
unauthorized requests establish the real boundary. Explicitly identify any path
not exercised. Static verifier success alone does not prove runtime recovery.
