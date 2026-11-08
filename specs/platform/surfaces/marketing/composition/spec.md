# Specification: Marketing composition

**Spec path**: `specs/platform/surfaces/marketing/composition`

**Migrated from**: OpenSpec `app/marketing/composition/marketing-composition` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/marketing-composition.md](../../../../../docs/testing/marketing-composition.md)

## Purpose

Render public pages as ordered semantic content within a shared shell and retain stable boundaries for source-backed review and maintenance.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Ordered semantic page content

Registered public content pages MUST render their normalized ordered sections through the marketing content contract. Sections MUST represent independently meaningful semantic regions with source-neutral authored fields rather than opaque whole-page payloads. Explicit utility-page exceptions MUST remain bounded to their purpose.

**Scenario: Render a multi-section public page**

- **When** an installed public content page is requested
- **Then** its registered ordered sections render through their corresponding owners and visible authored copy comes from the page data

### FR-002: Shared shell and navigation

Header, menus and footer MUST remain shared shell responsibilities using the same resolved layout data across desktop and compact presentations. Shell navigation MUST distinguish registered internal destinations from external links and supported fragments.

**Scenario: Compact shell navigation**

- **When** a public page changes to a compact viewport
- **Then** its shared shell preserves the same destination meaning and layout data without becoming a page-specific duplicate

### FR-003: Stable semantic review boundaries

Independently reviewed composition regions MUST retain stable semantic identities and review selectors. Content, shell and explicitly excluded regions MUST have distinct comparison boundaries; exclusions MUST NOT remove required production shell content.

**Scenario: Review content with an excluded approved header**

- **When** a source-backed content comparison excludes an already approved shared header
- **Then** content is compared within its declared boundary and the production header remains present and unchanged by that exclusion

### FR-004: Source fidelity and later reuse are distinct decisions

Source-backed composition MUST preserve approved hierarchy, assets, content boundaries and independent cases. Combining cases or changing shared owners for later reuse MUST require the applicable explicit systemization decision rather than being treated as a prerequisite for source fidelity.

**Scenario: Similar independent source cases**

- **When** two independent approved source cases resemble one another
- **Then** their distinct review boundaries remain until an explicit shared-owner decision authorizes consolidation
