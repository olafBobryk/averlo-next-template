import type * as React from "react";

export type AccordionProps = {
	buttonClassName?: string;
	children?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	defaultOpen?: boolean;
	description?: React.ReactNode;
	disabled?: boolean;
	disableWhenReducedMotion?: boolean;
	forceReducedMotion?: boolean;
	icon?: React.ReactNode;
	iconClassName?: string;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	title: React.ReactNode;
	titleClassName?: string;
	triggerClassName?: string;
};

export type AccordionSkeletonProps = {
	className?: string;
	titleClassName?: string;
	triggerClassName?: string;
};
