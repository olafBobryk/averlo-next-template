import clsx from "clsx";

export type AccentTone = "danger" | "info" | "neutral" | "success" | "warning";

type AccentScope = "slot" | "surface";

const accentSurfaceClassNames = {
	danger: "border-danger/20 bg-danger/5 ring-danger/20",
	info: "border-primary/20 bg-primary/5 ring-primary/20",
	neutral: "border-border/70 bg-muted/40",
	success: "border-success/20 bg-success/5 ring-success/20",
	warning: "border-warning/25 bg-warning/5 ring-warning/20",
} satisfies Record<AccentTone, string>;

const accentSlotClassNames = {
	danger: "bg-danger/5",
	info: "bg-primary/5",
	neutral: "bg-muted/45",
	success: "bg-success/5",
	warning: "bg-warning/5",
} satisfies Record<AccentTone, string>;

const solidAccentSurfaceClassNames = {
	danger:
		"border-danger/20 [background-color:color-mix(in_oklch,var(--card)_95%,var(--danger)_5%)] ring-danger/20",
	info: "border-primary/20 [background-color:color-mix(in_oklch,var(--card)_95%,var(--primary)_5%)] ring-primary/20",
	neutral:
		"border-border/70 [background-color:color-mix(in_oklch,var(--card)_60%,var(--muted)_40%)]",
	success:
		"border-success/20 [background-color:color-mix(in_oklch,var(--card)_95%,var(--success)_5%)] ring-success/20",
	warning:
		"border-warning/25 [background-color:color-mix(in_oklch,var(--card)_95%,var(--warning)_5%)] ring-warning/20",
} satisfies Record<AccentTone, string>;

const solidAccentSlotClassNames = {
	danger:
		"[background-color:color-mix(in_oklch,var(--card)_95%,var(--danger)_5%)]",
	info: "[background-color:color-mix(in_oklch,var(--card)_95%,var(--primary)_5%)]",
	neutral:
		"[background-color:color-mix(in_oklch,var(--card)_55%,var(--muted)_45%)]",
	success:
		"[background-color:color-mix(in_oklch,var(--card)_95%,var(--success)_5%)]",
	warning:
		"[background-color:color-mix(in_oklch,var(--card)_95%,var(--warning)_5%)]",
} satisfies Record<AccentTone, string>;

const accentForegroundClassNames = {
	danger: "text-danger",
	info: "text-primary",
	neutral: "text-muted-foreground",
	success: "text-success",
	warning: "text-warning",
} satisfies Record<AccentTone, string>;

export function getAccentClassName(
	accent: AccentTone | null | undefined,
	scope: AccentScope = "surface",
	options: { solidBackground?: boolean } = {},
) {
	if (!accent) return undefined;
	return clsx(
		options.solidBackground
			? scope === "surface"
				? solidAccentSurfaceClassNames[accent]
				: solidAccentSlotClassNames[accent]
			: scope === "surface"
				? accentSurfaceClassNames[accent]
				: accentSlotClassNames[accent],
	);
}

export function getAccentForegroundClassName(
	accent: AccentTone | null | undefined,
) {
	return accent ? accentForegroundClassNames[accent] : undefined;
}
