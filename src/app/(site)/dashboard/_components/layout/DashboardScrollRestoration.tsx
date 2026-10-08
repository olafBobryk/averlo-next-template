"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const positions = new Map<string, number>();

/** The workspace replaces document scrolling; remember each route's position. */
export function DashboardScrollRestoration({ enabled }: { enabled: boolean }) {
	const pathname = usePathname();
	useLayoutEffect(() => {
		if (!enabled) return;
		const main = document.getElementById("dashboard-main");
		if (!main) return;
		main.scrollTop = positions.get(pathname) ?? 0;
		const frame = requestAnimationFrame(() => {
			if (!window.location.hash) return;
			try {
				document
					.getElementById(decodeURIComponent(window.location.hash.slice(1)))
					?.scrollIntoView();
			} catch {
				/* Invalid URL fragments do not block navigation. */
			}
		});
		return () => {
			cancelAnimationFrame(frame);
			positions.set(pathname, main.scrollTop);
		};
	}, [pathname, enabled]);
	return null;
}
