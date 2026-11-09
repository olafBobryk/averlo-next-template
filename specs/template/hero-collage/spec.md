# Specification: Home hero collage reflects the repository

**Spec path**: `specs/template/hero-collage`

**Created**: 2026-11-08

**Status**: Accepted, living. Canonical-only: never copied into a generated project.

**Builds on**: `specs/platform/content/media` (FR-009, pre-captured decorative hero collage)

**Verified by**: review of the recaptured images in `src/lib/marketing-content/sections/homeHero/capture/`; no automated check.

## Purpose

Keep the canonical home hero collage an honest picture of what this repository ships today: its stack, its skills and its workflows.

## Clarifications

### Session 2026-11-08

- **Q: What should the collage show besides component specimens?**
  - A: Olaf: "Update the visual to reflect the repo's current state." The libraries appear as logos, and the skills and workflows cards list what the repository actually ships (FR-001, FR-003).
- **Q: Is this enforced by a check?**
  - A: No. Olaf asked for the spec without an automated check or verify script; the rule is kept by the change author and reviewed on the recaptured images (FR-002).

## Requirements

### FR-001: The collage reflects the current repository

The canonical home hero collage MUST show the repository's current stack as logos (FR-003), the skills the Averlo plugin ships (`plugins/averlo/skills/`) and the Spec Kit workflows in `.specify/workflows/`. It names nothing the repository does not ship.

### FR-002: Changes update the collage in the same change

A change that adds, removes or renames a stack library, a shipped skill or a workflow MUST update the collage in the same change and recapture it with `npm run hero:capture` (media FR-009).

**Scenario: A library is replaced**

- **When** a change replaces a library in the stack
- **Then** the same change updates the logo set, recaptures the collage and lists the new logo set here

### FR-003: Current logo set

Each stack logo is its own collage item: a large monochrome mark in the collage's text colour with its name, kept with a per-logo source note in `src/lib/marketing-content/sections/homeHero/stackLogos.ts`. The current set is, in order: Next.js, React, Tailwind CSS, Motion, GSAP, Lenis, Spec Kit, Storybook, Biome, Vitest, Playwright, Payload.

### FR-004: Current skills and workflows cards

The skills card lists the Averlo plugin skills, in order: Visual parity, Create project, Publish project. The workflows card lists the Spec Kit workflows, in order: Main thread, Write a spec, Create a project, Publish a project, Backport from a project, Verify, Compose, Systemize, Contact delivery. Both lists live in `src/lib/marketing-content/sections/homeHero/HomeHeroChoices.tsx`.
