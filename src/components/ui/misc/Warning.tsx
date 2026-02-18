"use client";

import * as React from "react";
import clsx from "clsx";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Text } from "@/components/ui/primitives/Text";

type WarningProps = {
	message?: React.ReactNode;
	children?: React.ReactNode;
	iconName?: IconName;
	iconSize?: "sm" | "md" | "lg";
	animate?: boolean;
	className?: string;
	textClassName?: string;
	iconClassName?: string;
};

export function Warning({
	message,
	children,
	iconName = "warning",
	iconSize = "sm",
	animate = true,
	className,
	textClassName,
	iconClassName,
}: WarningProps) {
	const content = children ?? message;
	const isPrimitive =
		typeof content === "string" || typeof content === "number";

	return (
		<div className={clsx("flex min-w-0 items-center gap-2.5", className)}>
			<Icon
				name={iconName}
				size={iconSize}
				animate={animate}
				className={clsx("flex-shrink-0", iconClassName)}
			/>
			{isPrimitive ? (
				<Text
					as="p"
					variant="body"
					className={clsx("min-w-0 break-words text-left", textClassName)}
				>
					{content}
				</Text>
			) : (
				<div className={clsx("min-w-0 break-words text-left", textClassName)}>
					{content}
				</div>
			)}
		</div>
	);
}
