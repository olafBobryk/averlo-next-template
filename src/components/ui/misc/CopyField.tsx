"use client";

import clsx from "clsx";
import * as React from "react";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Button } from "@/components/ui/primitives/Button";
import { Icon } from "@/components/ui/icons/Icon";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/toast";

type CopyFieldProps = {
	value: string;
	display?: React.ReactNode;
	copiedDurationMs?: number;
	onCopy?: (value: string) => void | Promise<void>;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	textClassName?: string;
	iconClassName?: string;
};

type CopyFieldSkeletonProps = {
	placeholder?: string;
	className?: string;
	textClassName?: string;
};

function CopyFieldRoot({
	value,
	display,
	copiedDurationMs = 1500,
	onCopy,
	onClick,
	loading,
	disabled,
	className,
	textClassName,
	iconClassName,
}: CopyFieldProps) {
	const [copied, setCopied] = React.useState(false);
	const timeoutRef = React.useRef<number | null>(null);

	React.useEffect(
		() => () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	const handleCopy: React.MouseEventHandler<HTMLButtonElement> = async (
		event,
	) => {
		onClick?.(event);
		if (event.defaultPrevented || disabled) return;

		try {
			if (onCopy) {
				await onCopy(value);
			} else if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(value);
			}
			showToast.success("Copied to clipboard");
			setCopied(true);
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = window.setTimeout(
				() => setCopied(false),
				copiedDurationMs,
			);
		} catch {
			// no-op
		}
	};

	const displayValue = display ?? value;
	const isPrimitive =
		typeof displayValue === "string" || typeof displayValue === "number";
	const textBaseClasses = clsx(
		"min-w-0 flex-1 truncate text-left",
		textClassName,
	);
	const content = isPrimitive ? (
		<Text as="span" variant="body" className={clsx(textBaseClasses)}>
			{displayValue}
		</Text>
	) : (
		<span className={clsx("block", textBaseClasses)}>{displayValue}</span>
	);

	const iconNode = (
		<IconSwap
			size="sm"
			className={clsx(iconClassName)}
			activeIndex={copied ? 1 : 0}
			items={[
				{ icon: <Icon name="copy" size="sm" animate /> },
				{ icon: <Icon name="check" size="sm" animate /> },
			]}
		/>
	);

	return (
		<Button
			variant="solid"
			align="between"
			data-copied={copied ? "true" : undefined}
			loading={loading}
			disabled={disabled}
			onClick={handleCopy}
			trailingIcon={iconNode}
			className={clsx(
				"w-full min-w-0 !rounded-full !px-[15px] !py-[12px]",
				className,
			)}
		>
			{content}
		</Button>
	);
}

function CopyFieldSkeleton({
	placeholder = "example.com/referral=123456",
	className,
	textClassName,
}: CopyFieldSkeletonProps) {
	return (
		<Button.Skeleton
			align="between"
			fullWidth
			className={clsx(
				"w-full min-w-0 !rounded-full !px-[15px] !py-[12px]",
				className,
			)}
		>
			<Text
				as="span"
				variant="body"
				className={clsx(
					"block min-w-0 flex-1 truncate text-left",
					textClassName,
				)}
			>
				{placeholder}
			</Text>
		</Button.Skeleton>
	);
}

export const CopyField = Object.assign(CopyFieldRoot, {
	Skeleton: CopyFieldSkeleton,
});
