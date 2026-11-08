# Specification: Delivery and submission protection

**Spec path**: `specs/platform/services/delivery`

**Migrated from**: OpenSpec `app/shared/services/delivery/contact-delivery`, `app/shared/services/delivery/submission-protection` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: `docs/testing/contact-delivery.md` when installed

## Purpose

This owner has two sections. **Contact delivery**: Define truthful, private behavior for explicitly configured contact delivery. **Submission protection**: Protect explicitly exposed submission boundaries through reusable server guards without inventing blanket dashboard policy or new abuse thresholds.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged. The two OpenSpec capabilities merged into one owner with two sections; contact delivery keeps FR-001 to FR-003 and submission protection continues at FR-004.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/lib/api/AGENTS.md`, `src/lib/forms/AGENTS.md` and the `src/components/ui/input/**/AGENTS.md` files (origin/main `3fd01907`) with no other spec home. They are FR-008 to FR-012, with their meaning kept. Server normalization, server-owned recipients and credentials, the reply path, guards before downstream work, the neutral honeypot and server attachment validation were already FR-001 to FR-007.

## Requirements: contact delivery

### FR-001: Delivery is explicitly configured and server-owned

Delivery-enabled contact submissions MUST normalize and validate on the server and pass applicable submission protection before delivery. Recipients and credentials MUST be server-owned. Missing required configuration MUST produce an unavailable result.

**Scenario: Delivery configuration missing**

- **When** a delivery-enabled endpoint lacks required configuration
- **Then** it reports unavailability without implying successful delivery

### FR-002: Recipient-independent message content

Configured recipients MUST be trimmed and deduplicated outside message construction. The normalized message MUST communicate source and contact details with the configured reply path, without embedding recipient-specific assumptions.

**Scenario: Multiple configured recipients**

- **When** equivalent configured addresses include whitespace or duplicates
- **Then** normalized unique recipients receive the same appropriate message content through the configured delivery boundary

### FR-003: Truthful private delivery outcomes

Delivery success MUST reflect the configured provider outcome. Provider failure MUST return a generic operational error without exposing credentials or provider internals. Logs MUST omit personal message content, addresses, recipients, credentials and personal provider-response data. Form preservation, duplicate protection and retry MUST follow `specs/platform/data/forms`.

**Scenario: Provider rejects delivery**

- **When** the delivery provider rejects a valid guarded submission
- **Then** no delivery success is claimed and safe recoverable feedback retains form values as required

## Requirements: submission protection

### FR-004: Apply guards at exposed boundaries

Public, externally delivered, attachment-bearing or explicitly abuse-sensitive submissions MUST run their applicable server guards before downstream work. Ordinary authenticated dashboard mutations MUST NOT gain blanket protection policy merely from this capability.

**Scenario: Guarded public submission**

- **When** a public submission reaches its endpoint
- **Then** applicable guards execute before delivery, persistence or other downstream effects

### FR-005: Honeypot responses remain neutral

A triggered honeypot MUST perform no downstream work and MUST return the guard's neutral outward result without revealing detection.

**Scenario: Filled hidden field**

- **When** a submission populates the honeypot field
- **Then** downstream work does not run and the response does not disclose bot detection

### FR-006: Server-owned attachment validation

Applicable file submissions MUST validate authorization, type, size and required content checks on the server and normalize accepted files before downstream use. Client checks MUST NOT replace those checks.

**Scenario: Bypass client file validation**

- **When** a direct request supplies an unauthorized or invalid attachment
- **Then** the server rejects it before downstream processing

### FR-007: Policy-owned throttling and private diagnostics

Cooldown and rate-limit behavior MUST reuse established policy. A missing threshold MUST require an explicit policy decision rather than an invented limit. Provider limits MUST complement applicable application guards. Guard diagnostics MUST NOT log personal submission content.

**Scenario: Existing cooldown is active**

- **When** a guarded endpoint receives another submission inside its established cooldown
- **Then** the existing policy determines the safe response without exposing personal content in diagnostics

## Requirements: privacy, scope and operational gates

### FR-008: Nothing personal leaves the server

Delivery and guard code MUST NOT log or return personal submission content, addresses, recipients, secrets or provider responses containing personal data.

### FR-009: Operational gates are separate

An implementation or verification task alone MUST NOT authorize provisioning, recipient setup, inbox confirmation, deployment configuration or an intentional send; each is a separate operational gate.

### FR-010: Client conveniences are not authority

Disabled buttons, delays, hidden fields, `accept` hints and client file filtering are client conveniences, never server authorization; the `SpamProtectionFields` honeypot is not a security boundary. `validateFiles` checks only the declared extension or MIME type, count and bytes; the consuming server owner authorizes, inspects content and signatures, and normalizes.

### FR-011: Internal forms need an explicit reason

An internal form MUST gain submission protection only from an explicit task, threat model or owner requirement.

### FR-012: Established cooldowns and rate-limit decisions

Support keeps its existing 30-second cooldown; contact adds no threshold. Before selecting, provisioning or tuning a provider rate limit, the repository policy MUST be found first; if none exists and the choice affects throttling, cost or service limits, an explicit user decision is required and no value is invented (FR-007).
