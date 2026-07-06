# Workpiece: Metadata Source Discovery

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Discover source truth for brand name, domain, icons, robots/indexing behavior,
route metadata, and social preview defaults before metadata implementation
decisions are made.

## Acceptance

- Metadata source rows identify existing repo files, supplied design/content
  sources, and explicit missing sources.
- Static, Payload-ready, and Payload-powered content modes remain compatible.
- Missing brand/domain/social/indexing source truth is recorded as a human
  gate.

## Tests

- Check metadata source rows in `artifacts/metadata-seo-contract.md`.
- Check missing source truth is gated instead of invented.

## Artifacts

- `artifacts/metadata-seo-contract.md`

## Commit Evidence

- none
