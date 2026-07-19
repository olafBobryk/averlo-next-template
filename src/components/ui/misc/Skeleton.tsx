import clsx from "clsx";
import type * as React from "react";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
	as?: "div" | "span";
	children?: React.ReactNode;
};

export function Skeleton({
	as: Component = "div",
	className,
	children,
	...rest
}: SkeletonProps) {
	return (
		<Component
			className={clsx(
				"relative overflow-hidden rounded-md bg-muted/80",
				className,
			)}
			aria-hidden={rest["aria-hidden"] ?? true}
			{...rest}
		>
			{children ? (
				<span
					className="contents pointer-events-none select-none opacity-0 [&_*]:pointer-events-none [&_*]:select-none [&_*]:opacity-0"
					aria-hidden="true"
				>
					{children}
				</span>
			) : null}
		</Component>
	);
}
