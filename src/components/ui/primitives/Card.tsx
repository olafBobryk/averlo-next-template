import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { Panel, type PanelProps } from "@/components/ui/primitives/Panel";

const cardStyles = cva("group/card text-sm", {
	variants: {
		size: {
			default: "py-4 has-data-[slot=card-footer]:pb-0",
			sm: "py-3 has-data-[slot=card-footer]:pb-0",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export type CardProps<T extends ElementType = "div"> = PanelProps<T> &
	VariantProps<typeof cardStyles>;

export function Card<T extends ElementType = "div">({
	background = "card",
	border,
	bordered,
	className,
	display = "flex",
	gap,
	overflow = "hidden",
	padding,
	size,
	...props
}: CardProps<T>) {
	const resolvedSize = size ?? "default";
	const usesStructuredSpacing = padding == null;
	const PanelRoot = Panel as ElementType;

	return (
		<PanelRoot
			background={background}
			border={border}
			bordered={bordered}
			className={clsx(
				usesStructuredSpacing && cardStyles({ size: resolvedSize }),
				className,
			)}
			data-size={resolvedSize}
			data-slot="card"
			display={display}
			gap={gap ?? (resolvedSize === "sm" ? "sm" : "md")}
			overflow={overflow}
			padding={padding ?? "none"}
			{...props}
		/>
	);
}

type CardPartProps = ComponentPropsWithoutRef<"div">;

export function CardHeader({ className, ...props }: CardPartProps) {
	return (
		<div
			className={clsx(
				"grid auto-rows-min items-start gap-1 px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
				className,
			)}
			data-slot="card-header"
			{...props}
		/>
	);
}

type CardTitleProps = CardPartProps & {
	as?: "div" | "h2" | "h3" | "h4";
};

export function CardTitle({ as = "h2", className, ...props }: CardTitleProps) {
	const Tag = as;
	return (
		<Tag
			className={clsx(
				"font-medium leading-none group-data-[size=sm]/card:text-sm",
				className,
			)}
			data-slot="card-title"
			{...props}
		/>
	);
}

export function CardDescription({ className, ...props }: CardPartProps) {
	return (
		<div
			className={clsx("text-sm text-muted/60", className)}
			data-slot="card-description"
			{...props}
		/>
	);
}

export function CardAction({ className, ...props }: CardPartProps) {
	return (
		<div
			className={clsx(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			data-slot="card-action"
			{...props}
		/>
	);
}

export function CardContent({ className, ...props }: CardPartProps) {
	return (
		<div
			className={clsx("px-4 group-data-[size=sm]/card:px-3", className)}
			data-slot="card-content"
			{...props}
		/>
	);
}

export function CardFooter({ className, ...props }: CardPartProps) {
	return (
		<div
			className={clsx(
				"flex items-center border-t p-4 group-data-[size=sm]/card:p-3",
				className,
			)}
			data-slot="card-footer"
			{...props}
		/>
	);
}
