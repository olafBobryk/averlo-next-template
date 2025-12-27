// lib/motionPresets.ts
// Centralized spring presets to keep motion consistent across the UI.
export const springs = {
	soft: {
		type: "spring",
		stiffness: 160,
		damping: 22,
		mass: 1,
		restSpeed: 0.001,
	},
	medium: {
		type: "spring",
		stiffness: 220,
		damping: 26,
		mass: 1,
		restSpeed: 0.001,
	},
	snappy: {
		type: "spring",
		stiffness: 320,
		damping: 30,
		mass: 1,
		restSpeed: 0.001,
	},
} as const;
