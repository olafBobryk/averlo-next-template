"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { Button } from "@/components/ui/primitives/Button";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";

/** A CSS length, or a number of pixels. */
type ScrollAreaLength = number | string;

/**
 * Each side absorbs the gap up to its visible edge. There is no default:
 * pass `edge` for both sides, or `edgeStart` and `edgeEnd`.
 */
type ScrollAreaEdges =
	| {
			edge: ScrollAreaLength;
			edgeStart?: ScrollAreaLength;
			edgeEnd?: ScrollAreaLength;
	  }
	| {
			edge?: never;
			edgeStart: ScrollAreaLength;
			edgeEnd: ScrollAreaLength;
	  };

export type ScrollAreaProps = ScrollAreaEdges & {
	as?: React.ElementType;
	axis?: "x" | "y";
	children?: React.ReactNode;
	className?: string;
	/** `fade` masks content under the edge; `border` draws an inset rule. */
	edgeStyle?: "fade" | "border";
	/** Border mode only: classes for the positioned frame around the scroller. */
	frameClassName?: string;
	ref?: React.Ref<HTMLDivElement>;
	scrollbar?: "auto" | "hidden";
	/** Border mode, y axis only: a back-to-top button once the end is reached. */
	showBackToTop?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">;

function toLength(value: ScrollAreaLength | undefined) {
	if (value === undefined) return "0px";
	return typeof value === "number" ? `${value}px` : value;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
	if (!ref) return;
	if (typeof ref === "function") ref(value);
	else ref.current = value;
}

type Overflow = { start: boolean; end: boolean; any: boolean; rtl: boolean };
const NO_OVERFLOW: Overflow = {
	start: false,
	end: false,
	any: false,
	rtl: false,
};

function readOverflow(element: HTMLElement, axis: "x" | "y"): Overflow {
	const scrollSize = axis === "x" ? element.scrollWidth : element.scrollHeight;
	const clientSize = axis === "x" ? element.clientWidth : element.clientHeight;
	const rtl = axis === "x" && getComputedStyle(element).direction === "rtl";
	// RTL horizontal scroll positions run from 0 to a negative maximum.
	const position = Math.abs(
		axis === "x" ? element.scrollLeft : element.scrollTop,
	);
	const any = scrollSize - clientSize > 1;
	return {
		any,
		end: any && position + clientSize < scrollSize - 1,
		rtl,
		start: any && position > 1,
	};
}

/**
 * The inner scroller owner (scroll rules S1–S13). The surface around it stays
 * fixed; the scroller runs to the surface edge, takes the gap as padding and
 * fades (or rules) content only while it is hidden past that edge.
 */
export function ScrollArea({
	as: Tag = "div",
	axis = "y",
	children,
	className,
	edge,
	edgeEnd,
	edgeStart,
	edgeStyle = "fade",
	frameClassName,
	onMouseEnter,
	onMouseLeave,
	onScroll,
	ref,
	scrollbar = "auto",
	showBackToTop = false,
	style,
	...rest
}: ScrollAreaProps) {
	const elementRef = React.useRef<HTMLDivElement | null>(null);
	const [overflow, setOverflow] = React.useState<Overflow>(NO_OVERFLOW);
	const [hovered, setHovered] = React.useState(false);
	const reducedMotionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const motionAllowed = reducedMotionAllowed && !motionDisabled;
	const start = toLength(edgeStart ?? edge);
	const end = toLength(edgeEnd ?? edge);

	const update = React.useCallback(() => {
		const element = elementRef.current;
		if (!element) return;
		const next = readOverflow(element, axis);
		setOverflow((current) =>
			current.start === next.start &&
			current.end === next.end &&
			current.any === next.any &&
			current.rtl === next.rtl
				? current
				: next,
		);
	}, [axis]);

	const setNode = React.useCallback(
		(node: HTMLDivElement | null) => {
			elementRef.current = node;
			assignRef(ref, node);
		},
		[ref],
	);

	// Observe the scroller and its direct children, so content changes that do
	// not resize the scroller itself still update the edges.
	React.useLayoutEffect(() => {
		const element = elementRef.current;
		if (!element) return;
		update();
		if (typeof ResizeObserver === "undefined") return;
		const resize = new ResizeObserver(update);
		const observeChildren = () => {
			resize.disconnect();
			resize.observe(element);
			for (const child of Array.from(element.children)) resize.observe(child);
			update();
		};
		observeChildren();
		const mutation = new MutationObserver(observeChildren);
		mutation.observe(element, { childList: true });
		return () => {
			resize.disconnect();
			mutation.disconnect();
		};
	}, [update]);

	const isY = axis === "y";
	const fadeStart = overflow.start ? start : "0px";
	const fadeEnd = overflow.end ? end : "0px";
	const direction = isY ? "to bottom" : overflow.rtl ? "to left" : "to right";
	const mask =
		edgeStyle === "fade" && (overflow.start || overflow.end)
			? `linear-gradient(${direction}, transparent 0, #000 ${fadeStart}, #000 calc(100% - ${fadeEnd}), transparent 100%)`
			: undefined;

	const scroller = (
		<Tag
			ref={setNode}
			className={clsx(
				"relative min-h-0 min-w-0",
				isY
					? "overflow-y-auto overscroll-y-contain"
					: "overflow-x-auto overscroll-x-contain",
				scrollbar === "hidden" &&
					"[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				"[mask-image:var(--scroll-area-mask)] print:[mask-image:none]",
				// A plain scroller is a focus stop of its own; a role owner (listbox,
				// menu, dialog) keeps its own focus treatment.
				rest.role === undefined && focusRing.visibleInner,
				className,
			)}
			data-scroll-area={axis}
			data-scroll-edge-start={overflow.start || undefined}
			data-scroll-edge-end={overflow.end || undefined}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onScroll={(event: React.UIEvent<HTMLDivElement>) => {
				update();
				onScroll?.(event);
			}}
			style={{
				...(isY
					? { paddingBottom: end, paddingTop: start }
					: { paddingInlineEnd: end, paddingInlineStart: start }),
				["--scroll-area-mask" as string]: mask ?? "none",
				...style,
			}}
			{...rest}
		>
			{children}
		</Tag>
	);

	if (edgeStyle === "fade") return scroller;

	// Border mode: the rule is an overlay on a frame around the scroller, so it
	// never changes the box and is never painted over by scrolled content.
	const rule = "pointer-events-none absolute z-10 bg-border";
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover only reveals the back-to-top control, which stays a focusable button.
		<div
			className={clsx("relative flex min-h-0 min-w-0 flex-col", frameClassName)}
			data-scroll-area-frame=""
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{scroller}
			{overflow.start ? (
				<span
					aria-hidden
					data-scroll-rule="start"
					className={clsx(
						rule,
						isY
							? "inset-x-0 top-0 h-px"
							: "inset-y-0 w-px ltr:left-0 rtl:right-0",
					)}
				/>
			) : null}
			{overflow.end ? (
				<span
					aria-hidden
					data-scroll-rule="end"
					className={clsx(
						rule,
						isY
							? "inset-x-0 bottom-0 h-px"
							: "inset-y-0 w-px ltr:right-0 rtl:left-0",
					)}
				/>
			) : null}
			<AnimatePresence initial={false}>
				{isY && showBackToTop && hovered && overflow.any && !overflow.end ? (
					<motion.div
						className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={motionAllowed ? spring.quick : instantTransition}
					>
						<Button
							aria-label="Back to top"
							hitArea="touch"
							leadingIcon="arrow-up"
							onClick={() =>
								elementRef.current?.scrollTo({
									behavior: motionAllowed ? "smooth" : "auto",
									top: 0,
								})
							}
							size="icon-sm"
							title="Back to top"
							variant="primary"
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
