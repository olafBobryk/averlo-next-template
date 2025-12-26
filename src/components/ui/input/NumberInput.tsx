// components/ui/input/NumberInput.tsx
// components/ui/input/NumberInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import { InputFrame, inputTextClasses } from "@/components/ui/primitives/InputFrame";

type NumberInputProps = {
	label: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	// Uncontrolled
	defaultValue?: number;

	// Controlled
	value?: number | null;
	onChange?: (value: number | null) => void;

	required?: boolean;
	disabled?: boolean;

	min?: number;
	max?: number;
	step?: number;

	// Optional visual unit (e.g. "km", "mi", "%")
	unit?: React.ReactNode;

	// Validation (recommended: pass error from parent)
	error?: React.ReactNode;

	// Optional client-side validation helper (receives parsed number)
	validate?: (value: number | null) => string | null;

	className?: string;
	inputClassName?: string;
};

function parseNumber(raw: string): number | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;

	// Allow user typing "-" or "." without immediately becoming NaN noise
	if (trimmed === "-" || trimmed === "." || trimmed === "-.") return null;

	const n = Number(trimmed);
	return Number.isFinite(n) ? n : null;
}

export function NumberInput({
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
	min,
	max,
	step = 1,
	unit,
	error,
	validate,
	className,
	inputClassName,
}: NumberInputProps) {
	const isControlled = value !== undefined;
	const inputId = id ?? name;
	const messageId = inputId ? `${inputId}-message` : undefined;

	const [clientError, setClientError] = React.useState<string | null>(null);

	const derivedError = error ?? clientError;
	const tone = derivedError ? "error" : "default";

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const next = parseNumber(e.target.value);
		if (validate) setClientError(null);
		onChange?.(next);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
		if (!validate) return;
		setClientError(validate(parseNumber(e.target.value)));
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
			<InputFrame
				tone={tone}
				disabled={disabled}
				fullWidth
				end={
					unit ? (
						<span className="whitespace-nowrap text-sm text-muted/70">{unit}</span>
					) : null
				}
			>
				<input
					id={inputId}
					name={name}
					type="number"
					inputMode="numeric"
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					className={[
						inputTextClasses,
						"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
						inputClassName,
					]
						.filter(Boolean)
						.join(" ")}
					{...(isControlled
						? {
								value: value ?? "",
								onChange: handleChange,
							}
						: {
								defaultValue: defaultValue ?? undefined,
								onChange: handleChange,
							})}
					onBlur={handleBlur}
					aria-invalid={Boolean(derivedError)}
					aria-describedby={derivedError ? messageId : undefined}
				/>
			</InputFrame>
		</Field>
	);
}
