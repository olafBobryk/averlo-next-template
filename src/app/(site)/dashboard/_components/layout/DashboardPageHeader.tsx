import clsx from "clsx";
import type * as React from "react";
import { Text } from "@/components/ui/primitives/Text";

export function DashboardPageHeader({
	action,
	actionClassName,
	description,
	title,
}: {
	action?: React.ReactNode;
	actionClassName?: string;
	description?: React.ReactNode;
	title: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div className="grid min-w-0 gap-1">
				<Text as="h1" className="min-w-0 truncate" variant="headingPage">
					{title}
				</Text>
				{typeof description === "string" ? (
					<Text tone="muted" variant="support">
						{description}
					</Text>
				) : description ? (
					<div className="text-sm leading-6 text-muted-foreground">
						{description}
					</div>
				) : null}
			</div>
			{action ? (
				<div className={clsx("shrink-0", actionClassName)}>{action}</div>
			) : null}
		</div>
	);
}
