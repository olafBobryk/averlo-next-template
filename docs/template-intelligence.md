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

## Visualizer

The `/internal/intelligence` page reads the generated index server-side and
shows the maintainer overview: title, summary, index stats, graph launcher, and
benchmark launcher. The interactive graph lives at `/internal/intelligence/graph`
so the map can run as a first-viewport inspection surface while still using the
shared marketing shell, visible header, `Section.Background`, `Button`, `Text`,
`Panel`, and rounded `SegmentedControl` primitives.

The graph route shows:

- graph modes for agent navigation, design-system discovery, internal knowledge,
  content architecture, Payload scaffolding, pruning, dev workflow, and route
  surfaces
- selectable 3D graph nodes with weighted links, visible physics, and focus
  states
- a separate 2D focus map for the selected node, direct neighbors, and
  hover-expanded next-step context
- a segmented digital-twin graph surface powered by
  `react-force-graph-3d`, `react-force-graph-2d`, `three`,
  `three-spritetext`, and `d3-force`
- source-style 3D node labels rendered as floating chip-style SpriteText labels
  attached to the nodes, with labels consuming the shared
  `src/components/ui/misc/Chip.tsx` visual contract, offset far enough to clear
  the node sphere, and node details opened in a stable side panel on the left
- a compact foreground connection legend where link colors explain relationship
  meaning such as maps to, depends on, owns, calls, provides, drives, and
  resolved by
- plain relationship lines without directional arrows, moving particles, or
  decorative travel indicators
- relation-scaled repulsion and link attraction so high-degree nodes create
  clear spacing without flattening the graph into a rigid board; node size also
  scales gently with connection count

The graph modes are:

- **Concepts:** concept and source-type relationships weighted by shared files
  and overlap
- **Task Map:** generated task topics connected to concrete starting files for
  agents, grouped into path-family lanes such as config, docs, app routes,
  components, library, scripts, and agent rules
- **Prune Ownership:** optional surfaces connected to prune flags, central
  rewrites, package entries, and validation checks in clear ownership lanes
- **Content Boundaries:** static, Payload-ready, and Payload-powered modes
  connected to render contracts, source adapters, and docs

The graph defaults to a 3D overview with live force simulation. Selecting a
node focuses the camera and exposes the node details in a stable side panel
that is shared by the 3D overview and 2D focus map. The panel lives in the same
foreground section flow as the graph title, Back, Reset, and view controls
instead of the canvas background layer. Pressing Space, or using the Focus
control, opens the 2D focus map.
The 2D map keeps the current focus node centered, shows only direct neighbors by
default, and reveals a hovered neighbor's next-step nodes in an outer preview
ring while unrelated neighbors fade back. It uses the same force-graph physics
model as the overview, with the center node pinned and neighboring nodes guided
by link, charge, collision, and soft x/y forces so connections stay attached as
the map settles. Clicking any visible 2D node promotes it to the centered focus
node. View mode and graph mode switching use rounded `SegmentedControl`
controls in normal section content with primary active pills, while the force
graph remains the interactive background. The graph canvas uses the shared
`InteractionGate` overlay to prevent accidental page interaction with a
modal-style dark backdrop; click or keyboard-focus the map to interact, and
press Escape to release it. Node details close on background or outside-panel
clicks, so graph inspection does not depend on projected canvas anchor timing.
Colors stay semantic: nodes represent artifact kind, while connection colors
represent relationship kind and dim by opacity when outside the active
neighborhood.
The overview page does not repeat the graph's node/file detail panels.

The force-graph renderer is shared with `/internal/reference`, where it acts as
the live design-system reference for 3D overview plus 2D focus graph surfaces.
Only graph content should vary between surfaces: views, nodes, links, and node
detail metadata. The shell, focus gate, controls, legend, labels, side panel,
and 2D focus behavior should stay consistent.

Because `/internal/reference` now uses the same graph renderer, graph packages
are no longer owned solely by Template Intelligence. `--no-intelligence`
removes the intelligence surface, scripts, docs, and generated artifacts, but
keeps the shared `Chip`, graph renderer, and graph dependencies while reference
graph usage remains.

## Benchmarks

The active benchmark run log intentionally starts empty:

```text
docs/worklogs/template-intelligence-benchmark-runs.jsonl
```

Record intentional runs with:

```bash
PATH="$HOME/.local/bin:$PATH" npm run intelligence:hybrid -- \
  --task-id T1 \
  --task-name "Route architecture" \
  --topics route-architecture,dev-server \
  --serena-file src/config/routes.ts \
  --serena-symbol appRoutes
```

If the preset fails before Serena starts with a local port-discovery error, run:

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

`Hybrid` benchmark rows require Template Intelligence plus at least one
successful Serena semantic call. The lower-level `npm run intelligence:record`
command rejects `--strategy Hybrid` when `--semantic-calls` is `0`; use
`TemplateIntelligence` for task-map-only diagnostic rows.

The benchmark view is available at:

```text
/internal/intelligence?view=benchmarks
```

Use `example=on` for placeholder visual QA data. Placeholder data must not be
treated as real benchmark history.

Like the rest of `/internal`, this page is guarded from client-clone
production by the internal marketing layout. The canonical
`webvizion-template.vercel.app` deployment is allowed through by its request or
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
the starting file set. Keep it user-local:

```bash
npm run intelligence:serena:setup -- --dry-run
npm run intelligence:serena:debug
```

The enforced preset starts the Serena project server and calls its current
tool endpoint with `project_name`, `tool_name`, and `tool_params_json`. Direct
project-server calls should use that shape:

```http
POST /query_project
{"project_name":"webvizion-template","tool_name":"get_symbols_overview","tool_params_json":"{\"relative_path\":\"src/config/routes.ts\"}"}
```
