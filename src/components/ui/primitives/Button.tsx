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
	| "camera"
	| "instagram"
	| "linked-in"
	| "meta"
	| "x"
	| "youtube";

type IconProp = React.ReactNode | IconKey;

type IconRenderer = (size: number) => React.ReactNode;

const iconMap: Record<IconKey, IconRenderer> = {
	cross: (size) => (
		<svg
			width={size}
			height={size}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="relative"
			preserveAspectRatio="xMidYMid meet"
		>
			<title>cancel</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.41854 3.41854C3.6016 3.23549 3.8984 3.23549 4.08145 3.41854L11.5814 10.9186C11.7645 11.1016 11.7645 11.3984 11.5814 11.5814C11.3984 11.7645 11.1016 11.7645 10.9186 11.5814L3.41854 4.08145C3.23549 3.8984 3.23549 3.6016 3.41854 3.41854Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.5814 3.41854C11.7645 3.6016 11.7645 3.8984 11.5814 4.08145L4.08146 11.5814C3.8984 11.7645 3.6016 11.7645 3.41855 11.5814C3.23549 11.3984 3.23549 11.1016 3.41854 10.9186L10.9186 3.41854C11.1016 3.23549 11.3984 3.23549 11.5814 3.41854Z"
				fill="currentColor"
			/>
		</svg>
	),
	check: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={(size * 9) / 12}
			fill="none"
			viewBox="0 0 12 9"
		>
			<title>verify</title>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.25"
				d="M.625 4.444 3.702 7.5 10.625.625"
			/>
		</svg>
	),
	notes: (size) => (
		<svg
			width={size}
			height={size}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="flex-grow-0 flex-shrink-0"
			preserveAspectRatio="none"
		>
			<title>notes</title>
			<path
				d="M12.6947 7.90456L13.0183 6.69712C13.3959 5.28771 13.5847 4.583 13.4426 3.97314C13.3303 3.49161 13.0777 3.05417 12.7169 2.71617C12.2598 2.28809 11.5551 2.09927 10.1457 1.72161C8.73625 1.34396 8.0315 1.15513 7.42169 1.29733C6.94012 1.40961 6.50269 1.66216 6.16469 2.02304C5.79818 2.41436 5.60705 2.98723 5.32263 4.02851C5.27487 4.20337 5.22447 4.39146 5.17017 4.59411L4.84661 5.80164C4.46896 7.21106 4.28013 7.91575 4.42233 8.52562C4.53461 9.00719 4.78716 9.44462 5.14804 9.78262C5.60509 10.2107 6.30981 10.3995 7.71925 10.7772C8.98962 11.1176 9.68744 11.3046 10.2594 11.234C10.322 11.2263 10.3831 11.2155 10.4432 11.2014C10.9247 11.0892 11.3622 10.8366 11.7002 10.4757C12.1282 10.0187 12.3171 9.314 12.6947 7.90456Z"
				stroke="currentColor"
				strokeWidth="0.9375"
			/>
			<path
				d="M10.2594 11.2338C10.1291 11.6329 9.89994 11.9939 9.59187 12.2824C9.13481 12.7105 8.43006 12.8993 7.02069 13.277C5.61124 13.6546 4.90652 13.8434 4.29666 13.7013C3.81513 13.589 3.3777 13.3364 3.03969 12.9756C2.61162 12.5185 2.42279 11.8138 2.04514 10.4044L1.72161 9.19694C1.34396 7.7875 1.15513 7.08281 1.29733 6.47294C1.40961 5.99142 1.66216 5.55399 2.02304 5.21598C2.48009 4.78791 3.18481 4.59908 4.59423 4.22143C4.86088 4.14998 5.1023 4.08529 5.32263 4.02832"
				stroke="currentColor"
				strokeWidth="0.9375"
			/>
			<path
				d="M7.36035 6.25L10.3789 7.05881"
				stroke="currentColor"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
			<path
				d="M6.875 8.06091L8.68613 8.54616"
				stroke="currentColor"
				strokeWidth="0.9375"
				strokeLinecap="round"
			/>
		</svg>
	),
	"add-image": (size) => (
		<svg
			width={size}
			height={size}
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="flex-grow-0 flex-shrink-0"
			preserveAspectRatio="none"
		>
			<title>add image</title>
			<path
				d="M8.91544 9.96106L7.84206 8.89662C7.34875 8.40744 7.10206 8.16281 6.81806 8.07106C6.56825 7.99031 6.29937 7.99031 6.04951 8.07106C5.76553 8.16281 5.51886 8.40744 5.02551 8.89662L2.52621 11.4139M8.91544 9.96106L9.12875 9.74944C9.6325 9.24994 9.88431 9.00019 10.1733 8.90906C10.4274 8.82887 10.7005 8.832 10.9527 8.918C11.2395 9.01581 11.4856 9.27125 11.9776 9.78219L12.5 10.3126M8.91544 9.96106L11.3875 12.4767M2.52621 11.4139C2.5454 11.5766 2.57864 11.7044 2.63624 11.8175C2.75608 12.0527 2.94731 12.2439 3.18251 12.3637C3.4499 12.5 3.79993 12.5 4.5 12.5H10.5C10.8883 12.5 11.1689 12.5 11.3875 12.4767M2.52621 11.4139C2.5 11.1916 2.5 10.9041 2.5 10.5V4.5C2.5 3.79994 2.5 3.4499 2.63624 3.18251C2.75608 2.94731 2.94731 2.75608 3.18251 2.63624C3.4499 2.5 3.79993 2.5 4.5 2.5H6.875M11.3875 12.4767C11.5629 12.4581 11.6984 12.4244 11.8175 12.3637C12.0527 12.2439 12.2439 12.0527 12.3637 11.8175C12.5 11.5501 12.5 11.2001 12.5 10.5V8.125M11.25 5.625V3.75M11.25 3.75V1.875M11.25 3.75H13.125M11.25 3.75H9.375"
				stroke="currentColor"
				strokeWidth="1.25"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	"arrow-right": (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
			className="group-hover:translate-x-[2px] motion-macro transition-transform"
		>
			<title>arrow</title>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.667 10H3.334m13.333 0-3.333-3.333M16.667 10l-3.333 3.333"
			/>
		</svg>
	),
	"arrow-left": (size) => (
		<svg
			width={size}
			height={size}
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
	plus: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 15 15"
			className="group-hover:rotate-[900deg] motion-macro transition-transform"
		>
			<title>plus</title>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.25"
				d="M2.5 7.5h10m-5-5v10"
			/>
		</svg>
	),
	camera: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 15 15"
		>
			<title>photo</title>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M7.5 11.25A3.125 3.125 0 1 0 7.5 5a3.125 3.125 0 0 0 0 6.25Zm0-1.245a1.88 1.88 0 1 1 0-3.76 1.88 1.88 0 0 1 0 3.76Z"
				clipRule="evenodd"
			/>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M5.976 1.25c-.86 0-1.61.586-1.819 1.42l-.27 1.08H2.5c-1.036 0-1.875.84-1.875 1.875v6.25c0 1.036.84 1.875 1.875 1.875h10c1.036 0 1.875-.84 1.875-1.875v-6.25c0-1.035-.84-1.875-1.875-1.875h-1.387l-.27-1.08a1.875 1.875 0 0 0-1.819-1.42H5.976ZM5.37 2.973a.625.625 0 0 1 .606-.473h3.048c.287 0 .537.195.606.473l.27 1.08c.14.557.64.947 1.213.947H12.5c.345 0 .625.28.625.625v6.25c0 .345-.28.625-.625.625h-10a.625.625 0 0 1-.625-.625v-6.25c0-.345.28-.625.625-.625h1.387A1.25 1.25 0 0 0 5.1 4.053l.27-1.08Z"
				clipRule="evenodd"
			/>
		</svg>
	),
	instagram: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 20 20"
			fill="none"
		>
			<title>instagram</title>
			<g clipPath="url(#insta)">
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-1.667a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666Z"
					clipRule="evenodd"
				/>
				<path
					fill="currentColor"
					d="M15 4.167a.833.833 0 1 0 0 1.666.833.833 0 0 0 0-1.667Z"
				/>
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M1.378 3.564c-.545 1.07-.545 2.47-.545 5.27v2.333c0 2.8 0 4.2.545 5.27a5 5 0 0 0 2.185 2.185c1.07.545 2.47.545 5.27.545h2.334c2.8 0 4.2 0 5.27-.545a4.998 4.998 0 0 0 2.185-2.185c.545-1.07.545-2.47.545-5.27V8.834c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.186c-1.07-.545-2.47-.545-5.27-.545H8.833c-2.8 0-4.2 0-5.27.545a5 5 0 0 0-2.185 2.186ZM11.167 2.5H8.833c-1.427 0-2.398.001-3.148.063-.73.06-1.104.168-1.365.3-.627.32-1.137.83-1.457 1.457-.132.26-.24.635-.3 1.365-.062.75-.063 1.72-.063 3.149v2.333c0 1.428.001 2.398.063 3.148.06.73.168 1.104.3 1.365.32.627.83 1.137 1.457 1.457.26.133.634.24 1.365.3.75.062 1.72.063 3.148.063h2.334c1.427 0 2.398-.001 3.148-.062.73-.06 1.104-.168 1.365-.301a3.334 3.334 0 0 0 1.457-1.457c.133-.26.24-.634.3-1.365.062-.75.063-1.72.063-3.148V8.834c0-1.428-.001-2.399-.063-3.149-.06-.73-.168-1.104-.3-1.365a3.333 3.333 0 0 0-1.457-1.457c-.26-.132-.634-.24-1.365-.3-.75-.062-1.72-.063-3.148-.063Z"
					clipRule="evenodd"
				/>
			</g>
			<defs>
				<clipPath id="insta">
					<path fill="#fff" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</svg>
	),
	"linked-in": (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
		>
			<title>linked in</title>
			<g clipPath="url(#linkedin)">
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M20 20h-4v-6.999c0-1.92-.847-2.991-2.366-2.991C11.981 10.01 11 11.126 11 13v7H7V7h4v1.462s1.255-2.202 4.083-2.202C17.912 6.26 20 7.986 20 11.558V20ZM2.442 4.92A2.451 2.451 0 0 1 0 2.46 2.451 2.451 0 0 1 2.442 0a2.451 2.451 0 0 1 2.441 2.46 2.45 2.45 0 0 1-2.441 2.46ZM0 20h5V7H0v13Z"
					clipRule="evenodd"
				/>
			</g>
			<defs>
				<clipPath id="linkedin">
					<path fill="#fff" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</svg>
	),
	meta: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
		>
			<title>meta</title>
			<path
				fill="currentColor"
				d="M3.125 12.188c0-2.876 1.438-5.876 3.125-5.876.938 0 1.688.563 2.875 2.25-1.125 1.75-1.813 2.813-1.813 2.813-1.5 2.375-2 2.875-2.812 2.875-.813.063-1.375-.688-1.375-2.063Zm9.813-1.063-1.063-1.75c-.25-.438-.563-.875-.813-1.25.938-1.438 1.688-2.188 2.626-2.188 1.874 0 3.374 2.813 3.374 6.313 0 1.313-.437 2.063-1.312 2.063s-1.188-.563-2.813-3.188Zm-2.688-4.25c-1.375-1.813-2.563-2.5-3.938-2.5-2.875 0-5.062 3.813-5.062 7.813 0 2.5 1.188 4.062 3.188 4.062 1.437 0 2.437-.688 4.312-3.938 0 0 .75-1.374 1.313-2.312.187.313.374.625.562 1l.875 1.5c1.688 2.875 2.625 3.813 4.313 3.813 1.937 0 3-1.625 3-4.188-.063-4.25-2.313-7.75-5-7.75-1.438 0-2.563 1.125-3.563 2.5Z"
			/>
		</svg>
	),
	x: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
		>
			<title>x</title>
			<g clipPath="url(#x-clip)">
				<path
					fill="currentColor"
					d="M11.905 8.468 19.35-.008h-1.764L11.12 7.35 5.956-.008H0L7.809 11.12 0 20.008h1.764l6.827-7.772 5.453 7.772H20M2.4 1.294h2.71L17.587 18.77h-2.71"
				/>
			</g>
			<defs>
				<clipPath id="x-clip">
					<path fill="#fff" d="M0-.008h20v20.017H0z" />
				</clipPath>
			</defs>
		</svg>
	),
	youtube: (size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
		>
			<title>youtube</title>
			<g clipPath="url(#yt-clip)">
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M7.988 12.586V6.974c1.993.938 3.536 1.843 5.36 2.82-1.505.834-3.367 1.77-5.36 2.792Zm11.103-8.403c-.344-.452-.93-.805-1.553-.922-1.833-.348-13.267-.349-15.099 0-.5.094-.945.32-1.328.673C-.5 5.43.005 13.452.393 14.75c.164.563.375.968.64 1.235.343.352.812.594 1.351.703 1.51.312 9.284.486 15.122.046a2.62 2.62 0 0 0 1.39-.71c1.49-1.49 1.388-9.963.195-11.842Z"
					clipRule="evenodd"
				/>
			</g>
			<defs>
				<clipPath id="yt-clip">
					<path fill="#fff" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</svg>
	),
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

function renderIcon(
	icon?: IconProp,
	colorOverride?: "light" | "dark",
	size = DEFAULT_ICON_SIZE,
) {
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
			<span className="inline-flex items-center justify-center">
				{mapped(size)}
			</span>
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
					{renderIcon(leadingIcon, isPrimary ? "light" : "dark", iconSize)}
				</span>
			)}

			{/* children can be anything (text, icon, etc) */}
			{children && (
				<span className="flex min-w-0 items-center">{children}</span>
			)}

			{trailingIcon && (
				<span className="flex items-center justify-center">
					{renderIcon(trailingIcon, isPrimary ? "light" : "dark", iconSize)}
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
