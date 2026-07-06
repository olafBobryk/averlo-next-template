# Workpiece: Static Page Section Defined Contract Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Template the prep route where a future static page worker defines page-body
section boundaries, source ownership, known intent, implementation scope, and
review packet fields before implementation begins.

## Acceptance

- The worker proceeds only after the prep-mode checkpoint accepts the
  section-defined contract route.
- Page-owned body sections are listed before implementation begins.
- Shell-owned header, menu, repeated CTA, footer, and shell adjacency are
  excluded.
- Each section includes a source reference or source gap, known intent, open
  gates, implementation evidence disposition, motion/interaction instruction,
  allowed implementation surface, prohibited drift, and decision needed.
- Missing fields are intentionally unresolved until they become relevant to
  implementation or review.
- No route/component implementation is authorized by this contract template.

## Tests

- Check every mapped section belongs to the page body.
- Check shell-owned regions are excluded.
- Check each section has a source reference or explicit source gap.
- Check implementation evidence is marked absent when no implementation exists.
- Check motion/interaction instructions cite existing systems or explicit gaps.
- Check no route/component files are edited during the contract pass.

## Artifacts

- Section planning ledger.
- Per-section packets.
- Source gaps or human/steward questions.
- Accepted prep-mode decision.

## Commit Evidence

- none

## Notes

- This template prepares implementation and review packets. It does not create
  a per-section implementation loop.
