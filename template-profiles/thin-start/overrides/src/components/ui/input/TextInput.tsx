"use client";

import * as React from "react";
import { InputSkeleton } from "@/components/ui/input/InputSkeleton";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";

type TextInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"children"
> & {
	description?: React.ReactNode;
	error?: React.ReactNode;
	label?: React.ReactNode;
};

function TextInputRoot({
	className,
	description,
	error,
	id,
	label,
	...props
}: TextInputProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const errorId = error ? `${inputId}-error` : undefined;

	return (
		<Field
			id={inputId}
			label={label}
			description={description}
			error={error}
			className={className}
		>
			<InputFrame error={Boolean(error)}>
				<input
					id={inputId}
					className={inputTextClasses}
					aria-describedby={
						[descriptionId, errorId].filter(Boolean).join(" ") || undefined
					}
					aria-invalid={Boolean(error)}
					{...props}
				/>
			</InputFrame>
		</Field>
	);
}

export const TextInput = Object.assign(TextInputRoot, {
	Skeleton: InputSkeleton,
});
