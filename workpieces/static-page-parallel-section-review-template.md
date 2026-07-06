# Workpiece: Static Page Parallel Section Review Template

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Template the human review route where a completed static page is split into
parallel section review packets for breadth, speed, or detail.

## Acceptance

- The worker proceeds only after the review routing checkpoint accepts the
  parallel section review route.
- Section review packets are created only after an implementation pass exists.
- Each section review packet names the section, source reference, current
  implementation evidence, known intent, and the specific human decision or
  feedback needed.
- Parallel section review does not reopen shell-owned header, menu, repeated
  CTA, footer, or shell adjacency ownership.
- Feedback from parallel review is merged back into one return classification.

## Tests

- Check the review routing decision accepted parallel section review.
- Check each section review packet has source and current implementation
  evidence.
- Check section review does not start before implementation exists.
- Check shell-owned regions are excluded.
- Check parallel feedback merges into one return classification.

## Artifacts

- Section review packets.
- Parallel thread references when created.
- Merged feedback classification.

## Commit Evidence

- none

## Notes

- This is a review fan-out, not an implementation fan-out.
