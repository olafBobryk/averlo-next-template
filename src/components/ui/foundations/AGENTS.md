# Folder: `src/components/ui/foundations`

## Role
Shared interaction tokens, motion tokens, settings, and base CSS that define how the whole library behaves.

## Use This Folder When
- You need the canonical focus classes.
- You need shared motion presets for `motion/react` usage.
- You want to wire reduced-motion preferences through the provided settings context.
- A change should affect library-wide interaction behavior rather than one component.

## Prefer These Files
- `src/components/ui/foundations/focus.ts`: source of truth for focus-ring utilities.
- `src/components/ui/foundations/spring.ts`: shared spring presets for `motion/react` animations.
- `src/components/ui/foundations/motionTiming.ts`: centralized timing tokens.
- `src/components/ui/foundations/motionDisableOverride.ts`: URL and document override detection for automation-friendly motion, reveal, intro, and loading disabling.
- `src/components/ui/foundations/settingsContext.tsx`: motion settings provider and hook.
- `src/components/ui/foundations/library.css`: library-wide CSS tokens and utility classes.
- `src/components/ui/foundations/iconAnimations.css`: shared icon animation CSS.

## Invariants
- The focus invariant starts here. Use the shared focus tokens instead of writing random `outline` or `ring` utilities in feature code.
- `focusRing.fieldDefault`, `focusRing.fieldError`, and `focusRing.fieldSuccess` are the standard shell-level focus treatments for form containers.
- `focusRing.visibleDefault` and `focusRing.visibleError` are the standard focus treatments for directly focusable controls.
- `focusRing.peerDefault` and `focusRing.peerError` exist for controls whose visible indicator follows a visually hidden native input.
- Do not remove or weaken focus visibility to achieve a cleaner visual style.
- Use `spring.ts` only for `motion/react` animation cases. For normal hover, press, and transition behavior, prefer the CSS motion utility classes already used across the library.
- For `motion/react` transitions, use `motionTiming.ts`, `getMotionTiming`, or `spring.ts` instead of hardcoded durations and easings in app code.
- Reduced-motion support must remain centralized through `SettingsProvider` and `useMotionAllowed`.

## How To Use It
- Import focus tokens into interactive components instead of duplicating ring classes.
- Use `SettingsProvider` near the app root if the product needs a global motion preference.
- If a library-wide timing or motion behavior needs adjustment, change the shared token here instead of patching many components individually.
- Reach for `motionTiming` or `getMotionTiming` before typing numeric durations into component code.

## Avoid
- Ad hoc focus classes in page components.
- Using `motion/react` springs as a replacement for the existing CSS motion utility system.
- Forking reduced-motion logic per component when the shared context already covers it.
- Hardcoded motion durations or easings in pages and layouts when shared timing already exists.
