# Verify routes and document metadata

Behavioral contracts are [route identity](../../openspec/specs/app/shared/frontend/navigation/route-identity/spec.md)
and [document metadata](../../openspec/specs/app/shared/frontend/navigation/document-metadata/spec.md).
Structural owners are [configuration](../../src/config/AGENTS.md),
[shared route identity](../../src/lib/surfaces/AGENTS.md) and, when installed,
the dashboard registry's nearest AGENTS. Inspect the changed family and consumers,
not every family by default.

For installed dashboard enrichment, discover
`app/dashboard/navigation/route-enrichment`. For installed public marketing
title policy or authoritative page/body reads, discover
`app/marketing/metadata/public-document-metadata` and the relevant
`app/marketing/content-sources/source-resolution` dependency. Use stock
`openspec list --specs`, then `openspec show <capability-id> --type spec`;
these surface contracts are conditional and do not install omitted areas.
Shared metadata retains canonical/social destination consistency, app identity
and private title/indexing policy. Do not load unrelated sibling capabilities.

## Deterministic checks

Run `npm run verify:route-surfaces` for registry or installed-route changes and
`npm run verify:route-metadata` for titles, descriptions, canonical/robots/social
output, factories or classification. Both are applicable to every installed
route profile. The route check validates installed family/page closure and public
navigation; metadata checks exercise actual factories and classify installed pages.

For an installed dashboard, run `npm run verify:dashboard` (including page shape),
then `npm run verify:surface-contracts`. Dashboard checks cover exact/detail lookup,
capabilities, semantic trails, command registration cleanup and vocabulary. For
public navigation changes run `npm run verify:site-layout`. When marketing is
installed, source-backed page metadata changes also use
`docs/testing/content-sources.md`.
When profile inclusion changes, run `npm run verify:profiles` in the template.

## Focused review

- Exercise actual typed dynamic href materialization, escaped parameters,
  exact/pattern matching, canonical identity across consumers and rejected
  missing parameters. Verify a nested trail contains navigable semantic ancestors,
  no current-page duplicate, no inferred filesystem parents; top-level has none.
- Confirm active contextual actions unregister on departure and command search
  closes before navigation/execution. Visibility is not authorization: test the
  owning server denial under the
  [access contract](../../openspec/specs/app/shared/services/identity/access-and-membership/spec.md)
  when relevant, using the installed auth/platform verifiers.
- Inspect route-first private dashboard/auth/internal titles, app-first public
  titles, home app-only, and private `noindex, nofollow`, including component-export
  and testing routes. Canonical/social destinations use installed hrefs without
  incidental queries; title/description/robots/social data agree.
- For a dynamic marketing document inspect the same memoized `getMarketingPage`
  boundary in metadata and body. Inject source success/failure at the configured
  adapter as described in content-source verification. A cache/source assertion
  establishes ownership, not proof of a live CMS read or deployed indexing.

For rendered changes use the Preview workflow to obtain and verify a local URL.
Review the actual affected route, its document head, keyboard command behavior
and compact presentation; save ignored failure evidence under `.codex/tmp/` or
the verifier's ignored output. Record commands, exact results and any untested
live/provider cases. Documentation-only migrations do not require a new server.
