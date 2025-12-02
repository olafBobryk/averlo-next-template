"use client";
import { NAV_LINKS } from "../../config/navConfig";
import HeaderCompact from "./HeaderCompact";
import HeaderFull from "./HeaderFull";

// Header.tsx
export default function Header({
	className = "",
	navLinks = NAV_LINKS,
}: {
	className?: string;
	navLinks?: { name: string; link: string }[];
}) {
	return (
		<header className={className}>
			{/* Desktop */}
			<div className="hidden lg:block">
				<HeaderFull navLinks={navLinks} />
			</div>

			{/* Mobile / Tablet */}
			<div className="block lg:hidden">
				<HeaderCompact navLinks={navLinks} />
			</div>
		</header>
	);
}
