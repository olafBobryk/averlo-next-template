// components/ui/primitives/InputFrame.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { Skeleton } from "@/components/ui/misc/Skeleton";

const inputFrameVariants = cva(
	"flex items-stretch gap-2.5 rounded-[10px] bg-surface border transition-all motion-micro shadow-[2px_4px_15px_rgba(2,2,2,0.03)]",
	{
		variants: {
			size: {
				sm: "min-h-[36px]",
				md: "min-h-[40px]",
				lg: "min-h-[48px]",
			},
			tone: {
				default: `border-border hover:border-border/50 has-[input:-webkit-autofill]:bg-primary/10 has-[input:-webkit-autofill]:border-primary/40 has-[input:autofill]:bg-primary/10 has-[input:autofill]:border-primary/40 ${focusRing.fieldDefault}`,
				error: `border-danger ${focusRing.fieldError}`,
				success: `border-success/70 ${focusRing.fieldSuccess}`,
			},
			fullWidth: {
				true: "w-full",
			},
			disabled: {
				true: "opacity-60 cursor-not-allowed pointer-events-none",
			},
		},
		defaultVariants: {
			size: "md",
			tone: "default",
		},
	},
);

export const inputPaddingXClasses = {
	sm: "px-3",
	md: "px-[15px]",
	lg: "px-4",
} as const;

export const inputPaddingYClasses = {
	sm: "py-2",
	md: "py-2.5",
	lg: "py-3",
} as const;

const inputFrameStartPaddingClasses = {
	sm: "pl-3",
	md: "pl-[15px]",
	lg: "pl-4",
} as const;

const inputFrameEndPaddingClasses = {
	sm: "pr-3",
	md: "pr-[15px]",
	lg: "pr-4",
} as const;

export const inputSizeClasses = {
	sm: `${inputPaddingXClasses.sm} ${inputPaddingYClasses.sm} text-sm`,
	md: `${inputPaddingXClasses.md} ${inputPaddingYClasses.md} text-sm`,
	lg: `${inputPaddingXClasses.lg} ${inputPaddingYClasses.lg} text-base`,
} as const;

export const inputVariants = cva(
	"disabled:cursor-not-allowed px-0 w-full h-full min-w-0 bg-transparent outline-none text-left text-foreground placeholder:text-muted/70 autofill:!shadow-[inset_0_0_0_30px_rgb(var(--color-primary-rgb)_/_0.08)] autofill:![-webkit-text-fill-color:rgb(var(--color-foreground-rgb)_/_1)] autofill:caret-[rgb(var(--color-foreground-rgb)_/_1)] autofill:[transition:background-color_5000s_ease-in-out_0s]",
	{
		variants: {
			size: inputSizeClasses,
			hasStart: {
				true: "!pl-0",
			},
			hasEnd: {
				true: "!pr-0",
			},
			disabled: {
				true: "cursor-not-allowed",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export const inputTextClasses = inputVariants();

export type InputFrameSize = NonNullable<
	VariantProps<typeof inputFrameVariants>["size"]
>;

export type InputFrameProps = {
	start?: React.ReactNode;
	end?: React.ReactNode;
	fullWidth?: boolean;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
} & VariantProps<typeof inputFrameVariants> &
	React.HTMLAttributes<HTMLDivElement>;

const InputFrameRoot = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame(
		{
			start,
			end,
			children,
			className,
			contentClassName,
			size,
			tone,
			fullWidth,
			disabled,
			...rest
		},
		ref,
	) {
		const wrapperClass = clsx(
			inputFrameVariants({
				size,
				tone,
				fullWidth: fullWidth ? true : undefined,
				disabled,
			}),
			start ? inputFrameStartPaddingClasses[size ?? "md"] : undefined,
			end ? inputFrameEndPaddingClasses[size ?? "md"] : undefined,
			className,
		);

		return (
			<div
				ref={ref}
				className={wrapperClass}
				data-disabled={disabled ? true : undefined}
				{...rest}
			>
				{start ? (
					<span className="flex items-center shrink-0">{start}</span>
				) : null}
				<div className={clsx("flex-1 min-w-0", contentClassName)}>
					{children}
				</div>
				{end ? <span className="flex items-center shrink-0">{end}</span> : null}
			</div>
		);
	},
);

export type InputFrameSkeletonProps = Omit<
	InputFrameProps,
	"children" | "disabled" | "tone"
> & {
	children?: React.ReactNode;
	skeletonClassName?: string;
};

export function InputFrameSkeleton({
	children,
	className,
	contentClassName: _contentClassName,
	end: _end,
	fullWidth,
	size = "md",
	skeletonClassName,
	start: _start,
	...rest
}: InputFrameSkeletonProps) {
	return (
		<Skeleton
			className={clsx(
				inputFrameVariants({ size, fullWidth: fullWidth ? true : undefined }),
				"pointer-events-none border-transparent !bg-muted/80 shadow-none",
				className,
			)}
			data-slot="input-frame-skeleton"
			{...rest}
		>
			{children ? (
				<span
					className={clsx(
						"mx-[15px] min-w-0 truncate text-sm",
						skeletonClassName,
					)}
				>
					{children}
				</span>
			) : null}
		</Skeleton>
	);
}

export const InputFrame = Object.assign(InputFrameRoot, {
	Skeleton: InputFrameSkeleton,
});
