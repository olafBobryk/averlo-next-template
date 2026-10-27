# private-file-access Specification

## Purpose

Keep private file access authorized and bounded through upload, reference resolution, replacement and deletion without exposing provider credentials.

## Requirements

### Requirement: Authorize file lifecycle boundaries
Private upload, metadata resolution, download, replacement and deletion SHALL enforce the owning resource's authorization and required metadata validation on the server. Possession of a client reference SHALL NOT substitute for access checks.

#### Scenario: Resolve another organization's file
- **WHEN** a user requests a private file outside their authorized resource context
- **THEN** neither file content nor private metadata is disclosed

### Requirement: Opaque references and bounded access
Private files SHALL use opaque application references and short-lived authorized signed access URLs. Provider secrets SHALL remain server-owned. Provider-specific storage records SHALL be resolved before reaching the frontend contract.

#### Scenario: Open an authorized private file
- **WHEN** an authorized user resolves a private file
- **THEN** the client receives only the permitted metadata and bounded access needed for that file

### Requirement: Explicit replacement and cleanup
File replacement and deletion SHALL follow the configured provider's explicit lifecycle, including applicable cleanup of superseded objects.

#### Scenario: Replace a private asset
- **WHEN** an authorized replacement completes
- **THEN** the resource points to the new asset and superseded-object cleanup follows its provider lifecycle without granting broader access
