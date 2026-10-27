"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	useModalSubmission,
} from "@/components/ui/overlays/modal/ModalShell";
import {
	Button,
	type ButtonTone,
	type ButtonVariant,
} from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";

export type ConfirmationModalDetail = {
	description: string;
	label: string;
};

export type ConfirmationModalFailure = { ok: false; message: string };

export type ConfirmationModalProps = {
	title: string;
	description: string;
	confirmLabel: string;
	confirmTone?: ButtonTone;
	confirmVariant?: ButtonVariant;
	details?: readonly ConfirmationModalDetail[];
	onConfirm: () => unknown;
	onClose: () => void;
	onCloseDisabledChange?: (disabled: boolean) => void;
	warning?: string;
};

export function ConfirmationModal({
	title,
	description,
	confirmLabel,
	confirmTone = "danger",
	confirmVariant = "secondary",
	details,
	onConfirm,
	onClose,
	onCloseDisabledChange,
	warning,
}: ConfirmationModalProps) {
	const impactTitleId = React.useId();
	const [error, setError] = React.useState<string | null>(null);
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();

	async function handleConfirm() {
		if (!beginSubmission()) return;
		onCloseDisabledChange?.(true);
		setError(null);
		let shouldEndSubmission = true;
		try {
			const shouldClose = await onConfirm();
			if (
				typeof shouldClose === "object" &&
				shouldClose !== null &&
				"ok" in shouldClose &&
				shouldClose.ok === false &&
				"message" in shouldClose &&
				typeof shouldClose.message === "string"
			) {
				setError(shouldClose.message);
			} else if (shouldClose !== false) {
				onCloseDisabledChange?.(false);
				onClose();
				shouldEndSubmission = false;
			}
		} catch {
			setError("This action could not be completed. Try again.");
		} finally {
			if (shouldEndSubmission) {
				endSubmission();
				onCloseDisabledChange?.(false);
			}
		}
	}

	return (
		<>
			<ModalHeader
				closeDisabled={isSubmitting}
				leadingIcon={
					<Icon name="warning" size="sm" className="text-danger-text" />
				}
			>
				<ModalTitle>{title}</ModalTitle>
				<ModalDescription>{description}</ModalDescription>
			</ModalHeader>
			{details?.length || warning || error ? (
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
					{error ? <InlineError>{error}</InlineError> : null}
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
					tone={confirmTone}
					variant={confirmVariant}
				>
					{confirmLabel}
				</Button>
			</ModalFooter>
		</>
	);
}
