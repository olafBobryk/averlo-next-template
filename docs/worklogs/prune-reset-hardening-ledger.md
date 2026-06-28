# Prune Reset Hardening Ledger

## Purpose

Make RESET-style template imports prune cleanly after project identity rename,
with a documented lightweight instance path and no live-looking references to
removed route families.

## Operating Rules

- Keep the unpruned default template behavior unchanged.
- Treat lightweight route pruning and thin-start primitive activation as
  separate instance choices.
- Keep Payload optional: lightweight route pruning does not imply `--no-payload`.
- Preserve verification capability; rewrite route assumptions instead of
  deleting `verify:smoke`.

## Chunk Status

| Chunk | Status | Acceptance |
| --- | --- | --- |
| PRH-C1 Prune Guard + Lightweight Recipe | complete | Renamed package can run prune dry-run; canonical template mutation has explicit safety; docs contain exact lightweight recipe. |
| PRH-C2 Prune-Owned Source Rewrites | complete | Prune removes or rewrites smoke route assumptions and retained intelligence no longer trips removed-route assertions. |
| PRH-C3 Disposable RESET Simulation + Handoff | complete | Disposable renamed instance prunes successfully with the full lightweight command and optional static variant documented. |

## Decisions

- Replace the exact `package.json.name` prune guard with a generic template
  shape assertion based on expected files and npm scripts.
- Add inverted safety for the canonical `averlo-next-template` `main` checkout:
  dry-runs are allowed, but mutating prune requires `--confirm-template-root`.
- Document the official lightweight instance recipe as the full explicit route
  prune:

```bash
npm run prune:template -- --dry-run --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
npm run prune:template -- --yes --no-dashboard --no-demo --no-dictionary --no-reference --no-playground
```

- Static lightweight instances add `--no-payload` explicitly.

## Verification Log

- Passed: `npm run lint`.
- Passed: `npm run build`.
- Passed: lightweight route-surface dry-run.
- Passed: lightweight static dry-run with `--no-payload`.
- Passed: `npm run intelligence:query -- prune` returns the lightweight recipe.
- Passed: simulated canonical `averlo-next-template` `main` dry-run is allowed.
- Passed: simulated canonical `averlo-next-template` `main` mutating prune
  hard-stops without `--confirm-template-root`.
- Passed: disposable renamed instance at `/tmp/averlo-prune-reset.ACGxLF`
  applied the full lightweight prune and passed `verify:static`,
  `verify:build`, and `verify:smoke`.
- Passed: retained routes `/`, `/settings`, `/internal/intelligence`,
  `/internal/intelligence/graph`, and `/api/health` returned expected success
  statuses with internal routes explicitly enabled.
- Passed: removed route families `/login`, `/dashboard`, `/internal/demo`,
  `/internal/dictionary`, `/internal/reference`, and `/internal/playground`
  returned 404.
- Passed: pruned executable source search found no removed route-family URL,
  route-id, or auth/demo import references.
