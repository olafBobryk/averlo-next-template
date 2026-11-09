# Specification: Delivery and submission protection

**Spec path**: `specs/platform/services/delivery`

**Status**: Accepted, living

**Verified by**: `docs/testing/contact-delivery.md` when installed

**Operated by**: `.specify/workflows/contact-delivery/` (provisioning, recipients, sends and deployment for an Averlo-managed project)

## Purpose

This owner has two sections. **Contact delivery**: Define truthful, private behavior for explicitly configured contact delivery. **Submission protection**: Protect explicitly exposed submission boundaries through reusable server guards without inventing blanket dashboard policy or new abuse thresholds. **Averlo-managed contact delivery** (FR-013 to FR-017) refines contact delivery for an independent project that explicitly enables it.

## Clarifications

### Session 2026-11-09 (contact-form skill retired)

- **Q: Where did the `$averlo:contact-form` skill's conventions go?**
  - A: Olaf retired the skill. Its delivery conventions that this spec lacked are FR-013 to FR-017 and apply to Averlo-managed contact delivery in an independent project; its setup procedure is the `contact-delivery` workflow, and its script helpers are `create-averlo contact audit|provision|sync`. Its form UX fallback was already covered by `specs/platform/data/forms`, and its logging rule was already FR-003 and FR-008, so neither was copied. Template fixture forms stay no-delivery (FR-009).

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

## Requirements: Averlo-managed contact delivery

These refine FR-001 to FR-003 when an independent project explicitly enables Averlo-managed delivery through the `contact-delivery` workflow.

### FR-013: Sender and reply path

The sender MUST be the site name inferred from the project, at `developer@averlo.co`. `replyTo` MUST be the submitter's validated address, so replying reaches the enquirer.

**Scenario: Client replies to an enquiry**

- **When** a client replies to a delivered website enquiry
- **Then** the reply is addressed to the submitter, not to `developer@averlo.co`

### FR-014: Professional client-facing notification

The notification MUST identify itself as a website enquiry, summarize the contact and message details, explain that replying continues the conversation and end with `Delivered by Averlo`. The reusable notification template MUST NOT contain sandbox, test or development language.

**Scenario: Production enquiry**

- **When** a valid enquiry is delivered to the client
- **Then** it reads as a professional website enquiry ending with `Delivered by Averlo` and mentions no test or sandbox

### FR-015: Missing configuration is HTTP 503

When the sending credential or recipients are absent, the endpoint MUST respond with HTTP `503` (FR-001's unavailable result) and send nothing.

**Scenario: Credential absent**

- **When** a delivery-enabled endpoint runs without its sending credential or recipients
- **Then** it returns `503` without implying delivery

### FR-016: Explicit production recipients

Production recipients MUST be configured explicitly as the client's address plus `bobryk.olaf@gmail.com`, trimmed and deduplicated (FR-002). A recipient MUST NOT be inferred from a submitter, and the `bobryk.olaf@gmail.com` copy MUST NOT be removed silently.

**Scenario: Submitter supplies an address**

- **When** a submission's email field names any address
- **Then** that address becomes only the reply path and never a recipient

### FR-017: Sending credentials only in Production

The project's domain-restricted sending credential MUST be configured only in the Production deployment environment and the project's ignored local `.env.local`, never in Preview or Development. The Resend management credential MUST NOT be stored in a repository or deployment environment and MUST NOT send email.

**Scenario: Preview deployment**

- **When** a Preview or Development deployment handles a contact submission
- **Then** it has no sending credential and returns `503` (FR-015)
