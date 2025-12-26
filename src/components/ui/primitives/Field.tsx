// components/ui/primitives/Field.tsx
"use client";

import * as React from "react";
import { Text } from "./Text";

type FieldTone = "default" | "error" | "success";

type FieldProps = {
	label?: React.ReactNode;
	description?: React.ReactNode;
	message?: React.ReactNode;
	tone?: FieldTone;
	required?: boolean;
	inputId?: string;
	className?: string;
	children: React.ReactNode;
};

export function Field({
	label,
	description,
	message,
	tone = "default",
	required,
	inputId,
	className,
	children,
}: FieldProps) {
	return (
		<div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
			{label ? (
				<Text as="label" variant="bodyStrong" htmlFor={inputId}>
					<span className="inline-flex items-center gap-1">
						{label}
						{required ? <span aria-hidden="true" className="text-danger">*</span> : null}
					</span>
				</Text>
			) : null}

			{description ? (
				<Text as="p" variant="muted" className="text-sm">
					{description}
				</Text>
			) : null}

			{children}

			{message ? (
				<Text
					as="p"
					variant="captionMuted"
					className={[
						"transition-all motion-micro mt-1",
						tone === "error" ? "text-danger" : "",
						tone === "success" ? "text-success" : "",
					]
						.filter(Boolean)
						.join(" ")}
				>
					{message}
				</Text>
			) : null}
		</div>
	);
}
