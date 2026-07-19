import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import { DashboardPageHeader } from "./DashboardPageHeader";

export function DashboardSection({
	actions,
	breadcrumbLabel,
	children,
	className,
	contentClassName,
	description,
	title,
}: {
	actions?: React.ReactNode;
	breadcrumbLabel?: string;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	description?: React.ReactNode;
	title?: React.ReactNode;
}) {
	return (
		<section className={["grid gap-5", className].filter(Boolean).join(" ")}>
			<DashboardBreadcrumbs lastLabel={breadcrumbLabel} />
			{title ? (
				<DashboardPageHeader
					action={actions}
					description={description}
					title={title}
				/>
			) : null}
			<div className={contentClassName}>{children}</div>
		</section>
	);
}
