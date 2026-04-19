"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { focusRing } from "@/components/ui/foundations/focus";
import { spring } from "@/components/ui/foundations/spring";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { showToast } from "@/lib/feedback";
import { hrefFor } from "@/lib/routes";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";
import {
	type DashboardSidebarItem,
	dashboardNavigationSections,
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
	const [collapsed, setCollapsed] = useState(false);
	const [showSkip, setShowSkip] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const motionAllowed = useMotionAllowed(true);
	const macroTransition = motionAllowed ? spring.macro : { duration: 0 };
	const componentTransition = motionAllowed
		? spring.component
		: { duration: 0 };
	const interactiveTransition = motionAllowed
		? spring.interactive
		: { duration: 0 };

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

	function handleSkipToContent() {
		const target = document.getElementById("dashboard-main");
		target?.focus();
		onMobileOpenChange(false);
	}

	function renderNavButton(item: DashboardSidebarItem, isExpanded: boolean) {
		const href = item.routeId ? hrefFor(item.routeId) : undefined;
		const active = buildActiveState(pathname, href);
		const size = isExpanded ? "md" : "icon";
		const align = isExpanded ? "left" : "center";
		const variant = active ? "primary" : "outline";
		const className = clsx(
			"w-full",
			isExpanded ? "justify-between" : "justify-center",
			focusRing.visibleDefault,
		);
		const labelNode = isExpanded ? (
			<Text as="span" variant="bodyStrong" style={{ color: "inherit" }}>
				{item.label}
			</Text>
		) : null;

		const handleClick = () => {
			if (item.action === "logout") {
				void handleLogout();
				return;
			}
			onMobileOpenChange(false);
		};

		if (href) {
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
					onClick={handleClick}
				>
					{labelNode}
				</Button>
			);
		}

		return (
			<Button
				key={item.label}
				size={size}
				align={align}
				variant={variant}
				className={className}
				leadingIcon={item.icon}
				aria-label={isExpanded ? undefined : item.label}
				onClick={handleClick}
				disabled={loading || loggingOut}
			>
				{labelNode}
			</Button>
		);
	}

	function renderSidebarContent(forceExpanded = false) {
		const isExpanded = forceExpanded ? true : !collapsed;

		return (
			<Panel
				display="flex"
				padding="none"
				gap="none"
				className="h-full overflow-hidden rounded-xl"
			>
				<div className="border-b border-border/15 p-4">
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
					<div className="flex flex-col gap-5 p-4">
						{dashboardNavigationSections.map((section) => (
							<div key={section.label} className="flex flex-col gap-2">
								<motion.div
									className="grid overflow-hidden"
									initial={false}
									animate={{
										gridTemplateRows: isExpanded ? "1fr" : "0fr",
										opacity: isExpanded ? 1 : 0,
										marginBottom: isExpanded ? 2 : 0,
									}}
									transition={componentTransition}
									aria-hidden={!isExpanded}
								>
									<div className="overflow-hidden">
										<Text variant="caption" tone="muted" className="px-1">
											{section.label}
										</Text>
									</div>
								</motion.div>
								<div className="flex flex-col gap-2">
									{section.items.map((item) =>
										renderNavButton(item, isExpanded),
									)}
								</div>
							</div>
						))}
					</div>
				</ScrollBorders>

				<div className="border-t border-border/15 p-4">
					<div
						className={clsx(
							"rounded-lg border border-border/15 bg-surface px-3 py-3",
							!isExpanded && "flex items-center justify-center px-2",
						)}
					>
						{isExpanded ? (
							<div className="flex flex-col gap-1 truncate overflow-hidden max-w-full">
								<Text as="p" variant="bodyStrong">
									{user?.name ?? "Dashboard user"}
								</Text>
								<Text as="p" variant="caption" tone="muted">
									{user?.email ?? "No active session"}
								</Text>
							</div>
						) : (
							<Icon name="lock" size="sm" />
						)}
					</div>
				</div>
			</Panel>
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
				<aside className="sticky top-6 h-[calc(100svh-3rem)]">
					{renderSidebarContent(false)}
				</aside>
			</motion.div>
			{mobileOpen ? (
				<div className="fixed inset-0 z-50 flex lg:hidden">
					<button
						type="button"
						className="flex-1 bg-foreground/35 backdrop-blur-[2px]"
						aria-label="Close dashboard navigation"
						onClick={() => onMobileOpenChange(false)}
					/>
					<aside className="w-[19rem] p-3">
						<div className="h-full">{renderSidebarContent(true)}</div>
					</aside>
				</div>
			) : null}
		</>
	);
}
