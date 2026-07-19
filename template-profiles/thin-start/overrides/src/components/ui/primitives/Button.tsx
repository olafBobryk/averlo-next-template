"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";

export type ButtonVariant =
	| "default"
	| "danger"
	| "solid"
	| "ghost"
	| "primary"
	| "primaryDark"
	| "outline";

type ButtonBaseProps = {
	align?: "left" | "center" | "between";
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	href?: string;
	leadingIcon?: React.ReactNode;
	loading?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "icon" | "icon-sm";
	trailingIcon?: React.ReactNode;
	variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

function getButtonClassName({
	className,
	disabled,
	loading,
	variant = "default",
}: Pick<ButtonBaseProps, "className" | "disabled" | "loading" | "variant">) {
	return clsx(
		"inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
		focusRing.visibleDefault,
		"disabled:pointer-events-none disabled:opacity-50",
		loading && "pointer-events-none opacity-70",
		(variant === "default" ||
			variant === "primary" ||
			variant === "primaryDark") &&
			"bg-primary text-primary-foreground hover:bg-primary-hover",
		variant === "danger" && "bg-danger text-white hover:bg-danger/90",
		(variant === "solid" || variant === "outline") &&
			"border border-border bg-foreground text-background hover:bg-foreground-hover",
		variant === "ghost" &&
			"bg-transparent px-2 text-foreground hover:bg-background-hover",
		disabled && "cursor-not-allowed",
		className,
	);
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
	function Button(
		{
			children,
			className,
			disabled = false,
			href,
			leadingIcon,
			loading = false,
			size: _size,
			trailingIcon,
			type,
			variant = "default",
			align: _align,
			...rest
		},
		ref,
	) {
		const content = (
			<>
				{loading ? <span aria-hidden="true">...</span> : leadingIcon}
				{children ? <span className="truncate">{children}</span> : null}
				{trailingIcon}
			</>
		);
		const resolvedClassName = getButtonClassName({
			className,
			disabled,
			loading,
			variant,
		});

		if (href) {
			return (
				<Link
					ref={ref as React.Ref<HTMLAnchorElement>}
					href={href}
					aria-disabled={disabled || loading}
					className={resolvedClassName}
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
				disabled={disabled || loading}
				className={resolvedClassName}
				{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{content}
			</button>
		);
	},
);
