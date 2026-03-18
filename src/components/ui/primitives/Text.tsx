// components/ui/Text.tsx
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { Skeleton } from "@/components/ui/misc/Skeleton";

export const textVariants = cva("", {
	variants: {
		variant: {
			headingHero:
				"text-[calc(70px*var(--text-scale,1))] font-semibold -tracking-[0.02em] leading-[1.05]",
			heading2xxl:
				"text-[calc(50px*var(--text-scale,1))] font-semibold -tracking-[0.02em] leading-[1.05]",
			headingXxl:
				"text-[calc(36px*var(--text-scale,1))] font-semibold -tracking-[0.02em]",
			headingXl:
				"text-[calc(26px*var(--text-scale,1))] font-semibold -tracking-[0.02em]",
			headingLg:
				"text-[calc(1.25rem*var(--text-scale,1))] font-semibold -tracking-[0.02em]",
			headingMd:
				"text-[calc(1.25rem*var(--text-scale,1))] font-medium -tracking-[0.02em]",
			headingSm:
				"text-[calc(1.125rem*var(--text-scale,1))] font-medium -tracking-[0.02em]",
			headingXs:
				"text-[calc(1rem*var(--text-scale,1))] font-medium -tracking-[0.02em]",
			body: "text-[calc(0.875rem*var(--text-scale,1))] font-normal",
			bodyStrong:
				"text-[calc(0.875rem*var(--text-scale,1))] font-medium -tracking-[0.02em]",
			caption: "text-[calc(0.75rem*var(--text-scale,1))] font-normal",
		},
		tone: {
			default: "text-foreground",
			muted: "text-muted/60",
			inherit: "",
		},
	},
	defaultVariants: {
		variant: "body",
		tone: "default",
	},
});

type BaseProps = {
	as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	className?: string;
	children?: React.ReactNode;
} & VariantProps<typeof textVariants>;

type SpanProps = BaseProps & {
	as?: "span";
} & React.HTMLAttributes<HTMLSpanElement>;
type PProps = BaseProps & {
	as: "p";
} & React.HTMLAttributes<HTMLParagraphElement>;
type DivProps = BaseProps & {
	as: "div";
} & React.HTMLAttributes<HTMLDivElement>;
type LabelProps = BaseProps & {
	as: "label";
} & React.LabelHTMLAttributes<HTMLLabelElement>;
type HeadingProps = BaseProps & {
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.HTMLAttributes<HTMLHeadingElement>;

export type TextProps =
	| SpanProps
	| PProps
	| DivProps
	| LabelProps
	| HeadingProps;

type TextSkeletonProps = Omit<
	React.ComponentPropsWithoutRef<typeof Skeleton>,
	"children"
> &
	VariantProps<typeof textVariants> & {
		as?:
			| "span"
			| "p"
			| "div"
			| "label"
			| "h1"
			| "h2"
			| "h3"
			| "h4"
			| "h5"
			| "h6";
		children?: React.ReactNode;
		textClassName?: string;
	};

function TextSkeleton({
	as = "span",
	variant,
	tone,
	className,
	textClassName,
	children,
	...rest
}: TextSkeletonProps) {
	const Tag = as as
		| "span"
		| "p"
		| "div"
		| "label"
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6";
	const resolvedVariant = textVariants({
		variant,
		tone,
		className: textClassName,
	});

	return (
		<Skeleton
			className={clsx("w-fit", textVariants({ variant, tone, className }))}
			{...rest}
		>
			<Tag className={resolvedVariant}>{children ?? "Loading"}</Tag>
		</Skeleton>
	);
}

// Overloads (gives you correct props per tag)
function TextRoot(props: SpanProps): React.ReactElement;
function TextRoot(props: PProps): React.ReactElement;
function TextRoot(props: DivProps): React.ReactElement;
function TextRoot(props: LabelProps): React.ReactElement;
function TextRoot(props: HeadingProps): React.ReactElement;

function TextRoot({
	as = "span",
	variant,
	tone,
	className,
	children,
	...rest
}: TextProps) {
	const Tag = as as
		| "span"
		| "p"
		| "div"
		| "label"
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6";
	return (
		<Tag
			className={textVariants({ variant, tone, className })}
			{...(rest as Record<string, unknown>)}
		>
			{children}
		</Tag>
	);
}

export const Text = Object.assign(TextRoot, { Skeleton: TextSkeleton });
