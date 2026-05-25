# Template Intelligence Benchmark

## Purpose

Track whether Template Intelligence reduces agent lookup cost without lowering
correctness. The active benchmark log starts empty and only records intentional
runs.

## Commands

```bash
npm run intelligence:record -- \
  --task-id T1 \
  --task-name "Route architecture" \
  --strategy Hybrid \
  --shell-commands 15 \
  --semantic-calls 0 \
  --correctness 3
```

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

Default to Hybrid:

1. Query the task map with `npm run intelligence:query -- <topic>`.
2. Read the listed policy/source files.
3. Use Serena only for symbol-level questions after the file set is narrowed.

Serena remains optional and user-local. A project-server query should use:

```http
POST /query_project
{"query":"Find the symbols and references relevant to <task> after reading the Template Intelligence task-map starting files."}
```
