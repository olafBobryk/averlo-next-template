import type { Transition } from "motion/react";
import type { MotionStep } from "@/components/ui/foundations/motionTiming";

/**
 * Step springs (mass 1). `snap`, `quick` and `smooth` are critically damped;
 * `gentle` and `slow` are slightly overdamped. Each settles within 1% in about
 * its step's duration, so it matches the CSS fallback in `motionTiming.ts`.
 */
export const spring: Record<MotionStep, Transition> = {
	snap: { type: "spring", stiffness: 4560, damping: 135, mass: 1 },
	quick: { type: "spring", stiffness: 1760, damping: 84, mass: 1 },
	smooth: { type: "spring", stiffness: 780, damping: 56, mass: 1 },
	gentle: { type: "spring", stiffness: 500, damping: 49, mass: 1 },
	slow: { type: "spring", stiffness: 290, damping: 42, mass: 1 },
};
