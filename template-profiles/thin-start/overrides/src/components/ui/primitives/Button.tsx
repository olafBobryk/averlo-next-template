"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import {
	type ButtonShape,
	type ButtonSize,
	type ButtonTone,
	type ButtonVariant,
	buttonContentGap,
	buttonGeometry,
	buttonStyles,
} from "./buttonStyles";

export type {
	ButtonShape,
	ButtonSize,
	ButtonTone,
	ButtonVariant,
} from "./buttonStyles";

export type ButtonBaseProps = {
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
	shape?: ButtonShape;
	tone?: ButtonTone;
	trailingIcon?: React.ReactNode;
	variant?: ButtonVariant;
};

type ButtonElementProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"align" | "href"
> & { href?: undefined };

type AnchorElementProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"align"
> & { href: string };

export type ButtonProps = ButtonBaseProps &
	(ButtonElementProps | AnchorElementProps);

type ButtonSkeletonProps = Pick<
	ButtonBaseProps,
	| "align"
	| "children"
	| "className"
	| "radius"
	| "size"
	| "shape"
	| "tone"
	| "variant"
> & { fullWidth?: boolean };

function ButtonSkeleton({
	align,
	children = "Button",
	className,
	fullWidth,
	radius,
	size,
	shape,
	variant,
}: ButtonSkeletonProps) {
	const resolvedSize = size ?? "md";
	const resolvedRadius =
		radius === "pill" || (!radius && shape === "round")
			? "!rounded-full"
			: "!rounded-[var(--button-radius)]";
	const transparent =
		variant === "bare" || variant === "ghost" || variant === "link";
	const iconOnly =
		size === "icon" ||
		size === "icon-sm" ||
		shape === "round" ||
		shape === "square";
	const resolvedSurface = transparent ? "bg-transparent" : "bg-muted/80";

	return (
		<span
			aria-hidden
			className={clsx(
				"relative inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap border-0",
				buttonGeometry({ size: resolvedSize, shape, radius, align }),
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
			<span className="relative inline-flex items-center justify-center">
				{transparent ? (
					<span
						className={clsx(
							"absolute top-1/2 -translate-y-1/2 rounded-md bg-muted/80",
							iconOnly ? "size-4" : "inset-x-0 h-[0.8em]",
						)}
					/>
				) : null}
				<span className={clsx("invisible", iconOnly && "size-4")}>
					<span
						className={clsx(
							"inline-flex min-w-0 items-center justify-center",
							buttonContentGap(resolvedSize),
						)}
					>
						{iconOnly ? null : children}
					</span>
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
		shape,
		tone = "default",
		trailingIcon,
		type,
		variant = "secondary",
		...rest
	},
	ref,
) {
	const isDisabled = disabled || loading;
	const resolvedClassName = clsx(
		buttonStyles({ align, radius, size, shape, tone, variant }),
		className,
	);
	const content = (
		<>
			<span
				className={clsx(
					"inline-flex max-w-full items-center transition-opacity motion-micro",
					buttonContentGap(size),
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
				<span className="size-4 motion-reduce:animate-none animate-spin rounded-full border-2 border-current border-r-transparent" />
			</span>
		</>
	);

	if (href) {
		return (
			<Link
				{...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
				onClick={(event) => {
					if (isDisabled) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>).onClick?.(
						event,
					);
				}}
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				aria-disabled={isDisabled || undefined}
				className={resolvedClassName}
				data-loading={loading || undefined}
				aria-busy={loading || undefined}
				data-disabled={isDisabled || undefined}
				tabIndex={isDisabled || !focusable ? -1 : undefined}
			>
				{content}
			</Link>
		);
	}

	return (
		<button
			{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			ref={ref as React.Ref<HTMLButtonElement>}
			type={
				(type as React.ButtonHTMLAttributes<HTMLButtonElement>["type"]) ??
				"button"
			}
			disabled={isDisabled}
			className={resolvedClassName}
			data-loading={loading || undefined}
			aria-busy={loading || undefined}
			data-disabled={isDisabled || undefined}
			tabIndex={!focusable ? -1 : undefined}
		>
			{content}
		</button>
	);
});

export const Button = Object.assign(ButtonRoot, { Skeleton: ButtonSkeleton });
