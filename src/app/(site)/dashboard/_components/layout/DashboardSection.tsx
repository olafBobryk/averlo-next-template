import { Text } from "@/components/ui/primitives/Text";
import { DashboardBreadcrumb } from "../misc/DashboardBreadcrumb";

type DashboardSectionProps = {
	title?: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	breadcrumbLabel?: string;
	breadcrumbLabels?: Record<string, string>;
};

export function DashboardSection({
	title,
	description,
	actions,
	children,
	className,
	contentClassName,
	breadcrumbLabel,
	breadcrumbLabels,
}: DashboardSectionProps) {
	return (
		<section
			className={["flex flex-col gap-6", className].filter(Boolean).join(" ")}
		>
			<DashboardBreadcrumb
				lastSegmentLabel={breadcrumbLabel}
				labelOverrides={breadcrumbLabels}
			/>
			{title || description || actions ? (
				<header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex min-w-0 flex-col gap-2">
						{title ? (
							<Text as="h1" variant="headingLg">
								{title}
							</Text>
						) : null}
						{description ? (
							<Text variant="body" tone="muted">
								{description}
							</Text>
						) : null}
					</div>
					{actions ? (
						<div className="flex flex-wrap items-center gap-2">{actions}</div>
					) : null}
				</header>
			) : null}
			<div className={contentClassName}>{children}</div>
		</section>
	);
}
