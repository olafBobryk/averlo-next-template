// components/ui/Heading.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const headingVariants = cva("", {
		variants: {
		size: {
			xxl: "text-[36px] font-semibold text-foreground -tracking-[0.02em]",
			// 26px semibold – page titles, success messages
			xl: "text-[26px] font-semibold text-foreground -tracking-[0.02em]",
			// 20px semibold – strong section titles
			lg: "text-xl font-semibold text-foreground -tracking-[0.02em]",
			// 20px medium – normal section titles / dialogs
			md: "text-xl font-medium text-foreground -tracking-[0.02em]",
			// 20px medium – normal section titles / dialogs
			xs: "text-base font-medium text-foreground -tracking-[0.02em]",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

type HeadingProps = {
	as?: "h1" | "h2" | "h3" | "h4" | "p";
	className?: string;
	children: React.ReactNode;
} & VariantProps<typeof headingVariants>;

export function Heading({
	as: Tag = "h2",
	size,
	className,
	children,
}: HeadingProps) {
	return <Tag className={headingVariants({ size, className })}>{children}</Tag>;
}
