// components/ui/input/TextAreaInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

type TextAreaInputProps = {
	label: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	// Uncontrolled
	defaultValue?: string;

	// Controlled
	value?: string;
	onChange?: (value: string) => void;
	required?: boolean;

	disabled?: boolean;

	// Validation (recommended: pass error from parent)
	error?: React.ReactNode;

	// Optional client-side validation helper
	validate?: (value: string) => string | null;

	className?: string;
	textareaClassName?: string;

	// Textarea-specific
	rows?: number; // default a couple lines
	size?: InputFrameSize;
};

export function TextAreaInput({
	label,
	description,
	placeholder,
	id,
	name,
	defaultValue,
	value,
	onChange,
	disabled,
	error,
	validate,
	required = false,
	className,
	textareaClassName,
	rows = 3,
	size,
}: TextAreaInputProps) {
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

	const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		const next = e.target.value;

		if (validate) setClientError(null);
		onChange?.(next);
	};

	const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
		if (!validate) return;
		const next = e.target.value;
		setClientError(validate(next));
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
				<textarea
					id={inputId}
					name={name}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					rows={rows}
					className={[
						inputVariants({
							size,
							disabled: disabled ? true : undefined,
						}),
						"resize-y",
						"min-h-[88px]", // a couple lines tall by default
						textareaClassName,
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
