# Prune Reset Hardening Handoff

## Current Objective

Complete the prune reset hardening chunks so a renamed template instance can run
the lightweight prune path without package-name guard failures, stale smoke
routes, or retained intelligence references to removed route families.

## Current State

- Work is on branch `codex/thin-start-optional-cleanup`.
- Target ledger: `docs/worklogs/prune-reset-hardening-ledger.md`.
- Target handoff: `docs/worklogs/prune-reset-hardening-handoff.md`.
- Active chunk: none. PRH-C1, PRH-C2, and PRH-C3 are complete.

## Required Closeout

- Current template lint/build passed.
- Current template lightweight and static dry-runs passed.
- `npm run intelligence:query -- prune` returns the lightweight recipe.
- Disposable renamed instance `averlo-rebrand` applied the full lightweight
  prune and passed `verify:static`, `verify:build`, and `verify:smoke`.
- Retained route probes passed with internal routes explicitly enabled, and
  removed route-family probes returned 404.

## Notes for Next Agent

- Do not collapse the canonical default template into a pruned state.
- Do not treat thin-start as the lightweight route prune; thin-start is a
  separate primitive-surface activation command.
- Keep `verify:smoke`; prune should rewrite its route list to retained routes.
- The final disposable verification copy was
  `/tmp/verilo-prune-reset.ACGxLF`.
