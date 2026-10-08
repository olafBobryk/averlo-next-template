"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Card } from "./surfaces";
import { ContentPresence } from "@/components/ui/motion/presence";

export type InlineErrorProps = {
	open?: boolean;
	variant?: "inline" | "card";
	children: ReactNode;
	action?: ReactNode;
	className?: string;
	id?: string;
};

export function InlineError({
	open = true,
	variant = "inline",
	children,
	action,
	className,
	id,
}: InlineErrorProps) {
	const content = (
		<div className="text-sm text-[var(--button-danger-text)] [overflow-wrap:anywhere]">
			<span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
			{action && (
				<span className="ms-2 inline-flex align-baseline">{action}</span>
			)}
		</div>
	);
	return (
		<ContentPresence
			open={open}
			gapAfter={variant !== "inline" ? "12px" : "0px"}
		>
			{variant !== "inline" ? (
				<Card
					id={id}
					role="alert"
					padding="none"
					className={clsx("p-3", className)}
				>
					{content}
				</Card>
			) : (
				<div id={id} role="alert" className={clsx("py-3", className)}>
					{content}
				</div>
			)}
		</ContentPresence>
	);
}
