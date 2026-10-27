# submission-protection Specification

## Purpose

Protect explicitly exposed submission boundaries through reusable server guards without inventing blanket dashboard policy or new abuse thresholds.

## Requirements

### Requirement: Apply guards at exposed boundaries
Public, externally delivered, attachment-bearing or explicitly abuse-sensitive submissions SHALL run their applicable server guards before downstream work. Ordinary authenticated dashboard mutations SHALL NOT gain blanket protection policy merely from this capability.

#### Scenario: Guarded public submission
- **WHEN** a public submission reaches its endpoint
- **THEN** applicable guards execute before delivery, persistence or other downstream effects

### Requirement: Honeypot responses remain neutral
A triggered honeypot SHALL perform no downstream work and SHALL return the guard's neutral outward result without revealing detection.

#### Scenario: Filled hidden field
- **WHEN** a submission populates the honeypot field
- **THEN** downstream work does not run and the response does not disclose bot detection

### Requirement: Server-owned attachment validation
Applicable file submissions SHALL validate authorization, type, size and required content checks on the server and normalize accepted files before downstream use. Client checks SHALL NOT replace those checks.

#### Scenario: Bypass client file validation
- **WHEN** a direct request supplies an unauthorized or invalid attachment
- **THEN** the server rejects it before downstream processing

### Requirement: Policy-owned throttling and private diagnostics
Cooldown and rate-limit behavior SHALL reuse established policy. A missing threshold SHALL require an explicit policy decision rather than an invented limit. Provider limits SHALL complement applicable application guards. Guard diagnostics SHALL NOT log personal submission content.

#### Scenario: Existing cooldown is active
- **WHEN** a guarded endpoint receives another submission inside its established cooldown
- **THEN** the existing policy determines the safe response without exposing personal content in diagnostics
