"use client";

import clsx from "clsx";
import { StateIndicator, type StateIndicatorProps } from "./State";

export type IdleStateProps = StateIndicatorProps;

export function IdleState({
	title = "Nothing here yet",
	description = "Run an action to load content.",
	iconName,
	iconClassName,
	...rest
}: IdleStateProps) {
	return (
		<StateIndicator
			title={title}
			description={description}
			iconName={iconName}
			iconClassName={clsx("text-foreground/50", iconClassName)}
			{...rest}
		/>
	);
}
