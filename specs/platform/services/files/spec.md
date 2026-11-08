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

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/lib/auth/AGENTS.md` and `plugins/averlo/README.md` (origin/main `3fd01907`) with no other spec home. They are FR-004 and FR-005, with their meaning kept; authorization, opaque references, bounded signed access and explicit cleanup were already FR-001 to FR-003.

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
