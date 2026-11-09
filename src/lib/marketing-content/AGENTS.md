# Marketing content boundary

Source-neutral marketing documents, fallback content, server resolvers and the
section renderer registry.

## Read

- `specs/platform/surfaces/marketing/content-sources/spec.md` when changing
  source selection or normalization.
- `specs/platform/surfaces/marketing/composition/spec.md` and
  `specs/platform/surfaces/marketing/pages/spec.md` when adding or changing
  sections or pages.
- `specs/platform/content/media/spec.md` when changing marketing media.
- `specs/platform/surfaces/marketing/metadata/spec.md` when changing page
  metadata.
- Verification: `docs/testing/content-sources.md`,
  `docs/testing/marketing-composition.md`; run `npm run verify:marketing` for a
  complete change (`npm run verify:marketing-sections`,
  `npm run verify:site-layout`, `npm run verify:marketing-media` for diagnosis).

## Structure

- `types.ts` defines `MarketingPageDocument`, `SiteLayoutDocument` and the
  discriminated section props. Renderers consume only these, never Payload shapes.
- `resolvers.ts` (`getMarketingPage()`, `getSiteLayout()`) and `source.ts` are the
  server-side source boundary; `fallback.ts` holds the committed TypeScript
  documents; `payloadSiteLayout.ts` adapts the guarded Payload source.
  Normalization of relationships, media and source metadata happens there,
  before renderers.
- `sections/registry.tsx` maps each `blockType` to one renderer;
  `sections/renderMarketingSections.tsx` renders a document `layout`. Marketing
  route pages resolve a document and call `renderMarketingSections()`; they never
  import section renderers directly.
- Each renderer lives at `sections/**/<blockType>/<PascalBlockType>Section.tsx`
  (today `sections/homeHero/HomeHeroSection.tsx`). Optional intermediate
  folders may group families; the leaf folder and renderer name describe
  content structure, never a product or brand. Supporting components are
  colocated in the leaf folder; only the registered renderer uses the `*Section`
  name.
- Section styling uses Tailwind classes; no page-level or global CSS. A
  colocated CSS module needs a selector or keyframe Tailwind cannot express.
- Static assembly excludes Payload; payload-ready assembly adds the guarded
  adapter without changing these contracts.
- `averlo-media-exception-next-line <rule> -- <rationale>` annotations are
  owned by `npm run verify:marketing-media`, which defines the accepted rule names.
