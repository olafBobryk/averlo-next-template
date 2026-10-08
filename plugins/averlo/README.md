# Averlo Codex plugin

## Primary implementation router

Use `$averlo:repository-workflows` as the primary router for implementation and
implementation review inside Averlo repositories. Governing repository
instructions may require this explicit-only skill without enabling global
implicit invocation. Its route workflows also own browser metadata ordering,
indexability, canonical identity, and provider-backed page metadata routing.

After it selects the applicable workflows and concern contracts, do not invoke
the overlapping design-system, skeleton, entity, or surface skills again for
the same change unit. `$averlo:compose` owns native source-backed realization
and measured human review passes. `$averlo:systemize-composition` explicitly
owns deterministic established-owner replacement plus confidence-routed
ambiguous shared design-system decisions, `$averlo:animate`
explicitly owns motion, and `$averlo:visual-parity` supplies reproducible
evidence to all three. These operational workflows may invoke the router and
Figma skills as subordinate steps.

## Shared action and feedback guidance

Button selection and conditional-content motion are covered by
[Interaction and responsive behavior](skills/repository-workflows/references/interaction-responsive.md).
Feedback ownership is covered by
[Action lifecycle](skills/repository-workflows/references/action-lifecycle.md)
and [Form semantics](skills/repository-workflows/references/form-semantics.md).
Use the current repository's Button, ContentPresence, StatusMessage and
InlineError Storybook contracts for supported APIs and examples. These owners
also travel through the template's selected generated-project profiles.

Use bare treatment for disclosure arrows, contextual ellipsis triggers, and
copy controls that stay transparent on hover. InputFrame and Dropdown own the
compact input chrome and inset menu styling; keep their APIs and examples in
their Storybook owners. Assistant tools sit inside one collapsible summary above each reply, with a divider anchored directly beneath its trigger, above the expanding details, and equal spacing around the reply when collapsed. Expanding it reveals one quiet disclosure per call, with arguments and actual safe
output. Use actual call counts and states; show elapsed time only when the runtime supplies it. Tool presentation follows Inference’s request/result envelope with typed content blocks, expandable argument properties and bounded output disclosure; executable tools still pass through the runtime allowlist and authorization. Keep approval decisions above the composer. Approval content is a domain-neutral title and description: callers explain the action, target and consequences; tool arguments remain in the tool disclosure. Do not couple the approval box to Record fields. Allow once is primary and Deny is bare. Group the heading and description tightly, then separate the actions. Only the clicked action button shows loading; lock its conflicting siblings without spinners or a detached loading label (see the workflow action-lifecycle contract). Keep the session queue attached beneath it: a tinted shell extends 40px under the composer, with uniform header-height rows and a horizontal six-dot drag-handle reveal, always-visible right actions, and disclosure/reorder motion. A right-side pencil removes the item from the queue and transfers its text/files into the composer for resending. Preserve an existing unsent draft as a queue item. Resume belongs on the empty composer send control as Play; never add a separate Resume control to the queue. Never expand a queue row into an inline editor. Do not flatten it into uncontained text. User bubbles fit their content; timestamp and edit/copy controls share a row aligned to the bubble text inset, revealed on hover or keyboard focus. Editing updates the existing message and retains attachments. The composer’s / and @ pickers follow the source’s anchored Float layout. Keep generic commands limited to /help and /new until a project supplies working domain commands. Context search and execution-time resolution belong to the actor-scoped adapter; references retain stable identities through drafts, queues and edits and never grant tool permission. Preserve source authorization and identify simulated providers. Detailed contracts and behavior tests belong to the Assistant Storybook owners.
Queue operations and remembered tool permissions must affect subsequent runs. One active submission, confirmed cancellation,
server approval claiming and execution deduplication are required. Permission grants
never override authorization or current tool mode. Duplicating history must not revive
approvals. Detailed APIs and states belong in the Assistant Controls and
Message Storybook owners. Reference permissions last across chats and
reloads until the reference server resets; queues are conversation-scoped browser-session
state, never durable storage.

Prefer ContentSection for page hierarchy: headings, descriptions, and actions
remain on the canvas. Group each cohesive set of properties or controls in one
Card beneath its heading; organization settings has two sections and two property
cards. Avoid both a card per field and removing useful group boundaries. Card
headers are optional and identify an item, without repeating the section title.
Float uses a distinct raised fill; modals keep Card fill at overlay elevation.
Composer and ordinary inputs share InputFrame fill and shadow; presentation may
change geometry, not fork their background. Sidebar category labels come from
dashboard registry metadata. Dropdown separation uses independent Dividers:
full width between major content blocks, inset between action groups; never
put a separator border on an interactive row. For mixed controls and actions, use Dropdown.Menu custom control entries so spacing, dividers, hover opening, and focus remain system-owned; do not rebuild its list in a consumer. Pair compact rows with muted xxs InputFrame and xs ghost buttons when individual controls need a hover background. See the Surfaces and Dropdown
Storybook owners for the supported APIs.

## Authored source

`plugins/averlo/` is the sole authored source for this plugin. The local
marketplace declaration in `.agents/plugins/marketplace.json` resolves directly
to this directory.

Installed plugin copies, cache entries, and temporary marketplace material are
installation artifacts. Do not edit or synchronize them. Make every change to
plugin metadata, skills, agents, references, scripts, and tests in this
directory, then reinstall or republish the plugin when a consumer needs the
updated version.

The sensitive contact-form workflow belongs exclusively in this plugin as
`$averlo:contact-form`; do not maintain a standalone global copy.

Dashboard layouts use one inset workspace below a contextual toolbar on the
recessed outer background. The sidebar is the raised navigation layer and owns
workspace identity, search, and account controls. Use the Workspace Toolbar
Storybook contract for responsive rail/drawer behavior and loading geometry;
keep section headings outside cards that group related properties.

The default icon provider is OpenAI Apps SDK UI through Averlo’s named registry.
Applications can replace the provider without changing semantic icon names.
Keep fill defaults and state overrides in the Icon Storybook contract; unsupported
brand and rich-text glyphs retain explicit Phosphor fallbacks.

Content-section headings use text alone. Do not add decorative leading icons in application sections, loading states, catalogue previews, or Storybook examples. Use heading text and spacing to establish hierarchy.

Dashboard command search expands from the visible sidebar field or rail control without moving the field or dimming the app. Keep phone drawer search anchored in its drawer; only keyboard opening without a visible anchor uses the viewport inset. Command hierarchy uses plain icons, two-line rows and indentation. Detailed behavior and motion contracts belong to the Command Palette Storybook owner.
## File inspection

Use `FileViewer` for read-only PDF and raster-image inspection. Dashboard file inputs delegate through `FilePreviewProvider` to one `FileViewerLayout`: a resizable side panel with a full-screen modal at narrow widths. Keep upload, authorization and fresh access URLs in caller adapters. This is not an editable-document or file-management feature. The FileViewer Storybook owner documents formats, controls, limits, failures and lifecycle behavior; FileInput owns preview delegation.

Mount the dashboard file preview split around both the page toolbar and its content. Align the file toolbar with the page toolbar on the shell surface; use the same page background for both content panes. The viewer is not a nested card or independently elevated surface.
