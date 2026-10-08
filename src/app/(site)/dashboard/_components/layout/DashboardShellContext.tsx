"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";

const ToolbarVisibleContext = createContext(true);
const RouteLoadingContext = createContext(false);
export const DashboardRouteLoading = RouteLoadingContext.Provider;
export function useDashboardRouteLoading() {
	return useContext(RouteLoadingContext);
}
export function DashboardToolbarVisibility({
	visible,
	children,
}: {
	visible: boolean;
	children: ReactNode;
}) {
	return (
		<ToolbarVisibleContext.Provider value={visible}>
			{children}
		</ToolbarVisibleContext.Provider>
	);
}
export function useDashboardToolbarVisible() {
	return useContext(ToolbarVisibleContext);
}

const ToolbarContext = createContext<{
	target: HTMLDivElement | null;
	setTarget: (node: HTMLDivElement | null) => void;
} | null>(null);
export function DashboardToolbarOutlet() {
	const context = useContext(ToolbarContext);
	return (
		<div
			ref={context?.setTarget}
			className="min-h-12 shrink-0"
			data-dashboard-toolbar-outlet
		/>
	);
}
export function useDashboardToolbarTarget() {
	return useContext(ToolbarContext)?.target;
}

const ShellContext = createContext<(() => void) | null>(null);

export function DashboardShellProvider({
	children,
	openNavigation,
}: {
	children: ReactNode;
	openNavigation: () => void;
}) {
	const [target, setTarget] = useState<HTMLDivElement | null>(null);
	return (
		<ToolbarContext.Provider value={{ target, setTarget }}>
			<ShellContext.Provider value={openNavigation}>
				{children}
			</ShellContext.Provider>
		</ToolbarContext.Provider>
	);
}

export function DashboardNavigationTrigger() {
	const open = useContext(ShellContext);
	if (!open) return null;
	return (
		<Button
			aria-label="Open navigation"
			aria-haspopup="dialog"
			className="shrink-0 sm:hidden"
			leadingIcon="menu"
			onClick={open}
			size="icon-sm"
			variant="bare"
		/>
	);
}
