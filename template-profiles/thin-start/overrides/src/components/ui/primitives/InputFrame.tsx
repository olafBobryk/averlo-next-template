import clsx from "clsx";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";

export const inputTextClasses =
	"h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base text-foreground outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export type InputFrameSize = "sm";

type InputFrameProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	disabled?: boolean;
	end?: React.ReactNode;
	error?: boolean;
	fullWidth?: boolean;
	start?: React.ReactNode;
	tone?: "default" | "error" | "success";
};

export type InputFrameSkeletonProps = Pick<
	InputFrameProps,
	"children" | "className" | "fullWidth"
> & {
	radius?: "pill" | "textarea";
	size?: InputFrameSize;
	skeletonClassName?: string;
};

const InputFrameRoot = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame(
		{
			children,
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
					"flex h-9 min-w-0 items-center rounded-3xl border border-transparent bg-input/50 text-foreground transition-[color,box-shadow,background-color] outline-none",
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
	size: _size,
	skeletonClassName,
	...rest
}: InputFrameSkeletonProps) {
	return (
		<span
			aria-hidden
			className={clsx(
				"relative flex h-9 min-w-0 items-center overflow-hidden rounded-3xl border border-transparent",
				"pointer-events-none select-none bg-muted/80",
				radius === "textarea" ? "!rounded-2xl" : "!rounded-3xl",
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
