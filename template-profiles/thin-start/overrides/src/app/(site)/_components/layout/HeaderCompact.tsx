"use client";

import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";
import { useAnimated } from "@/hooks/useMotionAllowed";
import {
	getHeaderSearchGroups,
	HeaderMenuGroup,
	HeaderMenuIcon,
	HeaderMenuNoResults,
	HeaderSearchInput,
} from "./HeaderMenuContent";
import type { SiteLayoutDocument } from "./siteLayout";
import { getSiteLinkHref } from "./siteLayout";
import { useMenuPanelSequence } from "./useMenuPanelSequence";

const COMPACT_OPEN_TOP_PADDING = 16;
const COMPACT_OPEN_BAR_HEIGHT = 48;
const COMPACT_OPEN_MENU_GAP = 12;
const COMPACT_OPEN_MENU_OFFSET =
	COMPACT_OPEN_TOP_PADDING + COMPACT_OPEN_BAR_HEIGHT + COMPACT_OPEN_MENU_GAP;
const COMPACT_OPEN_CTA_HEIGHT = 60;
const COMPACT_OPEN_SCROLL_AREA_OFFSET =
	COMPACT_OPEN_MENU_OFFSET + COMPACT_OPEN_CTA_HEIGHT + 48;
const COMPACT_CLOSED_HEADER_HEIGHT = 76;
const COMPACT_CONDENSED_HEADER_HEIGHT = 60;
const HEADER_ENTRANCE_HIDDEN = { opacity: 0, y: -28, scale: 0.965 };
const HEADER_ENTRANCE_VISIBLE = { opacity: 1, y: 0, scale: 1 };

export default function HeaderCompact({
	animateEntrance = false,
	entranceReady = true,
	isScrolled,
	layout,
	className = "",
}: {
	animateEntrance?: boolean;
	entranceReady?: boolean;
	isScrolled: boolean;
	layout: SiteLayoutDocument["header"];
	className?: string;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const menuGroups = layout.menuGroups ?? [];
	const mobile = layout.mobile ?? {
		closeAriaLabel: "Close navigation",
		menuLabel: "Menu",
		openAriaLabel: "Open navigation",
	};
	const search = layout.search ?? {
		ariaLabel: "Search pages",
		clearLabel: "Clear",
		noResultsText: "No matching pages",
	};
	const searchSourceGroups = layout.searchGroups ?? menuGroups;
	const motionAllowed = useAnimated();
	const menu = useMenuPanelSequence(isMenuOpen, motionAllowed);
	// The header is the menu panel: it keeps its open state until it closes.
	const showHeaderSurface = isScrolled || menu.extended;
	const isCondensed = isScrolled && !menu.extended;
	const isSearchActive = searchQuery.trim().length > 0;
	const searchGroups = getHeaderSearchGroups(searchQuery, searchSourceGroups);
	const activeMenuGroups = isSearchActive ? searchGroups : menuGroups;
	const headerTransition: Transition = motionAllowed
		? spring.gentle
		: instantTransition;
	const heightTransition: Transition = motionAllowed
		? spring.smooth
		: instantTransition;
	// Menu open/close moves the header height on `gentle`; the content fades
	// on `quick` (as presence does).
	const menuPanelTransition: Transition = motionAllowed
		? spring.gentle
		: instantTransition;
	const menuFadeTransition: Transition = motionAllowed
		? spring.quick
		: instantTransition;
	const shouldAnimateEntrance = animateEntrance && motionAllowed;
	// spec exception E-001
	const headerHeight = menu.extended
		? "100vh"
		: isCondensed
			? COMPACT_CONDENSED_HEADER_HEIGHT
			: COMPACT_CLOSED_HEADER_HEIGHT;
	const entranceState =
		shouldAnimateEntrance && !entranceReady
			? HEADER_ENTRANCE_HIDDEN
			: HEADER_ENTRANCE_VISIBLE;

	const closeMenu = () => {
		setSearchQuery("");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			closeMenu();
			return;
		}

		setIsMenuOpen(true);
	};

	return (
		<motion.header
			data-open={isMenuOpen}
			initial={
				shouldAnimateEntrance
					? { ...HEADER_ENTRANCE_HIDDEN, height: COMPACT_CLOSED_HEADER_HEIGHT }
					: false
			}
			animate={{
				height: headerHeight,
				...entranceState,
			}}
			transition={{
				...heightTransition,
				height: menu.mounted ? menuPanelTransition : heightTransition,
			}}
			onUpdate={(latest) =>
				menu.onPanelUpdate(
					Number.parseFloat(String(latest.height)),
					window.innerHeight,
				)
			}
			onAnimationComplete={menu.onPanelComplete}
			className={clsx(
				"fixed inset-x-0 top-0 z-50 h-[76px] px-section-x",
				className,
			)}
		>
			<Panel
				aria-hidden="true"
				as={motion.div}
				background="page"
				border="none"
				className="pointer-events-none absolute inset-0 border-b border-border"
				data-shell-surface="marketing-header"
				display="block"
				gap="none"
				initial={false}
				animate={{ opacity: showHeaderSurface ? 1 : 0 }}
				overflow="visible"
				padding="none"
				radius="none"
				transition={headerTransition}
				width="full"
			/>
			<motion.div
				className="relative mx-auto flex h-full w-full max-w-section-max flex-col gap-3"
				initial={false}
				animate={{ paddingTop: isCondensed ? 8 : 16 }}
				transition={headerTransition}
			>
				<motion.div
					className="flex items-center justify-between gap-3 px-3"
					initial={false}
					animate={{
						paddingTop: isCondensed ? 8 : 12,
						paddingBottom: isCondensed ? 8 : 12,
					}}
					transition={headerTransition}
				>
					<motion.div
						className="origin-left"
						initial={false}
						animate={{ scale: isCondensed ? 0.9 : 1 }}
						transition={headerTransition}
					>
						<Logo size="sm" className="pointer-events-auto" />
					</motion.div>
					<Button
						variant="ghost"
						className="min-h-10 gap-2 px-3"
						leadingIcon={
							<HeaderMenuIcon
								name={isMenuOpen ? "close" : "menu"}
								className="text-foreground"
							/>
						}
						onClick={toggleMenu}
						aria-expanded={isMenuOpen}
						aria-label={
							isMenuOpen ? mobile.closeAriaLabel : mobile.openAriaLabel
						}
					>
						{mobile.menuLabel}
					</Button>
				</motion.div>
				{menu.mounted ? (
					<motion.div
						data-open={isMenuOpen}
						aria-hidden={!isMenuOpen || undefined}
						inert={!isMenuOpen || undefined}
						className="min-h-0 overflow-hidden"
						style={{
							height: `calc(100vh - ${COMPACT_OPEN_MENU_OFFSET}px)`,
						}}
						initial={motionAllowed ? { opacity: 0 } : false}
						animate={{ opacity: menu.visible ? 1 : 0 }}
						transition={menuFadeTransition}
						onUpdate={menu.onContentUpdate}
						onAnimationComplete={menu.onContentComplete}
					>
						<div
							// biome-ignore lint/plugin/noAdHocScrollHeight: debt
							className="overflow-auto"
							style={{
								maxHeight: `calc(100vh - ${COMPACT_OPEN_SCROLL_AREA_OFFSET}px)`,
							}}
						>
							<div className="flex min-h-full flex-col gap-3 px-3 pb-8">
								<div className="mb-6">
									<HeaderSearchInput
										value={searchQuery}
										onValueChange={setSearchQuery}
										onClear={() => setSearchQuery("")}
										ariaLabel={search.ariaLabel}
										clearLabel={search.clearLabel}
										placeholder={search.ariaLabel}
										className="w-full"
									/>
								</div>
								{activeMenuGroups.length > 0 ? (
									<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
										{activeMenuGroups.map((group) => (
											<div key={group.label} className="min-w-0">
												<HeaderMenuGroup group={group} onNavigate={closeMenu} />
											</div>
										))}
									</div>
								) : (
									<HeaderMenuNoResults noResultsText={search.noResultsText} />
								)}
								<div className="mt-auto flex flex-col gap-8 pt-5">
									<Button
										variant="primary"
										href={getSiteLinkHref(layout.cta)}
										onClick={closeMenu}
										className="w-full"
									>
										{layout.cta.label}
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				) : null}
			</motion.div>
		</motion.header>
	);
}
