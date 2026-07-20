"use client";

import clsx from "clsx";
import type * as React from "react";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

type CopyFieldButtonSize = "md" | "sm" | "fit";

type CopyFieldProps = {
	value: string;
	display?: React.ReactNode;
	copiedDurationMs?: number;
	onCopy?: (value: string) => void | Promise<void>;
	toastMessage?: string | false;
	type?: "phone" | "string";
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	loading?: boolean;
	disabled?: boolean;
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	buttonSize?: CopyFieldButtonSize;
	textVariant?: React.ComponentProps<typeof Text>["variant"];
	textTone?: React.ComponentProps<typeof Text>["tone"];
	showIcon?: boolean;
	className?: string;
	textClassName?: string;
	iconClassName?: string;
};

type CopyFieldSkeletonProps = {
	placeholder?: string;
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	buttonSize?: CopyFieldButtonSize;
	textVariant?: React.ComponentProps<typeof Text>["variant"];
	textTone?: React.ComponentProps<typeof Text>["tone"];
	className?: string;
	textClassName?: string;
};

function CopyFieldRoot({
	value,
	display,
	copiedDurationMs = 1500,
	onCopy,
	toastMessage,
	type = "string",
	onClick,
	loading,
	disabled,
	buttonVariant = "secondary",
	buttonSize = "md",
	textVariant = "body",
	textTone,
	showIcon = true,
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
	const resolvedButtonSize = buttonSize === "fit" ? "sm" : buttonSize;
	const isPrimitive =
		typeof displayValue === "string" || typeof displayValue === "number";
	const textBaseClasses = clsx(
		"min-w-0 flex-1 truncate text-left",
		textClassName,
	);
	const content = isPrimitive ? (
		<Text
			dir={type === "phone" ? "ltr" : undefined}
			as="span"
			variant={textVariant}
			tone={textTone}
			className={clsx(textBaseClasses)}
		>
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
			variant={buttonVariant}
			size={resolvedButtonSize}
			align="between"
			data-copied={copied ? "true" : undefined}
			loading={loading}
			disabled={disabled}
			onClick={handleCopyClick}
			trailingIcon={showIcon ? iconNode : undefined}
			className={clsx(
				buttonVariant === "secondary" && buttonSize === "md"
					? "w-full min-w-0 !rounded-full !px-[15px] !py-[12px]"
					: "min-w-0",
				className,
			)}
		>
			{content}
		</Button>
	);
}

function CopyFieldSkeleton({
	placeholder = "example.com/referral=123456",
	buttonVariant = "secondary",
	buttonSize = "md",
	textVariant = "body",
	textTone,
	className,
	textClassName,
}: CopyFieldSkeletonProps) {
	return (
		<Button.Skeleton
			variant={buttonVariant}
			size={buttonSize === "fit" ? "sm" : buttonSize}
			align="between"
			fullWidth={buttonVariant === "secondary" && buttonSize === "md"}
			className={clsx(
				buttonVariant === "secondary" && buttonSize === "md"
					? "w-full min-w-0 !rounded-full !px-[15px] !py-[12px]"
					: "min-w-0",
				className,
			)}
		>
			<Text
				as="span"
				variant={textVariant}
				tone={textTone}
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
