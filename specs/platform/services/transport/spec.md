# Specification: API transport

**Spec path**: `specs/platform/services/transport`

**Migrated from**: OpenSpec `app/shared/services/transport/api-transport` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/api-transport.md](../../../../docs/testing/api-transport.md)

## Purpose

Make API outcomes consistent and testable while preserving server credential boundaries and frontend ownership of user-facing feedback.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Consistent request outcomes

Requests through a supported API client MUST apply its shared base, headers, response parsing, cancellation and typed error contract. Callers MUST receive typed data or errors rather than having to reinterpret inconsistent transport envelopes.

**Scenario: Rejected API response**

- **When** an API response indicates failure
- **Then** the caller receives the documented typed failure with enough safe context to choose its feedback

### FR-002: Replaceable transport with identical behavior

Tests and fixtures MUST be able to inject transport and environment assumptions while exercising the same request wrappers used by application callers.

**Scenario: Inject a failed transport**

- **When** a test substitutes a transport that rejects or returns an invalid response
- **Then** the normal parsing, cancellation and typed-error boundary remains exercised

### FR-003: Secrets and feedback remain with their owners

Sensitive provider credentials MUST remain on the server. Transport MUST NOT own application-specific notifications or route behavior; the initiating UI MUST translate safe outcomes into its lifecycle feedback.

**Scenario: Provider failure reaches a client**

- **When** a server provider request fails
- **Then** the client receives a safe failure without credentials and its initiating surface owns recovery feedback
