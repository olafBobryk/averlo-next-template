// components/ui/input/SliderInput.tsx
"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputPaddingXClasses,
	inputPaddingYClasses,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

type SliderInputProps = {
	label: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;

	id?: string;
	name?: string;

	value?: number | null;
	onChange?: (value: number | null) => void;

	required?: boolean;
	disabled?: boolean;

	min?: number;
	max?: number;
	step?: number;

	unit?: React.ReactNode;

	error?: React.ReactNode;
	className?: string;
	inputClassName?: string;
	size?: InputFrameSize;
};

export function SliderInput({
	label,
	description,
	placeholder,
	id,
	name,
	value,
	onChange,
	required = false,
	disabled,
	min = 0,
	max = 100,
	step = 1,
	unit,
	error,
	className,
	inputClassName,
	size,
}: SliderInputProps) {
	const tone = error ? "error" : "default";
	const fallbackId = React.useId();
	const inputId = id ?? name ?? fallbackId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const messageId = error ? `${inputId}-message` : undefined;
	const describedBy =
		[descriptionId, error ? messageId : undefined].filter(Boolean).join(" ") ||
		undefined;

	const sliderValue = React.useMemo(() => {
		if (typeof value === "number" && Number.isFinite(value)) return value;
		if (typeof min === "number") return min;
		return 0;
	}, [value, min]);

	const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const next = Number(e.target.value);
		onChange?.(Number.isFinite(next) ? next : null);
	};

	const handleSliderChange: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const next = Number(e.target.value);
		onChange?.(Number.isFinite(next) ? next : null);
	};

	return (
		<Field
			label={label}
			description={description}
			message={error ?? undefined}
			tone={tone}
			required={required}
			inputId={inputId}
			descriptionId={descriptionId}
			messageId={messageId}
			className={className}
		>
			<InputFrame
				tone={tone}
				size={size}
				disabled={disabled}
				fullWidth
				contentClassName={inputPaddingXClasses[size ?? "md"]}
			>
				<div className="flex w-full items-center gap-3">
					<input
						type="range"
						min={min}
						max={max}
						step={step}
						value={sliderValue}
						onChange={handleSliderChange}
						disabled={disabled}
						className="flex-1 accent-primary"
						aria-label={typeof label === "string" ? label : undefined}
					/>
					<div className="flex items-center gap-2">
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
								"w-20 min-w-0 bg-transparent pr-0! text-right text-foreground outline-none placeholder:text-muted/70 disabled:cursor-not-allowed",

								"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
								inputClassName,
								inputVariants({
									size,
									disabled: disabled ? true : undefined,
								}),
								inputClassName,
							]
								.filter(Boolean)
								.join(" ")}
							value={value ?? ""}
							onChange={handleNumberChange}
							aria-invalid={Boolean(error)}
							aria-describedby={describedBy}
						/>
						{unit ? (
							<span className="whitespace-nowrap text-sm text-muted/70">
								{unit}
							</span>
						) : null}
					</div>
				</div>
			</InputFrame>
		</Field>
	);
}
