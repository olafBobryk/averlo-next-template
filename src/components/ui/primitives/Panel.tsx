// components/ui/primitives/Panel.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const panelStyles = cva("w-full rounded-2xl border border-border shadow-sm", {
	variants: {
		display: {
			grid: "grid",
			flex: "flex flex-col",
		},
		padding: {
			none: "p-0",
			sm: "p-4",
			md: "p-6",
			lg: "p-8",
		},
		gap: {
			none: "gap-0",
			sm: "gap-4",
			md: "gap-6",
			lg: "gap-8",
		},
		columns: {
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-3",
		},
		shadow: {
			none: "shadow-none",
			sm: "shadow-sm",
		},
		bordered: {
			true: "border border-border",
			false: "border-0",
		},
		background: {
			white: "bg-background",
			surface: "bg-surface",
			transparent: "bg-transparent",
		},
		tone: {
			default: "",
			warning: "border border-warning/20 bg-warning/10",
			danger: "border border-danger/20 bg-danger/10",
		},
	},
	defaultVariants: {
		display: "grid",
		padding: "md",
		gap: "md",
		columns: 1,
		shadow: "sm",
		bordered: true,
		background: "white",
		tone: "default",
	},
});

export type PanelProps<T extends ElementType = "div"> = {
	as?: T;
	children: ReactNode;
	className?: string;
} & VariantProps<typeof panelStyles> &
	Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Panel<T extends ElementType = "div">({
	as,
	children,
	className,
	display,
	padding,
	gap,
	columns,
	shadow,
	bordered,
	background,
	tone,
	...rest
}: PanelProps<T>) {
	const Tag = (as ?? "div") as ElementType;
	const classes = [
		panelStyles({
			display,
			padding,
			gap,
			columns,
			shadow,
			bordered,
			background,
			tone,
		}),
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Tag
			className={classes}
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			{children}
		</Tag>
	);
}
