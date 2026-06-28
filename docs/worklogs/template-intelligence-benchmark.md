# Template Intelligence Benchmark

## Purpose

Track whether the enforced hybrid preset reduces agent lookup cost without
lowering correctness. `Hybrid` means Template Intelligence plus at least one
successful Serena semantic call. Task-map-only runs must be recorded as
`TemplateIntelligence`, not `Hybrid`.

## Commands

Use the preset for normal task benchmarking:

```bash
PATH="$HOME/.local/bin:$PATH" npm run intelligence:hybrid -- \
  --task-id T1 \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --serena-file src/config/routes.ts \
  --serena-symbol appRoutes
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

Default to the enforced hybrid preset:

1. Query the task map through `npm run intelligence:hybrid -- --topics ...`.
2. Let the preset index and health-check user-local Serena.
3. Provide a focused `--serena-file` and optional `--serena-symbol` for the
   semantic lookup.

Serena remains user-local. If it is missing from PATH, the preset warns and
does not append a benchmark row.

```http
POST /query_project
{"project_name":"webvizion-template","tool_name":"get_symbols_overview","tool_params_json":"{\"relative_path\":\"src/config/routes.ts\"}"}
```
