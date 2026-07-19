import type { MouseEventHandler, ReactNode } from "react";

export type DashboardDetailFieldProps = {
	actionLabel?: string;
	className?: string;
	copyLabel?: string;
	copyValue?: string | null;
	disabled?: boolean;
	href?: string;
	icon?: ReactNode;
	label: ReactNode;
	onClick?: MouseEventHandler<HTMLElement>;
	truncateValue?: boolean;
	value: ReactNode;
};

export type DashboardDetailFieldSkeletonProps = Pick<
	DashboardDetailFieldProps,
	"className" | "icon" | "label" | "truncateValue"
> & {
	value?: ReactNode;
};
