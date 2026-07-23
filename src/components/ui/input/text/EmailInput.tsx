// components/ui/input/text/EmailInput.tsx
"use client";

import * as React from "react";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { Button } from "@/components/ui/primitives/Button";
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
	copy?: boolean;
	onCopy?: (value: string) => void | Promise<void>;
	copyAriaLabel?: string;
	copyToastMessage?: string | false;

	className?: string;
	inputClassName?: string;
	size?: InputFrameSize;
};

type EmailInputSkeletonProps = Pick<
	EmailInputProps,
	"className" | "description" | "label" | "required" | "size"
> & {
	value?: React.ReactNode;
};

function EmailInputRoot({
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
	copy,
	onCopy,
	copyAriaLabel = "Copy to clipboard",
	copyToastMessage,
	className,
	inputClassName,
	size,
}: EmailInputProps) {
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
		if (validate) setClientError(null);
		onChange?.(e.target.value);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
		if (!validate) return;
		setClientError(validate(e.target.value));
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

function EmailInputSkeleton({
	className,
	description,
	label,
	required,
	size,
	value = "operator@averlo.local",
}: EmailInputSkeletonProps) {
	return (
		<Field.Skeleton
			className={className}
			description={description}
			fullWidth
			label={label}
			required={required}
			size={size}
		>
			{value}
		</Field.Skeleton>
	);
}

export const EmailInput = Object.assign(EmailInputRoot, {
	Skeleton: EmailInputSkeleton,
});
