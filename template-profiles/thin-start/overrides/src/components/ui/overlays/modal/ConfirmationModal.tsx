"use client";

import * as React from "react";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	useModalSubmission,
} from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

export type ConfirmationModalDetail = {
	description: string;
	label: string;
};

type ConfirmationModalProps = {
	confirmLabel: string;
	confirmTone?: React.ComponentProps<typeof Button>["tone"];
	confirmVariant?: React.ComponentProps<typeof Button>["variant"];
	description: string;
	details?: readonly ConfirmationModalDetail[];
	onClose: () => void;
	onCloseDisabledChange?: (disabled: boolean) => void;
	onConfirm: () => unknown;
	title: string;
	warning?: string;
};

export function ConfirmationModal({
	confirmLabel,
	confirmTone = "danger",
	confirmVariant = "secondary",
	description,
	details,
	onClose,
	onCloseDisabledChange,
	onConfirm,
	title,
	warning,
}: ConfirmationModalProps) {
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();

	React.useEffect(() => {
		onCloseDisabledChange?.(isSubmitting);
		return () => onCloseDisabledChange?.(false);
	}, [isSubmitting, onCloseDisabledChange]);

	async function handleConfirm() {
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
	}

	return (
		<>
			<ModalHeader
				closeDisabled={isSubmitting}
				leadingIcon={
					<span aria-hidden className="text-danger">
						!
					</span>
				}
			>
				<ModalTitle>{title}</ModalTitle>
				<ModalDescription>{description}</ModalDescription>
			</ModalHeader>
			{details?.length || warning ? (
				<ModalContent className="grid gap-4">
					{details?.length ? (
						<dl className="grid">
							{details.map((detail) => (
								<div
									className="grid gap-1 border-t border-border/70 py-3 first:border-t-0 first:pt-0 last:pb-0"
									key={detail.label}
								>
									<Text as="dt" variant="support">
										{detail.label}
									</Text>
									<Text as="dd" tone="muted" variant="support">
										{detail.description}
									</Text>
								</div>
							))}
						</dl>
					) : null}
					{warning ? <Text className="text-danger">{warning}</Text> : null}
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
					loading={isSubmitting}
					onClick={handleConfirm}
					tone={confirmTone}
					type="button"
					variant={confirmVariant}
				>
					{confirmLabel}
				</Button>
			</ModalFooter>
		</>
	);
}
