"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorToggle } from "@/components/ui/input/choice/ChoiceIndicators";
import { Field } from "@/components/ui/primitives/Field";

export type ToggleOption = {
	value: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
};

type ToggleInputProps = {
	className?: string;
	defaultValue?: string[];
	description?: React.ReactNode;
	disabled?: boolean;
	error?: React.ReactNode;
	fieldClassName?: string;
	id?: string;
	label?: React.ReactNode;
	labelClassName?: string;
	name?: string;
	onChange?: (value: string[]) => void;
	optionClassName?: string;
	options: ToggleOption[];
	required?: boolean;
	value?: string[];
};

function ToggleInputRoot({
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
}: ToggleInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string[]>(
		defaultValue ?? [],
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
	const selectedValues = isControlled ? (value ?? []) : internalValue;

	const handleToggle = (nextValue: string, nextChecked: boolean) => {
		const nextValues = nextChecked
			? Array.from(new Set([...selectedValues, nextValue]))
			: selectedValues.filter((currentValue) => currentValue !== nextValue);

		if (!isControlled) setInternalValue(nextValues);
		onChange?.(nextValues);
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
					const isSelected = selectedValues.includes(option.value);
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
							required={required && selectedValues.length === 0}
							inputType="checkbox"
							describedBy={describedBy}
							invalid={Boolean(error)}
							onChange={handleToggle}
							className={optionClassName}
							labelClassName={labelClassName}
							indicator={
								<ChoiceIndicatorToggle
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

function ToggleInputSkeleton({
	className,
	description,
	fieldClassName,
	label,
	labelClassName,
	optionClassName,
	options,
	required,
}: Pick<
	ToggleInputProps,
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
						indicator="toggle"
						key={option.value}
						label={option.label}
						labelClassName={labelClassName}
					/>
				))}
			</div>
		</Field>
	);
}

export const ToggleInput = Object.assign(ToggleInputRoot, {
	Skeleton: ToggleInputSkeleton,
});
