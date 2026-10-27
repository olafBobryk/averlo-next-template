"use client";

import type { ReactNode } from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { DisclosurePresence } from "./DisclosurePresence";

export type ContentPresenceProps = {
	open: boolean;
	children: ReactNode;
	axis?: "x" | "y";
	gapBefore?: string;
	gapAfter?: string;
	/** @deprecated Content follows the shared reveal without translation. */
	offsetY?: number;
	/** Layout reveal duration in milliseconds; reduced motion remains immediate. */
	durationMs?: number;
	id?: string;
	className?: string;
};

export function ContentPresence({
	offsetY: _offsetY,
	...props
}: ContentPresenceProps) {
	const allowed = useMotionAllowed(true);
	const disabled = useMotionDisableOverride();
	return (
		<DisclosurePresence
			{...props}
			animate={allowed && !disabled}
			slot="content-presence"
		/>
	);
}
