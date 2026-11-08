# Specification: Document metadata

**Spec path**: `specs/platform/navigation/metadata`

**Migrated from**: OpenSpec `app/shared/frontend/navigation/document-metadata` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/routes-and-metadata.md](../../../../docs/testing/routes-and-metadata.md)

## Purpose

Provide shared canonical and social destination consistency, centrally derived app identity and private route title/indexing conventions across installed surfaces.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Private title and indexing policy

Dashboard and authentication titles MUST use route name followed by app name and private noindex/nofollow directives. Internal development pages MUST use route-first private metadata.

**Scenario: Private page title and indexing**

- **When** a dashboard, authentication or internal development page is requested
- **Then** its title uses route name followed by app name and private noindex/nofollow directives

### FR-002: Canonical destination consistency

Canonical, robots, Open Graph and social metadata MUST agree with the installed route identity and its indexing policy. Canonical destinations MUST NOT inherit incidental query parameters or arbitrary CMS route identity. Utility metadata MUST remain code-owned until explicitly migrated.

**Scenario: Public route with incidental query parameters**

- **When** a public page is requested with tracking or unrelated query parameters
- **Then** its canonical and social destination remain the installed canonical route

### FR-003: App identity is centrally derived

Page metadata MUST derive shared app identity through the canonical metadata owner rather than hardcoding independent app names in individual pages.

**Scenario: Shared app name changes**

- **When** the configured app identity changes
- **Then** participating route metadata uses that identity without page-specific name replacements
