// components/ui/input/TextInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import { InputFrame, inputTextClasses } from "@/components/ui/primitives/InputFrame";

type TextInputProps = {
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
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

	// Validation (recommended: pass error from parent)
	error?: React.ReactNode;

	// Optional client-side validation helper
	validate?: (value: string) => string | null;

	className?: string;
	inputClassName?: string;
};

export function TextInput({
	label,
	description,
	placeholder,
	id,
	name,
	defaultValue,
	value,
	onChange,
	disabled,
	inputMode,
	error,
	validate,
	required = false,
	className,
	inputClassName,
}: TextInputProps) {
	const isControlled = value !== undefined;
	const inputId = id ?? name;
	const messageId = inputId ? `${inputId}-message` : undefined;

	const [clientError, setClientError] = React.useState<string | null>(null);

	const derivedError = error ?? clientError;
	const tone = derivedError ? "error" : "default";

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const next = e.target.value;
		if (validate) setClientError(null);
		onChange?.(next);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
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
			className={className}
		>
			<InputFrame tone={tone} disabled={disabled} fullWidth>
				<input
					id={inputId}
					name={name}
					type="text"
					inputMode={inputMode}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					className={[inputTextClasses, inputClassName].filter(Boolean).join(" ")}
					{...(isControlled
						? { value: value ?? "", onChange: handleChange }
						: { defaultValue, onChange: handleChange })}
					onBlur={handleBlur}
					aria-invalid={Boolean(derivedError)}
					aria-describedby={derivedError ? messageId : undefined}
				/>
			</InputFrame>
		</Field>
	);
}
