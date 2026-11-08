# Specification: Public document metadata

**Spec path**: `specs/platform/surfaces/marketing/metadata`

**Migrated from**: OpenSpec `app/marketing/metadata/public-document-metadata` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/routes-and-metadata.md](../../../../../docs/testing/routes-and-metadata.md)

## Purpose

Provide public title conventions and metadata from the same authoritative page read, following shared canonical identity under `specs/platform/navigation/metadata`.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Public title policy

Public titles MUST use app name followed by route name, with the public home using app name alone.

**Scenario: Public page titles**

- **When** a public home or another public content route is requested
- **Then** home uses the app name alone and other public titles use app name followed by route name

### FR-002: Metadata and body share authoritative content

Metadata and page body MUST use the same resolved authoritative content read. Missing, invalid or unpublished authoritative content MUST NOT produce metadata for a stale fallback page under `specs/platform/surfaces/marketing/content-sources`.

**Scenario: Authoritative content changes during a request**

- **When** metadata and body resolve for one authoritative page response
- **Then** they reflect the same resolved document rather than separate inconsistent reads
