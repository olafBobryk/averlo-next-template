import {
	type MotionResolveOptions,
	resolveMotionTransition,
} from "@/components/ui/foundations/motionTiming";

export function resolveRevealTransition(options: MotionResolveOptions = {}) {
	return resolveMotionTransition("reveal", options);
}

export function resolveRevealFeedbackTransition(
	options: MotionResolveOptions = {},
) {
	return resolveMotionTransition("interaction", options);
}
