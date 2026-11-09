# Specification: Private file access

**Spec path**: `specs/platform/services/files`

**Status**: Accepted, living

**Verified by**: [docs/testing/identity.md](../../../../docs/testing/identity.md)

## Purpose

Keep private file access authorized and bounded through upload, reference resolution, replacement and deletion without exposing provider credentials.

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

### FR-004: Storage is never silently selected

Storage MUST NOT be silently selected or provisioned. `configured: false` is an intentional unavailable state. Enabling a provider is an explicit instance-level decision followed by the conditional lifecycle checks in `docs/testing/identity.md`.

### FR-005: Read-only file viewing

`FileViewer` MUST stay read-only PDF and raster inspection. Dashboard file inputs delegate through `FilePreviewProvider` to one `FileViewerLayout` (a resizable side panel, a full-screen modal at narrow widths). Upload, authorization and fresh access URLs stay in caller adapters. It is not an editable-document or file-management feature.
