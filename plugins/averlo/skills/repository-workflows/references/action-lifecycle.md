# Action lifecycle

## Contract

Give every user-initiated state change one clear lifecycle owner. Reject a
duplicate start synchronously, expose pending state through the owning action,
and make conflicting actions consistently unavailable until the result settles.

For a group of action buttons, store the identity of the pending action. Put
`loading` only on the button the user activated, preserving its dimensions and
accessible label. Disable conflicting sibling actions without giving them a
spinner. Do not replace button feedback with a detached “Saving…” label or add a
second loading indicator. Clear the pending identity when the request settles;
keep recoverable errors beside the action group and allow retry. Background or
initial region loading uses its region owner because no button initiated it.

Give each fetched region its own loading gate. Preserve known headings, welcome
copy, empty states and independent controls while data is pending. A new chat
has no message history to skeletonize. Existing-thread loading reserves only
unknown metadata, message history and permission controls. Keep the real
composer editable and retain its draft across loading-to-ready transitions;
gate only sending, file intake or other actions whose dependencies are pending.
Uploads and approval requests must not disable unrelated draft editing. Pending
sends use the send control, with cancellation still available during an active
run. Forced-loading review must exercise the same ownership boundaries.

Distribute results by ownership and lifetime:

- Keep value-specific validation with the field.
- Use InlineError for a recoverable failure beside the affected action,
  retaining entered values and offering local recovery when available. Choose
  its presentation from the owner contract: standalone failures in page content
  or beside a composer use card; composer-adjacent controls, approvals, queues
  and errors share Card background and elevation. Use inline within an already
  bounded surface. A surface presentation does
  not turn a local failure into persistent StatusMessage context.
- Use StatusMessage for persistent context or an operational notice when the
  surrounding content remains usable; offer dismissal only when it is safe.
- Use the shared toast owner for a transient action outcome.
- Use the region-level state owner when content cannot currently render, or
  when the region is empty, unavailable, or recoverably failed.
- Keep persistent context in persistent content, and turn durable post-success
  instructions into replacement content.

Different channels may coexist only when they communicate different ownership
and meaning. Do not repeat the same result through a field, banner, toast, and
replacement state.

Require the shared confirmation flow before destructive or explicitly
confirm-before-action changes. During a mutable modal action, centralize pending
and close-disable state so Escape, backdrop, explicit close, and every other
dismissal path observe the same lock. On recoverable failure, unlock the flow in
place. On successful navigation, perform one navigation and do not add a
redundant refresh.

Keep optimistic changes reversible. Restore prior UI state and leave durable
state unchanged when the mutation fails. Preserve entered or selected values
when recovery can continue in place.

Obtain exact action, confirmation, feedback, and state APIs from their Storybook
owners.

## Hard boundaries

- Do not use transient feedback for initial loading or field validation.
- Do not use a semantic notice as a generic mutation-result banner.
- Do not repeat a local InlineError through a toast or a StatusMessage.
- Do not create a page-local confirmation dialog, toast host, portal stack, or
  parallel feedback event system.
- Do not allow a second action to start before the first pending guard is
  observable.
- Do not duplicate confirmation, feedback, navigation, refresh, or durable-state
  ownership.
- Do not keep a failed optimistic change visible as though it succeeded.

## Repository context

Read only entries that exist and apply to the changed action:

- `src/components/ui/overlays/AGENTS.md` when shared portal or host behavior
  changes.
- `src/components/ui/overlays/modal/AGENTS.md` when confirmation, pending close
  locks, or modal dismissal changes.
- `src/components/ui/overlays/toast/AGENTS.md` when transient-feedback host
  behavior changes.
- `src/lib/feedback/AGENTS.md` when feedback dispatch or event contracts change.

Do not load contact-form delivery or route-surface registry workflows for a
generic mutation.

## Verification

- Verify the immediate duplicate-action guard, visible pending state, and
  consistent disabling of conflicting actions.
- Exercise every action in a multi-button group: exactly the clicked button is
  busy, siblings are locked without spinners, and retry restores the same rule.
- Verify local failure placement and presentation against its Storybook owner,
  including one announcement, narrow wrapping, and recovery copy that matches
  the values or attachments actually retained.
- Verify recoverable failure, retained input or selection, optimistic rollback,
  confirmation, and each dismissal path affected by the change.
- Run `npm run verify:mutation-policy` when shared mutation or modal-form policy
  changes.
- Run `npm run verify:modals` when modal ownership, host topology,
  confirmation, or dismissal behavior changes.
- Run the focused owner Storybook test for changed action, confirmation,
  feedback, or region-state behavior.

## Coverage checks

- Persistent service failures and expired access need a notice explaining
  unavailable actions; read-only access needs an explanation beside disabled controls.
- A failed form submission stays visible inline while preserving entered values.
  Keep invalid input attached to its field; do not mislabel a server failure as
  a field validation error or duplicate the inline failure in a toast.
- Successful saves and completed discrete actions use the shared toast dispatcher.
- Initial load failures remain region states with retry, not notice cards.
- Review the actual pending, failed, recovered, and successful states for each
  action; do not add notices to healthy pages merely to demonstrate the component.
