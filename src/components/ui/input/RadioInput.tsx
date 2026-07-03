"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorRadio } from "@/components/ui/input/choice/ChoiceIndicators";
import { Field } from "@/components/ui/primitives/Field";

type RadioOption = {
	value: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
};

type RadioInputProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	message?: React.ReactNode;
	tone?: "default" | "error" | "success";
	required?: boolean;
	inputId?: string;
	options: RadioOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	disabled?: boolean;
	fieldClassName?: string;
	className?: string;
	optionClassName?: string;
	labelClassName?: string;
};

export function RadioInput({
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
}: RadioInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string | undefined>(
		defaultValue ?? options[0]?.value,
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

	React.useEffect(() => {
		if (!isControlled && internalValue === undefined && options[0]?.value) {
			setInternalValue(options[0].value);
		}
	}, [internalValue, isControlled, options]);

	const selectedValue = isControlled ? value : internalValue;

	const handleSelect = (next: string) => {
		if (next === selectedValue) return;
		if (!isControlled) setInternalValue(next);
		onChange?.(next);
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
					const isSelected = option.value === selectedValue;
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
							inputType="radio"
							describedBy={describedBy}
							invalid={isInvalid}
							onChange={(next) => handleSelect(next)}
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
