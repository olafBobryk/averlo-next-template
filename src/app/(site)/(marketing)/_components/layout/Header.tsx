"use client";

import HeaderCompact from "./HeaderCompact";
import HeaderFull from "./HeaderFull";

export default function Header({ className = "" }: { className?: string }) {
	return (
		<header className={className}>
			<div className="hidden lg:block">
				<HeaderFull />
			</div>
			<div className="block lg:hidden">
				<HeaderCompact />
			</div>
		</header>
	);
}
