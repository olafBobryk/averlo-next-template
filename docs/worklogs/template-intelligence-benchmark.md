# Repo Intelligence Benchmark

## Purpose

Measure which minimal repository-navigation path gives agents useful upward
pressure during implementation and template instancing without turning
historical observations into unsupported strategy claims.

The strategy definitions are:

- `Control`: a deterministic direct-search baseline with no Template
  Intelligence, Serena, or Graphify activity.
- `TemplateMap`: deterministic Template Intelligence generation and topic query
  without Serena.
- `TemplateSerena`: Template Intelligence plus at least one successful Serena
  semantic call. Historical `Hybrid` observations map here while retaining
  their legacy name.
- `Graphify`: an actual Graphify build and at least one successful graph query
  with non-empty query evidence and measured build/query time.

## Evidence classes

The system keeps four concepts separate:

- Legacy observations preserve historical measurements but are not comparative
  benchmark evidence.
- Executed runs are schema-v3 records created only after a strategy command
  succeeds and its evidence validates.
- Scenario fixtures define tasks or support visual QA. They are never loaded as
  real history.
- Policy decisions describe intended use without pretending a tool ran.

Preserved does not mean comparable. Only executed runs sharing both a
`scenarioId` and `runGroupId`, with at least two strategies represented, may be
shown as a cross-strategy cohort.

## Command-owned recording

Workers use one strategy command. Successful commands measure, validate, and
atomically persist their own executed-run row; there is no second recording
step.

Run a direct-search Control pass:

```bash
npm run intelligence:benchmark -- \
  --strategy Control \
  --task-id T1-control \
  --task-name "Route architecture" \
  --query "route architecture" \
  --scenario-id route-architecture \
  --run-group-id route-bakeoff \
  --benchmark-mode triple-run
```

Run TemplateMap:

```bash
npm run intelligence:benchmark -- \
  --strategy TemplateMap \
  --task-id T1-template-map \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --scenario-id route-architecture \
  --run-group-id route-bakeoff \
  --benchmark-mode triple-run
```

Run TemplateSerena through the unified command:

```bash
npm run intelligence:benchmark -- \
  --strategy TemplateSerena \
  --task-id T1-template-serena \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --serena-file src/config/routes.ts \
  --serena-symbol appRoutes \
  --scenario-id route-architecture \
  --run-group-id route-bakeoff \
  --benchmark-mode triple-run \
  --require-serena
```

`npm run intelligence:hybrid` remains a compatibility entry point with the same
command-owned TemplateSerena persistence behavior.

Run Graphify:

```bash
npm run intelligence:benchmark -- \
  --strategy Graphify \
  --task-id T1-graphify \
  --task-name "Route architecture" \
  --query "Where should an agent start for route architecture?" \
  --scenario-id route-architecture \
  --run-group-id route-bakeoff \
  --benchmark-mode triple-run
```

Graphify remains local and benchmark-only. `graphify-out/` stays ignored and
the command uses CLI output rather than Graphify's generated HTML surface.

Use `--output /tmp/intelligence-benchmark-smoke.jsonl` for smoke tests that
must not touch the tracked log.

## Deterministic and annotated fields

Commands own observable facts such as strategy, command identity, shell and
semantic call counts, Graphify query count, output size, elapsed time, and
suggested files that can be parsed from command output.

Correctness, wrong turns, resolution, actual files, missed files, and notes are
optional annotations. Commands never invent favorable defaults for them.

The schema-v3 validator enforces strategy evidence before persistence:

- Control and TemplateMap reject semantic and graph calls.
- TemplateSerena requires a successful semantic call.
- Graphify requires graph activity, non-empty evidence, and measured build and
  query time.
- `triple-run` requires both a scenario ID and run-group ID.

Persistence uses a content-derived run ID, a short-lived file lock, one-line
append, and duplicate detection. Repeating an identical administrative record
is idempotent.

## Administrative tools

`npm run intelligence:record` remains available for explicit import and
recovery. It uses the same schema-v3 validator but is not the normal worker
path.

To remove schema-v3 executed runs while preserving legacy and unknown records:

```bash
npm run intelligence:record:clear -- --executed-runs --yes
```

There is no command that silently empties the complete history file.

## Benchmark modes

- `live-passive` records real navigation activity without claiming a controlled
  comparison.
- `shadow-replay` reruns a concluded scenario against known source evidence.
- `triple-run` is the controlled comparison mode. Every strategy row uses the
  same scenario and run-group IDs.

## Decision use

The internal benchmark route reads the tracked log at:

```text
/internal/intelligence?view=benchmarks
```

Legacy history is counted but not ranked. Comparative charts appear only for
matched cohorts. Promote a strategy only after repeated matched cohorts show
fewer missed files or wrong turns with acceptable setup and query cost.
