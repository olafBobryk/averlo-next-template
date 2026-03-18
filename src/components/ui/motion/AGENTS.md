# Folder: `src/components/ui/motion`

## Role
Shared reveal and scroll-motion helpers for cases where motion meaningfully improves presentation.

## Use This Folder When
- A page needs staggered entrance motion.
- A section needs subtle parallax or scroll-lag effects.
- You need motion that already respects the library's reduced-motion conventions.
- Text should reveal with a scramble or decoding effect.

## Prefer These Files
- `src/components/ui/motion/Reveal.tsx`: exports `RevealGroup` and `RevealItem` for entrance animation.
- `src/components/ui/motion/RevealImage.tsx`: load-aware image reveal that can coordinate with other reveal motion.
- `src/components/ui/motion/ScrollHighlightText.tsx`: character-by-character highlight sweep driven by scroll progress.
- `src/components/ui/motion/ScrollLag.tsx`: subtle lagging scroll effect.
- `src/components/ui/motion/ScrollParallax.tsx`: scroll-based offset effect.
- `src/components/ui/motion/ScrollWidth.tsx`: scroll-driven frame mask for progressive width reveals.
- `src/components/ui/motion/ScrambleReveal.tsx`: text scramble reveal effect.

## Invariants
- Use these helpers only when motion adds value; do not animate everything by default.
- Reduced motion must remain respected. The defaults here already assume `disableWhenReducedMotion` behavior.
- CSS transition utilities remain the default for micro-interactions. Use these helpers for reveal or scroll motion, not as a replacement for normal component transitions.
- Focus visibility and keyboard usability must not depend on motion. Motion can enhance presentation but cannot gate access to controls or content.
- For `motion/react` transitions, use `motionTiming.ts`, `getMotionTiming`, or `spring.ts` instead of hardcoded durations and easings.
- When mixing `RevealItem` with transparent gradient-border wrappers, avoid `asChild`; keep a normal wrapper so the child keeps its intended size and position.
- Keep reveal orchestration explicit:
  - use `RevealImage` readiness callbacks to drive `RevealGroup active` or `RevealItem active`
  - do not add implicit parent-child reveal coupling

## How To Use It
- Use `RevealGroup` and `RevealItem` for section or list entrance choreography.
- Use `RevealImage` when an image should fade in after load without flashing, or when image readiness should trigger later reveal choreography.
- Use `active` on `RevealGroup` or `RevealItem` when reveal timing should be driven by app state instead of viewport entry.
- Use `ScrollHighlightText` when a short string should brighten progressively as it enters the viewport.
- Use `ScrollParallax` and `ScrollLag` sparingly for decorative depth effects.
- Use `ScrollWidth` when a panel or media block should reveal from a narrow inset to a full-width frame while preserving rounded corners.
- Use `ScrambleReveal` for decoding/scramble text reveals; prefer `maintainSpace` when layout must remain stable.
- If a component already animates itself sufficiently, do not wrap it in extra motion without a clear UX payoff.
- For gradient-border cards or panels, put layout classes such as `w-full`, `flex`, or `justify-center` on `RevealItem` and leave the wrapped element responsible for its own visual structure.

## Avoid
- Layering motion helpers on top of already animated controls without need.
- Ignoring reduced-motion expectations or forcing motion on critical interactive content.
- Using `asChild` on `RevealItem` when the wrapped border or transparency pattern depends on a stable outer wrapper.
- Using `RevealImage` callbacks for hidden side effects instead of explicit reveal state wiring in the caller.
