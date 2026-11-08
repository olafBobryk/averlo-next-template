# Specification: Private file access

**Spec path**: `specs/platform/services/files`

**Migrated from**: OpenSpec `app/shared/services/files/private-file-access` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/identity.md](../../../../docs/testing/identity.md)

## Purpose

Keep private file access authorized and bounded through upload, reference resolution, replacement and deletion without exposing provider credentials.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Authorize file lifecycle boundaries

Private upload, metadata resolution, download, replacement and deletion MUST enforce the owning resource's authorization and required metadata validation on the server. Possession of a client reference MUST NOT substitute for access checks.

**Scenario: Resolve another organization's file**

- **When** a user requests a private file outside their authorized resource context
- **Then** neither file content nor private metadata is disclosed

### FR-002: Opaque references and bounded access

Private files MUST use opaque application references and short-lived authorized signed access URLs. Provider secrets MUST remain server-owned. Provider-specific storage records MUST be resolved before reaching the frontend contract.

**Scenario: Open an authorized private file**

- **When** an authorized user resolves a private file
- **Then** the client receives only the permitted metadata and bounded access needed for that file

### FR-003: Explicit replacement and cleanup

File replacement and deletion MUST follow the configured provider's explicit lifecycle, including applicable cleanup of superseded objects.

**Scenario: Replace a private asset**

- **When** an authorized replacement completes
- **Then** the resource points to the new asset and superseded-object cleanup follows its provider lifecycle without granting broader access
