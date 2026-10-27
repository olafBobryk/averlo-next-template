# Verify marketing composition and media

Behavior belongs to [marketing composition](../../openspec/specs/app/marketing/composition/marketing-composition/spec.md)
and [media delivery](../../openspec/specs/app/shared/frontend/content/media-delivery/spec.md).
[Marketing-content AGENTS](../../src/lib/marketing-content/AGENTS.md) owns exact
route/document/renderer/media topology; shell adapters follow their nearest AGENTS.
Storybook owns the shared `Section` root, background, frame and supported API.

## Structural and source checks

After adding/moving a public page run `npm run verify:route-surfaces`.
Use `npm run verify:marketing-sections`, `npm run verify:site-layout` and
`npm run verify:marketing-media` for focused diagnosis, then run
`npm run verify:marketing` before complete marketing handoff. Run the applicable
Payload page/layout fixture verifier when provider media normalization changes;
use [content-source verification](content-sources.md) and
[route/metadata verification](routes-and-metadata.md) for those boundaries.

Confirm registered installed route delegation to `MarketingPageDocument` and
`renderMarketingSections`, ordered data-driven blocks, one neutral renderer per
block type at `sections/**/<blockType>/<PascalBlockType>Section.tsx`, and only
registered renderers using the Section suffix. Check meaningful fields, one
semantic source section and one shared `Section` root per content renderer;
no local header/footer, opaque whole-page block or independent sibling cases.
Preserve stable ID, type, label and comparison selectors. Check Tailwind-first
styles and a specific unexpressible selector/keyframe rationale for any CSS module.

Inspect shared desktop/compact header, menus, search, footer, shell order and
scroll lifecycle using the same resolved layout data. Verify exclusive surface-ID
or direct-href links, registered internal destinations and intentional generated,
external or fragment links. Preserve explicit utility exceptions without treating
them as precedent for new composed pages.

## Media evidence

Inspect exact constituent asset provenance and committed bytes, actual static
imports/optimized images, intrinsic dimensions, responsive `sizes`, real blur
data, authored/decorative alt and vector SVG treatment. Check resolved static or
remote media values, not provider records at renderers. No expiring design/MCP
URL, task artifact or flattened source capture may reach production. Preload
requires evidence that the image is the route's LCP.

Review each `averlo-media-exception-next-line <rule> -- <rationale>` immediately
before its one affected use: one rule once, valid rationale, no stale/file-wide
opt-out. Temporary URLs, reference captures and missing alt remain non-waivable.
The media verifier scans the real marketing tree. Run
`node --test scripts/verify/verify-marketing-media-policy.test.mjs` for focused
static/remote/SVG and exception-boundary cases. Template plugin integration also
uses `npm run verify:composition-workflows` and `npm run verify:visual-parity`.
These checks do not substitute for visual asset provenance.

## Source-backed review

Use the existing Compose source-intake and Visual Parity focus-packet procedures
for external-source implementation and measured review. Before edits classify
hierarchy, headings, bounds, full-bleed backgrounds and rhythm. Map each content
case to a stable ID, block, renderer and selector; keep shell/footer cases,
excluded headers and accumulated gates separate. Preserve distinct source cases;
pause on an ambiguous split. Later reuse/splitting is an explicit Systemize
decision. The approved header remains unchanged in production and excluded from
Compose parity; shared owners require their separate authorization.

For material UI changes use Preview for a verified local route and direct section
anchor when available. Verify native DOM, stable selectors and both comparison
boundaries, then desktop/compact and relevant motion states. Save ignored captures
and report direct normal human-review URLs separately from automation-only state.
Record actual checks, source/parity limitations and current human review state;
do not claim a whole-frame match for an intentionally cropped comparison.
