# Verify content sources

The [source-resolution contract](../../openspec/specs/app/marketing/content-sources/source-resolution/spec.md)
owns behavior. [Marketing-content AGENTS](../../src/lib/marketing-content/AGENTS.md)
and `src/payload/AGENTS.md`, when installed, own adapter and
activation structure. Read only the selected mode, document, collection/global,
normalizer, source adapter, seed and readback verifier.

## Fixture verification

Run `npm run verify:site-layout` for source-neutral layout and link normalization,
then `npm run verify:marketing` before handing off a complete marketing change.
For installed Payload scaffolding run `npm run verify:payload-site-layout` and
`npm run verify:payload-pages`. These inject controlled reads through real source
wrappers: fallback performs no provider read; normalized published fixtures
preserve frontend data; missing configuration, rejected reads, missing/malformed
pages and invalid required links fail closed without stale fallback. The page
verifier also confirms the adapter requests published data and rejects missing
published results; fixture checks do not prove a live provider is provisioned.

Verify that static output excludes Payload code, configuration, packages, routes
and deployment material. Ready mode retains guarded scaffold and unavailable
admin/API with fallback authority. Powered activation needs all schema, service,
published seed, readback and rendered parity gates. Template ownership changes
also require `npm run verify:profiles`; generated static projects do not run
omitted Payload commands.

## Authorized instance activation

Follow the existing `docs/operations/payload-vercel-neon-blob.md` procedure,
when that integration is installed,
for activation and its service/secret boundaries. Implementation or fixture
verification does not authorize provisioning Neon/Blob/Vercel, setting secrets,
deploying, exposing admin/API or changing production resources.

Only in an explicitly configured, authorized instance run
`npm run payload:verify:site-layout` and
`npm run payload:verify:marketing-pages` for the selected source. Seed/migration
commands and live services follow that operational procedure. Keep fallback and
`MARKETING_CONTENT_SOURCE=fallback` until seed/readback and rendered parity pass.
After explicit authority, verify missing/unpublished/invalid/unreadable content
remains unavailable instead of silently serving the old document.

For changed rendering obtain a verified Preview through the Preview workflow.
Compare actual normalized static/provider documents at the same section/shell
boundaries, including resolved media and metadata/body parity. Preserve evidence
of source mode, fixture versus live reads, commands, results and unrun gates;
never log secret values or claim fixture success establishes production parity.
