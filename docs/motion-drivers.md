# Motion drivers

The application-level `MotionProvider` owns one scheduler and selects the driver
for both source progress and page-scroll transport. `MOTION_CONFIG.defaultDriver`
in `src/config/motionConfig.ts` is `"hybrid"`. Roll back the entire system by
changing that value to `"motion"`; no effect or page edits are needed.
An explicit `<MotionProvider driver="motion">` overrides configuration for a
standalone application/test root. Do not nest providers to choose per-effect engines.

| Source | Hybrid | Motion fallback |
| --- | --- | --- |
| reveal / in-view | GSAP clock, existing timing trajectory | Motion animation |
| scroll | ScrollTrigger scalar | Motion useScroll and optional source spring |
| hover / owner-hover / boolean | Motion | Motion |
| page scroll | Lenis, or native when constrained | Original wheel controller, or native |

Effects keep the same private scalar contract. Source refs, explicit reveal
durations, timing presets, sequence ordering, readiness and re-entry remain source/
scheduler responsibilities. GSAP uses absolute spring keyframes and incoming
velocity, so interruption/reversal keeps the existing spring trajectory. Explicit
durations use the existing reveal easing. Each repository retains its own presets.
Hybrid scroll sources accept `smooth` for API compatibility but intentionally do
not add a second source spring on top of Lenis.

The driver resolves before participants activate. SSR, disabled animation and
reduced-motion rendering remain static-final. Development-only overrides require
exactly `motionCompare=1&motionDriver=motion` or
`motionCompare=1&motionDriver=hybrid`. Missing, duplicated or invalid values use
the configured default; production ignores comparison parameters.
The shared source diagnostics are `data-motion-source-driver="motion|gsap"`;
the root reports `data-motion-driver` and `data-scroll-transport`.

Lenis uses the GSAP ticker and updates ScrollTrigger. Unmounting or changing
drivers removes the ticker/listener/lock observer and destroys the transport.
Loading/modal inline locks stop it; releasing the lock restarts it. Native
nested scrollers are excluded. Cooperative maps keep ordinary page wheel input
on the selected transport; consumed gestures and Ctrl/Cmd zoom are excluded.
Reduced motion, coarse
pointers and disabled smooth scrolling choose native transport. Route navigation,
hash anchors and browser-history restoration remain application-level concerns.
Bespoke low-level Motion choreography is deliberately unchanged.

Storybook's Motion driver toolbar changes the application-level provider.
`HybridComposition` and `MotionComposition` render the same neutral fixture
and assert intermediate opacity frames and sequence ordering, not just the final
state. `MotionViewportReentry` and the default re-entry story exercise both engines.
