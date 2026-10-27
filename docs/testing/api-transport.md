# API transport verification

## Run transport checks

```sh
npx tsx --test src/lib/api/createApiClient.test.ts
npx biome check src/lib/api/createApiClient.ts src/lib/api/createApiClient.test.ts src/lib/api/createMockFetch.ts
if [ -f src/lib/api/auth.test.ts ]; then
  npx tsx --test src/lib/api/auth.test.ts
  npx biome check src/lib/api/auth.ts src/lib/api/auth.test.ts
fi
npm run typecheck
```

The authority is [API transport](../../openspec/specs/app/shared/services/transport/api-transport/spec.md);
[API AGENTS](../../src/lib/api/AGENTS.md) owns client/wrapper/export structure.
The focused tests perform no external requests.

## Outcome contract

The tests exercise shared base URL resolution, headers, JSON serialization and
request options through `createApiClient` with injected transport. They cover typed
success, HTTP failure with safe payload context, malformed non-success and
malformed success. Network `TypeError` and cancellation `AbortError` preserve their
native identity both during fetch and while reading a response body; the request's
signal is forwarded to the fetcher. These outcomes
have no HTTP status until a response exists. Do not invent a uniform HTTP envelope
for native transport failures.

In dashboard profiles, `src/lib/api/auth.test.ts` exercises the application
`fetchSession` endpoint wrapper using the existing
`createMockFetch` transport through its global-fetch seam. There is no parallel
demo endpoint implementation. When changing another wrapper, exercise that actual
wrapper with an injected real-shaped success and relevant HTTP, malformed,
network and cancellation failures. The focused session-wrapper cases verify that
malformed JSON/null produces `AuthApiError`. Preserve its documented typed
result/error contract; the factory tests do not prove every endpoint automatically uses it.

## Dependency and secret review

Inspect only the changed client, selected wrapper, `createMockFetch`, deliberate
public exports and calling server route/action/adapter. Shared base, headers,
parsing, errors, auth/retry and cancellation stay at the selected client boundary;
do not duplicate them in endpoints or scatter raw fetch where a wrapper exists.
Make browser defaults explicit and inject service/environment assumptions.

Confirm public client dependencies contain no UI imports, notification dispatch,
navigation or visual mutations and no server-only credentials, privileged headers
or service clients. The caller owns user-facing feedback; safe transport errors
provide context without provider secrets. Run focused lint/typecheck for public
contract changes. Submission guards use the shared
[protection procedure](forms.md#submission-protection). For an explicitly installed
delivery feature, also read `docs/testing/contact-delivery.md`. Never print env contents or
secret-bearing request headers while inspecting the boundary.
