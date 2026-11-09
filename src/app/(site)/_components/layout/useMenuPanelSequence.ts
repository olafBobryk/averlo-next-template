"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Sub-pixel tolerance for "the panel fits its content". */
const FIT_TOLERANCE_PX = 0.5;
/** Content this faint at close time is treated as already transparent. */
const TRANSPARENT_OPACITY = 0.01;

/**
 * Header menu panel sequence (motion H1 `sequenced`). Opening, the panel grows
 * first and the content fades in once the panel fits it; closing, the content
 * fades out first and then the panel closes. Content is never visible while
 * the panel clips it. Interruptions retarget from the on-screen values.
 *
 * The header panels cannot use `ContentPresence mode="sequenced"`: the full
 * header resizes its open content on `smooth` while presence uses one
 * transition for opening and resizing (and hides outgrown content), and the
 * compact header's box is the fixed header itself, which must hold its open
 * height until the content has faded out.
 */
// spec exception E-001
export function useMenuPanelSequence(open: boolean, animated: boolean) {
	const [retained, setRetained] = useState(open);
	const [fits, setFits] = useState(open);
	const [faded, setFaded] = useState(!open);
	const openRef = useRef(open);
	openRef.current = open;
	const fadedRef = useRef(faded);
	fadedRef.current = faded;
	const opacity = useRef(open ? 1 : 0);

	useLayoutEffect(() => {
		if (!animated) {
			opacity.current = open ? 1 : 0;
			setRetained(open);
			setFits(open);
			setFaded(!open);
			return;
		}
		if (open) {
			setRetained(true);
			// A panel still held open (reopened mid-fade) already fits.
			setFits(!fadedRef.current);
			setFaded(false);
			return;
		}
		setFits(false);
		// Content that never faded in lets the panel close at once.
		setFaded(opacity.current <= TRANSPARENT_OPACITY);
	}, [open, animated]);

	/** Report the panel's on-screen size against its open size. */
	const onPanelUpdate = useCallback((current: number, target: number) => {
		if (!openRef.current || !Number.isFinite(current) || !target) return;
		if (current >= target - FIT_TOLERANCE_PX) setFits(true);
	}, []);

	const onPanelComplete = useCallback(() => {
		if (openRef.current) {
			setFits(true);
			return;
		}
		if (fadedRef.current) setRetained(false);
	}, []);

	const onContentUpdate = useCallback((latest: { opacity?: unknown }) => {
		const value = Number(latest.opacity);
		if (Number.isFinite(value)) opacity.current = value;
	}, []);

	const onContentComplete = useCallback(() => {
		if (!openRef.current) setFaded(true);
	}, []);

	if (!animated) {
		return {
			mounted: open,
			extended: open,
			visible: open,
			onPanelUpdate,
			onPanelComplete,
			onContentUpdate,
			onContentComplete,
		};
	}

	return {
		/** The panel and its content are rendered. */
		mounted: open || retained,
		/** The panel holds (or moves to) its open size. */
		extended: open || (retained && !faded),
		/** The content is (or fades) visible. */
		visible: open && fits,
		onPanelUpdate,
		onPanelComplete,
		onContentUpdate,
		onContentComplete,
	};
}
