"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorMulti } from "@/components/ui/input/choice/ChoiceIndicators";
import { Field } from "@/components/ui/primitives/Field";

export type MultiselectOption = {
	value: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
};

type MultiselectInputProps = {
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
	options: MultiselectOption[];
	required?: boolean;
	value?: string[];
};

export function MultiselectInput({
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
}: MultiselectInputProps) {
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
								<ChoiceIndicatorMulti
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
