import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const panelStyles = cva("text-foreground", {
	variants: {
		background: {
			background: "bg-background",
			card: "bg-background",
			surface: "bg-surface",
			transparent: "bg-transparent",
			white: "bg-background",
		},
		border: {
			default: "border border-border",
			none: "border-0",
			ring: "ring-1 ring-foreground/10",
			subtle: "border border-border/15",
		},
		columns: {
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-3",
		},
		display: {
			block: "block",
			flex: "flex flex-col",
			grid: "grid",
		},
		gap: {
			none: "gap-0",
			sm: "gap-4",
			md: "gap-6",
			lg: "gap-8",
		},
		overflow: {
			auto: "overflow-auto",
			hidden: "overflow-hidden",
			visible: "overflow-visible",
		},
		padding: {
			none: "p-0",
			xs: "p-2",
			sm: "p-4",
			md: "p-6",
			lg: "p-8",
		},
		radius: {
			none: "rounded-none",
			sm: "rounded-lg",
			md: "rounded-xl",
			lg: "rounded-2xl",
		},
		shadow: {
			none: "shadow-none",
			sm: "shadow-sm",
			lg: "shadow-lg",
			xl: "shadow-xl",
			"2xl": "shadow-2xl",
		},
		tone: {
			default: "",
			warning: "border-warning/20 bg-warning/10",
			danger: "border-danger/20 bg-danger/10",
		},
		width: {
			auto: "w-auto",
			full: "w-full",
		},
	},
	defaultVariants: {
		background: "background",
		border: "default",
		columns: 1,
		display: "grid",
		gap: "md",
		overflow: "visible",
		padding: "md",
		radius: "lg",
		shadow: "sm",
		tone: "default",
		width: "full",
	},
});

type PanelOwnProps<T extends ElementType> = {
	/** Boolean shorthand for selecting the default or no-border treatment. */
	bordered?: boolean;
	as?: T;
	children?: ReactNode;
	className?: string;
} & VariantProps<typeof panelStyles>;

export type PanelProps<T extends ElementType = "div"> = PanelOwnProps<T> &
	Omit<ComponentPropsWithoutRef<T>, keyof PanelOwnProps<T>>;

export function Panel<T extends ElementType = "div">({
	as,
	background,
	border,
	bordered,
	children,
	className,
	columns,
	display,
	gap,
	overflow,
	padding,
	radius,
	shadow,
	tone,
	width,
	...rest
}: PanelProps<T>) {
	const Tag = (as ?? "div") as ElementType;
	const resolvedBorder = border ?? (bordered === false ? "none" : undefined);

	return (
		<Tag
			className={clsx(
				panelStyles({
					background,
					border: resolvedBorder,
					columns,
					display,
					gap,
					overflow,
					padding,
					radius,
					shadow,
					tone,
					width,
				}),
				className,
			)}
			data-slot="panel"
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			{children}
		</Tag>
	);
}
