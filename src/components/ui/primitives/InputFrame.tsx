// components/ui/primitives/InputFrame.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const inputFrameVariants = cva(
	"flex items-center gap-2.5 rounded-[10px] bg-surface border transition-all motion-micro shadow-[2px_4px_15px_rgba(2,2,2,0.03)]",
	{
		variants: {
			size: {
				sm: "px-3 py-2 text-sm",
				md: "px-[15px] py-2.5 text-sm",
				lg: "px-4 py-3 text-base",
			},
			tone: {
				default:
					"border-border/15 hover:border-border/25 focus-within:!border-primary/60 focus-within:ring-4 focus-within:ring-primary/10",
				error:
					"border-danger focus-within:!border-danger focus-within:ring-4 focus-within:ring-danger/10",
				success:
					"border-success/70 focus-within:!border-success focus-within:ring-4 focus-within:ring-success/10",
			},
			fullWidth: {
				true: "w-full",
			},
			disabled: {
				true: "opacity-60 pointer-events-none",
			},
		},
		defaultVariants: {
			size: "md",
			tone: "default",
		},
	},
);

export const inputTextClasses =
	"w-full bg-transparent outline-none text-sm text-left text-foreground placeholder:text-muted/70";

type InputFrameProps = {
	start?: React.ReactNode;
	end?: React.ReactNode;
	fullWidth?: boolean;
	children: React.ReactNode;
	className?: string;
} & VariantProps<typeof inputFrameVariants> &
	React.HTMLAttributes<HTMLDivElement>;

export const InputFrame = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame(
		{
			start,
			end,
			children,
			className,
			size,
			tone,
			fullWidth,
			disabled,
			...rest
		},
		ref,
	) {
		const wrapperClass = [
			inputFrameVariants({
				size,
				tone,
				fullWidth: fullWidth ? true : undefined,
				disabled,
			}),
			className,
		]
			.filter(Boolean)
			.join(" ");

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
				<div className="flex-1 min-w-0">{children}</div>
				{end ? <span className="flex items-center shrink-0">{end}</span> : null}
			</div>
		);
	},
);
