import clsx from "clsx";
import * as React from "react";

export const inputTextClasses =
	"w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50";

type InputFrameProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	disabled?: boolean;
	error?: boolean;
	fullWidth?: boolean;
	tone?: "default" | "error" | "success";
};

const InputFrameRoot = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame(
		{
			children,
			className,
			disabled = false,
			error = false,
			fullWidth = false,
			tone = error ? "error" : "default",
			...rest
		},
		ref,
	) {
		return (
			<div
				ref={ref}
				className={clsx(
					"flex min-h-10 items-center rounded-[10px] border bg-surface shadow-[2px_4px_15px_rgba(2,2,2,0.03)] transition-all motion-micro",
					tone === "error" &&
						"border-danger focus-within:ring-3 focus-within:ring-danger/20",
					tone === "success" &&
						"border-success/70 focus-within:ring-3 focus-within:ring-success/20",
					tone === "default" &&
						"border-border hover:border-border/50 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
					fullWidth && "w-full",
					disabled && "pointer-events-none cursor-not-allowed opacity-60",
					className,
				)}
				{...rest}
			>
				{children}
			</div>
		);
	},
);

function InputFrameSkeleton({
	children,
	className,
	fullWidth,
}: Pick<InputFrameProps, "children" | "className" | "fullWidth">) {
	return (
		<span
			aria-hidden
			className={clsx(
				"flex min-h-10 items-center rounded-[10px] border border-transparent bg-muted/80 px-3 text-sm text-transparent",
				fullWidth && "w-full",
				className,
			)}
		>
			<span className="select-none opacity-0">{children ?? "Input"}</span>
		</span>
	);
}

export const InputFrame = Object.assign(InputFrameRoot, {
	Skeleton: InputFrameSkeleton,
});
