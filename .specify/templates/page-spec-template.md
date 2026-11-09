# Page Specification: [PAGE NAME]

**Spec path**: `specs/product/[marketing/pages|dashboard]/[route-or-area]`

**Created**: [DATE]

**Status**: Draft

**Builds on**: `specs/platform/surfaces/[marketing|dashboard]/pages` and [other owner specs]

**Input**: User description: "$ARGUMENTS"

<!--
  LIVING SPEC: one page, one owner. Later changes to this page amend this file
  (new Clarifications session, changed requirements, new tasks). Generic rules
  for every page live in specs/platform/surfaces/<surface>/pages; do not repeat
  them here, only refine them.
-->

## Clarifications

### Session [YYYY-MM-DD]

- **Q: [question]**
  - A: [answer] ([FR-00N])

## Purpose

[One or two sentences: what this page is for and what a visitor can do here.]

## Audience

- **Primary**: [who arrives here, from where, and what they want]
- **Secondary**: [other readers, if any]

## Route

- **Path**: `[/route]` ([static | dynamic: `[param]` typed as ...])
- **Surface**: [marketing | dashboard | auth]
- **Registry entry**: [surface ID in the family registry]
- **Ancestry**: [semantic parent for breadcrumbs, or "top level"]
- **Access**: [public | signed-in | capability: ...]

## Sections

Every section is composed from existing design-system owners
(`specs/platform/design-system/usage`). Name the owner; a new component or
variant needs a stated reason.

| # | Section | Purpose | Composed from (owners) | Content fields |
|---|---|---|---|---|
| 1 | [Hero] | [...] | [`Section`, `Text`, `Button`] | [heading, body, primary CTA] |
| 2 | [...] | [...] | [...] | [...] |

New owners needed: [none | owner + reason]

## Content source

- **Source**: [static fallback document | CMS (activated) | server read from ...]
- **Contract**: [section `blockType`s / view model the page renders]
- **Who edits it**: [developer in code | editor in CMS]

## States

| State | When | What the visitor sees |
|---|---|---|
| Loading | [region reads data] | [real-content skeletons per region; known copy stays live] |
| Empty | [read succeeds with no items] | [empty message + next action] |
| Error | [read fails recoverably / prerequisite unavailable] | [local error + retry / explanation] |

Pages with no data-dependent regions write "Static: no loading, empty or error
state".

## Motion notes

[Which changes move and through which owner: presence modes, MorphLabel,
IconSwap, entrances. Everything snaps under reduced motion and `?motion=off`.
"None beyond the owners' defaults" is a valid answer.]

## Metadata

- **Title**: [per the surface's title policy]
- **Description**: [...]
- **Indexing**: [index | noindex, nofollow]
- **Canonical / social**: [derived from the installed route]

## Requirements

- **FR-001**: [The page MUST ...]
- **FR-002**: [...]

## Acceptance

Checked at 390 and 1440 wide, motion on and `?motion=off`:

1. **Given** [state], **When** [action], **Then** [outcome]
2. No horizontal scroll; essential content and controls present on first render.
3. Every state in the table above renders as described.

## Characterisation test

- **Test**: `[tests path or Playwright spec]`
- **Covers**: [each section renders, each state, primary CTA destination, metadata]
- **Viewports**: 390 and 1440
- **Baseline**: [recorded on DATE; updates need Olaf's approval]

## Assumptions

- [...]
