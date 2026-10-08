"use client";

import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { ModalCard } from "@/components/ui/overlays/modal/ModalCard";
import { ModalShell } from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/surfaces";

import { useDashboardHistory } from "./useDashboardHistory";

export type DashboardSidebarShellProps = {
	body: ReactNode;
	brand: ReactNode;
	identity?: ReactNode;
	collapsed: boolean;
	footer: ReactNode;
	mobileOpen: boolean;
	onCollapsedChange: (collapsed: boolean) => void;
	onMobileOpenChange: (open: boolean) => void;
};
export function getDashboardSidebarOffsetClassNames(collapsed: boolean) {
	return {
		content: clsx(
			"h-dvh min-w-0 bg-surface transition-[padding] motion-macro sm:pl-[64px]",
			collapsed ? "lg:pl-[64px]" : "lg:pl-[240px]",
		),
	};
}
export function DashboardSidebarShell({
	body,
	brand,
	identity,
	collapsed,
	footer,
	mobileOpen,
	onCollapsedChange,
	onMobileOpenChange,
}: DashboardSidebarShellProps) {
	const router = useRouter();
	const navigationButton = useRef<HTMLButtonElement>(null);
	const historyAvailability = useDashboardHistory();
	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 1024px)");
		const closeOnDesktop = () => {
			if (desktop.matches) onMobileOpenChange(false);
		};
		desktop.addEventListener("change", closeOnDesktop);
		return () => desktop.removeEventListener("change", closeOnDesktop);
	}, [onMobileOpenChange]);
	const content = (
		<>
			<div
				className={clsx(
					"flex shrink-0 items-center gap-2 py-3",
					mobileOpen ? "px-6" : collapsed ? "px-3" : "px-3 lg:px-6",
					!mobileOpen && "max-lg:flex-col max-lg:pt-0",
					collapsed && !mobileOpen && "lg:flex-col lg:pt-0",
				)}
				data-dashboard-sidebar-header
			>
				<div
					className={clsx(
						"flex shrink-0 items-center justify-center",
						!mobileOpen && "max-lg:h-12",
						collapsed && !mobileOpen && "lg:h-12",
					)}
				>
					{brand}
				</div>
				<div
					className={clsx(
						"ml-auto flex items-center gap-0.5",
						!mobileOpen && "max-lg:hidden",
						collapsed && !mobileOpen && "lg:hidden",
					)}
				>
					<Button
						aria-label="Go back"
						disabled={!historyAvailability.back}
						className="!text-muted-foreground disabled:!text-muted-foreground/40 disabled:!opacity-100"
						title="Go back"
						variant="ghost"
						size="xs"
						shape="square"
						leadingIcon="caret-left"
						iconSize={15}
						onClick={() => router.back()}
					/>
					<Button
						aria-label="Go forward"
						disabled={!historyAvailability.forward}
						className="!text-muted-foreground disabled:!text-muted-foreground/40 disabled:!opacity-100"
						title="Go forward"
						variant="ghost"
						size="xs"
						shape="square"
						leadingIcon="caret-right"
						iconSize={15}
						onClick={() => router.forward()}
					/>
				</div>
				<Button
					ref={mobileOpen ? undefined : navigationButton}
					aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
					aria-expanded={mobileOpen}
					aria-haspopup={mobileOpen ? undefined : "dialog"}
					className="shrink-0 lg:hidden"
					leadingIcon={mobileOpen ? "close" : "menu"}
					iconSize={15}
					onClick={() => onMobileOpenChange(!mobileOpen)}
					size="xs"
					shape="square"
					variant="ghost"
				/>
				<Button
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					aria-expanded={!collapsed}
					className="shrink-0 max-lg:hidden"
					leadingIcon={collapsed ? "menu" : "sidebar-collapse"}
					iconSize={15}
					onClick={() => onCollapsedChange(!collapsed)}
					size="xs"
					shape="square"
					variant="ghost"
				/>
			</div>
			<div
				className={clsx(
					"px-3 pb-3",
					!mobileOpen && "max-lg:hidden",
					collapsed && !mobileOpen && "lg:hidden",
				)}
				data-dashboard-sidebar-organization
				hidden={!identity}
			>
				{identity}
			</div>
			<div
				className="-mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3 pt-1"
				data-dashboard-sidebar-body
			>
				{body}
			</div>
			<footer className="shrink-0" data-dashboard-sidebar-footer>
				<Divider />
				<div className="px-3 py-2">{footer}</div>
			</footer>
		</>
	);
	return (
		<>
			<Panel
				as="aside"
				background="panel"
				border="none"
				className={clsx(
					"fixed inset-y-0 left-0 z-40 !hidden !w-[64px] transition-[width] motion-macro",
					!mobileOpen && "sm:!flex",
					collapsed ? "lg:!w-[64px]" : "lg:!w-[240px]",
				)}
				data-shell-surface="dashboard-sidebar"
				display="flex"
				gap="none"
				id="dashboard-sidebar"
				overflow="hidden"
				padding="none"
				radius="none"
				width="auto"
			>
				{!mobileOpen ? content : null}
			</Panel>
			<AnimatePresence
				onExitComplete={() => {
					if (!mobileOpen && !document.querySelector('[role="dialog"]')) {
						navigationButton.current?.focus({ preventScroll: true });
					}
				}}
			>
				{mobileOpen ? (
					<ModalShell
						ariaLabel="Dashboard navigation"
						onClose={() => onMobileOpenChange(false)}
						placement="left"
						panelDirection="left"
						animate={{ scale: false }}
					>
						<ModalCard
							background="panel"
							className="h-full"
							radius="none"
							border="none"
						>
							{content}
						</ModalCard>
					</ModalShell>
				) : null}
			</AnimatePresence>
		</>
	);
}
