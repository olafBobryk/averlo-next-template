"use client";

import { useEffect } from "react";

function getForm(target: EventTarget | null) {
	if (!(target instanceof Element)) return null;
	if (target instanceof HTMLFormElement) return target;
	if (
		target instanceof HTMLButtonElement ||
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement
	) {
		return target.form;
	}
	return target.closest("form");
}

export default function FormValidationClientMount() {
	useEffect(() => {
		const disableNativeValidation = (event: Event) => {
			const form = getForm(event.target);
			if (form) form.noValidate = true;
		};
		const eventTypes = ["click", "focusin", "keydown", "pointerdown"] as const;
		for (const eventType of eventTypes) {
			document.addEventListener(eventType, disableNativeValidation, true);
		}

		return () => {
			for (const eventType of eventTypes) {
				document.removeEventListener(eventType, disableNativeValidation, true);
			}
		};
	}, []);

	return null;
}
