// components/ui/input/SliderInput.tsx
"use client";

import * as React from "react";
import { InputSkeleton } from "@/components/ui/input/InputSkeleton";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputPaddingXClasses,
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

function SliderInputRoot({
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
	const resolvedSize = size ?? "sm";
	const sliderValue =
		typeof value === "number" && Number.isFinite(value) ? value : min;
	const boundedSliderValue = Math.min(max, Math.max(min, sliderValue));
	const progress =
		max > min ? ((boundedSliderValue - min) / (max - min)) * 100 : 0;

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
				size={resolvedSize}
				disabled={disabled}
				fullWidth
				contentClassName={`flex items-center ${inputPaddingXClasses[resolvedSize]}`}
			>
				<div className="flex h-full w-full items-center gap-3">
					<div className="group relative flex h-full min-h-8 min-w-0 flex-1 items-center has-[:disabled]:opacity-50">
						<span
							aria-hidden
							className="pointer-events-none absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-foreground/10 transition-[background-color,box-shadow] motion-interactive group-hover:bg-foreground/15 group-has-[:focus-visible]:ring-3 group-has-[:focus-visible]:ring-ring/30"
							data-slot="slider-track"
						>
							<span
								className="block h-full rounded-full bg-primary"
								data-slot="slider-progress"
								style={{ width: `${progress}%` }}
							/>
						</span>
						<input
							aria-describedby={describedBy}
							aria-invalid={Boolean(error)}
							aria-label={
								typeof label === "string" ? `${label} slider` : "Slider"
							}
							className="absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed [&::-moz-range-progress]:bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
							disabled={disabled}
							max={max}
							min={min}
							onChange={handleSliderChange}
							step={step}
							type="range"
							value={boundedSliderValue}
						/>
					</div>
					<div className="flex h-full shrink-0 items-center gap-2">
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
								"!h-full !w-20 min-w-0 bg-transparent !px-0 !py-0 text-right text-foreground outline-none placeholder:text-muted/70 disabled:cursor-not-allowed",

								"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
								inputVariants({
									size: resolvedSize,
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
							<span className="whitespace-nowrap text-sm text-muted-foreground">
								{unit}
							</span>
						) : null}
					</div>
				</div>
			</InputFrame>
		</Field>
	);
}

export const SliderInput = Object.assign(SliderInputRoot, {
	Skeleton: InputSkeleton,
});
