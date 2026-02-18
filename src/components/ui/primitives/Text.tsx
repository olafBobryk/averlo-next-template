// components/ui/Text.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Skeleton } from "@/components/ui/misc/Skeleton";

const textVariants = cva("", {
	variants: {
		variant: {
			headingHero:
				"text-[70px] font-semibold text-foreground -tracking-[0.02em] leading-[1.05]",
			heading2xxl:
				"text-[50px] font-semibold text-foreground -tracking-[0.02em] leading-[1.05]",
			headingXxl:
				"text-[36px] font-semibold text-foreground -tracking-[0.02em]",
			headingXl:
				"text-[26px] font-semibold text-foreground -tracking-[0.02em]",
			headingLg: "text-xl font-semibold text-foreground -tracking-[0.02em]",
			headingMd: "text-xl font-medium text-foreground -tracking-[0.02em]",
			headingXs: "text-base font-medium text-foreground -tracking-[0.02em]",
			body: "text-sm font-normal text-foreground",
			bodyStrong: "text-sm font-medium text-foreground -tracking-[0.02em]",
			muted: "text-sm font-medium text-muted/60 -tracking-[0.02em]",
			captionMuted: "text-xs font-normal text-muted/60",
		},
	},
	defaultVariants: {
		variant: "body",
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

export type TextProps = SpanProps | PProps | DivProps | LabelProps | HeadingProps;

type TextSkeletonProps = Omit<
	React.ComponentPropsWithoutRef<typeof Skeleton>,
	"children"
> &
	VariantProps<typeof textVariants> & {
		as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
		children?: React.ReactNode;
		textClassName?: string;
	};

function TextSkeleton({
	as = "span",
	variant,
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
	const resolvedVariant = textVariants({ variant, className: textClassName });

	return (
		<Skeleton className={textVariants({ variant, className })} {...rest}>
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
		// biome-ignore lint/suspicious/noExplicitAny: <Tag is ambiguous, then so are the rest of the props>
		<Tag className={textVariants({ variant, className })} {...(rest as any)}>
			{children}
		</Tag>
	);
}

export const Text = Object.assign(TextRoot, { Skeleton: TextSkeleton });
