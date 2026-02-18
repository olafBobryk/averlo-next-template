export type SpringPreset = "micro" | "interactive" | "component" | "macro";

// Spring presets are only for motion/react animations.
// Keep using Tailwind motion utilities (motion-micro/interactive/component/macro)
// for CSS-based transitions.
export const spring = {
	// micro: tiny UI feedback (icons, subtle hover/pill nudge)
	micro: { type: "spring", stiffness: 520, damping: 34, mass: 0.2 },
	// interactive: direct user actions (tabs, toggles, buttons)
	interactive: { type: "spring", stiffness: 320, damping: 30, mass: 0.3 },
	// component: expanding/collapsing sections, content reveals
	component: { type: "spring", stiffness: 260, damping: 28, mass: 0.35 },
	// macro: larger layout shifts (drawers, panels)
	macro: { type: "spring", stiffness: 180, damping: 26, mass: 0.45 },
} as const;

export const getSpring = (preset: SpringPreset) => spring[preset];
