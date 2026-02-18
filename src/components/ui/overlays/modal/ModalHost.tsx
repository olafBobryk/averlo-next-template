// components/ui/overlays/modal/ModalHost.tsx
"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ModalShell } from "./ModalShell";
import {
	MODAL_CLOSE_ALL_EVENT,
	MODAL_CLOSE_EVENT,
	MODAL_OPEN_EVENT,
	type ModalRenderFn,
	type OpenModalOptions,
	closeModal as dispatchClose,
} from "@/lib/modal";

type ActiveModal = {
	id: string;
	render: ModalRenderFn;
	options?: OpenModalOptions;
};

export function ModalHost() {
	const [modals, setModals] = useState<ActiveModal[]>([]);

	const removeModal = useCallback((id: string) => {
		setModals((prev) => prev.filter((modal) => modal.id !== id));
	}, []);

	useEffect(() => {
		const handleOpen = (event: Event) => {
			const { id, render, options } = (event as CustomEvent<ActiveModal>).detail;
			setModals((prev) => [...prev, { id, render, options }]);
		};

		const handleClose = (event: Event) => {
			const { id } = (event as CustomEvent<{ id: string }>).detail;
			removeModal(id);
		};

		const handleCloseAll = () => setModals([]);

		window.addEventListener(MODAL_OPEN_EVENT, handleOpen as EventListener);
		window.addEventListener(MODAL_CLOSE_EVENT, handleClose as EventListener);
		window.addEventListener(MODAL_CLOSE_ALL_EVENT, handleCloseAll);

		return () => {
			window.removeEventListener(MODAL_OPEN_EVENT, handleOpen as EventListener);
			window.removeEventListener(MODAL_CLOSE_EVENT, handleClose as EventListener);
			window.removeEventListener(MODAL_CLOSE_ALL_EVENT, handleCloseAll);
		};
	}, [removeModal]);

	return (
		<AnimatePresence>
			{modals.map(({ id, render, options }) => (
				<ModalShell
					key={id}
					onClose={() => {
						removeModal(id);
						dispatchClose(id);
					}}
					portalTargetId={options?.portalTargetId}
					panelClassName={options?.panelClassName}
					wrapperClassName={options?.wrapperClassName}
					backdropClassName={options?.backdropClassName}
					panelStyle={options?.panelStyle}
				>
					{render({
						close: () => {
							removeModal(id);
							dispatchClose(id);
						},
					})}
				</ModalShell>
			))}
		</AnimatePresence>
	);
}

// TODO: If your project wants global modal shortcuts (e.g., close on route change), hook them up via the event helpers in lib/modal.
