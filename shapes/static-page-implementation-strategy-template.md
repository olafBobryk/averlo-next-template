# Shape: Static Page Implementation Strategy Template

Status: planned

Role: template

Guide: ../_guides/artifacts/shape.md

## Intent

Record the reusable static page implementation strategy template as a floating
planning component. Future concrete page packets can instantiate this route,
but the template itself does not join the active project trunk and does not
authorize page implementation.

This template captures two separate routing decisions. Before implementation,
an agent recommends whether the page can move directly into implementation or
needs a section-defined source contract first. When static content readiness is
unclear, the route includes a lightweight content-data prep workpiece before
the human or steward makes the final prep-mode decision. After implementation,
the human or steward chooses whether review stays in one page-level packet or
fans out into parallel section review packets.

## Workpiece References

- `workpieces/static-page-entry-recommendation-template.md`: evaluates source
  clarity, motion/interaction risk, page semantics, and design-system fit
  before recommending a prep mode.
- `workpieces/static-page-content-data-population-template.md`: optionally
  checks route copy, slugs, image references, metadata, CTAs, links, and
  fallback/static data readiness before the prep-mode checkpoint.
- `workpieces/static-page-section-defined-contract-template.md`: defines page
  body sections by name, source, known intent, gates, and allowed
  implementation surface before implementation.
- `workpieces/static-page-implementation-pass-template.md`: describes the page
  implementation pass after the accepted prep mode.
- `workpieces/static-page-single-page-review-template.md`: describes the
  page-level review route when feedback should stay cohesive.
- `workpieces/static-page-parallel-section-review-template.md`: describes the
  section-review fan-out route after implementation exists.
- `workpieces/static-page-pattern-return-template.md`: describes return
  evidence and learning classification.
- `workpieces/static-page-quality-harness-template.md`: optional terminal
  harness step for page-target scroll performance or other quality checks when
  the project keeps the full-template tooling.

## Checkpoint References

- `checkpoints/static-page-implementation-strategy-template-start.md`: visual
  start anchor for this disconnected planning template.
- `checkpoints/static-page-implementation-prep-mode-decision-template.md`:
  first human/steward checkpoint after the entry recommendation.
- `checkpoints/static-page-human-review-routing-decision-template.md`: second
  human/steward checkpoint after implementation, before choosing review shape.

## Fixed Decisions

- This shape is a reusable planning/template artifact, not an executable
  branch by itself.
- The connected project path should instantiate this template only from a
  concrete page workpiece or steward direction.
- Human review always happens. The first decision is not whether review is
  trusted; it is whether the page needs section/source structure before
  implementation begins.
- The first route decision is human/steward-owned. The agent provides a
  recommendation from source clarity, motion/interaction risk, page semantics,
  and design-system fit.
- Static content-data prep is optional and page-scoped. It records whether
  fallback/static content is ready enough for implementation; it does not
  create CMS/Payload obligations.
- The second route decision is human/steward-owned. The agent prepares
  implementation evidence; it does not silently choose single-page or parallel
  section review.
- Parallel section review belongs after a page implementation exists. It is not
  a per-section implementation loop.
- Product page names, copy, source URLs, preview URLs, run IDs, commits,
  worktree paths, and implementation status stay out of this scaffold template.
- The quality harness terminal step is optional. Full template instances have
  the scroll-performance/autoresearch harness available, while thin-start or
  pruned instances may remove it with `--no-scroll-performance`.

## Autonomous Decisions

- Agents may use this template as planning guidance when preparing future
  static page packets.
- Agents may recommend direct implementation when source context is clear,
  motion/interaction risk is low, and the page can mostly use existing
  design-system surfaces.
- Agents may recommend a section-defined contract when section boundaries,
  source ownership, page semantics, motion meaning, CTA behavior, accessibility
  impact, or design-system usage are ambiguous.
- Agents may use the static content-data prep workpiece when route copy, slugs,
  image references, metadata, CTAs, links, or fallback data readiness would
  otherwise become implementation ambiguity.
- Agents may keep section-contract fields fluid and intentionally unresolved
  until they become blocking.
- Agents may recommend single page review for cohesive feedback or parallel
  section review when page breadth and review speed matter.
- Agents may recommend the optional quality harness after pattern return when
  scroll performance, page jank, layout stability, or repeated review friction
  would benefit from a measured loop.

## Escalation Triggers

- Stop before connecting this template shape into the main trunk.
- Stop before implementing page route or section files from this shape alone.
- Stop before choosing between direct implementation and section-defined source
  contract without human/steward acceptance.
- Stop before treating placeholder images or draft fallback content as final
  page/source truth.
- Stop before choosing between single page review and parallel section review
  without human/steward acceptance.
- Stop before turning a product-specific page example into a default template
  field.
- Stop before treating the optional quality harness as mandatory when the
  project pruned scroll-performance tooling or no page-quality risk justifies
  the extra loop.

## Return Evidence

- `artifacts/static-page-doc-template-contract.md` names the generic page-doc
  workflow, field groups, strip rules, and routing checkpoints.
- The map shows this route as an intentional disconnected component.
- Future page workers can return entry recommendation, optional static
  content-data readiness, accepted prep-mode decision, optional section
  contract, implementation evidence, accepted review routing, review evidence,
  pattern-learning classification, and optional quality-harness findings when
  used.

## Run References

- none

## Commit Evidence

- none
