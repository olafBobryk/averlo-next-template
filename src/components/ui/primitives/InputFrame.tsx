import clsx from "clsx";
import * as React from "react";

export const inputTextClasses =
	"w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50";

type InputFrameProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	error?: boolean;
};

export const InputFrame = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame({ children, className, error = false, ...rest }, ref) {
		return (
			<div
				ref={ref}
				className={clsx(
					"flex min-h-10 items-center rounded-md border bg-background transition-colors",
					error ? "border-danger" : "border-border focus-within:border-primary",
					className,
				)}
				{...rest}
			>
				{children}
			</div>
		);
	},
);
