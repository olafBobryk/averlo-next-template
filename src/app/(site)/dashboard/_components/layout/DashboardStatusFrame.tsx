import type * as React from "react";
import { StateIndicator } from "@/components/ui/misc";

export function DashboardStatusFrame({
	action,
	description,
	title,
}: {
	action?: React.ReactNode;
	description: string;
	title: string;
}) {
	return (
		<div
			className="grid min-h-[28rem] place-items-center"
			data-slot="dashboard-status-frame"
		>
			<StateIndicator
				action={action}
				align="center"
				className="mx-auto max-w-xl"
				description={description}
				descriptionClassName="max-w-md"
				layout="stacked"
				title={title}
			/>
		</div>
	);
}
