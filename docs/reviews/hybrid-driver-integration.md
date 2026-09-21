# Hybrid default integration review

Date: 2026-09-21. Local review delivery only; no push or main-branch integration.

## Contract and rollback

Hybrid is the application default. The existing MotionProvider owns one scheduler
and the shared driver; effects and product call sites have no driver setting.
GSAP drives reveal/in-view/scroll progress, Lenis owns smooth page transport,
and interaction sources and bespoke Motion choreography remain Motion-owned.
Each repository retains its original timing presets.

Change `MOTION_CONFIG.defaultDriver` in `src/config/motionConfig.ts` from
`"hybrid"` to `"motion"` to restore Motion sources and the original wheel
transport together. Both implementations remain executable. A provider override
is available for standalone application/test roots.

See [Motion ownership](../motion-drivers.md) for readiness, diagnostics,
query gating, spring interruption, native fallback and lifecycle details.

## Verification shared by both repositories

- Production build and TypeScript pass.
- Six focused Node tests pass: intermediate trajectory parity, explicit durations,
  interrupted/reversed trajectories, invalid duration fallback, query resolution,
  and scroll-offset conversion. Pearl exercises the physical spring branch;
  template preserves and tests its existing duration/bezier preset.
- Both identical-composition stories pass, including intermediate opacity frames,
  stagger order, final values and source-driver assertions.
- Both viewport re-entry stories pass. Existing reduced-motion, strategy-matrix
  and sequence coverage was also exercised.
- Driver readiness gates participant activation; delayed sequence callbacks now
  cancel on reset/unmount. Static/disabled/reduced-motion paths remain final.

## Template delivery

Checkout:
`/Users/olafbobryk/.codex/worktrees/clean-main-continuation-20260910/averlo-next-template`.
Branch: `codex/lenis-gsap-hybrid`. The prior experiment commit `8d6b9c9` already
contains current local/origin main `f8296df`; its history is retained, not replaced.
Neither main nor the canonical checkout was modified.

Managed Laptop previews, intentionally retained:

- [Hybrid composition](http://localhost:6008/?path=/story/ui-motion-motion-source--hybrid-composition)
- [Motion composition](http://localhost:6008/?path=/story/ui-motion-motion-source--motion-composition)
- [Affected stories](http://localhost:6008/?statuses=affected;modified;new)
- [Template application](http://localhost:3058/)

Both exact story URLs and the application were browser-verified. Storybook's
provider toolbar also selects either driver. The same neutral composition,
using template design-system components and timing, runs under both drivers.
No Pearl shell, sections, typography or branding was copied.

## Template-specific validation

- `verify:static` passes, including typecheck and all repository contract checks.
- Production build passes (64 generated pages).
- `verify:profiles` passes all seven profile/content combinations.
- `verify:create-averlo` passes packed CLI and generated thin-start validation.
- Full Storybook interaction tests passed. The horizontal ScrollBorders fixture
  had a keyboard-focusability accessibility failure: adding `tabIndex={0}`
  repaired it without changing border appearance; the focused rerun passes.
- Final focused hybrid/Motion composition and both re-entry stories pass.
- Positive-assembly manifests include GSAP and Lenis plus both adapters, context,
  runtime and configuration. The stale pre-existing GridClip inventory entries
  were replaced with the current GridReveal dependency closure needed to generate
  a working thin project.
- A whole-repository strict thin-start footprint audit is not a materialized-thin
  project test; its broad-UI findings are not used as this integration's gate.
  Actual generated-profile and packed-CLI verification passed.

## Cross-repository caveats

Pearl's broad suite remains red (296 passed / 18 failed); see its integration
review for confirmed Motion-reproducible failures and unresolved baseline issues.
Both production builds and the driver-specific tests pass. These local commits
remain unpushed pending visual acceptance.

## Map gesture correction (2026-09-21)

The initial blanket map exclusion was incorrect for cooperative maps: it created
a native-scroll island inside the smoothed page. Both transports now retain
ordinary map wheel input and skip consumed gestures and Ctrl/Cmd zoom. Explicit
native/nested-scroll exclusions remain supported.

Real browser wheel input over Pearl's map produced intermediate page-scroll
frames with both hybrid and Motion. Cmd-wheel changed map marker positions while
page scroll stayed fixed. Shared gesture unit tests and both typechecks pass.

The generated-project file list includes the gesture helper. Motion ownership
documentation is explicitly project-owned; this historical review is template-only.
All seven profile/content assembly combinations pass after that classification.
