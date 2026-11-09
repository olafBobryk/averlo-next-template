import clsx from "clsx";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import {
	inputFrameBaseClassName,
	inputFrameVariantStyles,
} from "./inputFrameStyles";

export const inputTextClasses =
	"h-[34px] w-full min-w-0 bg-transparent px-3 py-1 text-base text-foreground outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export type InputFrameSize = "xxs" | "xs" | "sm";

type InputFrameProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	size?: InputFrameSize;
	variant?: keyof typeof inputFrameVariantStyles;
	disabled?: boolean;
	end?: React.ReactNode;
	error?: boolean;
	fullWidth?: boolean;
	start?: React.ReactNode;
	tone?: "default" | "error" | "success";
};

export type InputFrameSkeletonProps = Pick<
	InputFrameProps,
	"children" | "className" | "fullWidth" | "variant"
> & {
	radius?: "pill" | "textarea";
	size?: InputFrameSize;
	skeletonClassName?: string;
};

const InputFrameRoot = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame(
		{
			children,
			size = "sm",
			variant = "default",
			className,
			disabled = false,
			end,
			error = false,
			fullWidth = false,
			start,
			tone = error ? "error" : "default",
			...rest
		},
		ref,
	) {
		return (
			<div
				ref={ref}
				className={clsx(
					"flex items-center transition-[color,box-shadow,background-color] outline-none",
					inputFrameBaseClassName,
					inputFrameVariantStyles[variant],
					size === "xxs" ? "h-6" : size === "xs" ? "h-7" : "h-[34px]",
					(start || end) && "gap-2.5",
					start && "pl-3",
					end && "pr-3",
					tone === "error" && focusRing.fieldError,
					tone === "success" && focusRing.fieldSuccess,
					tone === "default" && focusRing.fieldDefault,
					fullWidth && "w-full",
					disabled && "pointer-events-none cursor-not-allowed",
					className,
				)}
				aria-invalid={tone === "error" || undefined}
				data-disabled={disabled || undefined}
				data-slot="input-frame"
				{...rest}
			>
				{start ? (
					<span className="flex shrink-0 items-center">{start}</span>
				) : null}
				{children}
				{end ? <span className="flex shrink-0 items-center">{end}</span> : null}
			</div>
		);
	},
);

export function InputFrameSkeleton({
	children,
	className,
	fullWidth,
	radius = "pill",
	size = "sm",
	skeletonClassName,
	variant: _variant,
	...rest
}: InputFrameSkeletonProps) {
	return (
		<span
			aria-hidden
			className={clsx(
				"relative flex min-w-0 items-center overflow-hidden rounded-[9px] border-0",
				"pointer-events-none select-none bg-muted/80",
				size === "xxs" ? "h-6" : size === "xs" ? "h-7" : "h-[34px]",
				radius === "textarea" ? "!rounded-2xl" : "!rounded-[9px]",
				fullWidth && "w-full",
				className,
			)}
			data-slot="input-frame-skeleton"
			{...rest}
		>
			{children ? (
				<span
					className={clsx(
						"mx-3 min-w-0 truncate text-base opacity-0 md:text-sm",
						skeletonClassName,
					)}
				>
					{children}
				</span>
			) : null}
		</span>
	);
}

export const InputFrame = Object.assign(InputFrameRoot, {
	Skeleton: InputFrameSkeleton,
});
