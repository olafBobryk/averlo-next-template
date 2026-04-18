"use client";

import clsx from "clsx";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { Accordion } from "@/components/ui/misc/Accordion";
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";
import { Button } from "@/components/ui/primitives/Button";
import { hrefFor } from "@/lib/routes";
import MarketingContentSearch from "./MarketingContentSearch";
import { MARKETING_NAV_LINKS } from "./marketingNav";

const COMPACT_HEADER_TOP_OFFSET = 16;
const COMPACT_HEADER_BAR_HEIGHT = 72;
const COMPACT_HEADER_CTA_HEIGHT = 44;
const COMPACT_HEADER_SCROLL_AREA_OFFSET =
	COMPACT_HEADER_TOP_OFFSET +
	COMPACT_HEADER_BAR_HEIGHT +
	COMPACT_HEADER_CTA_HEIGHT +
	48;

export default function HeaderCompact({
	className = "",
}: {
	className?: string;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header
			data-open={isMenuOpen}
			className={clsx(
				"fixed inset-x-0 top-0 z-50 px-section-x motion-component pt-4 data-[open=true]:bg-background transition-[background-color,border,height] border-b border-transparent data-[open=true]:border-border/15 data-[open=true]:h-svh",
				className,
			)}
		>
			<div className="mx-auto flex h-full w-full max-w-section-max flex-col gap-3">
				<div className="flex items-center justify-between gap-3 px-3 py-3">
					<Logo size="sm" className="pointer-events-auto" />
					<Button
						variant="ghost"
						size="sm"
						align="center"
						trailingIcon={isMenuOpen ? "minus" : "plus"}
						onClick={() => setIsMenuOpen((value) => !value)}
						aria-expanded={isMenuOpen}
						aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
					>
						Menu
					</Button>
				</div>
				<div
					data-open={isMenuOpen}
					className="grid min-h-0 transition-[grid-template-rows,opacity] motion-component data-[open=false]:grid-rows-[0fr] data-[open=false]:opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100"
					style={{
						height: isMenuOpen
							? `calc(100svh - ${COMPACT_HEADER_TOP_OFFSET + COMPACT_HEADER_BAR_HEIGHT}px)`
							: undefined,
					}}
				>
					<div className="overflow-hidden">
						<ScrollBorders
							showBackToTop={false}
							className="overflow-scroll"
							style={{
								maxHeight: `calc(100vh - ${COMPACT_HEADER_SCROLL_AREA_OFFSET}px)`,
							}}
						>
							<div className="flex min-h-full flex-col gap-3">
								<MarketingContentSearch
									onNavigate={() => setIsMenuOpen(false)}
									field={{ className: "w-full" }}
									input={{
										size: "sm",
										className: "w-full",
										textClassName: "text-sm",
									}}
								/>
								<Accordion title="Pages" defaultOpen>
									{MARKETING_NAV_LINKS.map((item) => (
										<Button
											key={item.name}
											href={hrefFor(item.routeId)}
											variant="ghost"
											align="left"
											className="w-full justify-between"
											onClick={() => setIsMenuOpen(false)}
										>
											{item.name}
										</Button>
									))}
								</Accordion>
								<Button
									variant="primary"
									href={hrefFor("contact")}
									onClick={() => setIsMenuOpen(false)}
									className="mt-auto"
								>
									Join Now
								</Button>
							</div>
						</ScrollBorders>
					</div>
				</div>
			</div>
		</header>
	);
}
