// components/ui/input/TextAreaInput.tsx
"use client";

import * as React from "react";
import {
	InputSkeleton,
	type InputSkeletonProps,
} from "@/components/ui/input/InputSkeleton";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
} from "@/components/ui/primitives/InputFrame";

const textareaSizeClasses: Record<InputFrameSize, string> = {
	sm: "h-20 min-h-9 px-3 py-2 text-base md:text-sm",
	md: "min-h-[88px] px-[15px] py-2.5 text-sm",
	lg: "min-h-[88px] px-4 py-3 text-base",
};

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

function TextAreaInputRoot({
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
	const usesSourceDefaultSize = size === undefined || size === "sm";

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
			<InputFrame
				tone={tone}
				size={size}
				disabled={disabled}
				fullWidth
				contentClassName="flex min-w-0 self-stretch"
				className={[
					"h-auto items-start !rounded-2xl",
					usesSourceDefaultSize ? "min-h-9" : "min-h-[88px]",
				].join(" ")}
			>
				<textarea
					id={inputId}
					name={name}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					rows={rows}
					className={[
						"block w-full min-w-0 resize-y bg-transparent text-left text-foreground outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						textareaSizeClasses[size ?? "sm"],
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

function TextAreaInputSkeleton(props: InputSkeletonProps) {
	const usesSourceDefaultSize = props.size === undefined || props.size === "sm";
	return (
		<InputSkeleton
			{...props}
			radius="textarea"
			inputClassName={
				usesSourceDefaultSize ? "!h-[82px] min-h-[38px]" : "h-auto min-h-[88px]"
			}
		/>
	);
}

export const TextAreaInput = Object.assign(TextAreaInputRoot, {
	Skeleton: TextAreaInputSkeleton,
});
