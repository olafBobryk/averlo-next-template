import clsx from "clsx";
import { Text } from "@/components/ui/primitives/Text";
import type {
	DashboardDetailFieldProps,
	DashboardDetailFieldSkeletonProps,
} from "./DashboardDetailField.shared";
import { DashboardDetailFieldClient } from "./DashboardDetailFieldClient";

function DashboardDetailFieldRoot(props: DashboardDetailFieldProps) {
	return <DashboardDetailFieldClient {...props} />;
}

function DashboardDetailFieldSkeleton({
	className,
	icon,
	label,
	truncateValue = true,
	value = "Account detail",
}: DashboardDetailFieldSkeletonProps) {
	return (
		<div className={clsx("grid min-w-0 gap-2", className)}>
			<dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				{icon}
				{label}
			</dt>
			<dd className="min-w-0">
				<Text.Skeleton
					as="span"
					className={clsx(
						"max-w-52 text-sm font-medium",
						truncateValue && "truncate",
					)}
					tone={null}
					variant={null}
				>
					{value}
				</Text.Skeleton>
			</dd>
		</div>
	);
}

export const DashboardDetailField = Object.assign(DashboardDetailFieldRoot, {
	Skeleton: DashboardDetailFieldSkeleton,
});

export type { DashboardDetailFieldProps, DashboardDetailFieldSkeletonProps };
