# Specification: Form behaviour

**Spec path**: `specs/platform/data/forms`

**Migrated from**: OpenSpec `app/shared/data-lifecycle/form-behavior` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/forms.md](../../../../docs/testing/forms.md)

## Purpose

Provide a consistent, accessible submission and recovery contract for complete forms, verified against real client and server boundaries.

This is the submission side of the data-lifecycle family. Initial and region loading belong to [`specs/platform/data/loading`](../loading/spec.md).

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Accessible field feedback

Forms MUST connect labels, required state, descriptions and validation errors to their actual controls. Invalid values MUST produce inline field feedback instead of browser warning bubbles or transient notifications.

**Scenario: Invalid submission**

- **When** a user submits missing or invalid required values
- **Then** invalid controls expose their errors accessibly and submission does not reach the server

**Scenario: Narrow viewport**

- **When** the form and its errors are displayed on a narrow viewport
- **Then** controls, feedback and submit actions remain usable without horizontal overflow

### FR-002: Native keyboard submission

Forms MUST use native form semantics, logical keyboard order and visible focus, and support keyboard submission through the same lifecycle as the submit button.

**Scenario: Keyboard submit**

- **When** a user activates the submit action with the keyboard
- **Then** the form starts its normal validated submission exactly once

### FR-003: Single pending submission

A form MUST reject duplicate starts synchronously, expose pending state on its submit action without losing its accessible label, and disable conflicting actions until the operation settles.

**Scenario: Repeated submission while pending**

- **When** repeated submit events occur before a delayed request settles
- **Then** only one request starts and the submit action is busy and unavailable

### FR-004: Server authority

The server MUST independently validate and normalize submitted values and enforce applicable authorization before performing a mutation. Client validation MUST NOT be sufficient authority.

**Scenario: Client validation bypass**

- **When** invalid values are sent directly to a submission endpoint
- **Then** the server rejects them without performing the requested mutation

**Scenario: Organization authorization**

- **When** a submission names a membership outside the authenticated user's active memberships
- **Then** the request is rejected without performing the requested mutation

### FR-005: Recoverable submission failure

Recoverable operational failures MUST appear once beside the affected form action, preserve non-sensitive values, unlock submission and permit retry. Field-specific server errors MUST be associated with their fields.

**Scenario: Failed request and retry**

- **When** a request fails and the user retries
- **Then** non-sensitive entered values remain, one local operational error is shown, and retry follows the same pending rules

### FR-006: Explicit success behavior

Forms MUST communicate one unambiguous result and retain values unless their specified success behavior requires clearing or navigation.

**Scenario: Successful form submission**

- **When** a valid submission succeeds
- **Then** one truthful result identifies its outcome and values follow the form's specified retention, clearing or navigation behavior

### FR-007: Authentication form recovery

Login MUST preserve email and clear the password after server rejection, show an inline operational error, and maintain server-owned authentication and safe continuation behavior.

**Scenario: Rejected credentials**

- **When** the server rejects login credentials
- **Then** the email remains, the password clears, an inline error appears, and the user can retry

**Scenario: Successful login**

- **When** valid credentials resolve an active organization
- **Then** the user is redirected once to the validated local continuation

**Scenario: Organization selection**

- **When** valid credentials require an organization choice
- **Then** login continues to organization selection with its safe continuation retained

**Scenario: Unsafe continuation**

- **When** a successful login includes an external continuation URL
- **Then** navigation stays on the application's safe local fallback
