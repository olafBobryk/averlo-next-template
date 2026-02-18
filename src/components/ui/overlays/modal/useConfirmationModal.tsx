"use client";

import * as React from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useModal } from "./useModal";

type OpenConfirmationOptions = {
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void | Promise<void>;
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
						onConfirm={onConfirm}
						onClose={close}
						warning={warning}
					/>
				),
				targetId ? { portalTargetId: targetId } : undefined,
			);
		},
		[openModal, defaultPortalTargetId],
	);

	return { openConfirmation };
}
