# Thin-Start Profile Boundary

Thin start is an optional filesystem-backed template profile. Full start remains
the canonical source. Shared files come directly from that source; genuine
thin-only replacements live as normal files under
`template-profiles/thin-start/overrides/`.

`template-profiles/thin-start/manifest.mjs` is authoritative for shared files,
overrides, removals, dependency changes, retained routes and scripts, API review,
and verification. Component source must never be embedded in generator strings.

## Isolated materialization

The default command creates a complete disposable project in the ignored
`.thin-start/workspace` directory:

```bash
npm run create:thin-start
npm run review:thin-start-api -- --root .thin-start/workspace --strict
```

Use a custom output without changing the source checkout:

```bash
npm run create:thin-start -- --output ../my-thin-project
```

Existing outputs are not replaced by default. `--force` works only when the
destination contains the matching thin-profile marker, preventing an unrelated
directory from being removed.

For routine development, refresh, install, and run the isolated profile through
one command:

```bash
npm run dev:thin -- --random
```

Materialized workspaces are disposable. Edit canonical shared files or the
explicit override files, then rematerialize.

## In-place activation

In-place activation exists only for a new template instance. Preview its exact
manifest plan first:

```bash
npm run create:thin-start -- --dry-run --in-place
```

Mutation requires both the explicit mode and instance acknowledgement:

```bash
npm run create:thin-start -- --yes --in-place --confirm-instance
npm install
npm run review:thin-start-api -- --strict
npm run build
```

This path parks the current component tree under `.thin-start/reference/` before
applying the manifest. Parked code is reference-only and must never re-enter the
live import graph.

## Shared and thin-only surfaces

Both profiles use the same `Panel` and structured `Card` implementation.
`Panel` owns generic surfaces and overlay roots. `Card` builds on `Panel` and its
slots own structured card composition.

Thin start keeps the small Button, Panel/Card, Text, Section, Field, InputFrame,
Dropdown, native choice-input, Markdown renderer, modal, motion, and content
scaffolds declared by the manifest. Its Sonner toast is an explicit file-backed
override styled with shared tokens. Broad helper, icon, misc, dashboard, demo,
and scroll-performance surfaces are excluded.

The exported API review is a required gate. It reads the same manifest as the
materializer and rejects broad imports, unapproved composites, compatibility
markers, and parked-reference imports.
