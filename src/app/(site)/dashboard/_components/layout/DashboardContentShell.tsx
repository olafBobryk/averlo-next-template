import clsx from "clsx";
import type { ReactNode } from "react";
import type { DashboardLayoutWidth } from "../../_registry/surfaceRegistry";
import { DashboardScrollRestoration } from "./DashboardScrollRestoration";
import { DashboardToolbarVisibility } from "./DashboardShellContext";

type DashboardContentShellProfile = {
	bodyClassName: string;
	contentClassName: string;
	gutterClassName: string;
	mainClassName: string;
};

const dashboardPageGutterClassName = "px-0";

export const dashboardContentShellProfiles = {
	standard: {
		bodyClassName: "",
		contentClassName: "min-h-full",
		gutterClassName: dashboardPageGutterClassName,
		mainClassName: "min-h-0 overflow-y-auto [&_.dashboard-page-body]:max-w-6xl",
	},
	wide: {
		bodyClassName: "",
		contentClassName: "min-h-full",
		gutterClassName: dashboardPageGutterClassName,
		mainClassName: "min-h-0 overflow-y-auto",
	},
	workspace: {
		bodyClassName: "h-full",
		contentClassName: "min-h-0 flex-1",
		gutterClassName: "px-0",
		mainClassName: "min-h-0 overflow-hidden",
	},
} as const satisfies Record<DashboardLayoutWidth, DashboardContentShellProfile>;

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
