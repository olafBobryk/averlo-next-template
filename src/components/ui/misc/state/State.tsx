"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import clsx from "clsx";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Text } from "@/components/ui/primitives/Text";
import { Button } from "@/components/ui/primitives/Button";

const stateIndicatorStyles = cva("flex w-full min-w-0", {
	variants: {
		layout: {
			inline: "items-center justify-start flex-wrap gap-x-3 gap-y-2",
			stacked: "flex-col gap-3",
		},
		align: {
			left: "",
			center: "",
			right: "",
		},
	},
	compoundVariants: [
		{ layout: "inline", align: "left", className: "justify-start" },
		{ layout: "inline", align: "center", className: "justify-center" },
		{ layout: "inline", align: "right", className: "justify-end" },
		{ layout: "stacked", align: "left", className: "items-start" },
		{ layout: "stacked", align: "center", className: "items-center" },
		{ layout: "stacked", align: "right", className: "items-end" },
	],
	defaultVariants: {
		layout: "inline",
		align: "left",
	},
});

const stateTextStyles = cva("flex flex-col gap-1", {
	variants: {
		layout: {
			inline: "min-w-0 max-w-full flex-[1_1_auto]",
			stacked: "",
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
	},
	defaultVariants: {
		align: "left",
	},
});

const stateActionStyles = cva("flex items-center max-w-full", {
	variants: {
		layout: {
			inline: "shrink-0",
			stacked: "w-full",
		},
		align: {
			left: "",
			center: "justify-center",
			right: "justify-end",
		},
	},
	compoundVariants: [
		{ layout: "inline", align: "left" },
		{ layout: "inline", align: "center" },
		{ layout: "inline", align: "right" },
	],
	defaultVariants: {
		layout: "inline",
		align: "left",
	},
});

export type StateIndicatorProps = {
	title?: React.ReactNode;
	description?: React.ReactNode;
	iconName?: IconName;
	iconSize?: "sm" | "md" | "lg";
	iconAnimate?: boolean;
	layout?: VariantProps<typeof stateIndicatorStyles>["layout"];
	align?: VariantProps<typeof stateIndicatorStyles>["align"];
	actionLabel?: string;
	onAction?: () => void;
	action?: React.ReactNode;
	className?: string;
	iconClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	actionClassName?: string;
};

export function StateIndicator({
	title,
	description,
	iconName,
	iconSize = "md",
	iconAnimate = true,
	layout = "inline",
	align = "left",
	actionLabel = "Try again",
	onAction,
	action,
	className,
	iconClassName,
	titleClassName,
	descriptionClassName,
	actionClassName,
}: StateIndicatorProps) {
	const actionNode =
		action ??
		(onAction ? (
			<Button variant="outline" size="sm" onClick={onAction}>
				{actionLabel}
			</Button>
		) : null);

	return (
		<div className={clsx(stateIndicatorStyles({ layout, align }), className)}>
			{iconName ? (
				<Icon
					name={iconName}
					size={iconSize}
					animate={iconAnimate}
					className={clsx("flex-shrink-0", iconClassName)}
				/>
			) : null}
			<div className={clsx(stateTextStyles({ align, layout }))}>
				{title ? (
					<Text as="p" variant="headingXs" className={clsx(titleClassName)}>
						{title}
					</Text>
				) : null}
				{description ? (
					<Text
						as="p"
						variant="body"
						tone="muted"
						className={clsx(descriptionClassName)}
					>
						{description}
					</Text>
				) : null}
			</div>
			{actionNode ? (
				<div
					className={clsx(
						stateActionStyles({ layout, align }),
						actionClassName,
					)}
				>
					{actionNode}
				</div>
			) : null}
		</div>
	);
}
