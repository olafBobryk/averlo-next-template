"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { Loader } from "@/components/ui/misc/Loader";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { iconMap } from "@/components/ui/icons/iconMap";
import { Text } from "@/components/ui/primitives/Text";

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
		"relative inline-flex items-center justify-center gap-2.5",
		"whitespace-nowrap",

		// motion
		"transition-all motion-interactive",

		// focus / disabled
		focusRing.visibleDefault,
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
					"border border-border/15 bg-background text-foreground hover:bg-background-hover active:bg-background-active",
				primary:
					"bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border border-transparent",
				danger:
					"bg-danger text-white hover:bg-danger/90 active:bg-danger/80 border border-transparent",
				primaryDark:
					"bg-foreground text-background hover:bg-foreground-hover active:bg-foreground-active border border-transparent",
				solid:
					"bg-border/5 text-foreground hover:bg-border/10 border border-transparent",
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
	style?: React.CSSProperties;
	loading?: boolean;
	iconSize?: number;
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
type ButtonProps = ButtonBaseProps & (ButtonElementProps | AnchorElementProps);

type ButtonElement = HTMLElement;

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

type ButtonSkeletonProps = {
	children?: React.ReactNode;
	className?: string;
	fullWidth?: boolean;
	leadingIcon?: boolean;
	trailingIcon?: boolean;
	iconSize?: number;
} & VariantProps<typeof buttonSkeletonStyles>;

const buttonSkeletonStyles = cva(
	[
		"inline-flex items-center justify-center gap-2.5",
		"whitespace-nowrap",
	].join(" "),
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
}: ButtonSkeletonProps) {
	const hasLabel = React.Children.count(children) > 0;
	const isIconSize = size === "icon" || size === "icon-sm";
	const minWidthClass =
		isIconSize || fullWidth || hasLabel ? undefined : "min-w-[140px]";
	const iconStyle = { width: `${iconSize}px`, height: `${iconSize}px` };
	const label = children ?? "Button";

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
				{isIconSize ? null : (
					<Text as="span" variant="body" className="opacity-0 select-none">
						{label}
					</Text>
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
			style,
			variant = "outline",
			size = "md",
			align = "center",
			radius,
			loading,
			iconSize = DEFAULT_ICON_SIZE,
			...rest
		} = props;

		const isDisabled = Boolean(
			(rest as { disabled?: boolean }).disabled || loading,
		);
		const loadingState =
			loading === undefined ? undefined : loading ? "true" : "false";

		const mergedClassName = clsx(
			buttonStyles({ variant, size, align, radius }),
			variant === "outline"
				? "drop-shadow-[2px_4px_15px_rgba(2,2,2,0.03)]"
				: variant === "ghost"
					? undefined
					: "shadow-[2px_4px_15px_0_rgba(2,2,2,0.03)]",
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
					tabIndex={isDisabled ? -1 : undefined}
					data-loading={loadingState}
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
				data-loading={loadingState}
				{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{content}
			</button>
		);
	},
);

export const Button = Object.assign(ButtonRoot, { Skeleton: ButtonSkeleton });
