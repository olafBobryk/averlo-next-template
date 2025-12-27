"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import type * as React from "react";
import { Icon, type IconName } from "@/components/ui/primitives/Icon";
import { iconMap } from "@/components/ui/primitives/iconMap";

type IconProp = React.ReactNode | IconName;

const animatedIconClassMap: Partial<Record<IconName, string>> = {
	"arrow-right":
		"group-hover:translate-x-[2px] motion-macro transition-transform",
	"arrow-left":
		"group-hover:-translate-x-[2px] motion-macro transition-transform",
	plus: "group-hover:rotate-[900deg] motion-macro transition-transform",
};

const buttonStyles = cva(
	[
		// layout
		"inline-flex items-center justify-center gap-2.5 rounded-[6.25rem]",
		"whitespace-nowrap",

		// motion
		"transition-all motion-interactive",

		// focus / disabled
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
		"disabled:opacity-50 disabled:pointer-events-none",

		// subtle interaction
		"hover:-translate-y-[0.0625rem] active:translate-y-[0rem] active:scale-[0.98]",

		// tailwind helpers
		"group",

		// cursor
		"cursor-pointer disabled:cursor-not-allowed",
	].join(" "),
	{
		variants: {
			variant: {
				outline:
					"border border-border/15 bg-transparent text-foreground hover:bg-surface",
				primary:
					"bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
				primaryDark:
					"bg-[#020202] text-white hover:bg-[#020202]/90 border border-transparent",
				solid:
					"bg-border/5 text-foreground hover:bg-border/10 border border-transparent",

				// ✅ new: text-only button
				ghost:
					"border-0 bg-transparent !p-0 rounded-none text-foreground hover:bg-transparent hover:translate-y-0 active:translate-y-0 active:scale-100",
			},
			size: {
				lg: "px-6 py-3 text-sm font-semibold",
				xl: "px-7 py-3.5 text-base font-semibold",
				md: "px-5 py-2.5 text-sm font-medium",
				sm: "px-2.5 py-[5px] text-xs font-medium",
				icon: "min-w-[2.4375rem] min-h-[2.4375rem] h-[2.4375rem] w-[2.4375rem] px-0 py-0 text-sm font-medium justify-center items-center",
				"icon-sm":
					"min-w-[1.5625rem] min-h-[1.5625rem] h-[1.5625rem] w-[1.5625rem] px-0 py-0 text-sm font-medium justify-center item-center",
			},
			align: {
				left: "justify-start",
				center: "justify-center",
			},
		},
		defaultVariants: {
			variant: "outline",
			size: "md",
			align: "left",
		},
	},
);

const DEFAULT_ICON_SIZE = 15; // 0.9375rem – kept in px to match provided assets

type ButtonBaseProps = {
	children?: React.ReactNode;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
	href?: string;
	className?: string;
	style?: React.CSSProperties;
	loading?: boolean;
	iconSize?: number;
} & VariantProps<typeof buttonStyles>;

// allow both button + link props without getting too crazy on typing
type ButtonProps = ButtonBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

function renderIcon(icon?: IconProp, size = DEFAULT_ICON_SIZE) {
	if (!icon) return null;

	if (typeof icon === "string") {
		if (!iconMap[icon as IconName]) return null;

		return (
			<Icon
				name={icon as IconName}
				className={animatedIconClassMap[icon as IconName]}
				style={{ width: `${size}px`, height: `${size}px` }}
			/>
		);
	}

	return (
		<span className="inline-flex items-center justify-center">{icon}</span>
	);
}

export function Button(props: ButtonProps) {
	const {
		children,
		leadingIcon,
		trailingIcon,
		href,
		className,
		style,
		variant = "outline",
		size = "md",
		align = "center",
		loading = false,
		iconSize = DEFAULT_ICON_SIZE,
		...rest
	} = props;

	const mergedClassName = clsx(
		buttonStyles({ variant, size, align }),
		className,
	);

	// shadow / drop-shadow styling per variant (matches your examples)
	const variantStyle: React.CSSProperties =
		variant === "outline"
			? { filter: "drop-shadow(2px 4px 15px rgba(2,2,2,0.03))" }
			: variant === "ghost"
				? {}
				: { boxShadow: "2px 4px 15px 0 rgba(2,2,2,0.03)" };

	const mergedStyle = { ...variantStyle, ...style };

	const content = (
		<>
			{leadingIcon && (
				<span className="flex items-center justify-center">
					{renderIcon(leadingIcon, iconSize)}
				</span>
			)}

			{/* children can be anything (text, icon, etc) */}
			{children && <>{children}</>}

			{trailingIcon && (
				<span className="flex items-center justify-center">
					{renderIcon(trailingIcon, iconSize)}
				</span>
			)}
		</>
	);

	if (href) {
		// Link-style button
		return (
			<Link
				href={href}
				className={mergedClassName}
				style={mergedStyle}
				{...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{content}
			</Link>
		);
	}

	// Regular button
	return (
		<button
			type="button"
			className={mergedClassName}
			style={mergedStyle}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{loading ? "loading..." : content}
		</button>
	);
}
