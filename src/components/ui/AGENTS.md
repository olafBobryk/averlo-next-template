# Folder: `src/components/ui`

## Ownership

- This tree owns the shared design-system and UX-system implementation. Keep the
  family taxonomy: primitives, foundations, helpers, icons, input, misc, motion,
  overlays, and time.
- Lower-level families must not depend on higher-level consumers or page code.
  Keep shared behavior with the narrowest coherent owner; do not create a
  parallel shared-component tree or feature-local overlay infrastructure.
- External consumers use a Storybook-supported public owner or curated family
  facade. Family internals may import direct owners only to preserve dependency
  direction or avoid cycles.
- Keep server-safe exports free of client-only dependency paths. Put client
  boundaries at the smallest stateful or browser-dependent owner.

## Authority

- Storybook owner contracts define public UI support and observable behavior.
  The nearest `AGENTS.md` defines internal topology and prohibitions. Maintained
  OpenSpec capabilities define cross-surface behavior; existing verifiers define
  deterministic policy. Follow [component verification](../../../docs/testing/component-contracts.md)
  without treating implementation exports as supported public API.
