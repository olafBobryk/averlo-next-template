"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";

export type ButtonTone = "default" | "danger";

export type ButtonSize =
	| "none"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "chip"
	| "icon"
	| "icon-sm";

type ButtonBaseProps = {
	align?: "left" | "center" | "between";
	children?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	disabled?: boolean;
	focusable?: boolean;
	href?: string;
	leadingIcon?: React.ReactNode;
	loading?: boolean;
	radius?: "pill" | "sm";
	size?: ButtonSize;
	tone?: ButtonTone;
	trailingIcon?: React.ReactNode;
	variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

const sizeClasses: Record<ButtonSize, string> = {
	none: "",
	lg: "h-11 px-6 text-sm font-semibold",
	xl: "h-12 px-7 text-base font-semibold",
	md: "h-9 px-3 text-sm font-medium",
	sm: "h-8 px-2.5 text-xs font-medium",
	chip: "h-auto px-2 py-1 text-xs font-medium",
	icon: "size-9 p-0 text-sm font-medium",
	"icon-sm": "size-8 p-0 text-sm font-medium",
};

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"border border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
	secondary:
		"border border-transparent bg-input/50 text-foreground hover:bg-input/70",
	ghost:
		"border border-transparent bg-transparent text-foreground hover:bg-muted",
	inverse:
		"border border-transparent bg-foreground text-background hover:bg-foreground/90",
};

function getContentSizeClassName(size: ButtonSize) {
	switch (size) {
		case "none":
		case "icon":
		case "icon-sm":
			return undefined;
		case "chip":
			return "gap-1";
		case "sm":
		case "md":
			return "gap-1.5";
		case "lg":
			return "gap-2";
		case "xl":
			return "gap-2.5";
	}
}

function getButtonClassName({
	align = "center",
	className,
	disabled,
	radius = "pill",
	size = "md",
	tone = "default",
	variant = "secondary",
}: Pick<
	ButtonBaseProps,
	"align" | "className" | "disabled" | "radius" | "size" | "tone" | "variant"
>) {
	return clsx(
		"group relative inline-flex shrink-0 items-center whitespace-nowrap border bg-clip-padding transition-all motion-interactive select-none",
		focusRing.visibleDefault,
		"cursor-pointer active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
		sizeClasses[size ?? "md"],
		variantClasses[variant ?? "secondary"],
		tone === "danger" &&
			"!text-danger focus-visible:!border-danger/40 focus-visible:!ring-danger/20",
		tone === "danger" &&
			(variant === "secondary"
				? "!bg-danger/10 hover:!bg-danger/20"
				: variant === "ghost"
					? "!bg-transparent hover:!bg-danger/10"
					: "!bg-danger/20 hover:!bg-danger/30"),
		radius === "sm" ? "rounded-md" : "rounded-4xl",
		align === "left" && "justify-start text-left",
		align === "center" && "justify-center text-center",
		align === "between" && "justify-between text-left",
		disabled && "cursor-not-allowed",
		className,
	);
}

type ButtonSkeletonProps = Pick<
	ButtonBaseProps,
	"align" | "children" | "className" | "radius" | "size" | "tone" | "variant"
> & { fullWidth?: boolean };

function ButtonSkeleton({
	align,
	children = "Button",
	className,
	fullWidth,
	radius,
	size,
	variant,
}: ButtonSkeletonProps) {
	const resolvedSize = size ?? "md";
	const resolvedRadius = radius === "sm" ? "!rounded-[6px]" : "!rounded-full";
	const resolvedSurface =
		variant === "primary" ? "!bg-primary/20" : "!bg-muted/80";

	return (
		<span
			aria-hidden
			className={clsx(
				"relative inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap border border-transparent",
				sizeClasses[resolvedSize],
				align === "left" && "justify-start text-left",
				(align === undefined || align === "center") &&
					"justify-center text-center",
				align === "between" && "justify-between text-left",
				"pointer-events-none !border-transparent !ring-0",
				fullWidth && "w-full",
				className,
				resolvedRadius,
				resolvedSurface,
			)}
		>
			<span className="contents pointer-events-none select-none opacity-0 [&_*]:pointer-events-none [&_*]:select-none [&_*]:opacity-0">
				<span
					className={clsx(
						"inline-flex min-w-0 items-center justify-center",
						getContentSizeClassName(resolvedSize),
					)}
				>
					{children}
				</span>
			</span>
		</span>
	);
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonProps>(function Button(
	{
		align = "center",
		children,
		className,
		contentClassName,
		disabled = false,
		focusable = true,
		href,
		leadingIcon,
		loading = false,
		radius,
		size = "md",
		tone = "default",
		trailingIcon,
		type,
		variant = "secondary",
		...rest
	},
	ref,
) {
	const isDisabled = disabled || loading;
	const resolvedClassName = getButtonClassName({
		align,
		className,
		disabled: isDisabled,
		radius,
		size,
		tone,
		variant,
	});
	const content = (
		<>
			<span
				className={clsx(
					"inline-flex max-w-full items-center transition-opacity motion-micro",
					getContentSizeClassName(size),
					loading && "opacity-0",
					contentClassName,
				)}
			>
				{leadingIcon}
				{children ? <span className="truncate">{children}</span> : null}
				{trailingIcon}
			</span>
			<span
				aria-hidden
				className={clsx(
					"pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity motion-micro",
					loading && "opacity-100",
				)}
			>
				<span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
			</span>
		</>
	);

	if (href) {
		return (
			<Link
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				aria-disabled={isDisabled || undefined}
				className={resolvedClassName}
				data-loading={loading || undefined}
				tabIndex={isDisabled || !focusable ? -1 : undefined}
				{...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
			>
				{content}
			</Link>
		);
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type={type ?? "button"}
			disabled={isDisabled}
			className={resolvedClassName}
			data-loading={loading || undefined}
			tabIndex={!focusable ? -1 : undefined}
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{content}
		</button>
	);
});

export const Button = Object.assign(ButtonRoot, { Skeleton: ButtonSkeleton });
