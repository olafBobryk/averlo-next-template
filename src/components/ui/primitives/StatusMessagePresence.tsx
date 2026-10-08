"use client";
import { ContentPresence } from "@/components/ui/motion/presence";
import {
	type StatusMessageProps,
	StatusMessageSurface,
} from "./StatusMessageSurface";
export type StatusMessagePresenceGap = "none" | "sm" | "md";
export type StatusMessagePresenceProps = StatusMessageProps & {
	gap?: StatusMessagePresenceGap;
	open: boolean;
};
const presenceGap = { none: "0rem", sm: "0.75rem", md: "1rem" } as const;
export function StatusMessagePresence({
	gap = "sm",
	open,
	...messageProps
}: StatusMessagePresenceProps) {
	return (
		<ContentPresence open={open} gapBefore={presenceGap[gap]}>
			<StatusMessageSurface {...messageProps} />
		</ContentPresence>
	);
}
