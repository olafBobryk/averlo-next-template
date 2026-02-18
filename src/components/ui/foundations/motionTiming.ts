import type { Transition } from "motion/react";

export type MotionTimingPreset =
	| "micro"
	| "interactive"
	| "component"
	| "macro";

const timingPresetMap: Record<MotionTimingPreset, Transition> = {
	micro: { duration: 0.14, ease: [0.33, 0.1, 0.2, 1] as const },
	interactive: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
	component: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const },
	macro: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const },
};

export const motionTiming = timingPresetMap;

export const getMotionTiming = (preset: MotionTimingPreset) =>
	timingPresetMap[preset];
