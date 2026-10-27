# Repository workflow retirement evidence

This report records implementation of the approved full migration in staged
batches. It distinguishes actual runtime/build results from source checks and
conditional provider contracts. No deployment, publication, cache installation,
real message delivery, provider provisioning, custom schema or routing skill is
part of this change.

The stock archive operation completed on 2026-10-26 with all 38 tasks complete.
All 17 delta specs were already synced; archive therefore skipped duplicate spec
writes. Post-archive strict validation passed all 19 maintained capabilities, and
422 audit/menu links resolve. All three archived changes also pass task-completion
validation.

## Canonical ownership

- Behavioral requirements: seventeen new capabilities beneath
  `openspec/specs/`, alongside the unchanged form/loading capabilities in
  `data-lifecycle/`. There is no duplicate parent lifecycle contract.
- Structure and dependency boundaries: root/nearest AGENTS, including assembly
  policy kept only in the canonical template.
- Component APIs and defaults: Storybook owner contracts and catalogue teaching.
- Execution and evidence: canonical `docs/testing/` procedures and existing scroll
  procedure. `WORKFLOWS.md` contains only procedure names and links.
- Compose, Animate, Systemize Composition and Contact Form retain their explicit
  operational/source/provisioning gates and use the target repository's contracts.

The [migration map](migration-map.md), [112-section ledger](section-ledger.md) and four clause
receipts preserve exceptions and approval boundaries. Read-only independent review
found no lost normative clause. Existing form/loading files retain their recorded
SHA-256 values.

## Bounded repairs

- Existing API parsers preserve native network/abort failures while malformed
  auth responses use the existing typed authentication error.
- Destructive confirmation shows recoverable errors beside the action; returned
  and thrown failures retain recovery and rollback. Pending confirmation blocks
  repeated activation and all dismissal paths, including host close events.
- Nested dialog dismissal returns focus to its initiating control. Decorative
  button spinners do not enter accessible names.
- Dashboard profile data is imported without pulling CSS-bearing components into
  Node-only verifiers. Generated mutation verification does not require omitted
  template machinery.

These changes use existing owners and their intentional thin overrides. They add
no universal action/form framework or app-wide button-variant policy.

## Verification results

- Strict OpenSpec validation passed for all 19 maintained capabilities and this
  change after router removal. All seventeen delta contracts are synced. The two
  existing form/loading files retain their baseline hashes.
- Root production build and typecheck passed. Auth/platform, mutation policy,
  deletion rollback, modal, surface, route/metadata, marketing/media/source,
  catalogue and design-system evidence checks passed. Catalogue validation covered
  99 app-safe contracts; focused owner stories covered errors/retry, dismissal,
  nested focus, loading and affected consumers. These are scoped checks, not a
  claim of a complete visual sweep.
- Root rendered forms passed 6 form/viewport combinations and 34 scenario groups;
  loading passed 4 combinations and 14 groups. Responsive essential content was
  checked at 1280 and 390 pixels with JavaScript disabled, and actual desktop
  versus compact scroll listener ownership was checked.
- After router deletion, generic skill references, 28 composition tests and two
  Visual Parity tests passed, including independent-target resolution and explicit
  missing-contract behavior. Creation safety and assembly ownership checks passed.
- The source-only profile matrix passed all seven standard static/ready outputs,
  applicable contract sets, link closure, independent copies and meaningful
  missing-spec/broken-link/conflicting-owner negative cases. Powered source
  boundaries were fixture-tested; no live Payload activation was performed.

### Installed generated projects

Each row uses a separately materialized source project and actual dependency
installation. Form counts include desktop and narrow viewports, genuine server
boundaries, controlled delays/failures, duplicate prevention, recovery and retry.

| Selection | Build / types | Installed family checks | Browser forms | Browser loading |
| --- | --- | --- | --- | --- |
| Full / static | Passed | Auth, platform, transport/guards, modals, deletion and 16 focused owner cases passed | 6 combinations / 34 groups passed | 4 combinations / 14 groups passed |
| App-only / static | Passed | Auth, platform, 11 transport/guard cases, modals, mutation/deletion and 16 focused owner cases passed | 4 combinations / 24 groups passed | 4 combinations / 14 groups passed |
| Marketing-only / static | Passed | Lint, routes, metadata, modals, surfaces, marketing and 8 transport/guard/contact cases passed | 2 combinations / 10 groups passed | Dashboard pilot intentionally omitted |
| Thin-start / Payload-ready | Passed | Lint, routes, metadata, modals, surfaces, marketing, Payload page/layout fixtures and 8 transport/guard/contact cases passed | 2 combinations / 10 groups passed | Dashboard pilot intentionally omitted |

The full and app-only fresh generated locks resolved Next 16.4.3; marketing and thin
used the selected lock with Next 16.2.11. Initial full typechecking before Next
bootstrap failed on missing generated declarations; build followed by typecheck
passed. Final full source reassembly reused its byte-identical package/lock and
already installed dependencies. The last mutation portability check used the root
TypeScript executable from the generated working directory after its own
installation was cleaned up; it passed and is not presented as a new install.

Receipts: [full](../../../../test-results/retirement/generated/full/results.json),
[app-only](../../../../test-results/retirement/generated/app-only/results.json),
[marketing-only](../../../../test-results/retirement/generated/marketing-only/results.json),
[thin-start](../../../../test-results/retirement/generated/thin-start/results.json).

### Existing failures and conditional coverage

The following checks are **not green** and are not claimed as acceptance passes:

- Root lint reports 33 existing errors outside the migration's focused lint set;
  `verify:static` therefore stops at lint. Details remain in the
  [final lint report](../../../../test-results/openspec-retirement/root-lint-final.json).
- Aggregate frontend entity verification retains its AccountIdentity
  `secondaryLabel` skeleton assertion failure. Focused deletion/action/entity
  ownership cases passed; the broader assertion was not weakened.
- `verify:profiles` passes its seven standard outputs and negative guards, then
  fails the optional assistant selection on the existing exported fixture in
  `upload-tiles.test.tsx` (`noExportsInTest`). The overall command is a failure:
  [complete log](../../../../test-results/openspec-retirement/final-profiles.log).
- Thin strict API verification retains an existing deprecated `enterOffset`
  marker. Thin aggregate static verification additionally matches the retired
  token scanner against generated PDF.js vendor bytes (an incidental glyph-name substring).
  Individual applicable migration checks ran separately and passed.

No private-file storage adapter, delivery adapter or attachment submission boundary
is installed for these fixture forms. Provider authorization/content/replacement
cleanup, delivery recipient/inbox and attachment-content cases remain conditional
in their canonical procedures. Their absence was verified; these cases were not
simulated as deployed provider coverage. No rate threshold was added.

## Evidence and review

- [Migration map](migration-map.md), [112-section ledger](section-ledger.md),
  [foundation receipt](reconciliation-foundation.md),
  [identity receipt](reconciliation-identity.md),
  [content receipt](reconciliation-content.md) and
  [presentation receipt](reconciliation-presentation.md).
- [Workflow procedure menu](../../../../WORKFLOWS.md) and representative contracts:
  [actions](../../../specs/data-lifecycle/action-behavior/spec.md),
  [component contracts](../../../specs/ui-system/component-contracts/spec.md),
  [project assembly](../../../specs/template/project-assembly/spec.md).
- Raw ignored evidence: [root build](../../../../test-results/openspec-retirement/root-build.log),
  [post-retirement consumers](../../../../test-results/openspec-retirement/post-retirement-consumers.log),
  [strict validation](../../../../test-results/openspec-retirement/post-retirement-validation.log),
  [identity results](../../../../test-results/retirement/identity/results.json),
  [owner evidence](../../../../test-results/retire-repository-workflows/presentation/catalog-check.log).
- [Recovery snapshot record](../../../../test-results/openspec-retirement/router-retirement.json):
  all 22 original files, including metadata, were preserved with matching hashes
  before deleting the repository-local router. Installed plugin caches were not
  changed and no plugin was published.

[Post-archive validation](../../../../test-results/openspec-retirement/archived-validation.log)
and the [archive operation](../../../../test-results/openspec-retirement/archive.log)
record the final state.

The retained managed application at [Records](http://localhost:3011/dashboard/records)
was reviewed through the real browser: open a record's actions, inspect its delete
confirmation and cancel with focus returning to the initiating action. Root
Storybook remains at [confirmation recovery](http://localhost:6006/?path=/story/ui-overlays-confirmation-modal--recoverable-failure-and-retry).
Generated-project preview workers were stopped after their runs; their links are
historical evidence only. The retained root previews are the review targets.

No new UI preview was needed for documentation-only clauses. Runtime repairs use
existing component and application owners, with no provider setup, deployment,
production message delivery or universal framework.
