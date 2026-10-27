# Document metadata delta

## Purpose

Provide consistent route-family titles, privacy directives and canonical/social identity from the same authoritative content used by the page.

## ADDED Requirements

### Requirement: Family title and indexing policy
Dashboard and authentication titles SHALL use route name followed by app name and private noindex/nofollow directives. Public titles SHALL use app name followed by route name, with the public home using app name alone. Internal development pages SHALL use route-first private metadata.

#### Scenario: Private and public page titles
- **WHEN** a user opens an authentication route and a public content route
- **THEN** each receives its family's title order and the private route is excluded from indexing and following

### Requirement: Canonical destination consistency
Canonical, robots, Open Graph and social metadata SHALL agree with the installed route identity and its indexing policy. Canonical destinations SHALL NOT inherit incidental query parameters or arbitrary CMS route identity. Utility metadata SHALL remain code-owned until explicitly migrated.

#### Scenario: Public route with incidental query parameters
- **WHEN** a public page is requested with tracking or unrelated query parameters
- **THEN** its canonical and social destination remain the installed canonical route

### Requirement: Metadata and body share authoritative content
Metadata and page body SHALL use the same resolved authoritative content read. Missing, invalid or unpublished authoritative content SHALL NOT produce metadata for a stale fallback page under `content/source-resolution`.

#### Scenario: Authoritative content changes during a request
- **WHEN** metadata and body resolve for one authoritative page response
- **THEN** they reflect the same resolved document rather than separate inconsistent reads

### Requirement: App identity is centrally derived
Page metadata SHALL derive shared app identity through the canonical metadata owner rather than hardcoding independent app names in individual pages.

#### Scenario: Shared app name changes
- **WHEN** the configured app identity changes
- **THEN** participating route metadata uses that identity without page-specific name replacements
