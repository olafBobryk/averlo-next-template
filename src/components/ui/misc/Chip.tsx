"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Text } from "@/components/ui/primitives/Text";

type IconProp = React.ReactNode | IconName;

export type ChipTone =
	| "plain"
	| "neutral"
	| "primary"
	| "success"
	| "warning"
	| "danger"
	| "helper";

export type ChipProps = {
	children: React.ReactNode;
	href?: string | null;
	disabled?: boolean;
	tone?: ChipTone;
	helperIndex?: number;
	color?: string | null;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
	className?: string;
	contentClassName?: string;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLElement>;
	title?: string;
} & Omit<
	React.HTMLAttributes<HTMLElement>,
	"children" | "className" | "color" | "onClick" | "style" | "title"
>;

type ChipStyle = React.CSSProperties & {
	"--chip-accent"?: string;
	"--chip-color"?: string;
};

export type ChipSkeletonProps = {
	children?: React.ReactNode;
	leadingIcon?: boolean;
	trailingIcon?: boolean;
	iconSize?: number;
	className?: string;
	contentClassName?: string;
};

export const chipCanvasTokens = {
	backgroundColor: "rgba(255,255,255,0.86)",
	mutedBackgroundColor: "rgba(255,255,255,0.56)",
	borderColor: "rgba(15,23,42,0.14)",
	mutedBorderColor: "rgba(15,23,42,0.09)",
	borderWidth: 1,
	fontFamily: "Geist, Arial, sans-serif",
	fontWeight: 500,
	labelGap: 10,
	paddingX: 10,
	paddingY: 4,
	textColor: "#111827",
	mutedTextColor: "rgba(17,24,39,0.58)",
} as const;

export function getChipCanvasMetrics(textHeight: number) {
	const height =
		textHeight +
		chipCanvasTokens.paddingY * 2 +
		chipCanvasTokens.borderWidth * 2;

	return {
		borderRadius: height / 2,
		height,
		padding: [chipCanvasTokens.paddingX, chipCanvasTokens.paddingY] as [
			number,
			number,
		],
	};
}

const HELPER_PALETTE_SIZE = 8;

const chipColorTokenValues: Record<string, string> = {
	berry: "var(--app-berry)",
	danger: "var(--danger)",
	info: "var(--primary)",
	lime: "var(--app-lime)",
	orange: "var(--app-orange)",
	primary: "var(--primary)",
	purple: "var(--app-purple)",
	rose: "var(--app-rose)",
	success: "var(--success)",
	violet: "var(--app-violet)",
	warning: "var(--warning)",
};

const toneClasses: Record<ChipTone, string> = {
	plain: "border-border bg-background text-foreground",
	neutral: "border-border bg-background/80 text-foreground/80",
	primary:
		"border-primary/25 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-background))] text-primary",
	success:
		"border-success/25 bg-[color-mix(in_srgb,var(--color-success)_8%,var(--color-background))] text-success",
	warning:
		"border-warning/25 bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-background))] text-warning",
	danger:
		"border-danger/25 bg-[color-mix(in_srgb,var(--color-danger)_8%,var(--color-background))] text-danger",
	helper:
		"border-[color:var(--chip-accent)] bg-[color-mix(in_srgb,var(--chip-accent)_12%,var(--color-background))] text-[color:var(--chip-accent)]",
};

function normalizeHelperIndex(index: number) {
	if (!Number.isFinite(index)) return 0;
	return Math.abs(Math.trunc(index)) % HELPER_PALETTE_SIZE;
}

function resolveChipColor(color?: string | null) {
	const normalized = color?.trim().toLowerCase();
	if (!normalized) return null;
	if (normalized === "neutral" || normalized === "muted") return "muted";
	const tokenValue = chipColorTokenValues[normalized];
	if (tokenValue) return tokenValue;
	return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : null;
}

function renderIcon(icon?: IconProp) {
	if (!icon) return null;
	if (typeof icon === "string") {
		return <Icon name={icon as IconName} size="sm" />;
	}
	return <span className="inline-flex shrink-0 items-center">{icon}</span>;
}

function chipClassName(
	disabled?: boolean,
	tone: ChipTone = "neutral",
	className?: string,
	customColor?: string | null,
) {
	return clsx(
		"inline-flex min-w-0 max-w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 transition-colors motion-interactive",
		customColor === "muted"
			? "border-border bg-muted text-muted-foreground"
			: customColor
				? "[border-color:color-mix(in_oklch,var(--chip-color)_25%,transparent)] [background-color:color-mix(in_oklch,var(--chip-color)_10%,transparent)] text-[var(--chip-color)]"
				: toneClasses[tone],
		disabled
			? "cursor-not-allowed opacity-50"
			: "hover:border-foreground/20 hover:bg-background-hover hover:text-foreground",
		focusRing.visibleDefault,
		className,
	);
}

function chipSkeletonClassName(className?: string) {
	return clsx(
		"inline-flex min-w-0 max-w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1",
		"pointer-events-none border-transparent !bg-muted/80",
		className,
	);
}

export type ChipTextProps = Omit<
	React.ComponentPropsWithoutRef<typeof Text>,
	"as" | "interactive" | "tone" | "variant"
>;

export function ChipText({ className, ...props }: ChipTextProps) {
	return (
		<Text
			as="span"
			className={className}
			interactive={false}
			tone="inherit"
			variant="chip"
			{...props}
		/>
	);
}

function ChipSkeleton({
	children,
	leadingIcon = false,
	trailingIcon = false,
	iconSize = 14,
	className,
	contentClassName,
}: ChipSkeletonProps) {
	const label = children ?? "Chip";
	const isTextChild = typeof label === "string" || typeof label === "number";
	const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };

	return (
		<Skeleton className={chipSkeletonClassName(className)} aria-hidden="true">
			<span className="inline-flex min-w-0 items-center justify-center gap-1.5">
				{leadingIcon ? (
					<span
						className="inline-flex shrink-0 items-center justify-center"
						style={iconStyle}
					/>
				) : null}
				{isTextChild ? (
					<span
						className={clsx(
							"min-w-0 truncate text-xs font-medium opacity-0 select-none",
							contentClassName,
						)}
					>
						{label}
					</span>
				) : (
					<span className="opacity-0 select-none">{label}</span>
				)}
				{trailingIcon ? (
					<span
						className="inline-flex shrink-0 items-center justify-center"
						style={iconStyle}
					/>
				) : null}
			</span>
		</Skeleton>
	);
}

const ChipRoot = React.forwardRef<HTMLElement, ChipProps>(function Chip(
	{
		children,
		color,
		href,
		disabled,
		tone = "neutral",
		helperIndex = 0,
		leadingIcon,
		trailingIcon,
		className,
		contentClassName,
		style,
		onClick,
		title,
		...rest
	},
	ref,
) {
	const helperStyle: ChipStyle | undefined =
		tone === "helper"
			? {
					"--chip-accent": `var(--color-helper-${normalizeHelperIndex(helperIndex)})`,
				}
			: undefined;
	const resolvedStyle = helperStyle ? { ...helperStyle, ...style } : style;
	const resolvedColor = resolveChipColor(color);
	const colorStyle: ChipStyle =
		resolvedColor && resolvedColor !== "muted"
			? { "--chip-accent": resolvedColor, "--chip-color": resolvedColor }
			: {};
	const mergedStyle = { ...colorStyle, ...resolvedStyle };
	const content = (
		<>
			{renderIcon(leadingIcon)}
			<span
				className={clsx(
					"min-w-0 truncate text-xs font-medium",
					contentClassName,
				)}
			>
				{children}
			</span>
			{renderIcon(trailingIcon)}
		</>
	);

	if (href && !disabled) {
		return (
			<Link
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				className={chipClassName(disabled, tone, className, resolvedColor)}
				style={mergedStyle}
				title={title}
				{...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{content}
			</Link>
		);
	}

	if (onClick) {
		return (
			<button
				ref={ref as React.Ref<HTMLButtonElement>}
				type="button"
				disabled={disabled}
				onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
				className={chipClassName(disabled, tone, className, resolvedColor)}
				style={mergedStyle}
				title={title}
				{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{content}
			</button>
		);
	}

	return (
		<span
			ref={ref as React.Ref<HTMLSpanElement>}
			className={chipClassName(disabled, tone, className, resolvedColor)}
			style={mergedStyle}
			title={title}
			{...(rest as React.HTMLAttributes<HTMLSpanElement>)}
		>
			{content}
		</span>
	);
});

export const Chip = Object.assign(ChipRoot, {
	Skeleton: ChipSkeleton,
	Text: ChipText,
});
