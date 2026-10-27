# Shared disclosure animation backport

Date: 2026-10-08

## Scope

Port the approved Accordion/ContentPresence animation alignment from Winery's
application checkout into this existing template checkout. Preserve unrelated
dirty changes. No product routes, labels, files, authentication or backend code
are part of this backport.

## Decisions

- Both public components use the private `motion/presence/DisclosurePresence`
  implementation. It owns measured dimensions, spring motion, retained opaque
  content during closing, a 16px soft clipping edge, and visible unmasked
  overflow after settling.
- Keep the mask edge transparent until 98% of expansion, then fade it in direct
  proportion to the remaining height progress. This follows the height spring
  without waiting for completion or starting a separate fade. Release clipping
  when settled; reversals restore the full soft edge.
- Preserve horizontal reveals, gap animation, reduced-motion behavior and
  rapid reversal. `offsetY` remains accepted but deprecated and ignored;
  `durationMs` remains an optional duration-based spring override.
- Add the private dependency to thin-start's positive file selection so
  generated projects retain a complete dependency closure.
- Keep the public component names and server-safe Accordion entry unchanged.

## Verification

Shared implementation, catalogue and comparison story match the application
source. Focused formatting, the template production build and template profile
materialization matrix pass. Bob's focused typecheck and ten interaction stories
pass; its full build encounters existing missing imports in unrelated
`tmp/map-parity/rejected-shortcut` files.

The comparison story is `ui-motion-content-presence--accordion-parity`.
No commit, release or publication is included.

## Motion-off mask correction — 2026-10-10

Backported the explicit mask bypass from the shared Bob iteration checkout:
`DisclosurePresence` now uses `maskImage: "none"` whenever animation is disabled,
including collapsed states. This covers Accordion and ContentPresence without
changing their public interfaces or animated soft edge. MotionOff and
ReducedMotion interaction checks assert the mask is absent after closing and
reopening. The shared source matches across both checkouts; template production
build and Bob's three focused interaction checks pass. No release is included.

## Dropdown screen-edge correction

Ported minimum-width-aware measurement, trigger/panel resize observation, and opposite-edge alignment before viewport clamping. Preserved each checkout's existing icon implementation and cascade behavior. Added ScreenEdgeAlignment interaction coverage in both checkouts. Reveal timing remains identical in Bob and template.
