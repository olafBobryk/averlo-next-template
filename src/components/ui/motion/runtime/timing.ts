import { cubicBezier } from "motion";
import {
	getMotionTiming,
	type MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";

function isBezier(ease: unknown): ease is [number, number, number, number] {
	return (
		Array.isArray(ease) &&
		ease.length === 4 &&
		ease.every((value) => typeof value === "number")
	);
}

export function getGsapTiming(preset: MotionTimingPreset) {
	const transition = getMotionTiming(preset);
	const ease = transition.ease;

	return {
		duration: Number(transition.duration ?? 0),
		ease: isBezier(ease)
			? cubicBezier(...ease)
			: (progress: number) => progress,
	};
}
