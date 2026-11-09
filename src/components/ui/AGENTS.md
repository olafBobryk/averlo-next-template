# Folder: `src/components/ui`

Shared design-system and UX-system implementation.

## Read

- `specs/platform/design-system/usage/spec.md` and the family specs under
  `specs/platform/design-system/` for behaviour; Storybook owner stories for
  supported APIs; [component verification](../../../docs/testing/component-contracts.md).

## Structure

- Family taxonomy: primitives, foundations, helpers, icons, input, misc, motion,
  overlays, time. Lower-level families never depend on higher-level consumers or
  page code; no parallel shared-component tree or feature-local overlay
  infrastructure.
- External consumers import a Storybook-supported owner or curated family facade.
  Family internals import direct owners only to preserve dependency direction or
  avoid cycles; implementation exports are not public API.
- Server-safe exports stay free of client-only dependency paths; put client
  boundaries at the smallest stateful or browser-dependent owner.
