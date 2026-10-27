# Verify entity presentation

The maintained [entity presentation](../../openspec/specs/app/shared/frontend/content/entity-presentation/spec.md)
contract composes [action behavior](../../openspec/specs/app/shared/data-lifecycle/action-behavior/spec.md),
[loading behavior](../../openspec/specs/app/shared/data-lifecycle/loading-state-behavior/spec.md)
and [access and membership](../../openspec/specs/app/shared/services/identity/access-and-membership/spec.md).
Read the selected entity's domain/factory/renderer/route adapter and owner story,
nearest entity/dashboard/platform policies, and assistant/Markdown policy only
when those surfaces actually apply. Facts, React-free fetch-free factories,
ready renderers/owned skeletons and authorized route adapters stay distinct.

## Run entity verification

```sh
npm run verify:frontend-entities
```

Run after changing an entity contract, renderer or canonical path. Focused
`verify:entity-skeletons` and `verify:entity-deletion` may suffice for isolated
geometry/deletion changes; retain relevant auth, factory and renderer checks.
The aggregate stops at its first failure, so record that failure distinctly and
run remaining relevant commands individually to determine actual coverage.

## Identity and supported surfaces

Use direct owning presentation factories for labels, fields, columns, URLs,
semantic variants and commands across actual list/table/detail/profile/compact/
actor/avatar/selector/Command-K/Markdown/empty/skeleton uses. Do not add a global
entity barrel/registry/namespace, cross-product map or unused surfaces/framework.
Global account identity differs from organization membership. Adapters resolve
provider data, session, organization, capabilities and persistence before models
reach renderers; hiding a control never authorizes execution.

Check entity selectors compose shared EntitySelector with explicit options and
renderer; its owner supplies plain closed labels, portal behavior and mapping.
Check tools only where a genuine typed execution path exists: private assistant
ToolPresentationFrame owns lifecycle chrome, the entity owns presentation and
result rendering. Do not invent disconnected tool examples; Record is the current
implemented family. Use shared table/detail/property-list/Markdown/commands/feedback/
More-menu/state/overlay owners rather than local substitutes.

## Lifecycle, collections and fixtures

Exercise authorized and unauthorized execution, returned and thrown failures,
optimistic rollback and local retry using [actions](actions.md). Confirm destructive
intent through shared confirmation; preserve failed dialogs, input, selection and
durable state. Detail deletion replaces once without refreshing a deleted route;
collection completion follows its declared refresh. Compare each renderer's owned
Skeleton to ready geometry through [loading](loading.md).

A fully loaded authorized collection uses DashboardTablePanel `pageSize`, shared
pagination/footer and matching skeleton; sort the full collection before paging.
Overview excerpts use `viewMoreHref` to the collection instead and never combine
it with paging. Remote pagination requires an explicit contract, not guessed totals.
Verify identity-column retention, optional right-to-left hiding and final sticky
action column with mirrored skeleton `kind`, priority and sortable metadata. Keep
real caller-owned ContentSection header/search/filter/context/actions when needed;
omit an already supplied header rather than passing an empty placeholder.

Reset fixture state before and after tests, confirm the baseline returns and no
external provider writes occur. Fixture/report domains remain explicit and do not
imply durable production persistence. Keep reference member/record examples optional.
Save actual tested routes, fixture isolation, assertions and baseline failures under
ignored `test-results/`; static topology checks alone are not runtime authorization,
rollback or pagination evidence.
