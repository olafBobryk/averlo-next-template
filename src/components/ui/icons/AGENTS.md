# Folder: `src/components/ui/icons`

## Ownership

This folder owns named icon rendering and registry composition.

## Dependency and runtime boundaries

- `Icon` and registry providers are client boundaries. Raw custom and OpenAI
  registry maps are implementation inputs, not independent public owners.
- `createIconRegistry` merges local icons with provider overrides; consumers do
  not bypass `IconProvider` to read or mutate the raw maps.
- Icons may depend on shared motion and skeleton infrastructure but must not
  acquire feature dependencies.

## Structural invariants

- Control icons are decorative by default. Accessible naming and visible focus
  belong to the containing control.
- RTL mirroring remains explicit through `mirrorInRtl`; physical directions are
  never flipped globally.
- Reusable SVGs enter the registry rather than being duplicated in feature JSX.
  Inline JSX SVG attributes use React camelCase names.
- Missing-icon diagnostics remain development-only and deduplicated by name.
- Choose registered symbols by semantic purpose: upload/download/filter/rename/
  delete/restore/overflow and file-specific folder, video-play, audio-waveform,
  table or code rather than a generic document for every file. Retain visible
  labels where they fit and accessible names on every icon-only control. Use the
  shared square icon-button size, not a text button's width. Missing meanings
  extend the named registry for the active provider; never substitute an unrelated
  glyph or duplicate inline SVG. Verify actual rendered examples.

- The application, Storybook, and export providers default to openaiIconRegistry.
  Use local registered SVGs for unsupported symbols; preserve native SDK fill states.
  Do not import SDK CSS or replace Averlo surface/typography tokens for icons.
