import clsx from "clsx";
import type * as React from "react";
import { Text } from "@/components/ui/primitives/Text";

type FieldProps = {
	children: React.ReactNode;
	className?: string;
	description?: React.ReactNode;
	error?: React.ReactNode;
	id?: string;
	label?: React.ReactNode;
};

export function Field({
	children,
	className,
	description,
	error,
	id,
	label,
}: FieldProps) {
	const descriptionId = description && id ? `${id}-description` : undefined;
	const errorId = error && id ? `${id}-error` : undefined;

	return (
		<div className={clsx("grid gap-2", className)}>
			{label ? (
				<label htmlFor={id} className="text-sm font-medium text-foreground">
					{label}
				</label>
			) : null}
			{description ? (
				<Text id={descriptionId} variant="support" tone="muted">
					{description}
				</Text>
			) : null}
			{children}
			{error ? (
				<Text
					id={errorId}
					variant="support"
					className="text-danger"
					role="alert"
				>
					{error}
				</Text>
			) : null}
		</div>
	);
}
