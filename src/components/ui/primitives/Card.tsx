import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

const cardStyles = cva(
	"w-full rounded-2xl border border-border text-foreground shadow-sm",
	{
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
	},
);

export type CardProps<T extends ElementType = "div"> = {
	as?: T;
	children?: ReactNode;
	className?: string;
} & VariantProps<typeof cardStyles> &
	Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "div">({
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
}: CardProps<T>) {
	const Tag = (as ?? "div") as ElementType;

	return (
		<Tag
			data-slot="card"
			className={cx(
				cardStyles({
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
			)}
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			{children}
		</Tag>
	);
}

type CardPartProps = ComponentPropsWithoutRef<"div">;

export function CardHeader({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-header"
			className={cx(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

export function CardTitle({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-title"
			className={cx("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

export function CardDescription({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-description"
			className={cx("text-sm text-muted", className)}
			{...props}
		/>
	);
}

export function CardAction({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-action"
			className={cx(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

export function CardContent({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-content"
			className={cx("px-6", className)}
			{...props}
		/>
	);
}

export function CardFooter({ className, ...props }: CardPartProps) {
	return (
		<div
			data-slot="card-footer"
			className={cx("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}
