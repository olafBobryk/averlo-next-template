"use client";

import {
	motion,
	type Transition,
	useMotionValue,
	useTransform,
} from "motion/react";
import {
	type ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { spring } from "@/components/ui/foundations/spring";

/** Shared measured reveal for controlled presence and Accordion. */
export function DisclosurePresence({
	open,
	children,
	animate: shouldAnimate,
	axis = "y",
	gapBefore = "0px",
	gapAfter = "0px",
	durationMs,
	id,
	className,
	contentClassName,
	slot,
}: {
	open: boolean;
	children: ReactNode;
	animate: boolean;
	axis?: "x" | "y";
	gapBefore?: string;
	gapAfter?: string;
	durationMs?: number;
	id?: string;
	className?: string;
	contentClassName?: string;
	slot?: string;
}) {
	const contentRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const openRef = useRef(open);
	openRef.current = open;
	const [retained, setRetained] = useState(open);
	const measuredSize = useRef<number>(undefined);
	const [size, setSize] = useState<number>();
	const [settled, setSettled] = useState(open);
	const maskAlpha = useMotionValue(open ? 1 : 0);
	const maskImage = useTransform(
		maskAlpha,
		(alpha) =>
			`linear-gradient(to ${axis === "x" ? "right" : "bottom"}, #000 0%, #000 calc(100% - 16px), rgba(0, 0, 0, ${alpha}) 100%)`,
	);
	const transition = useMemo<Transition>(
		() =>
			durationMs === undefined
				? spring.disclosure
				: {
						type: "spring",
						duration: Math.max(0, durationMs) / 1000,
						bounce: 0,
					},
		[durationMs],
	);
	const dimension = axis === "x" ? "width" : "height";
	const before = axis === "x" ? "marginInlineStart" : "marginTop";
	const after = axis === "x" ? "marginInlineEnd" : "marginBottom";
	const mounted = open || (shouldAnimate && retained);
	const overflowVisible = open && (!shouldAnimate || settled);

	useLayoutEffect(() => {
		if (open) setRetained(true);
		if (!shouldAnimate) {
			setRetained(open);
			setSettled(open);
			maskAlpha.set(open ? 1 : 0);
			return;
		}
		setSettled(false);
		maskAlpha.set(0);
	}, [open, shouldAnimate, maskAlpha]);

	useLayoutEffect(() => {
		if (!open || !shouldAnimate) return;
		const content = contentRef.current;
		if (!content) return;
		const measure = () => {
			const nextSize = content.getBoundingClientRect()[dimension];
			if (
				measuredSize.current !== undefined &&
				Math.abs(measuredSize.current - nextSize) < 0.5
			)
				return;
			measuredSize.current = nextSize;
			setSettled(false);
			maskAlpha.set(0);
			setSize(nextSize);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(content);
		return () => observer.disconnect();
	}, [open, shouldAnimate, dimension, maskAlpha]);

	return (
		<motion.div
			ref={panelRef}
			id={id}
			className={className}
			data-slot={slot}
			data-axis={axis}
			data-open={open || undefined}
			aria-hidden={!open || undefined}
			inert={!open || undefined}
			initial={false}
			animate={{
				[dimension]: open ? (shouldAnimate ? (size ?? "auto") : "auto") : 0,
				[before]: open ? gapBefore : 0,
				[after]: open ? gapAfter : 0,
			}}
			transition={shouldAnimate ? transition : { duration: 0 }}
			onUpdate={(latest) => {
				const target = measuredSize.current;
				const current = Number(latest[dimension]);
				if (!openRef.current || !target || !Number.isFinite(current)) return;
				// Follow the same dimension progress, delayed until the final 2%.
				// No second animation or wait for the spring's settling tail.
				const progress = Math.min(1, current / target);
				maskAlpha.set(Math.max(0, (progress - 0.98) / 0.02));
			}}
			onAnimationComplete={() => {
				if (!openRef.current) {
					setRetained(false);
					setSettled(false);
					return;
				}
				if (
					size === undefined ||
					Math.abs(
						(panelRef.current?.getBoundingClientRect()[dimension] ?? 0) - size,
					) < 1
				) {
					setSettled(true);
				}
			}}
			style={{
				minWidth: 0,
				...(axis === "x" ? { flexShrink: 0 } : {}),
				overflow: overflowVisible ? "visible" : "hidden",
				maskImage: !shouldAnimate || overflowVisible ? "none" : maskImage,
			}}
		>
			{mounted ? (
				<div
					ref={contentRef}
					className={contentClassName}
					style={{
						display: "flow-root",
						...(axis === "x" ? { width: "max-content" } : {}),
					}}
				>
					{children}
				</div>
			) : null}
		</motion.div>
	);
}
