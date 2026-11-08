# Specification: Marketing content sources

**Spec path**: `specs/platform/surfaces/marketing/content-sources`

**Migrated from**: OpenSpec `app/marketing/content-sources/source-resolution` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/content-sources.md](../../../../../docs/testing/content-sources.md)

## Purpose

Keep marketing content source-neutral and predictable across static, guarded CMS-ready and explicitly activated authoritative CMS modes.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Explicit source modes

Static mode MUST operate without a CMS runtime dependency. CMS-ready mode MUST keep admin and API routes unavailable with static fallback authoritative. CMS-powered mode MUST activate only after schema, service, seed, readback and parity gates succeed.

**Scenario: Unconfigured CMS-ready project**

- **When** a CMS-ready project has not completed activation
- **Then** guarded CMS entry points do not imply availability and public content continues through its permitted static fallback

### FR-002: One normalized frontend contract

Static and provider content MUST resolve on the server into the same source-neutral page, site-layout and section contracts. Provider-specific records and metadata MUST NOT require a second frontend layout implementation.

**Scenario: Switch an approved page source**

- **When** a page moves from static content to an activated provider source
- **Then** equivalent normalized content renders through the same frontend section and shell contracts

### FR-003: Preserve recovery data until verified activation

The static seed baseline and permitted recovery source MUST remain available until successful provider readback and parity verification establish activation.

**Scenario: Seed without successful readback**

- **When** provider seeding finishes but readback or parity fails
- **Then** activation is incomplete and the permitted recovery baseline is retained

### FR-004: Authoritative failure is not silent fallback

After a source is authoritative, missing, unpublished, invalid or failed authoritative content MUST follow its explicit unavailable/error behavior rather than silently substituting stale static content. Authentication MUST protect guarded authoring boundaries.

**Scenario: Unpublished authoritative document**

- **When** an activated authoritative page is unpublished or invalid
- **Then** its public response follows authoritative unavailability instead of quietly displaying the old static document
