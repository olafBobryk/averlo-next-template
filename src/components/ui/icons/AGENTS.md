# Folder: `src/components/ui/icons`

## Role
Central icon rendering system and registry infrastructure for the component library.

## Use This Folder When
- A component needs an icon from the shared library.
- You need consistent icon sizing or animation behavior.
- A new icon source needs to be registered centrally.

## Prefer These Files
- `src/components/ui/icons/Icon.tsx`: default icon renderer.
- `src/components/ui/icons/customRegistry.tsx`: built-in icon name map.
- `src/components/ui/icons/iconRegistry.tsx`: registry extension utilities.
- `src/components/ui/icons/phosphorRegistry.tsx`: Phosphor icon bindings.

## Invariants
- Use `Icon` instead of inline SVG for standard library icons.
- Icon sizing should stay on the shared `sm`, `md`, and `lg` scale unless there is a clear reason to pass explicit dimensions from a parent component.
- Visual icon animation should remain opt-in and should respect reduced motion where the component already expects that behavior.
- Directional RTL mirroring should remain opt-in with `mirrorInRtl`; do not automatically flip every left/right icon because some controls represent physical direction.
- Icons are decorative in most button and control contexts. Keep them `aria-hidden` unless the icon itself is the accessible content.
- Focus visibility belongs to the control containing the icon, not the icon wrapper.
- If SVG is inlined in JSX or TSX, use camelCase attribute names like `clipPath`, `strokeWidth`, `colorInterpolationFilters`, `stopColor`, `stopOpacity`, and `maskType`.

## How To Use It
- Use named icons through `Icon` whenever the library already provides the symbol.
- If a feature needs a new reusable icon, add it centrally rather than embedding the SVG only once in page code.
- When extending the registry, make the registration reusable for the rest of the library.

## Avoid
- Mixing multiple icon-rendering approaches across the codebase.
- Treating an icon as the sole accessible label for a button without explicit naming on the button itself.
- Using kebab-case SVG attribute names in JSX.
