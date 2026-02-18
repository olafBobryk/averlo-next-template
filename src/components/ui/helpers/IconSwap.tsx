"use client";

import clsx from "clsx";
import type * as React from "react";

type IconSwapItem = {
	icon: React.ReactNode;
	className?: string;
	activeClassName?: string;
	inactiveClassName?: string;
};

type IconSwapSize = "sm" | "md" | "lg";

type IconSwapProps = {
	items: IconSwapItem[];
	activeIndex: number;
	size?: IconSwapSize;
	className?: string;
	transitionClassName?: string;
};

const sizeClasses: Record<IconSwapSize, string> = {
	sm: "h-[15px] w-[15px]",
	md: "h-5 w-5",
	lg: "h-6 w-6",
};

export function IconSwap({
	items,
	activeIndex,
	size = "md",
	className,
	transitionClassName,
}: IconSwapProps) {
	return (
		<span
			className={clsx(
				"relative flex shrink-0 items-center justify-center ",
				sizeClasses[size],
				className,
			)}
		>
			{items.map((item, index) => {
				const isActive = index === activeIndex;
				return (
					<span
						key={`${index}-${String(item.icon)}`}
						className={clsx(
							"absolute inset-0 flex items-center justify-center transition-all motion-micro",
							sizeClasses[size],
							transitionClassName,
							isActive
								? clsx("opacity-100 scale-100", item.activeClassName)
								: clsx("opacity-0 scale-50", item.inactiveClassName),
							item.className,
						)}
					>
						{item.icon}
					</span>
				);
			})}
		</span>
	);
}
