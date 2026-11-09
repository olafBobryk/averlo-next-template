import type { MotionValue } from "motion/react";
import { gsap } from "./gsap";
import { createProgressTrajectory } from "./timing";

/** GSAP owns the clock; the existing Motion spring owns its exact trajectory. */
export function animateGsapProgress(
	progress: MotionValue<number>,
	target: number,
	options: {
		duration?: number;
		delay?: number;
		/** A constant-rate clock over `duration`, for callers that slice it. */
		linear?: boolean;
		onComplete?: () => void;
	} = {},
) {
	if (options.linear && options.duration !== undefined) {
		const clock = { value: progress.get() };
		return gsap.to(clock, {
			value: target,
			duration: options.duration,
			delay: options.delay ?? 0,
			ease: "none",
			onUpdate: () => progress.set(clock.value),
			onComplete: () => {
				progress.set(target);
				options.onComplete?.();
			},
		});
	}
	const trajectory = createProgressTrajectory(
		progress.get(),
		target,
		progress.getVelocity(),
		options.duration,
	);
	const clock = { milliseconds: 0 };
	return gsap.to(clock, {
		milliseconds: trajectory.durationMs,
		duration: trajectory.durationMs / 1000,
		delay: options.delay ?? 0,
		ease: "none",
		onUpdate: () => progress.set(trajectory.sample(clock.milliseconds)),
		onComplete: () => {
			progress.set(target);
			options.onComplete?.();
		},
	});
}
