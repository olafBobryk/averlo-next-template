import clsx from "clsx";
import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ElementType,
	ReactNode,
} from "react";

export type PillTone =
	| "plain"
	| "neutral"
	| "primary"
	| "success"
	| "warning"
	| "danger"
	| "helper";

type PillStyle = CSSProperties & {
	"--pill-accent"?: string;
};

export type PillProps<T extends ElementType = "span"> = {
	as?: T;
	tone?: PillTone;
	helperIndex?: number;
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
} & Omit<
	ComponentPropsWithoutRef<T>,
	"as" | "children" | "className" | "style"
>;

const HELPER_PALETTE_SIZE = 8;

const toneClasses: Record<PillTone, string> = {
	plain: "border-border bg-background text-foreground",
	neutral: "border-border bg-background/75 text-muted",
	primary:
		"border-primary/25 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-background))] text-primary",
	success:
		"border-success/25 bg-[color-mix(in_srgb,var(--color-success)_8%,var(--color-background))] text-success",
	warning:
		"border-warning/25 bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-background))] text-warning",
	danger:
		"border-danger/25 bg-[color-mix(in_srgb,var(--color-danger)_8%,var(--color-background))] text-danger",
	helper:
		"border-[color:var(--pill-accent)] bg-[color-mix(in_srgb,var(--pill-accent)_5%,var(--color-background))] text-[color:var(--pill-accent)]",
};

function normalizeHelperIndex(index: number) {
	if (!Number.isFinite(index)) return 0;
	return Math.abs(Math.trunc(index)) % HELPER_PALETTE_SIZE;
}

export function Pill<T extends ElementType = "span">({
	as,
	tone = "neutral",
	helperIndex = 0,
	children,
	className,
	style,
	...rest
}: PillProps<T>) {
	const Tag = (as ?? "span") as ElementType;
	const helperStyle: PillStyle | undefined =
		tone === "helper"
			? {
					"--pill-accent": `var(--color-helper-${normalizeHelperIndex(helperIndex)})`,
				}
			: undefined;

	return (
		<Tag
			className={clsx(
				"inline-flex items-center justify-center rounded-full border transition-colors motion-interactive",
				toneClasses[tone],
				className,
			)}
			style={helperStyle ? { ...helperStyle, ...style } : style}
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			{children}
		</Tag>
	);
}
