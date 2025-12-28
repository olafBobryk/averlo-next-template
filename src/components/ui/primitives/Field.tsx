// components/ui/primitives/Field.tsx
"use client";

import type * as React from "react";
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
		<div
			className={["flex flex-col gap-2.5", className].filter(Boolean).join(" ")}
		>
			{label ? (
				<Text as="label" variant="body" htmlFor={inputId}>
					<span className="inline-flex items-center gap-1">
						{label}
						{required ? (
							<span aria-hidden="true" className="text-danger">
								*
							</span>
						) : null}
					</span>
				</Text>
			) : null}

			{description ? (
				<Text as="p" variant="muted" className="text-sm">
					{description}
				</Text>
			) : null}

			{children}

			<div
				className={[
					"transition-all motion-micro", // reserve one line
					message ? "max-h-[26px]" : "max-h-0",
				].join(" ")}
			>
				<Text
					as="p"
					variant="captionMuted"
					className={[
						"transition-all motion-micro mt-2.5", // reserve one line
						tone === "error"
							? "!text-danger"
							: tone === "success"
								? "!text-success"
								: "text-transparent",
					].join(" ")}
				>
					{message ?? "placeholder"}
				</Text>
			</div>
		</div>
	);
}
