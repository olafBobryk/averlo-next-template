"use client";

import {
	motion,
	type Transition,
	useMotionValue,
	useTransform,
} from "motion/react";
import {
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { spring } from "@/components/ui/foundations/spring";

/**
 * - `masked` (default): continuous opaque content behind a 16px soft edge.
 * - `sequenced`: a visible glyph is never clipped and never overlaps what
 *   follows. Opening, the size grows first and the content fades in once the
 *   box fits it; closing, the content fades out first and then the size
 *   closes. Content is clipped only while fully transparent.
 */
export type PresenceMode = "masked" | "sequenced";

/** Sequenced closing: the size starts closing once the content is this faint. */
const FADED_OPACITY = 0.05;
/** Sub-pixel tolerance for "the box fits the content". */
const FIT_TOLERANCE_PX = 0.5;

/** Shared measured reveal for controlled presence and Accordion. */
export function DisclosurePresence({
	open,
	children,
	animate: shouldAnimate,
	mode = "masked",
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
	mode?: PresenceMode;
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
	const masked = mode === "masked";
	const sequenced = mode === "sequenced";
	const overflowVisible = open && (!shouldAnimate || settled);
	// Springs drive every property; the fade uses the feedback spring.
	const fade = spring.feedback;
	const sizeTransition: Transition = shouldAnimate
		? transition
		: { duration: 0 };
	// Sequenced opening shows the content only once the box fits it.
	const [fits, setFits] = useState(open);
	const fitsRef = useRef(fits);
	fitsRef.current = fits;
	// Content that outgrows a settled box hides at once, then fades back in.
	const hideInstantly = useRef(false);
	const contentTransition: Transition =
		!shouldAnimate || hideInstantly.current ? { duration: 0 } : fade;
	// Sequenced closing holds the open size until the content has faded out.
	const [faded, setFaded] = useState(!open);
	const fadedRef = useRef(false);
	fadedRef.current = faded;
	const holdSize = sequenced && !open && shouldAnimate && retained && !faded;
	// Sequenced content that outgrows its box hides before the next paint and
	// fades back in once the box fits it again.
	const hideOutgrown = useCallback(() => {
		if (!fitsRef.current) return;
		hideInstantly.current = true;
		fitsRef.current = false;
		if (contentRef.current) contentRef.current.style.opacity = "0";
		setFits(false);
	}, []);
	useLayoutEffect(() => {
		if (!sequenced || !open || !shouldAnimate) return;
		const target = measuredSize.current;
		const content = contentRef.current;
		if (target === undefined || !content) return;
		if (content.getBoundingClientRect()[dimension] > target + FIT_TOLERANCE_PX)
			hideOutgrown();
	});
	const markFits = useCallback(() => {
		if (fitsRef.current || !openRef.current) return;
		fitsRef.current = true;
		hideInstantly.current = false;
		setFits(true);
	}, []);
	// Content mounted by an opening transition starts transparent; content
	// present on first render does not animate in.
	const firstRender = useRef(true);
	const contentInitial =
		masked || !shouldAnimate || firstRender.current ? false : { opacity: 0 };

	useLayoutEffect(() => {
		if (open) {
			setRetained(true);
			setFaded(false);
		}
		if (!shouldAnimate) {
			setRetained(open);
			setSettled(open);
			setFits(open);
			maskAlpha.set(open ? 1 : 0);
			return;
		}
		// Content present on first render is already in place.
		if (!firstRender.current || !open) {
			fitsRef.current = false;
			setFits(false);
		}
		setSettled(false);
		maskAlpha.set(0);
	}, [open, shouldAnimate, maskAlpha]);
	useLayoutEffect(() => {
		firstRender.current = false;
	}, []);

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
			const outgrown =
				measuredSize.current !== undefined && nextSize > measuredSize.current;
			measuredSize.current = nextSize;
			if (sequenced && outgrown) hideOutgrown();
			setSettled(false);
			maskAlpha.set(0);
			setSize(nextSize);
		};
		measure();
		// A box already at its size (a reversed close) fits without moving.
		const current = panelRef.current?.getBoundingClientRect()[dimension] ?? 0;
		if (
			sequenced &&
			measuredSize.current !== undefined &&
			current >= measuredSize.current - FIT_TOLERANCE_PX
		)
			markFits();
		const observer = new ResizeObserver(measure);
		observer.observe(content);
		return () => observer.disconnect();
	}, [
		open,
		shouldAnimate,
		dimension,
		maskAlpha,
		sequenced,
		markFits,
		hideOutgrown,
	]);

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
				[dimension]:
					open || holdSize ? (shouldAnimate ? (size ?? "auto") : "auto") : 0,
				[before]: open || holdSize ? gapBefore : 0,
				[after]: open || holdSize ? gapAfter : 0,
			}}
			transition={sizeTransition}
			onUpdate={(latest) => {
				const target = measuredSize.current;
				const current = Number(latest[dimension]);
				if (!openRef.current || !target || !Number.isFinite(current)) return;
				if (sequenced) {
					if (current >= target - FIT_TOLERANCE_PX) markFits();
					return;
				}
				// Follow the same dimension progress, delayed until the final 2%.
				// No second animation or wait for the spring's settling tail.
				const progress = Math.min(1, current / target);
				maskAlpha.set(Math.max(0, (progress - 0.98) / 0.02));
			}}
			onAnimationComplete={() => {
				if (!openRef.current) {
					// A held sequenced size has not started closing yet.
					if (sequenced && shouldAnimate && !fadedRef.current) return;
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
					markFits();
					setSettled(true);
				}
			}}
			style={{
				minWidth: 0,
				...(axis === "x" ? { flexShrink: 0 } : {}),
				overflow: overflowVisible ? "visible" : "hidden",
				maskImage:
					!masked || !shouldAnimate || overflowVisible ? "none" : maskImage,
			}}
		>
			{mounted ? (
				<motion.div
					ref={contentRef}
					className={contentClassName}
					initial={contentInitial}
					animate={masked ? undefined : { opacity: open && fits ? 1 : 0 }}
					transition={contentTransition}
					onUpdate={
						sequenced
							? (latest) => {
									if (
										!openRef.current &&
										Number(latest.opacity) <= FADED_OPACITY
									)
										setFaded(true);
								}
							: undefined
					}
					onAnimationComplete={
						sequenced
							? () => {
									if (!openRef.current) setFaded(true);
								}
							: undefined
					}
					style={{
						display: "flow-root",
						...(axis === "x" ? { width: "max-content" } : {}),
					}}
				>
					{children}
				</motion.div>
			) : null}
		</motion.div>
	);
}
