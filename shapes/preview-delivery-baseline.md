# Shape: Preview Delivery Baseline

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Create the review-deployment and preview handoff boundary before page-system
workers branch. This shape makes the remote/upstream source of truth, preview
platform linkage, and human/agent review URL contract visible without turning a
template pass into production deployment work.

## Workpiece References

- `workpieces/preview-remote-source-of-truth.md`: records Git remote,
  upstream, branch, and source-of-truth expectations before preview setup.
- `workpieces/production-preview-setup.md`: records Vercel or equivalent
  production-like preview linkage, deployment state, and missing access gates.
- `workpieces/preview-handoff-contract.md`: records how workers report local,
  remote, route, anchor, and review URLs after preview setup.

## Fixed Decisions

- Preview setup starts after reusable UI readiness and before shell, metadata,
  or first static page workers branch.
- This shape owns review deployment readiness, not production deployment,
  custom domains, analytics, SEO completion, provider setup, or page content.
- Missing platform access, project linkage, env, or source remote decisions are
  human gates, not values for agents to guess.
- Local agent previews remain valid for worker verification even when remote
  preview setup is gated.

## Autonomous Decisions

- Agents may inspect non-secret remote/upstream state and existing preview
  platform linkage.
- Agents may record a preview gate when account, env, project creation, or
  source-of-truth decisions are missing.
- Agents may verify and report reachable preview URLs when already available.

## Escalation Triggers

- Stop before exposing secrets or deploy hooks.
- Stop before creating paid/external resources without explicit direction.
- Stop before production deploys, domain cutover, analytics/search-console
  changes, or production environment changes.
- Stop when the intended source remote or preview platform owner is ambiguous.

## Return Evidence

- `artifacts/preview-delivery-contract.md` names the preview setup and handoff
  contract.
- The dashboard shows preview delivery before the first page-system fanout.
- The preview-delivery checkpoint is visible outside this shape before shell,
  metadata, and first static page workers branch.

## Run References

- none

## Commit Evidence

- none
