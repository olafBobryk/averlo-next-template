import type * as React from "react";
import type {
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardProps,
	CardTitle,
} from "@/components/ui/primitives/Card";

export type AccordionStateProps = {
	defaultOpen?: boolean;
	disabled?: boolean;
	disableWhenReducedMotion?: boolean;
	forceReducedMotion?: boolean;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
};

export type AccordionProps = AccordionStateProps & {
	buttonClassName?: string;
	children?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	iconClassName?: string;
	title: React.ReactNode;
	titleClassName?: string;
	triggerClassName?: string;
};

export type AccordionSkeletonProps = {
	children?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	description?: React.ReactNode;
	descriptionClassName?: string;
	leadingIcon?: boolean;
	open?: boolean;
	title?: React.ReactNode;
	titleClassName?: string;
	trailingIcon?: boolean;
	triggerClassName?: string;
};

export type AccordionCardProps = Omit<CardProps, "children"> &
	AccordionStateProps & {
		children: React.ReactNode;
	};

export type AccordionHeaderProps = React.ComponentPropsWithoutRef<
	typeof CardHeader
>;

export type AccordionTitleProps = React.ComponentPropsWithoutRef<
	typeof CardTitle
>;

export type AccordionDescriptionProps = React.ComponentPropsWithoutRef<
	typeof CardDescription
>;

export type AccordionActionProps = React.ComponentPropsWithoutRef<
	typeof CardAction
>;

export type AccordionContentProps = React.ComponentPropsWithoutRef<
	typeof CardContent
>;

export type AccordionFooterProps = React.ComponentPropsWithoutRef<
	typeof CardFooter
>;

export type AccordionCardSkeletonProps = Omit<
	AccordionCardProps,
	keyof AccordionStateProps | "children"
> & {
	action?: React.ReactNode;
	actionClassName?: string;
	children?: React.ReactNode;
	contentClassName?: string;
	description?: React.ReactNode;
	descriptionClassName?: string;
	footer?: React.ReactNode;
	footerClassName?: string;
	headerClassName?: string;
	open?: boolean;
	title?: React.ReactNode;
	titleClassName?: string;
	trailingIcon?: boolean;
};
