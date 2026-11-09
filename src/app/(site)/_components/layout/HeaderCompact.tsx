"use client";

import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { ScrollArea } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";
import { useAnimated } from "@/hooks/useMotionAllowed";
import {
	getHeaderSearchGroups,
	HeaderMenuGroup,
	HeaderMenuNoResults,
	HeaderSearchInput,
} from "./HeaderMenuContent";
import type { SiteLayoutDocument } from "./siteLayout";
import { getSiteLinkHref } from "./siteLayout";
import { useMenuPanelPresence } from "./useMenuPanelPresence";

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
	const motionAllowed = useAnimated();
	const menu = useMenuPanelPresence(isMenuOpen, motionAllowed);
	// The header is the menu panel: it keeps its open state until it closes.
	const showHeaderSurface = isScrolled || menu.extended;
	const isCondensed = isScrolled && !menu.extended;
	const isSearchActive = searchQuery.trim().length > 0;
	const searchGroups = getHeaderSearchGroups(searchQuery, layout.searchGroups);
	const activeMenuGroups = isSearchActive ? searchGroups : layout.menuGroups;
	const headerTransition: Transition = motionAllowed
		? spring.gentle
		: instantTransition;
	const heightTransition: Transition = motionAllowed
		? spring.smooth
		: instantTransition;
	// Menu open/close moves the header height on `gentle`; the content fades with the
	// header surface on the same step; resizing stays on `smooth`.
	const menuPanelTransition: Transition = motionAllowed
		? spring.gentle
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
			data-site-header
			data-open={isMenuOpen}
			suppressHydrationWarning
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
			onAnimationComplete={menu.onPanelComplete}
			className={clsx("fixed inset-x-0 top-0 z-50 h-[76px]", className)}
		>
			<Panel
				aria-hidden="true"
				as={motion.div}
				background="page"
				border="none"
				className="pointer-events-none absolute inset-0 border-b border-border"
				data-shell-surface="marketing-header"
				display="block"
				initial={false}
				animate={{ opacity: showHeaderSurface ? 1 : 0 }}
				gap="none"
				overflow="visible"
				padding="none"
				radius="none"
				transition={headerTransition}
				width="full"
			/>
			<motion.div
				className="relative flex h-full w-full flex-col gap-3"
				initial={false}
			>
				<motion.div
					className="relative w-full px-section-x"
					initial={false}
					animate={{ paddingTop: isCondensed ? 8 : 16 }}
					transition={headerTransition}
				>
					<motion.div
						className="mx-auto flex w-full max-w-section-max items-center justify-between gap-3 px-3"
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
							size="icon-sm"
							textTone="inherit"
							className="pointer-events-auto text-foreground hover:!text-foreground active:!text-foreground"
							onClick={toggleMenu}
							aria-expanded={isMenuOpen}
							aria-label={
								isMenuOpen
									? layout.mobile.closeAriaLabel
									: layout.mobile.openAriaLabel
							}
							leadingIcon={
								<IconSwap
									activeIndex={isMenuOpen ? 1 : 0}
									size="md"
									items={[
										{
											icon: (
												<Icon
													name="menu"
													className="size-full text-foreground"
													style={{ width: "100%", height: "100%" }}
												/>
											),
										},
										{
											icon: (
												<Icon
													name="close"
													className="size-full text-foreground"
													style={{ width: "100%", height: "100%" }}
												/>
											),
										},
									]}
								/>
							}
						/>
					</motion.div>
				</motion.div>
				<div className="relative w-full px-section-x">
					<div className="mx-auto w-full max-w-section-max">
						{menu.mounted ? (
							<motion.div
								data-open={isMenuOpen}
								aria-hidden={!isMenuOpen || undefined}
								inert={!isMenuOpen || undefined}
								className="flex min-h-0 min-w-0 flex-col overflow-hidden"
								style={{
									height: `calc(100vh - ${COMPACT_OPEN_MENU_OFFSET}px)`,
								}}
								initial={motionAllowed ? { opacity: 0 } : false}
								// Fades with the header surface, on the same step.
								animate={{ opacity: menu.extended ? 1 : 0 }}
								transition={headerTransition}
							>
								<div className="relative shrink-0">
									<HeaderSearchInput
										value={searchQuery}
										onValueChange={setSearchQuery}
										onClear={() => setSearchQuery("")}
										ariaLabel={layout.search.ariaLabel}
										clearLabel={layout.search.clearLabel}
										placeholder={layout.search.ariaLabel}
										className="group/header-search w-full text-sm text-foreground"
									/>
								</div>
								<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
									{/* The search field is the start edge (its gap becomes the
									    scroller padding); the viewport bottom is not an edge. */}
									<ScrollArea
										edgeStart="1.5rem"
										edgeEnd={0}
										className="h-full w-full overflow-x-hidden"
										style={{
											maxHeight: `calc(100vh - ${COMPACT_OPEN_SCROLL_AREA_OFFSET}px)`,
										}}
									>
										<div className="flex min-h-full flex-col gap-3">
											{activeMenuGroups.length > 0 ? (
												<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
													{activeMenuGroups.map((group) => (
														<div key={group.label} className="min-w-0">
															<HeaderMenuGroup
																group={group}
																onNavigate={closeMenu}
															/>
														</div>
													))}
												</div>
											) : (
												<HeaderMenuNoResults
													noResultsText={layout.search.noResultsText}
												/>
											)}
											<div className="mt-auto flex flex-col gap-8 pt-5">
												<Button
													variant="primary"
													href={getSiteLinkHref(layout.cta)}
													onClick={closeMenu}
													className="w-full"
													contentClassName="justify-center"
												>
													{layout.cta.label}
												</Button>
											</div>
										</div>
									</ScrollArea>
								</div>
							</motion.div>
						) : null}
					</div>
				</div>
			</motion.div>
		</motion.header>
	);
}
