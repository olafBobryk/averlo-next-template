"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import { Button, type ButtonVariant } from "@/components/ui/primitives/Button";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";

export type ConfirmationModalDetail = {
	description: string;
	label: string;
};

export type ConfirmationModalProps = {
	title: string;
	description: string;
	confirmLabel: string;
	confirmVariant?: ButtonVariant;
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
	const impactTitleId = React.useId();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	async function handleConfirm() {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const shouldClose = await onConfirm();
			if (shouldClose !== false) onClose();
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<ModalHeader
				closeDisabled={isSubmitting}
				leadingIcon={<Icon name="warning" size="sm" className="text-danger" />}
			>
				<ModalTitle>{title}</ModalTitle>
				<ModalDescription>{description}</ModalDescription>
			</ModalHeader>
			{details?.length || warning ? (
				<ModalContent className="grid gap-4">
					{details?.length ? (
						<section className="grid gap-3" aria-labelledby={impactTitleId}>
							<Text
								as="h3"
								className="font-medium"
								id={impactTitleId}
								variant="support"
							>
								What will change
							</Text>
							<dl className="grid">
								{details.map((detail) => (
									<div
										className="grid gap-1 border-t border-border/70 py-3 first:border-t-0 first:pt-0 last:pb-0"
										key={detail.label}
									>
										<dt className="text-sm font-medium leading-6">
											{detail.label}
										</dt>
										<dd className="text-sm leading-6 text-muted-foreground">
											{detail.description}
										</dd>
									</div>
								))}
							</dl>
						</section>
					) : null}
					{warning ? (
						<StatusMessage tone="danger">{warning}</StatusMessage>
					) : null}
				</ModalContent>
			) : null}
			<ModalFooter>
				<Button
					disabled={isSubmitting}
					onClick={onClose}
					type="button"
					variant="ghost"
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
			</ModalFooter>
		</>
	);
}
