"use client";

import type { ReactNode } from "react";
import { useAnimated } from "@/hooks/useMotionAllowed";
import { DisclosurePresence, type PresenceMode } from "./DisclosurePresence";

export type { PresenceMode };

export type ContentPresenceProps = {
	open: boolean;
	children: ReactNode;
	/**
	 * `masked` (default) keeps content opaque behind a soft moving edge;
	 * `sequenced` never clips or overlaps a visible glyph: the box grows first
	 * and the content fades in once it fits; closing, the content fades out
	 * first and then the box collapses.
	 */
	mode?: PresenceMode;
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
	const animated = useAnimated();
	return (
		<DisclosurePresence {...props} animate={animated} slot="content-presence" />
	);
}
