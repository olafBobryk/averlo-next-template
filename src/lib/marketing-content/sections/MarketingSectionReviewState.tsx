"use client";

import { useEffect } from "react";

type MarketingSectionReviewStateProps = {
	enabled?: boolean;
};

const SECTION_REVIEW_ATTRIBUTE = "data-section-review";

export function MarketingSectionReviewState({
	enabled = false,
}: MarketingSectionReviewStateProps) {
	useEffect(() => {
		const shouldInstall = enabled || process.env.NODE_ENV !== "production";

		if (!shouldInstall) {
			return;
		}

		const root = document.documentElement;
		let isShortcutHeld = false;

		const syncState = () => {
			if (enabled || isShortcutHeld) {
				root.setAttribute(SECTION_REVIEW_ATTRIBUTE, "active");
				return;
			}

			root.removeAttribute(SECTION_REVIEW_ATTRIBUTE);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!event.altKey || !event.shiftKey) {
				return;
			}

			isShortcutHeld = true;
			syncState();
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.altKey && event.shiftKey) {
				return;
			}

			isShortcutHeld = false;
			syncState();
		};

		const handleBlur = () => {
			isShortcutHeld = false;
			syncState();
		};

		syncState();
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("blur", handleBlur);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("blur", handleBlur);
			root.removeAttribute(SECTION_REVIEW_ATTRIBUTE);
		};
	}, [enabled]);

	return null;
}
