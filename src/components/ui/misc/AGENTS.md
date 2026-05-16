# Folder: `src/components/ui/misc`

## Role
Cross-cutting UI helpers and feedback components that do not belong to inputs, overlays, or pure primitives.

## Use This Folder When
- You need loading, empty, warning, copy, segmented selection, disclosure, skeleton, file preview, or dynamic-state wrappers.
- The UX pattern is common across pages but not strictly a form input or overlay primitive.

## Prefer These Files
- `src/components/ui/misc/Accordion.tsx`: disclosure UI.
- `src/components/ui/misc/CopyField.tsx`: copy-to-clipboard interaction.
- `src/components/ui/misc/FilePreview.tsx`: file preview tile with shared actions.
- `src/components/ui/misc/FileGallery.tsx`: horizontal gallery for pending and uploaded file previews.
- `src/components/ui/misc/FileInspectModal.tsx`: modal body for PDFs and unsupported file previews.
- `src/components/ui/misc/HealthCheckIndicator.tsx`: compact service health display backed by a health endpoint.
- `src/components/ui/misc/ImageSwitcher.tsx`: reusable image switcher with stable transitions, eager preloading, swipe support, and shared pagination controls.
- `src/components/ui/misc/Loader.tsx`: spinner loader.
- `src/components/ui/misc/MoreMenuDropdown.tsx`: overflow action menu.
- `src/components/ui/misc/PaginationControls.tsx`: compact previous or next pagination controls.
- `src/components/ui/misc/Pill.tsx`: compact non-interactive badge with semantic and helper tones.
- `src/components/ui/misc/ProfilePicture.tsx`: avatar display for profile images, initials, unknown users, and loading state.
- `src/components/ui/misc/ScrollBorders.tsx`: scroll container with top/bottom edge affordances and an optional return-to-top action.
- `src/components/ui/misc/SegmentedControl.tsx`: segmented option selector.
- `src/components/ui/misc/SuspenseBoundary.tsx`: loading and error boundary wrapper.
- `src/components/ui/misc/Tooltip.tsx`: hover or focus helper text built on the shared dropdown primitive.
- `src/components/ui/misc/Warning.tsx`: inline or panel warning block.
- `src/components/ui/misc/Skeleton.tsx`: loading placeholder.
- `src/components/ui/misc/InspectableImage.tsx`: image trigger for inspect modal.

## Invariants
- Prefer these shared UX patterns before introducing page-local versions.
- `Accordion` should continue to use `Button`, `IconSwap`, and motion conventions rather than ad hoc disclosure code.
- `CopyField` should remain the default for copy-to-clipboard UX.
- `SegmentedControl` should remain the default for segmented selection instead of custom pill navs.
- `SuspenseBoundary` and the state components should remain the default path for async loading and error presentation.
  - When a loading fallback is a ghost or skeleton version of the final UI, keep the live and fallback layouts structurally identical so transitions can crossfade without layout jump.
- The focus invariant still applies: every interactive surface here must keep visible keyboard focus through the underlying shared controls.
- `Skeleton` should be preferred over one-off shimmer markup, especially when a component-specific skeleton already exists.
- Skeleton parity matters:
  - Skeleton components should mirror the live component's DOM structure, wrapper layout, spacing, and breakpoint classes.
  - Swap content nodes for skeleton nodes, not the surrounding layout containers.
  - Skeleton UIs must remain non-interactive and should not carry hover, click, focus, or blur behavior.

## How To Use It
- Use `Accordion` for FAQ rows, expandable settings, and compact disclosure content.
- Use `CopyField` whenever the user copies a token, URL, or identifier.
- Use `Loader` inside asynchronous regions, but avoid duplicating loader behavior already built into `Button` or other components.
- Use `MoreMenuDropdown` for action-overflow menus instead of assembling a new icon-trigger dropdown.
- Use `PaginationControls` for compact previous or next paging actions before building page-local pager rows.
- Use `FileGallery` for pending/uploaded file preview strips instead of assembling one-off preview rows.
- Use `ScrollBorders` when a vertically scrollable region should expose overflow with shared border treatment instead of page-local scroll shadows or one-off borders.
- Use `Tooltip` for short helper copy on hover or focus instead of hand-rolled positioned labels.
- Use `InspectableImage` for click-to-zoom image behavior.
- Use `HealthCheckIndicator` for compact live service status instead of page-local polling badges.
- Use `ImageSwitcher` for small image carousels or before/after-style media switchers before building page-local slideshow state.
- Use `Warning` for cautionary messaging; use `variant="panel"` when the warning should be visually separated from surrounding content.
- Use `Pill` for compact labels and statuses when the element is not itself an action.
- Use `ProfilePicture` for avatar display before assembling image, initial, or fallback badges by hand.
- For initial-load loading states, prefer `Skeleton`, `Text.Skeleton`, and component-specific skeletons before toasts.
  - For `SuspenseBoundary ghost`, build the fallback from component skeletons inside the same wrapper and spacing structure as the resolved content.

## Avoid
- Custom copy, disclosure, segmented, or skeleton patterns in page code when the shared component already fits.
- New async wrappers that duplicate `SuspenseBoundary`.
- Skeleton layouts that shrink, jump, or change breakpoint structure compared to the live widget.

## See Also
- `src/components/ui/misc/state/AGENTS.md`
- `src/components/ui/overlays/modal/AGENTS.md`
- `src/components/ui/overlays/toast/AGENTS.md`
