# Winery foundation backport

Source: `winery-agent/app` commit `59dc820c25ae315893d14354de6833d07d32f02f`.

Port the shared color declarations from `src/components/ui/foundations/library.css`
and the matching danger declarations in `theme.css`: light Card, primary and
secondary buttons, destructive colors, inline error and status fills, and dark
button/error aliases. Keep Page, Panel, Card and Float independently owned.

Retain the template's newer SurfaceTint guidance. Skip Winery application,
authentication, agent and backend changes. No profile inventory or initializer
metadata changes are required. Code Art Studio consumes the same shared colors;
its artwork controls use existing complete input owners and cohesive Cards.

Verification: compare these two foundation files byte-for-byte against Winery;
run template profile, initializer integration, static and build checks. Verify
light/dark buttons, inputs and Cards in a rendered preview. Record final results
below before delivery.

## Results on 2026-10-27

- Both foundation files match Winery byte-for-byte. `library.css` SHA-256:
  `97f1b85079e99886e56c8bbb570018ad62e8467ee7303989abe1542e01294cda`.
- Profile materialization, ownership guards, installed initializer integration,
  static contracts and TypeScript pass.
- Existing lint baseline: 31 warnings and two informational findings; no errors.
  These include unused imports/parameters, non-null assertions, image-element
  performance guidance, optional-chain/style suggestions and existing CSS rules.
- Browser-resolved light/dark colors match Code Art Studio. Tested text/fill
  pairs exceed 4.5:1; primary button text is 5.60:1. The Foundations route was
  visually reviewed and captured at 1440px full-page width.
- Production build and exact pushed-commit verification remain mandatory gates
  in the production-ship workflow. Automatic initializer publication owns the
  subsequent npm patch release.
# Publication follow-up

The initial color release was published as create-averlo 0.1.7, but its final
hosted generation check encountered npm ETARGET after the version/latest
endpoints had propagated. Retry only ETARGET with a fresh installer cache;
retain immediate failure for generator errors and an exact template-commit
assertion after successful generation.

