import clsx from "clsx";
import type { ReactNode } from "react";
import type { DashboardLayoutWidth } from "../../_registry/surfaceRegistry";
import { DashboardScrollRestoration } from "./DashboardScrollRestoration";
import { DashboardToolbarVisibility } from "./DashboardShellContext";

import { dashboardContentShellProfiles } from "./dashboardContentShellProfiles";

export { dashboardContentShellProfiles } from "./dashboardContentShellProfiles";

export function DashboardContentShell({
	children,
	layoutWidth,
	overlay,
}: {
	children: ReactNode;
	layoutWidth: DashboardLayoutWidth;
	overlay?: ReactNode;
}) {
	const profile = dashboardContentShellProfiles[layoutWidth];
	return (
		<main
			className={clsx(
				"flex h-full w-full flex-col bg-background outline-none",
				profile.mainClassName,
				profile.gutterClassName,
			)}
			data-dashboard-layout={layoutWidth}
			id="dashboard-main"
			tabIndex={-1}
		>
			<DashboardScrollRestoration enabled={layoutWidth !== "workspace"} />
			<div className={clsx("relative min-w-0", profile.contentClassName)}>
				<div
					aria-hidden={overlay ? true : undefined}
					className={clsx(
						"min-w-0",
						profile.bodyClassName,
						overlay && "invisible pointer-events-none",
					)}
				>
					<DashboardToolbarVisibility visible={!overlay}>
						{children}
					</DashboardToolbarVisibility>
				</div>
				{overlay ? (
					<div className="absolute inset-0 bg-background">{overlay}</div>
				) : null}
			</div>
		</main>
	);
}
