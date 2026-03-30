# Folder: `src/components/ui/motion`

## Role
Shared reveal, intro, and scroll-motion helpers for cases where motion meaningfully improves presentation.

## Use This Folder When
- A page needs staggered entrance motion.
- A section needs staged reveal sequencing between media and content.
- A section needs subtle parallax or scroll-lag effects.
- Text should reveal with a scramble, character stagger, or hover wave effect.

## Prefer These Files
- `src/components/ui/motion/MotionScene.tsx`: section-scoped stage orchestration for multi-step reveal choreography.
- `src/components/ui/motion/Reveal.tsx`: exports `RevealGroup` and `RevealItem` for entrance animation.
- `src/components/ui/motion/RevealImage.tsx`: load-aware image reveal that can coordinate with later reveal stages.
- `src/components/ui/motion/RevealText.tsx`: per-character text stagger that inherits a parent `RevealGroup`.
- `src/components/ui/motion/LetterWave.tsx`: hover-driven per-character wave text.
- `src/components/ui/motion/ScrollHighlightText.tsx`: character-by-character highlight sweep driven by scroll progress.
- `src/components/ui/motion/ScrollLag.tsx`: subtle lagging scroll effect.
- `src/components/ui/motion/ScrollParallax.tsx`: scroll-based offset effect.
- `src/components/ui/motion/ScrollWidth.tsx`: scroll-driven frame mask for progressive width reveals.
- `src/components/ui/motion/ScrambleReveal.tsx`: text scramble reveal effect.

## Invariants
- Use these helpers only when motion adds value; do not animate everything by default.
- Entrance, reveal, and scroll helpers in this folder are intro-aware. On first load they should remain inert until `LoadingScreenMount` has fully exited and `appReady` is true.
- Reduced motion must remain respected. The defaults here already assume `disableWhenReducedMotion` behavior.
- CSS transition utilities remain the default for micro-interactions. Use these helpers for reveal or scroll motion, not as a replacement for normal component transitions.
- Focus visibility and keyboard usability must not depend on motion. Motion can enhance presentation but cannot gate access to controls or content.
- For `motion/react` transitions, use `motionTiming.ts`, `getMotionTiming`, or `spring.ts` instead of hardcoded durations and easings.
- When mixing `RevealItem` with transparent gradient-border wrappers, avoid `asChild`; keep a normal wrapper so the child keeps its intended size and position.
- Prefer `MotionScene` when choreography spans multiple dependencies such as intro completion, media reveal completion, and later content stages.
- Prefer `waitFor` on `RevealGroup` for staged sequences. Use item-level `waitFor` only when a standalone item genuinely needs its own stage gate.
- Use `unlockStage` only on components that genuinely complete a stage: `RevealGroup`, `RevealItem`, `RevealImage`, or `ScrambleReveal`.

## How To Use It
- Use `RevealGroup` and `RevealItem` for section or list entrance choreography.
- Use `RevealText` as a direct child inside a `RevealGroup` when the copy should stagger letter-by-letter.
- Use `RevealImage` when an image should fade in after load without flashing, or when image readiness should unlock later reveal stages.
- Use `MotionScene` when a section needs explicit sequencing such as image reveal first, copy second, and accent text third.
- Use `active` on `RevealGroup` or `RevealItem` when reveal timing should be driven by app state instead of viewport entry.
- Use `ScrollHighlightText` when a short string should brighten progressively as it enters the viewport.
- Use `ScrollParallax` and `ScrollLag` sparingly for decorative depth effects.
- Use `ScrollWidth` when a panel or media block should reveal from a narrow inset to a full-width frame while preserving rounded corners.
- Use `ScrambleReveal` for decoding or numeric reveal text; prefer `maintainSpace` when layout must remain stable.
- Use `LetterWave` for hover-only accent text. Give it a parent with the `group` class.
- If a component already animates itself sufficiently, do not wrap it in extra motion without a clear UX payoff.

## Avoid
- Layering motion helpers on top of already animated controls without need.
- Ignoring reduced-motion expectations or forcing motion on critical interactive content.
- Using `RevealImage` callbacks or page-local booleans for multi-step choreography when `MotionScene` would express the same relationship directly.
- Using `asChild` on `RevealItem` when the wrapped border or transparency pattern depends on a stable outer wrapper.
- Using `LetterWave` as a replacement for meaningful reveal timing; it is a hover accent, not a sequencing primitive.
