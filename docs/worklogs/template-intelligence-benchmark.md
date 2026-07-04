# Template Intelligence Benchmark

## Purpose

Track whether Template Intelligence and optional Serena semantic lookup reduce
agent lookup cost without lowering correctness. `Hybrid` means Template
Intelligence plus at least one successful Serena semantic call. Task-map-only
runs must be recorded as `TemplateIntelligence`, not `Hybrid`.

## Commands

Use Template Intelligence directly for normal work:

```bash
npm run intelligence:generate
npm run intelligence:query -- route-architecture
```

Use the warm Serena service only for intentional Hybrid benchmarking:

```bash
npm run intelligence:serena:ensure
npm run intelligence:hybrid -- \
  --task-id T1 \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --serena-file src/config/routes.ts \
  --serena-symbol appRoutes \
  --require-serena
```

The lower-level recorder is validation-strict: `--strategy Hybrid` is rejected
when `--semantic-calls` is `0`.

Clear temporary real runs with:

```bash
npm run intelligence:record:clear -- --yes
```

The visual benchmark route is:

```text
/internal/intelligence?view=benchmarks
```

Placeholder chart data is available only for visual QA:

```text
/internal/intelligence?view=benchmarks&example=on
```

## Current Recommendation

Default to lightweight Template Intelligence:

1. Generate the task map with `npm run intelligence:generate`.
2. Query relevant topics with `npm run intelligence:query -- <topic>`.
3. Use `rg` and direct file reads for ordinary implementation work.

Use Hybrid only when the semantic layer is already warm or the benchmark
explicitly opts into setup with `npm run intelligence:serena:ensure` or
`--ensure-serena`. Without a warm Serena service, `npm run intelligence:hybrid`
prints `Template Intelligence only; no Hybrid row recorded` and exits cleanly
unless `--require-serena` is passed.

Serena remains user-local. The service wrapper writes ignored state to
`.codex/serena.json`, logs to `.codex/tmp/`, and uses path-hashed project names
such as `averlo-next-template-<rootHash>` so worktrees and sibling repos do not
collide.

```http
POST /query_project
{"project_name":"averlo-next-template-<rootHash>","tool_name":"get_symbols_overview","tool_params_json":"{\"relative_path\":\"src/config/routes.ts\"}"}
```
