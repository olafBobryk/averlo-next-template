"use client";

import * as React from "react";
import type { ButtonVariant } from "@/components/ui/primitives/Button";
import {
	ConfirmationModal,
	type ConfirmationModalDetail,
} from "./ConfirmationModal";
import { useModal } from "./useModal";

type OpenConfirmationOptions = {
	title: string;
	description: string;
	confirmLabel: string;
	confirmVariant?: ButtonVariant;
	details?: readonly ConfirmationModalDetail[];
	onConfirm: () => unknown;
	portalTargetId?: string;
	warning?: string;
};

export function useConfirmationModal(defaultPortalTargetId?: string) {
	const { openModal } = useModal();

	const openConfirmation = React.useCallback(
		({
			title,
			description,
			confirmLabel,
			confirmVariant,
			details,
			onConfirm,
			portalTargetId,
			warning,
		}: OpenConfirmationOptions) => {
			const targetId = portalTargetId ?? defaultPortalTargetId;

			openModal(
				({ close }) => (
					<ConfirmationModal
						title={title}
						description={description}
						confirmLabel={confirmLabel}
						confirmVariant={confirmVariant}
						details={details}
						onConfirm={onConfirm}
						onClose={close}
						warning={warning}
					/>
				),
				{ ariaLabel: title, portalTargetId: targetId },
			);
		},
		[openModal, defaultPortalTargetId],
	);

	return { openConfirmation };
}
