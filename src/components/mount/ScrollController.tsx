"use client";

import Lenis from "lenis";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	useMotionDriver,
	useMotionDriverReady,
} from "@/components/ui/foundations/motionDriverContext";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { gsap, ScrollTrigger } from "@/components/ui/motion/runtime/gsap";
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
		window.scrollTo(0, startY + deltaY * easeOutQuart(progress));
		if (progress < 1) frameId = window.requestAnimationFrame(tick);
	};

	frameId = window.requestAnimationFrame(tick);
	return () => window.cancelAnimationFrame(frameId);
}

function getTargetTop(element: HTMLElement) {
	return window.scrollY + element.getBoundingClientRect().top;
}

function findHashTarget(hash: string) {
	if (!hash) return null;
	try {
		return document.getElementById(decodeURIComponent(hash.slice(1)));
	} catch {
		return null;
	}
}

function getMaxScrollY() {
	const root = document.scrollingElement ?? document.documentElement;
	return Math.max(0, root.scrollHeight - window.innerHeight);
}

function getScrollableParent(start: Element | null) {
	let current = start instanceof HTMLElement ? start : null;
	while (current && current !== document.body) {
		const style = window.getComputedStyle(current);
		const canScroll =
			(style.overflowY === "auto" || style.overflowY === "scroll") &&
			current.scrollHeight > current.clientHeight;
		if (canScroll) return current;
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
	const target = findHashTarget(hash);
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
	const driver = useMotionDriver();
	const ready = useMotionDriverReady();
	if (!ready) return null;
	return driver === "hybrid" ? (
		<HybridScrollController />
	) : (
		<MotionScrollController />
	);
}

function MotionScrollController() {
	const pathname = usePathname();
	const settings = useSettingsContext();
	const allowed = useMotionAllowed(true);
	const disabled = useMotionDisableOverride();
	const motionAllowed = allowed && !disabled;
	const isFirstRouteRef = useRef(true);
	const historyNavigation = useRef<string | null>(null);
	useEffect(() => {
		const onPop = () => {
			historyNavigation.current = window.location.pathname;
		};
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
	}, []);
	const cancelScrollRef = useRef<(() => void) | null>(null);
	const wheelFrameRef = useRef<number | null>(null);
	const wheelTargetRef = useRef(0);
	const smoothScrollDisabled = settings?.smoothScrollDisabled ?? false;
	const coarse = useCoarsePointer();
	const smoothScrollEnabled =
		SCROLL_CONFIG.enableSmoothScroll &&
		motionAllowed &&
		!smoothScrollDisabled &&
		!coarse;
	useTransportDiagnostic(smoothScrollEnabled ? "motion" : "native");

	useEffect(() => {
		if (!smoothScrollEnabled) return;

		const stopWheelAnimation = () => {
			if (wheelFrameRef.current !== null) {
				window.cancelAnimationFrame(wheelFrameRef.current);
				wheelFrameRef.current = null;
			}
		};
		const tick = () => {
			if (isScrollLocked()) {
				stopWheelAnimation();
				return;
			}
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
			if (wheelFrameRef.current === null) {
				wheelFrameRef.current = window.requestAnimationFrame(tick);
			}
		};
		const handleWheel = (event: WheelEvent) => {
			if (event.defaultPrevented || event.ctrlKey || isScrollLocked()) return;
			if (
				(event.target as Element | null)?.closest(
					".mapboxgl-map, .maplibregl-map, [data-lenis-prevent]",
				)
			)
				return;
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
			if (wheelFrameRef.current === null)
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
		const restoringHistory = historyNavigation.current === pathname;
		historyNavigation.current = null;
		if (restoringHistory) return;
		if (isFirstRouteRef.current) {
			isFirstRouteRef.current = false;
			return;
		}
		const frame = requestAnimationFrame(() => {
			cancelScrollRef.current?.();
			cancelScrollRef.current = null;
			if (wheelFrameRef.current !== null) {
				window.cancelAnimationFrame(wheelFrameRef.current);
				wheelFrameRef.current = null;
			}
			wheelTargetRef.current = 0;
			if (!scrollToHash(window.location.hash, false, cancelScrollRef)) {
				window.scrollTo(0, 0);
			}
		});
		return () => cancelAnimationFrame(frame);
	}, [pathname]);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return;
			const anchor = (event.target as Element | null)?.closest("a[href]");
			if (
				anchor?.hasAttribute("download") ||
				(anchor?.getAttribute("target") &&
					anchor.getAttribute("target") !== "_self")
			)
				return;
			const href = anchor?.getAttribute("href");
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
				url.search !== window.location.search ||
				!url.hash
			) {
				return;
			}
			const target = findHashTarget(url.hash);
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

function HybridScrollController() {
	const pathname = usePathname();
	const settings = useSettingsContext();
	const allowed = useMotionAllowed(true);
	const disabled = useMotionDisableOverride();
	const motionAllowed = allowed && !disabled;
	const isFirstRouteRef = useRef(true);
	const historyNavigation = useRef<string | null>(null);
	useEffect(() => {
		const onPop = () => {
			historyNavigation.current = window.location.pathname;
		};
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
	}, []);
	const lenisRef = useRef<Lenis | null>(null);
	const smoothScrollDisabled = settings?.smoothScrollDisabled ?? false;
	const coarse = useCoarsePointer();
	const smoothScrollEnabled =
		SCROLL_CONFIG.enableSmoothScroll &&
		motionAllowed &&
		!smoothScrollDisabled &&
		!coarse;
	useTransportDiagnostic(smoothScrollEnabled ? "lenis" : "native");

	useEffect(() => {
		if (!smoothScrollEnabled) return;

		const lenis = new Lenis({
			duration: SCROLL_CONFIG.lenisDurationSeconds,
			easing: (progress) => Math.min(1, 1.001 - 2 ** (-10 * progress)),
			smoothWheel: true,
			allowNestedScroll: true,
			prevent: (node) =>
				node.matches("[data-lenis-prevent], .mapboxgl-map, .maplibregl-map"),
			touchMultiplier: SCROLL_CONFIG.lenisTouchMultiplier,
		});
		const updateScrollTriggers = () => ScrollTrigger.update();
		const tick = (time: number) => lenis.raf(time * 1000);

		lenisRef.current = lenis;
		const syncLock = () => {
			if (isScrollLocked()) lenis.stop();
			else lenis.start();
		};
		const observer = new MutationObserver(syncLock);
		for (const element of [document.body, document.documentElement])
			observer.observe(element, {
				attributes: true,
				attributeFilter: ["style", "data-modal-open-count"],
			});
		syncLock();
		lenis.on("scroll", updateScrollTriggers);
		gsap.ticker.add(tick);
		// Do not mutate global ticker settings: other choreography shares GSAP.
		ScrollTrigger.refresh();
		return () => {
			observer.disconnect();
			lenis.off("scroll", updateScrollTriggers);
			gsap.ticker.remove(tick);
			lenis.destroy();
			if (lenisRef.current === lenis) lenisRef.current = null;
		};
	}, [smoothScrollEnabled]);

	useEffect(() => {
		void pathname;
		const restoringHistory = historyNavigation.current === pathname;
		historyNavigation.current = null;
		if (restoringHistory) return;
		if (isFirstRouteRef.current) {
			isFirstRouteRef.current = false;
			return;
		}
		const frame = requestAnimationFrame(() => {
			const target = findHashTarget(window.location.hash);
			const top = target ? getTargetTop(target) : 0;
			const lenis = lenisRef.current;
			if (lenis) lenis.scrollTo(top, { force: true, immediate: true });
			else window.scrollTo(0, top);
			ScrollTrigger.refresh();
		});
		return () => cancelAnimationFrame(frame);
	}, [pathname]);

	useEffect(() => {
		const scrollToTarget = (target: HTMLElement, smooth: boolean) => {
			const lenis = lenisRef.current;
			if (lenis) {
				lenis.scrollTo(target, {
					duration: smooth ? SCROLL_CONFIG.anchorDurationMs / 1000 : undefined,
					force: true,
					immediate: !smooth,
				});
				return;
			}
			window.scrollTo({
				behavior: "auto",
				top: getTargetTop(target),
			});
		};
		const handleClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return;
			const anchor = (event.target as Element | null)?.closest("a[href]");
			if (
				anchor?.hasAttribute("download") ||
				(anchor?.getAttribute("target") &&
					anchor.getAttribute("target") !== "_self")
			)
				return;
			const href = anchor?.getAttribute("href");
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
				url.search !== window.location.search ||
				!url.hash
			) {
				return;
			}
			const target = findHashTarget(url.hash);
			if (!target) return;
			event.preventDefault();
			scrollToTarget(target, smoothScrollEnabled);
			window.history.pushState(null, "", url.hash);
			document.dispatchEvent(
				new CustomEvent("scrollcontroller:anchor-scroll", { bubbles: false }),
			);
		};
		const handleHashChange = () => {
			const target = findHashTarget(window.location.hash);
			if (target) scrollToTarget(target, smoothScrollEnabled);
		};

		document.addEventListener("click", handleClick, { capture: true });
		window.addEventListener("hashchange", handleHashChange);
		return () => {
			document.removeEventListener("click", handleClick, { capture: true });
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, [smoothScrollEnabled]);

	return null;
}

function isScrollLocked() {
	return [document.body, document.documentElement].some((element) => {
		// Lenis' own stopped class clips the root. Only external lock owners
		// may keep the transport stopped after their inline lock is released.
		const overflow = element.style.overflowY || element.style.overflow;
		return overflow === "hidden" || overflow === "clip";
	});
}

function useCoarsePointer() {
	const [coarse, setCoarse] = useState(true);
	useEffect(() => {
		const media = matchMedia("(pointer: coarse)");
		const update = () => setCoarse(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	return coarse;
}

function useTransportDiagnostic(transport: "motion" | "lenis" | "native") {
	useEffect(() => {
		document.documentElement.dataset.scrollTransport = transport;
		return () => {
			delete document.documentElement.dataset.scrollTransport;
		};
	}, [transport]);
}
