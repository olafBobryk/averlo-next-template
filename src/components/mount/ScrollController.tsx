"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { SCROLL_CONFIG } from "@/config/scrollConfig";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

function easeOutQuart(progress: number) {
	return 1 - (1 - progress) ** 5;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function animateWindowScroll(
	targetY: number,
	durationMs = SCROLL_CONFIG.anchorDurationMs,
) {
	const startY = window.scrollY;
	const deltaY = targetY - startY;
	if (Math.abs(deltaY) < 1) {
		window.scrollTo(0, targetY);
		return () => {};
	}

	let frameId = 0;
	const startTime = performance.now();

	const tick = (now: number) => {
		const elapsed = now - startTime;
		const progress = Math.min(elapsed / durationMs, 1);
		const eased = easeOutQuart(progress);
		window.scrollTo(0, startY + deltaY * eased);
		if (progress < 1) {
			frameId = window.requestAnimationFrame(tick);
		}
	};

	frameId = window.requestAnimationFrame(tick);
	return () => window.cancelAnimationFrame(frameId);
}

function getTargetTop(element: HTMLElement) {
	return window.scrollY + element.getBoundingClientRect().top;
}

function getMaxScrollY() {
	const root = document.scrollingElement ?? document.documentElement;
	return Math.max(0, root.scrollHeight - window.innerHeight);
}

function getScrollableParent(start: Element | null) {
	let current = start instanceof HTMLElement ? start : null;
	while (current && current !== document.body) {
		const style = window.getComputedStyle(current);
		const overflowY = style.overflowY;
		const canScroll =
			(overflowY === "auto" || overflowY === "scroll") &&
			current.scrollHeight > current.clientHeight;
		if (canScroll) {
			return current;
		}
		current = current.parentElement;
	}
	return null;
}

function canElementConsumeDelta(element: HTMLElement, deltaY: number) {
	if (deltaY < 0) return element.scrollTop > 0;
	if (deltaY > 0) {
		return element.scrollTop + element.clientHeight < element.scrollHeight;
	}
	return false;
}

function scrollToHash(
	hash: string,
	smooth: boolean,
	cancelRef: { current: (() => void) | null },
) {
	if (!hash) return false;

	const target = document.getElementById(hash.slice(1));
	if (!target) return false;

	cancelRef.current?.();
	if (smooth) {
		cancelRef.current = animateWindowScroll(getTargetTop(target));
	} else {
		window.scrollTo(0, getTargetTop(target));
		cancelRef.current = null;
	}
	return true;
}

export default function ScrollController() {
	const pathname = usePathname();
	const settings = useSettingsContext();
	const motionAllowed = useMotionAllowed(true);
	const isFirstRouteRef = useRef(true);
	const cancelScrollRef = useRef<(() => void) | null>(null);
	const wheelFrameRef = useRef<number | null>(null);
	const wheelTargetRef = useRef(0);
	const smoothScrollDisabled = settings?.smoothScrollDisabled ?? false;
	const smoothScrollEnabled =
		SCROLL_CONFIG.enableSmoothScroll && motionAllowed && !smoothScrollDisabled;

	useEffect(() => {
		if (window.matchMedia("(pointer: coarse)").matches) return;
		if (!smoothScrollEnabled) return;

		const stopWheelAnimation = () => {
			if (wheelFrameRef.current !== null) {
				window.cancelAnimationFrame(wheelFrameRef.current);
				wheelFrameRef.current = null;
			}
		};

		const tick = () => {
			const currentY = window.scrollY;
			const delta = wheelTargetRef.current - currentY;
			if (Math.abs(delta) < 0.5) {
				window.scrollTo(0, wheelTargetRef.current);
				wheelFrameRef.current = null;
				return;
			}

			window.scrollTo(0, currentY + delta * SCROLL_CONFIG.wheelLerp);
			wheelFrameRef.current = window.requestAnimationFrame(tick);
		};

		const startWheelAnimation = () => {
			if (wheelFrameRef.current !== null) return;
			wheelFrameRef.current = window.requestAnimationFrame(tick);
		};

		const handleWheel = (event: WheelEvent) => {
			if (event.defaultPrevented || event.ctrlKey) return;
			if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

			const scrollableParent = getScrollableParent(
				event.target as Element | null,
			);
			if (
				scrollableParent &&
				canElementConsumeDelta(scrollableParent, event.deltaY)
			) {
				return;
			}

			event.preventDefault();
			cancelScrollRef.current?.();
			cancelScrollRef.current = null;
			const baseTarget =
				wheelFrameRef.current === null
					? window.scrollY
					: wheelTargetRef.current;
			wheelTargetRef.current = clamp(
				baseTarget + event.deltaY * SCROLL_CONFIG.wheelDeltaMultiplier,
				0,
				getMaxScrollY(),
			);
			startWheelAnimation();
		};

		const handleNativeScroll = () => {
			if (wheelFrameRef.current !== null) return;
			wheelTargetRef.current = window.scrollY;
		};

		wheelTargetRef.current = window.scrollY;
		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("scroll", handleNativeScroll, { passive: true });

		return () => {
			stopWheelAnimation();
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("scroll", handleNativeScroll);
		};
	}, [smoothScrollEnabled]);

	useEffect(() => {
		void pathname;
		if (isFirstRouteRef.current) {
			isFirstRouteRef.current = false;
			return;
		}

		const hash = window.location.hash;
		requestAnimationFrame(() => {
			cancelScrollRef.current?.();
			cancelScrollRef.current = null;
			if (wheelFrameRef.current !== null) {
				window.cancelAnimationFrame(wheelFrameRef.current);
				wheelFrameRef.current = null;
			}
			wheelTargetRef.current = 0;
			if (scrollToHash(hash, false, cancelScrollRef)) return;
			window.scrollTo(0, 0);
		});
	}, [pathname]);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const anchor = (event.target as Element | null)?.closest("a[href]");
			if (!anchor) return;

			const href = anchor.getAttribute("href");
			if (!href) return;

			let url: URL;
			try {
				url = new URL(href, window.location.href);
			} catch {
				return;
			}

			if (
				url.origin !== window.location.origin ||
				url.pathname !== window.location.pathname ||
				!url.hash
			) {
				return;
			}

			const target = document.getElementById(url.hash.slice(1));
			if (!target) return;

			event.preventDefault();
			if (wheelFrameRef.current !== null) {
				window.cancelAnimationFrame(wheelFrameRef.current);
				wheelFrameRef.current = null;
			}
			cancelScrollRef.current?.();
			if (smoothScrollEnabled) {
				cancelScrollRef.current = animateWindowScroll(getTargetTop(target));
			} else {
				window.scrollTo(0, getTargetTop(target));
				cancelScrollRef.current = null;
			}
			window.history.pushState(null, "", url.hash);
			document.dispatchEvent(
				new CustomEvent("scrollcontroller:anchor-scroll", { bubbles: false }),
			);
		};

		const handleHashChange = () => {
			scrollToHash(window.location.hash, smoothScrollEnabled, cancelScrollRef);
		};

		document.addEventListener("click", handleClick, { capture: true });
		window.addEventListener("hashchange", handleHashChange);

		return () => {
			cancelScrollRef.current?.();
			cancelScrollRef.current = null;
			document.removeEventListener("click", handleClick, { capture: true });
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, [smoothScrollEnabled]);

	return null;
}
