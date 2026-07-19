"use client";

import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
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
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid gap-5">
			<div className="grid gap-2">
				<Text as="h2" variant="heading">
					{title}
				</Text>
				<Text tone="muted">{description}</Text>
				{warning ? <Text className="text-danger">{warning}</Text> : null}
			</div>
			<div className="flex justify-end gap-2">
				<Button type="button" variant="ghost" onClick={onClose}>
					Cancel
				</Button>
				<Button type="button" loading={isSubmitting} onClick={handleConfirm}>
					{confirmLabel}
				</Button>
			</div>
		</div>
	);
}
