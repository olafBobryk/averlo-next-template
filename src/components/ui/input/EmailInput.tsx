// components/ui/input/EmailInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

type EmailInputProps = {
	label: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	defaultValue?: string;

	value?: string;
	onChange?: (value: string) => void;

	required?: boolean;
	disabled?: boolean;

	error?: React.ReactNode;
	validate?: (value: string) => string | null;

	className?: string;
	inputClassName?: string;
	size?: InputFrameSize;
};

export function EmailInput({
	label,
	description,
	placeholder,
	id,
	name,
	defaultValue,
	value,
	onChange,
	required = false,
	disabled,
	error,
	validate,
	className,
	inputClassName,
	size,
}: EmailInputProps) {
	const isControlled = value !== undefined;
	const [clientError, setClientError] = React.useState<string | null>(null);

	const derivedError = error ?? clientError;
	const tone = derivedError ? "error" : "default";
	const fallbackId = React.useId();
	const inputId = id ?? name ?? fallbackId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const messageId = derivedError ? `${inputId}-message` : undefined;
	const describedBy =
		[descriptionId, derivedError ? messageId : undefined]
			.filter(Boolean)
			.join(" ") || undefined;

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		if (validate) setClientError(null);
		onChange?.(e.target.value);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
		if (!validate) return;
		setClientError(validate(e.target.value));
	};

	return (
		<Field
			label={label}
			description={description}
			message={derivedError ?? undefined}
			tone={tone}
			required={required}
			inputId={inputId}
			descriptionId={descriptionId}
			messageId={messageId}
			className={className}
		>
			<InputFrame tone={tone} size={size} disabled={disabled} fullWidth>
				<input
					id={inputId}
					name={name}
					type="email"
					inputMode="email"
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck={false}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					className={[
						inputVariants({
							size,
							disabled: disabled ? true : undefined,
						}),
						inputClassName,
					]
						.filter(Boolean)
						.join(" ")}
					{...(isControlled
						? { value: value ?? "", onChange: handleChange }
						: { defaultValue, onChange: handleChange })}
					onBlur={handleBlur}
					aria-invalid={Boolean(derivedError)}
					aria-describedby={describedBy}
				/>
			</InputFrame>
		</Field>
	);
}
