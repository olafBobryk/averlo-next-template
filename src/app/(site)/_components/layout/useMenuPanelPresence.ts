"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Header menu panel presence (motion H1 `masked`). The content stays fully
 * visible and the moving panel edge clips it: opening, the panel grows over
 * visible content; closing, it shrinks at once and unmounts when closed.
 *
 * The header panels cannot use `ContentPresence`: the full header resizes its
 * open content on `smooth` while presence uses one transition for opening and
 * resizing, and the compact header's box is the fixed header itself.
 */
// spec exception E-001
export function useMenuPanelPresence(open: boolean, animated: boolean) {
	const [retained, setRetained] = useState(open);
	const openRef = useRef(open);
	openRef.current = open;

	useLayoutEffect(() => {
		if (open || !animated) setRetained(open);
	}, [open, animated]);

	const onPanelComplete = useCallback(() => {
		if (!openRef.current) setRetained(false);
	}, []);

	const mounted = animated ? open || retained : open;
	return {
		/** The panel and its content are rendered. */
		mounted,
		/** The panel holds (or moves to) its open size. */
		extended: open,
		/** The content is visible whenever it is rendered. */
		visible: mounted,
		onPanelComplete,
	};
}
