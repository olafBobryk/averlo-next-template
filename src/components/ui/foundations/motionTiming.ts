import type { Transition } from "motion/react";
import type { CSSProperties } from "react";

export type MotionMoment =
	| "feedback"
	| "interaction"
	| "disclosure"
	| "overlay"
	| "reveal"
	| "ambient"
	| "scroll";

export type MotionIntensity = "subtle" | "normal" | "strong" | "hero";
export type MotionDistance = "near" | "normal" | "far";
export type MotionSurface = "flat" | "raised" | "immersive";

export type MotionTimingPreset =
	| "micro"
	| "interactive"
	| "component"
	| "macro"
	| "grand";

type Bezier = [number, number, number, number];

export type MotionResolveOptions = {
	intensity?: MotionIntensity;
	expressive?: number;
	distance?: MotionDistance | number;
	surface?: MotionSurface | number;
};

export const instantTransition: Transition = { duration: 0 };

type MotionMomentConfig = {
	duration: number;
	minDuration: number;
	maxDuration: number;
	productiveEase: Bezier;
	neutralEase: Bezier;
	expressiveEase: Bezier;
};

const motionMomentConfig = {
	feedback: {
		duration: 0.14,
		minDuration: 0.08,
		maxDuration: 0.22,
		productiveEase: [0.33, 0.1, 0.2, 1],
		neutralEase: [0.33, 0.1, 0.2, 1],
		expressiveEase: [0.24, 0.84, 0.18, 1],
	},
	interaction: {
		duration: 0.2,
		minDuration: 0.12,
		maxDuration: 0.32,
		productiveEase: [0.25, 0.1, 0.25, 1],
		neutralEase: [0.25, 0.1, 0.25, 1],
		expressiveEase: [0.16, 1, 0.3, 1],
	},
	disclosure: {
		duration: 0.26,
		minDuration: 0.16,
		maxDuration: 0.42,
		productiveEase: [0.2, 0.8, 0.2, 1],
		neutralEase: [0.16, 1, 0.3, 1],
		expressiveEase: [0.18, 1, 0.22, 1],
	},
	overlay: {
		duration: 0.32,
		minDuration: 0.2,
		maxDuration: 0.54,
		productiveEase: [0.25, 0.1, 0.25, 1],
		neutralEase: [0.2, 0.8, 0.2, 1],
		expressiveEase: [0.16, 1, 0.3, 1],
	},
	reveal: {
		duration: 0.94,
		minDuration: 0.48,
		maxDuration: 1.3,
		productiveEase: [0.2, 0.8, 0.2, 1],
		neutralEase: [0.32, 0.04, 0.18, 1],
		expressiveEase: [0.33, 0, 0.2, 1],
	},
	ambient: {
		duration: 0.9,
		minDuration: 0.5,
		maxDuration: 1.6,
		productiveEase: [0.2, 0.8, 0.2, 1],
		neutralEase: [0.33, 0, 0.2, 1],
		expressiveEase: [0.25, 0.82, 0.2, 1],
	},
	scroll: {
		duration: 0.26,
		minDuration: 0.12,
		maxDuration: 0.46,
		productiveEase: [0.25, 0.1, 0.25, 1],
		neutralEase: [0.16, 1, 0.3, 1],
		expressiveEase: [0.18, 1, 0.22, 1],
	},
} as const satisfies Record<MotionMoment, MotionMomentConfig>;

export const motionPresetMomentMap = {
	micro: "feedback",
	interactive: "interaction",
	component: "disclosure",
	macro: "overlay",
	grand: "reveal",
} as const satisfies Record<MotionTimingPreset, MotionMoment>;

const intensityOffset = {
	subtle: -0.22,
	normal: 0,
	strong: 0.26,
	hero: 0.52,
} as const satisfies Record<MotionIntensity, number>;

const distanceOffset = {
	near: -0.12,
	normal: 0,
	far: 0.18,
} as const satisfies Record<MotionDistance, number>;

const surfaceOffset = {
	flat: -0.08,
	raised: 0,
	immersive: 0.18,
} as const satisfies Record<MotionSurface, number>;

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function resolveAxis({
	intensity = "normal",
	expressive = 0,
	distance = "normal",
	surface = "raised",
}: MotionResolveOptions) {
	const distanceValue =
		typeof distance === "number" ? distance : distanceOffset[distance];
	const surfaceValue =
		typeof surface === "number" ? surface : surfaceOffset[surface];

	return clamp(
		expressive + intensityOffset[intensity] + distanceValue + surfaceValue,
		-1,
		1,
	);
}

function mix(from: number, to: number, amount: number) {
	return from + (to - from) * amount;
}

function mixEase(from: Bezier, to: Bezier, amount: number): Bezier {
	return [
		mix(from[0], to[0], amount),
		mix(from[1], to[1], amount),
		mix(from[2], to[2], amount),
		mix(from[3], to[3], amount),
	];
}

function resolveEase(config: MotionMomentConfig, axis: number): Bezier {
	if (axis < 0) {
		return mixEase(config.neutralEase, config.productiveEase, Math.abs(axis));
	}
	return mixEase(config.neutralEase, config.expressiveEase, axis);
}

function resolveDuration(config: MotionMomentConfig, axis: number) {
	const duration = config.duration * (1 + axis * 0.2);
	return clamp(duration, config.minDuration, config.maxDuration);
}

export function resolveMotionTransition(
	moment: MotionMoment,
	options: MotionResolveOptions = {},
): Transition {
	const config = motionMomentConfig[moment];
	const axis = resolveAxis(options);

	return {
		duration: resolveDuration(config, axis),
		ease: resolveEase(config, axis),
	};
}

export function getMotionTiming(
	preset: MotionTimingPreset,
	options: MotionResolveOptions = {},
) {
	return resolveMotionTransition(motionPresetMomentMap[preset], options);
}

export const motionTiming = {
	get feedback() {
		return resolveMotionTransition("feedback");
	},
	get interaction() {
		return resolveMotionTransition("interaction");
	},
	get disclosure() {
		return resolveMotionTransition("disclosure");
	},
	get overlay() {
		return resolveMotionTransition("overlay");
	},
	get reveal() {
		return resolveMotionTransition("reveal");
	},
	get ambient() {
		return resolveMotionTransition("ambient");
	},
	get scroll() {
		return resolveMotionTransition("scroll");
	},
	get micro() {
		return getMotionTiming("micro");
	},
	get interactive() {
		return getMotionTiming("interactive");
	},
	get component() {
		return getMotionTiming("component");
	},
	get macro() {
		return getMotionTiming("macro");
	},
	get grand() {
		return getMotionTiming("grand");
	},
} as const;

function formatMs(seconds: number) {
	return `${Math.round(seconds * 1000)}ms`;
}

function formatEase(ease: Transition["ease"]) {
	if (!Array.isArray(ease)) return String(ease);
	return `cubic-bezier(${ease.join(", ")})`;
}

function setTimingVariables(
	variables: Record<string, string>,
	name: string,
	transition: Transition,
) {
	variables[`--motion-${name}-duration`] = formatMs(
		Number(transition.duration ?? 0),
	);
	variables[`--motion-${name}-ease`] = formatEase(transition.ease);
}

export function getMotionCssVariables(
	options: MotionResolveOptions = {},
): CSSProperties {
	const variables: Record<string, string> = {};
	const feedback = resolveMotionTransition("feedback", options);
	const interaction = resolveMotionTransition("interaction", options);
	const disclosure = resolveMotionTransition("disclosure", options);
	const overlay = resolveMotionTransition("overlay", options);
	const reveal = resolveMotionTransition("reveal", options);
	const ambient = resolveMotionTransition("ambient", options);
	const scroll = resolveMotionTransition("scroll", options);

	setTimingVariables(variables, "feedback", feedback);
	setTimingVariables(variables, "interaction", interaction);
	setTimingVariables(variables, "disclosure", disclosure);
	setTimingVariables(variables, "overlay", overlay);
	setTimingVariables(variables, "reveal", reveal);
	setTimingVariables(variables, "ambient", ambient);
	setTimingVariables(variables, "scroll", scroll);
	setTimingVariables(variables, "micro", feedback);
	setTimingVariables(variables, "interactive", interaction);
	setTimingVariables(variables, "component", disclosure);
	setTimingVariables(variables, "macro", overlay);
	setTimingVariables(variables, "grand", reveal);
	setTimingVariables(variables, "decorative", ambient);

	return variables as CSSProperties;
}
