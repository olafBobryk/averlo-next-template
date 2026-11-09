import type { Transition } from "motion/react";

/**
 * Motion steps, named by character. Values are the approved token table in
 * specs/platform/design-system/motion/spec.md. Each duration and ease is the
 * CSS fallback fitted to the step's spring in `spring.ts` (U5).
 */
export type MotionStep = "snap" | "quick" | "smooth" | "gentle" | "slow";

export const motionSteps = [
	"snap",
	"quick",
	"smooth",
	"gentle",
	"slow",
] as const satisfies readonly MotionStep[];

export const instantTransition: Transition = { duration: 0 };

export const motionTiming: Record<MotionStep, Transition> = {
	snap: { duration: 0.1, ease: [0.22, 0.16, 0.18, 1] },
	quick: { duration: 0.16, ease: [0.22, 0.16, 0.18, 1] },
	smooth: { duration: 0.24, ease: [0.22, 0.16, 0.18, 1] },
	gentle: { duration: 0.36, ease: [0.22, 0.24, 0.14, 1] },
	slow: { duration: 0.56, ease: [0.18, 0.2, 0.12, 1] },
};
