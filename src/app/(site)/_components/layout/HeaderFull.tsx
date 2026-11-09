"use client";

import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import {
	type CSSProperties,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Logo from "@/components/branding/Logo";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";
import { useAnimated } from "@/hooks/useMotionAllowed";
import {
	getHeaderSearchGroups,
	getMenuContentHeight,
	HEADER_MENU_CAPPED_COLUMNS,
	HEADER_MENU_DEFAULT_COLUMNS,
	HeaderMenuGrid,
	HeaderSearchInput,
	HeaderSearchResults,
} from "./HeaderMenuContent";
import type { SiteLayoutDocument, SiteLink } from "./siteLayout";
import { getSiteLinkHref } from "./siteLayout";
import { useMenuPanelPresence } from "./useMenuPanelPresence";

const HEADER_EXPANDED_HEIGHT = 100;
const HEADER_COMPACT_HEIGHT = 70;
const HEADER_MENU_TOP_PADDING = 22;
const HEADER_MENU_BOTTOM_PADDING = 32;
const HEADER_CLOSED_LINK_LIMIT = 3;
const HEADER_ENTRANCE_HIDDEN = { opacity: 0, y: -28, scale: 0.965 };
const HEADER_ENTRANCE_VISIBLE = { opacity: 1, y: 0, scale: 1 };

function HeaderTopNavLink({
	link,
	focusable,
	className,
}: {
	link: SiteLink;
	focusable: boolean;
	className?: string;
}) {
	return (
		<Button
			href={getSiteLinkHref(link)}
			variant="bare"
			size="md"
			textVariant="nav"
			textTone="inherit"
			className={clsx("text-foreground/50", className)}
			focusable={focusable}
		>
			{link.label}
		</Button>
	);
}

export default function HeaderFull({
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
	const headerRef = useRef<HTMLElement>(null);
	const menuPanelRef = useRef<HTMLDivElement>(null);
	const menuContentRef = useRef<HTMLDivElement>(null);
	const menuId = useId();
	const motionAllowed = useAnimated();
	const menu = useMenuPanelPresence(isMenuOpen, motionAllowed);
	// The shell keeps its open state until the menu panel starts closing.
	const isCompact = isScrolled && !menu.extended;
	const isSearchActive = searchQuery.trim().length > 0;
	const areTopNavLinksVisible = !menu.extended;
	const closedTopNavLinks = layout.topNavLinks.slice(
		0,
		HEADER_CLOSED_LINK_LIMIT,
	);
	const searchGroups = getHeaderSearchGroups(searchQuery, layout.searchGroups);
	const activeMenuGroups = isSearchActive ? searchGroups : layout.menuGroups;
	const menuContentHeightLg = getMenuContentHeight(
		activeMenuGroups,
		HEADER_MENU_CAPPED_COLUMNS,
	);
	const menuContentHeightXl = getMenuContentHeight(
		activeMenuGroups,
		HEADER_MENU_DEFAULT_COLUMNS,
	);
	const menuContentHeightStyle = {
		"--header-menu-content-height-lg": `${menuContentHeightLg}px`,
		"--header-menu-content-height-xl": `${menuContentHeightXl}px`,
	} as CSSProperties;
	// CSS picks the breakpoint's height; motion cannot interpolate the CSS
	// variable, so the resolved number is what the resize animates to.
	const menuGridRef = useRef<HTMLDivElement>(null);
	const [menuContentHeight, setMenuContentHeight] = useState<number>();
	const showHeaderSurface = isScrolled || menu.extended;
	const headerTransition: Transition = motionAllowed
		? spring.gentle
		: instantTransition;
	// Menu panel open/close on `gentle`; the content fades on `quick` (as
	// presence does); resizing the open content stays on `smooth`.
	const menuPanelTransition: Transition = motionAllowed
		? spring.gentle
		: instantTransition;
	const menuFadeTransition: Transition = motionAllowed
		? spring.quick
		: instantTransition;
	const menuResizeTransition: Transition = motionAllowed
		? spring.smooth
		: instantTransition;
	const shouldAnimateEntrance = animateEntrance && motionAllowed;

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

	const handleSearchQueryChange = (value: string) => {
		setSearchQuery(value);

		if (value.trim().length > 0) {
			setIsMenuOpen(true);
		}
	};

	useEffect(() => {
		if (!isMenuOpen) return;

		function handlePointerDown(event: PointerEvent) {
			const target = event.target;

			if (!(target instanceof Node)) return;
			if (headerRef.current?.contains(target)) return;

			setSearchQuery("");
			setIsMenuOpen(false);
		}

		document.addEventListener("pointerdown", handlePointerDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isMenuOpen]);

	useLayoutEffect(() => {
		void menuContentHeightLg;
		void menuContentHeightXl;
		if (!menu.mounted) {
			// A remounted menu starts from the CSS value again.
			setMenuContentHeight(undefined);
			return;
		}

		const resolve = () => {
			const element = menuGridRef.current;
			if (!element) return;
			const height = Number.parseFloat(
				getComputedStyle(element).getPropertyValue(
					"--header-menu-content-height",
				),
			);
			if (Number.isFinite(height)) setMenuContentHeight(height);
		};

		resolve();
		window.addEventListener("resize", resolve);

		return () => {
			window.removeEventListener("resize", resolve);
		};
	}, [menu.mounted, menuContentHeightLg, menuContentHeightXl]);

	return (
		<motion.header
			data-site-header
			suppressHydrationWarning
			ref={headerRef}
			initial={shouldAnimateEntrance ? HEADER_ENTRANCE_HIDDEN : false}
			animate={
				shouldAnimateEntrance
					? entranceReady
						? HEADER_ENTRANCE_VISIBLE
						: HEADER_ENTRANCE_HIDDEN
					: HEADER_ENTRANCE_VISIBLE
			}
			transition={headerTransition}
			className={clsx(
				"pointer-events-none fixed inset-x-0 top-0 z-50",
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
			<div className="relative flex w-full flex-col">
				<div className="relative w-full px-section-x">
					<motion.div
						className="relative mx-auto flex w-full max-w-section-max items-center justify-between gap-6"
						initial={false}
						animate={{
							height: isCompact
								? HEADER_COMPACT_HEIGHT
								: HEADER_EXPANDED_HEIGHT,
						}}
						transition={headerTransition}
					>
						<div className="flex min-w-[220px] items-center">
							<motion.div
								className="origin-left"
								initial={false}
								animate={{ scale: isCompact ? 0.88 : 1 }}
								transition={headerTransition}
							>
								<Logo size="md" className="pointer-events-auto" />
							</motion.div>
						</div>
						<nav
							className="pointer-events-auto relative flex items-center justify-center text-foreground"
							aria-label="Primary navigation"
						>
							<motion.div
								className="hidden items-center justify-center gap-10 overflow-hidden py-2 xl:flex"
								initial={false}
								animate={{
									width: areTopNavLinksVisible ? "auto" : 0,
									opacity: areTopNavLinksVisible ? 1 : 0,
								}}
								transition={headerTransition}
								aria-hidden={!areTopNavLinksVisible}
							>
								{closedTopNavLinks.map((item, index) => (
									<HeaderTopNavLink
										key={`${item.label}-${getSiteLinkHref(item)}`}
										link={item}
										focusable={areTopNavLinksVisible}
										className={
											index === closedTopNavLinks.length - 1
												? "mr-10"
												: undefined
										}
									/>
								))}
							</motion.div>
							<HeaderSearchInput
								value={searchQuery}
								onValueChange={handleSearchQueryChange}
								onClear={closeMenu}
								ariaLabel={layout.search.ariaLabel}
								clearLabel={layout.search.clearLabel}
							/>
							<Button
								variant="ghost"
								size="icon"
								textTone="inherit"
								className="text-foreground hover:!text-foreground active:!text-foreground"
								aria-controls={menuId}
								aria-expanded={isMenuOpen}
								aria-label={
									isMenuOpen
										? layout.mobile.closeAriaLabel
										: layout.mobile.openAriaLabel
								}
								onClick={toggleMenu}
								leadingIcon={
									<IconSwap
										activeIndex={isMenuOpen ? 1 : 0}
										size="lg"
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
						</nav>
						<div className="pointer-events-auto flex min-w-[220px] justify-end">
							<Button
								href={getSiteLinkHref(layout.cta)}
								variant="primary"
								size="md"
							>
								{layout.cta.label}
							</Button>
						</div>
					</motion.div>
				</div>
				{menu.mounted ? (
					<motion.div
						ref={menuPanelRef}
						id={menuId}
						aria-hidden={!isMenuOpen || undefined}
						inert={!isMenuOpen || undefined}
						initial={motionAllowed ? { height: 0 } : false}
						// spec exception E-001
						animate={{ height: menu.extended ? "auto" : 0 }}
						transition={menuPanelTransition}
						onAnimationComplete={menu.onPanelComplete}
						className="pointer-events-auto relative w-full overflow-hidden px-section-x"
					>
						<motion.div
							ref={menuContentRef}
							className="relative mx-auto w-full max-w-section-max border-t border-transparent"
							style={{
								paddingTop: HEADER_MENU_TOP_PADDING,
								paddingBottom: HEADER_MENU_BOTTOM_PADDING,
							}}
							initial={false}
							animate={{ opacity: menu.visible ? 1 : 0 }}
							transition={menuFadeTransition}
						>
							{/* Fades as the menu closes, so the clip need not reach it. */}
							<motion.div
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-0 -top-px border-t border-border"
								initial={false}
								animate={{ opacity: menu.extended ? 1 : 0 }}
								transition={menuFadeTransition}
							/>
							<motion.div
								ref={menuGridRef}
								className="relative [--header-menu-content-height:var(--header-menu-content-height-lg)] xl:[--header-menu-content-height:var(--header-menu-content-height-xl)]"
								initial={false}
								animate={{
									height:
										menuContentHeight ?? "var(--header-menu-content-height)",
								}}
								style={menuContentHeightStyle}
								transition={menuResizeTransition}
							>
								<div className="absolute inset-0">
									{isSearchActive ? (
										<HeaderSearchResults
											className="lg:grid-cols-5 xl:grid-cols-6"
											groups={searchGroups}
											onNavigate={closeMenu}
											columnCount={HEADER_MENU_DEFAULT_COLUMNS}
											noResultsText={layout.search.noResultsText}
										/>
									) : (
										<HeaderMenuGrid
											className="lg:grid-cols-5 xl:grid-cols-6"
											groups={layout.menuGroups}
											onNavigate={closeMenu}
											columnCount={HEADER_MENU_DEFAULT_COLUMNS}
										/>
									)}
								</div>
							</motion.div>
						</motion.div>
					</motion.div>
				) : null}
			</div>
		</motion.header>
	);
}
