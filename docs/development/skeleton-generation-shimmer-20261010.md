# Visual generation shimmer backport

Historical note: the static default and generation-only restriction below were
superseded on 2026-10-26. The current shared
[`Skeleton`](../../src/components/ui/misc/Skeleton.tsx) shimmers by default,
retains an explicit static opt-out, and respects reduced-motion preferences.

Source: Winery shared iteration checkout. Ported only the generic `Skeleton`
animation prop, its CSS and a focused story. No Bob workflow or summary code.

`animation` defaults to `static`. `shimmer` explicitly represents a model
generating a visual; ordinary data/page/summary loading and checklist indicators
remain static. The prop comment and plugin loading-parity reference document
this distinction. The installed plugin reference was updated alongside its
durable repository source. Reduced-motion preferences disable shimmer.

Template typecheck, production build and focused Skeleton stories passed.
No deployment or commit was made. Existing unrelated checkout edits were kept.
