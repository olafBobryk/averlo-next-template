# Specification: Design-system usage

**Spec path**: `specs/platform/design-system/usage`

**Migrated from**: OpenSpec `app/shared/frontend/components/component-contracts` (origin/main `3fd01907`); the owner table is new

**Status**: Accepted, living

**Builds on**: `specs/platform/design-system/families/*`, `specs/platform/design-system/motion`, `specs/platform/design-system/scroll`

**Verified by**: [docs/testing/component-contracts.md](../../../../docs/testing/component-contracts.md), `npm run test-storybook`, `npm run verify:storybook-catalog`

## Purpose

Make supported shared UI behavior discoverable and faithful across runtime consumers, Storybook teaching and public catalogue/export projections. Name the one owner for each UI pattern, so agents compose the design system instead of re-implementing it.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only for FR-001 to FR-005: each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, and scenarios kept their wording.
- **Q: What does this spec add?**
  - A: The owner-per-pattern table (FR-006), the never-re-implement list (FR-007) and the stated-reason rule for new variants and components (FR-008), so the folder `AGENTS.md` files can stay thin.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/components/AGENTS.md`, `src/components/ui/AGENTS.md`, `src/components/ui/primitives/AGENTS.md`, `src/components/branding/AGENTS.md`, `src/components/ui/icons/AGENTS.md`, `src/components/composites/markdown/AGENTS.md` and `plugins/averlo/README.md` (icons) (origin/main `3fd01907`) with no other spec home. They are FR-009 to FR-020, with their meaning kept. Storybook-owned support, neutral teaching, distinct wrappers, stable public names and mounted native semantics were already FR-001 to FR-005. The assistant tool-call and approval rule from `src/components/domain/assistant/AGENTS.md` lives with the dashboard pages spec.

## Requirements

### FR-001: Discoverable supported owner contract

Shared UI MUST expose an intentional supported contract through its documented public owner and Storybook evidence. Source exports alone MUST NOT imply public support. Consumers MUST use the highest complete applicable owner without bypassing its semantics or focus behavior through styling.

**Scenario: Choose a shared control**

- **When** a consumer needs behavior already covered by a complete supported owner
- **Then** it uses that owner and its documented API rather than reconstructing the behavior from lower-level parts

### FR-002: Complete and neutral variant teaching

Public teaching MUST cover each supported variant axis and meaningful interaction state with neutral reusable guidance. Adding or moving a public owner MUST preserve useful existing teaching and migrate its consumers. Context-specific aliases MUST NOT substitute for a genuinely reusable distinction.

**Scenario: Add a supported owner variant**

- **When** an owner gains a public variant
- **Then** its contract and teaching expose the complete supported choice and affected consumers remain consistent

### FR-003: Faithful public projections

Stories, catalogues and export previews MUST project the same supported implementation and contract. Runtime code MUST NOT depend on story or catalogue modules. Preview-specific shells and portals MUST remain isolated, and deliberate reduced-profile omissions MUST be represented accurately.

**Scenario: Export a reduced-profile owner**

- **When** a generated profile supports fewer owner features
- **Then** its catalogue and export teaching match those features without presenting unavailable variants

### FR-004: Native semantics remain mounted

Input and composite owners MUST retain the real native or documented interaction owner responsible for value, keyboard, form and accessibility behavior. Decorative wrappers and specialized rendering MUST NOT replace that owner with an inert imitation.

**Scenario: Custom visual input presentation**

- **When** an input adds specialized visual presentation
- **Then** the mounted interaction owner still supplies its supported value, keyboard, form and accessibility behavior

### FR-005: Stable public identity

Owner moves MUST preserve public names unless an explicit migration changes them. A wrapper MUST add distinct reusable behavior rather than rename an existing owner. Shared contract changes MUST update teaching and consumers together.

**Scenario: Move a shared component**

- **When** a supported owner changes source location without an API migration
- **Then** consumers retain its public identity and teaching still resolves to the same supported behavior


### FR-006: One owner per pattern

Feature code MUST use the owner listed for its pattern. Paths are under `src/components/`. Supported APIs and defaults are the owner's Storybook stories and the family specs.

| Pattern | Owner | Family spec |
|---|---|---|
| Text and headings | `ui/primitives/Text` (`Text.Skeleton`) | |
| Buttons and button-like links | `ui/primitives/Button` (`Button.Skeleton`), `buttonStyles` | `families/buttons` |
| Arrow call-to-action | `ui/helpers/ArrowAction` | `families/buttons` |
| Copy to clipboard | `ui/helpers/useCopyAction`, `ui/misc/CopyField` | `families/buttons` |
| Icons | `ui/icons/Icon` and its registries | |
| Icon that changes with state | `ui/helpers/IconSwap` | `families/presence` |
| Text that changes in place | `ui/helpers/MorphLabel` (this batch) | `families/presence` |
| Show/hide and size changes | `ui/motion/presence/ContentPresence` (Accordion uses the private `DisclosurePresence`) | `families/presence` |
| Form field label, description, message | `ui/primitives/Field` (`Field.Skeleton`) | `families/inputs` |
| Input chrome | `ui/primitives/InputFrame` | `families/inputs` |
| Text, email, password, phone, textarea | `ui/input/text/*` | `families/inputs` |
| Select, combobox, multi-select | `ui/input/selection/*` | `families/inputs` |
| Radio, checkbox, toggle, choice | `ui/input/choice/*` | `families/inputs` |
| Number, slider, unit, date, colour, file, editable text, signature | `ui/input/{numeric,date,color,files,editable}/*`, `ui/input/SignatureInput` | `families/inputs` |
| Spam protection fields | `ui/input/text/SpamProtectionFields` | `families/inputs` |
| Local recoverable error | `ui/primitives/InlineError` | `families/presence` |
| Persistent notice | `ui/primitives/StatusMessage` (+ `StatusMessagePresence`) | `families/presence` |
| Transient outcome | `showToast` (`src/lib/feedback`) + `ui/overlays/toast/ToastHost` | `families/overlays` |
| Menus, popovers, anchored panels | `ui/primitives/dropdown` (`Dropdown`, `.Menu`, `.Listbox`, `.Panel`) | `families/overlays` |
| Listbox selection | `ui/primitives/Listbox` | `families/overlays` |
| Dialogs and drawers | `ui/overlays/modal` (`useModal`, `ModalForm`, `ModalCard`) | `families/overlays` |
| Confirmation | `useConfirmationModal` | `families/overlays` |
| Tooltips | `ui/misc/Tooltip` | `families/overlays` |
| Portals | `ui/overlays/Portal` | `families/overlays` |
| Inner scrollers and scroll edges | `ui/misc/ScrollArea` (this batch; replaces `ScrollBorders`) | `scroll` |
| Carousels | `ui/misc/Carousel` | `scroll` |
| Loading placeholders | `ui/misc/Skeleton`, each owner's `.Skeleton` | `motion` (L1) |
| Spinners and loaders | `ui/misc/Loader` | |
| Region state (idle, empty, error) | `ui/misc/state` | |
| Page sections and backgrounds | `ui/primitives/Section` (`Section.Background`) | |
| Cards, panels, floating surfaces, content sections | `ui/primitives/surfaces` (`Card`, `Panel`, `Float`, `ContentSection`) | |
| Dividers | `ui/primitives/Divider`; animated: `MotionEffect.Divider` | |
| Accordions | `ui/misc/accordion` | `families/presence` |
| Chips, segmented controls, pagination, steps | `ui/misc/{Chip,SegmentedControl,PaginationControls,StepIndicator}` | |
| Avatars | `ui/misc/ProfilePicture` | |
| Dates and relative time | `ui/time/*` | |
| Markdown rendering and editing | `composites/markdown` | |
| File viewing | `composites/file-viewer` | |
| Entrances, scroll-linked and choreographed motion | `ui/motion/{source,effect,auto-cycle,scroll}` | `motion` |
| Motion tokens and gates | `ui/foundations/{motionTiming,spring}`, `useAnimated()` (this batch), `useMotionAllowed`, `useMotionDisableOverride` | `motion` |
| Focus rings | `ui/foundations/focus` | |

**Scenario: Build a form with a custom control**

- **When** a feature needs a labelled field with an error under a custom control
- **Then** it composes `Field` around a `ui/input` owner and never renders a raw `<input>` beside its own error text

### FR-007: Never re-implement an owner

Feature code MUST NOT rebuild the behaviour of `Field`, `InputFrame`, `TextInput`, `TextAreaInput`, `SelectInput`, `IconSwap`, `MorphLabel`, `ContentPresence`, `Button` loading or morph, `Dropdown` positioning, modal focus and dismissal, `showToast`, `Skeleton` or `ScrollArea`. That includes raw `<input>`/`<textarea>` outside `ui/input`, `text-danger`/`border-danger` outside `Field` and the feedback owners, hand-written popover placement, icon ternaries, page-local text swaps and ad hoc overflow or height tricks. Lint enforces the checkable cases (`tasks.md`).

**Scenario: Copy button feedback**

- **When** a control shows "Copied" with a check after a copy action
- **Then** it uses `useCopyAction` with `IconSwap` and `MorphLabel` rather than a ternary between two icons or labels

### FR-008: New variants and components need a stated reason

A new variant, size, component, icon or owner MUST be listed in its spec and PR with the reason no existing owner fits. Context-specific aliases do not count as reasons (FR-002). New owners ship with stories, a catalogue entry and play tests that prove their family spec.

**Scenario: Propose a new button size**

- **When** a design needs a button size the owner lacks
- **Then** the PR names the size, the reason no existing size fits, and the story that teaches it

### FR-009: Inventory interactive roles first

Before composing a form or settings surface, every interactive role (fields, uploads, disclosures, navigation, secondary actions) MUST be inventoried and mapped to its owner. Native HTML is no exemption: `details`/`summary` MUST NOT duplicate the shared Accordion.

### FR-010: Compare before adding a variant

Before adding a variant, the full supported contract, all current values and their consumers MUST be compared for behaviour, semantic purpose and complete visual signature, and an equivalent value is reused. No product, section, route, brand or reference-specific aliases. A new value updates the contract, exhaustive teaching and consumers together (FR-002, FR-008).

### FR-011: Global defaults live in the owner

A requested global default MUST be made in the owner and its teaching, not in compensating consumer styles.

### FR-012: Extensions are additive

`className` and other extensions MUST be additive: they never remove required semantics, focus behaviour, slot identity or structural selectors. Overriding owner geometry or styling signals an API gap unless the user explicitly asks for that departure.

### FR-013: No parallel trees or exposed internals

Feature code MUST NOT rebuild a complete owner from raw parts or expose its private helpers, and MUST NOT add parallel component trees, overlays, registries or reference indexes. Shared behaviour stays with the narrowest coherent owner.

### FR-014: Brand

Consumers MUST NOT replace the tone variants or token-driven focus behaviour of `Logo`.

### FR-015: Icon provider

The default icon provider is the OpenAI Apps SDK UI set, through Averlo's named registry. An application MAY replace the provider without changing semantic icon names. Fill defaults and state overrides live in the `Icon` Storybook contract and native SDK fill states are preserved; Averlo surface and typography tokens are not replaced for icons. Unsupported brand and rich-text glyphs keep explicit Phosphor fallbacks.

### FR-016: Icons by meaning

Registered symbols MUST be chosen by semantic purpose (upload, download, filter, rename, delete, restore, overflow), with file-specific folder, video-play, audio-waveform, table or code symbols instead of one generic document for every file. Visible labels stay where they fit and every icon-only control has an accessible name. Icon-only controls use the shared square icon-button size, not a text button's width. A missing meaning extends the named registry for the active provider; an unrelated glyph or duplicate inline SVG is never substituted. Rendered examples are verified.

### FR-017: Control icons are decorative

Icons inside controls MUST be decorative by default; accessible naming and visible focus belong to the containing control. Physical directions are never flipped globally.

### FR-018: Markdown stays a closed format

Markdown MUST NOT expose arbitrary `className`, JSX, HTML passthrough, data registries or product-specific card directives. Underline is the only allowlisted HTML-shaped construct: the editor stores paired `<u>...</u>` tags and `Markdown.Render` transforms only exact paired tags; general raw HTML parsing is never enabled for it.

### FR-019: Markdown rendering

`Markdown.Render` MUST stay presentation-authoritative. Renderer task markup is non-interactive and does not change the Lexical-owned editor DOM, and task-list styling does not suppress ordinary mixed-list markers. Tables own their local overflow; no universal minimum width and no table overflow moved to the whole editor canvas. `Markdown.Editor.Skeleton` preserves the live editor's density-owned minimum toolbar and content topology without predicting document-driven expansion.

### FR-020: Markdown editor controls

Visible editor controls MUST use the application icon and interaction systems; package-owned toolbar, menu and link-dialog UI is not acceptable. Responsive toolbar collapse is measurement-driven.

## Success Criteria

- **SC-001**: Every owner path in FR-006 resolves to a file.
- **SC-002**: Lint reports no raw `<input>`/`<textarea>` outside `ui/input` owners and no `text-danger`/`border-danger` outside `Field` and feedback owners, beyond lines tagged `debt` or with an exception ID.
