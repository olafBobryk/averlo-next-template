"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { NAV_LINKS } from "@/config/navConfig";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { springs } from "@/lib/motionPresets";

export default function HeaderFull({
	className = "",
	navLinks = NAV_LINKS,
}: {
	className?: string;
	navLinks?: { name: string; link: string }[];
}) {
	const [atTop, setAtTop] = useState(false);
	const [hide, setHide] = useState(false);
	const motionAllowed = useMotionAllowed(true);
	const lastScrollRef = useRef(0);

	useEffect(() => {
		if (!motionAllowed) {
			setHide(false);
			return;
		}

		const handleScroll = () => {
			const currentY = window.scrollY;
			setAtTop(currentY <= 50);
			setHide(currentY > lastScrollRef.current && currentY > 10);
			lastScrollRef.current = currentY;
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [motionAllowed]);

	useEffect(() => {
		if (!motionAllowed) return;
		setAtTop(window.scrollY <= 50);
	}, [motionAllowed]);

	const headerClasses = [
		"h-[100px] fixed z-50 px-section pointer-events-none left-1/2 flex justify-center -translate-x-1/2 w-full group",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<header className={headerClasses} data-top={atTop} data-hide={hide}>
			<div className="max-w-section w-full flex items-center h-full">
				<div className="flex justify-between w-full h-fit">
					<Logo size="md" className="pointer-events-auto" />
					<Button
						variant="primary"
						href="/contact"
						className="pointer-events-auto"
					>
						Join Now
					</Button>
				</div>
				<div className="pointer-events-auto absolute left-1/2 top-0 flex h-[100px] -translate-x-1/2 items-start justify-start">
					<motion.nav
						className="relative flex h-full items-center justify-center gap-5"
						animate={motionAllowed ? { y: hide ? -80 : 0 } : { y: 0 }}
						transition={motionAllowed ? springs.soft : { duration: 0 }}
					>
						{navLinks.map((item) => (
							<Button href={item.link} key={item.name} variant="ghost">
								{item.name}
							</Button>
						))}
					</motion.nav>
				</div>
			</div>
		</header>
	);
}
