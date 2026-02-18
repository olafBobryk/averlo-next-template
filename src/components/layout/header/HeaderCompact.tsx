"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { Icon } from "@/components/ui/icons/Icon";
import { NAV_LINKS } from "@/config/navConfig";
import HeaderCompactModal from "./HeaderCompactModal";

export default function HeaderCompact({
	className = "",
	navLinks = NAV_LINKS,
}: {
	className?: string;
	navLinks?: { name: string; link: string }[];
}) {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleChangeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const [atTop, setAtTop] = useState(false);
	const [hide, setHide] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			setAtTop(currentY <= 50);

			if (currentY > lastScrollY && currentY > 10) {
				setHide(true); // scrolling down
			} else {
				setHide(false); // scrolling up
			}

			setLastScrollY(currentY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	useEffect(() => {
		const currentY = window.scrollY;
		setAtTop(currentY <= 50);
	}, []);

	const headerClasses = [
		"group fixed w-full z-50 transition-all pointer-events-none duration-300",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<>
			<header
				data-open={isModalOpen}
				data-top={atTop}
				data-hide={hide}
				className={headerClasses}
			>
				<div className="relative w-full px-section-x group-data-[open=true]:fixed">
					<div className="flex h-[100px] w-full items-center justify-between overflow-hidden">
						<Logo className="pointer-events-auto" />
						<div className="flex gap-2">
							<Button
								variant="primary"
								size="md"
								align="center"
								data-open={isModalOpen}
								onClick={handleChangeModal}
								className="relative pointer-events-auto group-data-[open=true]:!shadow-none transition group-data-[open=true]:bg-transparent group-data-[open=true]:hover:bg-transparent group-data-[open=true]:text-foreground group-data-[open=true]:border-foreground/15"
								aria-expanded={isModalOpen}
								aria-label={isModalOpen ? "Close menu" : "Open menu"}
							>
								<Icon
									name="menu"
									className="transition-all duration-300 data-[open=true]:-rotate-90 data-[open=true]:opacity-0"
									data-open={isModalOpen}
									size="lg"
								/>
								<Icon
									name="cross"
									className="inset-center rotate-90 opacity-0 transition-all duration-300 data-[open=true]:rotate-0 data-[open=true]:opacity-100"
									data-open={isModalOpen}
									size="lg"
								/>
							</Button>
						</div>
					</div>
				</div>
			</header>
			<div
				id="header-compact-modal-root"
				data-open={isModalOpen}
				className="fixed inset-0 z-40 data-[open=false]:pointer-events-none"
			/>
			<AnimatePresence>
				{isModalOpen ? (
					<HeaderCompactModal
						isModalOpen={isModalOpen}
						handleChangeModal={handleChangeModal}
						navLinks={navLinks}
					/>
				) : null}
			</AnimatePresence>
		</>
	);
}
