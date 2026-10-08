"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Loader } from "@/components/ui/misc/Loader";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Text, type TextProps } from "@/components/ui/primitives/Text";

import {
	type ButtonStyleProps,
	type ButtonTone,
	buttonContentGap,
	buttonGeometry,
	buttonStyles,
} from "./buttonStyles";

type IconConfig = {
	name: IconName;
	mirrorInRtl?: boolean;
};
type IconProp = React.ReactNode | IconName | IconConfig;

export type {
	ButtonShape,
	ButtonSize,
	ButtonTone,
	ButtonVariant,
} from "./buttonStyles";

const DEFAULT_ICON_SIZE = 16;

export type ButtonBaseProps = {
	children?: React.ReactNode;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
	href?: string;
	className?: string;
	contentClassName?: string;
	textVariant?: TextProps["variant"];
	textTone?: TextProps["tone"];
	textClassName?: string;
	style?: React.CSSProperties;
	loading?: boolean;
	iconSize?: number;
	focusable?: boolean;
	disabled?: boolean;
} & Omit<ButtonStyleProps, "align"> & {
		align?: "left" | "center" | "between";
	};

type ButtonElementProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"align" | "href"
> & {
	href?: undefined;
};

type AnchorElementProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"align"
> & {
	href: string;
};

// allow both button + link props without getting too crazy on typing
export type ButtonProps = ButtonBaseProps &
	(ButtonElementProps | AnchorElementProps);

type ButtonElement = HTMLElement;

function getTextToneClassName(tone?: TextProps["tone"]) {
	switch (tone) {
		case "default":
			return "text-foreground";
		case "muted":
			return "text-muted/60";
		default:
			return undefined;
	}
}

function renderIcon(
	icon?: IconProp,
	size = DEFAULT_ICON_SIZE,
	className?: string,
) {
	if (!icon) return null;

	if (typeof icon === "string") {
		return (
			<Icon
				name={icon as IconName}
				animate
				className={className}
				style={{ width: `${size}px`, height: `${size}px` }}
			/>
		);
	}

	if (
		typeof icon === "object" &&
		icon !== null &&
		!React.isValidElement(icon) &&
		"name" in icon
	) {
		return (
			<Icon
				name={icon.name}
				animate
				mirrorInRtl={icon.mirrorInRtl}
				className={className}
				style={{ width: `${size}px`, height: `${size}px` }}
			/>
		);
	}

	return (
		<span
			className={clsx("inline-flex items-center justify-center", className)}
		>
			{icon}
		</span>
	);
}

type ButtonSkeletonProps = {
	children?: React.ReactNode;
	className?: string;
	fullWidth?: boolean;
	leadingIcon?: boolean;
	trailingIcon?: boolean;
	iconSize?: number;
	textVariant?: TextProps["variant"];
	textClassName?: string;
	variant?: ButtonStyleProps["variant"];
	tone?: ButtonTone;
} & ButtonStyleProps;

function ButtonSkeleton({
	children,
	className,
	size,
	shape,
	align,
	radius,
	fullWidth,
	leadingIcon = false,
	trailingIcon = false,
	iconSize,
	textVariant,
	textClassName,
	variant,
}: ButtonSkeletonProps) {
	const label = children ?? "Button";
	const hasLabel = React.Children.count(children) > 0;
	const isIconSize =
		size === "icon" ||
		size === "icon-sm" ||
		shape === "round" ||
		shape === "square";
	const isChipSize = size === "chip";
	const resolvedIconSize =
		iconSize ??
		(isChipSize || size === "xxs" || size === "xs"
			? 12
			: size === "compact"
				? 14
				: DEFAULT_ICON_SIZE);
	const resolvedTextVariant = textVariant ?? (isChipSize ? "chip" : "support");
	const usesCustomTextPresentation =
		textVariant !== undefined || textClassName !== undefined;
	const minWidthClass =
		isIconSize || fullWidth || hasLabel ? undefined : "min-w-[140px]";
	const iconStyle = {
		width: `${resolvedIconSize}px`,
		height: `${resolvedIconSize}px`,
	};
	const isTransparentVariant =
		variant === "bare" || variant === "ghost" || variant === "link";
	const Placeholder = isTransparentVariant ? "span" : Skeleton;
	const isTextChild = typeof label === "string" || typeof label === "number";

	return (
		<Placeholder
			aria-hidden
			className={clsx(
				buttonGeometry({
					size,
					shape,
					align,
					radius,
				}),
				minWidthClass,
				"inline-flex shrink-0 items-center whitespace-nowrap pointer-events-none border-0",
				fullWidth && "w-full",
				radius === "pill" || (!radius && shape === "round")
					? "!rounded-full"
					: "!rounded-[var(--button-radius)]",
				isTransparentVariant && "bg-transparent",
				className,
			)}
		>
			<span
				className={clsx(
					"relative inline-flex items-center justify-center",
					buttonContentGap(size ?? "md"),
				)}
				style={isIconSize ? iconStyle : undefined}
			>
				{isTransparentVariant ? (
					<Skeleton
						as="span"
						className={clsx(
							"!absolute inset-x-0 top-1/2 -translate-y-1/2",
							isIconSize ? "h-full" : "h-[0.8em]",
						)}
					/>
				) : null}
				{leadingIcon ? (
					<span
						className="inline-flex items-center justify-center"
						style={iconStyle}
					/>
				) : null}
				{isIconSize ? null : isTextChild && usesCustomTextPresentation ? (
					<Text
						as="span"
						variant={resolvedTextVariant}
						style={{ color: "inherit" }}
						className={clsx("opacity-0 select-none", textClassName)}
					>
						{label}
					</Text>
				) : (
					<span className="truncate opacity-0 select-none">{label}</span>
				)}
				{trailingIcon ? (
					<span
						className="inline-flex items-center justify-center"
						style={iconStyle}
					/>
				) : null}
			</span>
		</Placeholder>
	);
}

const ButtonRoot = React.forwardRef<ButtonElement, ButtonProps>(
	function ButtonRoot(props, ref) {
		const {
			children,
			leadingIcon,
			trailingIcon,
			href,
			className,
			contentClassName,
			textVariant,
			textTone,
			textClassName,
			style,
			variant = "secondary",
			tone = "default",
			size = "md",
			shape = "standard",
			align = "center",
			radius,
			hitArea,
			loading,
			iconSize,
			focusable = true,
			...rest
		} = props;

		const resolvedIconSize =
			iconSize ??
			(size === "xxs" || size === "xs" || size === "chip"
				? 12
				: size === "compact"
					? 14
					: DEFAULT_ICON_SIZE);

		const isDisabled = Boolean(
			(rest as { disabled?: boolean }).disabled || loading,
		);
		const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
		const loadingState =
			loading === undefined ? undefined : loading ? "true" : "false";

		const mergedClassName = clsx(
			buttonStyles({ variant, tone, size, shape, align, radius, hitArea }),
			className,
		);

		const contentAlignClass =
			align === "center"
				? "justify-center text-center"
				: align === "between"
					? "justify-between text-left"
					: "justify-start text-left";
		const contentWidthClass =
			align === "between" || align === "center" ? "w-full" : "w-fit";
		const isTextChild =
			typeof children === "string" || typeof children === "number";
		const usesCustomTextPresentation =
			textVariant !== undefined ||
			textTone !== undefined ||
			textClassName !== undefined;
		const textToneClassName = getTextToneClassName(textTone);
		const resolvedTextVariant =
			textVariant ?? (size === "chip" ? "chip" : "body");
		const content = (
			<>
				<span
					className={clsx(
						"inline-flex max-w-full items-center transition-opacity motion-micro group-data-[loading=true]:opacity-0",
						buttonContentGap(size ?? "md"),
						contentAlignClass,
						contentWidthClass,
						contentClassName,
					)}
				>
					{leadingIcon && (
						<span className="flex items-center justify-center">
							{renderIcon(leadingIcon, resolvedIconSize, textToneClassName)}
						</span>
					)}

					{/* children can be anything (text, icon, etc) */}
					{children != null ? (
						isTextChild && usesCustomTextPresentation ? (
							<Text
								as="span"
								variant={resolvedTextVariant}
								tone={textTone}
								style={textTone ? undefined : { color: "inherit" }}
								className={textClassName}
							>
								{children}
							</Text>
						) : isTextChild ? (
							<span className="truncate">{children}</span>
						) : (
							children
						)
					) : null}

					{trailingIcon && (
						<span className="flex items-center justify-center">
							{renderIcon(trailingIcon, resolvedIconSize, textToneClassName)}
						</span>
					)}
				</span>
				{loadingState !== undefined && (
					<span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity motion-micro pointer-events-none group-data-[loading=true]:opacity-100">
						<Loader />
					</span>
				)}
			</>
		);

		if (href) {
			// Link-style button
			const { onClick, ...linkRest } =
				rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
			const handleDisabledClick: React.MouseEventHandler<HTMLAnchorElement> = (
				event,
			) => {
				if (isDisabled) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				onClick?.(event);
			};

			return (
				<Link
					{...linkRest}
					href={href}
					className={mergedClassName}
					style={style}
					ref={ref as React.Ref<HTMLAnchorElement>}
					aria-disabled={isDisabled || undefined}
					tabIndex={isDisabled ? -1 : focusable ? linkRest.tabIndex : -1}
					aria-busy={loading || undefined}
					data-loading={loadingState}
					data-disabled={isDisabled ? "true" : undefined}
					onClick={handleDisabledClick}
				>
					{content}
				</Link>
			);
		}

		// Regular button
		return (
			<button
				{...buttonRest}
				type={buttonRest.type ?? "button"}
				className={mergedClassName}
				style={style}
				ref={ref as React.Ref<HTMLButtonElement>}
				disabled={isDisabled}
				tabIndex={isDisabled ? undefined : focusable ? buttonRest.tabIndex : -1}
				aria-busy={loading || undefined}
				data-loading={loadingState}
				data-disabled={isDisabled ? "true" : undefined}
			>
				{content}
			</button>
		);
	},
);

export const Button = Object.assign(ButtonRoot, { Skeleton: ButtonSkeleton });
