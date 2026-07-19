"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import {
	dashboardDebugEnabled,
	isDashboardDebugState,
} from "../../_registry/debug";
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
import { useDashboardSettingsContext } from "../providers/DashboardSettingsProvider";
import { DashboardAccountMenu } from "./DashboardAccountMenu";
import { DashboardSidebarNav } from "./DashboardSidebarNav";

const forceLoadingStorageKey = "averlo-dashboard:force-loading";

export function DashboardFrame({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { membership, organization } = useDashboardAuth();
	const { dashboardAppearance } = useDashboardSettingsContext();
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
	const [forceLoading, setForceLoading] = React.useState(false);
	const surface = getDashboardSurface(pathname);
	const capabilities = React.useMemo(
		() => getDashboardCapabilities(membership.role),
		[membership.role],
	);
	const debugStateValue = searchParams.get("debug-state");
	const debugState =
		dashboardDebugEnabled && isDashboardDebugState(debugStateValue)
			? debugStateValue
			: forceLoading
				? "loading"
				: null;

	React.useEffect(() => {
		const { body } = document;
		const hadDarkClass = body.classList.contains("dark");
		const previousColorScheme = body.style.colorScheme;
		body.classList.toggle("dark", dashboardAppearance === "dark");
		body.style.colorScheme = dashboardAppearance;
		return () => {
			body.classList.toggle("dark", hadDarkClass);
			body.style.colorScheme = previousColorScheme;
		};
	}, [dashboardAppearance]);

	React.useEffect(() => {
		try {
			setForceLoading(
				window.localStorage.getItem(forceLoadingStorageKey) === "1",
			);
		} catch {
			setForceLoading(false);
		}
	}, []);

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
			capabilities={capabilities}
			organization={organization}
		>
			<div className="min-h-screen bg-background text-foreground">
				{mobileSidebarOpen ? (
					<button
						aria-label="Close sidebar"
						className="fixed inset-0 z-30 bg-black/35 backdrop-blur-[2px] lg:hidden"
						onClick={() => setMobileSidebarOpen(false)}
						type="button"
					/>
				) : null}
				<aside
					className={clsx(
						"fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] motion-macro",
						mobileSidebarOpen ? "w-[260px]" : "w-[64px]",
						sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]",
					)}
					id="dashboard-sidebar"
				>
					<div
						className={clsx(
							"flex min-h-16 items-center gap-2 border-b border-sidebar-border/70 px-3",
							mobileSidebarOpen ? "justify-between" : "justify-center",
							sidebarCollapsed ? "lg:justify-center" : "lg:justify-between",
						)}
					>
						{!sidebarCollapsed ? (
							<Logo
								className={clsx(
									mobileSidebarOpen ? "inline-flex" : "max-lg:!hidden",
								)}
								href="/dashboard"
								size="sm"
							/>
						) : null}
						<Button
							aria-expanded={
								mobileSidebarOpen || (!sidebarCollapsed && !mobileSidebarOpen)
							}
							aria-label={
								sidebarCollapsed ? "Expand sidebar" : "Toggle sidebar"
							}
							className="!size-10 !p-0"
							leadingIcon={sidebarCollapsed ? "plus" : "menu"}
							onClick={() => {
								if (window.matchMedia("(min-width: 1024px)").matches) {
									setSidebarCollapsed((current) => !current);
									return;
								}
								setMobileSidebarOpen((current) => !current);
							}}
							size="icon-sm"
							variant="ghost"
						/>
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto px-2 py-4 lg:px-3">
						<DashboardSidebarNav
							collapsed={sidebarCollapsed}
							mobileExpanded={mobileSidebarOpen}
							onNavigate={() => setMobileSidebarOpen(false)}
						/>
					</div>
					<div className="flex min-h-16 items-center justify-center border-t border-sidebar-border/70 p-3 lg:justify-start">
						<Button
							aria-label="Open support"
							href="/contact"
							leadingIcon="flag"
							size="icon-sm"
							variant="secondary"
						/>
					</div>
				</aside>
				<div
					className={clsx(
						"min-w-0 transition-[padding] motion-macro",
						sidebarCollapsed
							? "pl-[64px] lg:pl-[72px]"
							: "pl-[64px] lg:pl-[260px]",
					)}
				>
					<header
						className={clsx(
							"fixed right-0 top-0 z-30 border-b border-border/75 bg-background/84 backdrop-blur-xl transition-[left] motion-macro",
							sidebarCollapsed
								? "left-[64px] lg:left-[72px]"
								: "left-[64px] lg:left-[260px]",
						)}
					>
						<div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
							<div className="flex min-w-0 flex-1 justify-end">
								<DashboardCommandTrigger />
							</div>
							<DashboardAccountMenu />
						</div>
					</header>
					<main
						className={clsx(
							"flex w-full flex-col gap-5 pb-8 pt-24",
							surface?.layoutWidth === "wide"
								? "min-w-0 px-4 sm:px-6"
								: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
						)}
						id="dashboard-main"
						tabIndex={-1}
					>
						<div className="relative min-h-[calc(100svh-8rem)]">
							<div
								aria-hidden={debugState ? true : undefined}
								className={
									debugState ? "invisible pointer-events-none" : undefined
								}
							>
								{children}
							</div>
							{debugState ? (
								<div className="absolute inset-0 bg-background">
									<DashboardDebugStateView state={debugState} />
								</div>
							) : null}
						</div>
					</main>
				</div>
				<DashboardDebugMenu
					capabilities={capabilities}
					forceLoading={forceLoading}
					onForceLoadingChange={handleForceLoadingChange}
				/>
			</div>
		</DashboardCommandProvider>
	);
}
