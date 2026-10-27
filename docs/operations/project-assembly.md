# Verify independent project assembly

## Scope

The canonical template owns positive assembly. Generated projects are independent
outputs; their selected surfaces and content mode determine installed features.
The maintained [assembly contract](../../openspec/specs/template/assembly/project-assembly/spec.md)
and [assembly policy](../../template-assembly/AGENTS.md) own that boundary.

## Run assembly verification

1. Run `npm run verify:profiles` and `npm run verify:create-averlo` from the
   canonical template. The profile matrix checks supported profile/content pairs,
   explicit ownership, omissions, overrides, independent app-contract copies, and
   app-reference/link closure. Every output excludes template contracts and history;
   its generated stock configuration belongs to the product and permits configured
   persistence/delivery when installed examples are deliberately replaced.
2. To inspect an output, run `npm run create:project -- --profile <profile>
   --content <mode> --output <new-directory>`. Profiles are `full`, `app-only`,
   `marketing-only`, and `thin-start`. Content modes are `static` and
   `payload-ready`; `app-only` uses `static`. Payload-powered activation is a
   separate operation requiring an explicitly configured provider.
3. Run `npm ci --no-audit --no-fund` in the independent output, then its applicable
   `typecheck`, `build`, and owner verifiers. For thin-start run
   `npm run review:thin-start-api -- --root <output-directory> --strict` from the
   canonical template. Do not widen an intentionally omitted API to pass a test.
4. Use the Preview workflow to start and verify each rendered output. Run its
   [forms procedure](../testing/forms.md#run-form-verification) and
   [loading procedure](../testing/loading.md#run-loading-verification) for installed
   surfaces. Dashboard profiles cover login/support; marketing profiles cover
   contact. Use fixture sessions and no external writes.
5. When a changed source has a proven inventory/override edge, update that owner,
   reassemble, and repeat its focused check. Regenerate the positive thin inventory
   with `node scripts/generate-template-assembly-inventory.mjs <materialized-src>
   template-assembly/thin-start-src-files.json` after reviewing the selected source
   paths. Use source ownership paths before output route remapping, and preserve
   paths conditional on other supported content modes. Never copy generator-only rules or unrelated agent files into instances.

## Evidence

Record profile, content mode, selected capabilities, output path, commands and exact
results. Keep logs, screenshots and traces under ignored test output. Distinguish
source-only checks from installed builds and rendered browser coverage; identify
conditional provider coverage and pre-existing failures explicitly. Retain a
verified Preview only when it is useful for review. No deployment or publication is
part of assembly verification.
