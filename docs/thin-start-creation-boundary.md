# Optional Thin-Start Creation Boundary

This document records the accepted boundary for the optional thin-start creation
path and the local command that prepares it. The command is optional-only: the
default Webvizion template remains unchanged unless thin-start activation is
explicitly selected in a target instance.

## Decision

Thin-start is an optional creation-time mode. It does not replace the normal
Webvizion template path, and it is not a forced parking, reset, or cleanup path
for standard setup.

The explicit tooling entrypoint is:

```bash
npm run create:thin-start -- --dry-run
```

For the selected in-place activation route, preview the mutation boundary with:

```bash
npm run create:thin-start -- --dry-run --in-place
```

Mutation requires an intentional run without `--dry-run`; use `--yes` only when
the plan is accepted. Mutating in-place activation also requires
`--confirm-instance`, which is the operator acknowledgement that the current
checkout is a new/disposable template instance rather than the canonical default
template:

```bash
npm run create:thin-start -- --yes --in-place --confirm-instance
```

In-place mode parks the current Webvizion reference first, updates that
instance for the selected activation dependencies, then applies the selected
thin-start live rewrite: shared primitive templates, Sonner-backed toast,
route-owned internal intelligence components, and removal of broad
misc/helper/icon/demo/dashboard surfaces from the live source graph.

After activation, refresh the instance dependency lock/install state before
building or shipping that instance:

```bash
npm install
```

When thin-start is selected, the existing Webvizion component system is copied
to a parked, reference-only location outside the live import graph. Agents may
inspect that parked API, but live promotion should bring forward only the
minimal API needed for the current website.

The thin-start live primitive surface starts intentionally small:

- `Button`
- `Text`
- `Section`
- `Field`
- `InputFrame`
- `TextInput`
- `Select`
- `Dropdown`

Motion foundations, reduced-motion handling, section motion behavior, dropdown
interaction behavior, and limited input/select integration patterns stay intact.
`Panel`/`Card` and broad misc/helper surfaces are not part of the simple
thin-start primitive surface.

Thin-start toast behavior should use a shadcn/Sonner-style default instead of
carrying forward the current custom Webvizion toast system. Other overlays may
remain only when scaffold-critical, and they must stay small without dragging
broad misc, panel, or visual-state dependencies into shared primitives.

Internal intelligence UI must not define the shared design system. In
thin-start, it should use custom, minimal, route-owned components under the
internal intelligence route rather than expanding `src/components/ui`.

The scaffold remains valuable and should stay:

- dev workflow
- route structure
- content-mode scaffolding
- Payload-ready inactive shape
- Template Intelligence
- docs/process scaffolding
- motion/reduced-motion foundations
- dropdown behavior
- limited input/select patterns

The review gate is exported API review, not just compile/build/smoke success.
A thin-start output is only acceptable when the live exported surface is
inspected and remains minimal for the current website. Compatibility props,
broad misc/helper folders, internal/demo/dashboard-driven abstractions, and
parked code re-entering the live import graph are review failures.

Use the report-only review command during setup:

```bash
npm run review:thin-start-api
```

Use `-- --strict` only when the current checkout is expected to satisfy the
thin-start allowlist. The full Webvizion default path is broader by design.

## Source Status

The current repository documents the full Webvizion default component system,
optional internal surfaces, prune behavior, content modes, Template
Intelligence, and dev workflow. The thin-start-specific boundary above was
accepted in the thin-start consolidation discussion. The shipped default path is
the full Webvizion template; thin-start is created only by the explicit command
above.
