"use client";

import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Heading } from "@/components/ui/primitives/Heading";
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
				<Heading size="md" as="h2">
					{title}
				</Heading>
				<Text variant="muted">{description}</Text>
			</div>
			{warning && (
				<div className="rounded-[12px] border border-danger/20 bg-danger/10 px-4 py-3">
					<Text variant="muted" className="text-danger">
						{warning}
					</Text>
				</div>
			)}
			<div className="h-px rounded-full bg-border/15" />
			<div className="flex justify-between gap-3">
				<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleConfirm}
					disabled={isSubmitting}
					trailingIcon="check"
				>
					{isSubmitting ? "Working..." : confirmLabel}
				</Button>
			</div>
		</div>
	);
}
