import assert from "node:assert/strict";
import test from "node:test";
import { cubicBezier, spring } from "motion";
import { getMotionTiming } from "@/components/ui/foundations/motionTiming";
import {
	createProgressTrajectory,
	getGsapRevealTiming,
	getGsapTiming,
} from "./timing";

test("preserves configured reveal trajectory at intermediate timestamps", () => {
	const transition = getMotionTiming("grand");
	const trajectory = createProgressTrajectory(0, 1);
	assert.ok(trajectory.durationMs > 0);
	if (transition.type === "spring") {
		const reference = spring({
			keyframes: [0, 1],
			stiffness: Number(transition.stiffness),
			damping: Number(transition.damping),
			mass: Number(transition.mass),
		});
		for (const ms of [0, 16, 80, 150, 300, 600, 1200])
			assert.equal(trajectory.sample(ms), reference.next(ms).value);
	} else {
		const ease = cubicBezier(
			...(transition.ease as [number, number, number, number]),
		);
		for (const fraction of [0, 0.05, 0.2, 0.5, 0.8, 1])
			assert.equal(
				trajectory.sample(trajectory.durationMs * fraction),
				ease(fraction),
			);
	}
});

test("explicit durations retain the existing easing, including reverse playback", () => {
	for (const duration of [0.3, 0.72, 1.2]) {
		const timing = getGsapRevealTiming(duration);
		const curve = createProgressTrajectory(0.8, 0.1, -2, duration);
		assert.equal(curve.durationMs, duration * 1000);
		for (const fraction of [0, 0.1, 0.4, 0.8, 1])
			assert.ok(
				Math.abs(
					curve.sample(curve.durationMs * fraction) -
						(0.8 - 0.7 * timing.ease(fraction)),
				) < 1e-10,
			);
	}
});

test("interrupted and reversed springs retain position and velocity", () => {
	const transition = getMotionTiming("grand");
	if (transition.type !== "spring") return;
	for (const [from, to, velocity] of [
		[0.4, 0, 2],
		[0.8, 1, -3],
		[0, 0, 1],
		[1.1, 0, -0.4],
	]) {
		const curve = createProgressTrajectory(from, to, velocity);
		const reference = spring({
			keyframes: [from, to],
			velocity,
			stiffness: Number(transition.stiffness),
			damping: Number(transition.damping),
			mass: Number(transition.mass),
		});
		for (const ms of [0, 16, 50, 160, 400, 900])
			assert.equal(curve.sample(ms), reference.next(ms).value);
	}
});

test("invalid explicit duration uses the configured trajectory", () => {
	for (const duration of [0, -1, NaN, Infinity])
		assert.equal(
			createProgressTrajectory(0, 1, 0, duration).durationMs,
			getGsapTiming("grand").duration * 1000,
		);
});
