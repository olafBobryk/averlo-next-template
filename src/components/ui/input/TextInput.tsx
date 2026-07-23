// components/ui/input/TextInput.tsx
"use client";

import * as React from "react";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { InputSkeleton } from "@/components/ui/input/InputSkeleton";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

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
	copy?: boolean;
	onCopy?: (value: string) => void | Promise<void>;
	copyAriaLabel?: string;
	copyToastMessage?: string | false;

	className?: string;
	inputClassName?: string;
	size?: InputFrameSize;
};

function TextInputRoot({
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
	copy,
	onCopy,
	copyAriaLabel = "Copy to clipboard",
	copyToastMessage,
	className,
	inputClassName,
	size,
}: TextInputProps) {
	const isControlled = value !== undefined;
	const [clientError, setClientError] = React.useState<string | null>(null);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const { copied, handleCopy } = useCopyAction({
		value: isControlled ? (value ?? "") : undefined,
		getValue: !isControlled
			? () => inputRef.current?.value ?? defaultValue ?? ""
			: undefined,
		onCopy,
		toastMessage: copyToastMessage,
	});

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
		const next = e.target.value;
		if (validate) setClientError(null);
		onChange?.(next);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
		if (!validate) return;
		const next = e.target.value;
		setClientError(validate(next));
	};

	const copyButton = copy ? (
		<Button
			variant="ghost"
			size="icon-sm"
			align="center"
			aria-label={copyAriaLabel}
			onClick={handleCopy}
			onMouseDown={(event) => {
				event.preventDefault();
			}}
			disabled={disabled}
			className="rounded-[8px] text-foreground/60"
		>
			<CopyStatusIcon copied={copied} size="sm" />
		</Button>
	) : null;

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
				end={copyButton}
			>
				<input
					ref={inputRef}
					id={inputId}
					name={name}
					type="text"
					inputMode={inputMode}
					disabled={disabled}
					placeholder={placeholder}
					required={required}
					className={[
						inputVariants({
							size,
							hasEnd: copy ? true : undefined,
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

export const TextInput = Object.assign(TextInputRoot, {
	Skeleton: InputSkeleton,
});
