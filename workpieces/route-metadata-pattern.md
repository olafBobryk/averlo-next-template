# Workpiece: Route Metadata Pattern

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Define how routes provide metadata while keeping page components independent
from a specific CMS, static data source, or provider implementation.

## Acceptance

- Route metadata ownership is separate from page component rendering.
- Static fallback and Payload-backed routes can share the same metadata
  contract shape.
- Route metadata gaps are explicit when source content is missing.

## Tests

- Check route metadata helpers or patterns are named.
- Check page components do not become the only metadata source of truth.

## Artifacts

- `artifacts/metadata-seo-contract.md`

## Commit Evidence

- none
