// components/ui/floating/modal/useModal.tsx
"use client";

import { useCallback } from "react";
import { closeAllModals, closeModal, openModal, type OpenModalOptions } from "@/lib/modal";
import type { ModalRenderFn } from "@/lib/modal";

export function useModal() {
	const handleOpen = useCallback(
		(render: ModalRenderFn, options?: OpenModalOptions) => openModal(render, options),
		[],
	);

	const handleClose = useCallback((id: string) => closeModal(id), []);

	const handleCloseAll = useCallback(() => closeAllModals(), []);

	return {
		openModal: handleOpen,
		closeModal: handleClose,
		closeAll: handleCloseAll,
	};
}

// TODO: Add project-specific convenience wrappers here (e.g., standardized alert modals).
