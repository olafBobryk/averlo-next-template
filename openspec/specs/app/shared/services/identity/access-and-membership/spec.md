# access-and-membership Specification

## Purpose

Preserve server-owned identity, organization and platform authorization across protected reads, changes and account lifecycle flows.

## Requirements

### Requirement: Server authorization at every protected boundary
Protected reads and mutations SHALL resolve the current session and required organization membership on the server. Only active authorized context SHALL grant access. Global identity, organization role and platform access SHALL remain distinct; organization administration SHALL NOT grant platform access and client visibility SHALL NOT authorize execution.

#### Scenario: Stale organization context
- **WHEN** a signed-in user submits a change for an organization in which they lack active membership
- **THEN** the server denies it without applying the change, even if the client displayed the action

### Requirement: Access denial remains usable
Protected UI receiving an unauthorized or forbidden outcome SHALL follow its supported authentication or denial route behavior rather than rendering blank content or remaining permanently loading.

#### Scenario: Access expires during a protected read
- **WHEN** a protected read returns an unauthorized or forbidden outcome
- **THEN** the UI follows its supported access-recovery or denial behavior without becoming blank or permanently loading

### Requirement: Safe continuations and explicit authentication methods
Authentication SHALL accept only safe supported continuation destinations. Optional sign-in methods SHALL remain unavailable until explicitly configured.

#### Scenario: Unsafe continuation
- **WHEN** a sign-in request supplies an unsupported external continuation
- **THEN** successful sign-in uses a safe supported destination

#### Scenario: Unconfigured optional method
- **WHEN** an optional sign-in method lacks configuration
- **THEN** it cannot establish a session through an implied fallback

### Requirement: Invitation acceptance is deliberate and bounded
Invitation reads SHALL NOT accept membership. Acceptance SHALL require an explicit mutation that validates the token, intended recipient, organization, expiry, revocation and prior use. Reinvitation SHALL invalidate the previous invitation as defined by the invitation owner.

#### Scenario: View and accept an invitation
- **WHEN** an invitation is viewed and later explicitly accepted
- **THEN** viewing makes no membership change and acceptance succeeds only after all invitation checks pass

#### Scenario: Reuse a replaced invitation
- **WHEN** a recipient attempts acceptance with a revoked, consumed, expired or replaced invitation
- **THEN** no membership is created from that invitation

### Requirement: Retain a verified sign-in identity
Account identity changes SHALL NOT remove the last verified sign-in identity needed to retain account access.

#### Scenario: Remove the last verified identity
- **WHEN** a user attempts to remove their only verified sign-in identity
- **THEN** the server rejects the removal and the existing access path remains usable
