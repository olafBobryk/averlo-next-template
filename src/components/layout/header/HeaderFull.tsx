"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { NAV_LINKS } from "@/config/navConfig";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { springs } from "@/lib/motionPresets";
import ContentSearch from "./ContentSearch";

// TODO wip: animte header in with motion scene and app ready.
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

	return (
		<header
			className={clsx(
				"h-[100px] fixed z-50 px-section-x pointer-events-none left-1/2 flex justify-center items-center -translate-x-1/2 w-full group",
				className,
			)}
			data-top={atTop}
			data-hide={hide}
		>
			<div className="max-w-section-max w-full flex items-center h-full">
				<div className="flex justify-between items-center w-full h-fit">
					<div className=" min-w-[400px]">
						<Logo size="md" className="pointer-events-auto" />
					</div>
					<motion.nav
						className="relative pointer-events-auto flex h-full items-center justify-center gap-5"
						animate={motionAllowed ? { y: hide ? -80 : 0 } : { y: 0 }}
						transition={motionAllowed ? springs.soft : { duration: 0 }}
					>
						{navLinks.map((item) => (
							<Button href={item.link} key={item.name} variant="ghost">
								{item.name}
							</Button>
						))}
					</motion.nav>
					<div className="flex justify-end items-center gap-3 pointer-events-auto min-w-[400px]">
						<ContentSearch
							navLinks={navLinks}
							size="sm"
							fieldClassName="min-w-0"
							className="w-[14rem] xl:w-[16rem]"
							inputClassName="text-sm"
						/>

						<Button
							variant="primary"
							href="/contact"
							className="pointer-events-auto"
						>
							Join Now
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
