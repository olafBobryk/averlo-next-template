# Verify workflow

Runs one named suite and reports its exit code. Steps:
[workflow.yml](workflow.yml).

```sh
specify workflow run verify -i suite=static
specify workflow run verify -i suite=forms -i base_url='http://localhost:PORT?motion=off&reveal=off'
```

| Suite | Runs | When |
| --- | --- | --- |
| `static` | `npm run verify:static` (Biome lint, policy verifiers, skill references, typecheck) | Every change |
| `build` | `npm run verify:build` | Runtime or config changes |
| `smoke` | `npm run verify:smoke` | After `build` |
| `storybook` | `npm run test-storybook && npm run catalog:check` | Component or story changes |
| `forms` | `npm run verify:forms -- --base-url <url>` ([procedure](../../../docs/testing/forms.md)) | Form behaviour |
| `loading` | `npm run verify:loading -- --base-url <url>` ([procedure](../../../docs/testing/loading.md)) | Loading behaviour |
| `marketing` | `npm run verify:marketing` | Marketing sections, shell, media |
| `frontend-entities` | `npm run verify:frontend-entities` | Dashboard entities |
| `dashboard` | `npm run verify:dashboard` | Dashboard routes and pages |
| `auth` | `npm run verify:auth` | Identity and membership |
| `profiles` | `npm run verify:profiles` (template only) | Assembly, specs, `.specify/`, AGENTS.md |
| `create-averlo` | `npm run verify:create-averlo` (template only) | The initializer |
| `template-tools` | create-averlo backport scanner, visual-parity skill and skill-reference tests (template only) | `plugins/**`, `packages/create-averlo/lib/backport.mjs` |

Suites that a profile did not install are absent in a generated project; the
step then fails with a missing npm script, which is the honest result. Live
suites need a preview URL you have loaded yourself. The per-area procedures in
`WORKFLOWS.md` say which suite proves which spec.
