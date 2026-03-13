"use client";

import clsx from "clsx";
import * as React from "react";
import { CopyStatusIcon, useCopyAction } from "@/components/ui/helpers/useCopyAction";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

type CopyFieldProps = {
	value: string;
	display?: React.ReactNode;
	copiedDurationMs?: number;
	onCopy?: (value: string) => void | Promise<void>;
	toastMessage?: string | false;
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
	toastMessage,
	onClick,
	loading,
	disabled,
	className,
	textClassName,
	iconClassName,
}: CopyFieldProps) {
	const { copied, handleCopy } = useCopyAction({
		value,
		onCopy,
		copiedDurationMs,
		toastMessage,
	});

	const handleCopyClick: React.MouseEventHandler<HTMLButtonElement> = async (
		event,
	) => {
		onClick?.(event);
		if (event.defaultPrevented || disabled) return;

		await handleCopy();
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
		<CopyStatusIcon copied={copied} size="sm" className={iconClassName} />
	);

	return (
		<Button
			variant="solid"
			align="between"
			data-copied={copied ? "true" : undefined}
			loading={loading}
			disabled={disabled}
			onClick={handleCopyClick}
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
