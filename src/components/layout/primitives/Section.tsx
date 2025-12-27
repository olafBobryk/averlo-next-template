// components/layout/primitives/Section.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const outerStyles = cva("w-full", {
	variants: {
		padding: {
			none: "",
			soft: "px-[calc(var(--spacing-section-x)/2)] py-[calc(var(--spacing-section-y)/2)]",
			default: "px-[var(--spacing-section-x)] py-[var(--spacing-section-y)]",
			"flush-x": "py-[var(--section-py)]",
		},
		background: {
			none: "",
			surface: "bg-surface",
		},
	},
	defaultVariants: {
		padding: "default",
		background: "none",
	},
});

const innerStyles = cva("w-full", {
	variants: {
		maxWidth: {
			default: "max-w-[var(--section-max-width)] mx-auto",
			wide: "max-w-none",
			narrow: "max-w-4xl mx-auto",
		},
		align: {
			start: "items-start text-left",
			center: "items-center text-center",
			end: "items-end text-right",
		},
	},
	defaultVariants: {
		maxWidth: "default",
		align: "start",
	},
});

type SectionProps<T extends ElementType> = {
	as?: T;
	children: ReactNode;
	className?: string;
	innerClassName?: string;
} & VariantProps<typeof outerStyles> &
	VariantProps<typeof innerStyles> &
	Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Section<T extends ElementType = "section">({
	as,
	children,
	className,
	innerClassName,
	padding,
	background,
	maxWidth,
	align,
	...rest
}: SectionProps<T>) {
	const Tag = (as ?? "section") as ElementType;

	const outerClass = [outerStyles({ padding, background }), className]
		.filter(Boolean)
		.join(" ");
	const innerClass = [innerStyles({ maxWidth, align }), innerClassName]
		.filter(Boolean)
		.join(" ");

	return (
		<Tag
			className={outerClass}
			{...(rest as ComponentPropsWithoutRef<ElementType>)}
		>
			<div className={innerClass}>{children}</div>
		</Tag>
	);
}
