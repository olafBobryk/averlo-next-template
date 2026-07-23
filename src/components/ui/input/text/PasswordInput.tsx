// components/ui/input/text/PasswordInput.tsx
"use client";

import * as React from "react";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { Icon } from "@/components/ui/icons/Icon";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Button } from "@/components/ui/primitives/Button";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

type PasswordInputProps = {
	label: React.ReactNode;
	labelAction?: React.ReactNode;
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
	autoComplete?: string;
	showStrength?: boolean;

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

type PasswordInputSkeletonProps = Pick<
	PasswordInputProps,
	| "className"
	| "description"
	| "label"
	| "labelAction"
	| "required"
	| "showStrength"
	| "size"
> & {
	value?: React.ReactNode;
};

const PASSWORD_RULES = [
	{
		id: "length",
		label: "at least 6 characters",
		test: (value: string) => value.length >= 6,
	},
	{
		id: "uppercase",
		label: "1 uppercase letter",
		test: (value: string) => /[A-Z]/.test(value),
	},
	{
		id: "number",
		label: "1 number",
		test: (value: string) => /\d/.test(value),
	},
	{
		id: "symbol",
		label: "1 symbol",
		test: (value: string) => /[^A-Za-z0-9]/.test(value),
	},
];

function PasswordInputRoot({
	label,
	labelAction,
	description,
	placeholder,
	id,
	name,
	defaultValue,
	value,
	onChange,
	disabled,
	inputMode,
	autoComplete,
	showStrength = false,
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
}: PasswordInputProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

	const [clientError, setClientError] = React.useState<string | null>(null);
	const [isVisible, setIsVisible] = React.useState(false);
	const motionAllowed = useMotionAllowed(true);

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
	const currentValue = isControlled ? (value ?? "") : internalValue;
	const { copied, handleCopy } = useCopyAction({
		value: currentValue,
		onCopy,
		toastMessage: copyToastMessage,
	});
	const strength = React.useMemo(() => {
		const passed = PASSWORD_RULES.filter((rule) =>
			rule.test(currentValue),
		).length;
		const total = PASSWORD_RULES.length;
		const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
		return { passed, total, percent };
	}, [currentValue]);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const next = e.target.value;
		if (validate) setClientError(null);
		if (!isControlled) setInternalValue(next);
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
			labelAction={labelAction}
			description={description}
			message={derivedError ?? undefined}
			tone={tone}
			required={required}
			inputId={inputId}
			descriptionId={descriptionId}
			messageId={messageId}
			className={className}
		>
			<div className="flex flex-col gap-2.5">
				<InputFrame
					tone={tone}
					size={size}
					disabled={disabled}
					fullWidth
					end={
						<div className="flex items-center gap-2.5">
							{copyButton}
							<Button
								variant="ghost"
								size="icon-sm"
								align="center"
								onClick={() => setIsVisible((v) => !v)}
								disabled={disabled}
								aria-label={isVisible ? "Hide password" : "Show password"}
								aria-pressed={isVisible}
								className={[
									"shrink-0 relative select-none aspect-square",
									"!p-1 !rounded-[8px] max-w-fit max-h-fit ",
									"text-foreground/80 hover:text-foreground",
									"transition-all motion-micro",
									"hover:bg-[#020202]/[0.05] active:bg-[#020202]/[0.08] cursor-pointer",
								]
									.filter(Boolean)
									.join(" ")}
							>
								<IconSwap
									size="sm"
									activeIndex={isVisible ? 0 : 1}
									items={[
										{ icon: <Icon name="eye" size="md" /> },
										{ icon: <Icon name="eye-closed" size="md" /> },
									]}
								/>
								<span className="sr-only">
									{isVisible ? "Hide password" : "Show password"}
								</span>
							</Button>
						</div>
					}
				>
					<input
						id={inputId}
						name={name}
						type={isVisible ? "text" : "password"}
						inputMode={inputMode}
						autoComplete={autoComplete ?? "current-password"}
						disabled={disabled}
						placeholder={placeholder}
						required={required}
						className={[
							inputVariants({
								size,
								hasEnd: true,
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
				{showStrength ? (
					<div
						className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden"
						role="progressbar"
						aria-label="Password strength"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={strength.percent}
					>
						<div
							className={[
								"h-full rounded-full",
								motionAllowed
									? "transition-[width] motion-micro"
									: "transition-none",
							]
								.filter(Boolean)
								.join(" ")}
							style={{
								width: `${strength.percent}%`,
								backgroundColor: `color-mix(in srgb, var(--color-danger) ${100 - strength.percent}%, var(--color-success) ${strength.percent}%)`,
							}}
						/>
					</div>
				) : null}
			</div>
		</Field>
	);
}

function PasswordInputSkeleton({
	className,
	description,
	label,
	labelAction,
	required,
	showStrength = false,
	size,
	value = "demo-password",
}: PasswordInputSkeletonProps) {
	return (
		<Field
			className={className}
			description={description}
			label={label}
			labelAction={labelAction}
			required={required}
		>
			<div className="flex flex-col gap-2.5">
				<InputFrame.Skeleton fullWidth size={size}>
					{value}
				</InputFrame.Skeleton>
				{showStrength ? (
					<Skeleton className="h-1.5 w-full rounded-full" />
				) : null}
			</div>
		</Field>
	);
}

export const PasswordInput = Object.assign(PasswordInputRoot, {
	Skeleton: PasswordInputSkeleton,
});
