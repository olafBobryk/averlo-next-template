# Template Intelligence

Template Intelligence is an internal authoring surface for maintainers and
agents working inside this template. It generates a local map of repo concepts
and renders it at `/internal/intelligence` during development.

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
shows:

- concept groups for agent navigation, design-system discovery, internal
  knowledge, content architecture, Payload scaffolding, pruning, dev workflow,
  and route surfaces
- selectable concept nodes with weighted graph links, focus states, and query
  highlighting
- related concepts, shared files, source-type tags, and filtered files for each
  selected concept
- source-type distribution
- a dependency-free relationship map based on files shared between concepts and
  source-type overlap

Like the rest of `/internal`, this page is guarded from production by the
internal marketing layout.

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
