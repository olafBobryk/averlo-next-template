"use client";

import clsx from "clsx";
import * as React from "react";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
};

const SHIMMER_DURATION_MS = 1400;

export function Skeleton({
	className,
	style,
	children,
	...rest
}: SkeletonProps) {
	const shimmerOffset = React.useMemo(
		() => -(Date.now() % SHIMMER_DURATION_MS),
		[],
	);
	const mergedStyle = {
		"--skeleton-shimmer-duration": `${SHIMMER_DURATION_MS}ms`,
		"--skeleton-shimmer-offset": `${shimmerOffset}ms`,
		...(style ?? {}),
	} as React.CSSProperties;

	return (
		<div
			className={clsx(
				"relative overflow-hidden bg-foreground/5 rounded-[5px]",
				"after:content-[''] after:absolute after:inset-0 after:pointer-events-none",
				"after:bg-no-repeat after:[background-size:240px_100%] after:[background-position-x:-30vw]",
				"after:animate-[skeleton-shimmer_var(--skeleton-shimmer-duration,1400ms)_linear_infinite]",
				"after:[animation-delay:calc(-1*var(--skeleton-shimmer-offset,0ms))]",
				"after:[background-image:linear-gradient(90deg,transparent_0%,rgba(2,2,2,0.06)_45%,rgba(2,2,2,0.12)_50%,rgba(2,2,2,0.06)_55%,transparent_100%)]",
				className,
			)}
			style={mergedStyle}
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
		</div>
	);
}
