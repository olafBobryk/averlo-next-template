"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { gsap, ScrollTrigger } from "@/components/ui/motion/runtime/gsap";
import { SCROLL_CONFIG } from "@/config/scrollConfig";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

function getTargetTop(element: HTMLElement) {
	return window.scrollY + element.getBoundingClientRect().top;
}

function findHashTarget(hash: string) {
	if (!hash) return null;
	return document.getElementById(hash.slice(1));
}

export default function ScrollController() {
	const pathname = usePathname();
	const settings = useSettingsContext();
	const motionAllowed = useMotionAllowed(true);
	const isFirstRouteRef = useRef(true);
	const lenisRef = useRef<Lenis | null>(null);
	const smoothScrollDisabled = settings?.smoothScrollDisabled ?? false;
	const smoothScrollEnabled =
		SCROLL_CONFIG.enableSmoothScroll && motionAllowed && !smoothScrollDisabled;

	useEffect(() => {
		if (!smoothScrollEnabled) return;
		if (window.matchMedia("(pointer: coarse)").matches) return;

		const lenis = new Lenis({
			duration: SCROLL_CONFIG.durationSeconds,
			easing: (progress) => Math.min(1, 1.001 - 2 ** (-10 * progress)),
			smoothWheel: true,
			touchMultiplier: SCROLL_CONFIG.touchMultiplier,
		});
		const updateScrollTriggers = () => ScrollTrigger.update();
		const tick = (time: number) => lenis.raf(time * 1000);

		lenisRef.current = lenis;
		lenis.on("scroll", updateScrollTriggers);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);
		ScrollTrigger.refresh();

		return () => {
			lenis.off("scroll", updateScrollTriggers);
			gsap.ticker.remove(tick);
			lenis.destroy();
			if (lenisRef.current === lenis) lenisRef.current = null;
		};
	}, [smoothScrollEnabled]);

	useEffect(() => {
		void pathname;
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
				behavior: smooth ? "smooth" : "auto",
				top: getTargetTop(target),
			});
		};

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
