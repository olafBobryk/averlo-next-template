# Verify independent project assembly

## Scope

The canonical template owns positive assembly. Generated projects are independent
outputs; their selected surfaces and content mode determine installed features.
The maintained [assembly contract](../../specs/template/assembly/spec.md)
and [assembly policy](../../template-assembly/AGENTS.md) own that boundary.

## Profiles

| Profile          | Included surfaces                                    | Content choices           | Default         |
| ---------------- | ---------------------------------------------------- | ------------------------- | --------------- |
| `full`           | Marketing, auth, dashboard, and developer tools.     | `static`, `payload-ready` | `payload-ready` |
| `app-only`       | Auth, dashboard, and developer tools; no marketing.  | `static`                  | `static`        |
| `marketing-only` | Marketing and developer tools; no auth or dashboard. | `static`, `payload-ready` | `payload-ready` |
| `thin-start`     | Minimal marketing specialist surface.                | `static`, `payload-ready` | `payload-ready` |

Generated projects are one-way starting points, not alternate states of the
template checkout. `create-averlo` and `npm run create:project` install
dependencies and create a local `main` repository with one commit and no
remote; `--no-install` generates only the project and lockfile. The canonical
template's `/repository-footprint` page (a commit-history snapshot of the
authored repository size) is template-only and never reaches a generated
project.

## Run assembly verification

1. Run `npm run verify:profiles` and `npm run verify:create-averlo` from the
   canonical template. The profile matrix checks supported profile/content pairs,
   explicit ownership, omissions, overrides, independent copies of the selected
   `specs/platform/` folders and `.specify/`, and spec-reference/link closure.
   Every output excludes `specs/template/`, the template-only workflows and any
   product spec; its copies belong to the product and permit configured
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
