"use client";

import clsx from "clsx";
import type * as React from "react";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Panel, type PanelProps } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";

type WarningTone = "warning" | "danger";
type WarningVariant = "inline" | "card";

type WarningProps = {
	title?: React.ReactNode;
	description?: React.ReactNode;
	message?: React.ReactNode;
	children?: React.ReactNode;
	iconName?: IconName;
	iconSize?: "sm" | "md" | "lg";
	animate?: boolean;
	tone?: WarningTone;
	variant?: WarningVariant;
	className?: string;
	cardClassName?: string;
	cardProps?: Omit<PanelProps<"div">, "children">;
	textClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	iconClassName?: string;
};

const toneStyles: Record<
	WarningTone,
	{ icon: string; title: string; body: string }
> = {
	warning: {
		icon: "text-warning",
		title: "text-foreground",
		body: "text-foreground/70",
	},
	danger: {
		icon: "text-danger",
		title: "text-foreground",
		body: "text-foreground/70",
	},
};

export function Warning({
	title,
	description,
	message,
	children,
	iconName = "warning",
	iconSize = "sm",
	animate = true,
	tone = "warning",
	variant = "inline",
	className,
	cardClassName,
	cardProps,
	textClassName,
	titleClassName,
	descriptionClassName,
	iconClassName,
}: WarningProps) {
	const content = children ?? description ?? message;
	const isPrimitive =
		typeof content === "string" || typeof content === "number";
	const styles = toneStyles[tone];
	const isCard = variant === "card";

	const inner = (
		<>
			<Icon
				name={iconName}
				size={iconSize}
				animate={animate}
				className={clsx("flex-shrink-0", styles.icon, iconClassName)}
			/>
			<div className="min-w-0 text-left">
				{title ? (
					<Text
						as="p"
						variant="bodyStrong"
						className={clsx(styles.title, titleClassName)}
					>
						{title}
					</Text>
				) : null}
				{isPrimitive ? (
					<Text
						as="p"
						variant="body"
						className={clsx(
							"min-w-0 break-words",
							styles.body,
							textClassName,
							descriptionClassName,
						)}
					>
						{content}
					</Text>
				) : (
					<div
						className={clsx(
							"min-w-0 break-words",
							styles.body,
							textClassName,
							descriptionClassName,
						)}
					>
						{content}
					</div>
				)}
			</div>
		</>
	);

	if (isCard) {
		const { className: cardPropsClassName, ...restPanelProps } =
			cardProps ?? {};

		return (
			<Panel
				padding="none"
				gap="none"
				shadow="none"
				tone={tone}
				{...restPanelProps}
				className={clsx(
					"flex items-start gap-2.5 rounded-[12px] px-4 py-3",
					cardClassName,
					cardPropsClassName,
					className,
				)}
			>
				{inner}
			</Panel>
		);
	}

	return (
		<div className={clsx("flex min-w-0 items-center gap-2.5", className)}>
			{inner}
		</div>
	);
}
