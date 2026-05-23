import type { Transition } from "motion/react";
import type {
	MotionIntensity,
	MotionMoment,
	MotionResolveOptions,
	MotionTimingPreset,
} from "@/components/ui/foundations/motionTiming";
import { motionPresetMomentMap } from "@/components/ui/foundations/motionTiming";

export type SpringPreset = MotionMoment | MotionTimingPreset;

type SpringConfig = {
	stiffness: number;
	damping: number;
	mass: number;
};

const springMomentMap = {
	feedback: { stiffness: 520, damping: 34, mass: 0.2 },
	interaction: { stiffness: 320, damping: 30, mass: 0.3 },
	disclosure: { stiffness: 260, damping: 28, mass: 0.35 },
	overlay: { stiffness: 180, damping: 26, mass: 0.45 },
	reveal: { stiffness: 150, damping: 24, mass: 0.55 },
	ambient: { stiffness: 120, damping: 22, mass: 0.65 },
	scroll: { stiffness: 220, damping: 28, mass: 0.4 },
} as const satisfies Record<MotionMoment, SpringConfig>;

const intensityScale = {
	subtle: 0.88,
	normal: 1,
	strong: 1.12,
	hero: 0.78,
} as const satisfies Record<MotionIntensity, number>;

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function normalizePreset(preset: SpringPreset): MotionMoment {
	if (preset in motionPresetMomentMap) {
		return motionPresetMomentMap[preset as MotionTimingPreset];
	}
	return preset as MotionMoment;
}

export function getSpring(
	preset: SpringPreset,
	{ intensity = "normal", expressive = 0 }: MotionResolveOptions = {},
): Transition {
	const config = springMomentMap[normalizePreset(preset)];
	const scale =
		intensityScale[intensity] * (1 - clamp(expressive, -1, 1) * 0.08);

	return {
		type: "spring",
		stiffness: Math.round(config.stiffness * scale),
		damping: Math.round(config.damping * (1 - clamp(expressive, -1, 1) * 0.04)),
		mass: config.mass,
	};
}

export const spring = {
	get feedback() {
		return getSpring("feedback");
	},
	get interaction() {
		return getSpring("interaction");
	},
	get disclosure() {
		return getSpring("disclosure");
	},
	get overlay() {
		return getSpring("overlay");
	},
	get reveal() {
		return getSpring("reveal");
	},
	get ambient() {
		return getSpring("ambient");
	},
	get scroll() {
		return getSpring("scroll");
	},
	get micro() {
		return getSpring("micro");
	},
	get interactive() {
		return getSpring("interactive");
	},
	get component() {
		return getSpring("component");
	},
	get macro() {
		return getSpring("macro");
	},
} as const;
