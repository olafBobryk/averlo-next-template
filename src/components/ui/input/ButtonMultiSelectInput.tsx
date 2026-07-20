"use client";

import clsx from "clsx";
import * as React from "react";
import { ChoiceIndicatorMulti } from "@/components/ui/input/choice/ChoiceIndicators";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";

export type ButtonMultiSelectOption<T extends string = string> = {
	disabled?: boolean;
	label: React.ReactNode;
	value: T;
};

export type ButtonMultiSelectInputProps<T extends string = string> = Omit<
	React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
	"children" | "defaultValue" | "disabled" | "onChange"
> & {
	defaultValue?: readonly T[];
	description?: React.ReactNode;
	disabled?: boolean;
	fieldClassName?: string;
	label?: React.ReactNode;
	message?: React.ReactNode;
	name?: string;
	onChange?: (value: T[]) => void;
	options: ButtonMultiSelectOption<T>[];
	required?: boolean;
	selectedVariant?: React.ComponentProps<typeof Button>["variant"];
	size?: React.ComponentProps<typeof Button>["size"];
	tone?: "default" | "error" | "success";
	unselectedVariant?: React.ComponentProps<typeof Button>["variant"];
	value?: readonly T[];
};

export function ButtonMultiSelectInput<T extends string = string>({
	className,
	defaultValue = [],
	description,
	disabled = false,
	fieldClassName,
	id,
	label,
	message,
	name,
	onChange,
	options,
	required,
	selectedVariant = "primary",
	size = "sm",
	tone = "default",
	unselectedVariant = "secondary",
	value,
	...props
}: ButtonMultiSelectInputProps<T>) {
	const generatedId = React.useId();
	const baseId = id ?? name ?? generatedId;
	const groupName = name ?? baseId;
	const descriptionId = description ? `${baseId}-description` : undefined;
	const messageId = message ? `${baseId}-message` : undefined;
	const labelTargetId = options[0]?.value
		? `${baseId}-${options[0].value}`
		: undefined;
	const describedBy =
		[descriptionId, message ? messageId : undefined]
			.filter(Boolean)
			.join(" ") || undefined;
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<T[]>([
		...defaultValue,
	]);
	const selectedValues = isControlled ? [...(value ?? [])] : internalValue;
	const isInvalid = tone === "error" && Boolean(message);

	function toggleValue(nextValue: T) {
		if (disabled) return;

		const nextValues = selectedValues.includes(nextValue)
			? selectedValues.filter((selectedValue) => selectedValue !== nextValue)
			: [...selectedValues, nextValue];

		if (!isControlled) {
			setInternalValue(nextValues);
		}

		onChange?.(nextValues);
	}

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
			<fieldset
				id={baseId}
				aria-describedby={describedBy}
				aria-invalid={isInvalid || undefined}
				data-required={required ? "" : undefined}
				disabled={disabled}
				className={clsx(
					"flex min-w-0 flex-wrap items-start gap-2 border-0 p-0",
					disabled && "opacity-60",
					className,
				)}
				{...props}
			>
				{name
					? selectedValues.map((selectedValue) => (
							<input
								key={selectedValue}
								type="hidden"
								name={groupName}
								value={selectedValue}
							/>
						))
					: null}
				{options.map((option) => {
					const selected = selectedValues.includes(option.value);
					const optionDisabled = Boolean(disabled || option.disabled);
					const optionId = `${baseId}-${option.value}`;

					return (
						<Button
							key={option.value}
							id={optionId}
							type="button"
							variant={selected ? selectedVariant : unselectedVariant}
							size={size}
							aria-pressed={selected}
							disabled={optionDisabled}
							onClick={() => toggleValue(option.value)}
							leadingIcon={
								<ChoiceIndicatorMulti
									checked={selected}
									disabled={optionDisabled}
									className="pointer-events-none -ml-1"
								/>
							}
							className={clsx(
								"min-h-[2.4375rem] rounded-[8px]",
								selected ? undefined : "bg-background",
							)}
						>
							{option.label}
						</Button>
					);
				})}
			</fieldset>
		</Field>
	);
}
