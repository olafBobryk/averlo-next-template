// components/ui/input/PasswordInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import { InputFrame, inputTextClasses } from "@/components/ui/primitives/InputFrame";

type PasswordInputProps = {
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

export function PasswordInput({
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
}: PasswordInputProps) {
	const isControlled = value !== undefined;

	const [clientError, setClientError] = React.useState<string | null>(null);
	const [isVisible, setIsVisible] = React.useState(false);

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

	const inputId = id ?? name;
	const messageId = inputId ? `${inputId}-message` : undefined;

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
			<InputFrame
				tone={tone}
				disabled={disabled}
				fullWidth
				end={
					<button
						type="button"
						onClick={() => setIsVisible((v) => !v)}
						disabled={disabled}
						aria-label={isVisible ? "Hide password" : "Show password"}
						aria-pressed={isVisible}
						className={[
							"shrink-0 select-none",
							"px-2 py-1 rounded-[8px]",
							"text-xs text-foreground/80 hover:text-foreground",
							"transition-all motion-micro",
							"hover:bg-[#020202]/[0.05] active:bg-[#020202]/[0.08]",
							"focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer focus:ring-offset-0",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{isVisible ? "Hide" : "Show"}
					</button>
				}
			>
				<input
					id={inputId}
					name={name}
					type={isVisible ? "text" : "password"}
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
