# Template Intelligence Ledger

## Purpose

- Goal: Add a prunable internal template-intelligence surface backed by a generated local repo index.
- Success criteria: The index generates deterministically, the internal visualizer renders it, `--no-intelligence` removes the feature, and verification passes in an isolated worktree.
- Ledger owner: Codex
- Last updated: 2026-05-23

## Operating Rules

- Default autonomy: Proceed within planned chunks.
- Human gates: Stop before external visualization packages, broader navigation changes, committed generated artifacts, secret scanning, or external services.
- Verification baseline: `npm run intelligence:generate`, `npm run lint`, `npm run build`, prune dry-run, disposable prune verification, browser check on the agent automation URL.
- Handoff file: `docs/worklogs/template-intelligence-handoff.md`

## Status Legend

- `queued`: not started
- `in_progress`: actively being worked
- `blocked`: cannot proceed without external fix or missing dependency
- `needs_human`: decision gate reached
- `fixed`: implementation or review pass complete, not yet verified
- `verified`: checks passed for the chunk
- `signed_off`: human accepted the chunk

## Chunks

| Chunk | Status | Owner/Audience | Scope | Acceptance Criteria | Verification | Notes |
|---|---|---|---|---|---|---|
| 1. Worktree + Ledger Setup | verified | Maintainer/agent | Isolated worktree, branch, ledger, handoff, dev preview | Worktree exists on `codex/template-intelligence`; agent server prints preview URLs | `npm run dev:agent -- --dry-run`; long-lived `npm run dev:agent` | Worktree created at `.worktrees/template-intelligence`; preview started on port 3011 |
| 2. Generator + Artifact Contract | verified | Maintainer/agent | Deterministic scanner and ignored JSON artifact | `.template-intelligence/index.json` generates and remains untracked | `npm run intelligence:generate`; `git status --short --ignored` | Generated 226 files and 8 concepts; artifact is ignored |
| 3. Internal Visualizer | verified | Maintainer/agent | `/internal/intelligence` page and server-side reader | Generated and missing-index states render | Browser check on automation URL | Generated state shows heading, graph, and SVG; missing state shows generation command |
| 4. Prune Integration | verified | Template clone maintainer | `--no-intelligence` optional surface removal | Prune rewrites central files and removes feature scripts/docs/source | Dry-run and disposable real prune | Disposable prune completed and built successfully |
| 5. Docs + Verification | verified | Future maintainer/agent | Docs, handoff, final checks | Docs explain local generated artifact and UA boundary; checks pass | Lint, build, browser check | Understand-Anything kept external and `.understand-anything/` ignored |
| 6. Graph Hardening | verified | Maintainer/agent | Richer graph interaction, responsive canvas, data/detail rail, ledger updates | Graph uses accessible concept buttons, query state, selected detail, strongest links, and mobile-safe canvas | Lint, build, prune dry-run, disposable prune, browser DOM checks | Screenshot at `/tmp/template-intelligence-preview-hardened.png` |

## Decisions

| Date | Chunk | Decision | Rationale | Status |
|---|---|---|---|---|
| 2026-05-23 | 1 | Use a prunable internal surface with generated local index | Matches existing optional internal surfaces while keeping Understand-Anything external | accepted |
| 2026-05-23 | 2 | Add `predev`, `predev:user`, `predev:agent`, and `prebuild` generation hooks | Covers all repo dev server entrypoints plus production build | accepted |
| 2026-05-23 | 3 | Use a dependency-free custom graph | Satisfies the pilot without crossing the external-package gate | accepted |
| 2026-05-23 | 6 | Render graph nodes as HTML controls over presentational SVG edges | Keeps selection accessible and labels readable while preserving weighted graph visuals | accepted |
| 2026-05-23 | 6 | Use a horizontal graph canvas on narrow screens | Prevents label clipping and preserves node readability on mobile widths | accepted |

## Findings

| Date | Chunk | Finding | Severity | Follow-up |
|---|---|---|---|---|
| 2026-05-23 | 1 | Repo has `dev:agent` but no `wt:*` scripts | low | Use direct `git worktree` commands |
| 2026-05-23 | 4 | Existing prune fallback renderer reused header nav entries for footer nav entries | medium | Fixed renderer to emit footer-safe links without `sections` |
| 2026-05-23 | 5 | Worktree installs trigger Next workspace-root warnings because the main checkout also has a lockfile | low | Warning only; builds still pass |
| 2026-05-23 | 6 | Mobile-width DOM check found concept buttons could overflow the graph bounds | medium | Reworked graph viewport into a scrollable canvas; follow-up DOM check found zero overflowing graph buttons |

## Verification Log

| Date | Chunk | Command/Check | Result | Evidence |
|---|---|---|---|---|
| 2026-05-23 | 1 | `npm run dev:agent -- --dry-run` | passed | Printed URL `http://localhost:3011` and Automation URL |
| 2026-05-23 | 2 | `npm run intelligence:generate` | passed | Generated `.template-intelligence/index.json` with 226 files and 8 concepts |
| 2026-05-23 | 2 | `git status --short --ignored` | passed | `.template-intelligence/` listed as ignored, not tracked |
| 2026-05-23 | 4 | `npm run prune:template -- --dry-run --no-intelligence` | passed | Planned expected route/source/docs/script removals |
| 2026-05-23 | 4 | Disposable `npm run prune:template -- --yes --no-intelligence` | passed | Built successfully after pruning; `/internal/intelligence` absent from route list |
| 2026-05-23 | 5 | `npm run lint` | passed | Biome checked 239 files |
| 2026-05-23 | 5 | `npm run build` | passed | Build generated `/internal/intelligence` route |
| 2026-05-23 | 5 | Browser check on `http://localhost:3011/internal/intelligence?motion=off&reveal=off` | passed | Heading, graph heading, and relationship SVG found |
| 2026-05-23 | 5 | Missing-index browser check | passed | Missing state and `npm run intelligence:generate` command found |
| 2026-05-23 | 6 | Browser graph DOM check | passed | Search input, SVG, selected buttons, and Strongest Links section found |
| 2026-05-23 | 6 | Mobile viewport DOM check at 390px | passed | Scrollable graph canvas present; 8 graph buttons; zero graph button overflow |
| 2026-05-23 | 6 | Disposable prune after worklog owned-path update | passed | Pruned worklogs and built successfully |

## Next Handoff

- Current chunk: complete
- Next task: Human review or commit/publish flow.
- Stop conditions: External package, broader nav architecture, committed generated artifact, or secret/env scanning.
