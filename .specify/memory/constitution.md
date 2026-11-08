# Averlo Next Template Constitution

The template is a product-neutral Next.js foundation that materialises
independent projects. `PRODUCT.md` states its intent; `specs/` holds its
behaviour; this file holds the principles every spec, plan and change obeys.

## Core Principles

### I. Spec first, through the write-spec workflow

Behaviour changes start in a spec, written with `.specify/workflows/write-spec/`.
Code follows an accepted spec; it never invents behaviour the spec lacks. A
missing contract is a scope gap to raise, not permission to guess an API or a
product rule.

### II. Living specs in one tree; amend the owner

Specs live in `specs/` as a tree whose path is the identity (no numbers).
Each capability has one owner folder. New work on an existing capability
amends that owner: a new `### Session YYYY-MM-DD` under Clarifications, the
changed requirements, and new tasks. A new folder exists only for a genuinely
new capability. `specs/README.md` is the map. Requirement IDs stay stable once
published; retired IDs are never reused.

### III. Reuse the design system

UI is composed from the existing owners listed in
`specs/platform/design-system/usage/`. Field, TextInput, IconSwap, MorphLabel,
ContentPresence, Dropdown, ScrollArea and the rest are used, never re-implemented.
A new variant, size, component or icon needs a stated reason in its spec and
its PR. Use the highest complete owner before composing lower-level parts.

### IV. Every visible change is animated

Presence, size, position, text, icon, colour and loading-to-loaded changes all
move through their owner, as `specs/platform/design-system/motion/` defines.
Motion uses tokens, never literals, and reduced motion or `?motion=off` snaps
everything. Motion never gates access or content.

### V. Port rules, never code

Ideas from other repositories arrive as rules in a spec. Code, styles and
token values from another repository are never copied. A backport records the
source repository and commit in its PR.

### VI. Tests prove specs

A requirement is done when a test proves it. Component families are proved by
Storybook play tests; pages are proved by Playwright characterisation at 390
and 1440 wide. Each spec names the stories or tests that prove it. Checks the
brief requires block; extra checks are advisory.

### VII. No invented product in the template

The template ships platform and template specs only. `specs/product/` stays an
empty skeleton here; a generated project writes its own product specs. Demo
fixtures stay resettable and never send, store or log real data.

### VIII. Secrets stay out of chat and git

Secrets, tokens and keys live only in owner-only (`chmod 600`), gitignored
files that the code reads directly. They are never pasted into chat, printed,
quoted, logged or committed. `.env.example` files hold names, never values.

## Agent principles

- **Grill before a new feature.** Before specifying a new capability, question
  the plan and lead with recommendations. Each material choice (approach,
  architecture, scope, git) waits for Olaf's explicit selection; never
  auto-resolve it.
- **Ponytail.** Pick the simplest solution that works: YAGNI, the standard
  library and native platform features before dependencies, one line before
  fifty. Record what was left out and why.
- **Follow the workflows.** The main thread follows `.specify/workflows/main/`;
  spec work follows `.specify/workflows/write-spec/`. Other procedures
  (create-project, publish, backport, verify) live beside them.
- **Threads.** Work is split into separate threads or sessions only when Olaf
  decides. Agents may propose a split; they do not start one.
- **Honest handoff.** Report what was verified and what was not. Lead with the
  review link (PR, verified preview, or file links). Never call a preview live
  without checking it.

## Governance

This constitution overrides folder `AGENTS.md` files and skills where they
conflict. `AGENTS.md` files are thin entry points: structure, topology, import
direction, and pointers to the spec that owns each behaviour. Amend this file
through the write-spec workflow, bump the version, and record the date.

**Version**: 1.0.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
