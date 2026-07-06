# Artifact: Static Page Doc Template Contract

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record the reusable page-doc template contract that future static page work can
instantiate without importing product-specific page state.

## Artifact Type

doc

## Reference

- `artifacts/static-page-doc-template-contract.md`

## Applies To

- `static-page-implementation-strategy-template`: floating template shape.
- `static-page-entry-recommendation-template`: prep-mode recommendation.
- `static-page-content-data-population-template`: optional static
  content-data readiness before the prep-mode checkpoint.
- `static-page-implementation-prep-mode-decision-template`: first routing
  checkpoint.
- `static-page-section-defined-contract-template`: optional page-body section
  contract.
- `static-page-implementation-pass-template`: implementation pass after
  accepted prep.
- `static-page-human-review-routing-decision-template`: second routing
  checkpoint.
- `static-page-single-page-review-template`: cohesive page-level review route.
- `static-page-parallel-section-review-template`: post-implementation section
  review fan-out route.
- `static-page-pattern-return-template`: learning classification and return
  evidence.
- `static-page-template-instantiation-placeholder`: connected project-path
  placeholder for choosing and instantiating the template later.

## Evidence Role

decision-support

## Source Pattern Summary

The source product's useful page-doc structure is workflow shape, not page
content:

| Pattern | Template Use | Product State To Strip |
| --- | --- | --- |
| Entry recommendation | Decide whether source context is clear enough for direct implementation. | Specific page names, copy, assets, previews, and status. |
| Static content-data readiness | Check whether fallback/static route copy, slugs, image refs, metadata, CTAs, and links are implementation-ready or gated. | Product copy, final media, launch-specific metadata, CMS records, and route-specific facts. |
| Prep-mode checkpoint | Require human/steward acceptance before choosing direct implementation or section contract prep. | Run IDs, thread IDs, commits, and local worktree state. |
| Section-defined contract | Name page-body sections, source references, known intent, gates, implementation scope, and review fields. | Product copy, brand semantics, final media, and page-specific IA. |
| Implementation pass | Build from accepted prep mode while recording design-system and motion decisions. | Product implementation state and deployment evidence. |
| Review routing checkpoint | Choose single page review or parallel section review after implementation exists. | Source product review threads and preview URLs. |
| Pattern return | Classify what changed and what learning should or should not be promoted. | Project-only lessons that do not belong in a reusable scaffold. |

## Template Field Groups

Future page docs should use only the field groups that are relevant to the
accepted route:

| Group | Purpose |
| --- | --- |
| Page route and scope | Name the route, page owner, and whether the work is static page work. |
| Source context | Cite repo docs, design file nodes, fallback content, sibling evidence, or explicit source gaps. |
| Prep-mode recommendation | Explain direct implementation vs section-defined contract with the smallest necessary reasoning. |
| Static content-data readiness | List route copy, slugs, image references, metadata, CTAs, links, fallback data, placeholder usage, and source gates only when they affect implementation readiness. |
| Section planning ledger | List page-body sections, source references, known intent, gates, and implementation readiness. |
| Implementation boundary | Name allowed files, reusable component surfaces, route-local surfaces, and prohibited drift. |
| Motion and interaction boundary | State whether behavior is absent, inherited, or page-specific and what evidence is required. |
| Review routing decision | Record single page review or parallel section review after implementation evidence exists. |
| Return classification | Split learning into path-level candidates, project-level lessons, parked scaffold research, and do-not-promote details. |

## Minimal Section Contract Row

| Section | Source | Goal status | Implementation evidence | Review / implementation intent | Gate |
| --- | --- | --- | --- | --- | --- |
| `<section name>` | `<source node or source gap>` | `verified` / `human_gate` / `blocked` | `none yet` or concrete evidence | `<what future implementation/review should prove>` | `<smallest needed decision>` |

## Section Packet Fields

Use these fields only when the accepted prep mode requires a section-defined
contract:

- Page scope
- Source reference
- Current implementation evidence
- Source-matched section name
- Known intent
- Copy instruction
- Visual or pattern instruction
- Media instruction
- Component instruction
- Motion or animation instruction
- Allowed implementation surface
- Prohibited drift
- Required reviewer output
- Decision needed

## Routing Rules

- The entry recommendation is advisory; the human or steward owns the
  prep-mode decision.
- Static content-data readiness is optional. Use it when missing copy, slugs,
  image references, metadata, CTAs, links, or fallback data would blur the
  implementation boundary.
- Direct implementation is acceptable when source context, section boundaries,
  motion, interaction, accessibility impact, and design-system fit are clear
  enough.
- Section-defined prep is preferable when source ownership, section boundaries,
  page semantics, motion, interaction, CTA behavior, or component reuse is
  ambiguous.
- Parallel section review happens after implementation exists. It is not a
  per-section implementation loop.
- Shell-owned header, menu, repeated CTA, footer, and shell adjacency stay out
  of page-body section contracts.
- Placeholder images and draft fallback copy are temporary implementation aids
  unless a source packet explicitly accepts them as final.

## Strip Rules

- Strip product names, brand copy, route-specific IA, media assets, preview
  URLs, local paths, commits, thread IDs, run IDs, PIDs, and dirty-state notes.
- Convert concrete product facts into placeholders or source-gap prompts.
- Keep route decisions, field groups, evidence expectations, and review
  checkpoints.
- Do not treat any source design file as a 1:1 visual target unless a future
  page packet explicitly asks for visual parity.

## Notes

- This artifact creates reusable documentation infrastructure only. It does not
  add page routes, section components, content data, or provider behavior.
