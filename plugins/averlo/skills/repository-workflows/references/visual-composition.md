# Visual composition

## Contract

Use the shared hierarchy vocabulary to describe visual composition. Do not
automatically wrap every section in a card:

- **Page** is the application canvas rather than a surface component.
- **ContentSection** groups page content with its heading, description, and
  actions on the canvas. A cohesive property or control group belongs in one
  Card beneath that heading. Keep standalone prose and page flow unboxed.
- **Panel** provides persistent application chrome and purposeful broad grouping.
- **Card** encloses a cohesive group of related properties or controls, or a
  self-contained record, result, or preview. Its optional header contains that
  item’s identity or highest-priority information; omit it when the external
  section heading already supplies the context. Do not repeat the section title.
- **Float** provides behavior-free temporary visual chrome with a distinct
  raised background above cards. A modal keeps Card fill at overlay elevation.

Use the shared neutral palette: recessed outer chrome, a soft Page canvas,
lifted Card content, and brighter Float menus. InputFrame owns the neutral
input fill, including composers. Use primary-text for blue text; reserve
primary for solid fills and selection tints. Do not introduce route-specific
gray ramps or colored neutral backgrounds.

Keep structure and elevation independent. A Card may use float or overlay
elevation without becoming a Float. Overlay is behavioral context, not a fifth
visual surface: the overlay owner supplies portal, placement, focus, dismissal,
and scroll behavior around a Card or Float.

Treat page-section flow and background media as section ownership. A semantic
section background may publish context for selective descendant styling, but it
does not inherit Panel, Card, or Float ownership and does not acquire their
radius, elevation, fill, or slot contract. Keep controls, compact status, media,
code, previews, and inset content with their existing owners.

Keep stable wrappers when they own layout, reveal, positioning, or transparent
border treatment. For transparent gradient borders, keep the border on the
outer wrapper and the surface fill on the inner owner with aligned radii. Keep
semantic accents inside the closed shared contract, and route tinting through
the shared surface treatment rather than product-specific caller colors.

Use the supported surface facade from the Storybook owner contract. Keep shared
class recipes and inspection helpers private. Do not imitate another owner's
slots, data attributes, typography recipe, or token responsibilities.

## Hard boundaries

- Do not turn overlay behavior into a surface primitive or make a surface own
  portals, focus, dismissal, positioning, or modal context.
- Reduce redundant boundaries, not useful grouping. Organization settings is
  the canonical example: two external headings and two cards, each containing
  all properties for its section. Never interpret “less carded” as no cards.
- Do not put each property, row, or control in its own card, nest a card solely
  for spacing, or put a page-wide card around several independently titled groups.
- Keep input chrome with InputFrame. Composer presentation changes geometry;
  it retains the same shared fill and shadow as ordinary inputs and search.
- Reuse ContentSection for page hierarchy; retain explicit Card composition for
  cohesive groups rather than making every ContentSection body a card.
- Do not give persistent application chrome content-card spacing solely because
  it uses Panel structure.
- Do not treat headings, breadcrumbs, navigation rows, or footer flow as new
  surface primitives.
- Do not export an implementation-only styling recipe as a public owner.
- Do not remove stable wrappers without proving that layout, reveal, border,
  and positioning ownership remain intact.

## Repository context

Read only entries that exist and apply to the changed composition:

- `src/components/ui/primitives/surfaces/AGENTS.md` when surface structure,
  facade, elevation, fill, or slot topology changes.
- `src/components/ui/primitives/AGENTS.md` when primitive dependency direction
  or public contracts change.
- The nearest layout, section, shell, or overlay `AGENTS.md` when its stable
  wrapper or context changes.

## Verification

- Verify owner hierarchy, wrapper stability, slot order, surface fill, radius,
  elevation, border treatment, semantic accents, and responsive layout.
- Run `npm run verify:surface-contracts` when shared visual surface contracts or
  their structural consumers change.
- Run the focused Storybook owner test for changed surface behavior or public
  contracts.
- Use managed breakpoint review when the composition changes materially across
  viewport sizes.

## Dashboard shell

The shared shell owns all viewport geometry: recessed `surface` outside an inset
`background` workspace, with the sidebar and toolbar sharing the recessed `surface` fill. The workspace has no outline border.
Panel still owns sidebar structure; its fill does not turn navigation into content.
The workspace touches the sidebar, with 8px desktop outer-right/bottom gutters and 12px corners, 4px/8px on tablet, and
no inset on phones. Desktop navigation is 240px or a collapsed 64px rail;
tablet uses the same 64px rail and a navigation drawer, and phones use only the drawer.

Keep a small brand mark with bare Back/Forward and collapse controls in the
sidebar top row. Search follows the brand row and matches navigation-row width. The footer AccountIdentity uses the organization name in its muted secondary-label slot; do not compose a separate organization row or top switcher. Its account dropdown owns a nested Organization menu for administration and switching, with capability-gated management actions. The account
control is left-aligned in a divided footer and owns helper links in its menu.
Assistant is a section label with New chat first. Sections with more than three
entries may collapse; their heading differs only by the disclosure caret.
Breadcrumb ancestors and the current title use matching text size and weight. Use DashboardSection for standard pages and DashboardWorkspaceToolbar
for full-height workspaces. The toolbar sits above the rounded workspace on the recessed shell background, with compact
page identity, optional ancestry and route actions. Align page identity with the inner content gutter, not the workspace outer edge. Individual conversation rows are iconless. Body descriptions and
ContentSection headings remain below it. Detailed APIs and loading/long-title
examples belong to the Workspace Toolbar Storybook owner. Do not add a global
header, duplicate the page heading, or compensate with route-local top offsets.
The workspace owns page scrolling; Assistant keeps its message scroller.

## Edge-aligned actions

Treat Button treatment and geometry independently. `bare` controls transparent
hover/active appearance; it does not imply an unpadded size. When an action must
align with a text/content edge, use `size="none"` with explicit vertical space
and no horizontal padding. Align the icon/content box, not a larger centered
button box. Keep neighboring controls separated so their targets do not overlap.
Do not globally shrink every bare action to fix a local alignment. Verify both
content edges against the shared container inset, including hover/focus states.

### Vocabulary for review and mixed action groups

- “Align visible content edges” means align labels/icon boxes to the neighboring
  content inset, accounting for button padding rather than aligning outer boxes.
- “Align button boxes” means align the filled/outlined control surfaces and keep
  their internal padding; use this for toolbars, forms and equal-size controls.
- “Use consistent visual spacing” means judge the visible label/icon/surface gaps,
  including each control's padding. Do not add a full group gap on top of two
  already padded invisible ghost boxes.

Group by task first, then hierarchy: primary is the main progression, secondary
is a distinct alternative, ghost is a quiet action with a hover surface, and bare
is an inline/content-edge utility. No variant wins alignment priority. Use one
baseline/centerline per row; at container edges align visible content, while a
filled button's surface retains its intended inset. Bare icon runs need explicit
space between icons; ghost runs often need little additional gap because their
boxes already supply it; filled buttons need separation between visible surfaces.
For mixed runs, adjust group spacing locally, preserve usable targets, and check
hover/focus as well as rest. Never use overlapping invisible hit areas to fake a gap.

Content-section headings use text alone. Do not add decorative leading icons in application sections, loading states, catalogue previews, or Storybook examples. Use heading text and spacing to establish hierarchy.

### Page alignment and copy

The page owns horizontal gutters. Section headings and actions align with the
outer edges of their card or table; internal card and cell padding stays inside.
Use ContentSection.Heading above standalone tables, never Card.Heading, which
owns card-internal padding and separation. Keep one useful description per
content group; omit page introductions that repeat the first section. Do not
add a divider between an external section heading and an already bounded card.
Preserve warnings, permissions, field guidance and result counts.

## Color roles across surfaces

Use semantic foreground tokens for text and icons, and accent/fill tokens for
backgrounds. Validate the rendered pair after transparency and tint mixing on
Surface, Card and Float, in both appearances and interactive states. Ordinary
text requires at least 4.5:1; meaningful graphics and control boundaries require
3:1 where WCAG applies. Soft decorative fills do not need to satisfy a text
threshold against their surroundings. Avatar fallbacks use the same primary, success, warning, danger and violet set
as identity chips, with the default static tint and readable initial ink. Color
assignment is stable by full name; identity color does not communicate status.
Do not use held-down styling for static avatars.
The Surface Tint Storybook owner contains the light/dark contrast matrices.
