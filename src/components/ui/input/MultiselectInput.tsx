"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorMulti } from "@/components/ui/input/choice/ChoiceIndicators";
import { Field } from "@/components/ui/primitives/Field";

type MultiselectOption = {
	value: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
};

type MultiselectInputProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	message?: React.ReactNode;
	tone?: "default" | "error" | "success";
	required?: boolean;
	inputId?: string;
	options: MultiselectOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	name?: string;
	disabled?: boolean;
	fieldClassName?: string;
	className?: string;
	optionClassName?: string;
	labelClassName?: string;
};

export function MultiselectInput({
	label,
	description,
	message,
	tone = "default",
	required,
	inputId,
	options,
	value,
	defaultValue,
	onChange,
	name,
	disabled,
	fieldClassName,
	className,
	optionClassName,
	labelClassName,
}: MultiselectInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string[]>(
		defaultValue ?? [],
	);
	const fallbackId = React.useId();
	const baseId = inputId ?? name ?? fallbackId;
	const groupName = name ?? baseId;
	const labelTargetId = options[0]?.value
		? `${baseId}-${options[0].value}`
		: undefined;
	const descriptionId = description ? `${baseId}-description` : undefined;
	const messageId = message ? `${baseId}-message` : undefined;
	const describedBy =
		[descriptionId, message ? messageId : undefined]
			.filter(Boolean)
			.join(" ") || undefined;
	const isInvalid = tone === "error" && Boolean(message);
	const selectedValues = isControlled ? (value ?? []) : internalValue;

	const handleToggle = (nextValue: string, nextChecked: boolean) => {
		const nextValues = nextChecked
			? Array.from(new Set([...selectedValues, nextValue]))
			: selectedValues.filter((value) => value !== nextValue);

		if (!isControlled) setInternalValue(nextValues);
		onChange?.(nextValues);
	};

	return (
		<Field
			label={label}
			description={description}
			message={message}
			tone={tone}
			required={required}
			inputId={labelTargetId}
			descriptionId={descriptionId}
			messageId={messageId}
			className={fieldClassName}
		>
			<div className={clsx("flex flex-col gap-3", className)}>
				{options.map((option) => {
					const isSelected = selectedValues.includes(option.value);
					const isDisabled = Boolean(disabled || option.disabled);
					const optionId = `${baseId}-${option.value}`;

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
							inputType="checkbox"
							describedBy={describedBy}
							invalid={isInvalid}
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
