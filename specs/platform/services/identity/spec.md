# Specification: Access and membership

**Spec path**: `specs/platform/services/identity`

**Migrated from**: OpenSpec `app/shared/services/identity/access-and-membership` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/identity.md](../../../../docs/testing/identity.md)

## Purpose

Preserve server-owned identity, organization and platform authorization across protected reads, changes and account lifecycle flows.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Server authorization at every protected boundary

Protected reads and mutations MUST resolve the current session and required organization membership on the server. Only active authorized context MUST grant access. Global identity, organization role and platform access MUST remain distinct; organization administration MUST NOT grant platform access and client visibility MUST NOT authorize execution.

**Scenario: Stale organization context**

- **When** a signed-in user submits a change for an organization in which they lack active membership
- **Then** the server denies it without applying the change, even if the client displayed the action

### FR-002: Access denial remains usable

Protected UI receiving an unauthorized or forbidden outcome MUST follow its supported authentication or denial route behavior rather than rendering blank content or remaining permanently loading.

**Scenario: Access expires during a protected read**

- **When** a protected read returns an unauthorized or forbidden outcome
- **Then** the UI follows its supported access-recovery or denial behavior without becoming blank or permanently loading

### FR-003: Safe continuations and explicit authentication methods

Authentication MUST accept only safe supported continuation destinations. Optional sign-in methods MUST remain unavailable until explicitly configured.

**Scenario: Unsafe continuation**

- **When** a sign-in request supplies an unsupported external continuation
- **Then** successful sign-in uses a safe supported destination

**Scenario: Unconfigured optional method**

- **When** an optional sign-in method lacks configuration
- **Then** it cannot establish a session through an implied fallback

### FR-004: Invitation acceptance is deliberate and bounded

Invitation reads MUST NOT accept membership. Acceptance MUST require an explicit mutation that validates the token, intended recipient, organization, expiry, revocation and prior use. Reinvitation MUST invalidate the previous invitation as defined by the invitation owner.

**Scenario: View and accept an invitation**

- **When** an invitation is viewed and later explicitly accepted
- **Then** viewing makes no membership change and acceptance succeeds only after all invitation checks pass

**Scenario: Reuse a replaced invitation**

- **When** a recipient attempts acceptance with a revoked, consumed, expired or replaced invitation
- **Then** no membership is created from that invitation

### FR-005: Retain a verified sign-in identity

Account identity changes MUST NOT remove the last verified sign-in identity needed to retain account access.

**Scenario: Remove the last verified identity**

- **When** a user attempts to remove their only verified sign-in identity
- **Then** the server rejects the removal and the existing access path remains usable
