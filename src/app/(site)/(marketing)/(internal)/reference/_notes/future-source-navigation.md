# Future Source Navigation

Status: research note, not current implementation.

This note belongs under the internal reference surface so it is removed by:

```bash
npm run prune:template -- --no-reference
```

## Current experiment

Use `code-inspector-plugin` as the lightweight option-3 implementation. It runs through `turbopack.rules` in `next.config.ts`, only activates in `next dev`, and opens VS Code through the local editor bridge.

Default local workflow:

- run `npm run dev`
- open the app in the browser
- hold `Option + Shift` on macOS
- hover an element to see the inspector overlay
- click to open the source location in VS Code

## Option 4: custom build

Do not build this until the package-based inspector proves unreliable in real edits.

A custom version would need:

- a dev-only browser listener for modifier-click source inspection
- a source marker injected into JSX/TSX during development
- a local endpoint that opens `code -g {file}:{line}:{column}`
- strict production guards so no source paths or local endpoints leak into deployed builds
- compatibility checks for Server Components, shared UI wrappers, slots, and generated route files

The likely shape is a small internal package or script that uses a compiler transform to add source metadata to JSX elements. Turbopack would carry that transform through `turbopack.rules`; Turbopack itself should not be forked or deeply customized for this.

## Decision threshold

Build the custom version only if all are true:

- package-based inspection saves time but misses source locations often enough that it cannot be trusted
- the misses are caused by this template's component abstraction patterns rather than user error
- the desired behavior is more specific than "open the nearest JSX source line"
- the tool can remain dev-only and removable from cloned projects
