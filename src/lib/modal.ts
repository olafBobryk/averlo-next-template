// lib/modal.ts
import type { CSSProperties, ReactNode } from "react";

export type ModalRenderFn = (helpers: { close: () => void }) => ReactNode;

export type OpenModalOptions = {
	portalTargetId?: string;
	id?: string;
	panelClassName?: string;
	panelWrapperClassName?: string;
	backdropClassName?: string;
	panelStyle?: CSSProperties;
};

type ModalOpenEventDetail = {
	id: string;
	render: ModalRenderFn;
	options?: OpenModalOptions;
};

type ModalCloseEventDetail = { id: string };

export const MODAL_OPEN_EVENT = "app-modal-open";
export const MODAL_CLOSE_EVENT = "app-modal-close";
export const MODAL_CLOSE_ALL_EVENT = "app-modal-close-all";

// TODO: Rename the event keys above if your app already has modal events in flight.

export function openModal(
	render: ModalRenderFn,
	options?: OpenModalOptions,
): string {
	if (typeof window === "undefined") return "";

	const id = options?.id ?? `modal_${Date.now()}_${Math.random().toString(16).slice(2)}`;

	window.dispatchEvent(
		new CustomEvent<ModalOpenEventDetail>(MODAL_OPEN_EVENT, {
			detail: { id, render, options },
		}),
	);

	return id;
}

export function closeModal(id: string) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent<ModalCloseEventDetail>(MODAL_CLOSE_EVENT, { detail: { id } }),
	);
}

export function closeAllModals() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event(MODAL_CLOSE_ALL_EVENT));
}
