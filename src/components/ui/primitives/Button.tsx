"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type * as React from "react";

type IconKey =
	| "check"
	| "arrow-right"
	| "arrow-left"
	| "plus"
	| "add-image"
	| "notes"
	| "cross"
	| "camera";

type IconProp = React.ReactNode | IconKey;

const iconMap: Record<IconKey, React.ReactNode> = {
	cross: (
		<svg
			width={15}
			height={15}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="w-[15px] h-[15px] relative"
			preserveAspectRatio="xMidYMid meet"
		>
			<title>cancel</title>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M3.41854 3.41854C3.6016 3.23549 3.8984 3.23549 4.08145 3.41854L11.5814 10.9186C11.7645 11.1016 11.7645 11.3984 11.5814 11.5814C11.3984 11.7645 11.1016 11.7645 10.9186 11.5814L3.41854 4.08145C3.23549 3.8984 3.23549 3.6016 3.41854 3.41854Z"
				fill="currentColor"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11.5814 3.41854C11.7645 3.6016 11.7645 3.8984 11.5814 4.08145L4.08146 11.5814C3.8984 11.7645 3.6016 11.7645 3.41855 11.5814C3.23549 11.3984 3.23549 11.1016 3.41854 10.9186L10.9186 3.41854C11.1016 3.23549 11.3984 3.23549 11.5814 3.41854Z"
				fill="currentColor"
			/>
		</svg>
	),
	check: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="9"
			fill="none"
			viewBox="0 0 12 9"
		>
			<title>verify</title>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.25"
				d="M.625 4.444 3.702 7.5 10.625.625"
			/>
		</svg>
	),
	notes: (
		<svg
			width={15}
			height={15}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="flex-grow-0 flex-shrink-0 w-[15px] h-[15px] relative"
			preserveAspectRatio="none"
		>
			<title>notes</title>
			<path
				d="M12.6947 7.90456L13.0183 6.69712C13.3959 5.28771 13.5847 4.583 13.4426 3.97314C13.3303 3.49161 13.0777 3.05417 12.7169 2.71617C12.2598 2.28809 11.5551 2.09927 10.1457 1.72161C8.73625 1.34396 8.0315 1.15513 7.42169 1.29733C6.94012 1.40961 6.50269 1.66216 6.16469 2.02304C5.79818 2.41436 5.60705 2.98723 5.32263 4.02851C5.27487 4.20337 5.22447 4.39146 5.17017 4.59411L4.84661 5.80164C4.46896 7.21106 4.28013 7.91575 4.42233 8.52562C4.53461 9.00719 4.78716 9.44462 5.14804 9.78262C5.60509 10.2107 6.30981 10.3995 7.71925 10.7772C8.98962 11.1176 9.68744 11.3046 10.2594 11.234C10.322 11.2263 10.3831 11.2155 10.4432 11.2014C10.9247 11.0892 11.3622 10.8366 11.7002 10.4757C12.1282 10.0187 12.3171 9.314 12.6947 7.90456Z"
				stroke="currentColor"
				stroke-width="0.9375"
			/>
			<path
				d="M10.2594 11.2338C10.1291 11.6329 9.89994 11.9939 9.59187 12.2824C9.13481 12.7105 8.43006 12.8993 7.02069 13.277C5.61124 13.6546 4.90652 13.8434 4.29666 13.7013C3.81513 13.589 3.3777 13.3364 3.03969 12.9756C2.61162 12.5185 2.42279 11.8138 2.04514 10.4044L1.72161 9.19694C1.34396 7.7875 1.15513 7.08281 1.29733 6.47294C1.40961 5.99142 1.66216 5.55399 2.02304 5.21598C2.48009 4.78791 3.18481 4.59908 4.59423 4.22143C4.86088 4.14998 5.1023 4.08529 5.32263 4.02832"
				stroke="currentColor"
				stroke-width="0.9375"
			/>
			<path
				d="M7.36035 6.25L10.3789 7.05881"
				stroke="currentColor"
				stroke-width="0.9375"
				stroke-linecap="round"
			/>
			<path
				d="M6.875 8.06091L8.68613 8.54616"
				stroke="currentColor"
				stroke-width="0.9375"
				stroke-linecap="round"
			/>
		</svg>
	),
	"add-image": (
		<svg
			width={15}
			height={15}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="flex-grow-0 flex-shrink-0 w-[15px] h-[15px] relative"
			preserveAspectRatio="none"
		>
			<title>add image</title>
			<path
				d="M8.91544 9.96106L7.84206 8.89662C7.34875 8.40744 7.10206 8.16281 6.81806 8.07106C6.56825 7.99031 6.29937 7.99031 6.04951 8.07106C5.76553 8.16281 5.51886 8.40744 5.02551 8.89662L2.52621 11.4139M8.91544 9.96106L9.12875 9.74944C9.6325 9.24994 9.88431 9.00019 10.1733 8.90906C10.4274 8.82887 10.7005 8.832 10.9527 8.918C11.2395 9.01581 11.4856 9.27125 11.9776 9.78219L12.5 10.3126M8.91544 9.96106L11.3875 12.4767M2.52621 11.4139C2.5454 11.5766 2.57864 11.7044 2.63624 11.8175C2.75608 12.0527 2.94731 12.2439 3.18251 12.3637C3.4499 12.5 3.79993 12.5 4.5 12.5H10.5C10.8883 12.5 11.1689 12.5 11.3875 12.4767M2.52621 11.4139C2.5 11.1916 2.5 10.9041 2.5 10.5V4.5C2.5 3.79994 2.5 3.4499 2.63624 3.18251C2.75608 2.94731 2.94731 2.75608 3.18251 2.63624C3.4499 2.5 3.79993 2.5 4.5 2.5H6.875M11.3875 12.4767C11.5629 12.4581 11.6984 12.4244 11.8175 12.3637C12.0527 12.2439 12.2439 12.0527 12.3637 11.8175C12.5 11.5501 12.5 11.2001 12.5 10.5V8.125M11.25 5.625V3.75M11.25 3.75V1.875M11.25 3.75H13.125M11.25 3.75H9.375"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	),
	"arrow-right": (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			fill="none"
			viewBox="0 0 20 20"
			className="group-hover:translate-x-[2px] motion-macro transition-transform"
		>
			<title>arrow</title>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M16.667 10H3.334m13.333 0-3.333-3.333M16.667 10l-3.333 3.333"
			/>
		</svg>
	),
	"arrow-left": (
		<svg
			width={20}
			height={20}
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="group-hover:translate-x-[-2px] motion-macro transition-transform rotate-180"
			preserveAspectRatio="none"
		>
			<title>Back</title>
			<path
				d="M16.667 10L3.33366 10M16.667 10L13.3337 6.66667M16.667 10L13.3337 13.3333"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	plus: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			fill="none"
			viewBox="0 0 15 15"
			className="group-hover:rotate-[900deg] motion-macro transition-transform"
		>
			<title>plus</title>
			<path
				stroke="#fff"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.25"
				d="M2.5 7.5h10m-5-5v10"
			/>
		</svg>
	),
	camera: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			fill="none"
			viewBox="0 0 15 15"
		>
			<title>photo</title>
			<path
				fill="currentColor"
				fill-rule="evenodd"
				d="M7.5 11.25A3.125 3.125 0 1 0 7.5 5a3.125 3.125 0 0 0 0 6.25Zm0-1.245a1.88 1.88 0 1 1 0-3.76 1.88 1.88 0 0 1 0 3.76Z"
				clip-rule="evenodd"
			/>
			<path
				fill="currentColor"
				fill-rule="evenodd"
				d="M5.976 1.25c-.86 0-1.61.586-1.819 1.42l-.27 1.08H2.5c-1.036 0-1.875.84-1.875 1.875v6.25c0 1.036.84 1.875 1.875 1.875h10c1.036 0 1.875-.84 1.875-1.875v-6.25c0-1.035-.84-1.875-1.875-1.875h-1.387l-.27-1.08a1.875 1.875 0 0 0-1.819-1.42H5.976ZM5.37 2.973a.625.625 0 0 1 .606-.473h3.048c.287 0 .537.195.606.473l.27 1.08c.14.557.64.947 1.213.947H12.5c.345 0 .625.28.625.625v6.25c0 .345-.28.625-.625.625h-10a.625.625 0 0 1-.625-.625v-6.25c0-.345.28-.625.625-.625h1.387A1.25 1.25 0 0 0 5.1 4.053l.27-1.08Z"
				clip-rule="evenodd"
			/>
		</svg>
	),
};

const buttonStyles = cva(
	[
		// layout
		"inline-flex items-center justify-center gap-2.5 rounded-[100px]",
		"whitespace-nowrap",

		// motion
		"transition-all motion-interactive",

		// focus / disabled
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
		"disabled:opacity-50 disabled:pointer-events-none",

		// subtle interaction
		"hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]",

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
				md: "px-5 py-2.5 text-sm font-medium",
				sm: "px-2.5 py-[5px] text-xs font-medium",
				icon: "min-w-[39px] min-h-[39px] h-[39px] w-[39px] px-0 py-0 text-sm font-medium justify-center items-center",
				"icon-sm":
					"min-w-[25px] min-h-[25px] h-[25px] w-[25px] px-0 py-0 text-sm font-medium justify-center item-center",
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

type ButtonBaseProps = {
	children?: React.ReactNode;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
	href?: string;
	className?: string;
	style?: React.CSSProperties;
	loading?: boolean;
} & VariantProps<typeof buttonStyles>;

// allow both button + link props without getting too crazy on typing
type ButtonProps = ButtonBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> &
	React.AnchorHTMLAttributes<HTMLAnchorElement>;

function renderIcon(icon?: IconProp, colorOverride?: "light" | "dark") {
	if (!icon) return null;

	if (typeof icon === "string") {
		const key = icon as IconKey;
		const mapped = iconMap[key];
		if (!mapped) return null;

		// for primary we want white-ish strokes/fills
		// if (colorOverride === "light") {
		// 	return (
		// 		<span className="inline-flex items-center justify-center ">
		// 			{mapped}
		// 		</span>
		// 	);
		// }

		return (
			<span className="inline-flex items-center justify-center">{mapped}</span>
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
		...rest
	} = props;

	const isPrimary = variant === "primary";

	const mergedClassName = [buttonStyles({ variant, size, align }), className]
		.filter(Boolean)
		.join(" ");

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
					{renderIcon(leadingIcon, isPrimary ? "light" : "dark")}
				</span>
			)}

			{/* children can be anything (text, icon, etc) */}
			{children && (
				<span className="flex min-w-0 items-center">{children}</span>
			)}

			{trailingIcon && (
				<span className="flex items-center justify-center">
					{renderIcon(trailingIcon, isPrimary ? "light" : "dark")}
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
