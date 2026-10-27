# Verify loading behavior

The maintained contract is [loading-state-behavior](../../openspec/specs/app/shared/data-lifecycle/loading-state-behavior/spec.md). Its sibling [form-behavior](../../openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md) owns submission pending states and recovery. Component APIs and structural policy remain with Storybook and nearest `AGENTS.md`.

## Run loading verification

Obtain and verify a local preview through the Preview workflow, then run:

```sh
npm run verify:loading -- --base-url '<verified-local-preview-url>'
```

Pass the wrapper's complete automation URL so its motion/reveal parameters are preserved. The runner accepts loopback origins only, checks health, uses fresh fixture contexts for each case at desktop and narrow widths, and saves results plus ready/loading screenshots under ignored `test-results/loading/`. A failed case also saves its current screenshot. It does not start or stop servers.

## Pilot coverage

- Real login to magic-link navigation and real record-list to detail navigation: delay the actual App Router request, assert the current known content remains usable, then release the real server response and verify ready content. React may preserve the current page during a transition rather than showing its loading fallback; this is valid and is reported separately from owner review.
- The existing authenticated skeleton-reference route renders the actual login and magic-link loading owners. Verify known method/recovery links, safe continuation, keyboard activation, concise loading statuses, inert placeholder pieces, reduced motion and viewport containment.
- Actual record-list/detail loading owners through the dashboard's existing forced-loading review mode. Compare fixture row repetition, responsive retained columns and table width; preserve static headings and shell navigation; gate actions requiring unknown record data.
- The existing deterministic empty, unavailable and recoverable-error review states. Keyboard retry clears forced failure and reaches the actual ready route.

The deterministic outcome states are presentation/recovery evidence, **not evidence that an actual backend failed or returned an empty result**. The runner does not simulate a provider, add a test endpoint, alter fixture records or claim exhaustive coverage of every loading requirement. Independent region fetches, chat draft preservation, absent conversation history and fatal prerequisites remain requirements requiring their own affected-owner verification when changed. Unknown-data exemplars reserve realistic fixture geometry; screenshots still require human review for wrapping and visual parity.

Generated projects inherit the specs and procedure independently. Dashboard profiles include the auth/record cases; profiles without dashboard routes omit all case modules and report the pilot intentionally omitted without importing unavailable areas.

## Related checks

Run `verify:component-skeletons` for shared skeleton owners, `verify:route-skeletons` for route boundary ownership, and `verify:entity-skeletons` when entity geometry changes. Run the changed owner's focused Storybook tests and compare ready/loading screenshots at the affected widths. Run `verify:forms` after changes that touch auth/form presentation to confirm submission feedback remains owned by its action.
