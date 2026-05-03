// components/ui/input/EditableTextInput.tsx
"use client";

import * as React from "react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import type { IconName } from "../icons/Icon";
import { Button, type ButtonProps } from "../primitives/Button";
import { Field } from "../primitives/Field";
import {
	InputFrame,
	type InputFrameSize,
	inputVariants,
} from "../primitives/InputFrame";
import { Text, type TextProps } from "../primitives/Text";

type EditableTextInputProps = {
	value: string;
	onSubmit: (value: string) => Promise<void> | void;
	validate?: (value: string) => string | null;
	normalizeValue?: (value: string) => string;
	id?: string;
	name?: string;
	disabled?: boolean;
	ariaLabel: string;
	editAriaLabel?: string;
	submitAriaLabel?: string;
	cancelAriaLabel?: string;
	size?: InputFrameSize;
	displayButtonVariant?: ButtonProps["variant"];
	displayButtonSize?: ButtonProps["size"];
	displayTextVariant?: TextProps["variant"];
	displayTextTone?: TextProps["tone"];
	displayTrailingIcon?: IconName;
	displayClassName?: string;
	displayContentClassName?: string;
	displayTextClassName?: string;
	displayStyle?: React.CSSProperties;
	formClassName?: string;
	fieldClassName?: string;
	frameClassName?: string;
	inputClassName?: string;
	animateValueChanges?: boolean;
	animationKey?: string | number;
};

function defaultNormalizeValue(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function errorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unable to save.";
}

export function EditableTextInput({
	value,
	onSubmit,
	validate,
	normalizeValue = defaultNormalizeValue,
	id,
	name,
	disabled,
	ariaLabel,
	editAriaLabel = ariaLabel,
	submitAriaLabel = "Save",
	cancelAriaLabel = "Cancel",
	size = "sm",
	displayButtonVariant = "ghost",
	displayButtonSize = "md",
	displayTextVariant = "body",
	displayTextTone,
	displayTrailingIcon,
	displayClassName,
	displayContentClassName,
	displayTextClassName,
	displayStyle,
	formClassName,
	fieldClassName,
	frameClassName,
	inputClassName,
	animateValueChanges,
	animationKey,
}: EditableTextInputProps) {
	const fallbackId = React.useId();
	const inputId = id ?? name ?? fallbackId;
	const [editing, setEditing] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [draft, setDraft] = React.useState(value);
	const [internalError, setInternalError] = React.useState<string | null>(null);
	const [animatedValue, setAnimatedValue] = React.useState(value);
	const [animating, setAnimating] = React.useState(false);
	const [reservedWidth, setReservedWidth] = React.useState<number | null>(null);
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const measureRef = React.useRef<HTMLSpanElement | null>(null);
	const previousAnimationKeyRef = React.useRef(animationKey);
	const motionAllowed = useMotionAllowed(true);
	const messageId = internalError ? `${inputId}-message` : undefined;
	const measuredValue = value;

	React.useEffect(() => {
		if (editing) return;
		setDraft(value);
		setInternalError(null);
	}, [editing, value]);

	React.useEffect(() => {
		if (!editing) return;
		const frame = window.requestAnimationFrame(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});

		return () => window.cancelAnimationFrame(frame);
	}, [editing]);

	React.useLayoutEffect(() => {
		if (!measuredValue) {
			setReservedWidth(null);
			return;
		}
		const width = measureRef.current?.offsetWidth;
		if (!width) return;
		setReservedWidth(Math.ceil(width) + (displayTrailingIcon ? 28 : 0));
	}, [measuredValue, displayTrailingIcon]);

	React.useEffect(() => {
		const keyChanged = animationKey !== previousAnimationKeyRef.current;
		previousAnimationKeyRef.current = animationKey;

		if (
			!animateValueChanges ||
			!keyChanged ||
			editing ||
			!motionAllowed ||
			value.length === 0
		) {
			setAnimatedValue(value);
			setAnimating(false);
			return;
		}

		let index = 0;
		setAnimating(true);
		setAnimatedValue("");

		const interval = window.setInterval(() => {
			index += 1;
			setAnimatedValue(value.slice(0, index));
			if (index >= value.length) {
				window.clearInterval(interval);
				window.setTimeout(() => setAnimating(false), 120);
			}
		}, 24);

		return () => {
			window.clearInterval(interval);
			setAnimating(false);
		};
	}, [animateValueChanges, animationKey, editing, motionAllowed, value]);

	function startEditing() {
		if (disabled || saving) return;
		setDraft(value);
		setInternalError(null);
		setEditing(true);
	}

	function cancelEditing() {
		setDraft(value);
		setInternalError(null);
		setEditing(false);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (saving) return;

		const nextValue = normalizeValue(draft);
		const validationError = validate?.(nextValue) ?? null;
		if (validationError) {
			setInternalError(validationError);
			return;
		}

		if (nextValue === value) {
			cancelEditing();
			return;
		}

		setSaving(true);
		setInternalError(null);
		setEditing(false);

		try {
			await onSubmit(nextValue);
		} catch (error) {
			setDraft(nextValue);
			setInternalError(errorMessage(error));
			setEditing(true);
		} finally {
			setSaving(false);
		}
	}

	function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "Escape") return;
		event.preventDefault();
		cancelEditing();
	}

	if (editing) {
		return (
			<form onSubmit={handleSubmit} className={formClassName}>
				<Field
					inputId={inputId}
					messageId={messageId}
					message={internalError}
					tone={internalError ? "error" : "default"}
					disableMessage={!internalError}
					className={fieldClassName}
				>
					<InputFrame
						size={size}
						tone={internalError ? "error" : "default"}
						disabled={saving || disabled}
						fullWidth
						className={frameClassName}
						contentClassName="flex min-w-0 items-center"
						end={
							<div className="flex items-center gap-1">
								<Button
									type="submit"
									variant="ghost"
									size="icon-sm"
									aria-label={submitAriaLabel}
									leadingIcon="check"
									loading={saving}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={cancelAriaLabel}
									leadingIcon="close"
									disabled={saving || disabled}
									onClick={cancelEditing}
								/>
							</div>
						}
					>
						<input
							ref={inputRef}
							id={inputId}
							name={name}
							aria-label={editAriaLabel}
							aria-invalid={Boolean(internalError)}
							aria-describedby={messageId}
							value={draft}
							onChange={(event) => {
								setDraft(event.target.value);
								if (internalError) setInternalError(null);
							}}
							onKeyDown={handleInputKeyDown}
							disabled={saving || disabled}
							className={[
								inputVariants({
									size,
									hasEnd: true,
									disabled: saving || disabled ? true : undefined,
								}),
								inputClassName,
							]
								.filter(Boolean)
								.join(" ")}
						/>
					</InputFrame>
				</Field>
			</form>
		);
	}

	const animationStyle =
		animating && reservedWidth
			? { width: reservedWidth, maxWidth: "100%" }
			: undefined;

	return (
		<span className="relative inline-flex max-w-full">
			<span
				ref={measureRef}
				aria-hidden={true}
				className="pointer-events-none invisible absolute whitespace-nowrap"
			>
				<Text as="span" variant={displayTextVariant} tone={displayTextTone}>
					{value}
				</Text>
			</span>
			<Button
				type="button"
				variant={displayButtonVariant}
				size={displayButtonSize}
				textVariant={displayTextVariant}
				textTone={displayTextTone}
				trailingIcon={displayTrailingIcon}
				aria-label={ariaLabel}
				disabled={disabled || saving}
				className={displayClassName}
				contentClassName={displayContentClassName}
				textClassName={displayTextClassName}
				style={{ ...displayStyle, ...animationStyle }}
				onClick={startEditing}
			>
				{animatedValue}
			</Button>
		</span>
	);
}
