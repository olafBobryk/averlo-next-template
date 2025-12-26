// components/ui/Text.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const textVariants = cva("", {
	variants: {
		variant: {
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
	as?: "span" | "p" | "div" | "label";
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

export type TextProps = SpanProps | PProps | DivProps | LabelProps;

// Overloads (gives you correct props per tag)
export function Text(props: SpanProps): React.ReactElement;
export function Text(props: PProps): React.ReactElement;
export function Text(props: DivProps): React.ReactElement;
export function Text(props: LabelProps): React.ReactElement;

export function Text({
	as = "span",
	variant,
	className,
	children,
	...rest
}: TextProps) {
	const Tag = as as "span" | "p" | "div" | "label";
	return (
		<Tag className={textVariants({ variant, className })} {...(rest as any)}>
			{children}
		</Tag>
	);
}
