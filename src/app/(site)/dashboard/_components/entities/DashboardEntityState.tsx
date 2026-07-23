import type { ReactNode } from "react";
import type { IconName } from "@/components/ui/icons/Icon";
import { StateIndicator } from "@/components/ui/misc";

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
		<StateIndicator
			action={action}
			align="center"
			className={className}
			description={description}
			iconClassName="text-muted-foreground"
			iconName={iconName}
			layout="stacked"
			title={title}
			variant="framed"
		/>
	);
}
