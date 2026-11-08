import assert from "node:assert/strict";
import test from "node:test";
import { spring } from "motion";
import { spring as stepSpring } from "@/components/ui/foundations/spring";
import {
	createProgressTrajectory,
	getGsapRevealTiming,
	getGsapTiming,
} from "./timing";

test("preserves configured reveal trajectory at intermediate timestamps", () => {
	const transition = stepSpring.slow;
	const trajectory = createProgressTrajectory(0, 1);
	assert.ok(trajectory.durationMs > 0);
	const reference = spring({
		keyframes: [0, 1],
		stiffness: Number(transition.stiffness),
		damping: Number(transition.damping),
		mass: Number(transition.mass),
	});
	for (const ms of [0, 16, 80, 150, 300, 600, 1200])
		assert.equal(trajectory.sample(ms), reference.next(ms).value);
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
	const transition = stepSpring.slow;
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
			getGsapTiming("slow").duration * 1000,
		);
});
