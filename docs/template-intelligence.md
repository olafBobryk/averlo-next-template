# Template Intelligence

Template Intelligence is an internal authoring surface for maintainers and
agents working inside this template. It generates a local map of repo concepts
and renders it at `/internal/intelligence` during development. Client clones
keep `/internal/*` dev-only in production by default, while the canonical
template production deployment may expose those routes as live reference
material.

The feature is optional template infrastructure. Client clones can remove it
with:

```bash
npm run prune:template -- --no-intelligence
```

## Generated Index

Generate the local index with:

```bash
npm run intelligence:generate
```

The index is written to:

```text
.template-intelligence/index.json
.template-intelligence/agent-map.json
```

That directory is ignored by Git. The generated index is tied to the checkout
that produced it and should not be committed.

The generator is deterministic and local-only. It scans known template source
areas such as `AGENTS.md`, `README.md`, `docs`, `src/components`, `src/lib`,
internal marketing surfaces, route config, prune tooling, and guarded Payload
scaffold markers. It excludes dependency folders, build output, worktrees,
generated TypeScript configs, environment files, `.understand-anything`, and
other local artifacts.

The index is refreshed before development and build scripts through package
lifecycle hooks.

## Maintainer overview

The `/internal/intelligence` page reads the generated index server-side and
shows the maintainer summary, index statistics, and benchmark tools. Detailed
lookup remains available through the local `intelligence:query` command instead
of shipping an interactive graph renderer in the template.

## Benchmarks

The tracked benchmark log contains preserved legacy observations plus any
schema-v3 executed runs recorded by strategy commands:

```text
docs/worklogs/template-intelligence-benchmark-runs.jsonl
```

Benchmarking is explicit maintainer work, not a default implementation
requirement. Legacy observations are historical context and are not ranked as
matched comparisons. Use Template Intelligence directly for normal agent
orientation:

```bash
npm run intelligence:generate
npm run intelligence:query -- route-architecture
```

Run an intentional `TemplateSerena` benchmark only when a warm Serena service
is available or when the command explicitly warms it. Successful commands
record their own validated execution row:

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

For one-command benchmark setup, use `--ensure-serena`:

```bash
npm run intelligence:hybrid -- \
  --task-id T1 \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --serena-file src/config/routes.ts \
  --serena-symbol appRoutes \
  --ensure-serena \
  --require-serena
```

Without a warm Serena service, `npm run intelligence:hybrid` still generates and
queries Template Intelligence, prints a no-row-recorded message, and exits
cleanly unless `--require-serena` is passed.

If local port discovery needs inspection, run:

```bash
npm run intelligence:serena:debug
```

The debug command checks `uv`, `serena`, and the default
`127.0.0.1:9121-9170` bind range. `EPERM` across the range usually means the
current shell sandbox cannot bind loopback ports. It is different from
`EADDRINUSE`, which means the ports are occupied. You can narrow the check with:

```bash
npm run intelligence:serena:debug -- --serena-port 9121
npm run intelligence:serena:debug -- --port-range-start 9200 --port-range-count 20
```

`TemplateSerena` benchmark rows require Template Intelligence plus at least one
successful Serena semantic call. The unified `npm run intelligence:benchmark`
command also owns Control, TemplateMap, and Graphify measurement and recording.
The lower-level `npm run intelligence:record` command is reserved for explicit
administrative import and recovery.

The benchmark view is available at:

```text
/internal/intelligence?view=benchmarks
```

Use `example=on` for placeholder visual QA data. Placeholder data must not be
treated as real benchmark history.

Like the rest of `/internal`, this page is guarded from client-clone
production by the internal marketing layout. The canonical
`averlo-next-template.vercel.app` deployment is allowed through by its request or
Vercel production host, and other template/reference deployments can opt in
with:

```env
TEMPLATE_INTERNAL_ROUTES=enabled
```

## Understand-Anything Boundary

[Understand-Anything](https://github.com/Lum1104/Understand-Anything) is a
useful optional companion tool, but it is not a runtime or package dependency
of this template.

Do not add Understand-Anything packages to `package.json`. Do not commit
`.understand-anything` outputs. If a maintainer installs it locally, treat its
generated graph as dev-local context in the same category as `.next-agent-*`
or `.template-intelligence`.

Future work can add an adapter that reads Understand-Anything output when
present, but the first pilot intentionally uses the deterministic local scanner
so clones stay clean and dependency-free.

## Serena Boundary

Serena is useful as a local semantic-code companion after the task map narrows
the starting file set. It is warm-optional: ordinary agent work must not fail
just because Serena is cold or unavailable.

```bash
npm run intelligence:serena:status
npm run intelligence:serena:setup -- --dry-run
npm run intelligence:serena:ensure
npm run intelligence:serena:stop
```

The wrapper prepends `$HOME/.local/bin` for the command, installs
`serena-agent` through `uv tool install serena-agent` only from
`intelligence:serena:ensure`, indexes the current checkout, health-checks it,
starts or reuses a local project server, and writes ignored state to:

```text
.codex/serena.json
```

The state schema is:

```json
{
  "schemaVersion": 1,
  "root": "/absolute/checkout/path",
  "projectName": "averlo-next-template-<rootHash>",
  "port": 9121,
  "pid": 12345,
  "startedAt": "2026-07-04T00:00:00.000Z",
  "logPath": "/absolute/checkout/path/.codex/tmp/serena-..."
}
```

Project names include a hash of the real checkout path, so the canonical
checkout, worktrees, and sibling repos do not collide in Serena's project
registry. Server logs live under `.codex/tmp/`.

`npm run intelligence:serena:status` reports `missing-tools`, `not-started`,
`running`, `stale-root`, or `dead-pid` without failing normal agent work.
`npm run intelligence:serena:stop` stops the stored process for this checkout
and removes `.codex/serena.json`.

When a warm server is running, direct project-server calls should use the
stored `projectName` with Serena's current endpoint shape:

```http
POST /query_project
{"project_name":"averlo-next-template-<rootHash>","tool_name":"get_symbols_overview","tool_params_json":"{\"relative_path\":\"src/config/routes.ts\"}"}
```
