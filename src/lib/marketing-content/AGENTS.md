# Marketing content boundary

Observable source, media and composition guarantees belong to
`app/marketing/content-sources/source-resolution`,
`app/shared/frontend/content/media-delivery` and
`app/marketing/composition/marketing-composition`. Public metadata/body reads
also follow `app/marketing/metadata/public-document-metadata`; this file owns
implementation topology. Discover the applicable IDs with stock OpenSpec
list/show rather than loading every sibling. Verification
procedures are `docs/testing/content-sources.md` and
`docs/testing/marketing-composition.md`. Read the selected block, fallback,
resolver, registry and nearest owner rather than unrelated source integrations.

- Marketing components render source-neutral `MarketingPageDocument`, `SiteLayoutDocument`, and discriminated section props. They never consume Payload document shapes directly.
- `getMarketingPage()` and `getSiteLayout()` are server-side source boundaries. Normalize CMS relationships, media, drafts, SEO, localization, redirects, taxonomies, and other source metadata before it reaches renderers.
- Committed TypeScript fallback documents remain the static source, the Payload-ready default, and the migration/recovery baseline until external readback is proven.
- New sections declare only the data their renderer needs and preserve the existing `blockType` layout contract; do not turn the frontend model into a generic page builder.
- Marketing route pages resolve documents and delegate their `layout` to `renderMarketingSections()`; they do not import or compose registered section renderers directly.
- Each registered `blockType` owns one named renderer. Its path may use any number of organizational folders, but must end in `sections/**/<blockType>/<PascalBlockType>Section.tsx`; the leaf folder and renderer name describe content structure, never the product or brand. For example, use `heroes/homeHero/HomeHeroSection.tsx`, never `pearl/PearlHeroSection.tsx`.
- Intermediate section folders classify the section family (`heroes/`, `articles/`, and similar); they do not change the canonical leaf folder or renderer name. Supporting components may be colocated under that leaf folder, but only the registered renderer uses the `*Section` name.
- Use Tailwind classes for marketing-section layout and presentation. Do not add page-level or global CSS for a marketing section. A colocated CSS module needs a specific selector or keyframe rationale that Tailwind cannot express.
- Run `npm run verify:marketing` for a complete marketing change. Use `npm run verify:marketing-sections`, `npm run verify:site-layout`, or `npm run verify:marketing-media` only for focused diagnosis.
- Public navigation and CTAs use the exclusive `surfaceId` or `href` link contract. Registered destinations use installed Marketing or Auth surface IDs; profile-installed internal routes remain plain generated links and stay outside marketing content documents.
- Static assembly excludes Payload completely. Payload-ready assembly adds the guarded source adapter without changing these frontend contracts.
- Keep `MARKETING_CONTENT_SOURCE=fallback` until the published `site-layout` global and marketing page documents have passed seed/readback verification. Once explicitly set to `payload`, configured read or normalization failures are fatal; do not silently replace authoritative CMS content with stale fallback data.

## Section ownership

- A new source-backed multi-section page belongs to the installed marketing
  route family and its canonical surface registry. Explicit existing utility
  and document exceptions retain their narrower owners; they do not authorize
  new route-local composed pages.
- One block represents one independently reviewable semantic/source section,
  not a whole page or arbitrary sibling bands. Supporting subregions share its
  semantic heading context and comparison selector. Every block declares
  meaningful source-neutral content/media beyond ID and type; visible copy and
  imagery come from those fields, not a hardcoded page inside the renderer.
- Every registered renderer has exactly one shared `Section` semantic root.
  Use its current Storybook contract for imports, props, variants, compounds and
  guarantees. Use `Section.Background` for full-bleed artwork and the documented
  foreground frame; local wrappers cannot replace those owners for pixel control.
- Preserve registry section ID, block type and label attributes. Add stable
  selectors only for a real comparison or interaction need, never generated
  classes or copy. The selector must isolate its region without adjacent pixels.
- Do not place headers, footers, multiple independent source cases or the
  accumulated page inside a content renderer. Temporary source-fidelity recipes
  may stay renderer-local or colocated, but are not public owners. Product,
  campaign and Figma-node names cannot become block types or generic owners.
- Source decomposition and authority locks live in Compose's source-intake and
  Visual Parity's focus-packet procedures. Distinct source/parity cases stay
  distinct; shared background or theme is insufficient reason to merge them.

## Media implementation

- Retain exact constituent image, logo and icon bytes. Download temporary
  design-tool assets into the owning committed asset boundary; their original
  URL is provenance, never a production source. Never render flattened source
  frames, section captures, task artifacts or expiring Figma/MCP URLs as UI.
- Import committed raster marketing assets statically and render with
  `next/image`, truthful intrinsic dimensions, responsive `sizes` and
  `placeholder="blur"` using the asset's generated blur. Do not replace available
  static imports with public-path strings or fabricate unrelated blur data.
  Keep exact SVG assets as vectors without meaningless raster blur placeholders.
- Decorative/brand imagery defaults to presentation-owned committed assets;
  editorial/product imagery may come from the configured source. A justified
  owner may depart from that sourcing split while retaining delivery and
  accessibility guarantees. Resolve either source before rendering: the static
  branch carries `StaticImageData`; the remote branch carries `src`, `width`,
  `height`, `blurDataURL`; both carry the owning alt contract. Provider records,
  metadata and unresolved relationships never reach section renderers.
- Empty alt is only for genuinely decorative media; authored content requires
  meaningful alt. Do not misclassify content to avoid that requirement. Preload
  only an image proven to be the route's LCP.
- For a legitimate runtime/framework exception to an exemptable default, place
  `averlo-media-exception-next-line <rule> -- <rationale>` immediately before
  the affected use. One annotation exempts one reported rule once, never a file.
  Do not annotate ordinary imagery to evade import/resolution. Temporary URLs,
  reference captures and missing alt contracts remain non-waivable; the media
  verifier owns the accepted rule names and rejects stale annotations.

## Source and document metadata boundary

- Extend frontend contracts deliberately, adapting every selected source rather
  than replacing the established layout model during CMS activation. Retain
  fallback as static source, ready-mode authority, migration seed, parity baseline
  and recovery reference until schema, service, seed, readback and parity gates pass.
- Static excludes Payload code, packages, routes and deployment material. Ready
  mode is guarded; a resolver or seed never activates admin/API routes. After
  explicit authority, missing configuration, read failures, missing/unpublished
  or malformed content and invalid required surface references fail closed.
- Do not fetch Payload REST, GraphQL or Local API from frontend components.
  Neon, Blob, Vercel environment/secret/resource provisioning stays in its
  dedicated operational workflow, separate from schema/adapter implementation.
- Page documents may provide title/description, never route identity, canonical
  path, indexability or provider-shaped metadata. `getMarketingPage()` memoizes
  its server read for a request; metadata and body use that same document and
  fail together under authoritative source failure. Do not read a provider
  separately for metadata or silently substitute stale metadata.
