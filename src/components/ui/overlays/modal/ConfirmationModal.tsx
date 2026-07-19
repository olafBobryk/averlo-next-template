"use client";

import * as React from "react";
import { Warning } from "@/components/ui/misc/Warning";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Text } from "@/components/ui/primitives/Text";

type ConfirmationModalProps = {
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void | Promise<void>;
	onClose: () => void;
	warning?: string;
};

export function ConfirmationModal({
	title,
	description,
	confirmLabel,
	onConfirm,
	onClose,
	warning,
}: ConfirmationModalProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleConfirm = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			await onConfirm();
		} finally {
			setIsSubmitting(false);
			onClose();
		}
	};

	return (
		<div className="flex flex-col gap-[20px]">
			<div className="flex flex-col gap-[5px] text-center">
				<Text as="h2" variant="headingMd">
					{title}
				</Text>
				<Text variant="body" tone="muted">
					{description}
				</Text>
			</div>
			{warning ? (
				<Warning
					variant="card"
					tone="warning"
					message={warning}
					className="w-full"
				/>
			) : null}
			<Divider />
			<div className="flex justify-between gap-3">
				<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleConfirm}
					loading={isSubmitting}
					disabled={isSubmitting}
					trailingIcon="check"
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	);
}
