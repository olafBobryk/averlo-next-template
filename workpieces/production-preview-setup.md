# Workpiece: Production Preview Setup

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record the production-like preview setup used for human review before major
page-system slices branch. Vercel is the common path for this template, but the
workpiece records the project-specific platform decision instead of assuming
one blindly.

## Acceptance

- Preview platform, project linkage, and deployment source are recorded or
  explicitly gated.
- A reachable preview URL is verified when already available.
- Missing platform access, project creation, env, or account decisions are
  recorded as human gates.
- Production deployment, custom domains, analytics, and provider setup remain
  out of scope.

## Tests

- Check available platform linkage without printing secrets.
- Verify the preview URL when one is available.
- Check gated setup records what decision or access is missing.

## Artifacts

- `artifacts/preview-delivery-contract.md`

## Commit Evidence

- none
