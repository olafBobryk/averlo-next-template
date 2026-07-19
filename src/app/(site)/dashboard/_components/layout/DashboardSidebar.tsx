"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import {
	getMotionTiming,
	instantTransition,
} from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { HealthCheckIndicator } from "@/components/ui/misc/HealthCheckIndicator";
import { MoreMenuDropdown } from "@/components/ui/misc/MoreMenuDropdown";
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import Divider from "@/components/ui/primitives/Divider";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { showToast } from "@/lib/feedback";
import { hrefFor } from "@/lib/routes";
import { userPresentation } from "../entities/users/presentation";
import { ReportIssueModal } from "../feedback/ReportIssueModal";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";
import { useDashboardSettingsContext } from "../providers/DashboardSettingsProvider";
import {
	type DashboardNavigationItem,
	type DashboardUserMenuItem,
	dashboardPagesNavigationItem,
	dashboardUserMenuItems,
	getDashboardNavigationItems,
} from "./dashboardNavigation";

type DashboardSidebarProps = {
	mobileOpen: boolean;
	onMobileOpenChange: (open: boolean) => void;
};

function buildActiveState(pathname: string, href?: string) {
	if (!href) return false;
	if (href === hrefFor("dashboard")) {
		return pathname === href;
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
	mobileOpen,
	onMobileOpenChange,
}: DashboardSidebarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, logout, user } = useDashboardAuth();
	const { dashboardSidebarRouteIds } = useDashboardSettingsContext();
	const { openModal } = useModal();
	const [collapsed, setCollapsed] = useState(false);
	const [showSkip, setShowSkip] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const visibleNavigationItems = getDashboardNavigationItems(
		dashboardSidebarRouteIds,
	);
	const motionAllowed = useMotionAllowed(true);
	const macroTransition = motionAllowed ? spring.macro : instantTransition;
	const componentTransition = motionAllowed
		? spring.component
		: instantTransition;
	const interactiveTransition = motionAllowed
		? spring.interactive
		: instantTransition;

	async function handleLogout() {
		if (loggingOut) return;
		setLoggingOut(true);
		try {
			await showToast.promise(logout(), {
				loading: "Signing out...",
				success: "Dashboard session ended.",
				error: "Unable to sign out.",
			});
			router.replace(hrefFor("login"));
		} finally {
			setLoggingOut(false);
		}
	}

	function openReportIssueModal() {
		openModal(
			({ close }) => (
				<ReportIssueModal onClose={close} currentRoute={pathname} />
			),
			{
				panelClassName: "w-[min(42rem,calc(100vw-2rem))] max-w-2xl",
				panelWrapperClassName: "p-4 sm:p-[50px]",
			},
		);
		onMobileOpenChange(false);
	}

	function handleSkipToContent() {
		const target = document.getElementById("dashboard-main");
		target?.focus();
		onMobileOpenChange(false);
	}

	function renderNavButton(item: DashboardNavigationItem, isExpanded: boolean) {
		const href = hrefFor(item.routeId);
		const active = buildActiveState(pathname, href);
		const size = isExpanded ? "md" : "icon";
		const align = isExpanded ? "left" : "center";
		const variant = active ? "primary" : "outline";
		const className = clsx(
			"w-full",
			isExpanded ? "justify-between" : "justify-center",
		);
		const labelNode = isExpanded ? (
			<Text as="span" variant="bodyStrong" style={{ color: "inherit" }}>
				{item.label}
			</Text>
		) : null;

		return (
			<Button
				key={item.label}
				href={href}
				size={size}
				align={align}
				variant={variant}
				className={className}
				leadingIcon={item.icon}
				aria-label={isExpanded ? undefined : item.label}
				onClick={() => onMobileOpenChange(false)}
			>
				{labelNode}
			</Button>
		);
	}

	function renderSidebarContent(forceExpanded = false) {
		const isExpanded = forceExpanded ? true : !collapsed;
		const sidebarUser = {
			id: user?.id ?? "dashboard-user",
			name: user?.name ?? "Dashboard user",
			email: user?.email ?? "No active session",
			role: user?.role,
			profilePictureUrl: user?.profilePictureUrl,
		};
		const userMenuItems: DashboardUserMenuItem[] = [
			{
				id: "report-issue",
				label: "Report issue",
				icon: "flag",
				action: "reportIssue",
			},
			...dashboardUserMenuItems,
		];

		return (
			<Card
				display="flex"
				padding="none"
				gap="none"
				background="surface"
				className="h-full overflow-hidden rounded-xl"
			>
				<div className="border-b border-border p-4">
					<div
						className="flex flex-col gap-0"
						onFocusCapture={(event) => {
							const target = event.target as HTMLElement | null;
							if (target?.matches?.(":focus-visible")) {
								setShowSkip(true);
							}
						}}
						onBlurCapture={(event) => {
							if (event.currentTarget.contains(event.relatedTarget as Node)) {
								return;
							}
							setShowSkip(false);
						}}
					>
						<motion.div
							initial={false}
							animate={{
								maxHeight: showSkip ? "30px" : "0px",
								opacity: showSkip ? 1 : 0,
								marginBottom: showSkip ? 12 : 0,
							}}
							transition={componentTransition}
							style={{ pointerEvents: showSkip ? "auto" : "none" }}
						>
							<div className={clsx("", isExpanded ? "" : "flex justify-start")}>
								<Button
									className={"w-full"}
									variant="outline"
									size={isExpanded ? "sm" : "icon-sm"}
									href="#dashboard-main"
									tabIndex={showSkip ? 0 : -1}
									aria-label={isExpanded ? undefined : "Skip to content"}
									onClick={handleSkipToContent}
								>
									{isExpanded ? "Skip to content" : "Skip"}
								</Button>
							</div>
						</motion.div>

						<div className="flex items-center relative">
							<motion.div
								className={clsx(
									"absolute inset-y-0 left-0 flex items-center",
									isExpanded ? "pointer-events-auto" : "pointer-events-none",
								)}
								aria-hidden={!isExpanded}
								initial={false}
								animate={{
									opacity: isExpanded ? 1 : 0,
									x: isExpanded ? 0 : -6,
								}}
								transition={interactiveTransition}
							>
								<Logo
									size="sm"
									href={isExpanded ? hrefFor("dashboard") : undefined}
									tabIndex={isExpanded ? 0 : -1}
									aria-hidden={!isExpanded}
								/>
							</motion.div>

							<div
								className={clsx(
									"flex items-center gap-2",
									isExpanded ? "ml-auto" : "mx-auto",
								)}
							>
								{forceExpanded ? (
									<Button
										variant="outline"
										size="icon-sm"
										onClick={() => onMobileOpenChange(false)}
										aria-label="Close dashboard navigation"
									>
										<Icon name="minus" size="sm" />
									</Button>
								) : (
									<Button
										variant="outline"
										size="icon-sm"
										onClick={() => setCollapsed((value) => !value)}
										aria-expanded={!collapsed}
										aria-label={
											collapsed ? "Expand sidebar" : "Collapse sidebar"
										}
									>
										<IconSwap
											size="md"
											activeIndex={collapsed ? 1 : 0}
											items={[
												{
													icon: <Icon name="arrow-left" size="sm" />,
													inactiveClassName: "-translate-x-1",
													activeClassName: "translate-x-0",
												},
												{
													icon: <Icon name="arrow-right" size="sm" />,
													inactiveClassName: "translate-x-1",
													activeClassName: "translate-x-0",
												},
											]}
										/>
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				<ScrollBorders
					showBackToTop={false}
					className="min-h-0 flex-1 overflow-y-auto"
				>
					<div className="flex flex-col gap-2 p-4">
						{visibleNavigationItems.map((item) =>
							renderNavButton(item, isExpanded),
						)}
						<Divider />
						<Button
							variant="ghost"
							href={hrefFor(dashboardPagesNavigationItem.routeId)}
							onClick={() => onMobileOpenChange(false)}
							className="w-full rounded-[10px] !py-[15px] shadow-none"
							align={isExpanded ? "left" : "center"}
							aria-label={
								isExpanded ? undefined : dashboardPagesNavigationItem.label
							}
						>
							{isExpanded ? (
								dashboardPagesNavigationItem.label
							) : (
								<Icon name={dashboardPagesNavigationItem.icon} />
							)}
						</Button>
					</div>
				</ScrollBorders>

				<div className="border-t border-border p-4">
					<div className="flex flex-col gap-3">
						<MoreMenuDropdown
							align="start"
							side="top"
							positionStrategy="fixed"
							openOnHover={false}
							pinOnClick={false}
							menuMinWidth={220}
							offset={12}
							disabled={loading || loggingOut}
							options={userMenuItems.map((item) => ({
								id: item.id,
								label: item.label,
								leadingIcon: item.icon,
								href: item.routeId ? hrefFor(item.routeId) : undefined,
								onClick:
									item.action === "logout"
										? () => {
												void handleLogout();
											}
										: item.action === "reportIssue"
											? openReportIssueModal
											: () => {
													onMobileOpenChange(false);
												},
							}))}
							renderTrigger={({
								ref,
								isOpen,
								onRootMouseEnter,
								onRootMouseLeave,
								onRightClick,
							}) => (
								<Button
									ref={ref}
									type="button"
									variant="ghost"
									align={isExpanded ? "left" : "center"}
									aria-label="Open dashboard user menu"
									aria-haspopup="menu"
									aria-expanded={isOpen}
									disabled={loading || loggingOut}
									onMouseEnter={onRootMouseEnter}
									onMouseLeave={onRootMouseLeave}
									onClick={onRightClick}
									className={clsx(
										"w-full rounded-[10px] !p-0 shadow-none hover:!bg-transparent active:!bg-transparent",
										!isExpanded && "justify-center",
									)}
								>
									<span
										className={clsx(
											"group-data-[open=false]:grow flex w-full items-center gap-3 rounded-[10px] px-2 py-2.5 transition-[background-color,width] will-change-[width] motion-feedback",
											isExpanded
												? "hover:bg-background"
												: "justify-center hover:bg-background",
											isOpen && "bg-background",
										)}
									>
										{userPresentation.profile.render(sidebarUser, {
											showText: isExpanded,
											loading,
											avatarSize: "sm",
											textClassName: "text-left",
										})}
									</span>
								</Button>
							)}
						/>
						<HealthCheckIndicator
							className="w-full"
							variant={isExpanded ? "default" : "sm"}
						/>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<>
			<motion.div
				id="dashboard-sidebar"
				className="hidden shrink-0 lg:block"
				initial={false}
				animate={{ width: collapsed ? 88 : 280 }}
				transition={macroTransition}
			>
				<aside className="sticky top-6 h-[calc(100svh-3rem)] ">
					{renderSidebarContent(false)}
				</aside>
			</motion.div>
			<div className="lg:hidden">
				<AnimatePresence>
					{mobileOpen ? (
						<>
							<motion.button
								transition={getMotionTiming("interactive")}
								initial={{ background: "transparent" }}
								animate={{ background: "rgba(0,0,0,.5)" }}
								exit={{ background: "transparent" }}
								onClick={() => onMobileOpenChange(false)}
								aria-label="Close dashboard navigation"
								type="button"
								className={clsx(
									"fixed inset-0 z-50 flex lg:hidden motion-interactive transition-background",
								)}
							/>

							<motion.aside
								className="w-[19rem] z-60 fixed h-[calc(100vh-24px)] top-3 right-3"
								transition={getMotionTiming("interactive")}
								initial={{ x: 15, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: 15, opacity: 0 }}
							>
								<div className="h-full">{renderSidebarContent(true)}</div>
							</motion.aside>
						</>
					) : null}
				</AnimatePresence>
			</div>
		</>
	);
}
