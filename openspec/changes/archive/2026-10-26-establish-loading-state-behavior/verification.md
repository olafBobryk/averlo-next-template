# Loading-state migration verification

## Contract preservation

The former `form-behavior` capability moved to
`openspec/specs/data-lifecycle/form-behavior/spec.md`. Its entire requirement
section is byte-identical before and after relocation: **9 requirements and
17 scenarios**, SHA-256
`f37461870f9f1f23fd43f50a7384f95e786a65d5b178a760b91513f36a5c3032`.
The purpose adds a family relationship; no form requirement was rewritten.
The prior archived pilot remains historical evidence and was not edited.

Both family capabilities and the change pass strict OpenSpec validation.
The family folder is organizational, without a custom schema, inheritance,
routing skill, reference index, or duplicate parent requirements.

## Loading policy migration map

| Prior policy clause | Maintained owner |
| --- | --- |
| Static chrome keeps copy, destination, visibility and interaction | Preserve independent known content |
| Classify loaded data and data-dependent actions separately | Dependency-scoped loading |
| Independent fetched regions, draft retention and no history for new chat | Preserve independent known content; Dependency-scoped loading |
| Mirror wrappers, hierarchy, repetition, spacing, borders, responsive geometry, typography, truncation and accents | Live and loading layout parity |
| Exact known sizing copy and realistic unknown exemplars | Live and loading layout parity |
| Inert, non-selectable placeholders without focus/handlers/announcement noise | Inert visual placeholders |
| Reduced motion must not gate content or controls | Readable reduced-motion loading |
| Empty, idle, unavailable, recoverable error and fatal prerequisites differ from loading | Distinct region outcomes and recovery |
| Pending form actions belong to submit control, not region loader/toast | Distinguish reading from submission; sibling form-behavior |
| Owner skeletons, generic-placeholder exceptions and approval for owner extensions | Retained operational/structural guidance in loading-parity and nearest AGENTS |
| Pending-send control and active-run cancellation | Retained in action-lifecycle; not generalized into read behavior |
| Forced review uses actual owners, compares both states and runs focused verifiers | Retained loading-parity verification procedure and docs/testing/loading.md |
| Static default / generation-only shimmer restrictions | Explicitly removed by user decision; shared Skeleton owner now defaults to shimmer, with static opt-out and reduced-motion suppression |

## Shimmer owner checks

- Four Skeleton owner stories and five consumer stories passed.
- All 33 component-skeleton contracts passed; scoped Biome passed.
- Browser checks cover default shimmer and explicit static under normal and
  reduced motion. The shared CSS suppresses shimmer for reduced motion.
- Detailed ignored evidence: `test-results/skeleton/default-animation-results.json`.
- Thin-start positively copies the same Skeleton component and stylesheet;
  there is no alternate base renderer or source callsite forcing static.

## Runtime and integration evidence

- Root loading browser coverage passed at 1280×900 and 390×844: four
  auth/records case combinations, fourteen scenario groups. Real delayed
  navigation is released to genuine server responses; forced state results
  remain explicitly identified. Results and reviewed ready/loading screenshots
  live under `test-results/loading/`.
- Root form regression passed all six desktop/narrow combinations and thirty-four
  scenario groups: `test-results/forms/results.json`.
- Auth, route-skeleton, all 33 component-skeleton, and full/thin mutation-policy
  verifiers passed. Root standalone typecheck and production build passed.
  Build evidence: `test-results/loading/integration/build-pass.log`.
- All four independently assembled profiles passed ownership checks, native
  OpenSpec discovery and strict spec validation. They retain exact form blocks,
  six unchanged stock skills, both nested specs and applicable procedure/script
  copies; no template change history is copied. Dashboard case modules exist
  only in full/app projects. See `test-results/loading/generated-ownership.json`.
- The seven standard source profile variants reached their route and assembly
  ownership checks successfully. The overall profile verifier failed afterward
  in the optional assistant selection; an isolated reproduction confirms the
  existing `upload-tiles.test.tsx` CommonJS CSS test adapter violates
  `noExportsInTest` (generated line 9). No loading pilot file caused this failure.
  Logs: `test-results/loading/integration/profiles.log` and
  `assistant-assembly.log`.
- Disk exhaustion interrupted a subsequent final runtime rerun. Disposable
  generated dependencies/caches were reclaimed, preserving source/evidence.
  Interrupted runs are not accepted as passing evidence.

- Generated full and app-only loading suites passed eight combinations and
  twenty-eight scenario groups in total. Full form regression passed six
  combinations/thirty-four groups; app-only passed its four applicable
  combinations/twenty-four groups. Thin-start and marketing-only correctly
  omitted dashboard cases. All four generated typechecks passed. Combined
  evidence: `test-results/loading/generated-results.json`.
- Full's complete run preceded only the final auth Suspense wrapper; its final
  desktop auth scenario also passed afterward. The interrupted repeat is not
  counted. Final root and app-only runs verify both widths after that wrapper.
  Generated production builds were not run; root production build passed.
- All temporary generated previews were stopped and their disposable dependency
  and cache copies removed; independent source/evidence copies remain. Root
  application and managed Storybook previews are retained.
- Scoped formatting/lint passed for the loading runner, case helpers, package
  and assembly changes. Current local links/anchors passed across nine files.

- Official focused Storybook tests passed all four table-owner stories
  (Pagination, LastPageRemoval, Empty and Skeleton). The updated skeleton story
  demonstrates nonsortable headers and asserts no accessible placeholder
  buttons. Evidence: `test-results/loading/table-story-tests.txt`.
- Reviewed desktop/narrow ready/loading screenshots and actual application
  routes. The narrow record owner retains the same Record/Owner/Actions columns
  as ready content. Auth loading links remain real keyboard navigation.
- Both maintained requirements sections match their synchronized deltas exactly;
  the old flat capability is retired. Strict OpenSpec validation passes all
  three active items. All eight tracked implementation tasks are complete.

## Known baseline failures

Before loading implementation, `verify:entity-skeletons` failed its source-string
assertion for account identity's `secondaryLabel` at verifier line 128. The
loading pilot does not change that identity owner. Route-skeleton and
component-skeleton checks passed at baseline.

## Evidence limits

The pilot targets authentication and record list/detail surfaces. It is not an
exhaustive application audit. General draft-retention/new-chat and parallel
region requirements retain their existing owners and are not claimed as newly
browser-covered by this pilot. Deterministic debug states prove the selected
rendering and local recovery behavior, not a genuine provider failure; real
ready routes and controlled delayed navigation supply separate runtime evidence.
