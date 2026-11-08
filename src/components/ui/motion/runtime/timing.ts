import { calcGeneratorDuration, cubicBezier, spring } from "motion";
import type { Transition } from "motion/react";
import {
	type MotionStep,
	motionTiming,
} from "@/components/ui/foundations/motionTiming";
import { spring as stepSpring } from "@/components/ui/foundations/spring";

function isBezier(ease: unknown): ease is [number, number, number, number] {
	return (
		Array.isArray(ease) &&
		ease.length === 4 &&
		ease.every((value) => typeof value === "number")
	);
}

function toGsapSpringTiming(transition: Transition) {
	// Keep the existing spring as the animation curve; GSAP only owns playback.
	const generator = spring({
		damping: Number(transition.damping ?? 10),
		keyframes: [0, 1],
		mass: Number(transition.mass ?? 1),
		stiffness: Number(transition.stiffness ?? 100),
		velocity: Number(transition.velocity ?? 0),
	});
	const durationMs = calcGeneratorDuration(generator);

	return {
		duration: durationMs / 1000,
		ease: (progress: number) => generator.next(durationMs * progress).value,
	};
}

function toGsapTiming(transition: Transition) {
	if (transition.type === "spring") return toGsapSpringTiming(transition);

	return {
		duration: Number(transition.duration ?? 0),
		ease: isBezier(transition.ease)
			? cubicBezier(...transition.ease)
			: (progress: number) => progress,
	};
}

export function getGsapTiming(step: MotionStep) {
	return toGsapTiming(stepSpring[step]);
}

export function getGsapRevealTiming(duration?: number) {
	if (Number.isFinite(duration) && duration !== undefined && duration > 0) {
		return toGsapTiming({
			...motionTiming.slow,
			duration,
		});
	}
	return getGsapTiming("slow");
}

/** Absolute keyframes and incoming velocity preserve interrupted/reversed springs. */
export function createProgressTrajectory(
	from: number,
	to: number,
	velocity = 0,
	duration?: number,
) {
	if (duration !== undefined && Number.isFinite(duration) && duration > 0) {
		const timing = getGsapRevealTiming(duration);
		return {
			durationMs: duration * 1000,
			sample: (milliseconds: number) =>
				from +
				(to - from) *
					timing.ease(
						Math.min(1, Math.max(0, milliseconds / (duration * 1000))),
					),
		};
	}
	const transition = stepSpring.slow;
	const generator = spring({
		keyframes: [from, to],
		stiffness: Number(transition.stiffness),
		damping: Number(transition.damping),
		mass: Number(transition.mass),
		velocity,
	});
	const durationMs = calcGeneratorDuration(generator);
	return {
		durationMs,
		sample: (milliseconds: number) =>
			generator.next(Math.max(0, milliseconds)).value,
	};
}
