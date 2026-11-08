// components/ui/primitives/Field.tsx
"use client";

import * as React from "react";
import { ContentPresence } from "@/components/ui/motion/presence";
import { InputFrameSkeleton, type InputFrameSkeletonProps } from "./InputFrame";
import { Text } from "./Text";

type FieldTone = "default" | "error" | "success";

type FieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	message?: React.ReactNode;
	tone?: FieldTone;
	required?: boolean;
	inputId?: string;
	descriptionId?: string;
	messageId?: string;
	disableMessage?: boolean;
	className?: string;
	children: React.ReactNode;
	labelAction?: React.ReactNode;
};

type FieldSkeletonProps = Omit<FieldProps, "children" | "message" | "tone"> & {
	children?: React.ReactNode;
	fullWidth?: InputFrameSkeletonProps["fullWidth"];
	inputClassName?: string;
	radius?: InputFrameSkeletonProps["radius"];
	size?: InputFrameSkeletonProps["size"];
	skeletonClassName?: string;
};

function FieldRoot({
	label,
	description,
	message,
	tone = "default",
	required,
	inputId,
	descriptionId,
	messageId,
	disableMessage = false,
	className,
	children,
	labelAction,
}: FieldProps) {
	const hasMessage = Boolean(message);
	const announceMessage = tone === "error" && hasMessage;
	// Keep the last message and tone while the message region closes.
	const shown = React.useRef({ message, tone });
	if (hasMessage) shown.current = { message, tone };
	const shownTone = shown.current.tone;

	return (
		<div
			data-tone={tone}
			className={["group/field flex flex-col gap-3", className]
				.filter(Boolean)
				.join(" ")}
		>
			{label || description || labelAction ? (
				<div className="flex flex-col gap-1">
					{label || labelAction ? (
						<div className="flex items-end justify-between gap-3">
							{label ? (
								<Text
									as="label"
									variant="body"
									htmlFor={inputId}
									className="pointer-events-none"
								>
									<span className="inline-flex items-center gap-1">
										{label}
										{required ? (
											<span aria-hidden="true" className="text-danger-text">
												*
											</span>
										) : null}
									</span>
								</Text>
							) : null}
							{labelAction}
						</div>
					) : null}

					{description ? (
						<Text
							as="p"
							variant="body"
							tone="muted"
							className="text-sm"
							id={descriptionId}
						>
							{description}
						</Text>
					) : null}
				</div>
			) : null}

			{children}

			{disableMessage ? null : (
				// The negative margin cancels the column gap while the region is
				// closed; the gap returns inside the region so it opens with it.
				<div className="-mt-3">
					<ContentPresence open={hasMessage} mode="sequenced">
						<Text
							as="p"
							variant="caption"
							tone="muted"
							className={[
								"pt-3",
								shownTone === "error"
									? "!text-danger-text"
									: shownTone === "success"
										? "!text-success-text"
										: undefined,
							]
								.filter(Boolean)
								.join(" ")}
							id={hasMessage ? messageId : undefined}
							role={announceMessage ? "alert" : undefined}
							aria-live={announceMessage ? "polite" : undefined}
							aria-atomic={announceMessage ? "true" : undefined}
						>
							{hasMessage ? message : shown.current.message}
						</Text>
					</ContentPresence>
				</div>
			)}
		</div>
	);
}

export function FieldSkeleton({
	children,
	fullWidth,
	inputClassName,
	radius,
	size,
	skeletonClassName,
	...props
}: FieldSkeletonProps) {
	return (
		<FieldRoot {...props}>
			<InputFrameSkeleton
				className={inputClassName}
				fullWidth={fullWidth}
				radius={radius}
				size={size}
				skeletonClassName={skeletonClassName}
			>
				{children}
			</InputFrameSkeleton>
		</FieldRoot>
	);
}

export const Field = Object.assign(FieldRoot, { Skeleton: FieldSkeleton });
