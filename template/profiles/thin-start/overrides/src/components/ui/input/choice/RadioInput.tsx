"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorRadio } from "@/components/ui/input/choice/ChoiceIndicators";
import { Field } from "@/components/ui/primitives/Field";

export type RadioOption = {
	value: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
};

type RadioInputProps = {
	className?: string;
	defaultValue?: string;
	description?: React.ReactNode;
	disabled?: boolean;
	error?: React.ReactNode;
	fieldClassName?: string;
	id?: string;
	label?: React.ReactNode;
	labelClassName?: string;
	name?: string;
	onChange?: (value: string) => void;
	optionClassName?: string;
	options: RadioOption[];
	required?: boolean;
	value?: string;
};

function RadioInputRoot({
	className,
	defaultValue,
	description,
	disabled,
	error,
	fieldClassName,
	id,
	label,
	labelClassName,
	name,
	onChange,
	optionClassName,
	options,
	required,
	value,
}: RadioInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string | undefined>(
		defaultValue ?? options[0]?.value,
	);
	const generatedId = React.useId();
	const baseId = id ?? name ?? generatedId;
	const groupName = name ?? baseId;
	const firstOptionId = options[0]?.value
		? `${baseId}-${options[0].value}`
		: baseId;
	const describedBy =
		[
			description ? `${firstOptionId}-description` : undefined,
			error ? `${firstOptionId}-error` : undefined,
		]
			.filter(Boolean)
			.join(" ") || undefined;
	const selectedValue = isControlled ? value : internalValue;

	const handleSelect = (nextValue: string) => {
		if (nextValue === selectedValue) return;
		if (!isControlled) setInternalValue(nextValue);
		onChange?.(nextValue);
	};

	return (
		<Field
			id={firstOptionId}
			label={label}
			description={description}
			error={error}
			className={fieldClassName}
		>
			<div className={clsx("flex flex-col gap-3", className)}>
				{options.map((option) => {
					const optionId = `${baseId}-${option.value}`;
					const isSelected = option.value === selectedValue;
					const isDisabled = Boolean(disabled || option.disabled);

					return (
						<ChoiceField
							key={option.value}
							id={optionId}
							name={groupName}
							value={option.value}
							label={option.label}
							description={option.description}
							checked={isSelected}
							disabled={isDisabled}
							required={required}
							inputType="radio"
							describedBy={describedBy}
							invalid={Boolean(error)}
							onChange={(nextValue) => handleSelect(nextValue)}
							className={optionClassName}
							labelClassName={labelClassName}
							indicator={
								<ChoiceIndicatorRadio
									checked={isSelected}
									disabled={isDisabled}
								/>
							}
						/>
					);
				})}
			</div>
		</Field>
	);
}

function RadioInputSkeleton({
	className,
	description,
	fieldClassName,
	label,
	labelClassName,
	optionClassName,
	options,
	required,
}: Pick<
	RadioInputProps,
	| "className"
	| "description"
	| "fieldClassName"
	| "label"
	| "labelClassName"
	| "optionClassName"
	| "options"
	| "required"
>) {
	return (
		<Field
			className={fieldClassName}
			description={description}
			disableMessage
			label={label}
			required={required}
		>
			<div className={clsx("flex flex-col gap-3", className)}>
				{options.map((option) => (
					<ChoiceField.Skeleton
						className={optionClassName}
						description={option.description}
						key={option.value}
						label={option.label}
						labelClassName={labelClassName}
					/>
				))}
			</div>
		</Field>
	);
}

export const RadioInput = Object.assign(RadioInputRoot, {
	Skeleton: RadioInputSkeleton,
});
