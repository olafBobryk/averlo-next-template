"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import {
	DashboardNavigationTrigger,
	useDashboardToolbarTarget,
	useDashboardToolbarVisible,
} from "./DashboardShellContext";

export type DashboardWorkspaceToolbarProps = {
	title?: ReactNode;
	breadcrumb?: ReactNode;
	actions?: ReactNode;
	secondaryControls?: ReactNode;
	children?: ReactNode;
	className?: string;
};

export function DashboardWorkspaceToolbar({
	title,
	breadcrumb,
	actions,
	secondaryControls,
	children,
	className,
}: DashboardWorkspaceToolbarProps) {
	const target = useDashboardToolbarTarget();
	const visible = useDashboardToolbarVisible();
	const toolbar = (
		<Panel
			as="header"
			background="panel"
			border="none"
			radius="none"
			padding="none"
			gap="none"
			display="block"
			className={clsx("sticky top-0 z-20 shrink-0", className)}
			data-shell-surface="dashboard-header"
		>
			<div
				className="flex min-h-12 min-w-0 items-center gap-2 px-3 sm:px-5"
				data-dashboard-toolbar-row
			>
				<div className="sm:hidden">
					<DashboardNavigationTrigger />
				</div>
				{children ?? (
					<>
						<div className="flex min-w-0 flex-1 items-center gap-2">
							{breadcrumb ? (
								<div className="hidden min-w-0 max-w-[40%] items-center gap-2 md:flex empty:!hidden">
									{breadcrumb}
								</div>
							) : null}
							<h1
								className="min-w-0 truncate text-sm font-medium"
								title={typeof title === "string" ? title : undefined}
							>
								{title}
							</h1>
						</div>
						{actions ? (
							<div
								className="flex shrink-0 flex-wrap items-center justify-end gap-1"
								data-dashboard-toolbar-actions
							>
								{actions}
							</div>
						) : null}
					</>
				)}
			</div>
			{secondaryControls ? (
				<div className="flex min-w-0 flex-wrap items-center gap-2 px-3 pb-2 sm:px-5">
					{secondaryControls}
				</div>
			) : null}
		</Panel>
	);
	return visible ? (target ? createPortal(toolbar, target) : toolbar) : null;
}

DashboardWorkspaceToolbar.Skeleton =
	function DashboardWorkspaceToolbarSkeleton({
		title = "Dashboard page",
		actions,
		breadcrumb,
	}: Pick<DashboardWorkspaceToolbarProps, "title" | "actions" | "breadcrumb">) {
		return (
			<DashboardWorkspaceToolbar
				breadcrumb={breadcrumb}
				title={
					<>
						<span className="sr-only">Loading {title}</span>
						<Text.Skeleton as="span" variant="support">
							{title}
						</Text.Skeleton>
					</>
				}
				actions={actions}
			/>
		);
	};
