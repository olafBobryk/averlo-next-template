"use client";

import * as React from "react";
import { InputSkeleton } from "@/components/ui/input/InputSkeleton";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";

export type SelectOption<T extends string = string> = {
	label: string;
	value: T;
	disabled?: boolean;
};

export type SelectInputProps<T extends string = string> = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	"children" | "onChange" | "value"
> & {
	description?: React.ReactNode;
	dropdownPositionStrategy?: "absolute" | "fixed";
	error?: React.ReactNode;
	label?: React.ReactNode;
	onChange?: (value: T) => void;
	options: SelectOption<T>[];
	placeholder?: string;
	value?: T;
};

function SelectInputRoot<T extends string = string>({
	className,
	description,
	dropdownPositionStrategy,
	error,
	id,
	label,
	onChange,
	options,
	placeholder,
	value,
	...props
}: SelectInputProps<T>) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const errorId = error ? `${inputId}-error` : undefined;
	void dropdownPositionStrategy;

	return (
		<Field
			id={inputId}
			label={label}
			description={description}
			error={error}
			className={className}
		>
			<InputFrame error={Boolean(error)}>
				<select
					id={inputId}
					value={value}
					className={inputTextClasses}
					aria-describedby={
						[descriptionId, errorId].filter(Boolean).join(" ") || undefined
					}
					aria-invalid={Boolean(error)}
					onChange={(event) => onChange?.(event.currentTarget.value as T)}
					{...props}
				>
					{placeholder ? <option value="">{placeholder}</option> : null}
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</option>
					))}
				</select>
			</InputFrame>
		</Field>
	);
}

export const SelectInput = Object.assign(SelectInputRoot, {
	Skeleton: InputSkeleton,
});
