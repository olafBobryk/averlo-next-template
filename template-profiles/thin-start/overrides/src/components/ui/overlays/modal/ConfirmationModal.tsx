"use client";

import type * as React from "react";
import { useModalSubmission } from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

export type ConfirmationModalDetail = {
	description: string;
	label: string;
};

type ConfirmationModalProps = {
	title: string;
	description: string;
	confirmLabel: string;
	confirmVariant?: React.ComponentProps<typeof Button>["variant"];
	details?: readonly ConfirmationModalDetail[];
	onConfirm: () => unknown;
	onClose: () => void;
	warning?: string;
};

export function ConfirmationModal({
	title,
	description,
	confirmLabel,
	confirmVariant = "danger",
	details,
	onConfirm,
	onClose,
	warning,
}: ConfirmationModalProps) {
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();

	const handleConfirm = async () => {
		if (!beginSubmission()) return;
		let shouldEndSubmission = true;
		try {
			const shouldClose = await onConfirm();
			if (shouldClose !== false) {
				onClose();
				shouldEndSubmission = false;
			}
		} finally {
			if (shouldEndSubmission) endSubmission();
		}
	};

	return (
		<div className="grid gap-5">
			<div className="grid gap-2">
				<Text as="h2" variant="heading">
					{title}
				</Text>
				<Text tone="muted">{description}</Text>
				{details?.length ? (
					<dl className="grid divide-y divide-border rounded-md border border-border bg-surface px-4">
						{details.map((detail) => (
							<div className="grid gap-1 py-3" key={detail.label}>
								<dt className="text-sm font-medium">{detail.label}</dt>
								<dd className="text-sm text-muted-foreground">
									{detail.description}
								</dd>
							</div>
						))}
					</dl>
				) : null}
				{warning ? <Text className="text-danger">{warning}</Text> : null}
			</div>
			<div className="flex justify-end gap-2">
				<Button
					disabled={isSubmitting}
					type="button"
					variant="ghost"
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					type="button"
					loading={isSubmitting}
					onClick={handleConfirm}
					variant={confirmVariant}
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	);
}
