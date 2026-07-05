# Repo Intelligence Benchmark

## Purpose

Measure which minimal repo-intelligence path gives agents the best upward
pressure during implementation and template instancing. The active benchmark
paths are `Control`, `TemplateSerena`, and `Graphify`.

Existing schema v1 rows are kept as history. New rows use schema v2.
`TemplateSerena` is the canonical name for the old Template Intelligence plus
Serena `Hybrid` path; the recorder still accepts `--strategy Hybrid` as a
legacy alias.

## Commands

Record live work after a task or commit:

```bash
npm run intelligence:record -- \
  --task-id example-task \
  --task-name "Example task" \
  --strategy Control \
  --benchmark-mode live-passive \
  --task-class implementation \
  --shell-commands 12 \
  --semantic-calls 0 \
  --correctness 3 \
  --resolution inconclusive \
  --actual-files src/app/page.tsx,src/config/routes.ts \
  --notes "Short evidence note."
```

Use `--output tmp/intelligence-benchmark-smoke.jsonl` for smoke tests and
experiments that should not append to the tracked run log.

Clear temporary real runs with:

```bash
npm run intelligence:record:clear -- --yes
```

The visual benchmark route still reads the tracked run log:

```text
/internal/intelligence?view=benchmarks
```

## Benchmark Paths

`Control` is the no-intelligence baseline. Do not run Template Intelligence,
Serena, or Graphify first. Record the manual `rg`, file-read, and inspection
cost.

`TemplateSerena` is the current warm optional path:

```bash
npm run intelligence:generate
npm run intelligence:query -- ui-primitives
npm run intelligence:serena:ensure
npm run intelligence:hybrid -- \
  --task-id example-task \
  --task-name "Example task" \
  --topics ui-primitives \
  --serena-file src/components/ui/primitives/Button.tsx \
  --serena-symbol Button \
  --require-serena
```

`Graphify` is a no-new-UI pilot. Keep `graphify-out/` ignored, skip Graphify's
generated HTML review surface, and use the CLI/report/JSON output only:

```bash
uvx --from graphifyy graphify . --no-viz
uvx --from graphifyy graphify query "Where should an agent start for this task?"
```

After using Graphify, record build/query cost, graph size, suggested files,
actual files, missed files, and whether Serena/manual search was still needed.

## Benchmark Modes

`live-passive` is the default for real work. Record one row after a completed
task/commit describing which path was used and whether it helped.

`shadow-replay` is for concluded commits. Record `beforeCommit`, `afterCommit`,
known `actualFiles`, and what a path would have suggested before implementation.
Use it to extract lessons without changing code.

`triple-run` is optional. Use one `runGroupId` and three rows when comparing all
paths on the same task is worth the ceremony. It is not required for normal
work.

## Decision Use

Template instancing should choose an initial benchmark path, not a permanent
intelligence system:

- `Control` for tiny, thin, or simple instances.
- `TemplateSerena` for implementation-heavy work that needs exact symbols.
- `Graphify` for unfamiliar, inherited, cross-boundary, or docs-heavy repos.

Promote a path only after several rows show fewer missed files, fewer wrong
turns, and acceptable setup/build friction. Keep `graphify-out/` local and
ignored unless shared graph state is explicitly accepted later.
