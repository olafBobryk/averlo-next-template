# Specification: API transport

**Spec path**: `specs/platform/services/transport`

**Status**: Accepted, living

**Verified by**: [docs/testing/api-transport.md](../../../../docs/testing/api-transport.md)

## Purpose

Make API outcomes consistent and testable while preserving server credential boundaries and frontend ownership of user-facing feedback.

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

### FR-004: Canonical endpoint wrappers

App code SHOULD call canonical endpoint wrappers rather than scattering raw `fetch`. A facade wrapper MUST be exposed only for intended cross-owner reuse.

### FR-005: Injected environment assumptions

Browser defaults MUST stay explicit. Project environment and service assumptions are injected rather than hardwired into generic factories.
