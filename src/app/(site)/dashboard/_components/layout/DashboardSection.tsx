import { Text } from "@/components/ui/primitives/Text";
import { DashboardPageHeader } from "./DashboardPageHeader";

export function DashboardSection({
	actions,
	children,
	className,
	contentClassName,
	description,
	title,
}: {
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	description?: React.ReactNode;
	title?: React.ReactNode;
}) {
	return (
		<section
			className={["min-w-0", className].filter(Boolean).join(" ")}
			data-dashboard-section
		>
			{title ? <DashboardPageHeader action={actions} title={title} /> : null}
			<div className="dashboard-page-body mx-auto w-full min-w-0 px-3 py-5 sm:px-5 sm:py-6">
				{description ? (
					<div className="mb-5">
						<Text tone="muted" variant="support">
							{description}
						</Text>
					</div>
				) : null}
				<div
					className={["min-w-0", contentClassName].filter(Boolean).join(" ")}
				>
					{children}
				</div>
			</div>
		</section>
	);
}
