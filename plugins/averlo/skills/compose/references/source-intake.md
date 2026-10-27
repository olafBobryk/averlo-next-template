# Source intake

Read this reference when Compose uses Figma or depends on external fonts,
constituent assets, or durable source provenance.

## Source decomposition before product edits

Enumerate source hierarchy, bounds, top-level heading contexts, full-bleed
backgrounds, vertical-rhythm changes and intended comparison boundaries before
assigning owners. Separate content cases, shell cases, excluded regions and
accumulated comparison gates. Map each independently reviewable content landmark
to one stable case ID, source-neutral block type, registered renderer and Target
selector. An evidenced footer is a shell case with a shell selector, never a
content block, registered renderer or shared `Section` root. Excluded headers
belong in neither inventory; accumulated gates are comparison-only.

Keep landmarks with separate source or parity cases as separate blocks/renderers,
even with continuous backgrounds or matching themes. Pause when source evidence
does not permit an unambiguous split. Coherent landmarks may share one case and
renderer when source hierarchy, heading context, interaction and intended review
boundary support it. A possible later maintainability split is a human-reviewed
Systemize Composition decision, not a Compose failure or reason to invent cases.
Never register the accumulated page as a section.

Apply the target repository's marketing-content and shell AGENTS plus the
`app/marketing/composition/marketing-composition` contract. Source-backed multi-section pages use
the installed route family, document and registered renderer boundary even when
their visual recipe remains local. Each renderer owns one logical source section
and exactly one shared `Section` root, background/frame from its current owner
contract; visible content comes from meaningful source-neutral fields. Keep
temporary fidelity recipes local until an explicit shared-owner decision.

Compose keeps the approved header immutable and excludes it from source parity
without removing it from production. Header redesign requires separately scoped
non-Compose work. Implement evidenced footers through the existing shared footer,
and keep shell review states in SiteShell/Preview infrastructure, never route
CSS. Exact local identity assets do not authorize changes to nested shared owners.

## Figma authority and isolation

1. Select the configured primary official Figma connector for the whole change.
   Call `whoami` through that connector and require
   `webvizionagency@gmail.com` unless the caller explicitly selects another
   identity. Use that same connector for source context, metadata, screenshots,
   exports, and any permitted scratch operation. Do not combine identity proof
   from one connector with source reads or writes from another.
2. Load the Figma `figma-use` and `figma-design-to-code` skills. Locate the
   supplied focus and its containing page, and keep the original URL and node as
   immutable visual authority. Use page metadata only to decompose the focus.
   Before implementing each case, call `get_design_context` on that case's exact
   authoritative section frame. Page-level or containing-frame design context
   cannot substitute for section-frame context. Read screenshots and exports
   directly from the same authority; these read-only operations never require
   an Agent Space.
3. Before product edits, save every authoritative case as
   `.codex/visual-parity/<task>/reference/<case-id>.png` and bind that stable
   artifact to its Figma node ID and bounds in the Visual Parity packet and
   matrix. Preserve the complete source frame separately for the accumulated
   gate. If the section-frame export omits an owned surrounding background,
   materialize the equivalent crop from the pinned complete source frame.
4. Treat Agent Space as one reusable generic Figma scratch location, not a
   per-task copy, source authority, receipt, or implementation prerequisite.
   Reuse an existing generic Agent Space whenever a Figma-side scratch edit is
   genuinely required. Never create a target-, route-, task-, or source-page-
   specific Agent Space when a reusable one exists. If no Figma-side write is
   needed, record Agent Space as `not used` and continue. The absence of a clone
   or dedicated cloning operation must not block read-only Compose work.
5. Never mutate the designer's original page. Pause only when a required
   Figma-side write cannot be isolated safely in an existing generic Agent
   Space, or when the authenticated primary connector cannot perform an
   operation actually required by the requested focus.
6. Record the connector identity, source URL, focus bounds, and the reused
   generic Agent Space file/page and scratch node when used—or `not used`—in the
   ignored Visual Parity focus packet.

## Fonts, assets, and provenance

1. Preflight required fonts and constituent assets before product edits. Treat
   material as supplied only when it comes from the Target repository, the
   authoritative connector, a caller-supplied path, or an explicitly configured
   shared library.
2. Wait for missing licensed fonts or unavailable exact assets. Do not silently
   substitute a font, borrow from another project or regression, rasterize text,
   or use the reference frame as product UI.
3. Treat supplied font bytes, Figma weight labels, font-internal metadata, and
   CSS weights as separate evidence. Before layout correction, load each supplied
   face under one distinct evidenced CSS weight, wait for `document.fonts`, and
   calibrate representative source text by glyph shape, measured width, line
   breaks, line height, and tracking. Do not map one physical face to a broad
   weight range, permit synthetic bold, or call typography verified merely
   because the expected bytes are present. Disable font synthesis for the
   calibrated scope and pause when no supplied face can reproduce an
   authoritative role.
4. Retain exact constituent asset bytes and follow the target repository's
   `app/shared/frontend/content/media-delivery` spec and marketing-content AGENTS. When the authority contains existing vector identity
   artwork, export that exact logo or mark as SVG and commit it as a constituent
   asset, or reuse an identical existing asset. Preserve its geometry and
   `viewBox`; never redraw it, replace it with text or a glyph, or accept a
   surrogate because the original export needs implementation-safe cleanup.
   Download expiring design-tool URLs during implementation; the URL is
   provenance, not a production source.
5. Add durable external-source provenance to `PRODUCT.md` under
   `## Product sources`, recording source, authority, focus, and supplied
   material. Do not record workflow progress or conversion status there.
