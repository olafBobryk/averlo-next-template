"use client";

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import Logo from "@/components/branding/Logo";
import { MODAL_OPEN_EVENT } from "@/lib/modal";
import { hrefFor } from "@/lib/routes";
import { isDashboardDebugState } from "../../_registry/debug";
import {
	getDashboardCapabilities,
	getDashboardSurface,
} from "../../_registry/surfaceRegistry";
import {
	DashboardCommandProvider,
	DashboardCommandTrigger,
} from "../commands/DashboardCommandProvider";
import { DashboardDebugMenu } from "../debug/DashboardDebugMenu";
import { DashboardDebugStateView } from "../debug/DashboardDebugStateView";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";
import { DashboardAccountMenu } from "./DashboardAccountMenu";
import { DashboardContentShell } from "./DashboardContentShell";
import { DashboardFileViewer } from "./DashboardFileViewer";
import {
	DashboardRouteLoading,
	DashboardShellProvider,
	DashboardToolbarOutlet,
} from "./DashboardShellContext";
import { DashboardSidebarNav } from "./DashboardSidebarNav";
import {
	DashboardSidebarShell,
	getDashboardSidebarOffsetClassNames,
} from "./DashboardSidebarShell";

const forceLoadingStorageKey = "averlo-dashboard:force-loading";
export function DashboardFrame({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { membership, organization, organizationChoices, user } =
		useDashboardAuth();
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpenState] = React.useState(false);
	const navigationTrigger = React.useRef<HTMLElement | null>(null);
	React.useEffect(() => {
		// Navigation yields to hosted dialogs, including the keyboard command shortcut.
		const closeNavigation = () => setMobileSidebarOpenState(false);
		window.addEventListener(MODAL_OPEN_EVENT, closeNavigation);
		return () => window.removeEventListener(MODAL_OPEN_EVENT, closeNavigation);
	}, []);
	const setMobileSidebarOpen = React.useCallback((open: boolean) => {
		if (open)
			navigationTrigger.current =
				document.activeElement instanceof HTMLElement
					? document.activeElement
					: null;
		setMobileSidebarOpenState(open);
	}, []);
	React.useEffect(() => {
		if (mobileSidebarOpen || !navigationTrigger.current) return;
		const trigger = navigationTrigger.current;
		navigationTrigger.current = null;
		const frame = requestAnimationFrame(() => {
			if (
				document.contains(trigger) &&
				!document.querySelector('[role="dialog"]')
			)
				trigger.focus({ preventScroll: true });
		});
		return () => cancelAnimationFrame(frame);
	}, [mobileSidebarOpen]);
	const [forceLoading, setForceLoading] = React.useState(false);
	const surface = getDashboardSurface(pathname);
	const layoutWidth = surface?.layoutWidth ?? "standard";
	const capabilities = React.useMemo(
		() => getDashboardCapabilities(membership.role, user?.platformRole ?? null),
		[membership.role, user?.platformRole],
	);
	const debugEnabled = capabilities.has("debug.use");
	const debugStateValue = searchParams.get("debug-state");
	const debugState =
		debugEnabled && isDashboardDebugState(debugStateValue)
			? debugStateValue
			: debugEnabled && forceLoading
				? "loading"
				: null;
	const sidebarOffsetClassNames =
		getDashboardSidebarOffsetClassNames(sidebarCollapsed);
	// Existing chat owns its message gate so its composer stays mounted and usable.
	const assistantMessagesLoading =
		debugState === "loading" && surface?.id === "dashboard.chats.thread";

	React.useEffect(() => {
		try {
			setForceLoading(
				window.localStorage.getItem(forceLoadingStorageKey) === "1",
			);
		} catch {
			setForceLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (!pathname) return;
		setMobileSidebarOpen(false);
	}, [pathname, setMobileSidebarOpen]);

	function handleForceLoadingChange(value: boolean) {
		setForceLoading(value);
		try {
			if (value) window.localStorage.setItem(forceLoadingStorageKey, "1");
			else window.localStorage.removeItem(forceLoadingStorageKey);
		} catch {
			// The in-memory control remains useful when storage is unavailable.
		}
	}

	return (
		<DashboardCommandProvider
			canSwitchOrganizations={organizationChoices.length > 1}
			capabilities={capabilities}
			organization={organization}
		>
			<DashboardShellProvider openNavigation={() => setMobileSidebarOpen(true)}>
				<div className="h-dvh overflow-hidden bg-surface text-foreground">
					<DashboardSidebarShell
						body={
							<div className="grid min-w-0 grid-cols-[minmax(0,1fr)]">
								<div
									className={`px-3 ${mobileSidebarOpen ? "pt-5" : sidebarCollapsed ? "pt-0" : "pt-0 lg:pt-5"}`}
								>
									<DashboardCommandTrigger
										collapsed={sidebarCollapsed}
										mobileExpanded={mobileSidebarOpen}
									/>
								</div>
								<div className="px-3 pt-3">
									<DashboardSidebarNav
										collapsed={sidebarCollapsed}
										mobileExpanded={mobileSidebarOpen}
										onNavigate={() => setMobileSidebarOpen(false)}
									/>
								</div>
							</div>
						}
						brand={
							<Logo
								aria-label="Dashboard overview"
								href={hrefFor("dashboard.overview")}
								size="sm"
								className="!h-[18px] !w-[18px]"
								variant="mark"
								tone="dark"
							/>
						}
						collapsed={sidebarCollapsed}
						footer={
							<DashboardAccountMenu
								collapsed={sidebarCollapsed}
								mobileExpanded={mobileSidebarOpen}
							/>
						}
						mobileOpen={mobileSidebarOpen}
						onCollapsedChange={setSidebarCollapsed}
						onMobileOpenChange={setMobileSidebarOpen}
					/>
					<div className={sidebarOffsetClassNames.content}>
						<div
							className="flex h-full min-w-0 flex-col sm:pr-1 sm:pb-1 lg:pr-2 lg:pb-2"
							inert={mobileSidebarOpen || undefined}
						>
							<DashboardFileViewer>
								<div className="flex h-full min-h-0 flex-col">
									<div
										className={
											layoutWidth === "standard"
												? "[&_[data-dashboard-toolbar-row]]:mx-auto [&_[data-dashboard-toolbar-row]]:max-w-6xl"
												: undefined
										}
									>
										<DashboardToolbarOutlet />
									</div>
									<div
										className="min-h-0 flex-1 overflow-hidden bg-background sm:rounded-lg lg:rounded-xl"
										data-dashboard-workspace
									>
										<DashboardContentShell
											layoutWidth={layoutWidth}
											overlay={
												debugState && !assistantMessagesLoading ? (
													<DashboardDebugStateView
														pathname={pathname}
														state={debugState}
													/>
												) : undefined
											}
										>
											<DashboardRouteLoading value={assistantMessagesLoading}>
												{children}
											</DashboardRouteLoading>
										</DashboardContentShell>
									</div>
								</div>
							</DashboardFileViewer>
						</div>
					</div>
					<DashboardDebugMenu
						capabilities={capabilities}
						forceLoading={forceLoading}
						onForceLoadingChange={handleForceLoadingChange}
					/>
				</div>
			</DashboardShellProvider>
		</DashboardCommandProvider>
	);
}
