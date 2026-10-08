import type { ReactNode } from "react";
import { DashboardSurfaceTrail } from "./DashboardSurfaceTrail";
import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";

type HeaderProps = {
	action?: ReactNode;
	actionClassName?: string;
	description?: ReactNode;
	title: ReactNode;
};
function DashboardPageHeaderRoot({
	action,
	actionClassName,
	title,
}: HeaderProps) {
	return (
		<DashboardWorkspaceToolbar
			title={title}
			breadcrumb={<DashboardSurfaceTrail />}
			actions={
				action ? <div className={actionClassName}>{action}</div> : undefined
			}
		/>
	);
}
function DashboardPageHeaderSkeleton({
	action,
	title = "Dashboard page",
}: Partial<HeaderProps>) {
	return (
		<DashboardWorkspaceToolbar.Skeleton
			title={title}
			breadcrumb={<DashboardSurfaceTrail />}
			actions={action}
		/>
	);
}
export const DashboardPageHeader = Object.assign(DashboardPageHeaderRoot, {
	Skeleton: DashboardPageHeaderSkeleton,
});
