import type * as React from "react";
import { NullState } from "@/components/ui/misc/NullState";

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
			<div className="grid w-full gap-4">
				<NullState copy={description} title={title} />
				{action ? <div className="flex justify-center">{action}</div> : null}
			</div>
		</div>
	);
}
