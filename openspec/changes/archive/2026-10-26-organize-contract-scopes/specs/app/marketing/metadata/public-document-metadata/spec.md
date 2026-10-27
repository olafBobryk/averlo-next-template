## Purpose

Provide public title conventions and metadata from the same authoritative page read, following shared canonical identity under `app/shared/frontend/navigation/document-metadata`.

## ADDED Requirements

### Requirement: Public title policy
Public titles SHALL use app name followed by route name, with the public home using app name alone.

#### Scenario: Public page titles
- **WHEN** a public home or another public content route is requested
- **THEN** home uses the app name alone and other public titles use app name followed by route name

### Requirement: Metadata and body share authoritative content
Metadata and page body SHALL use the same resolved authoritative content read. Missing, invalid or unpublished authoritative content SHALL NOT produce metadata for a stale fallback page under `app/marketing/content-sources/source-resolution`.

#### Scenario: Authoritative content changes during a request
- **WHEN** metadata and body resolve for one authoritative page response
- **THEN** they reflect the same resolved document rather than separate inconsistent reads
