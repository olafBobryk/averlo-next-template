import { cva } from "class-variance-authority";
import type * as React from "react";

export const textVariants = cva("", {
	variants: {
		variant: {
			heading:
				"text-3xl font-semibold leading-tight tracking-normal md:text-5xl",
			body: "text-base leading-7",
			support: "text-sm leading-6",
			headingHero: "text-4xl font-semibold leading-tight md:text-6xl",
			heading2xxl: "text-4xl font-semibold leading-tight md:text-6xl",
			headingXxl: "text-3xl font-semibold leading-tight md:text-5xl",
			headingXl: "text-3xl font-semibold leading-tight md:text-5xl",
			headingLg: "text-2xl font-semibold leading-tight md:text-4xl",
			headingMd: "text-xl font-semibold leading-tight",
			headingSm: "text-lg font-semibold leading-tight",
			headingXs: "text-base font-semibold leading-snug",
			bodyStrong: "text-base font-semibold leading-7",
			caption: "text-sm leading-6",
		},
		tone: {
			default: "text-foreground",
			muted: "text-muted",
			inherit: "text-inherit",
		},
		interactive: {
			true: "transition-colors motion-interactive",
			false: "",
		},
	},
	defaultVariants: {
		variant: "body",
		tone: "default",
		interactive: true,
	},
});

export type TextVariant =
	| "heading"
	| "body"
	| "support"
	| "headingHero"
	| "heading2xxl"
	| "headingXxl"
	| "headingXl"
	| "headingLg"
	| "headingMd"
	| "headingSm"
	| "headingXs"
	| "bodyStrong"
	| "caption"
	| null;
export type TextTone = "default" | "muted" | "inherit" | null;

type TextOwnProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	className?: string;
	interactive?: boolean;
	tone?: TextTone;
	variant?: TextVariant;
};

export type TextProps = TextOwnProps &
	Omit<React.HTMLAttributes<HTMLElement>, keyof TextOwnProps>;

export function Text({
	as,
	children,
	className,
	interactive: _interactive,
	tone = "default",
	variant = "body",
	...rest
}: TextProps) {
	const Tag = as ?? (variant === "heading" ? "h2" : "p");

	return (
		<Tag
			className={textVariants({
				variant,
				tone,
				interactive: _interactive,
				className,
			})}
			{...rest}
		>
			{children}
		</Tag>
	);
}
