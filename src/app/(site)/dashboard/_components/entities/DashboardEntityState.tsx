import clsx from "clsx";
import type { ReactNode } from "react";
import type { IconName } from "@/components/ui/icons/Icon";
import { StateIndicator } from "@/components/ui/misc/state/State";

export function DashboardEntityState({
	action,
	className,
	description,
	iconName,
	title,
}: {
	action?: ReactNode;
	className?: string;
	description: ReactNode;
	iconName: IconName;
	title: ReactNode;
}) {
	return (
		<div
			className={clsx(
				"rounded-lg border border-dashed border-border bg-muted/25 px-5 py-10",
				className,
			)}
		>
			<StateIndicator
				action={action}
				align="center"
				description={description}
				iconClassName="text-muted-foreground"
				iconName={iconName}
				layout="stacked"
				title={title}
			/>
		</div>
	);
}
