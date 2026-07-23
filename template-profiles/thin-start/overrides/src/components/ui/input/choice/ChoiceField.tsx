"use client";

import clsx from "clsx";
import * as React from "react";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Text } from "@/components/ui/primitives/Text";

type ChoiceFieldProps = {
	checked: boolean;
	className?: string;
	describedBy?: string;
	description?: React.ReactNode;
	disabled?: boolean;
	id: string;
	indicator: React.ReactNode;
	inputAriaHidden?: boolean;
	inputTabIndex?: number;
	inputType?: "radio" | "checkbox";
	invalid?: boolean;
	label?: React.ReactNode;
	labelClassName?: string;
	name?: string;
	onChange?: (value: string, checked: boolean) => void;
	required?: boolean;
	value: string;
};

type ChoiceFieldSkeletonProps = Pick<
	ChoiceFieldProps,
	"className" | "description" | "label" | "labelClassName"
> & { indicator?: "checkbox" | "radio" | "toggle" };

function ChoiceFieldRoot({
	checked,
	className,
	describedBy,
	description,
	disabled,
	id,
	indicator,
	inputAriaHidden,
	inputTabIndex,
	inputType = "radio",
	invalid,
	label,
	labelClassName,
	name,
	onChange,
	required,
	value,
}: ChoiceFieldProps) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const labelTabIndex =
		inputType === "radio" ? (disabled || checked ? -1 : 0) : undefined;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		if (inputType === "radio") {
			if (event.target.checked) onChange?.(value, true);
			return;
		}
		onChange?.(value, event.target.checked);
	};

	return (
		<label
			htmlFor={id}
			data-checked={checked ? "true" : "false"}
			tabIndex={labelTabIndex}
			onFocus={() => {
				inputRef.current?.focus({ preventScroll: true });
			}}
			className={clsx(
				"group choice-field flex w-full items-center gap-3 text-left transition-colors motion-interactive",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
				className,
			)}
		>
			<input
				id={id}
				name={name}
				type={inputType}
				value={value}
				checked={checked}
				disabled={disabled}
				required={required}
				onChange={handleChange}
				ref={inputRef}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						event.currentTarget.click();
					}
				}}
				aria-invalid={invalid ? true : undefined}
				aria-hidden={inputAriaHidden ? true : undefined}
				tabIndex={inputTabIndex ?? (inputType === "radio" ? -1 : undefined)}
				aria-describedby={describedBy}
				className="peer choice-field-input sr-only"
			/>
			{indicator}
			<span className="flex min-w-0 flex-col items-start">
				{label ? (
					<Text
						as="span"
						variant="body"
						className={clsx("text-sm", labelClassName)}
					>
						{label}
					</Text>
				) : null}
				{description ? (
					<Text as="span" variant="caption" tone="muted">
						{description}
					</Text>
				) : null}
			</span>
		</label>
	);
}

function ChoiceFieldSkeleton({
	className,
	description,
	indicator = "radio",
	label,
	labelClassName,
}: ChoiceFieldSkeletonProps) {
	return (
		<div
			aria-hidden
			className={clsx("flex w-full items-center gap-3 text-left", className)}
		>
			<Skeleton
				data-slot="choice-indicator-skeleton"
				className={clsx(
					"shrink-0",
					indicator === "toggle"
						? "h-[26px] w-[42px] !rounded-full"
						: indicator === "checkbox"
							? "size-[22px] !rounded-[8px]"
							: "size-[22px] !rounded-full",
				)}
			/>
			<span className="flex min-w-0 flex-col items-start">
				{label ? (
					<Text.Skeleton as="span" className={clsx("text-sm", labelClassName)}>
						{label}
					</Text.Skeleton>
				) : null}
				{description ? (
					<Text.Skeleton as="span" variant="caption">
						{description}
					</Text.Skeleton>
				) : null}
			</span>
		</div>
	);
}

export const ChoiceField = Object.assign(ChoiceFieldRoot, {
	Skeleton: ChoiceFieldSkeleton,
});
