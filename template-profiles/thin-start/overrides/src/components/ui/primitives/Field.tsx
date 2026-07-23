import clsx from "clsx";
import type * as React from "react";
import {
	InputFrame,
	type InputFrameSize,
	type InputFrameSkeletonProps,
} from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";

type FieldProps = {
	children: React.ReactNode;
	className?: string;
	description?: React.ReactNode;
	descriptionId?: string;
	disableMessage?: boolean;
	error?: React.ReactNode;
	id?: string;
	inputId?: string;
	label?: React.ReactNode;
	labelAction?: React.ReactNode;
	message?: React.ReactNode;
	messageId?: string;
	required?: boolean;
	tone?: "default" | "error" | "success";
};

function FieldRoot({
	children,
	className,
	description,
	descriptionId: providedDescriptionId,
	disableMessage = false,
	error,
	id,
	inputId: providedInputId,
	label,
	labelAction,
	message,
	messageId: providedMessageId,
	required,
	tone,
}: FieldProps) {
	const inputId = providedInputId ?? id;
	const resolvedMessage = message ?? error;
	const resolvedTone = tone ?? (error ? "error" : "default");
	const descriptionId =
		providedDescriptionId ??
		(description && inputId ? `${inputId}-description` : undefined);
	const messageId =
		providedMessageId ??
		(resolvedMessage && inputId ? `${inputId}-message` : undefined);

	return (
		<div className={clsx("group/field flex flex-col gap-3", className)}>
			{label || description || labelAction ? (
				<div className="flex flex-col gap-1">
					{label || labelAction ? (
						<div className="flex items-end justify-between gap-3">
							{label ? (
								<label className="text-sm text-foreground" htmlFor={inputId}>
									{label}
									{required ? <span className="text-danger"> *</span> : null}
								</label>
							) : null}
							{labelAction}
						</div>
					) : null}
					{description ? (
						<Text id={descriptionId} variant="support" tone="muted">
							{description}
						</Text>
					) : null}
				</div>
			) : null}
			{children}
			{!disableMessage && resolvedMessage ? (
				<Text
					id={messageId}
					variant="support"
					className={clsx(
						resolvedTone === "error" && "text-danger",
						resolvedTone === "success" && "text-success",
					)}
					role={resolvedTone === "error" ? "alert" : undefined}
				>
					{resolvedMessage}
				</Text>
			) : null}
		</div>
	);
}

function FieldSkeleton({
	children = "Input",
	className,
	description,
	fullWidth = true,
	inputClassName,
	label,
	radius,
	required,
	size,
}: Pick<FieldProps, "className" | "description" | "label" | "required"> & {
	children?: React.ReactNode;
	fullWidth?: boolean;
	inputClassName?: string;
	radius?: InputFrameSkeletonProps["radius"];
	size?: InputFrameSize;
}) {
	return (
		<div aria-hidden className={clsx("flex flex-col gap-3", className)}>
			{label ? (
				<Text.Skeleton>
					{label}
					{required ? " *" : ""}
				</Text.Skeleton>
			) : null}
			{description ? (
				<Text.Skeleton variant="support">{description}</Text.Skeleton>
			) : null}
			<InputFrame.Skeleton
				className={inputClassName}
				fullWidth={fullWidth}
				radius={radius}
				size={size}
			>
				{children}
			</InputFrame.Skeleton>
		</div>
	);
}

export const Field = Object.assign(FieldRoot, { Skeleton: FieldSkeleton });
