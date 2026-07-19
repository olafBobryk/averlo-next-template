"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";

export type ButtonVariant =
	| "card"
	| "danger"
	| "default"
	| "ghost"
	| "outline"
	| "primary"
	| "primaryDark"
	| "primarySoft"
	| "quiet"
	| "secondary"
	| "solid";

export type ButtonSize =
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
	trailingIcon?: React.ReactNode;
	variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

const sizeClasses: Record<ButtonSize, string> = {
	lg: "px-6 py-3 text-sm font-semibold",
	xl: "px-7 py-3.5 text-base font-semibold",
	md: "px-5 py-2.5 text-sm font-medium",
	sm: "px-2.5 py-[5px] text-xs font-medium",
	chip: "h-auto gap-1 px-2 py-1 text-xs font-medium",
	icon: "size-[2.4375rem] p-0",
	"icon-sm": "size-[1.5625rem] p-0",
};

const variantClasses: Record<ButtonVariant, string> = {
	card: "h-auto rounded-md border border-dashed border-foreground/20 bg-card text-card-foreground hover:bg-muted/30",
	danger:
		"border border-transparent bg-danger text-white hover:bg-danger/90 active:bg-danger/80",
	default:
		"border border-transparent bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
	ghost:
		"border-0 bg-transparent !p-0 text-foreground hover:text-foreground/80 hover:translate-y-0 active:scale-100",
	outline:
		"border border-border bg-background text-foreground hover:bg-background-hover active:bg-background-active",
	primary:
		"border border-transparent bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
	primaryDark:
		"border border-transparent bg-foreground text-background hover:bg-foreground-hover active:bg-foreground-active",
	primarySoft:
		"border border-transparent bg-primary/10 text-primary hover:bg-primary/15",
	quiet:
		"border border-transparent bg-transparent text-foreground opacity-60 hover:opacity-100",
	secondary:
		"border border-transparent bg-input/50 text-foreground hover:bg-input/70",
	solid:
		"border border-border bg-surface text-foreground shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:bg-background-hover",
};

function getButtonClassName({
	align = "center",
	className,
	disabled,
	radius = "pill",
	size = "md",
	variant = "outline",
}: Pick<
	ButtonBaseProps,
	"align" | "className" | "disabled" | "radius" | "size" | "variant"
>) {
	return clsx(
		"group relative inline-flex items-center gap-2.5 whitespace-nowrap transition-all motion-interactive",
		focusRing.visibleDefault,
		"cursor-pointer hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100",
		sizeClasses[size ?? "md"],
		variantClasses[variant ?? "outline"],
		radius === "sm" ? "rounded-md" : "rounded-full",
		align === "left" && "justify-start text-left",
		align === "center" && "justify-center text-center",
		align === "between" && "justify-between text-left",
		disabled && "cursor-not-allowed",
		className,
	);
}

type ButtonSkeletonProps = Pick<
	ButtonBaseProps,
	"align" | "children" | "className" | "radius" | "size" | "variant"
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
	return (
		<span
			aria-hidden
			className={clsx(
				getButtonClassName({ align, radius, size, variant }),
				"pointer-events-none border-transparent !bg-muted/80 !text-transparent shadow-none",
				fullWidth && "w-full",
				className,
			)}
		>
			<span className="select-none opacity-0">{children}</span>
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
		trailingIcon,
		type,
		variant = "outline",
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
		variant,
	});
	const content = (
		<>
			<span
				className={clsx(
					"inline-flex max-w-full items-center gap-2.5 transition-opacity motion-micro",
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
