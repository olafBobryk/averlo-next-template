"use client";

import { AnimatePresence, motion } from "motion/react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useMotionTransition } from "@/components/ui/foundations/MotionProvider";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

export type ContentPresenceProps = {
	open: boolean;
	children: ReactNode;
	axis?: "x" | "y";
	gapBefore?: string;
	gapAfter?: string;
	offsetY?: number;
	id?: string;
	className?: string;
};

export function ContentPresence({
	open,
	children,
	axis = "y",
	gapBefore = "0px",
	gapAfter = "0px",
	offsetY = 0,
	id,
	className,
}: ContentPresenceProps) {
	const allowed = useMotionAllowed(true);
	const disabled = useMotionDisableOverride();
	const motionAllowed = allowed && !disabled;
	const transition = useMotionTransition("disclosure", {
		intensity: "subtle",
		surface: "flat",
	});
	const fade = useMotionTransition("feedback", {
		intensity: "subtle",
		surface: "flat",
	});
	const [node, setNode] = useState<HTMLDivElement | null>(null);
	const [size, setSize] = useState<number>();
	const [settled, setSettled] = useState(open);
	const openRef = useRef(open);
	openRef.current = open;
	const measureRef = useCallback(
		(element: HTMLDivElement | null) => setNode(element),
		[],
	);

	useEffect(() => {
		if (!node || !motionAllowed) return;
		const measure = () =>
			setSize(
				axis === "x"
					? node.getBoundingClientRect().width
					: node.getBoundingClientRect().height,
			);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, [node, axis, motionAllowed]);

	const dimension = axis === "x" ? "width" : "height";
	const before = axis === "x" ? "marginInlineStart" : "marginTop";
	const after = axis === "x" ? "marginInlineEnd" : "marginBottom";
	const style = { minWidth: 0, ...(axis === "x" ? { flexShrink: 0 } : {}) };

	if (!motionAllowed) {
		return (
			<div
				id={id}
				className={className}
				data-slot="content-presence"
				data-axis={axis}
				data-open={open || undefined}
				aria-hidden={!open || undefined}
				inert={!open || undefined}
				style={{
					...style,
					[before]: open ? gapBefore : 0,
					[after]: open ? gapAfter : 0,
				}}
			>
				{open ? children : null}
			</div>
		);
	}

	return (
		<motion.div
			id={id}
			className={className}
			data-slot="content-presence"
			data-axis={axis}
			data-open={open || undefined}
			aria-hidden={!open || undefined}
			inert={!open || undefined}
			initial={false}
			animate={{
				[dimension]: open ? (size ?? "auto") : 0,
				[before]: open ? gapBefore : 0,
				[after]: open ? gapAfter : 0,
			}}
			transition={{
				...transition,
				delay: open ? 0 : Number(fade.duration ?? 0),
			}}
			onAnimationStart={() => setSettled(false)}
			onAnimationComplete={() => setSettled(openRef.current)}
			style={{ ...style, overflow: open && settled ? "visible" : "hidden" }}
		>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="content"
						ref={measureRef}
						style={{
							display: "flow-root",
							...(axis === "x" ? { width: "max-content" } : {}),
						}}
						initial={{ opacity: 0, y: offsetY }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -offsetY, transition: fade }}
						transition={{
							...fade,
							delay: Number(transition.duration ?? 0) * 0.75,
						}}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
