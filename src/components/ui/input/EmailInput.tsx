// components/ui/input/EmailInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import { InputFrame, inputTextClasses } from "@/components/ui/primitives/InputFrame";

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
}: EmailInputProps) {
	const isControlled = value !== undefined;
	const inputId = id ?? name;
	const messageId = inputId ? `${inputId}-message` : undefined;

	const [clientError, setClientError] = React.useState<string | null>(null);

	const derivedError = error ?? clientError;
	const tone = derivedError ? "error" : "default";

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
			className={className}
		>
			<InputFrame tone={tone} disabled={disabled} fullWidth>
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
