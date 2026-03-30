//TODO ready integrate.

"use client";

import { useEffect } from "react";

function disableNativeValidation(node: ParentNode | HTMLFormElement) {
	if (node instanceof HTMLFormElement) {
		node.noValidate = true;
		return;
	}

	node.querySelectorAll("form").forEach((form) => {
		form.noValidate = true;
	});
}

export default function FormValidationClientMount() {
	useEffect(() => {
		disableNativeValidation(document);

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof Element)) continue;

					if (node instanceof HTMLFormElement) {
						disableNativeValidation(node);
						continue;
					}

					disableNativeValidation(node);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, []);

	return null;
}
