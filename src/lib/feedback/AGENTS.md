# Folder: `src/lib/feedback`

## Role

Shared non-visual feedback event helpers used by UI hosts.

## Invariants

- Feedback helpers should stay UI-agnostic and event-based.
- Toast dispatch belongs here; rendering belongs in the component layer.
- Shared feedback contracts must stay stable because multiple components consume them.

## Lifecycle ownership

- Non-form actions follow [action behavior](../../../openspec/specs/app/shared/data-lifecycle/action-behavior/spec.md)
  and [action verification](../../../docs/testing/actions.md). Forms and initial
  reads retain their separate maintained contracts; feedback helpers do not
  become a form framework or route-state owner.
- One initiating action owns a synchronous duplicate guard and pending identity.
  Only that action is busy; disable conflicting siblings without more spinners.
  Preserve its dimensions and accessible label, clear identity on settlement,
  and keep recovery local. Do not add a detached second saving indicator.
- Field owns validation. InlineError owns recoverable local action failure;
  StatusMessage owns persistent usable-context notices, safely dismissible only
  when its condition permits; toast owns transient discrete outcomes. Region
  state owns content that cannot render, including empty/unavailable/read failure.
  Durable success instructions remain in replacement content. Multiple channels
  may coexist only for different meanings and owners, never repeat one result.
- Use InlineError's card presentation for standalone page/composer failures and
  inline inside an already bounded surface. A composer-adjacent approval, queue
  or error keeps shared Card fill/elevation; its location does not turn a local
  failure into a persistent notice. Component APIs remain with owner contracts.
- Shared confirmation owns destructive or explicitly confirmed changes and one
  pending close lock for every dismissal path. Failure unlocks in place; returned
  and thrown failures restore optimistic state and preserve input/selection.
  Detail completion navigates once through replacement without a refresh;
  collection completion follows its collection owner. Do not create feature-local
  confirmation, notification hosts or parallel feedback systems.
- Pending sends retain their send-control owner; cancellation stays available
  during an active cancellable run and neighboring loading preserves independent
  drafts. Force-review uses these same owners.
