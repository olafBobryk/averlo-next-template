# Folder: `src/lib/api`

## Role
Reusable API transport and endpoint wrappers. This folder owns fetch clients, typed errors, endpoint helpers, and API-facing demo/test plumbing.

## Use This Folder When
- You are adding a new endpoint wrapper.
- You need a shared request client for the project backend or an external service.
- You need transport-level mocking that should stay compatible with real endpoint wrappers.

## Preferred Starting Points
- `src/lib/api/createApiClient.ts`: create a reusable client for project or external APIs.
- `src/lib/api/checkHealth.ts`: example endpoint wrapper shape.
- `src/lib/api/createMockFetch.ts`: transport-level mock fetch implementation.
- `src/lib/api/index.ts`: public export surface for API utilities.

## Invariants
- Endpoint wrappers should be thin and typed.
- Shared request behavior belongs in the client factory, not repeated in each endpoint file.
- Mocks should work with the same endpoint wrappers instead of creating separate demo-only call paths.
- API utilities should not import UI components or trigger UI side effects directly.

## Avoid
- Scattering raw `fetch(...)` calls across app code when an endpoint wrapper belongs here.
- Embedding project-only environment assumptions into generic helpers unless they are injected.
- Duplicating response parsing and error-shaping logic outside the shared client.
