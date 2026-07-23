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
	labelClassName?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	truncateValue?: boolean;
	value: ReactNode;
	valueClassName?: string;
};

export type DashboardDetailFieldSkeletonProps = Omit<
	DashboardDetailFieldProps,
	| "actionLabel"
	| "copyLabel"
	| "copyValue"
	| "disabled"
	| "href"
	| "onClick"
	| "value"
> & {
	children?: ReactNode;
	copyable?: boolean;
	value?: ReactNode;
};
