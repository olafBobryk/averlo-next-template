import type { ReactNode } from "react";

export function DashboardLoadingStatus({
	children,
	label,
}: {
	children: ReactNode;
	label: string;
}) {
	return (
		<>
			<span className="sr-only" role="status">
				{label}
			</span>
			<div aria-busy="true" data-loading-region={label}>
				{children}
			</div>
		</>
	);
}
