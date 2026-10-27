# Contact delivery delta

## Purpose

Define truthful, private behavior for explicitly configured contact delivery while preserving the separate no-delivery contract of fixture forms.

## ADDED Requirements

### Requirement: Delivery is explicitly configured and server-owned
Delivery-enabled contact submissions SHALL normalize and validate on the server and pass applicable submission protection before delivery. Recipients and credentials SHALL be server-owned. Missing required configuration SHALL produce an unavailable result. Fixture contact and support forms SHALL retain their no-email behavior under `data-lifecycle/form-behavior`.

#### Scenario: Delivery configuration missing
- **WHEN** a delivery-enabled endpoint lacks required configuration
- **THEN** it reports unavailability without implying delivery or falling back to a fixture success

### Requirement: Recipient-independent message content
Configured recipients SHALL be trimmed and deduplicated outside message construction. The normalized message SHALL communicate source and contact details with the configured reply path, without embedding recipient-specific assumptions.

#### Scenario: Multiple configured recipients
- **WHEN** equivalent configured addresses include whitespace or duplicates
- **THEN** normalized unique recipients receive the same appropriate message content through the configured delivery boundary

### Requirement: Truthful private delivery outcomes
Delivery success SHALL reflect the configured provider outcome. Provider failure SHALL return a generic operational error without exposing credentials or provider internals. Logs SHALL omit personal message content, addresses, recipients, credentials and personal provider-response data. Form preservation, duplicate protection and retry SHALL follow `data-lifecycle/form-behavior`.

#### Scenario: Provider rejects delivery
- **WHEN** the delivery provider rejects a valid guarded submission
- **THEN** no delivery success is claimed and safe recoverable feedback retains form values as required

