"use client";

import { motion, useIsPresent } from "motion/react";
import * as React from "react";
import { useMotionTransition } from "@/components/ui/foundations/MotionProvider";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import Portal from "@/components/ui/overlays/Portal";
import { Float } from "@/components/ui/primitives/surfaces";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export type CommandAnchor = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export function measureCommandAnchor(
	element: HTMLElement | null,
): CommandAnchor {
	const viewport = window.visualViewport;
	const left = viewport?.offsetLeft ?? 0;
	const top = viewport?.offsetTop ?? 0;
	const width = viewport?.width ?? window.innerWidth;
	const height = viewport?.height ?? window.innerHeight;
	const rect = element?.getBoundingClientRect();
	const visible =
		rect &&
		rect.width > 0 &&
		rect.height > 0 &&
		rect.bottom > top &&
		rect.top < top + height;
	return {
		left: visible
			? Math.max(left + 12, Math.min(rect.left, left + width - 46))
			: left + 12,
		top: visible
			? Math.max(top + 12, Math.min(rect.top, top + height - 80))
			: top + 12,
		width: visible ? rect.width : Math.max(0, width - 24),
		height: visible ? rect.height : 34,
	};
}

/** Private command layer: the field stays at its anchor while only its width grows. */
export function DashboardCommandOverlay({
	children,
	resolveAnchor,
	onClose,
}: {
	children: React.ReactNode;
	resolveAnchor: () => HTMLElement | null;
	onClose: () => void;
}) {
	const [anchor, setAnchor] = React.useState(() =>
		measureCommandAnchor(resolveAnchor()),
	);
	const [viewport, setViewport] = React.useState(() => ({
		right:
			(window.visualViewport?.offsetLeft ?? 0) +
			(window.visualViewport?.width ?? window.innerWidth),
		bottom:
			(window.visualViewport?.offsetTop ?? 0) +
			(window.visualViewport?.height ?? window.innerHeight),
	}));
	const present = useIsPresent();
	const allowed = useMotionAllowed(true);
	const off = useMotionDisableOverride();
	const transition = useMotionTransition("disclosure");
	const animate = allowed && !off;
	const root = React.useRef<HTMLDivElement>(null);
	const width = Math.min(560, viewport.right - anchor.left - 12);

	React.useLayoutEffect(() => {
		// Tracking also covers sidebar width transitions and drawer reparenting.
		let frame = 0;
		const update = () => {
			const next = measureCommandAnchor(resolveAnchor());
			setAnchor((current) =>
				Object.keys(next).every(
					(key) =>
						next[key as keyof CommandAnchor] ===
						current[key as keyof CommandAnchor],
				)
					? current
					: next,
			);
			const right =
				(window.visualViewport?.offsetLeft ?? 0) +
				(window.visualViewport?.width ?? window.innerWidth);
			const bottom =
				(window.visualViewport?.offsetTop ?? 0) +
				(window.visualViewport?.height ?? window.innerHeight);
			setViewport((current) =>
				current.right === right && current.bottom === bottom
					? current
					: { right, bottom },
			);
			frame = requestAnimationFrame(update);
		};
		frame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(frame);
	}, [resolveAnchor]);

	React.useEffect(() => {
		const keydown = (event: KeyboardEvent) => {
			if (!present) return;
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopImmediatePropagation();
				onClose();
			} else if (event.key === "Tab") {
				// Capture before an underlying navigation drawer's focus trap.
				event.preventDefault();
				event.stopImmediatePropagation();
				const nodes = Array.from(
					root.current?.querySelectorAll<HTMLElement>(
						'input, button:not([disabled]):not([tabindex="-1"])',
					) ?? [],
				).filter(
					(node) => node.getClientRects().length && !node.closest("[inert]"),
				);
				const index = nodes.indexOf(document.activeElement as HTMLElement);
				nodes[
					(index + (event.shiftKey ? -1 : 1) + nodes.length) % nodes.length
				]?.focus();
			}
		};
		window.addEventListener("keydown", keydown, true);
		return () => window.removeEventListener("keydown", keydown, true);
	}, [onClose, present]);

	return (
		<Portal>
			<div className="fixed inset-0 z-[100]" data-dashboard-command-overlay="">
				<div
					className="absolute inset-0"
					onPointerDown={(event) => {
						event.preventDefault();
						event.stopPropagation();
						onClose();
					}}
					aria-hidden="true"
				/>
				<motion.div
					ref={root}
					role="dialog"
					aria-label="Dashboard commands"
					aria-modal="true"
					aria-hidden={!present || undefined}
					inert={!present || undefined}
					className="absolute"
					style={
						{
							left: anchor.left,
							top: anchor.top,
							"--command-input-height": `${anchor.height}px`,
							"--command-available-height": `${Math.max(48, viewport.bottom - anchor.top - anchor.height - 12)}px`,
						} as React.CSSProperties
					}
					initial={animate ? { width: Math.min(anchor.width, width) } : false}
					animate={{ width }}
					exit={{ width: Math.min(anchor.width, width) }}
					transition={animate ? transition : { duration: 0 }}
				>
					<motion.div
						initial={false}
						animate={{ marginLeft: -8, marginRight: -8, marginTop: -8 }}
						exit={{ marginLeft: 0, marginRight: 0, marginTop: 0 }}
						transition={animate ? transition : { duration: 0 }}
					>
						<Float
							border="none"
							className="!w-full !overflow-visible !rounded-[16px]"
						>
							{children}
						</Float>
					</motion.div>
				</motion.div>
			</div>
		</Portal>
	);
}
