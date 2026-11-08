# Folder: `src/components/ui/icons`

This folder owns named icon rendering and registry composition.

## Read

- `specs/platform/design-system/usage/spec.md` before choosing, adding or
  substituting an icon.

## Dependency and runtime boundaries

- `Icon` and registry providers are client boundaries. Raw custom and OpenAI
  registry maps are implementation inputs, not public owners.
- `createIconRegistry` merges local icons with provider overrides; consumers do
  not bypass `IconProvider` to read or mutate the raw maps.
- Icons may depend on shared motion and skeleton infrastructure, never on
  feature code.
- The application, Storybook and export providers default to
  `openaiIconRegistry`; symbols it lacks are added as local registered SVGs for
  the active provider. Do not import SDK CSS.

## Structure

- Reusable SVGs enter the registry instead of being duplicated in feature JSX;
  inline JSX SVG attributes use React camelCase names.
- RTL mirroring stays explicit through `mirrorInRtl`.
- Missing-icon diagnostics are development-only and deduplicated by name.
