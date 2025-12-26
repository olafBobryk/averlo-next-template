"use client";
import { NAV_LINKS } from "@/config/navConfig";
import HeaderCompact from "./HeaderCompact";
import HeaderFull from "./HeaderFull";

type HeaderLink = { name: string; link: string };

export default function Header({
	className = "",
	navLinks = NAV_LINKS,
}: {
	className?: string;
	navLinks?: HeaderLink[];
}) {
	return (
		<header className={className}>
			<div className="hidden lg:block">
				<HeaderFull navLinks={navLinks} />
			</div>
			<div className="block lg:hidden">
				<HeaderCompact navLinks={navLinks} />
			</div>
		</header>
	);
}
