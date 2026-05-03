"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Loader } from "@/components/ui/misc/Loader";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Text, type TextProps } from "@/components/ui/primitives/Text";

type IconProp = React.ReactNode | IconName;

const buttonStyles = cva(
	[
		// layout
		"relative inline-flex items-center justify-center gap-2.5",
		"whitespace-nowrap",

		// motion
		"transition-all motion-interactive",

		// focus / disabled
		focusRing.visibleDefault,
		"disabled:opacity-50",

		// subtle interaction
		"hover:-translate-y-[0.0625rem] active:translate-y-[0rem] active:scale-[0.98] disabled:hover:-translate-y-0 disabled:active:scale-100",

		// tailwind helpers
		"group",

		// cursor
		"cursor-pointer disabled:cursor-not-allowed",
	].join(" "),
	{
		variants: {
			variant: {
				outline:
					"border border-border bg-background text-background text-foreground hover:bg-background-hover active:bg-background-active disabled:hover:bg-background disabled:active:bg-background",
				primary:
					"bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border border-transparent disabled:hover:bg-primary disabled:active:bg-primary",
				danger:
					"bg-danger text-white hover:bg-danger/90 active:bg-danger/80 border border-transparent disabled:hover:bg-danger disabled:active:bg-danger",
				primaryDark:
					"bg-foreground text-background hover:bg-foreground-hover active:bg-foreground-active border border-transparent",
				solid:
					"border! border-border! bg-white/70 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:bg-white active:bg-[#F3F3F3]",
				ghost:
					"border-0 bg-transparent !p-0 text-foreground hover:text-foreground/85 active:text-foreground/70 hover:bg-transparent hover:translate-y-0 hover:scale-100 active:translate-y-0 active:!scale-100",
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
				between: "justify-between",
			},
			radius: {
				pill: "rounded-[6.25rem]",
				sm: "rounded-[6px]",
			},
		},
		defaultVariants: {
			variant: "outline",
			size: "md",
			align: "left",
			radius: "pill",
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
	contentClassName?: string;
	textVariant?: TextProps["variant"];
	textTone?: TextProps["tone"];
	textClassName?: string;
	style?: React.CSSProperties;
	loading?: boolean;
	iconSize?: number;
	focusable?: boolean;
	disabled?: boolean;
} & Omit<VariantProps<typeof buttonStyles>, "align"> & {
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

function getDisabledClassName(variant: ButtonBaseProps["variant"]) {
	const disabledBase =
		"!cursor-not-allowed opacity-50 hover:!translate-y-0 active:!translate-y-0 active:!scale-100";

	switch (variant) {
		case "primary":
			return clsx(disabledBase, "hover:!bg-primary active:!bg-primary");
		case "danger":
			return clsx(disabledBase, "hover:!bg-danger active:!bg-danger");
		case "primaryDark":
			return clsx(disabledBase, "hover:!bg-foreground active:!bg-foreground");
		case "solid":
			return clsx(disabledBase, "hover:!bg-background active:!bg-background");
		case "ghost":
			return clsx(
				disabledBase,
				"hover:!bg-transparent hover:!text-foreground active:!text-foreground",
			);
		default:
			return clsx(disabledBase, "hover:!bg-background active:!bg-background");
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
				// className={animatedIconClassMap[icon as IconName]}
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
	variant?: VariantProps<typeof buttonStyles>["variant"];
} & VariantProps<typeof buttonSkeletonStyles>;

const buttonSkeletonStyles = cva(
	["inline-flex items-center justify-center gap-2.5", "whitespace-nowrap"].join(
		" ",
	),
	{
		variants: {
			size: {
				lg: "px-6 py-3 text-sm font-semibold",
				xl: "px-7 py-3.5 text-base font-semibold",
				md: "px-5 py-2.5 text-sm font-medium",
				sm: "px-2.5 py-[5px] text-xs font-medium",
				icon: "min-w-[2.4375rem] min-h-[2.4375rem] h-[2.4375rem] w-[2.4375rem] px-0 py-0",
				"icon-sm":
					"min-w-[1.5625rem] min-h-[1.5625rem] h-[1.5625rem] w-[1.5625rem] px-0 py-0",
			},
			align: {
				left: "justify-start",
				center: "justify-center",
				between: "justify-between",
			},
			radius: {
				pill: "rounded-[6.25rem]",
				sm: "rounded-[6px]",
			},
			fullWidth: {
				true: "w-full",
			},
		},
		defaultVariants: {
			size: "md",
			align: "center",
			radius: "pill",
		},
	},
);

function ButtonSkeleton({
	children,
	className,
	size,
	align,
	radius,
	fullWidth,
	leadingIcon = false,
	trailingIcon = false,
	iconSize = DEFAULT_ICON_SIZE,
	textVariant = "body",
	textClassName,
	variant,
}: ButtonSkeletonProps) {
	const label = children ?? "Button";
	if (variant === "ghost") {
		return (
			<Text.Skeleton
				variant={textVariant}
				className={clsx(className, textClassName)}
			>
				{label}
			</Text.Skeleton>
		);
	}

	const hasLabel = React.Children.count(children) > 0;
	const isIconSize = size === "icon" || size === "icon-sm";
	const minWidthClass =
		isIconSize || fullWidth || hasLabel ? undefined : "min-w-[140px]";
	const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };
	const isTextChild = typeof label === "string" || typeof label === "number";

	return (
		<Skeleton
			className={clsx(
				buttonSkeletonStyles({
					size,
					align,
					radius,
					fullWidth: fullWidth ? true : undefined,
				}),
				minWidthClass,
				"pointer-events-none",
				className,
			)}
		>
			<span className="inline-flex items-center justify-center gap-2.5">
				{leadingIcon ? (
					<span
						className="inline-flex items-center justify-center"
						style={iconStyle}
					/>
				) : null}
				{isIconSize ? null : isTextChild ? (
					<Text
						as="span"
						variant={textVariant}
						style={{ color: "inherit" }}
						className={clsx("opacity-0 select-none", textClassName)}
					>
						{label}
					</Text>
				) : (
					<span className="opacity-0 select-none">{label}</span>
				)}
				{trailingIcon ? (
					<span
						className="inline-flex items-center justify-center"
						style={iconStyle}
					/>
				) : null}
			</span>
		</Skeleton>
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
			textVariant = "body",
			textTone,
			textClassName,
			style,
			variant = "outline",
			size = "md",
			align = "center",
			radius,
			loading,
			iconSize = DEFAULT_ICON_SIZE,
			focusable = true,
			...rest
		} = props;

		const isDisabled = Boolean(
			(rest as { disabled?: boolean }).disabled || loading,
		);
		const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
		const loadingState =
			loading === undefined ? undefined : loading ? "true" : "false";

		const mergedClassName = clsx(
			buttonStyles({ variant, size, align, radius }),
			variant === "outline"
				? "drop-shadow-[2px_4px_15px_rgba(2,2,2,0.03)]"
				: variant === "ghost"
					? undefined
					: "shadow-[2px_4px_15px_0_rgba(2,2,2,0.03)]",
			isDisabled && getDisabledClassName(variant),
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
		const textToneClassName = getTextToneClassName(textTone);
		const content = (
			<>
				<span
					className={clsx(
						"inline-flex max-w-full items-center gap-2.5 transition-opacity motion-micro group-data-[loading=true]:opacity-0",
						contentAlignClass,
						contentWidthClass,
						contentClassName,
					)}
				>
					{leadingIcon && (
						<span className="flex items-center justify-center">
							{renderIcon(leadingIcon, iconSize, textToneClassName)}
						</span>
					)}

					{/* children can be anything (text, icon, etc) */}
					{children != null ? (
						isTextChild ? (
							<Text
								as="span"
								variant={textVariant}
								tone={textTone}
								style={textTone ? undefined : { color: "inherit" }}
								className={textClassName}
							>
								{children}
							</Text>
						) : (
							children
						)
					) : null}

					{trailingIcon && (
						<span className="flex items-center justify-center">
							{renderIcon(trailingIcon, iconSize, textToneClassName)}
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
					href={href}
					className={mergedClassName}
					style={style}
					ref={ref as React.Ref<HTMLAnchorElement>}
					aria-disabled={isDisabled || undefined}
					tabIndex={isDisabled ? -1 : focusable ? linkRest.tabIndex : -1}
					data-loading={loadingState}
					data-disabled={isDisabled ? "true" : undefined}
					onClick={handleDisabledClick}
					{...linkRest}
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
				style={style}
				ref={ref as React.Ref<HTMLButtonElement>}
				disabled={isDisabled}
				tabIndex={isDisabled ? undefined : focusable ? buttonRest.tabIndex : -1}
				data-loading={loadingState}
				data-disabled={isDisabled ? "true" : undefined}
				{...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{content}
			</button>
		);
	},
);

export const Button = Object.assign(ButtonRoot, { Skeleton: ButtonSkeleton });
