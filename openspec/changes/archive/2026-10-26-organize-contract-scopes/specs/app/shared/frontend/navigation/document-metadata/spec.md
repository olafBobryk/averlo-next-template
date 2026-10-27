## Purpose

Provide shared canonical and social destination consistency, centrally derived app identity and private route title/indexing conventions across installed surfaces.

## ADDED Requirements

### Requirement: Private title and indexing policy
Dashboard and authentication titles SHALL use route name followed by app name and private noindex/nofollow directives. Internal development pages SHALL use route-first private metadata.

#### Scenario: Private page title and indexing
- **WHEN** a dashboard, authentication or internal development page is requested
- **THEN** its title uses route name followed by app name and private noindex/nofollow directives

### Requirement: Canonical destination consistency
Canonical, robots, Open Graph and social metadata SHALL agree with the installed route identity and its indexing policy. Canonical destinations SHALL NOT inherit incidental query parameters or arbitrary CMS route identity. Utility metadata SHALL remain code-owned until explicitly migrated.

#### Scenario: Public route with incidental query parameters
- **WHEN** a public page is requested with tracking or unrelated query parameters
- **THEN** its canonical and social destination remain the installed canonical route

### Requirement: App identity is centrally derived
Page metadata SHALL derive shared app identity through the canonical metadata owner rather than hardcoding independent app names in individual pages.

#### Scenario: Shared app name changes
- **WHEN** the configured app identity changes
- **THEN** participating route metadata uses that identity without page-specific name replacements
