"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";
import HeaderCompact from "./HeaderCompact";
import HeaderFull from "./HeaderFull";

const TOP_SCROLL_NOISE_PX = 2;

type HeaderProps = {
	className?: string;
	layout: SiteLayoutDocument["header"];
};

function getIsScrolled() {
	const root = document.scrollingElement ?? document.documentElement;
	const scrollY = Math.max(
		0,
		window.scrollY,
		window.pageYOffset,
		root.scrollTop,
		document.documentElement.scrollTop,
		document.body.scrollTop,
	);

	return scrollY > TOP_SCROLL_NOISE_PX;
}

export default function Header({ className = "", layout }: HeaderProps) {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		let frameId: number | null = null;
		let followUntil = 0;

		const measure = () => {
			setIsScrolled((current) => {
				const next = getIsScrolled();
				return current === next ? current : next;
			});
		};

		const scheduleMeasure = () => {
			if (frameId !== null) return;

			frameId = window.requestAnimationFrame(() => {
				frameId = null;
				measure();

				if (performance.now() < followUntil) {
					scheduleMeasure();
				}
			});
		};

		const handleScrollIntent = () => {
			followUntil = performance.now() + 700;
			scheduleMeasure();
		};

		measure();
		window.addEventListener("scroll", scheduleMeasure, { passive: true });
		document.addEventListener("scroll", scheduleMeasure, {
			capture: true,
			passive: true,
		});
		window.addEventListener("wheel", handleScrollIntent, { passive: true });
		window.addEventListener("touchmove", handleScrollIntent, { passive: true });
		window.addEventListener("touchend", handleScrollIntent, { passive: true });
		window.addEventListener("keydown", handleScrollIntent);
		window.addEventListener("hashchange", handleScrollIntent);
		document.addEventListener(
			"scrollcontroller:anchor-scroll",
			handleScrollIntent,
		);

		return () => {
			if (frameId !== null) {
				window.cancelAnimationFrame(frameId);
			}
			window.removeEventListener("scroll", scheduleMeasure);
			document.removeEventListener("scroll", scheduleMeasure, {
				capture: true,
			});
			window.removeEventListener("wheel", handleScrollIntent);
			window.removeEventListener("touchmove", handleScrollIntent);
			window.removeEventListener("touchend", handleScrollIntent);
			window.removeEventListener("keydown", handleScrollIntent);
			window.removeEventListener("hashchange", handleScrollIntent);
			document.removeEventListener(
				"scrollcontroller:anchor-scroll",
				handleScrollIntent,
			);
		};
	}, []);

	useEffect(() => {
		void pathname;
		const frameId = window.requestAnimationFrame(() => {
			setIsScrolled(getIsScrolled());
		});

		return () => {
			window.cancelAnimationFrame(frameId);
		};
	}, [pathname]);

	return (
		<div className={className}>
			<div className="hidden lg:block">
				<HeaderFull isScrolled={isScrolled} layout={layout} />
			</div>
			<div className="block lg:hidden">
				<HeaderCompact isScrolled={isScrolled} layout={layout} />
			</div>
		</div>
	);
}
