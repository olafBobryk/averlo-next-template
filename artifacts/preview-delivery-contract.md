# Artifact: Preview Delivery Contract

Status: planned

Role: template

Guide: ../_guides/artifacts/artifact.md

## Purpose

Record the review-deployment and preview handoff contract before page-system
workers branch.

## Source Truth Fields

| Field | Value | Status | Notes |
| --- | --- | --- | --- |
| Git remote | TBD | planned | Record source-of-truth remote or human gate. |
| Upstream branch | TBD | planned | Record branch workers should target or gate. |
| Preview platform | TBD | planned | Vercel is common, but project choice owns this. |
| Preview URL | TBD | planned | Verify before reporting live. |
| Local preview fallback | `npm run dev:agent -- --random` | planned | Use for worker verification when remote preview is gated. |

## Handoff Fields

| Field | Requirement |
| --- | --- |
| Checkout path | Absolute worktree/check-out path. |
| Branch | Active branch. |
| Local URL | Verified local route when available. |
| Remote URL | Verified remote preview route, or explicit gate. |
| Route / anchor | Exact route and section anchor when section-scoped. |
| Notes | Missing access, missing anchor, or dead preview findings. |

## Strip Rules

- Do not store secrets, deploy hooks, tokens, preview metadata files, thread
  IDs, PIDs, or project-specific account details in this scaffold artifact.
- Do not treat a template preview setup pass as production deployment or domain
  cutover.
