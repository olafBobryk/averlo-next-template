# Artifact: Metadata SEO Contract

Status: planned

Role: template

Guide: ../_guides/artifacts/artifact.md

## Purpose

Record metadata and SEO source truth, route metadata ownership, social preview
defaults, and verification gates for template instances.

## Source Rows

| Source | Role | Status | Notes |
| --- | --- | --- | --- |
| Brand/domain source | Global metadata truth | planned | Record supplied source or human gate. |
| Icon assets | Favicon/app/manifest icons | planned | Record existing files or missing assets. |
| Route content source | Route title/description source | planned | Static and Payload-backed routes should both fit. |
| Social preview source | Open Graph/Twitter defaults | planned | Record supplied image or missing image gate. |

## Verification Rows

| Check | Status | Notes |
| --- | --- | --- |
| Manifest/icon resources | planned | Check resources exist or record gate. |
| Route metadata output | planned | Verify representative routes when available. |
| Social preview defaults | planned | Verify source-backed defaults or gates. |
| External SEO settings | gated | Domain, analytics, and search-console changes are outside scaffold scope. |

## Strip Rules

- Do not store production aliases, analytics IDs, search-console settings,
  private social assets, account IDs, thread IDs, run IDs, or implementation
  status in this scaffold artifact.
- Do not couple metadata ownership to one content mode.
