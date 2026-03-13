"use client";

import clsx from "clsx";
import * as React from "react";
import { Text } from "@/components/ui/primitives/Text";

type ChoiceFieldProps = {
	id: string;
	name?: string;
	value: string;
	label?: React.ReactNode;
	description?: React.ReactNode;
	checked: boolean;
	disabled?: boolean;
	required?: boolean;
	inputType?: "radio" | "checkbox";
	onChange?: (value: string, checked: boolean) => void;
	indicator: React.ReactNode;
	describedBy?: string;
	invalid?: boolean;
	inputTabIndex?: number;
	inputAriaHidden?: boolean;
	className?: string;
	labelClassName?: string;
};

export function ChoiceField({
	id,
	name,
	value,
	label,
	description,
	checked,
	disabled,
	required,
	inputType = "radio",
	onChange,
	indicator,
	describedBy,
	invalid,
	inputTabIndex,
	inputAriaHidden,
	className,
	labelClassName,
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
				"choice-field flex w-full items-center gap-3 text-left transition-colors motion-interactive group",
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
				className="sr-only peer choice-field-input"
			/>
			{indicator}
			<span className="flex min-w-0 flex-col gap-0">
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
