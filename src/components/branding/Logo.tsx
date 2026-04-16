// components/branding/Logo.tsx
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import type * as React from "react";
import { focusRing } from "../ui/foundations/focus";

const logoStyles = cva(
	clsx(
		"inline-flex items-center shrink-0 transition-opacity motion-micro rounded-sm",
		focusRing.visibleDefault,
	),
	{
		variants: {
			variant: {
				full: "",
				mark: "",
			},
			size: {
				sm: "",
				md: "",
				lg: "",
			},
			tone: {
				light: "text-[#E5F1FF]",
				dark: "text-[#010103]",
			},
			interactive: {
				true: "cursor-pointer hover:opacity-80",
				false: "",
			},
		},
		compoundVariants: [
			{ variant: "full", size: "sm", class: "h-[24px] w-[86px]" },
			{ variant: "full", size: "md", class: "h-[36px] w-[129px]" },
			{ variant: "full", size: "lg", class: "h-[48px] w-[172px]" },
			{ variant: "mark", size: "sm", class: "h-[24px] w-[23px]" },
			{ variant: "mark", size: "md", class: "h-[36px] w-[34px]" },
			{ variant: "mark", size: "lg", class: "h-[48px] w-[46px]" },
		],
		defaultVariants: {
			variant: "full",
			size: "md",
			tone: "dark",
			interactive: true,
		},
	},
);

type LogoOwnProps = {
	href?: string;
	title?: string;
	className?: string;
	logoClassName?: string;
	interactive?: boolean;
	focusable?: boolean;
} & VariantProps<typeof logoStyles>;

type LogoProps<T extends React.ElementType = "span"> = LogoOwnProps & {
	as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof LogoOwnProps | "as">;

export default function Logo<T extends React.ElementType = "span">({
	as,
	href: hrefProp,
	variant,
	size,
	tone,
	title,
	className,
	logoClassName,
	interactive = true,
	focusable = true,
	...rest
}: LogoProps<T>) {
	const href = hrefProp === undefined ? "/" : hrefProp;
	const hasClick = Boolean(
		(rest as { onClick?: React.MouseEventHandler }).onClick,
	);
	const Tag = (as ??
		(href ? Link : hasClick ? "button" : "span")) as React.ElementType;
	const isButton = Tag === "button";
	const hasInteractiveSurface = Boolean(
		href || hasClick || Tag === "button" || Tag === "a" || Tag === Link,
	);
	const isInteractive = interactive && hasInteractiveSurface;
	const ariaLabel =
		(rest as { "aria-label"?: string })["aria-label"] ??
		(href ? "Go to homepage" : "Logo");

	const resolvedVariant = variant ?? "full";
	const resolvedSize = size ?? "md";
	const resolvedTone = tone ?? "dark";

	const mergedClassName = clsx(
		logoStyles({
			variant: resolvedVariant,
			size: resolvedSize,
			tone: resolvedTone,
			interactive: isInteractive,
		}),
		className,
	);

	const svgTitle = title ?? (resolvedVariant === "full" ? "logo" : "logo mark");

	const svg =
		resolvedVariant === "mark" ? (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				viewBox="0 0 40 42"
				className={clsx("h-full w-full", logoClassName)}
			>
				<title>{svgTitle}</title>
				{/* TODO: Replace paths with your brand's logomark */}
				<path
					fill="currentColor"
					d="M27.677 0H16.065L1.5 25.566C-1.44 30.82.168 34.338 4.352 40.845l17.723-30.557 5.907 9.982C33.134 13.136 34.49 9.063 27.677 0Zm-3.159 35.14c-1.826-4.956-.655-8.647 3.482-14.894l12 20.802H27.981l-3.463-5.907Z"
				/>
			</svg>
		) : (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				viewBox="0 0 148 26"
				className={clsx("h-full w-full", logoClassName)}
			>
				<title>{svgTitle}</title>
				{/* TODO: Replace paths with your brand's wordmark */}
				<path
					fill="currentColor"
					d="M0 6.821h5.376l2.588 10.484h.067l2.823-10.484h4.704l2.822 10.484h.068l2.587-10.484h5.376l-4.805 17.205h-5.04l-3.327-10.888h-.067L9.845 24.026h-5.04L0 6.82Zm34.666 13.71c1.849 0 2.722-.874 3.058-1.714h5.343c-.94 3.461-3.629 5.746-8.3 5.746-5.712 0-9.173-3.763-9.173-9.14 0-5.242 3.394-9.14 8.87-9.14 5.881 0 8.872 4.302 8.872 10.552H30.97c0 2.419 1.781 3.696 3.696 3.696ZM34.465 9.98c-2.05 0-3.495 1.21-3.495 3.595h6.99c0-2.385-1.445-3.595-3.495-3.595Zm20.45-3.696c4.569 0 7.492 3.494 7.492 9.14 0 5.645-2.923 9.14-7.493 9.14-2.486 0-4.301-1.345-4.973-2.252h-.067v1.713h-5.377V0h5.377v8.535h.067c.672-.907 2.486-2.251 4.973-2.251ZM53.502 20.53c2.184 0 3.528-1.747 3.528-5.108 0-3.36-1.344-5.107-3.528-5.107s-3.528 1.747-3.528 5.107c0 3.36 1.344 5.108 3.528 5.108ZM84.039 4.771c-1.513 0-2.689-.806-2.689-2.385C81.35.84 82.527 0 84.04 0s2.688.84 2.688 2.386c0 1.579-1.176 2.385-2.688 2.385Zm-2.689 2.05h5.377v17.204H81.35V6.822Zm6.831 13.34 8.367-9.24v-.067h-7.695V6.82h14.415v3.864l-8.367 9.241v.067h8.703v4.033H88.181V20.16Zm19.485-15.39c-1.512 0-2.688-.806-2.688-2.385C104.978.84 106.154 0 107.666 0c1.512 0 2.689.84 2.689 2.386 0 1.579-1.177 2.385-2.689 2.385Zm-2.688 2.05h5.377v17.204h-5.377V6.822Zm15.769 17.742c-5.746 0-9.207-3.797-9.207-9.14 0-5.342 3.461-9.14 9.207-9.14 5.712 0 9.173 3.798 9.173 9.14 0 5.343-3.461 9.14-9.173 9.14Zm0-4.032c2.352 0 3.797-1.781 3.797-5.108 0-3.326-1.445-5.107-3.797-5.107-2.386 0-3.831 1.78-3.831 5.107s1.445 5.108 3.831 5.108Zm21.442-14.247c3.326 0 5.578 2.184 5.578 6.115v11.627h-5.377v-9.913c0-2.588-.907-3.461-2.688-3.461-2.05 0-3.226 1.042-3.226 3.427v9.947H131.1V6.82h5.376v2.487h.068c.907-1.58 2.587-3.024 5.645-3.024ZM75.042 7.483h-4.87l-6.109 10.722c-1.232 2.204-.558 3.68 1.197 6.408l7.433-12.816 2.477 4.187c2.161-2.992 2.73-4.7-.128-8.501Z"
				/>
				<path
					fill="currentColor"
					d="M73.717 22.22c-.765-2.078-.274-3.626 1.46-6.246l5.034 8.724H75.17l-1.453-2.477Z"
				/>
			</svg>
		);

	if (isButton) {
		const { type, disabled, tabIndex, ...buttonRest } =
			rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
		return (
			<button
				type={type ?? "button"}
				className={mergedClassName}
				aria-label={ariaLabel}
				disabled={disabled || !interactive}
				tabIndex={disabled || !interactive ? -1 : focusable ? tabIndex : -1}
				{...buttonRest}
			>
				{svg}
			</button>
		);
	}

	const { onClick, tabIndex, ...tagRest } =
		rest as React.HTMLAttributes<HTMLElement> & {
			onClick?: React.MouseEventHandler<HTMLElement>;
			tabIndex?: number;
		};

	return (
		<Tag
			className={mergedClassName}
			aria-label={ariaLabel}
			aria-disabled={hasInteractiveSurface && !interactive ? true : undefined}
			role={Tag === "span" ? "img" : undefined}
			tabIndex={
				hasInteractiveSurface
					? interactive && focusable
						? tabIndex
						: -1
					: tabIndex
			}
			{...(Tag === Link ? { href } : Tag === "a" && href ? { href } : {})}
			onClick={
				interactive
					? onClick
					: hasInteractiveSurface
						? (event: React.MouseEvent<HTMLElement>) => {
								event.preventDefault();
								event.stopPropagation();
							}
						: onClick
			}
			{...tagRest}
		>
			{svg}
		</Tag>
	);
}
